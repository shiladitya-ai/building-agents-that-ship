# Flagship White Paper — Detailed Outline

**Title:** Production-Grade Agentic AI for High-Stakes Enterprise Workflows
**Subtitle:** A maturity, reliability, and accountability framework for teams moving agents from demo to production
**One-line thesis:** *Autonomy without recoverability, evaluation, and accountability is a liability.*
**Length target:** 18–24 pages | **Audience:** senior engineers, architects, EMs, technical decision-makers

---

## 0. Executive summary (~1 page)
- The uncomfortable truth: capability demos are easy; production quality is not.
- The thesis in one sentence + the four gifts: the 2-axis Agentic Maturity Model, the reference
  architecture, the reliability pattern catalog, and the closed-loop self-healing/learning model.

## 1. The tension: the agent that broke a tenant (~1.5 pages)
- Open on human stakes (anonymized): a multi-step onboarding agent that failed mid-flow and left
  external state half-mutated — invisible in every benchmark and demo.
- Reframe: **onboarding a customer is a distributed transaction, not a chat.**
- *Citations:* Garcia-Molina & Salem, "Sagas" (1987) [distributed-transaction framing];
  "How Fast Do Agents Rot?" (arXiv:2609.01660) [empirical long-horizon degradation];
  Cognition, "Don't Build Multi-Agents" (2025) [compounding errors].

## 2. Why production agentic AI is hard (~2 pages)
- Non-determinism, compounding error, unbounded action space over real systems.
- **Empirical anchor:** task success follows a *geometric law* — success ≈ r^H for per-step
  reliability r over horizon H; r saturates below 1 even for frontier models, so long horizons
  collapse. On genuinely agentic tool-use, models fell from near-perfect to near-zero within ~16
  steps (arXiv:2609.01660, 10,664 trajectories). This is the quantitative spine of the whole paper.
- The four things demos skip: failure, state, scale, security.
- The three things teams under-invest in: **evaluation, accountability, learning.**
- Takeaway: quality is engineered, not prompted — and reliability must be *budgeted* per horizon.
- *Citations:* "How Fast Do Agents Rot?" (arXiv:2609.01660) [geometric degradation law];
  Anthropic, "Building Effective Agents" (2024) [latency/cost trade-off; when NOT to];
  Xi et al., LLM-agents survey (arXiv:2309.07864).

## 3. The Agentic Maturity Model — two axes (~3.5 pages)  ← contribution #1
- **Axis A — Autonomy (L0–L5):** definition, human role, required controls, blast radius per level.
- **Axis B — Capability dimensions (mature independently 1→5):** Reliability, Evaluation/Quality,
  Accountability, Learning/RL, Self-Healing.
- **The governing rule:** autonomy must never exceed the weakest capability dimension.
- Insert: maturity model diagram + both tables.
- Anti-pattern: high autonomy on immature evaluation/accountability ("autonomy theater").
- *Citations:* SAE J3016 (levels of driving automation) [autonomy-levels analogy]; CMMI [capability
  maturity analogy] — attribute both honestly as inspirations, not sources.

## 4. Reference architecture for production agents (~3 pages)  ← contribution #2
- Layered view: Governance/HITL, Agent Core (planner/executor/memory), Orchestration,
  Reliability control plane, least-privilege Tool Layer, Observability & Eval (cross-cutting).
- Walk the onboarding flow end to end through the architecture.
- Insert: reference architecture diagram.
- Principles: idempotency by default, least privilege, observability first, human-gated escalation.
- *Citations:* Yao et al., "ReAct" (arXiv:2210.03629) [planner/executor loop]; Packer et al.,
  "MemGPT" (arXiv:2310.08560) [tiered memory]; Anthropic, "Building Effective Agents" (2024)
  [augmented-LLM building block; keep it simple].

## 5. Reliability pattern catalog (~2.5 pages)  ← contribution #3
- Idempotent tool calls; compensation/sagas; checkpoint/resume; circuit breakers & bulkheads;
  confidence gating & HITL escalation; fallback & graceful degradation.
- **Reliability budgeting (new pattern):** given a target success and a horizon H, back out the
  required per-step reliability r (success ≈ r^H); if r is unreachable, *shorten the horizon* —
  decompose, checkpoint, or insert human gates — rather than hope. Turns the geometric degradation
  law (arXiv:2609.01660) into a design-time control.
- Each: problem → mechanism → onboarding example → when to use.
- *Citations:* Garcia-Molina & Salem, "Sagas" (1987); Nygard, "Release It!" (2018) [circuit
  breakers, bulkheads]; Google SRE book (2016) [error budgets, MTTR]; "How Fast Do Agents Rot?"
  (arXiv:2609.01660) [reliability budgeting]; "Memory as Infrastructure" (arXiv:2609.05510).

## 6. Quality & evaluation — the measurement backbone (~3 pages)  ← new emphasis
- Why eval is the gate for scale and autonomy: no measurement, no trust, no promotion.
- **Offline:** golden datasets, trajectory eval vs. output eval, LLM-as-judge pitfalls,
  rubric/verifier scoring, regression suites in CI/CD.
- **Online:** guardrail metrics, canary/shadow deployment, live trajectory sampling,
  auto-gating on regression, cost & latency SLOs.
- **Horizon-aware evaluation (blend):** report success as a function of horizon and a per-step
  reliability r, not a single aggregate pass-rate — aggregate metrics hide production collapse
  (arXiv:2609.01660).
- **Dual-horizon diagnostics (blend, from ATLAS arXiv:2608.30685):** evaluate at the *request
  horizon* (trajectory-wise — localize WHERE a deficiency arises) and the *interaction horizon*
  (user-wise — does service stay aligned across continued interaction over time).
- **Calibrate-then-distill judges (blend, ATLAS):** calibrate LLM-judge interfaces against
  high-confidence ground-truth logs, then distill to cheap, low-latency diagnostic models — a
  concrete answer to judge reliability AND cost/latency SLOs.
- Eval as the promotion gate between autonomy levels.
- Pointer to series piece #3.
- *Citations:* Zheng et al., "MT-Bench / LLM-as-a-Judge" (arXiv:2306.05685) [judge + its biases];
  "LLM-as-a-Judge Is Not an Oracle" (arXiv:2609.02246) [deterministic guardrails on judges];
  "ATLAS" (arXiv:2608.30685) [dual-horizon diagnostics; calibrate-then-distill; replay→policy];
  Yao et al., "τ-bench" (arXiv:2406.12045) [pass^k reliability eval]; "How Fast Do Agents Rot?"
  (arXiv:2609.01660) [horizon-aware eval]; "From Holistic Evaluation to Structured Criteria"
  (arXiv:2606.08625) [rubric scoring]; AgentBench / SWE-bench / WebArena / GAIA [benchmark cluster].

## 7. Accountability & auditability (~2.5 pages)  ← new emphasis
- Every action must be **attributable** (who/what/why), **auditable** (immutable trace),
  **explainable** (decision rationale), **replayable** (deterministic trace replay), and **owned**.
- Trace schema: decision → tool call → inputs/outputs → confidence → approver → outcome.
- Responsibility model: who owns an autonomous agent's action? Governance + policy + consent.
- Pointer to series piece #4.
- *Citations:* Greshake et al., "Indirect Prompt Injection" (arXiv:2302.12173) [attack surface];
  OWASP Top 10 for LLM Applications; NIST AI Risk Management Framework (2023) [governance,
  accountability]; Simon Willison, prompt-injection series [practitioner corroboration].

## 8. Learning from production — reinforcement learning done safely (~3 pages)  ← new emphasis
- Why prompt-only systems plateau; production-grade systems compound quality from operational signal.
- **Signal sources:** traces, human approvals/edits, eval outcomes, guardrail hits, task success,
  customer outcomes.
- **Techniques:** RLHF, RLAIF, reward modeling, verifier/rubric rewards, offline RL from logged
  trajectories, DPO-style preference tuning.
- **Guardrails:** reward-hacking defense, offline eval before promotion, canary/shadow, HITL on
  reward labels, regression gates.
- The virtuous loop: better eval → better reward signal → better policy → better outcomes.
- **Production proof point (blend, ATLAS arXiv:2608.30685):** diagnostic signals feed replay-based
  policy improvement + online A/B, yielding concurrent gains in engagement, business outcomes, and
  human-audit quality — real evidence the eval→reward→policy loop works at scale.
- Pointer to series piece #7.
- *Citations:* Christiano et al. (arXiv:1706.03741) [preferences + reward hacking]; Ouyang et al.,
  "InstructGPT/RLHF" (arXiv:2203.02155); Bai et al., "Constitutional AI/RLAIF" (arXiv:2212.08073);
  Rafailov et al., "DPO" (arXiv:2305.18290); Shinn et al., "Reflexion" (arXiv:2303.11366);
  Madaan et al., "Self-Refine" (arXiv:2303.17651); Wang et al., "Voyager" (arXiv:2305.16291);
  "Survey on Rubric-Guided RL" (arXiv:2608.27505) [verifier rewards, linguistic reward hacking];
  "Self-Evolving Agents" survey (arXiv:2608.18104).

## 9. Self-healing & semi-autonomous recovery (~3 pages)  ← new emphasis
- Recovery as a system property, not a pager.
- **The closed loop:** Detect → Diagnose → Remediate → Verify → Learn.
- **Semi-autonomous:** system proposes a remediation, human approves (safe default for L2–L3).
- **Autonomous:** system executes remediation within a bounded blast radius, escalates on low
  confidence (earned at L4–L5).
- Detection (anomaly + eval signals), diagnosis (root-cause + trajectory replay), remediation
  (compensation, rollback, re-plan), verification (post-condition eval), learning (feed RL signal).
- **Diagnosis localization (blend, ATLAS arXiv:2608.30685):** trajectory-wise diagnostic signals
  with explicit evidence scopes pinpoint WHERE in the execution a deficiency arose — turning
  "it failed" into "step 7's licensing call failed because X," which is what makes auto-remediation safe.
- Insert: self-healing loop diagram.
- Pointer to series piece #8.
- *Citations:* Google SRE book (2016) [MTTR, self-healing ops]; Shinn et al., "Reflexion"
  (arXiv:2303.11366) + Madaan et al., "Self-Refine" (arXiv:2303.17651) [self-correction loop];
  "ATLAS" (arXiv:2608.30685) [diagnostic localization]; "Self-Evolving Agents" survey
  (arXiv:2608.18104); "How Fast Do Agents Rot?" (arXiv:2609.01660) [why drift detection matters].

## 10. Anti-patterns & trade-offs — "when NOT to" (~1 page)
- Autonomy theater; eval by vibes; unaccountable automation; reward hacking; premature multi-agent;
  memory hoarding; unbounded tools. Cost/latency realism.
- **Context-truncation trap (blend):** bounding the context window to save tokens *steepens*
  long-horizon decay (−0.69 vs −0.44 logit slope) rather than helping — degradation is driven by
  step count, not context length (arXiv:2609.01660). Decompose the horizon instead.
- **Aggregate pass-rate illusion (blend):** a high benchmark pass-rate can hide production collapse
  (0.42 → 0.24 as horizon grows); report horizon-aware metrics.
- *Citations (cite as a balanced pair):* Cognition, "Don't Build Multi-Agents" (2025) [fragility
  from un-shared context] AND Anthropic, "Multi-Agent Research System" (2025) [when it works, but
  ~15× token cost] — the contrast is the seniority signal. Plus "How Fast Do Agents Rot?"
  (arXiv:2609.01660) [context-truncation trap; pass-rate illusion].

## 11. Case vignette (anonymized) (~1.5 pages)
- Generalized walk-through: an enterprise onboarding workflow taken from L1 → L4 by maturing
  reliability, evaluation, accountability, and self-healing in order.
- Before/after: failure rate, recovery time (MTTR), human touch, eval coverage, trust.

## 12. Call to action + maturity self-assessment (~1 page)  ← the gift
- 2-axis self-assessment scorecard (lead magnet).
- Where to go next in the series; link to the GitHub repo.

---

## Anchor artifacts
- `autonomy-maturity-model.svg` — 2-axis maturity visual
- `reference-architecture.svg` — layered production architecture
- `self-healing-loop.svg` — closed-loop detect→diagnose→remediate→verify→learn
- Maturity rubric tables (Axis A + Axis B, reused in §3)
