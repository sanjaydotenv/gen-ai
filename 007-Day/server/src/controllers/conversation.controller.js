import { ConversationModel } from "../models/Conversation.model.js";
import { generateTitle, model } from "../services/ai/generateTitle.js";
import { MessageModel } from "../models/message.model.js";
import { AIMessage, HumanMessage } from "langchain";

// Import these according to your project structure
// import { AppError } from "../utils/AppError.js";
// import { model } from "../services/ai/model.js";
// import { createMessage } from "../services/message.service.js";
const createMessage = async ({ role, content, conversation }) => {
  return await MessageModel.create({
    role,
    content,
    conversation,
  });
};
const handleMessage = async (req, res, next) => {
  try {
    const { content, conversation: conversationId } = req.body;
    const user = req.user;

    let conversation = null;

    // 1. Create or fetch conversation
    if (!conversationId) {
      const result = await generateTitle(content);

      // Extract title from AI response object
      const title = typeof result === "string" ? result : result.title;

      conversation = await ConversationModel.create({
        user: user._id,
        title,
      });
    } else {
      conversation = await ConversationModel.findOne({
        _id: conversationId,
        user: user._id,
      });

      if (!conversation) {
        return next(new AppError(404, "Conversation not found"));
      }
    }

    // 2. Fetch previous messages
    const previousMessages = await MessageModel.find({
      conversation: conversation._id,
    }).sort({ createdAt: 1 });

    // 3. Convert messages into LangChain message objects
    const messages = previousMessages
      .map((msg) => {
        if (msg.role === "user") {
          return new HumanMessage(msg.content);
        }

        if (msg.role === "assistant") {
          return new AIMessage(msg.content);
        }

        return null;
      })
      .filter(Boolean);

    // 4. Add current user message
    messages.push(new HumanMessage(content));

    // 5. Save user message
    await createMessage({
      role: "user",
      content,
      conversation: conversation._id,
    });

    // 6. Generate AI response stream
    const stream = await model.stream(messages);

    // 7. Set SSE headers
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    // 8. Send conversation details
    res.write(
      `data: ${JSON.stringify({
        conversationId: conversation._id,
        title: conversation.title,
      })}\n\n`,
    );

    // 9. Stream AI response
    let aiChunk = null;

    for await (const chunk of stream) {
      if (aiChunk === null) {
        aiChunk = chunk;
      } else {
        aiChunk = aiChunk.concat(chunk);
      }

      res.write(
        `data: ${JSON.stringify({
          chunk: chunk.content,
        })}\n\n`,
      );
    }

    // 10. Save complete AI response
    if (aiChunk) {
      await createMessage({
        role: "assistant",
        content: aiChunk.content,
        conversation: conversation._id,
      });
    }

    // 11. End SSE connection
    res.end();
  } catch (error) {
    if (res.headersSent) {
      res.end();
      return;
    }

    next(error);
  }
};

const getAllConversations = async (req, res) => {
  const user = req.user;

  console.log(user);
  const conversations = await ConversationModel.findOne({ user: user._id });

  if (!conversations) {
    res.status(404).json({
      message: "Conversation not found",
    });
  }

  return res.status(200).json({
    message: "Conversation fetched successfully",
    conversations,
  });
};

const getAllMessages = async (req, res) => {
  const { conversationId } = req.params;

  console.log(conversationId)

  if (!conversationId) {
    return res.status(404).json({
      message: "Conversation ID is not found in params",
    });
  }

  const messages = await MessageModel.find({ conversation: conversationId });

  console.log(messages)

  if (!messages) {
    return res.status(404).json({
      message: "Messages is not found",
    });
  }

  res.status(200).json({
    message: "All Messages Fetch Suuccessfully",
    messages
  });
};

export default { handleMessage, getAllConversations, getAllMessages };
