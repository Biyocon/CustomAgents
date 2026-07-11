---
id: "#5"
title: "Komplettér de 4 FORELØBIG Banedanmark-subagenter"
fase: "C"
sprint: "C-1"
status: done
prioritet: "P1"
deps:
  - "#1"
blocks:
  - "#10"
oprettet: "2026-07-01"
sidst_opdateret: "2026-07-10"
lukket: "2026-07-10"
---

---

## Hvad & Hvorfor

Udbudskonsulent, Projektleder, Byggeleder/Tilsyn og Interface Manager er
markeret FORELØBIG med 16–22 linjers profiler og "Ingen source .md fundet".
Disse er 4 af de 14 kerne-Banedanmark-roller — deres ufuldstændighed er en
synlig kvalitetsbrist i harnessets primære værditilbud.

---

## Done ser sådan ud

Alle 4 roller har en profile.md på niveau med de øvrige 10 DRAFT-roller
(fyldigt kildemateriale, ikke placeholder), og status opgraderes fra FORELØBIG
til mindst DRAFT.

---

## Teknisk scope

- [x] Identificér kildemateriale for hver af de 4 roller (2026-07-10): 3 har dedikeret FB-PDF (interface-manager, projektleder, byggeleder-tilsyn=Byggeleder+Fagtilsyn); udbudskonsulent har INGEN dedikeret FB-PDF og er grundet i IQRA-persona-laget + tilstødende kontraktroller. Kritisk enabler: `pdftotext` er tilgængeligt, så FB-PDF-tekst kan faktisk udtrækkes (audit'ens tidligere "kan ikke parses" var manglende værktøj).
- [x] Skriv profile.md + skills.yaml for alle 4 (2026-07-10). Bemærk: agenterne bor i `.vscode/.codex/agents/banedanmark/<slug>/` (role-laget), ikke `.agents/agents/`. Enrichede eksisterende stubs i stedet for at flytte — role-vs-persona canonical-model er stadig åben (jf. registry-reconciliation.md), så ny placering afventer PR D/F.
- [x] Opdatér status i AGENTS.md + banedanmark/README.md (README.md-rod nævnte dem ikke som FORELØBIG)

---

## Relevante filer

- `.agents/agents/udbudskonsulent/`, `.agents/agents/projektleder/`, `.agents/agents/byggeleder-tilsyn/`, `.agents/agents/interface-manager/` (eller `.vscode/.codex/agents/`-modstykker, afhængigt af #1)
- `Funktions- og stillingsbeskrivelser/`
- `README.md` (agent-roster-tabellen)

---

## Acceptkriterie

- [x] Alle 4 roller har profile.md > 60 linjer med reelt, sporbart kildemateriale (86–101 linjer; hver med Formål/Ansvar/Beføjelser/Opgaver/Kompetencekrav/System Prompt/Kildesporbarhed, citeret til den konkrete FB-PDF)
- [x] Ingen af de 4 er længere markeret FORELØBIG (status → draft; AGENTS.md + banedanmark/README.md opdateret)
- [x] `.agents/schema/agent-profile.schema.json`: alle påkrævede felter (id/name/role/category/status/source) til stede for alle 4. **Note:** skemaets status-enum indeholder ikke "draft" (kun active/planned/FORELOEBIG/deprecated/archived) — men alle 10 øvrige Banedanmark-agenter bruger også "draft"; dette er en pre-eksisterende skema-vs-virkelighed-uoverensstemmelse uden for #5's scope, ikke en regression.

**Status 2026-07-10: alle scope-punkter og acceptkriterier opfyldt.** De 4 profiler er grundet i
faktisk FB-PDF-indhold (udtrukket med pdftotext) med eksplicit kildesporbarhed. Kompetencekrav-K-tabeller
er noteret som "skal verificeres direkte mod PDF før operationel/sikkerhedskritisk brug" — bevidst
konservativt, da audit'en fandt at filnavns-baserede mappings tidligere var upålidelige. Klar til `docs/done/`.

---

## Blocker / noter

2026-07-01: Kan køre parallelt med #6, men afventer #1 for at vide hvilket
runtime-lag der skal redigeres.
