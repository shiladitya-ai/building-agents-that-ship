# References & Prior Art — Evidence Base for the Series

Curated, credible sources that back the framework's core claims. Each entry notes **how it
supports our thinking** so it can be cited as inspiration or corroboration. Grouped by the five
load-bearing themes plus foundations. Verify exact titles/authors at the linked source before
formal publication.

---

## 0. Foundations — agent architecture & "when (not) to"
- **Yao et al., "ReAct: Synergizing Reasoning and Acting in Language Models" (2022).** [arXiv:2210.03629](https://arxiv.org/abs/2210.03629).
  → Backs the planner/executor loop at the heart of the reference architecture.
- **Anthropic, "Building Effective Agents" (Dec 2024).** [anthropic.com/engineering/building-effective-agents](https://www.anthropic.com/engineering/building-effective-agents).
  → Backs "start simple, add complexity only when warranted"; workflows vs. agents distinction;
  agents trade latency/cost for capability. Direct support for our anti-pattern section.
- **Xi et al., "The Rise and Potential of LLM-based Agents: A Survey" (2023).** [arXiv:2309.07864](https://arxiv.org/abs/2309.07864).
  → Broad landscape reference for the "agents are hard in production" framing.
- **SAE International, "J3016: Levels of Driving Automation."** [sae.org/standards/content/j3016_202104](https://www.sae.org/standards/content/j3016_202104/).
  → Inspiration/analogy for our Autonomy Maturity Model (L0–L5) — autonomy as graded levels,
  each with different human-oversight requirements.

## 1. Reliability & safe failure (distributed-systems lineage)
- **Garcia-Molina & Salem, "Sagas" (ACM SIGMOD, 1987).** [doi.org/10.1145/38713.38742](https://doi.org/10.1145/38713.38742).
  → Foundational basis for compensation/rollback of multi-step operations — our "onboarding is a
  distributed transaction" thesis and the saga pattern in the reliability catalog.
- **Michael Nygard, "Release It!" (2nd ed., 2018).** [pragprog.com/titles/mnee2](https://pragprog.com/titles/mnee2/release-it-second-edition/).
  → Circuit breakers, bulkheads, timeouts, stability patterns — directly reused in the reliability plane.
- **Beyer et al. (Google), "Site Reliability Engineering" (2016), [sre.google/books](https://sre.google/books/).**
  → Error budgets, MTTR, toil reduction, self-healing operations — backs SLOs and self-healing framing.
- **Cognition, "Don't Build Multi-Agents" (2025).** [cognition.com/blog/dont-build-multi-agents](https://cognition.ai/blog/dont-build-multi-agents).
  → "Compounding errors" over long-running agents and context engineering as the #1 reliability job —
  strong corroboration of our reliability + long-horizon argument.

## 2. Quality & evaluation
- **Zheng et al., "Judging LLM-as-a-Judge with MT-Bench and Chatbot Arena" (2023).** [arXiv:2306.05685](https://arxiv.org/abs/2306.05685).
  → Backs LLM-as-judge *and* its pitfalls (position/verbosity/self bias) — our "eval, not vibes" section.
- **Yao et al., "τ-bench: A Benchmark for Tool-Agent-User Interaction" (2024).** [arXiv:2406.12045](https://arxiv.org/abs/2406.12045).
  → Reliability-aware eval (pass^k over repeated trials) — supports trajectory eval + consistency-as-quality.
- **Liu et al., "AgentBench: Evaluating LLMs as Agents" (2023).** [arXiv:2308.03688](https://arxiv.org/abs/2308.03688).
- **Jimenez et al., "SWE-bench" (2023).** [arXiv:2310.06770](https://arxiv.org/abs/2310.06770).
- **Zhou et al., "WebArena" (2023).** [arXiv:2307.13854](https://arxiv.org/abs/2307.13854).
- **Mialon et al., "GAIA: A Benchmark for General AI Assistants" (2023).** [arXiv:2311.12983](https://arxiv.org/abs/2311.12983).
  → The benchmark cluster backs "evaluation is a first-class, measurable discipline for agents."

## 3. Accountability, security & governance
- **Greshake et al., "Not What You've Signed Up For: Compromising Real-World LLM-Integrated
  Applications with Indirect Prompt Injection" (2023).** [arXiv:2302.12173](https://arxiv.org/abs/2302.12173).
  → Backs the tool-calling attack surface + confused-deputy risks in the security section.
- **OWASP, "Top 10 for LLM Applications" (2023/2025).** [owasp.org/www-project-top-10-for-large-language-model-applications](https://owasp.org/www-project-top-10-for-large-language-model-applications/).
  → Industry-standard risk taxonomy — least privilege, injection, excessive agency.
- **Simon Willison, "Prompt injection" series.** [simonwillison.net/series/prompt-injection/](https://simonwillison.net/series/prompt-injection/).
  → Widely-cited practitioner analysis; good for accessible corroboration.
- **NIST, "AI Risk Management Framework (AI RMF 1.0)" (2023).** [nist.gov/itl/ai-risk-management-framework](https://www.nist.gov/itl/ai-risk-management-framework).
  → Backs the accountability/governance argument: attributable, auditable, owned actions.

## 4. Learning / reinforcement learning
- **Christiano et al., "Deep Reinforcement Learning from Human Preferences" (2017).** [arXiv:1706.03741](https://arxiv.org/abs/1706.03741).
  → Foundational reward-modeling-from-preferences; also seeds the reward-hacking caution.
- **Ouyang et al., "Training Language Models to Follow Instructions with Human Feedback"
  (InstructGPT, 2022).** [arXiv:2203.02155](https://arxiv.org/abs/2203.02155).
  → The canonical RLHF reference for our learning-from-signal section.
- **Bai et al., "Constitutional AI: Harmlessness from AI Feedback" (2022).** [arXiv:2212.08073](https://arxiv.org/abs/2212.08073).
  → RLAIF — AI-feedback rewards, backs scalable learning signal.
- **Rafailov et al., "Direct Preference Optimization" (2023).** [arXiv:2305.18290](https://arxiv.org/abs/2305.18290).
  → DPO — simpler preference tuning; part of our "methods" toolbox.
- **Shinn et al., "Reflexion: Language Agents with Verbal Reinforcement Learning" (2023).** [arXiv:2303.11366](https://arxiv.org/abs/2303.11366).
- **Madaan et al., "Self-Refine: Iterative Refinement with Self-Feedback" (2023).** [arXiv:2303.17651](https://arxiv.org/abs/2303.17651).
- **Wang et al., "Voyager: An Open-Ended Embodied Agent with LLMs" (2023).** [arXiv:2305.16291](https://arxiv.org/abs/2305.16291).
  → These three back the closed-loop "learn from your own traces / self-improve" model — the
  conceptual bridge from eval signal to policy improvement.

## 5. Memory, context & self-healing loop
- **Packer et al., "MemGPT: Towards LLMs as Operating Systems" (2023).** [arXiv:2310.08560](https://arxiv.org/abs/2310.08560).
  → Backs tiered memory (working/episodic/semantic) in the Agent Core.
- **Park et al., "Generative Agents: Interactive Simulacra of Human Behavior" (2023).** [arXiv:2304.03442](https://arxiv.org/abs/2304.03442).
  → Memory stream + reflection — supports long-horizon state management.
- **Beyer et al. (Google SRE, above)** + **Reflexion/Self-Refine (above)** jointly back the
  Detect→Diagnose→Remediate→Verify→Learn self-healing loop.

## 6. Multi-agent — the balanced view (help vs. hurt)
- **Anthropic, "How We Built Our Multi-Agent Research System" (2025).**
  [anthropic.com/engineering/multi-agent-research-system](https://www.anthropic.com/engineering/multi-agent-research-system).
  → Backs *both* sides: multi-agent excels on breadth-first parallel work, BUT uses ~15× the tokens
  of chat and is a poor fit when agents must share context / have dependencies.
- **Cognition, "Don't Build Multi-Agents" (2025).** [cognition.com/blog/dont-build-multi-agents](https://cognition.ai/blog/dont-build-multi-agents).
  → The contrarian case — fragility from un-shared context. Cite these two together for a nuanced,
  senior "when not to" argument.

---

## How to use these
- **Corroboration, not authority-borrowing:** cite to show your framework aligns with the field,
  then add your production-grade synthesis (maturity model, control plane) as the novel contribution.
- **Balance pairs:** always cite the Anthropic + Cognition multi-agent pair together — nuance signals seniority.
- **Attribute honestly:** the maturity model is *inspired by* SAE J3016 and CMMI; say so.
- **Freshness:** re-verify blog URLs and add any newer benchmarks before each publication.

---

## 7. Recent (2026) arXiv — freshest corroboration
Very recent preprints (verify exact IDs/versions at publish time; preprints are not peer-reviewed).
These are strikingly on-thesis and make the paper feel current:
- **"How Fast Do Agents Rot? An Empirical Study of Long-Horizon Degradation in LLM Agents for
  Production Decision-Making" (2026).** [arXiv:2609.01660](https://arxiv.org/abs/2609.01660).
  → **Deep blend.** 9 models (1.2B–671B + 3 proprietary), 10,664 trajectories. Finds task success
  follows a *geometric law* (success ≈ r^H) with a per-step reliability r that saturates below 1,
  so long horizons collapse; agentic tool-use fell from near-perfect to near-zero within ~16 steps.
  Degradation is driven by step count, NOT context length — bounding context *steepens* decay
  (−0.69 vs −0.44). Benchmark→production gap 0.42→0.24 by horizon. Prescribes horizon-aware eval +
  reliability budgeting. Blends into: §2 (empirical spine), §5 (reliability-budgeting pattern),
  §6 (horizon-aware eval), §10 (context-truncation trap + pass-rate illusion), governing rule.
- **"ATLAS: Dual-Horizon Diagnostic Evaluation for Industrial Tool-Use Agents" (Chen et al., 2026).**
  [arXiv:2608.30685](https://arxiv.org/abs/2608.30685).
  → **Deep blend.** Production framework (Meituan Xiaotuan). Evaluates at two horizons: *request*
  (trajectory-wise — localizes WHERE a deficiency arises) and *interaction* (user-wise — does
  service stay aligned over continued interaction). Calibrates LLM judges against ground-truth logs,
  then distills to cheap low-latency diagnostic models; signals have explicit evidence scopes +
  decision boundaries; feeds replay-based policy improvement + online A/B (gains in engagement,
  business outcomes, human-audit quality). Blends into: §6 (dual-horizon eval, calibrate-then-distill),
  §7 (evidence scopes = accountability), §8 (eval→reward→policy proof point), §9 (diagnosis localization).
- **"A Survey on Rubric-Guided Reinforcement Learning for Language Models" (2026).** [arXiv:2608.27505](https://arxiv.org/abs/2608.27505).
  → Rubric/verifier rewards + linguistic reward hacking + alignment reliability — supports §8 (RL).
- **"From Holistic Evaluation to Structured Criteria: Rubrics Across the Evolving LLM Landscape"
  (2026).** [arXiv:2606.08625](https://arxiv.org/abs/2606.08625).
  → Rubric-based evaluation — supports §6 (verifier/rubric scoring).
- **"Self-Evolving Agents as Dynamic Graph Transformation: A Survey and New Perspective" (2026).**
  [arXiv:2608.18104](https://arxiv.org/abs/2608.18104).
  → Self-evolving agents (memory/tools/skills/governance) — supports §8 (learning) + §9 (self-healing).
