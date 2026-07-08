# Validate-harness scripts — side-by-side map

> **OPDATERET 2026-07-09: Konsolidering gennemfoert.** De tre scripts beskrevet
> nedenfor er ikke laengere uafhaengige. Alle tre delegerer nu til ét kanonisk
> script: **`scripts/Validate-Harness-Unified.ps1`**. Kald til de tre gamle
> stier (`scripts/validate-harness.ps1`, `scripts/Validate-AgentHarness.ps1`,
> `.agents/scripts/validate-harness.ps1`) virker stadig — de er bevaret som
> tynde wrappers af hensyn til bagudkompatibilitet — men de kalder alle det
> samlede script og giver derfor nu **samme resultat uanset hvilken sti man
> bruger** (foer konsolideringen gav de tre forskellige, ikke-overlappende
> resultater, som tabellen nedenfor dokumenterer historisk).
>
> Brug `scripts/Validate-Harness-Unified.ps1` direkte til alt nyt. Se
> doc-kommentaren i selve scriptet for hvilken sektion (A-H) der stammer fra
> hvilket af de tre oprindelige scripts, og se de tre gamle filer for deres
> egne (nu meget korte) deprecation-headers.
>
> Tabellen og teksten nedenfor er bevaret uaendret som historisk kontekst for
> HVORFOR konsolideringen var noedvendig, og hvad hvert script isoleret set
> plejede at daekke, foer de blev slaaet sammen.

---

Der findes (fandtes, foer 2026-07-09) tre uafhaengige "valider harness"-scripts i repoet. De tjekkede
**materielt forskellige, ikke-overlappende strukturer** — ingen af dem tjekkede
det de to andre tjekkede. At koere kun ét gav en falsk-ren rapport for resten
af harnesset. Dette dokument findes saa en fremtidig laeser ikke skal genopdage
det ved at laese alle tre scripts igen.

Foer konsolideringen var dette kun dokumentation — ingen af scriptene var
slettet, omdoebt eller sammenlagt. Det er de nu (2026-07-09): alle tre er
tynde wrappers om `scripts/Validate-Harness-Unified.ps1`.

## Oversigt (historisk - foer konsolidering)

| Script | Linjer | Hvad den tjekkede | Hvad den IKKE tjekkede |
|---|---|---|---|
| `scripts/validate-harness.ps1` | 94 | `.vscode/.codex/agents/agent-roster.json` mod `Avatar/agents/System_Prompt_Agent_<id>.md`: fil findes, ```` ```text ```` fence, mojibake-encoding (Ã¦/Ã); orphan-filer; `.vscode/.codex/agents/banedanmark/*.md` har YAML-frontmatter; `Root/registry.yaml` eksistens; `.vscode/.codex/Brain/{glossary,open-questions,source-map}.md` eksistens | Detaljeret felt-konsistens (status/skills/avatar/id) mellem roster og .md; hele `.agents/`-strukturen (registry.yaml, agents/, skills/) |
| `scripts/Validate-AgentHarness.ps1` | 197 | Samme roster/`Avatar/agents` par, men dybere: `status: active`-felt, skills-liste diff (roster vs. .md frontmatter, begge veje), avatar-filnavn match, id-felt match (ERROR ved mismatch), orphans, banedanmark `bd-*.md` frontmatter; valgfri JSON-rapport (`-JsonReport`). Del af v2-toolset sammen med `Export-Registry.ps1`, `New-AgentProfile.ps1`, `Sync-Skills.ps1`, `Activate-Agent.ps1` | ```` ```text ```` fence/encoding-tjek; `Root/registry.yaml`; `.vscode/.codex/Brain/*.md`; hele `.agents/`-strukturen |
| `.agents/scripts/validate-harness.ps1` | 244 | Koerte `.agents/scripts/audit-harness.ps1` (medmindre `-SkipAudit`); `.agents/registry.yaml` har `version:` og `agents:`-felter; `.agents/agents/<id>/`-mapper mod `agent-roster.json` (begge veje); `.agents/skills/*/SKILL.md` har markdown-overskrift; skrev `.agents/reports/validation_report.md` med `.bak`-backup | `Avatar/agents/*.md` indhold overhovedet (fence, encoding, status/skills/avatar/id-felter); `.vscode/.codex/agents/banedanmark/*.md` frontmatter; `Root/registry.yaml` (den anden registry-fil, uden for `.agents/`); Brain-filer |

## Konsekvens (historisk)

For **fuld harness-validering** skulle alle tre scripts koeres:

```powershell
.\scripts\validate-harness.ps1
.\scripts\Validate-AgentHarness.ps1
.\.agents\scripts\validate-harness.ps1
```

Hver enkelt koersel daekkede kun sin egen del af repoet:

- `scripts/validate-harness.ps1` + `scripts/Validate-AgentHarness.ps1` →
  daekkede `.vscode/.codex/`-strukturen (roster + `Avatar/agents/*.md` +
  banedanmark-agenter). De to overlappede delvist paa samme filer, men med
  forskellig tjek-dybde (se tabel).
- `.agents/scripts/validate-harness.ps1` → daekkede den separate
  `.agents/`-struktur (`.agents/registry.yaml`, `.agents/agents/*/`,
  `.agents/skills/*/SKILL.md`) og kaldte desuden
  `.agents/scripts/audit-harness.ps1`.

Ingen af de tre byggede bro mellem `.vscode/.codex/agents/agent-roster.json` og
`.agents/registry.yaml` — hvis disse to skal holdes i sync, er det stadig i dag
(efter konsolideringen) ikke automatiseret af noget script. Konsolideringen
samlede kun de tre validerings-scripts i ét, den tilfoejede ingen nye tjek.

## Efter konsolidering (2026-07-09)

`scripts/Validate-Harness-Unified.ps1` udfoerer UNIONEN af alle tjek fra de tre
originaler i ét kald, opdelt i sektioner A-H (se doc-kommentaren i scriptet):

- **A**: Roster <-> `Avatar/agents/*.md` (eksistens/fence/encoding/orphans fra
  `scripts/validate-harness.ps1` + status/skills/avatar/id fra
  `scripts/Validate-AgentHarness.ps1`)
- **B**: Banedanmark, bredde-variant (alle `*.md`) — fra `scripts/validate-harness.ps1`
- **C**: Banedanmark, snaever variant (kun `bd-*.md`) — fra `scripts/Validate-AgentHarness.ps1`
- **D**: `Root/registry.yaml` + `.vscode/.codex/Brain/*.md` — fra `scripts/validate-harness.ps1`
- **E**: `.agents/scripts/audit-harness.ps1` sub-fase — fra `.agents/scripts/validate-harness.ps1`
- **F**: `.agents/registry.yaml` felter — fra `.agents/scripts/validate-harness.ps1`
- **G**: `.agents/agents/<id>/` <-> roster krydstjek — fra `.agents/scripts/validate-harness.ps1`
- **H**: `.agents/skills/*/SKILL.md` overskrift — fra `.agents/scripts/validate-harness.ps1`

Alle tre gamle scripts kalder nu dette script og videresender output/exit code
uaendret. Ét samlet OK/Info/Advarsel/Fejl/Kritisk-resume og én
`.agents/reports/validation_report.md` (med `.bak`-backup) daekker nu begge
klasser af drift (roster/Avatar-drift OG `.agents/`-mappe/roster-drift) i én
koersel.

## Se ogsaa

- Doc-kommentar-blok oeverst i `scripts/Validate-Harness-Unified.ps1` (kanonisk kilde for check-domaene-opdeling).
- Doc-kommentar-blok oeverst i hvert af de tre deprecation-wrapper-filer.
- `docs/architecture/registry-reconciliation.md` — for kontekst om de to registry-filer.
- `docs/architecture/ADR-multi-runtime-agent-system.md` — for `.agents/` vs. `.vscode/.codex/` arkitekturbaggrund.
