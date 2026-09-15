# Building Agents That Ship

**A vendor-neutral series on production-grade agentic AI** — reliability, evaluation, accountability, learning, and self-healing for high-stakes enterprise workflows.

### 📖 Read the series online → **[shiladitya-ai.github.io/building-agents-that-ship](https://shiladitya-ai.github.io/building-agents-that-ship/)**

> **Thesis of the series:** *Autonomy without recoverability, evaluation, and accountability is a liability.*
> Autonomy is earned, one capability dimension at a time — never assumed.

Every piece follows the same shape: a real (anonymized) enterprise failure → a universal engineering principle → a reusable "gift" (checklist, rubric, pattern catalog, or diagram). All scenarios are generalized industry archetypes — **no customer names, tenant data, or internal metrics.** The maturity model is inspired by, and does not reproduce, SAE J3016 and CMMI.

*By **Shiladitya Srivastava** — principal engineer / technical architect. Views expressed here are the author's own.*

---

## The series at a glance

| # | Piece | Thesis | Read online | Source & assets |
|---|-------|--------|-------------|-----------------|
| **1** | **Production-Grade Agentic AI** (Flagship) | Autonomy without recoverability, eval & accountability is a liability | *(whitepaper — see below)* | [Whitepaper (.docx)](Production-Grade-Agentic-AI-Whitepaper.docx) · [Outline](flagship-outline.md) |
| **2** | **Reliability & Safe Failure** | State-mutating agents need transactional guarantees LLMs don't give you | 📖 [Read](https://shiladitya-ai.github.io/building-agents-that-ship/blog-2-reliability.html) | [Markdown](blog-2-reliability.md) · [LinkedIn](linkedin-2-reliability.md) · [Carousel](carousel-2-reliability.pdf) |
| **3** | **The Evaluation Gap** | You can't ship judgment you can't measure | 📖 [Read](https://shiladitya-ai.github.io/building-agents-that-ship/blog-3-evaluation.html) | [Markdown](blog-3-evaluation.md) · [LinkedIn](linkedin-3-evaluation.md) · [Carousel](carousel-3-evaluation.pdf) |
| **4** | **Accountability & Auditability** | Every agent action must be attributable and replayable | 📖 [Read](https://shiladitya-ai.github.io/building-agents-that-ship/blog-4-accountability.html) | [Markdown](blog-4-accountability.md) · [LinkedIn](linkedin-4-accountability.md) · [Carousel](carousel-4-accountability.pdf) |
| **5** | **Context & Memory** | Long-horizon agents live or die on state, not prompts | 📖 [Read](https://shiladitya-ai.github.io/building-agents-that-ship/blog-5-memory.html) | [Markdown](blog-5-memory.md) · [LinkedIn](linkedin-5-memory.md) · [Carousel](carousel-5-memory.pdf) · [Diagram](memory-architecture.svg) |
| **6** | **Multi-Agent: Help vs. Hurt** | Most multi-agent systems are premature | 📖 [Read](https://shiladitya-ai.github.io/building-agents-that-ship/blog-6-multiagent.html) | [Markdown](blog-6-multiagent.md) · [LinkedIn](linkedin-6-multiagent.md) · [Carousel](carousel-6-multiagent.pdf) · [Decision tree](multi-agent-decision-tree.svg) |
| **7** | **Learning from Production (RL)** | Agents that only tune prompts plateau | 📖 [Read](https://shiladitya-ai.github.io/building-agents-that-ship/blog-7-learning.html) | [Markdown](blog-7-learning.md) · [LinkedIn](linkedin-7-learning.md) · [Carousel](carousel-7-learning.pdf) · [Learning loop](learning-loop.svg) |
| **8** | **Self-Healing Systems** | Recovery should be a system property, not a pager | 📖 [Read](https://shiladitya-ai.github.io/building-agents-that-ship/blog-8-selfhealing.html) | [Markdown](blog-8-selfhealing.md) · [LinkedIn](linkedin-8-selfhealing.md) · [Carousel](carousel-8-selfhealing.pdf) · [Loop](self-healing-loop.svg) · [Ladder](remediation-ladder.svg) |
| **9** | **Securing the Tool Surface** (Finale) | Every tool is an attack surface | 📖 [Read](https://shiladitya-ai.github.io/building-agents-that-ship/blog-9-security.html) | [Markdown](blog-9-security.md) · [LinkedIn](linkedin-9-security.md) · [Carousel](carousel-9-security.pdf) · [Gateway](tool-surface-gateway.svg) |

**Shape of the series:** 1 flagship whitepaper + 8 installments (9 total). Each piece ships a blog post, a shareable diagram or checklist, and 1–2 LinkedIn posts. *Consistency > volume.*

---

## Start here

- **New to the series?** Read the **[flagship whitepaper](Production-Grade-Agentic-AI-Whitepaper.docx)** — it establishes the two-axis Agentic Maturity Model and the governing rule that ties the whole series together. Its closing **Section 14 ("The Companion Series")** is a reading map: each installment (Parts 2–9) with its thesis and the exact whitepaper section it deepens.
- **Prefer to read online?** The full series is live at **[shiladitya-ai.github.io/building-agents-that-ship](https://shiladitya-ai.github.io/building-agents-that-ship/)**.
- **Want the short version?** Skim the **[flagship outline](flagship-outline.md)**.
- **Building right now?** Jump to the checklists in **[Part 2 — Reliability](https://shiladitya-ai.github.io/building-agents-that-ship/blog-2-reliability.html)** and **[Part 3 — Evaluation](https://shiladitya-ai.github.io/building-agents-that-ship/blog-3-evaluation.html)**.
- **Want the visual version?** Each installment ships an 8-slide **LinkedIn carousel** (4:5 PDF) — see [Carousels](#carousels-linkedin-visual-series) below.

---

## The signature contribution: the two-axis Agentic Maturity Model

Autonomy and capability are separate questions. The model keeps them separate — and the governing rule is the most important sentence in the series:

> **An agent's autonomy (Axis A) must never exceed its weakest capability dimension (Axis B).**

**Axis A — Levels of Autonomy** (L0 Manual → L5 Full)
![Autonomy Maturity Model L0-L5](autonomy-maturity-model.svg)

**Axis B — Capability Dimensions** (Reliability · Evaluation · Accountability · Learning · Self-Healing, each maturing 1→5)
![Capability Maturity - Axis B](capability-maturity-axisB.svg)

---

## Reference architecture & diagrams

| Diagram | What it shows |
|---|---|
| ![Reference architecture](reference-architecture.svg) | **Reference architecture** — a layered control plane with a Learning & Accountability plane and feedback loop. |
| ![Self-healing loop](self-healing-loop.svg) | **Self-healing loop** — Detect → Diagnose → Remediate → Verify → Learn, with guardrail-gated remediation. |

---

## Carousels (LinkedIn visual series)

Each installment has a companion 8-slide carousel (1080×1350, 4:5) for LinkedIn document posts. Same arc every time: a real failure → the reframe → the principle → the reusable gift.

| Part | Carousel | Preview |
|---|---|---|
| 2 · Reliability | [carousel-2-reliability.pdf](carousel-2-reliability.pdf) | ![Part 2 preview](carousel-2-preview.png) |
| 3 · Evaluation | [carousel-3-evaluation.pdf](carousel-3-evaluation.pdf) | ![Part 3 preview](carousel-3-preview.png) |
| 4 · Accountability | [carousel-4-accountability.pdf](carousel-4-accountability.pdf) | *(PDF)* |
| 5 · Context & Memory | [carousel-5-memory.pdf](carousel-5-memory.pdf) | *(PDF)* |
| 6 · Multi-Agent | [carousel-6-multiagent.pdf](carousel-6-multiagent.pdf) | *(PDF)* |
| 7 · Learning from Production | [carousel-7-learning.pdf](carousel-7-learning.pdf) | ![Part 7 preview](carousel-7-preview.png) |
| 8 · Self-Healing | [carousel-8-selfhealing.pdf](carousel-8-selfhealing.pdf) | ![Part 8 preview](carousel-8-preview.png) |
| 9 · Securing the Tool Surface | [carousel-9-security.pdf](carousel-9-security.pdf) | ![Part 9 preview](carousel-9-preview.png) |

Source HTML lives in [`build/`](build/); regenerate any PDF with `node build/render-carousel.js <in.html> <out.pdf>` (Puppeteer, headless).

---

## The five load-bearing themes

Every piece draws on one or more of these:

1. **Reliability & safe failure** — idempotency, sagas/compensation, checkpoints, circuit breakers, reliability budgeting.
2. **Evaluation & quality** — trajectory scoring, offline gate + online guardrail, calibrated LLM judges, horizon-aware & dual-horizon eval.
3. **Accountability & security** — attributable, auditable, replayable actions; least privilege; the tool surface as an attack surface.
4. **Learning from production (RL)** — improving from operational signal under guardrails, not just prompt edits.
5. **Self-healing** — recovery as a system property: detect, diagnose, remediate, verify, learn.

---

## The archetype scenarios (running examples)

Generalized enterprise scenarios reused across the series:

- **Onboarding / provisioning** → reliability, sagas, idempotency, autonomy levels *(Parts 1–2)*
- **Readiness / health assessment** → evaluation, confidence gating, human escalation *(Part 3)*
- **Migration at scale** → multi-agent orchestration, cost/latency, blast-radius control *(Part 6)*
- **Scoped automation over real APIs** → security, least privilege, auditability *(Parts 4, 9)*
- **Long-running customer relationship** → memory, context engineering, state *(Parts 5, 7)*

---

## References

All sources are collected in **[references.md](references.md)**, grouped by theme, each with a clickable link and a note on how it backs the framework. Recent (2026) arXiv preprints are flagged as not-yet-peer-reviewed.

---

## How to read the naming

- **Part 1 is delivered as the whitepaper (.docx)** — there is no `blog-1`.
- **Installments use `blog-N-*` and `linkedin-N-*`** where N is the part number.

---

## License & reuse

The writing and diagrams are shared for the community to learn from. If you quote or adapt the frameworks, an attribution link back to this repository is appreciated. All customer/tenant scenarios are anonymized, generalized industry archetypes.
