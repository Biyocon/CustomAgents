---
name: creating-antigravity-skills
description: Generates high-quality, predictable, and efficient .agent/skills/ directories based on user requirements. Use when the user wants to create a new skill or modify an existing one. (根據使用者需求生成高品質且高效的 .agent/skills/ 目錄。用於建立新技能或修改現有技能。)
---

# Antigravity Skill Creator (Antigravity 技能生成器)

## When to use this skill (何時使用此技能)
- When requested to create or update a "Skill" for the Antigravity environment. (當需要為 Antigravity 環境建立或更新「技能」時。)
- When organizing repetitive system instructions into modular components. (當需要將重複的系統指令組織成模組化組件時。)
- When the user mentions building a specific capability (e.g., "build me a skill for X"). (當使用者提到建立特定功能時，例如「幫我建立一個 X 技能」。)

## Core Structural Requirements (核心結構要求)
Every skill generated must follow this hierarchy: (每個生成的技能必須遵循此層級：)
- `.agent/skills/<skill-name>/`
    - `SKILL.md` (Required: Main logic and instructions / 必要：主要邏輯與指令)
    - `scripts/` (Optional: Helper scripts / 選填：輔助腳本)
    - `examples/` (Optional: Reference implementations / 選填：參考實作)
    - `resources/` (Optional: Templates or assets / 選填：模板或資產)

## YAML Frontmatter Standards (YAML 前言標準)
The `SKILL.md` must start with YAML frontmatter: (`SKILL.md` 必須以 YAML 前言開頭：)
- **name**: Gerund form (e.g., `testing-code`). Max 64 chars. Lowercase, numbers, and hyphens only. (動名詞形式，最長 64 字元，僅限小寫字母、數字與連字號。)
- **description**: Written in **third person**. Include specific triggers. Max 1024 chars. (以**第三人稱**撰寫。包含具體的觸發關鍵字。最長 1024 字元。)

## Writing Principles (The "Claude Way") (撰寫原則)
* **Conciseness (簡潔)**: Avoid explaining basic concepts. Focus on unique logic. (避免解釋基本概念，專注於獨特邏輯。)
* **Progressive Disclosure (漸進式揭露)**: Keep `SKILL.md` under 500 lines. Link to secondary files for more detail. (保持 `SKILL.md` 在 500 行內。連結至次要檔案以提供更多細節。)
* **Forward Slashes (正斜線)**: Always use `/` for paths. (路徑一律使用 `/`。)
* **Degrees of Freedom (自由度控制)**: 
    - **Bullet Points (列點)**: For heuristics/high-freedom. (用於啟發式/高自由度任務。)
    - **Code Blocks (程式碼區塊)**: For templates/medium-freedom. (用於模板/中自由度任務。)
    - **Bash Commands (Bash 指令)**: For fragile operations/low-freedom. (用於脆弱操作/低自由度任務。)

## Workflow & Feedback Loops (工作流程與回饋迴圈)
1. [ ] **Plan (計劃)**: Define the gerund name and triggers. (定義動名詞名稱與觸發器。)
2. [ ] **Structure (結構)**: Create `.agent/skills/<skill-name>/`. (建立目錄結構。)
3. [ ] **Draft (草擬)**: Write `SKILL.md` with appropriate YAML and logic. (撰寫具備正確 YAML 與邏輯的 `SKILL.md`。)
4. [ ] **Validate (驗證)**: Verify YAML formatting and pathing. (驗證 YAML 格式與路徑。)
5. [ ] **Refine (優化)**: Add `scripts/` or `examples/` if complex. (若任務複雜，則增加腳本或範例。)

## Output Template (輸出模板)
Follow this format when presenting a new skill: (呈現新技能時請遵循以下格式：)

### [Folder Name]
**Path (路徑):** `.agent/skills/[skill-name]/`

### [SKILL.md]
```markdown
---
name: [gerund-name]
description: [3rd-person description]
---

# [Skill Title]

## When to use this skill
- [Trigger 1]

## Workflow
[Checklist]

## Instructions
[Specific logic]
```

## Instructions for use (使用說明)
1. Trigger a skill creation by saying: *"Based on my skill creator instructions, build me a skill for [Task]."* (說出「根據我的技能生成器指令，為我建立一個 [任務] 的技能」來觸發。)
