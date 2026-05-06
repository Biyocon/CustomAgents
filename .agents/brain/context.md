# Projektkontekst

## Hvad er dette projekt?

Dette er et **model-agnostisk agent-harness** bygget til Banedanmark-projekter, primaert rettet mod Codex og Kimi, men med fuld kompatibilitet for Qwen Code og Gemini Code.

Harnesset fungerer som en standardiseret runtime-infrastruktur hvor AI-agenter kan:
- Laese og skrive projektdokumentation
- Haandtere funktions- og stillingsbeskrivelser
- Koordinere tvaerfaglige arbejdsgange inden for jernbanesikkerhed
- Bygge og vedligeholde kompetencestyring

## Noeglekarakteristika

| Egenskab | Beskrivelse |
|----------|-------------|
| **Model-agnostisk** | En struktur (.agents/) der virker paa tvaers af Codex, Kimi, Qwen Code og Gemini Code |
| **Kontekstbevidst** | Brain-mappen baerer domaeneviden saa agenter ikke starter fra nul |
| **Skalerbart** | Nye agenter og skills tilfoejes via standardiserede runbooks |
| **Referencebaseret** | Kombi/ er referencekatalog — ikke aktiv runtime |

## Primaer vs. sekundaer runtime

- **Ny model-agnostisk runtime**: `.agents/` — fremtidens hovedstruktur
- **Aktiv runtime indtil valideret migration**: `.vscode/.codex/` — bevares fuldt funktionel indtil `.agents/` er testet og godkendt

## Maalplatforme

| Model | Prioritet | Status |
|-------|-----------|--------|
| Codex | Primaer | Aktiv |
| Kimi | Primaer | Aktiv |
| Qwen Code | Sekundaer | Kompatibel |
| Gemini Code | Sekundaer | Kompatibel |

## Projektets domaene

Banedanmarks kvalifikationsordning for entreprenoerer daekker:
- Jernbanesikkerhed og sikkerhedscertificering
- Kompetencestyring og -vurdering
- Funktions- og stillingsbeskrivelser
- Trafikale regelsaet (SR, ORS, ORF)
- Risikovurdering og CSM-RA/TSI-compliance

## Hvornaar skal denne fil laeses?

- Ved opsaetning af nye agentarbejdsgange
- Ved komplekse eller flertrinsopgaver
- Naar en agent ikke kender projektets historie eller domaene
- Foer der traekkes arkitekturbeslutninger
