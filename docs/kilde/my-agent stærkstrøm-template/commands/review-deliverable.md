# Command: Review dette

> Udfør teknisk QA-review af leverance
> Trigger: "Review dette" eller tilsvarende

---

## Formål

Udfør et struktureret teknisk review af en leverance ved at aktivere skill `qa-reviewer.md` og eventuelt agent `qa-engineer.md`.

## Trigger

- "Review dette"
- "QA-review"
- "Gransk dette"
- "Tjek dette"

## Workflow

1. **Modtag leverance**
   - Dokument, beregning, tabel, diagram

2. **Aktivér skill og agent**
   - `skills/qa-reviewer.md`
   - `agents/qa-engineer.md` (hvis stor leverance)

3. **Udfør review**
   - Forberedelse
   - Kontrol af forudsætninger
   - Kontrol af beregninger
   - Kontrol af konsistens
   - Kontrol af grænseflader
   - Kontrol af sikkerhed
   - Kontrol af formulering
   - Kontrol af actions

4. **Generér QA-matrix**
   - Observationer
   - Konsekvenser
   - Anbefalinger

5. **Dokumentér review**
   - Track changes i dokumentet (initialer: AGR)
   - Dato for review
   - Opdater `quality/qa-findings.md`

## Output

- QA-matrix med observationer
- Track changes i dokumentet
- Opdateret `quality/qa-findings.md`

## Begrænsninger

- Reviewer må ikke godkende sikkerhedskritiske løsninger
- Skal altid foreslå, hvad der kræver menneskelig beslutning
- Skal markeres som review, ikke endelig godkendelse
