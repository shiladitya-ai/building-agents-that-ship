const fs = require("fs");
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, ImageRun,
  Header, Footer, AlignmentType, LevelFormat, TableOfContents, HeadingLevel,
  BorderStyle, WidthType, ShadingType, PageNumber, PageBreak, FootnoteReferenceRun, ExternalHyperlink
} = require("docx");

const DIR = "C:/gitrepo/TechnicalWhitepaper/";
const IMG = DIR + "build/";
const CW = 9360; // content width DXA (US Letter, 1in margins)

// ---------- inline rich text: **bold**, *italic*, [^n] footnotes ----------
const seenFootnotes = new Set();
function makeRuns(text) {
  const runs = [];
  const re = /\*\*(.+?)\*\*|\*(.+?)\*|\[\^(\d+)\]/g;
  let last = 0, m;
  while ((m = re.exec(text))) {
    if (m.index > last) runs.push(new TextRun(text.slice(last, m.index)));
    if (m[1] !== undefined) runs.push(new TextRun({ text: m[1], bold: true }));
    else if (m[2] !== undefined) runs.push(new TextRun({ text: m[2], italics: true }));
    else if (m[3] !== undefined) {
      const id = parseInt(m[3]);
      if (seenFootnotes.has(id)) {
        // Repeat citation of an already-defined footnote: emit a styled superscript
        // marker (Word forbids two footnote references to the same definition id).
        runs.push(new TextRun({ text: String(id), superScript: true, style: "FootnoteReference" }));
      } else {
        seenFootnotes.add(id);
        runs.push(new FootnoteReferenceRun(id));
      }
    }
    last = re.lastIndex;
  }
  if (last < text.length) runs.push(new TextRun(text.slice(last)));
  return runs;
}
const P = (text, opts = {}) => new Paragraph({ children: makeRuns(text), spacing: { after: 140, line: 276 }, ...opts });
const H1 = (text) => new Paragraph({ heading: HeadingLevel.HEADING_1, children: makeRuns(text) });
const H2 = (text) => new Paragraph({ heading: HeadingLevel.HEADING_2, children: makeRuns(text) });
const BULLET = (text) => new Paragraph({ numbering: { reference: "bul", level: 0 }, spacing: { after: 80, line: 276 }, children: makeRuns(text) });
const NUM = (text) => new Paragraph({ numbering: { reference: "num", level: 0 }, spacing: { after: 80, line: 276 }, children: makeRuns(text) });
const GAP = () => new Paragraph({ children: [new TextRun("")], spacing: { after: 60 } });

function img(file, w, h, alt) {
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 120, after: 60 },
    children: [new ImageRun({
      type: "png", data: fs.readFileSync(IMG + file),
      transformation: { width: w, height: h },
      altText: { title: alt, description: alt, name: alt }
    })]
  });
}
function caption(text) {
  return new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 180 },
    children: [new TextRun({ text, italics: true, size: 18, color: "666666" })] });
}

// ---------- table helpers ----------
const brd = { style: BorderStyle.SINGLE, size: 1, color: "BBBBBB" };
const borders = { top: brd, bottom: brd, left: brd, right: brd };
function cell(text, w, opts = {}) {
  const runsArr = Array.isArray(text) ? text : [text];
  return new TableCell({
    borders, width: { size: w, type: WidthType.DXA },
    shading: opts.fill ? { fill: opts.fill, type: ShadingType.CLEAR } : undefined,
    margins: { top: 60, bottom: 60, left: 100, right: 100 },
    children: runsArr.map(t => new Paragraph({
      spacing: { after: 20, line: 240 },
      children: [new TextRun({ text: t, bold: !!opts.bold, size: opts.size || 18,
        color: opts.color || "000000" })]
    }))
  });
}
function headerRow(cells, widths, fill = "1F3864") {
  return new TableRow({ tableHeader: true, children: cells.map((c, i) =>
    cell(c, widths[i], { bold: true, color: "FFFFFF", fill, size: 18 })) });
}
function row(cells, widths, opts = []) {
  return new TableRow({ children: cells.map((c, i) => cell(c, widths[i], opts[i] || {})) });
}

// ================= CONTENT =================
const children = [];

// ---- Title page ----
children.push(new Paragraph({ spacing: { before: 1600, after: 0 }, alignment: AlignmentType.CENTER,
  children: [new TextRun({ text: "Production-Grade Agentic AI", bold: true, size: 56, color: "1F3864", font: "Arial" })] }));
children.push(new Paragraph({ spacing: { before: 60, after: 240 }, alignment: AlignmentType.CENTER,
  children: [new TextRun({ text: "for High-Stakes Enterprise Workflows", bold: true, size: 44, color: "1F3864", font: "Arial" })] }));
children.push(new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 400 },
  children: [new TextRun({ text: "A Reliability, Evaluation, and Accountability Framework for Moving Agents from Demo to Production", italics: true, size: 26, color: "444444" })] }));
// thesis callout
children.push(new Paragraph({
  alignment: AlignmentType.CENTER,
  border: { top: { style: BorderStyle.SINGLE, size: 6, color: "1F3864", space: 8 },
            bottom: { style: BorderStyle.SINGLE, size: 6, color: "1F3864", space: 8 } },
  spacing: { before: 200, after: 200 },
  children: [new TextRun({ text: "Autonomy without recoverability, evaluation, and accountability is a liability.", bold: true, size: 28, color: "1F3864" })] }));
children.push(new Paragraph({ spacing: { before: 600 }, alignment: AlignmentType.CENTER,
  children: [new TextRun({ text: "Author: [Your Name]", size: 24 })] }));
children.push(new Paragraph({ alignment: AlignmentType.CENTER,
  children: [new TextRun({ text: "Technical Architect", size: 22, color: "444444" })] }));
children.push(new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 200 },
  children: [new TextRun({ text: "September 2026  ·  Version 1.0", size: 22, color: "444444" })] }));
children.push(new Paragraph({ children: [new PageBreak()] }));

// ---- Abstract + TOC ----
children.push(H1("Abstract"));
children.push(P("Large language model (LLM) agents now demonstrate remarkable capability, yet the systems that reach production reliably remain a small fraction of those that demo well. The gap is not primarily one of intelligence; it is one of engineering. Agents that take many dependent steps against real systems accumulate error, mutate external state, and fail in ways that no benchmark captures. This paper argues that the defining discipline of production-grade agentic AI is not raw capability but *recoverability, measurability, and accountability*. It contributes a two-axis Agentic Maturity Model that pairs levels of autonomy with independently maturing capability dimensions; a layered reference architecture whose center of gravity is a reliability and learning control plane; a catalog of reliability patterns, including reliability budgeting; and a closed-loop model for self-healing and continuous learning. Throughout, a single archetype \u2014 multi-step enterprise onboarding and provisioning \u2014 grounds the abstractions in a scenario every enterprise recognizes. The framework is vendor-neutral and draws on both established distributed-systems practice and recent empirical evidence on long-horizon agent degradation and production-grade evaluation."));
children.push(new Paragraph({ children: [new PageBreak()] }));
children.push(new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("Contents")] }));
children.push(new TableOfContents("Contents", { hyperlink: true, headingStyleRange: "1-2" }));
children.push(new Paragraph({ children: [new PageBreak()] }));

// ---- 1. Executive Summary ----
children.push(H1("1. Executive Summary"));
children.push(P("Every organization building with LLM agents has felt the same whiplash: a prototype that dazzles in a demo, followed by a production deployment that quietly fails on the third customer, the tenth step, or the second week. The uncomfortable truth is that capability demos are easy and production reliability is hard \u2014 and the two are governed by different disciplines."));
children.push(P("This paper makes one central claim: **autonomy without recoverability, evaluation, and accountability is a liability.** An agent that can act but cannot recover, cannot be measured, and cannot be held to account is not an asset in a high-stakes workflow; it is a risk multiplier. The more autonomy such an agent is granted, the larger the blast radius of its inevitable mistakes."));
children.push(P("To turn that claim into engineering practice, the paper offers four contributions:"));
children.push(NUM("An **Agentic Maturity Model** with two axes \u2014 a familiar autonomy ladder (L0\u2013L5) and, orthogonal to it, five capability dimensions (reliability, evaluation, accountability, learning, self-healing) that each mature on their own timeline. The governing rule: autonomy must never exceed the weakest capability dimension."));
children.push(NUM("A **reference architecture** whose organizing idea is that the reliability, observability, and learning control plane \u2014 not the model \u2014 is the load-bearing structure of a production agent."));
children.push(NUM("A **reliability pattern catalog**, including *reliability budgeting*: sizing the per-step reliability a workflow needs before committing to a horizon."));
children.push(NUM("A **closed-loop model** for self-healing and continuous, reinforcement-driven improvement that treats recovery and learning as system properties rather than human chores."));
children.push(P("The intended reader is a senior engineer, architect, or engineering leader responsible for taking agents from proof-of-concept to dependable production. The takeaways are deliberately vendor-neutral so they survive the next model release and generalize beyond any one platform or organization."));

// ---- 2. The Tension ----
children.push(H1("2. The Tension: When an Agent Breaks a Tenant"));
children.push(P("Consider a concrete, if anonymized, scenario. An agent is asked to onboard a new enterprise customer: create identities, assign licenses, configure domains and DNS, and migrate a first tranche of data. In a demo, it sails through all ten steps. In production, on a real tenant, it fails at step seven \u2014 a licensing call returns an unexpected state \u2014 and stops. It has already created identities and altered DNS. It has not rolled anything back, because nothing told it how. A human now inherits a half-configured tenant that no person actually touched, and must reverse-engineer what the agent did before they can safely continue."));
children.push(P("This failure mode is nearly invisible in the way we usually evaluate agents. Benchmarks score final outputs; they rarely score the *side effects an agent leaves on the world* when it fails midway. Yet in enterprise workflows, those side effects are the whole game. The reframing that follows from this scenario is the intellectual spine of the paper:"));
children.push(new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 100, after: 160 },
  children: [new TextRun({ text: "Onboarding a customer is a distributed transaction, not a chat.", bold: true, size: 26, color: "1F3864" })] }));
children.push(P("Once we see the workflow as a distributed transaction \u2014 a sequence of state-mutating operations that must either complete or be safely unwound \u2014 decades of hard-won distributed-systems practice become directly relevant. The problem is not that the agent is not smart enough. The problem is that the *system around the agent* provides none of the transactional guarantees the task actually requires."));

// ---- 3. Why hard ----
children.push(H1("3. Why Production Agentic AI Is Hard"));
children.push(P("Three structural properties make production agents fundamentally harder than the single-shot LLM calls that preceded them."));
children.push(P("**Non-determinism.** The same input can produce different trajectories. This is a feature for creativity and a liability for operations, where reproducibility underpins testing, debugging, and trust."));
children.push(P("**Compounding error.** An agent that succeeds at each step with probability *r* succeeds at an *H*-step task with probability that falls off geometrically as *r* raised to the power *H*. Recent empirical work puts hard numbers on this intuition: across a large controlled study of many models and thousands of trajectories, agent task success followed a geometric law governed by a single per-step reliability parameter that rises with model scale but saturates well below one \u2014 guaranteeing eventual collapse at sufficiently long horizons.[^6] On genuinely agentic tool-use tasks, even strong, widely deployed systems fell from near-perfect to near-zero within roughly a dozen and a half steps. Two implications matter for architects. First, aggregate benchmark pass-rates systematically overstate production reliability, because production horizons are an order of magnitude longer. Second \u2014 counter-intuitively \u2014 aggressively truncating context to save cost *steepens* the decay rather than easing it, because degradation is driven by step count, not context length. The popular shortcut makes the problem worse."));
children.push(P("**Unbounded action space.** Unlike a chatbot, an agent invokes tools that change real systems: identity providers, license managers, DNS, data stores. Every tool is both a capability and a hazard."));
children.push(P("Layered on top of these are the four things demos routinely skip \u2014 failure, state, scale, and security \u2014 and the three disciplines teams routinely under-invest in: evaluation, accountability, and learning. The rest of this paper is organized around closing exactly those gaps. The one-sentence takeaway: **quality is engineered, not prompted, and reliability must be budgeted per horizon.**"));

// ---- 4. Maturity model ----
children.push(H1("4. The Agentic Maturity Model"));
children.push(P("Progress toward dependable agents is easier to reason about when we separate two questions that are usually conflated: *how much autonomy* an agent has, and *how mature the capabilities* are that make that autonomy safe. The model therefore has two axes."));
children.push(H2("4.1 Axis A \u2014 Levels of Autonomy"));
children.push(P("Borrowing, by analogy, from the graded levels used in driving automation,[^19] we describe six levels of agent autonomy. Each level is defined not only by what the agent does but by the control plane it *requires* to do it safely."));
children.push(img("autonomy-maturity-model.png", 600, 351, "Autonomy maturity model L0 to L5"));
children.push(caption("Figure 1. Axis A \u2014 autonomy levels L0\u2013L5 and the controls each level demands."));
const wA = [900, 1900, 1900, 2760, 1900];
children.push(new Table({ width: { size: CW, type: WidthType.DXA }, columnWidths: wA, rows: [
  headerRow(["Level", "Definition", "Human role", "Controls required", "Blast radius"], wA),
  row(["L0 Manual", "AI assists, human acts", "Operator", "None", "None"], wA, [{bold:true,fill:"D9E2F3"},{},{},{},{color:"1E7B34"}]),
  row(["L1 Copilot", "Suggests each step", "Approves every action", "Per-action gate; audit log", "None"], wA, [{bold:true,fill:"D9E2F3"},{},{},{},{color:"1E7B34"}]),
  row(["L2 Supervised", "Executes; writes gated", "Approves state changes", "HITL on writes; idempotent tools; audit", "Single action"], wA, [{bold:true,fill:"D9E2F3"},{},{},{},{color:"B26A00"}]),
  row(["L3 Bounded", "Multi-step within guardrails", "Approves at checkpoints", "Sagas + rollback; checkpoints; circuit breakers; confidence gating", "Bounded flow"], wA, [{bold:true,fill:"D9E2F3"},{},{},{},{color:"B26A00"}]),
  row(["L4 Conditional", "End-to-end; escalates", "On-call for exceptions", "Full reliability plane; online eval; auto-rollback; anomaly detection", "Flow (contained)"], wA, [{bold:true,fill:"D9E2F3"},{},{},{},{color:"C0392B"}]),
  row(["L5 Full", "Unattended; self-heals", "Governs policy only", "L4 + continuous eval; RL loop; policy governance; blast-radius isolation", "Multi-flow (isolated)"], wA, [{bold:true,fill:"D9E2F3"},{},{},{},{color:"C0392B"}]),
]}));
children.push(GAP());
children.push(H2("4.2 Axis B \u2014 Capability Dimensions"));
children.push(P("Autonomy is only half the picture. Five capabilities determine whether a given level of autonomy is *earned* or reckless. Crucially, each matures on its own timeline, from ad hoc to optimizing."));
children.push(img("capability-maturity-axisB.png", 600, 343, "Capability maturity dimensions matrix"));
children.push(caption("Figure 2. Axis B \u2014 five capability dimensions, each maturing independently from level 1 to 5."));
children.push(P("The two axes combine into a single governing rule, and it is the most important sentence in this paper:"));
children.push(new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 100, after: 160 },
  children: [new TextRun({ text: "An agent\u2019s autonomy must never exceed its weakest capability dimension.", bold: true, size: 26, color: "1F3864" })] }));
children.push(P("A team that grants L4 autonomy while its evaluation capability is still at level 1 (\u201cit looked right\u201d) has not built an autonomous agent; it has built an unmonitored one. We call this **autonomy theater**, and it is the single most common and most dangerous anti-pattern in the field. Maturity is earned by strengthening the weakest dimension, not by adding capability the controls cannot yet support."));

// ---- 5. Reference architecture ----
children.push(H1("5. A Reference Architecture for Production Agents"));
children.push(P("If the maturity model says *what* to strengthen, the reference architecture says *where* those strengths live. The design deliberately places the reliability, observability, and learning machinery at the center rather than treating it as an afterthought bolted onto a model call."));
children.push(img("reference-architecture.png", 580, 427, "Layered reference architecture"));
children.push(caption("Figure 3. Reference architecture: a layered control plane with cross-cutting governance, observability, and a learning & accountability plane."));
children.push(P("The **Agent Core** holds the planner (which decomposes and sequences work, and replans on failure), the executor (which invokes tools, observes results, retries, and verifies), and tiered memory \u2014 working, episodic, and semantic \u2014 whose design is a first-class reliability concern rather than a prompt trick.[^15] The core is built on the well-established pattern of interleaving reasoning and acting.[^4]"));
children.push(P("Beneath it, **orchestration** routes tasks and chooses between a single agent and a supervisor/worker decomposition. The **reliability control plane** \u2014 the heart of the architecture \u2014 supplies idempotency, compensation, checkpoints, circuit breakers, and confidence gating. The **tool layer** exposes only least-privilege, typed, validated adapters to external systems. Two rails run the full height of the system: **governance and human-in-the-loop**, and **observability and evaluation**."));
children.push(P("Finally, a **learning and accountability plane** closes the loop. It houses an immutable audit and trace store, the accountability machinery (attribution, explainability, ownership), a self-healing controller, and the reinforcement-learning loop that feeds operational signal back into policy. The dashed feedback path from this plane into the Agent Core is what makes the system *self-improving* rather than static. The guiding principles are constant across layers: idempotency by default, least privilege, observability first, human-gated escalation, bounded blast radius, and everything attributable and replayable."));

// ---- 6. Reliability catalog ----
children.push(H1("6. The Reliability Pattern Catalog"));
children.push(P("The reliability control plane is assembled from a small set of patterns, most borrowed directly from distributed systems and site reliability engineering and re-applied to agents."));
children.push(BULLET("**Idempotent tool calls.** Every state-mutating tool takes an idempotency key so that a retry cannot double-apply an effect \u2014 the precondition for safe retries."));
children.push(BULLET("**Compensation and sagas.** A long workflow is modeled as a saga: a sequence of steps, each paired with a compensating action that semantically undoes it, so a mid-flow failure can be unwound instead of abandoned.[^1]"));
children.push(BULLET("**Checkpoint and resume.** Durable checkpoints let a long-horizon flow resume from the last good state rather than restart, bounding the cost of any single failure."));
children.push(BULLET("**Circuit breakers and bulkheads.** Borrowed from stability engineering, these contain a failing dependency and prevent one bad subsystem from taking down the whole flow.[^2]"));
children.push(BULLET("**Confidence gating and graceful degradation.** When the agent\u2019s confidence drops below a threshold, it escalates to a human or falls back to a safer, reduced behavior instead of pressing on."));
children.push(H2("6.1 Reliability Budgeting"));
children.push(P("The geometric degradation law[^6] is not only a warning; it is a design tool. If a workflow must succeed with probability *S* over *H* dependent steps, the required per-step reliability is the *H*-th root of *S*. Turning that around gives architects a budget to check *before* committing to an autonomous horizon."));
const wB = [2400, 2400, 4560];
children.push(new Table({ width: { size: CW, type: WidthType.DXA }, columnWidths: wB, rows: [
  headerRow(["Horizon (steps)", "Required per-step reliability for 95% success", "Design implication"], wB),
  row(["5", "\u2248 0.990", "Achievable; L3 bounded autonomy is reasonable."], wB, [{bold:true,fill:"EDEDED"},{},{}]),
  row(["20", "\u2248 0.997", "Demands strong tooling; checkpoint aggressively."], wB, [{bold:true,fill:"EDEDED"},{},{}]),
  row(["100", "\u2248 0.9995", "Rarely achievable end-to-end; decompose into gated sub-flows."], wB, [{bold:true,fill:"EDEDED"},{},{}]),
]}));
children.push(GAP());
children.push(P("The lesson is decisive: when the required per-step reliability is unreachable, the correct response is not optimism but **shortening the horizon** \u2014 decompose the workflow, insert checkpoints, or add human gates \u2014 so that no single autonomous run stretches past what its per-step reliability can support."));

// ---- 7. Evaluation ----
children.push(H1("7. Quality and Evaluation: The Measurement Backbone"));
children.push(P("Evaluation is not a phase that follows development; it is the gate that governs every promotion to greater autonomy. You cannot ship, scale, or trust judgment you cannot measure. Mature evaluation has an offline and an online face."));
children.push(P("**Offline**, teams maintain golden datasets, run regression suites in CI, and \u2014 critically \u2014 score *trajectories*, not just final outputs, because two agents can reach the same answer through wildly different and differently risky paths. Where models judge models, the well-documented biases of LLM-as-judge (position, verbosity, and self-preference) must be measured and corrected rather than trusted,[^8] and judges should be backstopped by deterministic guardrails rather than treated as oracles.[^9]"));
children.push(P("**Online**, guardrail metrics, canary and shadow deployments, live trajectory sampling, and cost and latency service-level objectives keep a deployed agent honest. Two refinements from recent production practice sharpen this further. First, evaluation should be **horizon-aware**: report success as a function of horizon and per-step reliability, not a single aggregate pass-rate that hides eventual collapse.[^6] Second, evaluation should be **dual-horizon** \u2014 assessing both the immediate request trajectory (where in an execution a deficiency arose) and the longer interaction horizon (whether service stays aligned across repeated engagements over time).[^7] To make continuous evaluation affordable, a practical pattern is to *calibrate* an LLM judge against high-confidence ground-truth logs and then *distill* its behavior into a small, low-latency diagnostic model.[^7] The result is a measurement backbone cheap enough to run continuously and trustworthy enough to gate autonomy on."));

// ---- 8. Accountability ----
children.push(H1("8. Accountability and Auditability"));
children.push(P("As autonomy rises, the question \u201cwho is responsible for what this agent did?\u201d moves from philosophical to operational. A production agent must make every action **attributable** (who or what initiated it, and why), **auditable** (recorded in an immutable trace), **explainable** (with a recoverable decision rationale), **replayable** (so a trajectory can be deterministically reconstructed), and **owned** (a named human or team accountable for the behavior)."));
children.push(P("Concretely, this means a trace schema that captures, for each step, the decision, the tool call, its inputs and outputs, the model\u2019s confidence, any human approver, and the outcome. Diagnostic signals should carry explicit evidence scopes and decision boundaries so that an auditor \u2014 or the self-healing controller \u2014 can localize exactly where behavior diverged.[^7] These practices align the system with emerging risk-management guidance for trustworthy AI,[^18] and they are inseparable from security: the same trace that proves accountability is what lets you detect and investigate an attack."));
children.push(P("Security deserves explicit attention because the tool layer is an attack surface. Retrieved content can carry injected instructions, over-privileged tools invite confused-deputy exploits, and an agent that acts on untrusted input can be steered into exfiltration.[^16] The defenses are least privilege by default, scoped consent, rigorous input and output validation, and an industry-standard risk checklist applied to every tool.[^17]"));

// ---- 9. Learning / RL ----
children.push(H1("9. Learning from Production: Reinforcement Learning Done Safely"));
children.push(P("Agents that improve only through hand-edited prompts eventually plateau. Production-grade systems compound quality by learning from their own operational signal \u2014 but they do so under guardrails, because a learning loop without safeguards optimizes for the wrong thing faster than a static one."));
children.push(P("The **signal** is abundant once accountability is in place: execution traces, human approvals and edits, evaluation outcomes, guardrail hits, task success and failure, and downstream customer outcomes. The **methods** are increasingly well understood \u2014 reinforcement learning from human feedback,[^10] reinforcement learning from AI feedback,[^11] direct preference optimization,[^12] reward modeling from preferences,[^13] verbal and self-reflective refinement,[^14] and, most recently, rubric- and verifier-based rewards that make the reward signal interpretable and harder to game.[^22]"));
children.push(P("The **guardrails** are what make this safe: defense against reward hacking, an offline evaluation gate before any policy is promoted, canary and shadow rollout, human-in-the-loop review of reward labels, and hard regression gates. The payoff is a virtuous loop \u2014 better evaluation yields a better reward signal, which yields a better policy, which yields better outcomes \u2014 and there is now production evidence that closing this loop with replay-based policy improvement and online experimentation produces concurrent gains in quality and business outcomes.[^7] Learning, in other words, is not a research luxury; it is how a mature agent stops repeating its own mistakes."));

// ---- 10. Self-healing ----
children.push(H1("10. Self-Healing and Semi-Autonomous Recovery"));
children.push(P("In a mature system, recovery is a property of the system, not a task on a human\u2019s pager. The mechanism is a closed loop."));
children.push(img("self-healing-loop.png", 600, 384, "Closed loop self-healing and learning"));
children.push(caption("Figure 4. The self-healing loop: detect, diagnose, remediate, verify, learn \u2014 with remediation gated by guardrails."));
children.push(P("The loop runs in five stages. **Detect** draws on observability, anomaly detection, and live evaluation signals. **Diagnose** performs root-cause analysis and trajectory replay, using diagnostic signals with explicit evidence scopes to localize *where* a failure originated \u2014 turning \u201cit failed\u201d into \u201cstep seven\u2019s licensing call failed because of X,\u201d which is precisely what makes automated remediation safe.[^7] **Remediate** applies a compensating action, a rollback, or a re-plan. **Verify** confirms recovery against post-conditions and guardrails. **Learn** labels the trace and feeds it back into the reinforcement-learning loop."));
children.push(P("The remediation stage has two modes, and the choice between them is governed by the maturity model. In the **semi-autonomous** mode \u2014 the safe default for L2\u2013L3 \u2014 the system proposes a remediation and a human approves it. In the **autonomous** mode, earned only at L4\u2013L5, the system executes remediation within a bounded blast radius and escalates when its confidence is low. The operational goal, borrowed from site reliability engineering, is a steadily falling mean-time-to-recovery as more of the loop is safely automated.[^3] Recovery autonomy, like every other kind, is earned by the maturity of reliability, evaluation, and accountability \u2014 never assumed."));

// ---- 11. Anti-patterns ----
children.push(H1("11. Anti-Patterns and Trade-offs: When Not To"));
children.push(P("A framework earns trust by being honest about its own limits. The following are the failure modes we see most often."));
children.push(BULLET("**Autonomy theater** \u2014 granting autonomy beyond the weakest capability dimension. The cardinal sin the maturity model exists to prevent."));
children.push(BULLET("**Evaluation by vibes** \u2014 shipping judgment because it \u201clooked right,\u201d with no offline gate and no online guardrail."));
children.push(BULLET("**The aggregate pass-rate illusion** \u2014 trusting a high benchmark score that hides production collapse as horizons lengthen.[^6]"));
children.push(BULLET("**The context-truncation trap** \u2014 shrinking the context window to save tokens, which *steepens* long-horizon decay because degradation is driven by step count, not context length. Decompose the horizon instead.[^6]"));
children.push(BULLET("**Premature multi-agent** \u2014 reaching for a swarm before a single well-instrumented agent is exhausted. Multi-agent architectures can excel on breadth-first, parallelizable work, but they consume dramatically more tokens \u2014 on the order of fifteen times a single chat in one reported system \u2014 and become fragile when agents must share context or depend on one another.[^21] The contrasting practitioner view, that un-shared context makes such systems brittle, is worth weighing seriously before adopting one.[^20]"));
children.push(BULLET("**Unbounded tools and memory hoarding** \u2014 over-privileged tools and ever-growing context that degrade both safety and quality."));
children.push(P("The unifying trade-off beneath all of these is that autonomy, breadth, and speed are purchased with cost, latency, and risk. Senior judgment is knowing when that purchase is worth making \u2014 and when the simpler design is the better one.[^5]"));

// ---- 12. Worked example ----
children.push(H1("12. A Worked Example: Onboarding from L1 to L4"));
children.push(P("Return to the onboarding agent from Section 2, and trace how the framework matures it. At **L1**, the agent proposes each provisioning step and a human approves every action; nothing is automated, but nothing can go wrong unattended. Moving to **L2**, the team makes every tool idempotent and gates only the state-changing calls, so the agent executes routine steps while a human still authorizes writes."));
children.push(P("Reaching **L3** requires the reliability plane: the workflow is modeled as a saga with compensating actions, durable checkpoints are added between milestones, and circuit breakers protect each external dependency. The agent now runs the full flow within guardrails, pausing for human sign-off at milestones, and a mid-flow failure unwinds cleanly instead of stranding the tenant."));
children.push(P("Only after evaluation, accountability, and self-healing are demonstrably in place does the team grant **L4**: horizon-aware evaluation gates each release, every action is attributable and replayable, and the self-healing controller detects, diagnoses, and \u2014 within a bounded blast radius \u2014 remediates common failures automatically, escalating the rest. The measurable results of this progression are the metrics that matter in production: a lower failure rate, a shorter mean-time-to-recovery, less human touch per onboarding, higher evaluation coverage, and, ultimately, the trust that lets the organization widen the agent\u2019s remit. Note that autonomy rose only as fast as the weakest capability dimension allowed \u2014 exactly as the governing rule prescribes."));

// ---- 13. Self-assessment ----
children.push(H1("13. Getting Started: A Maturity Self-Assessment"));
children.push(P("Use the scorecard below to locate your system. Score each capability dimension from 1 (ad hoc) to 5 (optimizing). Your **autonomy ceiling** is set by your *lowest* score \u2014 that is the maximum autonomy you can safely grant today. The gap between your current autonomy and that ceiling is your risk; the path forward is to raise the weakest dimension before adding autonomy."));
const wC = [3200, 4260, 1900];
children.push(new Table({ width: { size: CW, type: WidthType.DXA }, columnWidths: wC, rows: [
  headerRow(["Capability dimension", "Ask yourself", "Score (1\u20135)"], wC),
  row(["Reliability", "Can a mid-flow failure be unwound or resumed without corrupting state?", ""], wC, [{bold:true,fill:"EDEDED"},{},{}]),
  row(["Evaluation / Quality", "Do we gate releases on horizon-aware, trajectory-level evaluation?", ""], wC, [{bold:true,fill:"EDEDED"},{},{}]),
  row(["Accountability", "Is every action attributable, auditable, and deterministically replayable?", ""], wC, [{bold:true,fill:"EDEDED"},{},{}]),
  row(["Learning / RL", "Do we improve from production signal under guardrails, not just prompt edits?", ""], wC, [{bold:true,fill:"EDEDED"},{},{}]),
  row(["Self-Healing", "Does the system detect, diagnose, and recover \u2014 or does a human always?", ""], wC, [{bold:true,fill:"EDEDED"},{},{}]),
]}));
children.push(GAP());
children.push(P("The discipline this framework asks for is not glamorous. It is idempotency keys and compensating actions, trajectory evaluation and audit traces, reward guardrails and blast-radius limits. But it is exactly this unglamorous engineering \u2014 not the next increment of model capability \u2014 that separates an agent that demos from an agent that ships. Autonomy is not granted; it is earned, one capability dimension at a time."));

// ---- References ----
children.push(new Paragraph({ children: [new PageBreak()] }));
children.push(H1("Selected References"));
const refs = [
  ["H. Garcia-Molina and K. Salem, \u201cSagas,\u201d ACM SIGMOD, 1987.", "https://doi.org/10.1145/38713.38742"],
  ["M. Nygard, Release It! Design and Deploy Production-Ready Software, 2nd ed., 2018.", "https://pragprog.com/titles/mnee2/release-it-second-edition/"],
  ["B. Beyer et al., Site Reliability Engineering, Google / O\u2019Reilly, 2016.", "https://sre.google/books/"],
  ["S. Yao et al., \u201cReAct: Synergizing Reasoning and Acting in Language Models,\u201d arXiv:2210.03629, 2022.", "https://arxiv.org/abs/2210.03629"],
  ["Anthropic, \u201cBuilding Effective Agents,\u201d 2024.", "https://www.anthropic.com/engineering/building-effective-agents"],
  ["\u201cHow Fast Do Agents Rot? An Empirical Study of Long-Horizon Degradation in LLM Agents for Production Decision-Making,\u201d arXiv:2609.01660, 2026.", "https://arxiv.org/abs/2609.01660"],
  ["W. Chen et al., \u201cATLAS: Dual-Horizon Diagnostic Evaluation for Industrial Tool-Use Agents,\u201d arXiv:2608.30685, 2026.", "https://arxiv.org/abs/2608.30685"],
  ["L. Zheng et al., \u201cJudging LLM-as-a-Judge with MT-Bench and Chatbot Arena,\u201d arXiv:2306.05685, 2023.", "https://arxiv.org/abs/2306.05685"],
  ["\u201cLLM-as-a-Judge Is Not an Oracle: Why Self-Improving Agents Need Deterministic Guardrails,\u201d arXiv:2609.02246, 2026.", "https://arxiv.org/abs/2609.02246"],
  ["L. Ouyang et al., \u201cTraining Language Models to Follow Instructions with Human Feedback (InstructGPT),\u201d arXiv:2203.02155, 2022.", "https://arxiv.org/abs/2203.02155"],
  ["Y. Bai et al., \u201cConstitutional AI: Harmlessness from AI Feedback,\u201d arXiv:2212.08073, 2022.", "https://arxiv.org/abs/2212.08073"],
  ["R. Rafailov et al., \u201cDirect Preference Optimization,\u201d arXiv:2305.18290, 2023.", "https://arxiv.org/abs/2305.18290"],
  ["P. Christiano et al., \u201cDeep Reinforcement Learning from Human Preferences,\u201d arXiv:1706.03741, 2017.", "https://arxiv.org/abs/1706.03741"],
  ["N. Shinn et al., \u201cReflexion: Language Agents with Verbal Reinforcement Learning,\u201d arXiv:2303.11366, 2023.", "https://arxiv.org/abs/2303.11366"],
  ["C. Packer et al., \u201cMemGPT: Towards LLMs as Operating Systems,\u201d arXiv:2310.08560, 2023.", "https://arxiv.org/abs/2310.08560"],
  ["K. Greshake et al., \u201cNot What You\u2019ve Signed Up For: Compromising Real-World LLM-Integrated Applications with Indirect Prompt Injection,\u201d arXiv:2302.12173, 2023.", "https://arxiv.org/abs/2302.12173"],
  ["OWASP, \u201cTop 10 for LLM Applications,\u201d 2023\u20132025.", "https://owasp.org/www-project-top-10-for-large-language-model-applications/"],
  ["NIST, \u201cArtificial Intelligence Risk Management Framework (AI RMF 1.0),\u201d 2023.", "https://www.nist.gov/itl/ai-risk-management-framework"],
  ["SAE International, \u201cJ3016: Taxonomy and Definitions for Terms Related to Driving Automation Systems.\u201d", "https://www.sae.org/standards/content/j3016_202104/"],
  ["Cognition, \u201cDon\u2019t Build Multi-Agents,\u201d 2025.", "https://cognition.ai/blog/dont-build-multi-agents"],
  ["Anthropic, \u201cHow We Built Our Multi-Agent Research System,\u201d 2025.", "https://www.anthropic.com/engineering/multi-agent-research-system"],
  ["\u201cA Survey on Rubric-Guided Reinforcement Learning for Language Models,\u201d arXiv:2608.27505, 2026.", "https://arxiv.org/abs/2608.27505"],
];
refs.forEach((r, i) => children.push(new Paragraph({ spacing: { after: 60 },
  children: [
    new TextRun({ text: `[${i + 1}] `, bold: true, size: 18 }),
    new TextRun({ text: r[0] + "  ", size: 18 }),
    new ExternalHyperlink({ link: r[1], children: [new TextRun({ text: r[1], size: 18, color: "0563C1", underline: {} })] })
  ] })));
children.push(GAP());
children.push(new Paragraph({ children: [new TextRun({ text: "Note: entries marked arXiv:26xx are recent preprints and have not been peer-reviewed; verify details before formal citation. This framework is vendor-neutral; the maturity model is inspired by, and does not reproduce, SAE J3016 and CMMI.", italics: true, size: 16, color: "666666" })] }));

// ---------- footnotes ----------
const footData = {
  1: "Garcia-Molina & Salem, \u201cSagas,\u201d ACM SIGMOD, 1987.",
  2: "Nygard, Release It!, 2nd ed., 2018.",
  3: "Beyer et al., Site Reliability Engineering, Google, 2016.",
  4: "Yao et al., \u201cReAct,\u201d arXiv:2210.03629, 2022.",
  5: "Anthropic, \u201cBuilding Effective Agents,\u201d 2024.",
  6: "\u201cHow Fast Do Agents Rot?\u201d arXiv:2609.01660, 2026 (recent preprint).",
  7: "Chen et al., \u201cATLAS: Dual-Horizon Diagnostic Evaluation for Industrial Tool-Use Agents,\u201d arXiv:2608.30685, 2026 (recent preprint).",
  8: "Zheng et al., \u201cJudging LLM-as-a-Judge with MT-Bench,\u201d arXiv:2306.05685, 2023.",
  9: "\u201cLLM-as-a-Judge Is Not an Oracle,\u201d arXiv:2609.02246, 2026 (recent preprint).",
  10: "Ouyang et al., \u201cInstructGPT,\u201d arXiv:2203.02155, 2022.",
  11: "Bai et al., \u201cConstitutional AI,\u201d arXiv:2212.08073, 2022.",
  12: "Rafailov et al., \u201cDirect Preference Optimization,\u201d arXiv:2305.18290, 2023.",
  13: "Christiano et al., \u201cDeep RL from Human Preferences,\u201d arXiv:1706.03741, 2017.",
  14: "Shinn et al., \u201cReflexion,\u201d arXiv:2303.11366, 2023.",
  15: "Packer et al., \u201cMemGPT,\u201d arXiv:2310.08560, 2023.",
  16: "Greshake et al., \u201cIndirect Prompt Injection,\u201d arXiv:2302.12173, 2023.",
  17: "OWASP, \u201cTop 10 for LLM Applications,\u201d 2023\u20132025.",
  18: "NIST, \u201cAI Risk Management Framework (AI RMF 1.0),\u201d 2023.",
  19: "SAE International, \u201cJ3016: Levels of Driving Automation\u201d (analogy only).",
  20: "Cognition, \u201cDon\u2019t Build Multi-Agents,\u201d 2025.",
  21: "Anthropic, \u201cHow We Built Our Multi-Agent Research System,\u201d 2025.",
  22: "\u201cA Survey on Rubric-Guided Reinforcement Learning for Language Models,\u201d arXiv:2608.27505, 2026 (recent preprint).",
};
const footnotes = {};
Object.keys(footData).forEach(k => {
  const url = refs[parseInt(k) - 1][1];
  footnotes[k] = { children: [new Paragraph({ children: [
    new TextRun({ text: footData[k] + "  ", size: 16 }),
    new ExternalHyperlink({ link: url, children: [new TextRun({ text: url, size: 16, color: "0563C1", underline: {} })] })
  ] })] };
});

// ---------- document ----------
const doc = new Document({
  creator: "Whitepaper Generator",
  styles: {
    default: { document: { run: { font: "Georgia", size: 21 } } },
    paragraphStyles: [
      { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 30, bold: true, font: "Arial", color: "1F3864" },
        paragraph: { spacing: { before: 300, after: 160 }, outlineLevel: 0, keepNext: true } },
      { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 24, bold: true, font: "Arial", color: "2E5496" },
        paragraph: { spacing: { before: 200, after: 120 }, outlineLevel: 1, keepNext: true } },
    ]
  },
  numbering: { config: [
    { reference: "bul", levels: [{ level: 0, format: LevelFormat.BULLET, text: "\u2022", alignment: AlignmentType.LEFT,
      style: { paragraph: { indent: { left: 540, hanging: 270 } } } }] },
    { reference: "num", levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT,
      style: { paragraph: { indent: { left: 540, hanging: 270 } } } }] },
  ]},
  footnotes,
  sections: [{
    properties: { page: {
      size: { width: 12240, height: 15840 },
      margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 }
    }},
    headers: { default: new Header({ children: [new Paragraph({
      alignment: AlignmentType.RIGHT,
      border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: "CCCCCC", space: 4 } },
      children: [new TextRun({ text: "Production-Grade Agentic AI", size: 16, color: "888888" })] })] }) },
    footers: { default: new Footer({ children: [new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [new TextRun({ text: "Page ", size: 16, color: "888888" }),
        new TextRun({ children: [PageNumber.CURRENT], size: 16, color: "888888" })] })] }) },
    children: children
  }]
});

Packer.toBuffer(doc).then(buf => {
  const out = DIR + "Production-Grade-Agentic-AI-Whitepaper.docx";
  fs.writeFileSync(out, buf);
  console.log("WROTE " + (buf.length/1024).toFixed(0) + " KB -> " + out + "  (children total=" + children.length + ")");
});
