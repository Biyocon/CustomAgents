# Excel Schema: Load List

> Kolonnedefinitioner og datavalidering for load list i Excel.

---

## Kolonner

| Kolonne | Type | Obligatorisk | Validering | Bemærkning |
|---------|------|-------------|------------|------------|
| Tag nr. | Tekst | Ja | Unik | |
| System | Tekst | Ja | | |
| Område | Tekst | Nej | | |
| Udstyrstype | Tekst | Ja | | |
| Beskrivelse | Tekst | Nej | | |
| Forsyning fra | Tekst | Nej | | |
| Tavle | Tekst | Nej | | |
| Spænding | Heltal | Ja | 230, 400, 690, etc. | V |
| Faser | Tekst | Ja | 1F, 3F | |
| Installeret effekt | Decimaltal | Ja | > 0 | kW |
| Driftseffekt | Decimaltal | Nej | > 0 | kW |
| Samtidighedsfaktor | Decimaltal | Nej | 0-1 | |
| cos φ | Decimaltal | Nej | 0-1 | |
| Virkningsgrad | Decimaltal | Nej | 0-1 | |
| Beregnet strøm | Decimaltal | Nej | > 0 | A |
| Startstrøm | Decimaltal | Nej | > 0 | A |
| Driftstype | Tekst | Nej | Kontinuerlig, Intermitterende, Standby, Nød | |
| Kritikalitet | Tekst | Nej | A, B, C | |
| Backup/nødstrøm | Tekst | Nej | | |
| Kabelreference | Tekst | Nej | | |
| Beskyttelse | Tekst | Nej | | |
| Datakilde | Tekst | Nej | | |
| Status | Tekst | Nej | OK, Antagelse, Manglende | |
| Kommentar | Tekst | Nej | | |
| Åben action | Tekst | Nej | | |

## Datavalidering

- **Unikhed:** Tag nr. skal være unikke
- **Referencer:** Tavle skal eksistere i tavlestruktur
- **Beregninger:** Beregnet strøm skal stemme overens med formel

## Begrænsninger

- Skemaet skal tilpasses projektspecifikke krav
- Valideringsregler skal testes

---

*Afventer brugerinput*
