# LinkedIn — Companion Posts for Part 5: Context & Memory

> Paste as plain text. First 2 lines are the hook — that's all that shows before "…see more".
> Pick ONE primary post. Swap `[link to blog]` for your published URL.

---

## Post A — The Story Hook (recommended primary)

Week one of a multi-week customer engagement, the agent was flawless.

It captured every constraint: "no changes to the production tenant before the 30th." "Finance group is out of scope." "Escalate anything touching legal holds."

Week three, it proposed a change to the production tenant on the 22nd.

Nobody had removed the constraint. The agent just… didn't have it anymore.

Somewhere between week one and week three, that instruction scrolled out of the context window, got truncated to make room, and quietly ceased to exist.

The demo was perfect. The relationship fell apart — because the agent had no memory, only a prompt.

Here's the trap teams fall into: "it forgot because the window filled up → give it a bigger window."

Wrong instinct. Two reasons:

→ Models don't attend to long context uniformly. Bury a constraint in the middle of a huge prompt and you haven't preserved it — you've hidden it. ("Lost in the middle.")

→ Long horizons decay geometrically, and cramming the context makes the per-step decay WORSE, not better. More tokens is not more memory.

The fix is a reframe: memory is an ARCHITECTURE, not a prompt.

The context window is working memory — scarce and volatile. Everything else lives in a store:

• Episodic — what happened (searchable log)
• Semantic — durable facts, decisions, constraints ("prod frozen until the 30th")
• Then page the right slice back in when it matters.

The discipline: retrieve, don't retain. And reflect raw history into durable facts before it rots.

Long-horizon agents don't fail because they're not smart enough. They fail because they forgot.

Full write-up + a memory design checklist + reference architecture 👇
[link to blog]

Part 5 of "Building Agents That Ship."

#AgenticAI #AIEngineering #LLMOps #ProductionAI #ContextEngineering #AIArchitecture

---

## Post B — The Principle Version (alternate)

"Just use a bigger context window" is the most expensive wrong answer in agent engineering.

The moment your agent runs across many steps or many sessions, you hit a wall the demo never shows: it starts to forget. Contradicts last week's decision. Re-asks a question already answered. Drops a constraint you gave it on day one.

The instinct is to throw more context at it. But:

1. Models use long context unevenly — the middle gets ignored ("lost in the middle").
2. Long horizons decay geometrically. Bloating the context steepens the decay. More tokens ≠ more memory.

You're treating the context window as storage. It isn't. It's working memory — small, volatile, expensive. Using it as long-term memory is the architectural mistake.

The fix: give the agent real memory tiers, like a system, not a prompt.

→ Working — the live window. Curated per step, holds only what's needed NOW.
→ Episodic — the searchable record of what happened.
→ Semantic — distilled facts, decisions, constraints that must never rot.

Think of the LLM like an OS: context window = RAM, external store = disk, and the agent PAGES between them — evicting what's cold, retrieving what's suddenly relevant.

The discipline that decides success: retrieve, don't retain. Score what you pull back by relevance + recency + importance. And reflect — periodically compress raw episodes into durable facts, so "we talked for an hour" becomes "prod is frozen until the 30th."

This is why practitioners call context engineering the #1 job in long-running agents. The model's intelligence is table stakes. What you keep in — and out of — the working set is the whole game.

The demo tests intelligence. The engagement tests memory.

Full breakdown 👇
[link to blog]

Part 5 of "Building Agents That Ship." What's the worst thing an agent has forgotten on you?

#AgenticAI #GenAI #AIArchitecture #TechLeadership #ContextEngineering #MLOps

---

## Post C — Micro-post (second wave, optional)

Your agent in the demo: flawless.

Your agent at step 100: "wait, what were we doing?"

That's not an intelligence problem. It's a memory problem.

The context window is working memory — scarce and volatile. Stuff a month of history into it and the important stuff gets truncated or lost in the middle.

The fix isn't a bigger window. It's an architecture:

Retrieve, don't retain.
→ Keep durable constraints in semantic memory
→ Pull the relevant slice into the window per step
→ Reflect raw history into facts before it rots

Long-horizon agents don't fail because they're not smart enough. They fail because they forgot.

Full post 👇
[link to blog]

#AgenticAI #AIEngineering #ContextEngineering

---

## Carousel outline (8 slides — matches carousel-5-memory.pdf)

1. **Cover:** "The agent forgot." — Part 5: Context & Memory
2. **The story:** week one flawless, captured every constraint → week three it broke the frozen-tenant rule nobody removed
3. **The wrong instinct:** "window filled up → bigger window." Wrong: lost-in-the-middle + geometric decay
4. **The reframe:** memory is an ARCHITECTURE, not a prompt
5. **The tiers:** Working · Episodic · Semantic (context window = RAM, store = disk, page between them)
6. **The move:** retrieve, don't retain — score by relevance + recency + importance
7. **Reflection:** compress raw history into durable facts ("an hour of talk" → "prod frozen until the 30th")
8. **The gift + CTA:** memory design checklist + reference architecture → link

---

### Posting tips
- Lead with the two-line hook; everything after "…see more" is bonus.
- Post the blog link as the first comment for reach; test in-body too.
- Tue–Thu, 8–10am your readers' time works well for technical audiences.
- Reply to early comments within the first hour — it compounds reach.
- Tie back in a comment ("Part 2 = reliability, 3 = evaluation, 4 = accountability, this is Part 5 →") to pull readers through the series.
