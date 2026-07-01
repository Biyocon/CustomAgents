# Antagelser

> Denne liste indeholder antagelser der endnu ikke er verificeret. Naar en antagelse bekraeftes eller afkraeftes, skal den fjernes herfra og dokumenteres i en ADR eller i projektets faktiske dokumentation.

## Domaene og indhold

1. **BBTR/BBE/BKP-indhold skal verificeres senere** (stadig gyldig)
   - Vi antager at de domaenespecifikke skills der refererer til BBTR, BBE og BKP er korrekte, men de er ikke endeligt valideret mod Banedanmarks officielle kilder.
   - *Impact*: Fejl i domaeneskills kan give forkerte raad.
   - **Status 2026-06-10**: Bekræftet via audit – stadig FORELØBIG i flere skills og agenter.

2. **Funktions- og stillingsbeskrivelser er repraesentative** (stadig gyldig)
   - De nuvaerende funktionsbeskrivelser i `Funktions- og stillingsbeskrivelser/` antages at daekke de roller der skal modelleres.
   - *Impact*: Hvis roller mangler, vil agent-koordinering vaere ufuldstaendig.
   - **Status 2026-06-10**: Bekræftet – 213+ PDF'er er primær kilde, men indlæsning er stadig ufuldendt for flere Banedanmark-roller.

## Nye verificerede forhold fra audit 2026-06-10

3. **Dual-runtime er en realitet og vil vare i overgangsperioden**
   - `.vscode/.codex/` er den aktive autoritative runtime. `.agents/` er fremtidig/reference-struktur.
   - Der er betydelig drift mellem de to (registries, skills, agents, brain, scripts).
   - **Impact**: Agenter og skills kan opføre sig inkonsistent afhængig af hvilken kontekst der bruges. Blokkerer global promotion og `.agents/` aktivering.
   - **Kilde**: Root AGENTS.md, .vscode/.codex/AGENTS.md, QA_2026-06-07_CustomAgents.md, frisk valideringsrapport, MULTI_AGENT_AUDIT_ADAPTED...

4. **Task/harness-roadmap.md er outdated som sandhedskilde**
   - Mange "✅ Done" (faser 1-14) modsiger egne samtidige rapporter og aktuel filtilstand.
   - De åbne faser 6-9 (avatar-prompts, 4 FORELØBIG-agenter, 6 FORELØBIG-skills, validering + promotion) er stadig reelle huller.
   - **Impact**: Planen må ikke bruges som primær styring uden krydstjek mod aktuelle filer og valideringsrapporter.

5. **Skills frontmatter i .agents/skills/-træet er delvist non-compliant**
   - Flere FORELØBIG domæne-skills (banebyg + bdk-*) mangler påkrævet `name:` felt og har inkonsistent trigger/description-format.
   - **Impact**: Validering og discovery bliver upålidelig for den fremtidige model-agnostiske struktur.

6. **Temp/ + duplication er et reelt governance- og hygiene-problem**
   - Temp/ indeholder 195+ filer med gamle generators, vendored copies og backups.
   - Der findes multiple registries, script-duplikater og et u-spec "root/skills/" lag.
   - **Impact**: Øger risiko for at bruge forældet indhold og gør oprydning før promotion nødvendig.

## Tekniske antagelser

3. **Alle modeller laeser AGENTS.md**
   - Vi antager at Codex, Kimi, Qwen Code og Gemini Code alle respekterer og laeser `AGENTS.md` i projektroden.
   - *Impact*: Hvis en model ignorerer filen, vil arbejdsregler og stier ikke overholdes.

4. **VS Code er den primaere IDE**
   - Harnesset er optimeret til VS Code med relevante extensions (Codex, Kimi, etc.).
   - *Impact*: Brugere af andre IDE'er (JetBrains, Neovim) kan opleve friktion.

5. **Stien kan promoveres til `C:\Users\HMDR`**
   - Vi antager at det er teknisk og organisatorisk muligt at kopiere dette harness til en global brugerprofil under `HMDR`.
   - *Impact*: Hvis stien ikke er tilgaengelig, skal promoverings-runbook revideres.

6. **PowerShell er tilgaengelig til validering**
   - Valideringsscriptet `validate-harness.ps1` antages at kunne kore i projektets PowerShell-miljoe.
   - *Impact*: Paa systemer uden PowerShell skal valideringen omskrives.

7. **`Kombi/` forbliver referencekatalog**
   - Vi antager at indholdet i `Kombi/` ikke har copyright- eller licensmaessige begraensninger der forhindrer referencebrug.
   - *Impact*: Juridisk gennemgang kan blive noedvendig.

## Organisatoriske antagelser

8. **En AGENTS.md er tilstraekkelig for alle modeller**
   - Vi antager at en faelles, model-agnostisk `AGENTS.md` daekker behovet bedre end model-specifikke filer (`CODEX.md`, `KIMI.md`, etc.).
   - *Impact*: Hvis modeller har fundamentalt inkompatible behov, kan faellesfilen blive for generisk.

9. **Subagents kan koordineres via filsystemet**
   - Vi antager at agenter kan dele tilstand og koordinere ved at skrive/laese filer i `.agents/`-strukturen.
   - *Impact*: Race conditions eller filkonflikter kan opstaa ved parallelle agent-koersler.

## Overførsel af Sharmake-mønstre (2026-07-01)

10. **Nye operationelle komponenter i `.agents/` er brugbare og korrekt placeret**
    - Commands, tools, templates, plugins og personal memory er overført fra Sharmake-template og tilpasset Custom/Banedanmark-konteksten.
    - De er placeret under `.agents/` selvom `.vscode/.codex/` stadig er aktiv runtime.
    - **Impact**: Indtil `.agents/` aktiveres, vil de nye komponenter ikke være tilgængelige for den aktive VS Code/Codex-runtime medmindre de synkroniseres.
    - **Status**: Overført som scaffolds; skal valideres og eventuelt synkroniseres til `.vscode/.codex/`.
