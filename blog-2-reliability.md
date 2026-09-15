---
title: "Your Agent Just Broke a Customer’s Tenant. Now What?"
---

# Your Agent Just Broke a Customer's Tenant. Now What?

*Building Agents That Ship — Part 2: Reliability & Safe Failure*

---

An agent I know onboarded a new enterprise customer flawlessly. In the demo.

Ten steps: create the identities, assign the licenses, configure the domain, wire up DNS, migrate the first batch of data. It sailed through every one. Everybody clapped.

Then we pointed it at a real tenant. It failed at step seven — a licensing call came back in a state nobody had scripted for — and it stopped. Cleanly. Politely. And catastrophically. Because by step seven it had *already* created identities and *already* changed DNS. It just hadn't undone any of it, because nothing had ever told it how.

A human now owned a half-configured tenant that no human had ever touched. Their first job wasn't to finish the onboarding. It was to reverse-engineer what a language model had done to a live customer before they could safely do anything at all.

That's the moment this post is about. Not the model's intelligence — it was plenty smart. The **system around it** offered none of the guarantees the task actually required.

**The one line to remember:** *A state-mutating agent needs transactional guarantees that a language model does not give you for free.*

---

## The reframe that changes everything

Here's the mental shift that unlocks the whole problem:

> **Onboarding a customer is a distributed transaction, not a chat.**

We build agents like conversations — turn, response, turn, response. But a workflow that creates identities, moves licenses, and edits DNS isn't a conversation. It's a sequence of operations that change the real world and must **either complete or be safely unwound**. That's the exact problem databases and distributed systems have wrestled with for forty years.

The good news: once you see it that way, you don't need to invent anything. You get to *borrow* decades of hard-won practice. The reliability of your agent has almost nothing to do with the next model release and almost everything to do with how you wrap it.

---

## First, do the math nobody wants to do

Say each step in your workflow succeeds 95% of the time. Feels fine. Now chain ten of them together where each depends on the last.

0.95<sup>10</sup> ≈ **0.60.**

Your "95% reliable" agent completes a ten-step task about 60% of the time. Two out of five real customers hit a failure. This isn't pessimism — it's just how dependent steps compound, and a recent large empirical study of long-horizon agents put hard numbers on it: success falls off geometrically with the number of steps, per-step reliability saturates *below* 100% no matter how good the model gets, and on genuine tool-use tasks even strong systems collapse toward zero within a couple dozen steps (*"How Fast Do Agents Rot?", arXiv:2609.01660, 2026*).

So flip the question around. Don't ask "how good is my agent?" Ask: **"How reliable does each step have to be for this workflow to work?"** That's your *reliability budget*.

| Steps in the flow | Per-step reliability needed for 95% success | What that means for you |
|---|---|---|
| 5 | ~99.0% | Achievable. Bounded autonomy is reasonable. |
| 20 | ~99.7% | Demands strong tooling. Checkpoint aggressively. |
| 100 | ~99.95% | Almost never achievable end-to-end. Break it up. |

When the budget is unreachable, the answer isn't a better prompt. It's a **shorter horizon**: decompose the flow, add checkpoints, insert a human gate. You spend the budget you have instead of pretending you have more.

*(One counter-intuitive trap from the same research: trimming the context window to save tokens makes long-horizon decay* ***worse****, not better, because the degradation is driven by step count, not context length. The popular cost-saving shortcut is quietly sabotaging your reliability.)*

---

## The reliability pattern catalog

None of these are new. That's the point. Here's the starter set that turns a fragile agent into one that fails safely.

**1. Idempotent tool calls.** Every state-changing tool takes an idempotency key, so a retry can't double-apply an effect. This is the precondition for everything else — without it, "just retry" corrupts state. You can't build safe recovery on tools that aren't safe to call twice.

**2. Compensation & sagas.** Model the workflow as a *saga*: a sequence of steps where each one is paired with a compensating action that semantically undoes it (the pattern comes straight from a 1987 database paper by Garcia-Molina & Salem). "Create identity" pairs with "delete identity." "Assign license" pairs with "release license." Now a failure at step seven can walk *backward* — undoing six, five, four — instead of freezing in place. Your agent no longer strands the customer; it cleans up after itself.

**3. Checkpoint & resume.** Persist durable state at milestones. When something fails, resume from the last good checkpoint instead of restarting from zero. This is what bounds the cost of any single failure — and what makes a 20-step flow survivable at all.

**4. Circuit breakers & bulkheads.** Borrowed from stability engineering (Michael Nygard's *Release It!*): when a downstream dependency starts failing, trip a breaker and stop hammering it, so one sick subsystem doesn't take the whole flow down with it.

**5. Confidence gating & graceful degradation.** When the agent's confidence drops below a threshold, it escalates to a human or falls back to a safer, reduced behavior — instead of confidently pressing on into the unknown. The willingness to *stop and ask* is a feature, not a failure.

Put these together and the step-seven story ends differently: the licensing call fails, the saga unwinds the identity and DNS changes it already made, the flow checkpoints its state, and a human gets a clean escalation that says *"stopped safely at step seven, here's exactly what happened and what was rolled back."* Nobody reverse-engineers anything.

---

## Recovery doesn't have to be a human's job forever

Start semi-autonomous: the agent **proposes** a rollback or a re-plan, and a human approves it. That's the safe default, and it's where most teams should live for a good while.

As your reliability, evaluation, and accountability mature, you can let the agent **execute** recovery on its own — but only within a bounded blast radius, and only escalating when confidence is low. The goal, borrowed from site reliability engineering, is a mean-time-to-recovery that keeps falling as more of the loop is safely automated. Recovery becomes a property of the system, not a line on someone's pager.

But notice the ordering. Autonomy is *earned* by reliability, never assumed before it.

---

## When NOT to do all this

Honesty check, because not every agent needs a saga engine:

- **Read-only or single-step agents.** If your agent doesn't mutate external state, most of this is overkill. Don't build a rollback framework for a search bot.
- **Truly reversible actions.** If undo is trivial and cheap, compensation logic may not earn its complexity.
- **Prototypes and internal tools** with a human watching every step. Ship, learn, *then* harden — just don't quietly promote that prototype to production without adding the guardrails.

The trade-off is real: idempotency keys, compensating actions, and checkpoints are more code, more latency, and more design work. The judgment call is *stakes × horizon × irreversibility.* High on all three? You need this. Low on all three? You don't. The senior move is knowing which agent you're building.

---

## Your gift: the reliability readiness checklist

Before you let an agent run a state-mutating workflow unattended, walk this list:

- [ ] **Every state-changing tool is idempotent** (takes an idempotency key).
- [ ] **Every forward step has a compensating action** defined and tested.
- [ ] **The workflow checkpoints** durable state at milestones and can resume.
- [ ] **External dependencies sit behind circuit breakers.**
- [ ] **The agent has a confidence threshold** that triggers escalation, not guesswork.
- [ ] **You've computed the reliability budget** for the real production horizon — not the demo's.
- [ ] **A mid-flow failure produces a clean, attributable escalation**, not a half-changed world.
- [ ] **Recovery starts semi-autonomous** (human-approved) before it goes autonomous.

If you can't check these, that's not a reason to panic. It's your backlog.

---

## The takeaway

An agent that can *act* but can't *recover* isn't an asset in a high-stakes workflow — it's a liability, and the more autonomy you give it, the bigger the blast radius when it's wrong.

Reliability isn't a smarter model. It's idempotency keys, compensating actions, checkpoints, and the discipline to budget your horizon before you commit to it. Unglamorous engineering. Exactly the kind that separates an agent that demos from an agent that ships.

---

## References & further reading

1. *"How Fast Do Agents Rot? An Empirical Study of Long-Horizon Degradation in LLM Agents for Production Decision-Making."* arXiv:2609.01660, 2026 — https://arxiv.org/abs/2609.01660 *(preprint; verify before formal citation)*
2. H. Garcia-Molina & K. Salem, *"Sagas,"* ACM SIGMOD, 1987 — https://doi.org/10.1145/38713.38742
3. M. Nygard, *Release It! Design and Deploy Production-Ready Software* (2nd ed.), 2018 — https://pragprog.com/titles/mnee2/release-it-second-edition/
4. B. Beyer et al., *Site Reliability Engineering*, Google / O'Reilly, 2016 — https://sre.google/books/
5. Anthropic, *"Building Effective Agents,"* 2024 — https://www.anthropic.com/engineering/building-effective-agents

---

*This is Part 2 of "Building Agents That Ship." Part 1 laid out the flagship framework — the two-axis Agentic Maturity Model and the rule that autonomy must never exceed your weakest capability. Next up, Part 3: The Evaluation Gap — you can't ship judgment you can't measure.*

*Views are my own. All scenarios are anonymized, generalized enterprise archetypes.*
