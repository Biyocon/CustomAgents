#!/usr/bin/env python3
"""Generate runtime output from the canonical .agents/ layer (PR D; activated PR F).

ADR-multi-runtime (Accepted 2026-07-09): .agents/ is canonical; runtime layers
are generated. Since the PR F activation (2026-07-11) the live runtime
(.vscode/.codex/agents/ + Brain pointer) is produced by this script — edit
canonical, run --apply, verify --check exit 0. Never hand-edit generated files.

What it does per adapter with status 'active' (today: codex → .vscode/.codex/):
  1. Builds the runtime registry (rich entries) from canonical sources:
       - .agents/registry.yaml            agent base entries + archived list
       - .agents/agents/**/profile.md     frontmatter: status/accent/skills/capabilities
       - .agents/agents/<id>/skills.yaml  persona fallback for skills/capabilities
       - .agents/skills/*/SKILL.md        frontmatter: rich skill entries
  2. Copies role-agent profiles (agents/banedanmark/<id>/profile.md) through.
  3. Renders the runtime Brain pointer (Brain/AGENTS.md → canonical .agents/brain/;
     legacy Brain content was landed in canonical at PR E and removed at the
     post-PR F cleanup).

Modes:
  generate (default)  write build output (.agents/build/runtime/<adapter>/, gitignored)
  --check             diff generated output against the live runtime; exit 1 on drift
                      (post-activation this is the ongoing sync guard)
  --apply             write generated output directly into the adapter's live
                      target_path (activation/refresh; PR F gate is approved)

Run:
  uv run --with pyyaml python .agents/scripts/generate-runtime.py [--adapter codex]
  uv run --with pyyaml python .agents/scripts/generate-runtime.py --check

All I/O is strict UTF-8; output is refused if it contains U+FFFD (mojibake guard).
"""
import argparse
import datetime
import glob
import io
import os
import re
import sys

try:
    import yaml
except ModuleNotFoundError:
    sys.stderr.write(
        "Mangler afhaengigheder. Koer med:\n"
        "  uv run --with pyyaml python .agents/scripts/generate-runtime.py\n"
    )
    sys.exit(2)

ROLE_CONTAINER = "banedanmark"


def read_text(path):
    with io.open(path, encoding="utf-8") as f:
        return f.read()


def write_text(path, txt):
    if chr(0xFFFD) in txt:  # U+FFFD skrives som chr() saa scriptet ikke selv trigger mojibake-tjek
        sys.exit(f"MOJIBAKE-VAGT: U+FFFD i output for {path} — skriver ikke.")
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with io.open(path, "w", encoding="utf-8", newline="\n") as f:
        f.write(txt)


def frontmatter(path):
    m = re.match(r"^﻿?---\s*\n(.*?)\n---", read_text(path), re.S)
    return yaml.safe_load(m.group(1)) if m else None


def load_yaml(path):
    return yaml.safe_load(read_text(path))


def slugify(name):
    s = name.lower()
    for a, b in [("æ", "ae"), ("ø", "oe"), ("å", "aa"), ("é", "e"), ("&", "og")]:
        s = s.replace(a, b)
    s = re.sub(r"[^a-z0-9]+", "-", s).strip("-")
    return s


# ---------------------------------------------------------------------------
# Canonical model
# ---------------------------------------------------------------------------

def load_canonical(root):
    """Read the canonical layer into one model dict."""
    reg = load_yaml(os.path.join(root, ".agents", "registry.yaml"))
    agents_dir = os.path.join(root, ".agents", "agents")

    profiles = {}  # id -> {fm, path, is_role}
    for p in sorted(glob.glob(os.path.join(agents_dir, "*", "profile.md"))):
        fm = frontmatter(p) or {}
        profiles[fm.get("id", os.path.basename(os.path.dirname(p)))] = {
            "fm": fm, "path": p, "is_role": False}
    for p in sorted(glob.glob(os.path.join(agents_dir, ROLE_CONTAINER, "*", "profile.md"))):
        fm = frontmatter(p) or {}
        profiles[fm.get("id", os.path.basename(os.path.dirname(p)))] = {
            "fm": fm, "path": p, "is_role": True}

    # Persona skills.yaml as fallback for skills/capabilities
    sidecars = {}
    for p in sorted(glob.glob(os.path.join(agents_dir, "*", "skills.yaml"))):
        aid = os.path.basename(os.path.dirname(p))
        sidecars[aid] = load_yaml(p) or {}

    skills = []
    for p in sorted(glob.glob(os.path.join(root, ".agents", "skills", "*", "SKILL.md"))):
        sid = os.path.basename(os.path.dirname(p))
        fm = frontmatter(p) or {}
        entry = {"id": sid, "name": fm.get("name", sid)}
        if fm.get("category"):
            entry["category"] = fm["category"]
        if fm.get("description"):
            entry["description"] = str(fm["description"]).strip()
        skills.append(entry)

    adapters = {}
    for p in sorted(glob.glob(os.path.join(root, ".agents", "model-adapters", "*.md"))):
        if os.path.basename(p).upper() == "README.MD":
            continue
        fm = frontmatter(p) or {}
        adapters[fm.get("id", os.path.basename(p)[:-3])] = fm

    return {"registry": reg, "profiles": profiles, "sidecars": sidecars,
            "skills": skills, "adapters": adapters}


def compose_agent_entries(model):
    """Rich runtime agent entries: canonical registry base + profile enrichment."""
    entries = []
    for base in model["registry"].get("agents", []):
        aid = base["id"]
        prof = model["profiles"].get(aid, {})
        fm = prof.get("fm", {})
        side = model["sidecars"].get(aid, {})

        entry = {"id": aid,
                 "name": base.get("name", fm.get("name")),
                 "role": base.get("role", fm.get("role")),
                 "category": base.get("category", fm.get("category"))}
        accent = fm.get("accent") or base.get("accent")
        if accent:
            entry["accent"] = accent
        entry["status"] = fm.get("status") or base.get("status") or "active"
        skills = fm.get("skills") or side.get("skills")
        if skills:
            entry["skills"] = list(skills)
        caps = fm.get("capabilities") or side.get("capabilities")
        if caps:
            entry["capabilities"] = list(caps)
        for flag in ("meta_agent", "roster_exempt", "agent_model"):
            if base.get(flag) is not None:
                entry[flag] = base[flag]
        entries.append(entry)
    return entries


def compose_categories(agent_entries):
    cats = {}
    for a in agent_entries:
        cat = a.get("category")
        if not cat:
            continue
        cats.setdefault(cat, []).append(a["id"])
    return [{"id": slugify(c), "name": c, "agents": ids}
            for c, ids in sorted(cats.items(), key=lambda kv: slugify(kv[0]))]


def compose_subagents(model):
    """Archived avatarless agents remain available as FB-derived subagents
    (matches the section the hand-maintained runtime registry already has)."""
    subs = []
    for a in model["registry"].get("archived_avatarless_agents", []):
        subs.append({"id": a["id"],
                     "source": "Funktionsbeskrivelser/FB",
                     "domain": a.get("category", "")})
    return subs


# ---------------------------------------------------------------------------
# Rendering
# ---------------------------------------------------------------------------

GENERATED_HEADER = """\
# ============================================================================
# GENERERET FIL - MAA IKKE HAANDREDIGERES
# ----------------------------------------------------------------------------
# Genereret af .agents/scripts/generate-runtime.py (PR D) fra canonical:
#   .agents/registry.yaml + .agents/agents/**/profile.md + .agents/skills/
# Adapter: {adapter}   Genereret: {ts}
# Aendringer hoerer hjemme i det canonical .agents/-lag - IKKE her.
# ============================================================================
"""


def render_registry(model, adapter_id):
    agent_entries = compose_agent_entries(model)
    doc = {
        "version": "1.0.0",
        "last_updated": datetime.date.today().isoformat(),
        "generated_by": ".agents/scripts/generate-runtime.py",
        "generated_from": ".agents/registry.yaml",
        "agents": agent_entries,
        "categories": compose_categories(agent_entries),
        "subagents": compose_subagents(model),
        "skills": model["skills"],
    }
    body = yaml.safe_dump(doc, allow_unicode=True, sort_keys=False, width=100)
    ts = datetime.datetime.now().strftime("%Y-%m-%d %H:%M")
    return GENERATED_HEADER.format(adapter=adapter_id, ts=ts) + "\n" + body


BRAIN_POINTER = """\
# Brain (GENERERET pointer)

> **GENERERET af `.agents/scripts/generate-runtime.py`** — håndredigeres aldrig.
> Adapter: {adapter}

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
"""


def render_brain_pointer(adapter_id):
    return BRAIN_POINTER.format(adapter=adapter_id)


def generate(root, model, adapter_id, out_root, apply=False):
    adapter = model["adapters"].get(adapter_id)
    if adapter is None:
        sys.exit(f"Ukendt adapter: {adapter_id}")
    if apply:
        # AKTIVERING (PR F): skriv direkte ind i adapterens live target_path.
        # Kraever eksplicit --apply; brug kun efter aktiveringsbeslutning
        # (docs/qa/RELEASE-runtime-activation-gate.md).
        tp = (adapter.get("target_paths") or [None])[0]
        if not tp:
            sys.exit(f"Adapter {adapter_id} har ingen target_paths — kan ikke --apply.")
        out = os.path.join(root, tp.strip("/").replace("/", os.sep))
    else:
        out = os.path.join(out_root, adapter_id)

    written = []
    reg_path = os.path.join(out, "agents", "registry.yaml")
    write_text(reg_path, render_registry(model, adapter_id))
    written.append(reg_path)

    for aid, prof in sorted(model["profiles"].items()):
        if not prof["is_role"]:
            continue  # personas koerer fra registry + Avatar-prompts i dag
        dst = os.path.join(out, "agents", ROLE_CONTAINER, aid, "profile.md")
        write_text(dst, read_text(prof["path"]))
        written.append(dst)

    brain_dst = os.path.join(out, "Brain", "AGENTS.md")
    write_text(brain_dst, render_brain_pointer(adapter_id))
    written.append(brain_dst)
    return out, written


# ---------------------------------------------------------------------------
# Sync-validation (--check)
# ---------------------------------------------------------------------------

def norm(txt):
    return "\n".join(line.rstrip() for line in txt.strip().splitlines())


def check_registry(model, root, adapter):
    """Semantic diff: generated registry model vs live runtime registry."""
    findings = []
    live_path = None
    for tp in adapter.get("target_paths", []):
        cand = os.path.join(root, tp.strip("/").replace("/", os.sep), "agents", "registry.yaml")
        if os.path.exists(cand):
            live_path = cand
            break
    if live_path is None:
        return ["registry: ingen live runtime-registry fundet under target_paths"]

    live = load_yaml(live_path) or {}
    gen_agents = {a["id"]: a for a in compose_agent_entries(model)}
    live_agents = {a["id"]: a for a in live.get("agents", [])}

    only_gen = sorted(set(gen_agents) - set(live_agents))
    only_live = sorted(set(live_agents) - set(gen_agents))
    if only_gen:
        findings.append(f"registry: {len(only_gen)} agenter kun i canonical/genereret: {', '.join(only_gen)}")
    if only_live:
        findings.append(f"registry: {len(only_live)} agenter kun i live runtime: {', '.join(only_live)}")

    field_drift = 0
    for aid in sorted(set(gen_agents) & set(live_agents)):
        g, l = gen_agents[aid], live_agents[aid]
        diff_fields = [k for k in ("name", "role", "category", "accent", "status", "skills", "capabilities")
                       if (g.get(k) or None) != (l.get(k) or None)]
        if diff_fields:
            field_drift += 1
            findings.append(f"registry: '{aid}' afviger i felter: {', '.join(diff_fields)}")

    gen_skills = {s["id"] for s in model["skills"]}
    live_skills = {s.get("id") for s in live.get("skills", []) if isinstance(s, dict)}
    if gen_skills != live_skills:
        findings.append(
            f"registry: skills afviger — {len(gen_skills - live_skills)} kun canonical, "
            f"{len(live_skills - gen_skills)} kun live")
    return findings


def check_skill_refs(model):
    """Canonical-integritet: alle skills et agent-entry emitterer skal findes i
    .agents/skills/. Ikke-eksisterende intentioner hoerer i planned_skills:."""
    findings = []
    known = {s["id"] for s in model["skills"]}
    for a in compose_agent_entries(model):
        dangling = [s for s in (a.get("skills") or []) if s not in known]
        if dangling:
            findings.append(f"skill-refs: '{a['id']}' refererer ukendte skills: {', '.join(dangling)}")
    return findings


def check_avatar_prompts(model, root):
    """Dedup-vagt (system-prompt-placering afgjort 2026-07-12): profile.md's
    ```text-blok er CANONICAL prompt; Avatar/agents-filen er afledt visnings-/
    roster-lag og SKAL vaere identisk (normaliseret whitespace)."""
    findings = []
    fence = chr(96) * 3

    def block(path):
        txt = read_text(path)
        m = re.search(re.escape(fence) + r"text\n(.*?)\n" + re.escape(fence), txt, re.S)
        return re.sub(r"\s+", " ", m.group(1)).strip() if m else None

    for aid, prof in sorted(model["profiles"].items()):
        if prof["is_role"]:
            continue
        av = os.path.join(root, "Avatar", "agents", f"System_Prompt_Agent_{aid}.md")
        if not os.path.exists(av):
            continue  # meta-agenter (council-chairman) har ingen avatar-fil
        b1, b2 = block(prof["path"]), block(av)
        if b1 is None:
            findings.append(f"avatar-sync: '{aid}' mangler ```text-promptblok i canonical profile.md")
        elif b2 is None:
            findings.append(f"avatar-sync: '{aid}' mangler ```text-promptblok i Avatar-filen")
        elif b1 != b2:
            findings.append(f"avatar-sync: '{aid}' prompt divergerer mellem profile.md (canonical) og Avatar-filen")
    return findings


def check_brain_pointer(root, adapter, adapter_id):
    for tp in adapter.get("target_paths", []):
        live = os.path.join(root, tp.strip("/").replace("/", os.sep), "Brain", "AGENTS.md")
        if not os.path.exists(live):
            return [f"brain: pointer {tp}Brain/AGENTS.md mangler i live runtime"]
        if norm(read_text(live)) != norm(render_brain_pointer(adapter_id)):
            return ["brain: live Brain/AGENTS.md afviger fra genereret pointer"]
        return []
    return []


def check_role_profiles(model, root, adapter):
    findings = []
    base = None
    for tp in adapter.get("target_paths", []):
        cand = os.path.join(root, tp.strip("/").replace("/", os.sep), "agents", ROLE_CONTAINER)
        if os.path.isdir(cand):
            base = cand
            break
    if base is None:
        return [f"profiler: ingen live {ROLE_CONTAINER}/ under target_paths"]

    for aid, prof in sorted(model["profiles"].items()):
        if not prof["is_role"]:
            continue
        candidates = [os.path.join(base, aid, "profile.md"), os.path.join(base, aid + ".md")]
        live = next((c for c in candidates if os.path.exists(c)), None)
        if live is None:
            findings.append(f"profil: '{aid}' mangler i live runtime")
        elif norm(read_text(live)) != norm(read_text(prof["path"])):
            findings.append(f"profil: '{aid}' afviger fra canonical ({os.path.relpath(live, root)})")
    return findings


def main():
    ap = argparse.ArgumentParser(description="Generate runtime output from canonical .agents/ (PR D)")
    ap.add_argument("--root", default=os.getcwd())
    ap.add_argument("--adapter", default=None,
                    help="Adapter-id (default: alle adaptere med status 'active')")
    ap.add_argument("--out", default=None,
                    help="Build-output-rod (default: .agents/build/runtime/)")
    ap.add_argument("--check", action="store_true",
                    help="Sync-validering: diff genereret output mod live runtime; exit 1 ved drift")
    ap.add_argument("--apply", action="store_true",
                    help="AKTIVERING: skriv genereret output direkte ind i adapterens live "
                         "target_path (PR F; kraever eksplicit aktiveringsbeslutning)")
    args = ap.parse_args()

    root = args.root
    out_root = args.out or os.path.join(root, ".agents", "build", "runtime")
    model = load_canonical(root)

    if args.adapter:
        adapter_ids = [args.adapter]
    else:
        adapter_ids = [aid for aid, fm in model["adapters"].items() if fm.get("status") == "active"]
    if not adapter_ids:
        sys.exit("Ingen aktive adaptere fundet.")

    print("=== GENERER RUNTIME FRA CANONICAL (PR D) ===")
    print(f"Rod: {root}")
    exit_code = 0
    for aid in adapter_ids:
        out, written = generate(root, model, aid, out_root, apply=args.apply)
        mode = "AKTIVERET (live)" if args.apply else "artefakter"
        print(f"\n[{aid}] {len(written)} {mode} -> {os.path.relpath(out, root)}")
        if args.check:
            adapter = model["adapters"][aid]
            findings = (check_skill_refs(model) + check_registry(model, root, adapter)
                        + check_role_profiles(model, root, adapter)
                        + check_brain_pointer(root, adapter, aid)
                        + check_avatar_prompts(model, root))
            if findings:
                exit_code = 1
                print(f"[{aid}] SYNC-DRIFT ({len(findings)} fund) — forventet indtil PR F-aktivering:")
                for f in findings:
                    print(f"    - {f}")
            else:
                print(f"[{aid}] SYNC OK: live runtime matcher canonical/genereret output")

    if args.check:
        print(f"\n=== RESUME: {'DRIFT (exit 1)' if exit_code else 'SYNC OK (exit 0)'} ===")
        if exit_code:
            print("DRIFT: live runtime matcher IKKE canonical. Efter PR F-aktivering (2026-07-11)")
            print("skal --check altid give exit 0. Drift betyder enten at genereret runtime er")
            print("blevet haandredigeret (forbudt), eller at canonical er aendret uden efterfoelgende")
            print("'--apply'. Ret ved: redigér kun .agents/ -> koer --apply -> verificér --check exit 0.")
        else:
            print("Runtime er i sync med canonical (PR F aktiveret 2026-07-11, gate GODKENDT).")
            print("Dette er den loebende drift-vagt: redigér kun .agents/, koer --apply, og")
            print("bekraeft at --check fortsat giver exit 0. Genererede runtime-filer haandredigeres aldrig.")
    return exit_code


if __name__ == "__main__":
    sys.exit(main())
