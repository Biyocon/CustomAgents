# Projektplan & Ønskeliste: {{PROJECT_NAME}}

> **Purpose:** the idea bank. Answers *"What are we building and why?"* — design
> decisions, rationale, the wishlist, and a changelog of what's been done.
> Thematic, not sequential. The sequential plan lives in `KØREPLAN.md`.
>
> Organise by `§`-sections so other docs (and `primer.md`) can deep-link, e.g.
> "see §QA-3 in PROJEKT_PLAN.md". Never expect an agent to read the whole file —
> point them at the relevant section.

**Last updated:** {{TODAY}}

---

## §VISION. What this project is (and is not)

- **Is:** {{WHAT_IT_IS}}
- **Is not:** {{WHAT_IT_IS_NOT}}
- **Core loop:** {{CORE_LOOP}}
- **Differentiator:** {{DIFFERENTIATOR}}

---

## §GAP. Competitive / Gap Analysis [{{DATE}}]

| Capability | Us | Reference / Competitor | Decision |
|------------|----|------------------------|----------|
| {{CAP}} | {{OURS}} | {{THEIRS}} | keep / cherry-pick / drop |

**Cherry-pick only what strengthens the vision. Document what you deliberately
reject and why** — rejections are as valuable as adoptions.

---

## §DESIGN. Architectural Decisions

> Each decision: context → options considered → choice → rationale. This is a
> lightweight ADR log; promote heavy ones to `docs/adr/`.

### {{DECISION_TITLE}} [{{DATE}}]
- **Context:** {{CONTEXT}}
- **Choice:** {{CHOICE}}
- **Rationale:** {{RATIONALE}}
- **Consequences:** {{CONSEQUENCES}}

---

## §INTEGRATION. Integration Depth Framework (optional)

> If you integrate external/OSS components, define an explicit depth ladder so
> "integrated" is never ambiguous. Example ladder:
>
> - **L1** — embed / surface (iframe, mount, link)
> - **L2** — status + health check
> - **L3** — typed client + proxy routes
> - **L4** — first-class routing / orchestration intent
>
> Rule: never copy third-party source into the repo — depend on it (package /
> sidecar) + a thin client. Record each integration's target tier.

| Component | Target tier | Status | Notes |
|-----------|-------------|--------|-------|
| {{COMPONENT}} | L{{N}} | ⬜ | {{NOTES}} |

---

## 🌟 Wishlist (Features & Visions)

> Unordered idea bank. Promote items into `KØREPLAN.md` when they become real,
> sequenced work.

- [ ] {{IDEA_1}}
- [ ] {{IDEA_2}}
- [ ] {{IDEA_3}}

---

## ✅ To-Do (Current high-level intentions)

- [ ] {{TODO_1}}
- [ ] {{TODO_2}}

---

## 🚀 Changelog (Completed work, newest first)

### {{DATE}} — {{CHANGE_TITLE}}
- {{CHANGE_DETAIL}}

---

## 🗂️ Folder status (root level)

| Path | Purpose | Status |
|------|---------|--------|
| `{{PATH}}` | {{PURPOSE}} | active / planned / deprecated |
