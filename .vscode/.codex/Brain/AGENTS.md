# Brain (GENERERET pointer)

> **GENERERET af `.agents/scripts/generate-runtime.py`** — håndredigeres aldrig.
> Adapter: codex

Projektets hukommelse er **canonical**: `.agents/brain/` (context, glossary, assumptions,
open-questions, decisions/, maps/, runbooks/, memory/-snapshots, source-map).

Dette runtime-Brain er reduceret til denne pointer ved post-PR F-oprydningen (2026-07-11):
det tidligere indhold var frosset legacy uden unik varig viden — alt blev landet i canonical
ved PR E (se `docs/architecture/memory-governance.md`, mapping-tabellen) og filerne er
bevaret i git-historik.

Læserækkefølge ved komplekse opgaver:
1. `primer.md` (rod)
2. `.agents/brain/context.md`
3. `.agents/brain/open-questions.md` + `.agents/brain/assumptions.md`
4. Relevant agentprofil + skills

Ny varig viden landes ALTID i `.agents/brain/` — aldrig her.
