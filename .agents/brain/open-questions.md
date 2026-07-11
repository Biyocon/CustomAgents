# Uafklarede spoergsmaal

> Liste over forhold der endnu ikke er besluttet. Disse skal afklares foer harnesset betragtes
> som produktionsklart. Kurateret 2026-07-11 efter fuldfoert ADR-roadmap A-F: spoergsmaal 7-8
> (runtime-migration og single-source-of-truth) er BESVARET af PR F-aktiveringen og fjernet;
> dublet-nummerering rettet. Lukkede spoergsmaal dokumenteres i ADR'er/docs, ikke her.

## Antal og typer agenter

1. **Skal der vaere flere agenter?**
   - Hvor mange specialiserede agenter er optimalt? Harnesset har i dag 47 (28 personaer + 19 rolleagenter).
   - Skal hver fagdisciplin (staerkstroem, signal, bane, bro, miljoe) have sin egen agent?

2. **Skal der vaere en "orkestrator"-agent?**
   - En meta-agent der fordeler opgaver til specialister og samler resultater?
   - Eller skal brugeren selv vaelge agent per opgave (som i dag via invoke-agent)?
   - Note 2026-07-11: Perplexity-orchestrator-moenstrene er dispositioneret som input i
     `docs/architecture/memory-governance.md` (uden for roadmap A-F; kraever ny ADR).

## Domaeneindhold i skills

3. **Hvilke Banedanmark-dokumenter skal indlaeses i skills?**
   - Skal vi have skills der indlaeser og refererer til konkrete PDF'er (f.eks. ORS-regler, trafikcirkulaerer)?
   - Hvordan haandteres opdateringer naar dokumenter aendres?

4. **Skal domaeneskills vaere statiske prompts eller dynamiske queries?**
   - Statisk: Al viden er skrevet direkte i `SKILL.md` (nuvaerende model).
   - Dynamisk: Skills henter data fra eksterne kilder ved koersel.
   - Note 2026-07-11: den tidligere reference til `Kombi/` er droppet — mappen findes ikke i
     repoet (jf. PROJEKT_PLAN-oenskelisten: importeres eller fjernes fra planer).

## Test og kvalitet

5. **Hvordan testes harnesset optimalt?**
   - Skal vi have et automatiseret test-suite der verificerer at agenter og skills loader korrekt?
   - Skal der vaere "gyldne" testcases — kendte input/output-par — for hver agent?
   - Note 2026-07-11: strukturel validering ER nu daekket (validate-schemas.py = 0 overtraedelser,
     Validate-Harness-Unified, generate-runtime --check). Spoergsmaalet gaelder ADFAERDS-test.

6. **Hvordan maaler vi agent-kvalitet?**
   - Noejagtighed af svar? Overholdelse af arbejdsregler? Tid til opgaveloesning?

## Drift

7. **Hvordan haandteres samtidige opdateringer af Brain?**
   - Hvis to agenter samtidig forsoger at opdatere `assumptions.md`, hvordan undgaar vi konflikter?
   - Skal der indfoeres en laasemekanisme eller et review-flow?
   - Note 2026-07-11: reglen "een skribent ad gangen" (OneDrive-laeren) gaelder og blev bekraeftet
     ved en near-miss 2026-07-11 (to sessioner, ingen skade — den ene stoppede korrekt). En
     teknisk laasemekanisme er fortsat uafklaret.

## Sikkerhed og compliance

8. **Maa agent-output gemmes i projektet?**
   - Hvis agenter arbejder med fortrolige Banedanmark-data, skal output saa logges?
   - Skal der vaere en "slet alt"-mekanisme?

9. **Hvordan sikres vi at skills ikke hallucinerer domaeneviden?**
   - Skal kritiske skills (f.eks. CSM-RA-compliance) have en "menneskelig godkendelse"-gate?
   - Note: K-kompetencetabeller i rolleagenter baerer allerede eksplicit "verificer mod PDF
     foer operationel/sikkerhedskritisk brug"-markering som konservativ vagt.
