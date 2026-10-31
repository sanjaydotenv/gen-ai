# 🕸️ DAY 03 — LANGGRAPH & STATEGRAPH

> Understanding how to build structured AI workflows using Nodes, Edges and State.

**Tech Stack:** Node.js + LangChain + LangGraph + Groq + Zod

---

# 1. 🧠 What is LangGraph?

LangGraph is a framework for building stateful, multi-step AI workflows and agents.

Simple language mein:

LangGraph allows us to divide an AI application into multiple functions (Nodes) and connect them through a workflow (Edges).

### Why do we need LangGraph?

Imagine you want to build an AI Email Assistant.

User:

```text
Send an email to john@gmail.com
Title: Meeting
Description: Let's meet tomorrow.
```

A simple application might perform everything in one function.

But a complex AI application may need:

1. Understand user input.
2. Extract email details.
3. Validate information.
4. Ask for confirmation.
5. Send email.
6. Return the result.

Managing all these operations in one function becomes difficult.

LangGraph helps us organize them into a workflow.

### Basic Architecture

```text
           USER
             |
             v
        ┌─────────┐
        │  INPUT  │
        └─────────┘
             |
             v
        ┌─────────┐
        │  NODE 1 │
        └─────────┘
             |
             v
        ┌─────────┐
        │  NODE 2 │
        └─────────┘
             |
             v
        ┌─────────┐
        │  NODE 3 │
        └─────────┘
             |
             v
          OUTPUT
```

**Remember:** LangGraph is used to define how different operations execute and communicate with each other.

---

# 2. 📦 Understanding LangGraph Import

```javascript
import {
    START,
    StateGraph,
    END
} from "@langchain/langgraph";
```

We are importing three important things.

| Import     | Purpose                             |
| ---------- | ----------------------------------- |
| START      | Represents the beginning of a graph |
| StateGraph | Creates a stateful workflow         |
| END        | Represents the end of a graph       |

### Workflow Structure

```text
       START
          |
          v
        NODE
          |
          v
         END
```

---

# 3. 🧩 What is a Node?

A Node is a function that performs a particular operation inside a graph.

In your code:

```javascript
async function LLMNode(state) {

    console.log("LLMNode state:", state);

    return {
        messages: [
            ...state.messages,
            {
                role: "assistant",
                content: "hello, user!"
            }
        ]
    };
}
```

Here, `LLMNode` is a Node.

It receives the current state and returns updated state information.

### Understanding Internally

```text
       CURRENT STATE
             |
             v
          LLMNode
             |
             v
       PROCESS DATA
             |
             v
       UPDATED STATE
```

### What is state?

State is the data that travels through the graph.

For example:

```javascript
{
    messages: [
        {
            role: "user",
            content: "hello, graph"
        }
    ]
}
```

Our node receives this object.

Then it returns:

```javascript
{
    messages: [
        {
            role: "user",
            content: "hello, graph"
        },
        {
            role: "assistant",
            content: "hello, user!"
        }
    ]
}
```

Notice that we used:

```javascript
...state.messages
```

This preserves the previous messages and adds a new assistant message.

---

# 4. 📦 What is StateGraph?

StateGraph is the main class used to create a graph-based workflow with shared state.

Your code:

```javascript
const graph = new StateGraph(
    z.object({
        messages: z.array(z.any()),
    }),
);
```

Let's understand it.

### What are we defining?

We are defining the structure of our graph's state.

```javascript
z.object({
    messages: z.array(z.any()),
})
```

This means:

```text
STATE
  |
  v
OBJECT
  |
  v
messages
  |
  v
ARRAY
  |
  v
ANY TYPE ELEMENTS
```

Example of valid state:

```javascript
{
    messages: [
        {
            role: "user",
            content: "Hello"
        }
    ]
}
```

### Why use Zod?

Zod defines and validates the structure of our state.

It helps ensure that the graph receives the expected data shape.

---

# 5. 🔗 What are Edges?

Edges connect Nodes and define the execution flow.

Your code:

```javascript
.addEdge(START, "LLMNode")
.addEdge("LLMNode", END)
```

We have created two edges.

### First Edge

```javascript
.addEdge(START, "LLMNode")
```

This means execution starts from `START` and moves to `LLMNode`.

### Second Edge

```javascript
.addEdge("LLMNode", END)
```

After `LLMNode` executes, the graph finishes.

### Visual Diagram

```text
        START
           |
           | Edge 1
           v
       ┌─────────┐
       │ LLMNode │
       └─────────┘
           |
           | Edge 2
           v
          END
```

**Remember:**

* Node = What operation should happen?
* Edge = Where should execution go next?

---

# 6. 🏗️ What is compile()?

```javascript
const graph = new StateGraph(...)
    .addNode("LLMNode", LLMNode)
    .addEdge(START, "LLMNode")
    .addEdge("LLMNode", END)
    .compile();
```

The `compile()` method builds the graph into an executable workflow.

Think of it as preparing your graph definition for execution.

### Before compile()

You are defining:

* Nodes
* Edges
* State structure

### After compile()

You get an executable graph.

```text
GRAPH DEFINITION
       |
       v
   ADD NODES
       |
       v
   ADD EDGES
       |
       v
     COMPILE
       |
       v
 EXECUTABLE GRAPH
```

---

# 7. ⚡ What is graph.invoke()?

```javascript
const graphResponse = await graph.invoke({
    messages: [
        {
            role: "user",
            content: "hello, graph"
        }
    ]
});
```

`invoke()` executes the graph and waits for its final result.

Here we provide the initial state.

### Complete Execution

```text
          graph.invoke()
                 |
                 v
            INITIAL STATE
                 |
                 v
               START
                 |
                 v
              LLMNode
                 |
                 v
          PROCESS MESSAGES
                 |
                 v
          UPDATE STATE
                 |
                 v
                END
                 |
                 v
            FINAL RESULT
```

The final result will conceptually look like:

```javascript
{
    messages: [
        {
            role: "user",
            content: "hello, graph"
        },
        {
            role: "assistant",
            content: "hello, user!"
        }
    ]
}
```

---

# 8. 🔬 Understanding the Complete Code

Let's combine everything.

```javascript
async function LLMNode(state) {

    console.log("LLMNode state:", state);

    return {
        messages: [
            ...state.messages,
            {
                role: "assistant",
                content: "hello, user!"
            }
        ]
    };
}
```

This is our Node.

```javascript
const graph = new StateGraph(
    z.object({
        messages: z.array(z.any()),
    }),
)
.addNode("LLMNode", LLMNode)
.addEdge(START, "LLMNode")
.addEdge("LLMNode", END)
.compile();
```

This creates our graph.

```javascript
const graphResponse = await graph.invoke({
    messages: [
        {
            role: "user",
            content: "hello, graph"
        }
    ]
});
```

This executes our graph.

---

# 9. 🤔 Important: Are We Actually Using an LLM?

Look at your function:

```javascript
async function LLMNode(state) {

    return {
        messages: [
            ...state.messages,
            {
                role: "assistant",
                content: "hello, user!"
            }
        ]
    };

}
```

Notice something?

We imported:

```javascript
import { ChatGroq } from "@langchain/groq";
```

And created:

```javascript
const model = new ChatGroq({
    model: "openai/gpt-oss-120b",
    apiKey: process.env.GROQ_API_KEY,
});
```

But we never called:

```javascript
await model.invoke(...)
```

Therefore, our current graph does NOT use the LLM.

It simply executes a JavaScript function and returns a hardcoded response.

### How to Actually Connect the LLM

Replace your `LLMNode` with:

```javascript
async function LLMNode(state) {

    const response = await model.invoke(state.messages);

    return {
        messages: [
            ...state.messages,
            response
        ]
    };

}
```

Now the flow becomes:

```text
       USER MESSAGE
             |
             v
          START
             |
             v
          LLMNode
             |
             v
         GROQ MODEL
             |
             v
       GENERATE RESPONSE
             |
             v
       UPDATE STATE
             |
             v
            END
```

Now your graph actually communicates with an LLM.

---

# 10. 🔀 What are Conditional Edges?

Normal edges always follow a predefined path.

But sometimes we need dynamic execution.

Example:

```text
User Request
     |
     v
  LLM Node
     |
     v
Need Tool?
     |
  ┌──┴───┐
  |      |
 YES     NO
  |      |
  v      v
Tool    END
Node
  |
  v
LLM Node
  |
  v
 END
```

This is where conditional edges become useful.

They allow us to select the next Node based on the current state.

Example:

```javascript
graph.addConditionalEdges(
    "LLMNode",
    (state) => {
        if (state.needsTool) {
            return "ToolNode";
        }

        return END;
    }
);
```

This is a conceptual example of conditional routing.

In a real graph, the selected destinations must be declared in the graph definition.

---

# 11. 🆚 LangChain Agent vs LangGraph

| LangChain Agent                         | LangGraph                              |
| --------------------------------------- | -------------------------------------- |
| Provides agent creation abstractions    | Provides graph-based workflow control  |
| Can automatically manage tool execution | Allows explicit control over execution |
| Good for quickly building agents        | Good for complex workflows             |
| Less workflow configuration             | More workflow customization            |
| Tools can be integrated directly        | Nodes can represent many operations    |

They are not competitors.

LangChain agents can also use LangGraph internally for execution.

---

# 12. 🎯 Important Concepts — Quick Revision

| Concept          | Meaning                               |
| ---------------- | ------------------------------------- |
| LangGraph        | Framework for stateful AI workflows   |
| State            | Shared data used during execution     |
| StateGraph       | Defines a stateful graph              |
| Node             | Function that performs an operation   |
| Edge             | Connects nodes                        |
| START            | Entry point                           |
| END              | Exit point                            |
| compile()        | Builds an executable graph            |
| invoke()         | Executes the graph                    |
| Conditional Edge | Dynamically selects the next node     |
| Zod              | Defines and validates data structures |

---

# 13. 🧪 PRACTICE TASKS

Try these yourself.

**Task 1:** Create a `GreetingNode` that returns a welcome message.

**Task 2:** Create two Nodes: `InputNode` and `ResponseNode`.

**Task 3:** Connect three Nodes using edges.

**Task 4:** Create a Node that actually calls Groq.

**Task 5:** Create a conditional edge that checks whether the user's message contains the word `email`.

**Task 6:** Create a graph with separate Email and General Response Nodes.

**Task 7:** Add a Node that validates user input before passing it to the LLM.

---

# 🚀 WHAT TO LEARN NEXT

1. State Management in LangGraph
2. Reducers and Messages State
3. addMessages()
4. Conditional Edges
5. ToolNode
6. Tool Calling with LangGraph
7. Checkpointing
8. Short-Term Memory
9. Human-in-the-Loop
10. Multi-Agent Workflows

---

## 🔥 FINAL UNDERSTANDING

Remember these four things:

```text
NODE  = Performs an operation

STATE = Stores workflow data

EDGE  = Controls execution flow

GRAPH = Connects everything
```

**The biggest takeaway:**

LangGraph allows you to build an AI application as a structured workflow instead of putting all your logic inside one large function.
