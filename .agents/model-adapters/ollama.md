---
id: ollama
status: planned
entrypoint: Modelfile
target_paths:
  - ollama/
supported_artifact_types:
  - agents
  - prompts
prompt_rendering: "Agentens system prompt (text-blok i profile.md) bages ind i en Ollama Modelfile SYSTEM-blok. Én Modelfile pr. agent giver en genanvendelig, lokal model-persona."
skill_loading: "Ollama har intet native skill-system og ingen agentisk tool-loop. Skills kan kun inlines i SYSTEM-blokken som statisk tekst, eller drives af et eksternt orkestreringslag. Begrænset."
registry_rendering: "Ingen native registry. En generator (PR D/F) producerer én Modelfile pr. agent + evt. et index."
memory_behavior: "Ingen persistent Brain/memory native. Kontekst er begrænset til Modelfile SYSTEM + samtalens vindue. Ekstern memory-mekanisme kræves for canonical Brain."
constraints:
  - "Ikke implementeret (planned)."
  - "Adskiller sig fundamentalt fra CLI-agenterne: Ollama er en model-runner, ikke en agentisk kodningsklient — ingen native tools, skills eller memory."
  - "Egnet til lokale, offline model-personaer; ikke til fuld agentisk drift."
notes: "SYSTEM-bloktilgangen betyder at prompt bages statisk ind ved 'ollama create'; ændringer i canonical kræver regenerering. ADR-multi-runtime kræver eksplicit denne adapter (Ollama manglede tidligere)."
---

# Ollama Adapter (`id: ollama`, status: **planned**)

## Hvad det er
**Ollama** — lokal model-runner (Modelfiles). ADR-multi-runtime kræver eksplicit en Ollama-adapter (den
manglede). Ollama adskiller sig fundamentalt fra de agentiske CLI-runtimes: den kører en model med en
bagt-ind SYSTEM-prompt, men har **intet native skill-system, tool-loop eller persistent memory**.

## Sådan mapper canonical → ollama
- **Entrypoint:** en `Modelfile` pr. agent med agentens system prompt i `SYSTEM`-blokken.
- **Prompts:** `profile.md` text-blok → `SYSTEM """..."""` i Modelfile (bages ind ved `ollama create`).
- **Skills:** kan kun inlines som statisk tekst i SYSTEM-blokken, eller drives af et eksternt lag. Native
  skill-loading findes ikke.
- **Registry/memory:** ingen native ækvivalent; kræver eksternt orkestreringslag.

## Settings-template (eksempel Modelfile)
```dockerfile
FROM llama3.1
PARAMETER temperature 0.3
SYSTEM """
<agentens system prompt fra profile.md indsættes her>
"""
```

## Konsekvens for canonicalisering
Ollama er den **mest begrænsede** runtime-target: fuld agentisk paritet (skills, tools, memory) er ikke
mulig uden et eksternt orkestreringslag. Adapteren dokumenterer dette bevidst frem for at love paritet.

## Links
- Canonical: `../../.agents/registry.yaml`, `../../.agents/agents/`
- Runtime-mål: `ollama/` (genereres senere; findes ikke endnu)
