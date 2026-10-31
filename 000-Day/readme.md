# 🤖 GENERATIVE AI — COMPLETE NOTES

> Understanding how AI thinks, processes text, predicts words and generates responses.

**Level:** Beginner → Intermediate
**Focus:** Core concepts + Internal Working

---

# 1. 🧠 What is Generative AI?

Generative AI is a type of Artificial Intelligence that can generate NEW content based on patterns it learned from training data.

It can generate:

* 📝 Text — ChatGPT
* 🖼️ Images — DALL·E
* 🎵 Music — Music generation AI
* 🎥 Videos — Video generation AI
* 💻 Code — AI coding assistants
* 🔊 Audio — Voice generation

### Traditional AI vs Generative AI

| Traditional AI      | Generative AI                |
| ------------------- | ---------------------------- |
| Classifies data     | Generates new content        |
| Predicts categories | Generates text, images, etc. |
| Spam or not spam    | Writes an email              |
| Detects objects     | Creates images               |

**Example:**

Traditional AI:

```text
Input: "I love this movie"

Output: Positive Sentiment
```

Generative AI:

```text
Input: "Write a review of this movie"

Output: "This movie delivers an amazing
cinematic experience..."
```

---

# 2. ⚙️ How Does Generative AI Work?

Let's understand the complete process.

When you send a message to an AI model, several things happen internally.

### Complete Flow

```text
       👤 USER
          |
          v
   "Explain JavaScript"
          |
          v
   ┌───────────────┐
   │  TOKENIZATION │
   └───────────────┘
          |
          v
   ┌───────────────┐
   │ TOKEN IDs     | 
   └───────────────┘
          |
          v
   ┌───────────────┐
   │  EMBEDDINGS   │
   └───────────────┘
          |
          v
   ┌───────────────┐
   │ TRANSFORMER   │
   │  ARCHITECTURE │
   └───────────────┘
          |
          v
   ┌───────────────┐
   │  PREDICTION   │
   └───────────────┘
          |
          v
   ┌───────────────┐
   │  SAMPLING     │
   └───────────────┘
          |
          v
    NEXT TOKEN
          |
          v
   REPEAT PROCESS
          |
          v
    🤖 AI RESPONSE
```

Let's understand every step.

---

# 3. 🔤 What is Tokenization?

A token is a small unit of text that an AI model processes.

A token can be:

* A complete word
* A part of a word
* A punctuation mark
* A character or other text unit

**Example:**

```text
Input:
I love programming.
```

Possible tokenization:

```text
["I", " love", " programming", "."]
```

Notice: Tokens are not always complete words.

### Why do we need tokens?

Computers don't directly understand human language.

AI models process numerical representations of text.

So, first, text is converted into tokens.

### Tokenization Process

```text
Human Text
    |
    v
Tokenizer
    |
    v
Token Pieces
    |
    v
Token IDs
```

Example:

```text
"Hello World"

       |
       v

["Hello", " World"]

       |
       v

[15339, 4435]
```

*Note: Token IDs are illustrative; actual IDs depend on the tokenizer.*

**Remember:** Tokenization converts text into token IDs that the model can process.

---

# 4. 🔢 What are Embeddings?

Token IDs are just numerical identifiers.

But the model needs meaningful numerical representations to understand relationships between tokens.

This is where Embeddings come in.

An embedding converts a token ID into a vector (a list of numbers).

Example:

```text
Token: King
Token ID: 1234

Embedding:

[0.21, 0.45, 0.87, 0.12, ...]
```

Another example:

```text
King  → [0.21, 0.45, 0.87, ...]
Queen → [0.19, 0.42, 0.81, ...]
Car   → [0.76, 0.12, 0.32, ...]
```

Similar meanings can have related vector representations.

### Why Embeddings?

They help models represent semantic relationships between words and tokens.

**Remember:**

Token ID = Numerical identity.

Embedding = Numerical representation containing learned information.

---

# 5. 🏗️ What are Transformers?

Transformers are a neural network architecture introduced in the research paper:

**"Attention Is All You Need" (2017)**

They changed how modern language models process text.

Most modern LLMs are based on Transformer architecture or its variations.

### What problem do Transformers solve?

Imagine this sentence:

```text
The animal didn't cross the road
because it was tired.
```

What does "it" refer to?

The model needs to understand relationships between different words.

Transformers use a mechanism called **Attention** to determine which tokens are relevant to other tokens.

### Transformer Architecture

```text
        Input Text
             |
             v
        Tokenization
             |
             v
         Embeddings
             |
             v
      Positional Information
             |
             v
     ┌───────────────────┐
     │    ATTENTION      │
     │                   │
     │ Which tokens are  │
     │ relevant to each  │
     │ other?            │
     └───────────────────┘
             |
             v
     ┌───────────────────┐
     │  FEED FORWARD     │
     │      NETWORK      │
     └───────────────────┘
             |
             v
       More Layers
             |
             v
       Output Logits
```

### Important Transformer Components

| Component              | Purpose                                 |
| ---------------------- | --------------------------------------- |
| Embeddings             | Convert token IDs into vectors          |
| Positional Information | Represent token positions               |
| Attention              | Understand relationships between tokens |
| Feed Forward Network   | Further process representations         |
| Layers                 | Repeat these computations               |
| Output Layer           | Produce vocabulary scores               |

**Important:** GPT-style models primarily use the Transformer Decoder architecture.

---

# 6. 👀 What is Attention Mechanism?

Attention helps the model determine which other tokens are important when processing a particular token.

Example:

```text
The cat sat on the mat because it was tired.
```

When processing "it", attention can help the model connect it with "cat".

### Three Important Terms

Attention uses three main concepts:

1. Query (Q)
2. Key (K)
3. Value (V)

Think of them like this:

* Query: What information am I looking for?
* Key: What information do I contain?
* Value: What information can I provide?

The attention calculation is:

```text
Attention(Q, K, V) =

softmax(QKᵀ / √dₖ) V
```

Don't worry about memorizing the formula right now.

Just understand:

**Attention helps a model decide how much importance to give different tokens.**

---

# 7. 🔮 What is Next Token Prediction?

This is one of the MOST IMPORTANT concepts in Generative AI.

GPT models generate text by predicting the next token based on previous tokens.

Example:

```text
Input:

I love eating

Possible next tokens:

Pizza  → 60%
Food   → 20%
Apples → 10%
Rice   → 10%
```

The model predicts possible next tokens and selects one according to its decoding strategy.

Suppose it selects:

```text
Pizza
```

Now the input becomes:

```text
I love eating Pizza
```

Then the model predicts the next token again.

### Complete Prediction Loop

```text
I love eating
       |
       v
 Predict Next Token
       |
       v
     Pizza
       |
       v
I love eating Pizza
       |
       v
 Predict Next Token
       |
       v
    Today
       |
       v
I love eating Pizza Today
       |
       v
       ...
```

This process continues until the model generates an ending token or reaches a generation limit.

**Remember: LLMs generate text one token at a time.**

---

# 8. 🎲 What is Sampling?

The model doesn't always select the most probable token.

Sampling is a method used during text generation to choose the next token from a probability distribution.

Example:

```text
Model Predictions:

Hello  → 70%
Hi     → 20%
Hey    → 10%
```

The model can select a token based on these probabilities.

Different sampling strategies control how tokens are selected.

### A. Greedy Decoding

Always selects the token with the highest probability.

```text
Hello → 70%
Hi    → 20%
Hey   → 10%

Selected: Hello
```

It is predictable but can produce repetitive text.

### B. Temperature

Temperature controls how random or predictable the probability distribution becomes.

| Temperature | Behaviour        |
| ----------- | ---------------- |
| 0 or near 0 | More predictable |
| 0.3         | More focused     |
| 0.7         | Balanced         |
| 1.0         | More varied      |
| Above 1     | More random      |

Example:

```javascript
const model = new ChatGroq({
    model: "openai/gpt-oss-120b",
    temperature: 0.7,
});
```

**Important:** Temperature doesn't directly control intelligence. It changes the probability distribution used during sampling.

### C. Top-K Sampling

Top-K means the model considers only the K most probable tokens.

Example:

```text
Pizza  → 70%
Food   → 20%
Rice   → 7%
Apple  → 2%
Water  → 1%
```

If K = 3:

```text
Pizza
Food
Rice
```

Other tokens are removed from consideration.

### D. Top-P Sampling (Nucleus Sampling)

Top-P selects the smallest group of tokens whose cumulative probability reaches a particular threshold.

Example:

```text
Pizza  → 70%
Food   → 20%
Rice   → 7%
Apple  → 2%
Water  → 1%
```

If P = 0.90:

```text
Pizza → 70%
Food  → 20%

Total = 90%
```

The model samples from this selected group.

### Sampling Comparison

| Technique   | How it works                             |
| ----------- | ---------------------------------------- |
| Greedy      | Select highest probability               |
| Temperature | Controls randomness                      |
| Top-K       | Select from K best tokens                |
| Top-P       | Select from cumulative probability group |

---

# 9. 🧠 What is an LLM?

LLM stands for **Large Language Model**.

It is an AI model trained on large amounts of text data to understand and generate language.

Examples:

* GPT
* Claude
* Gemini
* Llama
* DeepSeek

### Basic LLM Working

```text
Large Training Dataset
          |
          v
    Tokenization
          |
          v
    Transformer
          |
          v
     Training
          |
          v
   Learned Parameters
          |
          v
     Trained LLM
          |
          v
    User Prompt
          |
          v
    AI Response
```

---

# 10. 🏋️ What is Training?

Training is the process through which a model learns patterns from data.

For a next-token prediction task:

```text
Input:

The sky is

Expected Next Token:

Blue
```

Initially, the model may predict incorrectly.

During training:

1. Model receives training data.
2. It predicts the next token.
3. Its prediction is compared with the actual token.
4. A loss is calculated.
5. Model parameters are updated using optimization.
6. The process repeats many times.

### Important Terms

| Term            | Meaning                                |
| --------------- | -------------------------------------- |
| Dataset         | Training examples                      |
| Parameters      | Learned numerical values               |
| Loss            | Measures prediction error              |
| Gradient        | Indicates how parameters should change |
| Backpropagation | Calculates gradients                   |
| Optimizer       | Updates parameters                     |

**Important:** Training happens before you normally use a hosted LLM API.

When you call Groq or OpenAI APIs, you are generally using an already-trained model for inference.

---

# 11. ⚡ What is Inference?

Inference means using a trained model to generate predictions or responses.

Example:

```javascript
const response = await model.invoke(
    "Explain JavaScript"
);

console.log(response.content);
```

Here:

* Model is already trained.
* You provide a prompt.
* Model processes the input.
* It predicts tokens.
* It generates a response.

### Training vs Inference

| Training                  | Inference                          |
| ------------------------- | ---------------------------------- |
| Model learns              | Model generates                    |
| Updates parameters        | Normally doesn't update parameters |
| Requires training process | Requires a trained model           |
| Computationally expensive | Depends on model and hardware      |

---

# 12. 📚 Important Concepts — Quick Revision

| Concept               | Meaning                                         |
| --------------------- | ----------------------------------------------- |
| Generative AI         | AI that generates new content                   |
| LLM                   | Large Language Model                            |
| Token                 | Small unit of text                              |
| Tokenization          | Text → Token IDs                                |
| Embedding             | Token ID → Vector                               |
| Transformer           | Neural network architecture                     |
| Attention             | Connects relevant tokens                        |
| Next Token Prediction | Predicts the next token                         |
| Sampling              | Selects the next token                          |
| Temperature           | Controls randomness                             |
| Top-K                 | Considers K most probable tokens                |
| Top-P                 | Considers tokens within a probability threshold |
| Training              | Model learns patterns                           |
| Inference             | Model generates predictions                     |

---

# 🎯 FINAL UNDERSTANDING

Whenever you ask ChatGPT:

```text
"Explain React Hooks"
```

A simplified view of what happens:

```text
       YOUR PROMPT
            |
            v
       TOKENIZATION
            |
            v
        EMBEDDINGS
            |
            v
       TRANSFORMER
            |
            v
        ATTENTION
            |
            v
    NEXT TOKEN PREDICTION
            |
            v
         SAMPLING
            |
            v
       SELECT TOKEN
            |
            v
      REPEAT PROCESS
            |
            v
      COMPLETE RESPONSE
```

**The most important thing to understand:**

An LLM doesn't generate an entire paragraph in one simple prediction. It generates tokens sequentially, using the previous context to predict what comes next.

---

## 🚀 WHAT TO STUDY NEXT

Follow this order:

1. Tokenization — Deep understanding
2. Embeddings — Vectors and dimensions
3. Transformer Architecture
4. Self-Attention and Multi-Head Attention
5. Next Token Prediction
6. Temperature, Top-K and Top-P
7. Training vs Fine-tuning
8. Context Window
9. Prompt Engineering
10. LangChain and AI Agents

**Learning Rule:** Don't just memorize definitions. Understand what happens internally when you send a prompt to an LLM.
