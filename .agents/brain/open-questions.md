# Uafklarede spoergsmaal

> Liste over forhold der endnu ikke er besluttet. Disse skal afklares foer harnesset betragtes som produktionsklart.

## Antal og typer agenter

1. **Skal der vaere flere agenter?**
   - Hvor mange specialiserede agenter er optimalt? 5? 15? 50?
   - Skal hver fagdisciplin (staerkstroem, signal, bane, bro, miljoe) have sin egen agent?

2. **Skal der vaere en "orkestrator"-agent?**
   - En meta-agent der fordeler opgaver til specialister og samler resultater?
   - Eller skal brugeren selv vaelge agent per opgave?

## Domaeneindhold i skills

3. **Hvilke Banedanmark-dokumenter skal indlaeses i skills?**
   - Skal vi have skills der indlaeser og refererer til konkrete PDF'er (f.eks. ORS-regler, trafikcirkulaerer)?
   - Hvordan haandteres opdateringer naar dokumenter aendres?

4. **Skal domaeneskills vaere statiske prompts eller dynamiske queries?**
   - Statisk: Al viden er skrevet direkte i `SKILL.md`.
   - Dynamisk: Skills henter data fra `Kombi/` eller eksterne kilder ved koersel.

## Test og kvalitet

5. **Hvordan testes harnesset optimalt?**
   - Skal vi have et automatiseret test-suite der verificerer at agenter og skills loader korrekt?
   - Skal der vaere "gyldne" testcases — kendte input/output-par — for hver agent?

6. **Hvordan maaler vi agent-kvalitet?**
   - Noejagtighed af svar?
   - Overholdelse af arbejdsregler?
   - Tid til opgaveloesning?

## Migration og drift

7. **Hvornaar migreres `.vscode/.codex/` fuldt til `.agents/`?** (opdateret 2026-07-09)
   - Hvilke kriterier skal vaere opfyldt foer den gamle struktur kan nedlaegges?
   - Skal der vaere en "soft launch" periode hvor begge strukturer koerer sideloebende?
   - **Status efter beslutning 2026-07-09**: Retningen er nu afgjort — `docs/architecture/ADR-multi-runtime-agent-system.md`
     er Accepted (se `.agents/brain/decisions/ADR-0003-2026-07-09-multi-runtime-accepted.md`).
     `.agents/` skal modnes til canonical source of truth; `.vscode/.codex/` forbliver aktiv
     runtime indtil PR B-F (schema, adapters, export/validation-scripts, aktivering) er
     gennemført. **"Hvornår" og de konkrete kriterier er stadig ikke fastlagt** — kun retningen
     er besluttet, ikke tidsplanen eller de tekniske forudsætninger. Spørgsmålet forbliver derfor
     åbent, men er ikke længere modstridende med ADR-0002 (se ADR-0003).

8. **Hvordan sikres single source of truth under dual-runtime?** (nyt spørgsmål 2026-06-10)
   - Hvordan undgår vi at agenter/skills bruger forskellige versioner af registry, roster, brain og skills?
   - Skal der være en master + sync-mekanisme, eller skal `.agents/` kun være tynd reference indtil aktivering?

9. **Hvordan haandteres samtidige opdateringer af Brain?**
   - Hvis to agenter samtidig forsoger at opdatere `assumptions.md`, hvordan undgaar vi konflikter?
   - Skal der indfoeres en laasemekanisme eller et review-flow?

## Sikkerhed og compliance

9. **Maa agent-output gemmes i projektet?**
   - Hvis agenter arbejder med fortrolige Banedanmark-data, skal output saa logges?
   - Skal der vaere en "slet alt"-mekanisme?

10. **Hvordan sikres vi at skills ikke hallucinerer domaeneviden?**
    - Skal kritiske skills (f.eks. CSM-RA-compliance) have en "menneskelig godkendelse"-gate?
