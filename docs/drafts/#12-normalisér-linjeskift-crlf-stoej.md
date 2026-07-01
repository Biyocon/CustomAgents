---
id: "#12"
title: "Normalisér linjeskift permanent (.gitattributes + renormalize) — fjern CRLF-støj"
fase: "F"
sprint: "TBD"
status: done
prioritet: "P2"
deps: []
blocks: []
oprettet: "2026-07-02"
lukket: "2026-07-02"
---

---

## Hvad & Hvorfor

`core.autocrlf=true` kombineret med blandede LF/CRLF-linjeskift i git-index gør at
~180 filer permanent vises som " M" i `git status` og udløser
"LF will be replaced by CRLF"-advarsler ved enhver `git diff`/`status`/`add`. Hårdt
verificeret (2026-07-02) via `git diff --ignore-cr-at-eol --numstat`: 0 filer med reelt
indholdsændring — det er 100% linjeskiftsstøj, ikke tab. Støjen fandtes hele aftenen og
er ikke relateret til filkorruptions-hændelsen samme aften (se CHANGELOG 2026-07-02).
Uden fix bliver ægte fremtidige ændringer svære at skelne fra støj i `git status`, hvilket
var en direkte medvirkende årsag til forsinket opdagelse under nattens hændelse.

---

## Done ser sådan ud

`git status --short` viser kun ægte ændrede/nye filer — ingen af de ~180 kendte
CRLF-støjfiler optræder længere som "M". `git diff --stat` kører uden
"LF will be replaced by CRLF"-advarsler.

---

## Teknisk scope (udført)

- [x] Tilføj `.gitattributes` i repo-roden: `* text=auto` + eksplicitte `binary`-regler for
      `*.png`, `*.jpg`, `*.jpeg`, `*.xlsx`, `*.docx`, `*.pdf`, `*.ttf` (uden `eol=lf`-tvang,
      jf. bruger-beslutning: `text=auto` alene er tilstrækkeligt)
- [x] Kør `git add --renormalize .`
- [x] Verificér: `git status --short` viser kun forventede filer — bekræftet tomt for de
      ~180 kendte støjfiler
- [x] Committ normaliseringen i dedikeret commit `61201b3e`, adskilt fra indholdsændringer
- [x] Opdag og luk regression: den gamle `.gitattributes` (fra `Initial_commit`) indeholdt
      `*.zip filter=lfs diff=lfs merge=lfs -text` for 2 LFS-sporede zip-filer
      (`.vscode/archive/upstream-skills/skills/bbtr-webdesign.zip`, `.../blender/files.zip`).
      Denne linje blev overskrevet af renormaliseringen og genindsat i `38eb411f`.

---

## Åbne spørgsmål (afklaret)

- **`eol=lf`-tvang:** Ikke nødvendig — `text=auto` alene fjerner støjen uden at ændre noget
  på disk, hvilket var den sikreste vej givet `core.autocrlf=true` allerede er sat lokalt.
- **Binære filer:** Dækket via eksplicitte `binary`-regler (se ovenfor). BOM fra PowerShell's
  `Set-Content` endte forrest i filen — bekræftet kosmetisk (git `check-attr` fungerer korrekt
  alligevel), ikke rettet, kan ryddes op senere uden hast.

---

## Resultat

3 commits på `main`, alle uafhængigt verificeret af en parallel review-session (Fable 5):

1. `829b34ad` — genoprettelse af 5 korrumperede filer (separat hændelse, se CHANGELOG 2026-07-02)
2. `61201b3e` — `.gitattributes` med `text=auto`, fjernede alle ~180 falske " M"-filer
3. `38eb411f` — LFS-regel for `*.zip` genindsat (regression fra #2, fanget samme session)

Arbejdstræ bekræftet rent, LFS-linkage bekræftet intakt (`git lfs ls-files` viser fortsat
begge zip-filer). `.\.agents\scripts\validate-harness.ps1`-kørslen efter #6/#3 kan verificere
resten; ikke en forudsætning for at lukke denne ticket.

## Blocker / noter

2026-07-02: Lukket. Læring overført til `LESSON.md`: (1) tjek altid eksisterende filindhold
før `Set-Content`-overskrivning af konfigurationsfiler som `.gitattributes`, (2) Cowork-
sandboxens OneDrive-mount kan vise forældet arbejdstræ-indhold selvom `.git`-historikken er
frisk — kør aldrig index-muterende git-kommandoer derfra; verificér via den lokale
PowerShell/Git Bash-session i stedet.
