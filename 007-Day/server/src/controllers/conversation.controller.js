import { ConversationModel } from "../models/Conversation.model";
import { generateTitle } from "../services/ai/generateTitle.js";

const handleMessage = async (req, res, next) => {
  const { content, conversation: conversationId } = req.body;
  const user = req.user;

  let conversation = null

  if (!conversationId){

    const title = await generateTitle(content)

    conversation = ConversationModel.create({user: user.userId , title})
  }

};
