# LinkedIn — Companion Posts for Part 6: Multi-Agent — Help vs. Hurt

> Paste as plain text. First 2 lines are the hook — that's all that shows before "…see more".
> Pick ONE primary post. Swap `[link to blog]` for your published URL.

---

## Post A — The Story Hook (recommended primary)

The migration was big and messy, so the plan felt obvious: don't make one agent do all of it.

Split it across specialists. A planner agent. A mapping agent. A validation agent. An execution agent. Clean separation of concerns — just like microservices. More agents, more parallelism, more throughput.

It got worse.

The mapping agent made a schema decision the planner never saw. The validator flagged failures against assumptions the executor had already abandoned. Two agents ran the SAME migration step because neither knew the other had claimed it.

We spent more time reconciling the agents with each other than we'd have spent just doing the migration with one.

The specialists were individually competent and collectively incoherent.

Here's the trap: splitting an agent into many agents FEELS like sophistication. It borrows credibility from microservices. But microservices pass clean payloads through narrow contracts.

When you split an agent, the thing you're really trying to pass across the seam is CONTEXT — the fuzzy, still-evolving understanding of what we're doing and why.

And context is exactly what doesn't survive the trip across an agent boundary.

Every handoff leaks shared understanding. Do it across four agents and the errors don't add — they compound. (Plus ~15× the tokens, and debugging a conversation between five agents is brutal.)

The tell that decides everything:

→ Do the subtasks need to talk to each other while they run?
→ NO → fan them out. Multi-agent wins. ("assess 500 tenants independently")
→ YES → you have a coordination problem in a parallelism costume. More agents make it worse. (the migration)

Multi-agent is an optimization, not an architecture. Start single-threaded. Make the second agent earn its place.

Full write-up + a "should you go multi-agent?" decision tree 👇
[link to blog]

Part 6 of "Building Agents That Ship."

#AgenticAI #AIEngineering #MultiAgent #AIArchitecture #LLMOps #SystemDesign

---

## Post B — The Principle Version (alternate)

"We should split this into multiple agents" is the most confidently-wrong sentence in agent design right now.

It sounds senior. It borrows credibility from microservices. And most of the time, it makes the system worse.

Here's why. Microservices communicate through narrow, well-defined contracts — a schema, an API. When you split an agent, the thing you actually need to move between the pieces is context: the accumulated, evolving understanding of the task. That doesn't cross an agent boundary cleanly. It leaks.

So each sub-agent acts on a partial view and makes a decision that's locally sensible and globally wrong. Across four agents, errors compound. On top of that you pay ~15× the tokens (context gets re-sent and re-reasoned at every seam), and you inherit a debugging nightmare — because the bug lives in the interaction, not any single agent.

This isn't anti-multi-agent. It's anti-multi-agent-by-default.

Multi-agent wins on ONE specific shape of problem: breadth-first, parallelizable, context-independent work. Many subtasks that run at once, don't depend on each other, and don't need to share evolving state. "Research these 40 companies." "Assess these 500 tenants against a fixed checklist." Fan out, merge results, done — no shared context to fragment.

One question tells you which world you're in:

Do the subtasks need to talk to each other while they run?

No → fan them out.
Yes → you have a coordination problem wearing a parallelism costume, and more agents will multiply the coordination, not the throughput.

The senior default is the boring one: start with a single agent, one coherent thread of context, good tools, good memory. Add the second agent only when you can name the parallel, independent workload that justifies the coordination tax — and a single agent has actually hit a wall.

The size of the problem isn't the question. The shape of the work is.

Full breakdown 👇
[link to blog]

Part 6 of "Building Agents That Ship." When has multi-agent actually paid off for you — and when did it bite?

#AgenticAI #GenAI #MultiAgent #TechLeadership #AIArchitecture #MLOps

---

## Post C — Micro-post (second wave, optional)

Adding more agents to a hard problem usually doesn't help. It multiplies the problem.

Microservices pass clean payloads through narrow contracts.

Agents have to pass CONTEXT — and context doesn't survive the trip across a handoff. It leaks. Locally-sensible, globally-wrong decisions. Compounding errors. ~15× the tokens.

One question decides it:

Do the subtasks need to talk to each other while they run?
• No → fan them out (multi-agent wins).
• Yes → one agent with one coherent thread of context wins.

Multi-agent is an optimization, not an architecture. Start single-threaded. Make the second agent earn it.

Full post 👇
[link to blog]

#AgenticAI #MultiAgent #AIEngineering

---

## Carousel outline (8 slides — matches carousel-6-multiagent.pdf)

1. **Cover:** "We added more agents. It got worse." — Part 6: Multi-Agent — Help vs. Hurt
2. **The story:** planner + mapper + validator + executor → duplicated steps, contradictions, reconciliation hell
3. **Why it's seductive:** the microservices analogy, "specialists are better," the parallelism dream
4. **Why it hurts:** microservices pass payloads; agents must pass CONTEXT — and context leaks across the seam
5. **The costs:** compounding errors + ~15× tokens + debugging a conversation between agents
6. **When it WINS:** breadth-first, parallelizable, context-independent work ("assess 500 tenants")
7. **The one question:** do the subtasks need to talk while they run? No → fan out. Yes → one agent.
8. **The gift + CTA:** "should you go multi-agent?" decision tree → link

---

### Posting tips
- Lead with the two-line hook; everything after "…see more" is bonus.
- Post the blog link as the first comment for reach; test in-body too.
- Tue–Thu, 8–10am your readers' time works well for technical audiences.
- This one invites debate (multi-agent is hyped) — reply fast to comments; it compounds reach.
- Tie back in a comment ("Parts 2–5 covered the single agent; this is Part 6 →") to pull readers through the series.
