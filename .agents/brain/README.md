# Brain

Brain-mappen er projektets persistente, model-agnostiske hukommelse og kontekstarkiv. Den fungerer som en "single source of truth" for domaeneviden, beslutninger, antagelser og runbooks — uafhaengigt af hvilken AI-model eller klient der koerer.

## Formaal

- **Stabil kontekst**: Information der ikke aendres ofte, og som alle agenter skal kende.
- **Beslutningshistorik**: Architecture Decision Records (ADRs) der dokumenterer hvorfor projektet er struktureret som det er.
- **Domaenesprog**: Forkortelser, begreber og begrebsafklaringer specifikke for Banedanmark og jernbanesikkerhed.
- **Runbooks**: Trin-for-trin guides til almindelige vedligeholdelsesopgaver.
- **Kort**: Oversigter over agenter og skills der goer det nemt at navigere i harnesset.

## Personlig hukommelse og opgavestyring

Udover den fælles projektkontekst indeholder Brain nu også:

- **personal/**: Brugerens profil, præferencer, læring og åbne beslutninger.
- **diary/**: Teknisk arbejdsdagbog (`YYYY-MM-DD.md`).
- **tasks/**: Aktive opgaver, backlog og afsluttede opgaver.

Dette gør agenter i stand til at tilpasse sig brugeren og huske kontekst på tværs af sessioner.

## Struktur

```
brain/
+-- README.md              # Denne fil
+-- context.md             # Stabil projektkontekst
+-- glossary.md            # Domaenesprog og forkortelser
+-- assumptions.md         # Ikke-verificerede antagelser
+-- open-questions.md      # Uafklarede forhold
+-- decisions/             # Architecture Decision Records
|   +-- ADR-0001-agent-harness.md
+-- maps/                  # Oversigtskort
|   +-- agent-map.md
|   +-- skill-map.md
+-- memory/                # Sessionslogfiler
+-- personal/              # Personlig brugerhukommelse
|   +-- user-profile.md
|   +-- preferences.md
|   +-- lessons-learned.md
|   +-- open-decisions.md
+-- diary/                 # Teknisk arbejdsdagbog
+-- tasks/                 # Opgaver og backlog
+-- runbooks/              # Driftsguides
    +-- how-to-add-agent.md
    +-- how-to-add-skill.md
    +-- how-to-promote-project-harness-to-global.md
```

## Vedligeholdelsesregler

1. **Laes foerst**: Naar en agent starter paa en kompleks opgave, skal den laese `context.md` og relevante ADRs.
2. **Opdater loebende**: Hvis en antagelse verificeres eller afkraeftes, flyt den fra `assumptions.md` til en ADR eller fjern den.
3. **Stil spoergsmaal**: Hvis en agent opdager uafklarede forhold under arbejdet, tilfoej dem til `open-questions.md`.
4. **Ingen duplikation**: Brain maa ikke duplikere information der allerede findes i `AGENTS.md` eller skills. Henvis i stedet.
5. **Sprog**: Skriv paa dansk, medmindre tekniske standarder (som YAML, ADR-skabeloner eller kodekommentarer) kraever engelsk.
6. **Ingen kode**: Brain indeholder ikke kode, scripts eller konfigurationer — kun dokumentation og kontekst. Kode hoerer hjemme under `skills/`, `agents/` eller `scripts/`.

## Relation til AGENTS.md

- `AGENTS.md` i projektroden er den **operative** kontrakt: runtime-stier, arbejdsregler, og hurtig-reference.
- `brain/` er den **strategiske** hukommelse: hvorfor tingene er som de er, og hvad de betyder.