# Matt Pocock Skills — Komplet Inventory

Dato: 2026-05-06
Kilde: `.agents/vendor/mattpocock-skills/` (kopieret fra `temp/mattpocock-skills/`)
Oprindeligt: https://github.com/mattpocock/ai-code-hero-skills

---

## Oversigt

**23 skills** fordelt på 5 kategorier. Alle kopieret til `.agents/skills/` med `source.md`.

| Kategori | Antal | Skills |
|----------|-------|--------|
| engineering | 10 | diagnose, grill-with-docs, improve-codebase-architecture, setup-matt-pocock-skills, tdd, to-issues, to-prd, triage, zoom-out |
| misc | 4 | git-guardrails-claude-code, migrate-to-shoehorn, scaffold-exercises, setup-pre-commit |
| personal | 2 | edit-article, obsidian-vault |
| productivity | 3 | caveman, grill-me, write-a-skill |
| deprecated | 4 | design-an-interface, qa, request-refactor-plan, ubiquitous-language |

---

## Engineering (10 skills)

### diagnose
- **Beskrivelse:** 6-fase disciplineret debugging-loop for svaere bugs og performance-regressioner
- **Linjer:** ~95
- **Model-agnostisk:** Ja
- **Aktiveret i harness:** Ja

### grill-with-docs
- **Beskrivelse:** Grilling-session der stress-tester planer mod eksisterende domaenemodel og dokumentation
- **Linjer:** ~88
- **Model-agnostisk:** Ja
- **Aktiveret i harness:** Ja

### improve-codebase-architecture
- **Beskrivelse:** Find "deepening opportunities" — refaktoreringer der goer shallow modules deep
- **Linjer:** ~71
- **Model-agnostisk:** Ja
- **Aktiveret i harness:** Ja

### setup-matt-pocock-skills
- **Beskrivelse:** Opsaetning af Matt Pococks skill-samling i et repo
- **Linjer:** ~30
- **Model-agnostisk:** Ja
- **Aktiveret i harness:** Ja

### tdd
- **Beskrivelse:** Test-driven development med red-green-refactor og vertikale tracer-bullet slices
- **Linjer:** ~109
- **Model-agnostisk:** Ja
- **Aktiveret i harness:** Ja

### to-issues
- **Beskrivelse:** Bryd plan/spec/PRD ned i uafhaengige issues via vertikale tracer-bullet slices
- **Linjer:** ~81
- **Model-agnostisk:** Ja
- **Aktiveret i harness:** Ja

### to-prd
- **Beskrivelse:** Generer PRD fra nuvaerende samtalekontekst og kodebaseforstaaelse
- **Linjer:** ~74
- **Model-agnostisk:** Ja
- **Aktiveret i harness:** Ja

### triage
- **Beskrivelse:** Triage af issues via state machine med kategori- og tilstands-roller
- **Linjer:** ~103
- **Model-agnostisk:** Ja
- **Aktiveret i harness:** Ja

### zoom-out
- **Beskrivelse:** Prompt til at faa bredere kontekst/hoejere abstraktionsniveau
- **Linjer:** ~7
- **Model-agnostisk:** Ja (men Claude-specifik YAML-frontmatter feature)
- **Aktiveret i harness:** Ja

---

## Misc (4 skills)

### git-guardrails-claude-code
- **Beskrivelse:** Set up Claude Code hooks til at blokere farlige git-kommandoer
- **Linjer:** ~95
- **Model-agnostisk:** Nej — Claude-specifik
- **Aktiveret i harness:** Ja (markeret som Claude-specifik)

### migrate-to-shoehorn
- **Beskrivelse:** Migrer test-filer fra `as` type assertions til @total-typescript/shoehorn
- **Linjer:** ~118
- **Model-agnostisk:** Ja
- **Aktiveret i harness:** Ja

### scaffold-exercises
- **Beskrivelse:** Opret oevelsesdirectory-strukturer med sections, problems, solutions, explainers
- **Linjer:** ~106
- **Model-agnostisk:** Ja
- **Aktiveret i harness:** Ja

### setup-pre-commit
- **Beskrivelse:** Set up Husky pre-commit hooks med lint-staged (Prettier), type checking, og tests
- **Linjer:** ~91
- **Model-agnostisk:** Ja
- **Aktiveret i harness:** Ja

---

## Personal (2 skills)

### edit-article
- **Beskrivelse:** Rediger og forbedr artikler
- **Linjer:** ~14
- **Model-agnostisk:** Ja
- **Aktiveret i harness:** Ja

### obsidian-vault
- **Beskrivelse:** Soeg, opret og administrer noter i Obsidian vault
- **Linjer:** ~59
- **Model-agnostisk:** Ja (men hardcoded sti)
- **Aktiveret i harness:** Ja

---

## Productivity (3 skills)

### caveman
- **Beskrivelse:** Ultra-komprimeret kommunikation. Skaerer ~75% tokens
- **Linjer:** ~49
- **Model-agnostisk:** Ja
- **Aktiveret i harness:** Ja

### grill-me
- **Beskrivelse:** Interview brugeren ubonhoerligt om en plan
- **Linjer:** ~10
- **Model-agnostisk:** Ja
- **Aktiveret i harness:** Ja

### write-a-skill
- **Beskrivelse:** Opret nye agent skills med korrekt struktur
- **Linjer:** ~117
- **Model-agnostisk:** Ja
- **Aktiveret i harness:** Ja

---

## Deprecated (4 skills)

| Skill | Erstatning |
|-------|------------|
| design-an-interface | Moderne UI/UX skills |
| qa | Overtaget af mere specifikke test-skills |
| request-refactor-plan | Overtaget af `improve-codebase-architecture` |
| ubiquitous-language | Overtaget af `grill-with-docs` + CONTEXT.md |

---

## Andre skills i harnesset (pre-eksisterende)

| Skill | Kategori |
|-------|----------|
| banebyg | BaneByg-specifik |
| bdk-brand-governance | BaneByg-specifik |
| bdk-gdpr-praksis | BaneByg-specifik |
| bdk-legal-mapping | BaneByg-specifik |
| shared-docx | Shared utility |
| shared-quality | Shared utility |

---

## Andre vendor-kilder

### karpathy-guidelines
- **Beskrivelse:** 4 adfaerdsprincipper for at reducere almindelige LLM-kodningsfejl
- **Linjer:** ~67 (SKILL.md)
- **Model-agnostisk:** Ja
- **Aktiveret i harness:** Ja (med `references/CLAUDE.md`, `references/CURSOR.md`, `references/README.md`)
- **Kilde:** https://github.com/forrestchang/andrej-karpathy-skills (MIT-licens)

---

## Tjekliste: Kraevede skills fra opgave

| Krav | Skill | Status |
|------|-------|--------|
| tdd | `tdd/` | Kopieret fra vendor |
| diagnose/debug | `diagnose/` | Kopieret fra vendor |
| to-prd | `to-prd/` | Kopieret fra vendor |
| to-issues | `to-issues/` | Kopieret fra vendor |
| grill-me | `grill-me/` | Kopieret fra vendor |
| grill-with-docs | `grill-with-docs/` | Kopieret fra vendor |
| improve-codebase-architecture | `improve-codebase-architecture/` | Kopieret fra vendor |
| zoom-out | `zoom-out/` | Kopieret fra vendor |
| write-a-skill | `write-a-skill/` | Kopieret fra vendor |
| setup-pre-commit | `setup-pre-commit/` | Kopieret fra vendor |
| git-guardrails | `git-guardrails-claude-code/` | Kopieret fra vendor (Claude-specifik) |

---

## Metadata

- Total skills i harness: 23 (mattpocock) + 1 (karpathy) + 6 (pre-eksisterende) = **30 skills**
- Alle vendor-skills har `source.md`
