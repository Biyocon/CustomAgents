# QA-log for 12_BDK-brand

---

## 2026-02-25 — v1.0 — Komplet genopbygning

### Baggrund
Eksisterende skill-pakke var strukturelt korrekt (4 skills i orkestrator-mønster) men indholdsmæssigt tomme skaller. Ingen brandregler var udtrukket fra designguiden, ingen logofilanalyse var dokumenteret, ingen governance var på plads.

### Analyseret
- 1 designguide-PDF (BDK Designguide Nyt logo 2021, 13 sider) — fuld tekstudtræk
- 14 logofiler (6 RGB-PNG + 6 CMYK-PNG + 2 AI-vektor) — dimensioner og størrelse
- 8 støjfiler (__MACOSX, .DS_Store, ._*) — identificeret til oprydning

### Udtrukne regler fra designguide
- **Logo:** 3 varianter, 2 farver, respektafstandsregler, placeringseksempler
- **Farver:** 5 officielle farver med HEX/RGB/CMYK, farvejusterede udgaver (50%/20%), hierarki
- **Typografi:** 3 fonter med klare tilgængelighedsregler (Segoe UI til daglig, resten forbeholdt grafikere)
- **Ikoner:** Inspireret af "Det 5. element", bank på baneinfo
- **Kontakt:** redaktion@bane.dk for alle undtagelser

### Kvalitetsflags
- **FLAG-001:** `Logo-RGB-2-dark.png` er 250x100 px — kun 33% af forventet opløsning (761x409 baseret på CMYK-ækvivalent og RGB-2-light). Kritisk da det er den primære logo-variant til digital brug på mørke baggrunde.

### Filer oprettet/opdateret
1. `claude.md` — projektguide med brandregler, kvalitetsflags, skill blueprint
2. `qa-log.md` — sporbarhedslog (NY)
3. `skills/bdk-brand-governance/SKILL.md` — orkestrator med kerneregelsæt, QA-rutine
4. `skills/bdk-brand-governance/agents/openai.yaml` — agent-instruks med regler
5. `skills/bdk-brand-governance/references/bdk-brand-designsystem.md` — komplet designsystem (NY)
6. `skills/bdk-brand-governance/references/source-map.md` — udvidet kildekort
7. `skills/bdk-logo-asset-valg/SKILL.md` — beslutningsmatrix, kvalitetsflags
8. `skills/bdk-logo-asset-valg/agents/openai.yaml` — agent-instruks med filvalg
9. `skills/bdk-logo-asset-valg/references/logo-asset-analyse.md` — filanalyse (NY)
10. `skills/bdk-logo-asset-valg/references/source-map.md` — udvidet med navngivning
11. `skills/bdk-brand-regler-anvendelse/SKILL.md` — komplet regelkatalog (R1-R7, 25 regler)
12. `skills/bdk-brand-regler-anvendelse/agents/openai.yaml` — agent-instruks med regelkoder
13. `skills/bdk-brand-regler-anvendelse/references/source-map.md` — sidehenvisninger
14. `skills/bdk-brand-preflight-leverance/SKILL.md` — preflight-checkliste (P1-P5, 12 checks)
15. `skills/bdk-brand-preflight-leverance/agents/openai.yaml` — agent-instruks med checks
16. `skills/bdk-brand-preflight-leverance/references/source-map.md` — oprydningsstier

### Strategiske beslutninger
- **Delt designsystem-reference:** `bdk-brand-designsystem.md` placeret i governance-skill (orkestrator), refereret af alle andre skills
- **Regelkatalog formaliseret:** 25 navngivne regler (R1-R7) i brand-regler-skillen
- **Preflight formaliseret:** 12 navngivne checks (P1-P5) i preflight-skillen
- **Kvalitetsflags:** FLAG-001 dokumenteret konsistent i alle relevante filer

### Krydstjek
- Alle 5 farver (HEX/RGB/CMYK) konsistente på tværs af designsystem, claude.md og SKILL.md
- Logo-dimensioner verificeret via script mod dokumentation
- FLAG-001 nævnt i: claude.md, governance SKILL.md, logo-asset SKILL.md, preflight SKILL.md, logo-asset-analyse.md, alle source-maps
- Alle filstier verificeret mod faktisk filstruktur

### Status
Godkendt til produktion. Anbefalet opfølgning: Kontakt redaktion@bane.dk for erstatning af undersized Logo-RGB-2-dark.png.
