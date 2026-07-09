---
name: bdk-bkp-v17-overview
description: Ekspert-skill til sammenskrivning, kvalitetssikring og videreudvikling af BKP v17 (Brutto Kontrolplan), baseret på TKP og KP efter Banedanmarks BaneByg-standarder.
---

# BDK BKP v17 Overview

## Formål

Denne skill understøtter arbejdet med **BKP v17** (Brutto Kontrolplan) i **udførelsesfasen**. BKP v17 er sammenskrivningen af:

- **TKP** (Tilsynets Kontrolplan)
- **KP** (Kontrolplan – Entreprenørens kontroller)

Skillen sikrer:
- Konsistent struktur (fagpost → hovedpost → post → underpost)
- Ensartet terminologi efter Banedanmarks standarder
- Klar ansvarsplacering og kontroltyper
- Sporbarhed mellem TKP, KP og BKP
- Overholdelse af obligatoriske felter (A-K)

---

## Hvornår bruges denne skill

Brug denne skill når du:

- Sammenskriver TKP og KP til BKP v17
- Opdaterer eller vedligeholder BKP-indhold
- Opretter nye fagposter, hovedposter eller kontrolpunkter
- Kvalitetssikrer eksisterende BKP-materiale
- Harmoniserer struktur, nummerering og sprog
- Forbereder BKP til digital anvendelse (Excel / SharePoint / PowerApps)

---

## BKP Struktur

### Hierarki

```
Fagpost (X.0)
└── Hovedpost (X.Y)
    └── Post (X.Y.Z)
        └── Underpost (X.Y.Z.Æ)
```

### Fagposter

1. Indledning
2. Banebyg og tilbudslisten
3. Spor
4. Jord og ballast
5. Afvanding
6. Kabelomlægning og føringsveje
7. Overkørsler, overgange og adgangsveje
8. Perroner
9. Kørestrøm
10. Sikring
11. Stærkstrøm
12. Broer og konstruktioner
13. Miljø (**Ikke i brug**)
14. Håndtering og bortskaffelse
15. Administration og arbejdsplads
16. Ændringsydelser
17. 1-års justering (Option) (**Ikke i brug**)

---

## Vigtige Regler (Audit)

1. **Udfyld ALTID projekt nr.** (kol A) først.
2. **Brug dropdown-lister** hvor tilgængelige.
3. **KP ID (kol F)** må ALDRIG redigeres manuelt (auto-genereret).
4. **Løbenumre** skal være unikke inden for samme fag+type.
5. **Stopaktiviteter** ja eller nej i Dropdown og kobling til CSM Fare-ID.
6. **Redigér ALDRIG** Dropdown_Data arket.

---

## Logik og Håndtering (Lokationer & Stadier)

### Fra BBE/YB til BKP
Når en post (fx *5.1.1.1 Ø160 PP (SN8) med filtergrus A*) vælges som relevant i **BBE/YB**, genereres de tilhørende **KP ID'er** automatisk i BKP.

### Multiple situationer pr. KP ID
Et kontrolpunkt (KP ID) er designet til at dække posten på tværs af hele projektet. Dette indebærer:
- **Flere lokationer**: Samme kontrolpunkt kan gælde kilometreringer i hele projektet.
- **Flere stadier**: Én KP ID kan dække både sporspærringsarbejder og arbejder uden sporspærring.
- **Risiko**: En KP ID kan som udgangspunkt ikke "lukkes" før alle arbejder med den tilhørende post er udført.

### Tilsynsregistrering
For at håndtere denne kompleksitet i marken, udfylder tilsynet løbende data i **Tilsynsappen** for hver enkelt lokalitet/afsnit samt stadier:
1. **Kontrolafsnit**: Kilometrering (km), station (st.) eller overkørsel (ovk) i km-orden.
2. **Spornummer**: Inkl. banens højre/venstre side.
3. **Kommentar**: Tilsynets specifikke observationer for den pågældende lokation.
4. **Stadie**: Sporspærringsarbejder eller arbejder uden sporspærring.

---

## Sammenskrivningsproces (TKP + KP til BKP v17)

### 1. Analyse
- Identificér overlap mellem TKP og KP
- Find modstridende eller manglende kontrolpunkter
- Kortlæg kontrolpunkter til korrekt fagpost

### 2. Harmonisering
- Ensret terminologi (Banedanmark-standard)
- Konsistent nummerering
- Sammenlæg dubletter intelligent

### 3. Sammenskrivning
- Flet kontrolpunkter logisk
- Angiv ansvarlig part (E(enterprenør) / I (IKT-leder) / B (byggeleder) / T (fagtilsyn))
- Bevar kilde-sporbarhed (TKP vs KP)

### 4. Validering
- Nummerering følger hierarki
- Alle kontrolpunkter har ansvar og kontrolmetode
- Krav og referencer er korrekte
- Sprog er entydigt og imperativt

---

## Ansvarlige parter (dropdown)

- **E** – Entreprenør
- **I** – Ikt-leder
- **B** – Byggeleder
- **T** – Tilsyn

---

## Kontroltyper (dropdown)

- **O** – Opstart 
- **M** – Modtagekontrol 
- **F** – Funktionskontrol 
- **P** – Proceskontrol 
- **S** – Slutkontrol

## Kontrolmetoder (dropdown)

- **Visuel** – Visuel inspektion
- **Måling** – Måling af dimensioner, tolerancer, etc.
- **Test** – Funktionstest, belastningstest, etc.
- **Dokumentkontrol** – Gennemgang af dokumentation

## Sproglige regler

### SKAL bruges
- Imperativ form: "Der skal..."
- Entydige krav (ingen "bør")
- Korte, præcise sætninger
- Konsistent terminologi

### UNDGÅ
- Vage formuleringer
- Dobbelte negationer
- Udefinerede forkortelser

---

## Output

Skillen leverer:
- Klart struktureret BKP-indhold
- Forslag til forbedringer og rettelser
- Tjeklister og kvalitetssikring
- Klarhed om ansvar, kontrol og dokumentation

---

## Resultat

Et **BKP v17-grundlag**, der er:
- Fagligt korrekt
- Konsistent
- Sporbar
- Klar til digital anvendelse

---

## Support

- **E-mail**: [banebyg@bane.dk](mailto:banebyg@bane.dk)
