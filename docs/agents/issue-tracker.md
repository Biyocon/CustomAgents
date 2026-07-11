# Issue Tracker

> Opdateret 2026-07-11 — den tidligere påstand "projektet er ikke et Git-repo" var forældet.

Projektet ER et Git-repo med GitHub-remote (`Biyocon/CustomAgents`, branch `main`).
Issue-tracking foregår med den gate-drevne lokale ticketmodel:

## Struktur

```text
docs/active/   # åbne tickets (#N-titel.md med YAML-frontmatter: id, status, prioritet, deps, blocks)
docs/drafts/   # udkast, endnu ikke aktiveret
docs/done/     # lukkede tickets (flyttes hertil med git mv når acceptkriterier er opfyldt)
```

Pr. 2026-07-11 er alle tickets #1–#13 lukkede (`docs/active/` er tom).

## Regler

- Én ticket = ét afgrænset formål med eksplicitte acceptkriterier ("Done ser sådan ud").
- Tickets lukkes kun med evidens (kommando-output/committede artefakter), aldrig påstande.
- Prioritetsændringer og nye blokeringsrelationer logges i `CHANGELOG.md` / `DEPS.md`.
- Opret ikke GitHub-issues uden eksplicit brugerbesked — den lokale model er den gældende.
