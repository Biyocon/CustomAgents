# Design & arkitektur — Agent Harness

> **Hvad denne fil ejer:** designbeslutninger, deres *rationale*, og **filteret** som nye
> feature-ønsker skal igennem. Læs den før du designer noget nyt.
>
> **Hvad den IKKE ejer** (én kanonisk kilde pr. emne — dupliker dem ikke herind):
> aktuel arkitektur-**status** → `systemkort.md` · **ønskeliste/idébank** → `PROJEKT_PLAN.md` ·
> **operationelle prompts** → `PROMPT.md` · **arbejdsregler** → `AGENTS.md` ·
> **procedurer** → `.agents/brain/runbooks/` · **tunge beslutninger** → `docs/architecture/ADR-*.md`
> + `.agents/brain/decisions/ADR-*.md`.
>
> Alle stier er repo-relative. Filen indeholder bevidst **ingen absolutte stier** — de rådner
> (fx ved flytning af repoet) og er dokumenteret som en tilbagevendende fejlkilde i `LESSON.md`.

---

## 1. Bærende designbeslutninger (og hvorfor)

### 1.1 `AGENTS.md` som eneste fælles instruktionsfil
OpenAI beskriver `AGENTS.md` som repo-filen hvor en agent læser instruktioner om navigation,
testkommandoer og projektpraksis; filen kan ligge i repoet eller globalt, og dybere `AGENTS.md`-filer
kan have snævrere scope ([OpenAI][1]).

**Valg:** kun `AGENTS.md` i uppercase. **Opret aldrig** model-specifikke *hovedfiler*
(`CLAUDE.md`, `GEMINI.md`, `CODEX.md`, `KIMI.md`) — model-specifikke noter hører i
`.agents/model-adapters/`. *Undtagelse:* en `CLAUDE.md` der **kun** er en pointer til `AGENTS.md`
er tilladt (Claude Code auto-læser den); den må ikke bære selvstændige instruktioner.
**Rationale:** én kilde til adfærd på tværs af runtimes; adapterlaget er ventilen for det
model-specifikke. Formelt: ADR-0001.

### 1.2 Canonical → genereret (den centrale beslutning)
`.agents/` er **canonical** og eneste redigeringssted. Runtime-lagene **genereres** af
`.agents/scripts/generate-runtime.py` og håndredigeres aldrig.

**Rationale:** projektet havde to konkurrerende "aktive" lag i ~3 uger (P0-modsigelse, ticket #1).
Dobbeltvedligehold skalerer ikke og lyver stille. Med generering kan drift *ikke* opstå ubemærket:
`--check` giver exit 1. Formelt: ADR-multi-runtime (Accepted) + ADR-0003; status: `systemkort.md`.

**Konsekvens for alt nyt:** hvis en feature kræver at man redigerer et genereret lag, er designet forkert.

### 1.3 Tre-lags-adskillelse: Vendor / Kurateret / Domæne

| Lag | Sti | Retningslinje |
|-----|-----|---------------|
| **Vendor** | `.agents/vendor/` | Rå open source. **Læs-only** — redigér aldrig direkte. Opdateres via upstream-pull i egen vendor-PR. |
| **Kurateret** | `.agents/skills/` | Udvalgte/tilpassede skills. Små, model-agnostiske. Kildehenvisning bevares. |
| **Domæne** | `.agents/agents/` + `.agents/brain/` | Banedanmark-specifik viden. Bygget på evidens. Uverificeret markeres. |

**Rationale:** uden adskillelsen blandes tredjepartskode, egne regler og domæneviden sammen — og så
kan harnesset hverken opdateres fra upstream eller genbruges på et andet domæne. Det er også
forudsætningen for Fase G-promoveringen (kun de generiske lag blev promoveret; se ADR-0004).

### 1.4 Persona **og** rolle er begge canonical
Personaer (navngivne fagpersoner) i `.agents/agents/<id>/`; Banedanmark-**rolleagenter**
(`agent_model: role`, roster-undtagne) i `.agents/agents/banedanmark/<id>/`.
**Rationale:** de modellerer forskellige ting — et Banedanmark-harness har brug for begge. Falsk
modsætning at vælge. Afgjort 2026-07-11.

### 1.5 Memory-klasser
CANONICAL (`.agents/brain/`, levende) / RUNTIME-LOKAL (genereret pointer) / SNAPSHOT
(`memory/`, `diary/`, `reports/` — append-only, omskrives aldrig).
Detaljer: `docs/architecture/memory-governance.md`.

---

## 2. Designprincipper

### Skills
- Små, skarpe, **komponerbare** — én skill, ét formål.
- **Klart trigger-scope**: `description` skal på engelsk sige *hvornår* skillen bruges
  ("Use this skill when …"), max 1024 tegn. `name:` skal være identisk med mappenavnet.
- Domænetunge regler i `references/`, ikke i `SKILL.md` (hold den under ~500 linjer).
- Scripts kun hvor **deterministisk automatisering** slår promptinstruktion.
- Uverificeret domæneindhold **skal** bære `## Verifikationsstatus` med FORELØBIG-markering.
- Opfind aldrig regelparagraffer, grænseværdier eller procedurenumre uden kilde.

### Agenter
- Target-kontrakt: **alt i `profile.md`** — frontmatter (`id`/`name`/`role`/`category`/`status`/
  `source` + `skills`/`capabilities`) og system-prompten som fenced ```text-blok under
  `## System Prompt`. Ingen sidecar-filer (`skills.yaml` blev afviklet 2026-07-12).
- `profile.md`'s promptblok er **canonical**; `Avatar/agents/System_Prompt_Agent_<id>.md` er afledt
  visning og skal være identisk (vagtes af `--check`).
- Intentioner uden implementering hører i `planned_skills:` — aldrig i `skills:`.
- Domænepåstande skal være sporbare til kilde (FB-PDF'er m.fl.) med eksplicitte forbehold.

### Dokumentation
- **Én kanonisk kilde pr. emne.** Henvis frem for at duplikere.
- **Ingen volatile værdier** i vedvarende dokumenter (antal, HEAD-hashes, statustabeller der
  rådner) — henvis til den kommando/fil der producerer tallet.
- Historik omskrives ikke; superseded planer arkiveres til `docs/plans/arkiv/` med banner.

---

## 3. Beslutningsfilter for nye ønsker

> Kør denne før du bygger noget nyt. Falder ønsket på ét af punkterne, skal designet ændres —
> ikke reglen. Ønsket selv hører i `PROJEKT_PLAN.md`'s ønskeliste, indtil det er filtreret.

1. **Hvilken artefakttype er det?** agent (persona/rolle) · skill · adapter · script/vagt ·
   brain-viden · dokumentation. Passer det i ingen af dem, er det formentlig ikke harness-arbejde.
2. **Kan det bo i canonical (`.agents/`)?** Hvis det kræver håndredigering af et genereret lag →
   **stop**, redesign (jf. 1.2).
3. **Duplikerer det en eksisterende kanonisk kilde?** I så fald: udvid kilden, opret ikke en ny.
4. **Er det model-agnostisk?** Model-specifikt hører i `.agents/model-adapters/`, ikke i kernen.
5. **Kan det verificeres?** Ny struktur skal kunne fanges af `validate-schemas.py` og/eller
   `generate-runtime.py --check`. Kan intet checke det, er det ikke færdigdesignet —
   overvej en ny vagt (mønster: se de eksisterende check-funktioner).
6. **Domæneindhold: er der kildeevidens?** Uden kilde → FORELØBIG-markering, aldrig præsenteret
   som verificeret.
7. **Rører det vendor?** Så er svaret nej — kopiér og tilpas i det kuraterede lag.
8. **Skaber det volatil gæld?** Hardkodede tal/stier/statuslister i prosa = nej.

---

## 4. Anti-mønstre (lært i dette repo — gentag dem ikke)

| Anti-mønster | Hvad det kostede |
|---|---|
| To lag der begge kalder sig "aktiv sandhed" | 3 ugers P0-modsigelse; løst med canonical→genereret |
| Håndvedligeholdt kopi af genereret data | Registry-landskabet voksede til 4 filer; nu 2 (1 canonical + 1 genereret) |
| Volatile tal i prosa | Skill-antal blev rapporteret som 29/73/188 i 3 filer samtidig; nu ét script som kilde |
| HEAD-hash i `primer.md` | Rådnede ved næste commit; jagten var uendelig regres |
| Advarsler man vænner sig til | En brækket regex camouflerede 12 ægte fund som "kendt støj" |
| Domæneindhold uden kilde | K-tabeller/beføjelser der ikke stod i funktionsbeskrivelserne (24 rettelser ved verifikation) |
| `git add -A` i et delt arbejdstræ | Fejede en anden sessions ufærdige fil ind i fremmede commits |
| Uncommitteret arbejde i OneDrive | Filkorruption 2026-07-02 (5 filer trunkeret) |

---

## 5. Kvalitetsporte (design skal kunne passere dem)

- `validate-schemas.py` → **0 overtrædelser** (skema-kontrakt for registry/profiler/skills/adaptere)
- `generate-runtime.py --check` → **exit 0** (canonical ≡ genereret; dækker desuden dangling
  skill-refs, dublet-genopstand, avatar-prompt-dedup, Brain-pointer)
- `scripts/Validate-Harness-Unified.ps1` → 0 fejl (Sektion A–H)
- **Gating:** `.githooks/pre-commit` + `.github/workflows/validate.yml` kører de to første
  automatisk. Nødudgang `SKIP_HARNESS_GATE=1` er til nødsituationer, ikke til vane.
- **Verificér før completion-claims:** kør kommandoen og citér output. Kode på disk er ikke bevis.

---

## Referencer

- [1] OpenAI — *Introducing Codex*: https://openai.com/index/introducing-codex/
- [2] GitHub — `mattpocock/skills`: https://github.com/mattpocock/skills (vendor; kurateret kopi i `.agents/skills/`)
- [3] GitHub — `forrestchang/andrej-karpathy-skills`: https://github.com/forrestchang/andrej-karpathy-skills
  (adfærdsprincipperne er integreret i `AGENTS.md` + `.agents/skills/karpathy-guidelines/`)
