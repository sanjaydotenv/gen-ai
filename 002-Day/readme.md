# 🤖 DAY 02 — AI AGENTS & TOOL CALLING

> Understanding how an AI model uses external tools to perform real-world tasks.

**Tech Stack:** Node.js + JavaScript + LangChain + Groq + Zod

---

# 1. 🧠 What is an AI Agent?

An AI Agent is a system that uses an AI model to understand a user's request, decide what action is needed, and use available tools to complete the task.

A normal LLM primarily generates responses.

An AI Agent can also interact with external tools.

### Normal LLM vs AI Agent

**Normal LLM:**

```text
User: Create an event for tomorrow.

          |
          v

         LLM

          |
          v

"Sure! Your event is created."
```

Problem: It only generates text. It hasn't actually created an event.

**AI Agent:**

```text
User: Create an event for tomorrow.

          |
          v

         Agent

          |
          v

    Understand Request

          |
          v

    Select createEvent Tool

          |
          v

    Execute JavaScript Function

          |
          v

      Save Event

          |
          v

    Return Tool Result

          |
          v

    Generate Final Response
```

Now the event actually gets created in our application.

**Remember:** An AI Agent doesn't magically perform actions. It uses tools provided by the developer.

---

# 2. 🛠️ What is Tool Calling?

Tool Calling allows an LLM to request the execution of an external function.

For example, suppose a user says:

```text
Create an event:

Title: Learn Generative AI
Date: 2026-11-01
Description: Study AI Agents
```

The model can decide to call:

```javascript
createEvent({
    title: "Learn Generative AI",
    date: "2026-11-01",
    description: "Study AI Agents"
});
```

The important thing is that the LLM doesn't directly execute this JavaScript function.

Instead:

1. The model identifies the required tool.
2. It generates a structured tool-call request.
3. LangChain receives that request.
4. LangChain executes the corresponding function.
5. The result is returned to the model.
6. The model generates the final response.

### Complete Tool Calling Flow

```text
          USER
            |
            v
      "Create an event"
            |
            v
       AI AGENT
            |
            v
      MODEL DECISION
            |
            v
      TOOL SELECTION
            |
            v
       createEvent
            |
            v
     FUNCTION EXECUTION
            |
            v
       events.push()
            |
            v
       TOOL RESULT
            |
            v
        AI MODEL
            |
            v
      FINAL RESPONSE
```

---

# 3. 📦 Understanding the Imports

```javascript
import { ChatGroq } from "@langchain/groq";

import dotenv from "dotenv";

import rl from "readline/promises";

import { tool, createAgent } from "langchain";

import * as z from "zod";
```

Let's understand each package.

| Package           | Purpose                               |
| ----------------- | ------------------------------------- |
| @langchain/groq   | Connects LangChain with Groq models   |
| dotenv            | Loads environment variables           |
| readline/promises | Takes terminal input                  |
| langchain         | Provides Agent and Tool functionality |
| zod               | Validates structured data             |

### What is Zod?

Zod is a JavaScript/TypeScript schema validation library.

It helps us define what kind of data a function expects.

Example:

```javascript
const userSchema = z.object({
    name: z.string(),
    age: z.number(),
});
```

Valid data:

```javascript
{
    name: "Mayur",
    age: 19
}
```

Invalid data:

```javascript
{
    name: "Mayur",
    age: "nineteen"
}
```

Why?

Because `age` must be a number.

**Remember:** Zod validates the structure and types of data.

---

# 4. 🔧 What is a Tool in LangChain?

In LangChain, a tool is a function that an AI Agent can use to perform a particular operation.

Our code:

```javascript
const createEventTool = tool(
    async function ({ date, title, description }) {

        console.log("Creating event:", {
            date,
            title,
            description
        });

        events.push({
            date,
            title,
            description,
        });

        return "Event created";
    },
    {
        name: "createEvent",

        description:
            "Creates a new event with a date, title, and description",

        schema: z.object({
            date: z.string(),
            title: z.string(),
            description: z.string(),
        }),
    },
);
```

The `tool()` function converts our JavaScript function into a tool that the agent can discover and use.

### Tool Structure

```text
       tool()
          |
          |
     ┌────┴─────────────┐
     |                  |
     v                  v
  FUNCTION          METADATA
     |                  |
     v                  v
  Executes          name
  Operation         description
                    schema
```

There are two main parts.

**Part 1: Function**

```javascript
async function ({ date, title, description }) {

    events.push({
        date,
        title,
        description,
    });

    return "Event created";
}
```

This contains the actual business logic.

**Part 2: Tool Configuration**

```javascript
{
    name: "createEvent",

    description: "Creates a new event",

    schema: z.object({
        date: z.string(),
        title: z.string(),
        description: z.string(),
    }),
}
```

This tells the model what the tool does and what arguments it requires.

---

# 5. 📋 What is Tool Schema?

Schema defines the structure of the arguments that a tool expects.

Our schema:

```javascript
schema: z.object({
    date: z.string(),
    title: z.string(),
    description: z.string(),
})
```

This means:

```text
createEvent()

Expected Arguments:

{
    date: string,
    title: string,
    description: string
}
```

Example:

```javascript
{
    date: "2026-11-01",
    title: "Learn AI",
    description: "Study AI Agents"
}
```

### Why do we need schemas?

Imagine the model generates:

```javascript
{
    date: 20261101,
    title: "Learn AI",
    description: "Study AI"
}
```

Here, date is a number instead of a string.

Zod can reject this invalid input.

**Important:** Schema validation checks data structure and types. It does not automatically verify whether a date is real or whether the user is authorized to create an event.

---

# 6. 📥 Understanding getEventsTool

```javascript
const getEventsTool = tool(
    async function ({}) {

        console.log("Retrieving events:", events);

        return events;

    },
    {
        name: "getEvents",

        description: "Retrieves all events",

        schema: z.object({}),
    },
);
```

This tool retrieves all stored events.

Notice:

```javascript
schema: z.object({})
```

Why is it empty?

Because this function doesn't require any arguments.

### Example

Suppose our events array contains:

```javascript
const events = [
    {
        date: "2026-11-01",
        title: "Learn AI",
        description: "Study AI Agents"
    }
];
```

When the model calls `getEvents`, the function returns this array.

### Two Different Tools

| Tool        | Operation            |
| ----------- | -------------------- |
| createEvent | Creates an event     |
| getEvents   | Retrieves all events |

One tool performs a write operation, while the other performs a read operation.

---

# 7. 🧠 What is createAgent()?

This is the most important part of our application.

```javascript
const agent = createAgent({
    model,
    tools: [
        createEventTool,
        getEventsTool
    ],
});
```

Here we create an AI Agent using:

1. An LLM.
2. A collection of tools.

### Understanding Internally

```text
          createAgent()
                 |
          ┌──────┴──────┐
          |             |
          v             v
         MODEL         TOOLS
          |             |
          |       ┌─────┴─────┐
          |       |           |
          v       v           v
         LLM   createEvent  getEvents
          |       |           |
          └───────┴───────────┘
                  |
                  v
              AI AGENT
```

The agent can use the model to decide which available tool is appropriate for the user's request.

**Remember:** `createAgent()` connects the model and tools into an agent workflow. It does not mean every tool runs on every request.

---

# 8. 🔄 How Does an Agent Decide Which Tool to Use?

Let's understand with an example.

User:

```text
Create an event for tomorrow.
Title: Learn LangChain
Description: Practice tool calling.
```

The model receives:

* User's request.
* Available tool descriptions.
* Tool schemas.

It determines that `createEvent` is appropriate.

It then generates a structured tool call.

Conceptually:

```javascript
{
    name: "createEvent",

    args: {
        date: "2026-11-01",
        title: "Learn LangChain",
        description: "Practice tool calling."
    }
}
```

LangChain executes the tool and returns the result to the agent.

### Important Detail

The model does not directly access your JavaScript variables or execute arbitrary application code.

It requests an available tool call, and the agent runtime handles execution.

---

# 9. 🔁 Understanding the Agent Execution Loop

An agent can perform multiple tool calls when necessary.

Example:

User:

```text
Create an event and then show me all events.
```

The agent may execute:

```text
USER REQUEST
     |
     v
AI AGENT
     |
     v
createEvent()
     |
     v
EVENT CREATED
     |
     v
getEvents()
     |
     v
EVENTS RETRIEVED
     |
     v
FINAL AI RESPONSE
```

This is the important difference between a simple LLM call and an agent workflow.

An agent can decide on actions, observe tool results, and continue working.

---

# 10. 🌊 Understanding agent.stream()

Our code:

```javascript
const stream = await agent.stream(
    {
        messages: [
            {
                role: "user",
                content: userInput,
            },
        ],
    },
    {
        streamMode: "messages",
    },
);
```

Let's break this down.

### A. agent.stream()

It starts the agent execution and returns a stream of events/messages.

### B. messages

```javascript
messages: [
    {
        role: "user",
        content: userInput,
    },
]
```

This is the conversation input passed to the agent.

### C. streamMode: "messages"

This requests message-level streaming.

The stream can include messages from different stages of the agent execution, including assistant output and tool-related messages.

---

# 11. 🔬 Understanding for await with Agent Streaming

```javascript
for await (const [chunk] of stream) {

    process.stdout.write(chunk.content);

}
```

Notice something important:

Earlier we used:

```javascript
for await (const chunk of stream)
```

But here we use:

```javascript
for await (const [chunk] of stream)
```

Why?

Because in this example, `streamMode: "messages"` returns message-related stream items containing a message chunk and metadata.

The first element is the message chunk.

Conceptually:

```javascript
[
    messageChunk,
    metadata
]
```

We use:

```javascript
const [chunk] = item;
```

This extracts the first element.

**Important:** Agent message streams can contain tool-call chunks and non-text messages too. Don't assume every chunk has printable text in `chunk.content`. Production code should filter message types and handle content blocks appropriately.

---

# 12. 🧠 Complete Internal Architecture

Let's connect everything.

```text
                 USER
                   |
                   v
             Terminal Input
                   |
                   v
               AGENT
                   |
                   v
             GROQ MODEL
                   |
                   v
           UNDERSTAND REQUEST
                   |
                   v
             SELECT TOOL
                   |
          ┌────────┴────────┐
          |                 |
          v                 v
     createEvent         getEvents
          |                 |
          v                 v
      ZOD SCHEMA         ZOD SCHEMA
          |                 |
          v                 v
    FUNCTION EXECUTION  FUNCTION EXECUTION
          |                 |
          v                 v
      events.push()      Return events
          |                 |
          └────────┬────────┘
                   |
                   v
              TOOL RESULT
                   |
                   v
               GROQ MODEL
                   |
                   v
             FINAL RESPONSE
                   |
                   v
                USER
```

---

# 13. ⚠️ Important: Is Our Events Array Permanent?

No!

```javascript
const events = [];
```

This array exists only in application memory.

If you restart Node.js, all events disappear.

For permanent storage, we can use:

* MongoDB
* PostgreSQL
* MySQL
* SQLite

Since you already know MongoDB, you can replace this array with a Mongoose model.

Example:

```javascript
const newEvent = await EventModel.create({
    date,
    title,
    description,
});
```

Now the event is stored in MongoDB.

---

# 14. 🆚 LLM vs Tool vs Agent

| Concept   | Responsibility                               |
| --------- | -------------------------------------------- |
| LLM       | Understands input and generates output       |
| Tool      | Performs a specific operation                |
| Agent     | Coordinates the model and tools              |
| Schema    | Defines expected tool arguments              |
| LangChain | Provides the integration and agent framework |

### Simple Understanding

```text
LLM     = Brain
Tool    = Capability
Agent   = Decision + Execution Workflow
Schema  = Input Structure
```

This is a simplified conceptual comparison, not a literal description of how an LLM thinks.

---

# 15. 🧪 PRACTICE TASKS

Try these tasks yourself.

**Task 1:** Create a `deleteEvent` tool.

**Task 2:** Create a `getEventByDate` tool.

**Task 3:** Add an event ID using `nanoid`.

**Task 4:** Replace the events array with MongoDB.

**Task 5:** Add validation so users cannot create events with empty titles.

**Task 6:** Create an `updateEvent` tool.

**Task 7:** Ask the agent to create three events in one request.

**Task 8:** Add a system instruction that makes the agent behave like a personal event manager.

---

# 🚀 WHAT TO LEARN NEXT

Follow this order:

1. Tool Calling Internals
2. System Messages and Agent Instructions
3. Agent State
4. Short-Term Memory
5. Long-Term Memory
6. Multiple Tool Execution
7. Structured Output
8. Human-in-the-Loop
9. RAG (Retrieval-Augmented Generation)
10. Multi-Agent Systems

---

## 🎯 FINAL UNDERSTANDING

Previously, we built a chatbot that could only generate responses.

Now we have built an agent that can:

* Understand user requests.
* Select an appropriate tool.
* Generate structured arguments.
* Execute JavaScript functions.
* Receive tool results.
* Generate a final response.

**The biggest takeaway:**

An LLM generates a tool-call request. The Agent framework executes the corresponding tool. The result is then provided back to the model.

This is how we move from a simple chatbot toward an AI-powered application.
