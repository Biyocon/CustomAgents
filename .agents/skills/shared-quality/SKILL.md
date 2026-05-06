---
trigger: [shared-quality, qa, preflight, leverancekontrol, kvalitetssikring, verification]
description: Generel kvalitetssikrings-skill for alle leverancer. Sikrer at output matcher kvalitetskriterier før aflevering.
---

# Shared Quality

## TL;DR

Brug denne skill til at sikre at alle leverancer opfylder minimumskrav før de sendes videre.

**Hvad er aktivt:**
- Leverancekontrol tjekliste
- Runtime-kerneregler (`.vscode/.codex/` som kilde til sandhed)
- Domæneadskillelse (`Kombi/` er reference, ikke aktiv)
- Artefaktplacering (scripts til `temp/`)

**Hvad er passivt:**
- Ingen automatisk kvalitetsmåling — det er agentens ansvar at anvende tjeklisten

## Hurtig-reference

| Kontrol | Spørgsmål | Handling hvis nej |
|---------|-----------|-------------------|
| Kontekst | Har jeg læst AGENTS.md? | Læs AGENTS.md først |
| Kilde | Bruger jeg `.vscode/.codex/` som runtime? | Omdiriger til `.vscode/.codex/` |
| Domæne | Arbejder jeg inden for Banedanmark-domænet? | Marker hvis nej |
| Output | Skriver jeg scripts til `temp/`? | Omdiriger til `temp/` |
| Dokumentation | Er ændringer dokumenteret? | Tilføj til Brain |

## Detaljeret vejledning

### Leverancekontrol workflow

1. **Før opstart:**
   - Læs `AGENTS.md`
   - Bekræft at `.vscode/.codex/` er aktiv runtime
   - Identificér relevante skills

2. **Under arbejdet:**
   - Skriv scripts til `temp/`
   - Brug `uv run` til Python
   - Dokumentér antagelser i Brain

3. **Før aflevering:**
   - Kør `.agents/scripts/validate-harness.ps1` (hvis relevant)
   - Verificér at filer ikke overskrives uden tilladelse
   - Tjek at `AGENTS.md` er opdateret hvis struktur ændres

### Verificeringsprotokol

- **Kode:** Er der test? Kører de?
- **Dokumenter:** Er de korrekte? Er stavekontrol kørt?
- **Skills:** Er de testede? Har de trigger-ord?
- **Agenter:** Har de profile.md og skills.yaml?

## Dybt reference

### Godkendelseskriterier

| Kategori | Kriterium | Minimum |
|----------|-----------|---------|
| Kode | Tests passer | 80% coverage |
| Dokument | Stavekontrol | Ja |
| Skill | Trigger defineret | Ja |
| Agent | Profile + skills | Begge filer |
| Brain | ADR for større ændringer | Ja |

### Kendte fejlscenarier

- **Konteksttab:** Agent glemmer AGENTS.md → genindlæs fra filsystem
- **Forkert runtime:** Bruger `.vscode/archive/` → omdiriger
- **Manglende backup:** Overskriver fil uden backup → marker som kritisk
