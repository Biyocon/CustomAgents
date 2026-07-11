# Antagelser

> Denne liste indeholder antagelser der endnu ikke er verificeret. Naar en antagelse bekraeftes
> eller afkraeftes, skal den fjernes herfra og dokumenteres i en ADR eller i projektets faktiske
> dokumentation. Kurateret 2026-07-11 efter fuldfoert ADR-roadmap A-F: afloeste antagelser
> (dual-runtime-drift, temp/-bloat, frontmatter-non-compliance, forældet roadmap-fil) er fjernet
> — de er dokumenteret som loest i ADR/CHANGELOG/docs/done/. Nummerering rettet (var dubleret).

## Domaene og indhold

1. **BBTR/BBE/BKP-indhold skal verificeres senere** (stadig gyldig)
   - Vi antager at de domaenespecifikke skills der refererer til BBTR, BBE og BKP er korrekte,
     men de er ikke endeligt valideret mod Banedanmarks officielle kilder.
   - *Impact*: Fejl i domaeneskills kan give forkerte raad.
   - Status 2026-07-11: fortsat gyldig. K-kompetencetabeller i rolleagenter baerer eksplicit
     "verificer mod PDF"-markering; verifikation mod FB-PDF'erne er igangsat (se profiler).

2. **Funktions- og stillingsbeskrivelser er repraesentative** (stadig gyldig)
   - De 213+ FB-PDF'er antages at daekke de roller der skal modelleres.
   - *Impact*: Hvis roller mangler, vil agent-koordinering vaere ufuldstaendig.

## Tekniske antagelser

3. **Alle modeller laeser AGENTS.md**
   - Vi antager at Codex, Kimi, Qwen Code, Gemini Code og Claude respekterer `AGENTS.md` i
     projektroden (Claude via CLAUDE.md-pointer).
   - *Impact*: Hvis en model ignorerer filen, vil arbejdsregler og stier ikke overholdes.

4. **VS Code er den primaere IDE**
   - Harnesset er optimeret til VS Code med relevante extensions.
   - *Impact*: Brugere af andre IDE'er kan opleve friktion.

5. **Harnesset kan promoveres til global profil under `C:\Users\Biyocon`**
   - Opdateret 2026-07-11: den gamle antagelse pegede paa `C:\Users\HMDR` (forældet maskine).
     Registryens `promotion_target_global_path` er `C:\Users\Biyocon`. VIGTIGT forbehold:
     `C:\Users\Biyocon\.agents\` er allerede optaget af MasterBrain — promovering skal derfor
     ske til en ikke-kolliderende sti (afgjort ved Fase G-eksekvering; se runbook + ADR-0004).
   - *Impact*: Naiv koersel af den gamle runbook ville have overskrevet MasterBrain-indhold.

6. **PowerShell er tilgaengelig til validering**
   - Valideringsscripts antages at kunne koere i projektets PowerShell-miljoe (Windows PowerShell 5.1).
   - *Impact*: Paa systemer uden PowerShell daekker Python-validatorerne (validate-schemas.py,
     generate-runtime.py --check) kernen.

## Organisatoriske antagelser

7. **En AGENTS.md er tilstraekkelig for alle modeller**
   - Faelles model-agnostisk fil frem for model-specifikke filer.
   - *Impact*: Hvis modeller har fundamentalt inkompatible behov, kan faellesfilen blive for
     generisk — model-adapters/-laget er ventilen.

8. **Subagents kan koordineres via filsystemet**
   - Agenter deler tilstand ved at laese/skrive filer i `.agents/`-strukturen.
   - *Impact*: Race conditions ved parallelle skrivende agenter — haandhaevet modforanstaltning:
     "een skribent ad gangen" (OneDrive-laeren, bekraeftet ved near-miss 2026-07-11).

## Overfoersel af Sharmake-moenstre (2026-07-01)

9. **Nye operationelle komponenter i `.agents/` er brugbare og korrekt placeret**
   - Commands, tools, templates, plugins og personal memory er overfoert fra Sharmake-template.
   - Status 2026-07-11: `.agents/` ER nu canonical (PR F), saa komponenterne ligger rigtigt;
     deres indholdsmaessige modenhed er fortsat scaffold-niveau og uvalideret.
