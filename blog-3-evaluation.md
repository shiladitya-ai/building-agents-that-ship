---
title: "The Agent Said the Tenant Was Ready. It Wasn’t."
---

# The Agent Said the Tenant Was Ready. It Wasn't.

*Building Agents That Ship — Part 3: The Evaluation Gap*

---

An agent looked at a customer's environment and declared it ready to migrate.

It read the config. It checked the licenses. It scanned the mailboxes. Then it wrote a confident, well-formatted, entirely reasonable-sounding assessment: *green light, proceed.*

We proceeded. Halfway through the migration, we discovered a class of accounts the agent had never actually verified — it had *inferred* they were fine because the sample it looked at was fine. The report read beautifully. It was also wrong. And nobody caught it, because the only test we had run on that judgment was "does it look right?"

That's the evaluation gap. And it's the quietest, most expensive failure in production AI.

**The one line to remember:** *You cannot ship judgment you cannot measure.*

We spent Part 2 making agents *fail safely*. That protects you when an action breaks. But an assessment doesn't break — it just quietly lies, in fluent prose, and you find out three steps later. Reliability keeps a bad *action* from corrupting state. Evaluation keeps a bad *judgment* from ever shipping. You need both.

---

## Why "it looked right" is not a test

A readiness assessment is the hardest kind of task to prove correct, because there's no exception, no stack trace, no red X. The output is confident either way. The failure mode isn't a crash — it's **confidently wrong**, and confidence is exactly what makes it dangerous.

Three traps make this worse than it looks:

- **Fluency reads as correctness.** A well-written wrong answer is more persuasive than a clumsy right one. Human reviewers rubber-stamp polish.
- **The demo set is not the world.** An agent that scores 95% on your curated examples will meet inputs in production that your examples never covered — and you won't know until it's live.
- **The aggregate score hides the collapse.** A single pass-rate number averages away the cases where the agent quietly falls apart, especially over long horizons ([*"How Fast Do Agents Rot?", arXiv:2609.01660*](https://arxiv.org/abs/2609.01660)).

Evaluation is not a phase you run at the end. It's the **gate that governs every promotion to more autonomy.** No gate, no autonomy — full stop.

---

## Score the journey, not just the destination

The single biggest upgrade most teams can make: stop scoring only the final answer, and start scoring the **trajectory** — the path the agent took to get there.

Two agents can reach the same "ready: yes" and be worlds apart. One actually verified every account class. The other checked a sample and guessed. Same output. Wildly different risk. If you only score the destination, you can't tell them apart — and the guesser will pass your eval every time, right up until it doesn't.

Trajectory evaluation asks: did the agent gather the evidence a correct answer *requires*? Did it skip a step? Did it verify or infer? This is exactly the shift production teams are converging on — evaluating both the immediate request (where in the path did a deficiency arise?) and the longer interaction over time ([*ATLAS, arXiv:2608.30685*](https://arxiv.org/abs/2608.30685)).

---

## Offline gate, online guardrail

Mature evaluation has two faces, and you need both.

**Offline** — before you ship:
- **Golden datasets** of real, messy, labeled cases — including the edge cases that burned you.
- **Regression suites in CI**: every change re-runs the set; a drop blocks the merge.
- **Trajectory scoring**, not just final-answer scoring.
- **Reliability-aware metrics**: run the same case *k* times and measure how often it holds up. Consistency *is* a quality metric ([*τ-bench, arXiv:2406.12045*](https://arxiv.org/abs/2406.12045)).

**Online** — once it's live:
- **Canary and shadow** deployments before full rollout.
- **Guardrail metrics** on live traffic (escalation rate, disagreement with humans, cost, latency).
- **Horizon-aware reporting**: success as a function of steps, not one flattering average.

---

## On using an LLM to judge an LLM

It's tempting — and often necessary — to have a model grade the agent's work. It scales in a way human review never will. But an LLM judge is a *measuring instrument*, and an uncalibrated instrument lies with confidence.

LLM judges carry known, documented biases: they favor the first option, reward verbosity, and prefer their own style ([*Zheng et al., MT-Bench, arXiv:2306.05685*](https://arxiv.org/abs/2306.05685)). So treat the judge like any instrument:

1. **Calibrate it** against high-confidence ground-truth labels before you trust it.
2. **Distill it** into a cheap, fast model once calibrated, so you can afford to run it continuously ([*ATLAS, arXiv:2608.30685*](https://arxiv.org/abs/2608.30685)).
3. **Backstop it** with deterministic checks. An LLM judge is not an oracle; pair it with hard rules for the things that must never be wrong ([*"LLM-as-a-Judge Is Not an Oracle", arXiv:2609.02246*](https://arxiv.org/abs/2609.02246)).
4. **Prefer rubrics over vibes.** A structured rubric — explicit criteria, explicit evidence — is more stable and harder to game than a holistic "rate this 1–10" ([*rubric-guided RL, arXiv:2608.27505*](https://arxiv.org/abs/2608.27505)).

---

## The most underrated feature: knowing when it doesn't know

Evaluation isn't only how you test the agent offline. It's also how the agent tests *itself* at runtime.

Give the assessment agent a **confidence threshold**. Below it, the agent doesn't file a green-light report — it escalates: *"I couldn't verify account class X; a human should check before we proceed."* That single behavior would have caught our opening story. An agent that says "I'm not sure" is worth more than one that's confidently wrong, because the confidently-wrong one costs you a failed migration and the trust you can't easily win back.

Confidence gating is where offline evaluation and runtime safety meet: the same measurement discipline that gates your *releases* also gates the agent's *individual decisions*.

---

## When NOT to over-invest

Honesty check — not every agent needs a full eval harness:

- **Low-stakes, easily-reversible outputs** (draft an email, suggest a title). A human is already in the loop; ship and iterate.
- **Deterministic tasks** with a known-correct answer — that's a unit test, not an eval harness. Don't over-engineer.
- **Throwaway prototypes.** Learn first, build the harness when the thing is going to production.

The trade-off is real: golden sets, trajectory scoring, and calibrated judges are ongoing work, not a one-time setup. Spend the effort where a *confidently wrong* answer actually costs you — judgment tasks, high stakes, long horizons. That's exactly where the readiness-assessment archetype lives.

---

## Your gift: the evaluation readiness checklist

Before you trust an agent's judgment in production, walk this list:

- [ ] **You have a golden dataset** of real, labeled cases — including the edge cases that bit you.
- [ ] **Regression eval runs in CI** and can block a release on a score drop.
- [ ] **You score trajectories**, not just final answers.
- [ ] **You measure consistency** (same input, k runs) — not just a single pass.
- [ ] **Any LLM judge is calibrated** against ground truth and backstopped by deterministic checks.
- [ ] **You report success by horizon**, not one aggregate number.
- [ ] **The agent has a confidence threshold** that escalates instead of guessing.
- [ ] **Live guardrail metrics** (escalation rate, human disagreement, cost, latency) are watched in production.

If you can't check these, you're not measuring judgment — you're hoping. And hope doesn't gate autonomy.

---

## The takeaway

Reliability keeps a broken action from corrupting the world. Evaluation keeps a broken *judgment* from ever leaving the building. The first fails loudly; the second fails silently, in fluent prose, three steps downstream.

"It looked right" is not a test. Golden sets, trajectory scoring, calibrated judges, and a confidence threshold are. Quality is engineered, not prompted — and you can't grant an agent autonomy over judgment you never learned to measure.

---

*This is Part 3 of "Building Agents That Ship." Part 1 laid out the flagship framework (the two-axis Agentic Maturity Model). Part 2 covered reliability and safe failure. Next up, Part 4: Accountability & Auditability — every agent action must be attributable and replayable.*

*Views are my own. All scenarios are anonymized, generalized enterprise archetypes.*

---

## References & further reading

1. *"How Fast Do Agents Rot? An Empirical Study of Long-Horizon Degradation in LLM Agents for Production Decision-Making."* arXiv:2609.01660, 2026 — https://arxiv.org/abs/2609.01660 *(preprint)*
2. W. Chen et al., *"ATLAS: Dual-Horizon Diagnostic Evaluation for Industrial Tool-Use Agents."* arXiv:2608.30685, 2026 — https://arxiv.org/abs/2608.30685 *(preprint)*
3. L. Zheng et al., *"Judging LLM-as-a-Judge with MT-Bench and Chatbot Arena."* arXiv:2306.05685, 2023 — https://arxiv.org/abs/2306.05685
4. S. Yao et al., *"τ-bench: A Benchmark for Tool-Agent-User Interaction in Real-World Domains."* arXiv:2406.12045, 2024 — https://arxiv.org/abs/2406.12045
5. *"LLM-as-a-Judge Is Not an Oracle: Why Self-Improving Agents Need Deterministic Guardrails."* arXiv:2609.02246, 2026 — https://arxiv.org/abs/2609.02246 *(preprint)*
6. *"A Survey on Rubric-Guided Reinforcement Learning for Language Models."* arXiv:2608.27505, 2026 — https://arxiv.org/abs/2608.27505 *(preprint)*
