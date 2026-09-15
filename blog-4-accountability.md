---
title: "“Who Told the Agent It Could Do That?”"
---

# "Who Told the Agent It Could Do That?"

*Building Agents That Ship — Part 4: Accountability & Auditability*

---

Six weeks after we shipped it, a customer's security team sent one sentence that undid a lot of confidence:

*"Can you tell us exactly why the agent removed those licenses on the 14th, and who signed off?"*

We went to the logs. The logs said: `Task completed successfully. 42 actions taken.`

That was it. Forty-two actions, one cheerful summary, and no way to answer a simple, fair, and completely predictable question. We knew *that* the agent had acted. We could not reconstruct *why* it decided to, *what* it saw when it decided, or *who* — human or system — was accountable for the outcome. The agent had done its job. We just couldn't prove it had done it correctly.

That's the accountability gap. And in an enterprise, it's the one that ends pilots.

**The one line to remember:** *If you can't explain what your agent did, you don't own it — you're just hoping on its behalf.*

---

## Why "it worked" stops being enough

Parts 2 and 3 were about the agent behaving well: failing safely, and judging correctly. Accountability is different. It assumes the agent already worked — and asks whether you can *stand behind* what it did afterward, to an auditor, a customer, a regulator, or your own incident review.

Three forces make this non-negotiable the moment an agent touches a real tenant:

- **Actions have blast radius.** A chatbot that says something wrong embarrasses you. An agent that revokes a license, changes a security policy, or deletes a mailbox *changes the world* — and someone will eventually ask you to account for it.
- **Autonomy erases the human paper trail.** The old audit story was easy: a person clicked the button, and their name was on it. When the agent clicks the button, that trail evaporates unless you deliberately rebuild it.
- **Trust is granted against evidence, not vibes.** No enterprise grants an agent more autonomy because it *feels* reliable. They grant it because they can *inspect* what it's been doing. Auditability isn't paperwork — it's the currency you spend to buy autonomy ([*NIST AI RMF 1.0*](https://www.nist.gov/itl/ai-risk-management-framework)).

This is the tenant-automation archetype in its purest form: an agent acting over real APIs, inside someone else's environment, on their data. Accountability is what makes that acceptable instead of terrifying.

---

## Four properties of an action you can stand behind

"Auditability" is vague. Make it concrete. Every consequential action an agent takes should be four things:

1. **Attributable** — traceable to a specific agent, version, prompt, and the human or policy that authorized it. "The agent did it" is not attribution. *"Agent v2.3, running plan #A17, under service principal X, authorized by policy Y"* is.
2. **Replayable** — you can reconstruct the exact context the agent had *at decision time*: the inputs it saw, the tools it called, the results it got back. Not a summary written after the fact — the actual state.
3. **Explainable** — the reasoning is captured in a form a human can review. Not the raw token stream, but the decision: what it was trying to do, what evidence it used, why this action and not another.
4. **Owned** — a named human or team is accountable for the agent's behavior in production. Autonomy does not transfer responsibility to the model. There is always an owner.

Miss any one and the whole thing gets shaky. Attributable-but-not-replayable tells you *who* but never *why*. Replayable-but-not-owned means everyone can see what happened and no one is responsible for it.

---

## The move: log decisions, not just outcomes

Most systems log *what happened*: `license removed, user 4412`. That's an outcome. It's necessary and completely insufficient.

An accountable agent logs the **decision**, not just the effect. The distributed-systems name for this instinct is **event sourcing**: don't store only the final state — store the ordered sequence of events that produced it, so any state is reconstructable by replay. Agents need the same discipline, one layer up. For every consequential step, capture:

- **The trigger** — what request or condition initiated this.
- **The context snapshot** — the inputs and tool results the agent actually had in hand.
- **The intent** — what the agent was trying to accomplish with this step.
- **The action + authorization** — the concrete operation, and the identity/policy that permitted it.
- **The result** — what came back, success or failure, and any compensation triggered.

Do that, and the customer's question — *"why did it remove those licenses on the 14th?"* — becomes a query, not an archaeology dig. This is exactly the direction production evaluation frameworks are moving: attaching explicit **evidence scopes** and decision boundaries to each signal, so a judgment can be traced to the specific inputs that produced it ([*ATLAS, arXiv:2608.30685*](https://arxiv.org/abs/2608.30685)).

---

## Accountability is a security control, not just a compliance one

It's tempting to file audit trails under "compliance" and move on. That undersells them. In an agent that calls real tools, the audit trail is a **security instrument**.

The dangerous failure isn't only a wrong decision — it's a *manipulated* one. Indirect prompt injection can turn a helpful agent into a confused deputy: content it reads (a document, a ticket, an email) carries hidden instructions, and the agent acts on them with its own privileges ([*Greshake et al., arXiv:2302.12173*](https://arxiv.org/abs/2302.12173)). When that happens — and at scale it will — the only thing standing between you and "we have no idea what it touched" is a trace that records *why* each action was taken and *what input triggered it*.

So the same properties that satisfy an auditor also let you answer the incident-response questions: What did it do? What made it do that? What's the blast radius? Least privilege, scoped credentials, and a decision-level audit trail are the same investment viewed from two angles ([*OWASP Top 10 for LLM Applications*](https://owasp.org/www-project-top-10-for-large-language-model-applications/)).

---

## When NOT to over-instrument

Honesty check, same as every part — full audit machinery has a cost, in latency, storage, and engineering time. Don't tax actions that don't warrant it:

- **Read-only or purely informational steps.** Log them lightly; nothing changed in the world.
- **Trivially reversible, low-stakes actions** where reconstruction would never be worth the storage.
- **Prototypes not yet touching production data or real tenants.** Build the trail *before* the agent gets write access to something that matters — not on day one of a spike.

Reserve full decision-level tracing for actions that **change a customer's world** or that you'd have to *defend later*. That's where the tenant-automation archetype earns every byte of the audit log.

---

## Your gift: the accountability checklist + a trace schema

Before you let an agent act autonomously on a real tenant, walk this list:

- [ ] **Every consequential action is attributable** to agent + version + plan + authorizing identity/policy.
- [ ] **Decisions are logged, not just outcomes** — trigger, context snapshot, intent, action, result.
- [ ] **You can replay** the exact context the agent had at decision time.
- [ ] **Reasoning is captured** in a human-reviewable form for high-stakes steps.
- [ ] **Every agent in production has a named owner** — a person or team, not "the model."
- [ ] **The trail is tamper-evident** and access-controlled — audit logs are security assets.
- [ ] **Authorization is explicit and least-privilege** — scoped credentials per action, not a god-mode token.
- [ ] **"Why did it do X on date Y?" is a query you can run** — in minutes, not a forensics project.

A minimal per-action **trace schema** to start from:

```json
{
  "trace_id": "a17-step-31",
  "agent": { "name": "tenant-provisioner", "version": "2.3.0" },
  "trigger": { "type": "request", "id": "req-8842", "source": "onboarding-queue" },
  "intent": "Remove unused E5 licenses flagged inactive >90d",
  "context_snapshot_ref": "s3://traces/req-8842/step-31/context.json",
  "action": { "tool": "graph.licenses.remove", "target": "user-4412", "params_ref": "…" },
  "authorization": { "principal": "sp-provisioner", "policy": "P-LICENSE-RECLAIM-v4" },
  "result": { "status": "success", "compensation": null },
  "owner": "identity-platform-team",
  "timestamp": "2026-09-14T09:03:22Z"
}
```

If you can emit that for every consequential step, the auditor's email stops being a crisis and becomes a `SELECT`.

---

## The takeaway

Reliability keeps a broken action from corrupting the world. Evaluation keeps a broken judgment from shipping. **Accountability keeps you able to answer for the actions that did ship** — attributable, replayable, explainable, owned.

The question that ends most enterprise pilots isn't *"does it work?"* It's *"can you prove what it did?"* Log decisions, not just outcomes. Treat the audit trail as a security control, not an afterthought. Give every agent an owner. Do that, and autonomy stops being a leap of faith and becomes something you can actually defend — which is the only kind of autonomy an enterprise will ever let you keep.

---

*This is Part 4 of "Building Agents That Ship." Part 2 covered reliability and safe failure; Part 3 covered evaluation and measurable judgment. Next up, Part 5: Context & Memory — why long-horizon agents live or die on state, not prompts.*

*Views are my own. All scenarios are anonymized, generalized enterprise archetypes.*

---

## References & further reading

1. NIST, *"AI Risk Management Framework (AI RMF 1.0)."* 2023 — https://www.nist.gov/itl/ai-risk-management-framework
2. OWASP, *"Top 10 for Large Language Model Applications."* 2023–2025 — https://owasp.org/www-project-top-10-for-large-language-model-applications/
3. K. Greshake et al., *"Not What You've Signed Up For: Compromising Real-World LLM-Integrated Applications with Indirect Prompt Injection."* arXiv:2302.12173, 2023 — https://arxiv.org/abs/2302.12173
4. W. Chen et al., *"ATLAS: Dual-Horizon Diagnostic Evaluation for Industrial Tool-Use Agents."* arXiv:2608.30685, 2026 — https://arxiv.org/abs/2608.30685 *(preprint)*
5. S. Willison, *"Prompt injection"* series — https://simonwillison.net/series/prompt-injection/
6. M. Fowler, *"Event Sourcing."* — https://martinfowler.com/eaaDev/EventSourcing.html
