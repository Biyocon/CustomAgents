# Skill: QA Reviewer

> Udfør teknisk review af leverancer
> Input: Leverance (dokument, beregning, tabel, diagram)
> Output: QA-matrix med observationer, konsekvenser og anbefalinger

---

## Formål

Gennemfør et struktureret teknisk review af en leverance for at identificere fejl, mangler, uoverensstemmelser og forbedringspotentiale.

## Input

- Leverance til review
- Projektets krav og standarder
- Tidligere versioner (hvis relevant)

## Metode

1. **Forberedelse**
   - Læs leverancen igennem én gang uden at markere
   - Forstå kontekst og formål

2. **Kontrol af forudsætninger**
   - Er forudsætninger angivet?
   - Er datakilder angivet?

3. **Kontrol af beregninger**
   - Er beregninger sporbare?
   - Er enheder korrekte?
   - Er mellemtrin vist?

4. **Kontrol af konsistens**
   - Stemmer tekst overens med tabel?
   - Stemmer tabel overens med tegning?
   - Er der modsigelser?

5. **Kontrol af grænseflader**
   - Er alle grænseflader identificeret?
   - Er ansvar fordelt?

6. **Kontrol af sikkerhed**
   - Er sikkerhedskritiske forhold behandlet?
   - Er der risici, der ikke er adresseret?

7. **Kontrol af formulering**
   - Er formuleringer klare og præcise?
   - Er der uklare eller tvetydige formuleringer?

8. **Kontrol af actions**
   - Er der åbne punkter?
   - Har hvert punkt en ejer og deadline?

## Output

| ID | Type | Alvorlighed | Observation | Konsekvens | Anbefaling | Status |
|---|---|---|---|---|---|---|

## Alvorlighed

- **Kritisk:** Fejl, der kan føre til forkert projektering eller sikkerhedsrisiko
- **Høj:** Fejl, der skal rettes før videre bearbejdning
- **Medium:** Bør rettes, men blokerer ikke
- **Lav:** Kosmetisk eller mindre forbedring

## Begrænsninger

- Reviewer må ikke godkende sikkerhedskritiske løsninger
- Skal altid foreslå, hvad der kræver menneskelig beslutning
- Skal markeres som review, ikke endelig godkendelse
