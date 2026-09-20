# LinkedIn — Companion Posts for Part 7: Learning from Production (RL)

> Paste as plain text. First 2 lines are the hook — that's all that shows before "…see more".
> Pick ONE primary post. The canonical blog link is pre-filled (GitHub Pages).

---

## Post A — The Story Hook (recommended primary)

Our agent was good. We wanted it great, so we did what everyone does: we tuned the prompt.

Edge case → add a rule. Wrong call → add an instruction. Tone complaint → add a paragraph.

Six months in, the system prompt was FIVE PAGES long — a sediment of every mistake the agent had ever made. And it had stopped helping. Every new rule we added to fix one case quietly broke another.

We were playing whack-a-mole with a text file.

Meanwhile, the agent was generating thousands of production traces a week. Humans were correcting it, approving some actions, editing others, escalating the misses. Every one of those was a labeled example of what "better" looks like.

We threw all of it away.

Here's the reframe that changed how we built: when you hand-edit a prompt to fix a behavior, you ARE doing machine learning — badly, by hand. You're the optimizer, the text file is the weights. It plateaus, because prose doesn't compose and you're tuning from memory, not data.

The signal to break the plateau is already flowing past you:

→ Traces (what it saw, decided, did)
→ Human edits & overrides (the richest signal you have: "this, not that")
→ Eval outcomes and guardrail hits
→ Task success and customer outcomes

Most teams drop all of it on the floor.

The move is to close the loop:
production traces → eval labels → reward signal → policy update → offline gate → canary → promote → repeat.

But the danger that makes this different from normal ML: reward hacking. An agent optimizing a reward optimizes the REWARD — not what you meant by it. It'll learn to SOUND like it satisfied the rubric without doing the work.

So humans own the reward definition. Promotion is gated by independent eval, not "the training metric went up."

An agent that can only improve by editing its prompt has a ceiling. You've probably already hit it.

Full write-up + a learning-from-production loop + readiness checklist 👇
https://shiladitya-ai.github.io/building-agents-that-ship/blog-7-learning.html

Part 7 of "Building Agents That Ship."

#AgenticAI #AIEngineering #RLHF #MLOps #ProductionAI #MachineLearning

---

## Post B — The Principle Version (alternate)

The five-page system prompt is a symptom, not a solution.

If your answer to every agent failure is "add another instruction," you're not improving the agent. You're building a fragile text file that composes in ways no human can predict — where fixing case #47 breaks case #12.

Here's the reframe: editing a prompt to fix behavior is machine learning done by hand. You observe an error, estimate a correction, nudge the system. Gradient descent with a human as the optimizer. It works early and plateaus hard — because you optimize from what you remember, not from what the data shows.

And the data is RIGHT THERE. A production agent is a firehose of training signal most teams discard:

• Traces — what it saw, decided, did
• Human overrides & edits — the richest label you'll ever get: "this, not that"
• Eval outcomes, guardrail hits, rollbacks
• Task success and downstream outcomes

The climb from prompt-tuning to real learning is a ladder — go only as high as your volume and eval maturity justify:

1. Prompt/context edits (manual) — where the plateau lives
2. Learn into MEMORY, not weights — store corrections, retrieve them next time (most teams skip this, and it's the highest-leverage rung)
3. Reward modeling from human/AI feedback (RLHF / RLAIF / rubric rewards)
4. Preference tuning / offline RL on logged trajectories

And the thing that makes this different from normal ML — reward hacking. Optimize a proxy and the agent games the proxy. With language it's slippery: it learns to SOUND like it met the rubric without doing the work. So: humans own the reward definition, offline eval gates every promotion, canary + regression gates catch the gaming.

Learning from production is the PAYOFF for the boring earlier work: you can't learn from traces you didn't capture, can't reward what you can't measure, can't safely act on what you learned without recoverability.

Full breakdown 👇
https://shiladitya-ai.github.io/building-agents-that-ship/blog-7-learning.html

Part 7 of "Building Agents That Ship." How long did you ride prompt-tuning before it plateaued?

#AgenticAI #GenAI #RLHF #TechLeadership #MLOps #AIArchitecture

---

## Post C — Micro-post (second wave, optional)

Your agent's system prompt is 5 pages long and getting worse.

That's not a prompting problem. It's a learning problem.

Hand-editing a prompt to fix behavior is machine learning done by hand — you're the optimizer, the text file is the weights. It plateaus.

Meanwhile every human correction, override, and eval score is a labeled example of "better" — and you're throwing it all away.

Close the loop:
traces → eval labels → reward → policy update → offline gate → canary → promote.

One warning: reward hacking. An agent optimizes the reward, not your intent. Humans own the reward definition. Independent eval gates every promotion.

An agent that can only improve by editing its prompt has a ceiling.

Full post 👇
https://shiladitya-ai.github.io/building-agents-that-ship/blog-7-learning.html

#AgenticAI #RLHF #AIEngineering

---

## Carousel outline (8 slides — matches carousel-7-learning.pdf)

1. **Cover:** "The prompt was five pages long." — Part 7: Learning from Production (RL)
2. **The story:** every failure → another rule → 5-page prompt that stopped helping (whack-a-mole)
3. **The reframe:** hand-editing a prompt IS machine learning — done badly, by hand. It plateaus.
4. **The wasted signal:** traces, human overrides, eval outcomes, guardrail hits — thrown away
5. **The ladder:** prompt edits → learn into memory → reward modeling (RLHF/RLAIF) → preference tuning/offline RL
6. **Close the loop:** traces → eval labels → reward → policy → offline gate → canary → promote → repeat
7. **The danger:** reward hacking — the agent games the grader; humans own the reward definition
8. **The gift + CTA:** learning-from-production loop + readiness checklist → link

---

### Posting tips
- Lead with the two-line hook; everything after "…see more" is bonus.
- Post the blog link as the first comment for reach; test in-body too.
- Tue–Thu, 8–10am your readers' time works well for technical audiences.
- The "five-page prompt" hook is highly relatable — invite people to share their prompt-length horror stories.
- Tie back in a comment ("Parts 2–4 make it work; this is how it gets BETTER →") to pull readers through the series.
