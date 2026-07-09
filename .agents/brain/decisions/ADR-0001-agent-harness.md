# ADR-0001: Model-agnostisk agent-harness med .agents/ struktur

## Kontekst

Projektet har eksisteret med en `.vscode/.codex/`-struktur som aktiv runtime for AI-agenter. Med introduktionen af flere modeller (Codex, Kimi, Qwen Code, Gemini Code) opstaar behovet for en faelles, model-agnostisk struktur der ikke er laast til een klient eller een model.

## Beslutninger

### Beslutning 1: Model-agnostisk AGENTS.md fremfor model-specifikke filer

**Valg**: Vi bruger een faelles `AGENTS.md` i projektroden i stedet for at oprette `CODEX.md`, `KIMI.md`, `QWEN.md`, `GEMINI.md` osv.

**Motivation**:
- reducerer duplikation og drift mellem filer
- sikrer at alle modeller modtager samme arbejdsregler og stier
- forenkler vedligeholdelse — aendringer skal kun foretages et sted

**Konsekvenser**:
- `AGENTS.md` skal skrives i generelle termer uden model-specifikke tricks
- Hvis en model har saerlige behov, loeses det via adaptere under `.agents/model-adapters/`, ikke via separate root-filer

### Beslutning 2: `.agents/` som ny model-agnostisk runtime

**Valg**: Vi introducerer `.agents/` som ny topniveau-struktur med foelgende undermapper:
- `brain/` — persistent kontekst og hukommelse
- `agents/` — agent-definitioner
- `skills/` — genanvendelige evner
- `scripts/` — validering og vedligeholdelse
- `model-adapters/` — model-specifikke tilpasninger

**Motivation**:
- adskiller aktiv runtime fra IDE-konfiguration (`.vscode/`)
- goer det muligt at promovere harnesset til andre projekter og brugere
- understoetter flere modeller uden klaent-laasning

**Konsekvenser**:
- `.vscode/.codex/` bevares som aktiv runtime indtil migration er valideret
- dobbeltstruktur i en overgangsperiode kraever klar dokumentation
- stier i `AGENTS.md` skal opdateres naar migrationen fuldfoeres

### Beslutning 3: `Kombi/` som referencekatalog

**Valg**: `Kombi/` bruges udelukkende som inaktivt referencekatalog med upstream-materiale og inspiration. Intet i `Kombi/` aktiveres automatisk.

**Motivation**:
- forhindrer at uvedkommende eller uverificeret materiale paavirker agent-adfaerd
- giver et kontrolleret opt-in moenster: materialer skal bevidst reaktiveres
- reducerer stoey i agent-kontekst

**Konsekvenser**:
- Agent-udviklere skal manuelt kopiere/tilpasse materialer fra `Kombi/` til `.agents/`
- Stoerre friktionsmodstand mod "det virkede i Kombi, hvorfor ikke her?"

## Status

| Dato | Status |
|------|--------|
| 2026-05-06 | Besluttet og implementeret i `.agents/`-strukturen |

## Relaterede filer

- `AGENTS.md` (projektrod)
- `.agents/brain/context.md`
- `.agents/brain/assumptions.md`
