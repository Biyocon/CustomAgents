# Antagelser

> Denne liste indeholder antagelser der endnu ikke er verificeret. Naar en antagelse bekraeftes eller afkraeftes, skal den fjernes herfra og dokumenteres i en ADR eller i projektets faktiske dokumentation.

## Domaene og indhold

1. **BBTR/BBE/BKP-indhold skal verificeres senere**
   - Vi antager at de domaenespecifikke skills der refererer til BBTR, BBE og BKP er korrekte, men de er ikke endeligt valideret mod Banedanmarks officielle kilder.
   - *Impact*: Fejl i domaeneskills kan give forkerte raad.

2. **Funktions- og stillingsbeskrivelser er repraesentative**
   - De nuvaerende funktionsbeskrivelser i `Funktions- og stillingsbeskrivelser/` antages at daekke de roller der skal modelleres.
   - *Impact*: Hvis roller mangler, vil agent-koordinering vaere ufuldstaendig.

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
