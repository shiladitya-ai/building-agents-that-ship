---
title: Building Agents That Ship
---

**A vendor-neutral series on production-grade agentic AI** — reliability, evaluation, accountability, learning, and self-healing for high-stakes enterprise workflows.

> **Thesis of the series:** *Autonomy without recoverability, evaluation, and accountability is a liability.* Autonomy is earned, one capability dimension at a time — never assumed.

Every piece follows the same shape: a real (anonymized) enterprise failure → a universal engineering principle → a reusable "gift" (checklist, rubric, pattern catalog, or diagram). All scenarios are generalized industry archetypes — no customer names, tenant data, or internal metrics.

## The series

| # | Post | Thesis |
|---|------|--------|
| **1** | **Production-Grade Agentic AI** (Flagship whitepaper) | Autonomy without recoverability, eval & accountability is a liability |
| **2** | [Reliability & Safe Failure](blog-2-reliability.html) | State-mutating agents need transactional guarantees LLMs don't give you |
| **3** | [The Evaluation Gap](blog-3-evaluation.html) | You can't ship judgment you can't measure |
| **4** | [Accountability & Auditability](blog-4-accountability.html) | Every agent action must be attributable and replayable |
| **5** | [Context & Memory](blog-5-memory.html) | Long-horizon agents live or die on state, not prompts |
| **6** | [Multi-Agent: Help vs. Hurt](blog-6-multiagent.html) | Most multi-agent systems are premature |
| **7** | [Learning from Production (RL)](blog-7-learning.html) | Agents that only tune prompts plateau |
| **8** | [Self-Healing Systems](blog-8-selfhealing.html) | Recovery should be a system property, not a pager |
| **9** | [Securing the Tool Surface](blog-9-security.html) (Finale) | Every tool is an attack surface |

## The signature contribution: the two-axis Agentic Maturity Model

Autonomy and capability are separate questions. The governing rule is the most important sentence in the series:

> **An agent's autonomy (Axis A) must never exceed its weakest capability dimension (Axis B).**

**Axis A — Levels of Autonomy** (L0 Manual → L5 Full)

![Autonomy Maturity Model L0-L5](autonomy-maturity-model.svg)

**Axis B — Capability Dimensions** (Reliability · Evaluation · Accountability · Learning · Self-Healing, each maturing 1→5)

![Capability Maturity Axis B](capability-maturity-axisB.svg)

## Reference architecture

![Reference architecture](reference-architecture.svg)

---

*Views expressed are the author's own. The maturity model is inspired by — and does not reproduce — SAE J3016 and CMMI. All customer/tenant scenarios are anonymized, generalized industry archetypes.*
