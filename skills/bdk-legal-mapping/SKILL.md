---
name: bdk-legal-mapping
description: KortlÃ¦g Banedanmarks lov- og regelkrav til intern implementering og proceskontekst i jernbanesikkerhed.
---

# BDK LovkravskortlÃ¦gning

## HvornÃ¥r skillen bruges
- NÃ¥r brugeren spÃ¸rger hvilke love/regler der gÃ¦lder for et sikkerhedsemne.
- NÃ¥r brugeren vil mappe lovkrav til procesimplementering.
- NÃ¥r brugeren Ã¸nsker compliance-overblik med sporbare kilder.

## Arbejdsgang
1. LÃ¦s `references/source-map.md`.
2. IdentificÃ©r retslaget:
   - dansk lov/bekendtgÃ¸relse/lbk
   - EU-forordning (CSM/Ã¸vrige)
   - intern implementeringskontekst
3. Byg mappingtabel:
   - juridisk kilde
   - kravresumÃ©
   - intern proces- eller kontrolreference
   - evidensplacering (repo path)
4. MarkÃ©r ukendte koblinger eksplicit; udled ikke bindende tekst.

## Outputformat
1. Juridisk afgrÃ¦nsning
2. Mappingtabel (krav -> implementering)
3. Huller/usikkerheder
4. Prioriteret nÃ¦ste handling
5. Kilder (repo-stier)

## Styringsregler
- Ved ordlydsnÃ¦re spÃ¸rgsmÃ¥l: citÃ©r kort og henvis til kildefil.
- PrÃ¦senter aldrig output som formel juridisk rÃ¥dgivning.
- Ved kildekonflikt: vis begge kilder og eskalÃ©r til menneskelig validering.
