# {{PROJECT_NAME}} — System Map (updated {{TODAY}})

> The authoritative architecture reference. Read this **before** making
> architectural decisions. Describes the layers, the components in each, and the
> sharp conceptual distinctions that prevent category errors.
>
> Keep it honest: every component carries a **runtime status** (✅ active /
> ⚠️ code-only / ⬜ planned), not an aspiration.

---

## Core distinctions (read first)

> The distinctions that stop people from conflating different kinds of things.
> Adapt these to your domain. Examples from an agent platform:

- **Agents vs Tools:** an *agent* has autonomy — its own decision loop. A *tool*
  has none; it is called by an agent. Don't label a tool an agent.
- **Routing vs Execution:** the orchestrator *chooses*; the engine *runs*. Keep
  the layers unmixed.
- **{{YOUR_DISTINCTION_3}}**

---

## Layer overview

```
{{LAYER_STACK_DIAGRAM}}
```

---

## Layer 1: {{LAYER_1_NAME}}

| Component | What it does | Runtime status |
|-----------|--------------|----------------|
| {{COMPONENT}} | {{WHAT}} | ✅ / ⚠️ / ⬜ |

## Layer 2: {{LAYER_2_NAME}}

| Component | What it does | Called by |
|-----------|--------------|-----------|
| {{COMPONENT}} | {{WHAT}} | {{CALLER}} |

## Layer 3: {{LAYER_3_NAME}}

| Component | Responsibility | Runtime status |
|-----------|----------------|----------------|
| {{COMPONENT}} | {{RESPONSIBILITY}} | ✅ / ⚠️ / ⬜ |

---

## The definitive picture

```
{{ASCII_BLOCK_DIAGRAM — boxes-and-lines of how the layers connect}}
```

---

## Recent additions

- {{DATE}}: {{ADDITION}}

## Planned extensions

- {{SPRINT}}: {{EXTENSION}}
