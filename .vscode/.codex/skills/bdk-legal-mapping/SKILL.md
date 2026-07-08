---
name: bdk-legal-mapping
description: Kortlæg Banedanmarks lov- og regelkrav til intern implementering og proceskontekst i jernbanesikkerhed.
---

# BDK Lovkravskortlægning

## Hvornår skillen bruges
- Når brugeren spørger hvilke love/regler der gælder for et sikkerhedsemne.
- Når brugeren vil mappe lovkrav til procesimplementering.
- Når brugeren ønsker compliance-overblik med sporbare kilder.

## Arbejdsgang
1. Læs `references/source-map.md`.
2. Identificér retslaget:
   - dansk lov/bekendtgørelse/lbk
   - EU-forordning (CSM/øvrige)
   - intern implementeringskontekst
3. Byg mappingtabel:
   - juridisk kilde
   - kravresumé
   - intern proces- eller kontrolreference
   - evidensplacering (repo path)
4. Markér ukendte koblinger eksplicit; udled ikke bindende tekst.

## Outputformat
1. Juridisk afgrænsning
2. Mappingtabel (krav -> implementering)
3. Huller/usikkerheder
4. Prioriteret næste handling
5. Kilder (repo-stier)

## Styringsregler
- Ved ordlydsnære spørgsmål: citér kort og henvis til kildefil.
- Præsenter aldrig output som formel juridisk rådgivning.
- Ved kildekonflikt: vis begge kilder og eskalér til menneskelig validering.
