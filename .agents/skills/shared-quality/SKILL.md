---
name: shared-quality
description: Fælles projektskill for QA, preflight, leverancekontrol og strukturel kvalitet i dette Codex-første setup. Bruges ved ændringer i skills, prompts, hooks, dokumenter og agent-konfiguration.
---

# Shared Quality

Denne skill samler de generelle kvalitetsregler for projektets AI-struktur.

## Brug denne skill når

- der ændres i skills, hooks, prompts eller agent-config
- der skal laves preflight før aflevering
- der er behov for hurtig strukturel QA på en leverance

## Kontroller

1. Er `.vscode/.codex/` fortsat eneste aktive lokale runtime-kerne?
2. Peger klientsettings på faktiske stier under `.vscode/`?
3. Har hver aktiv skill et gyldigt `SKILL.md`-entrypoint?
4. Er nye eller ændrede artefakter placeret i aktiv struktur frem for i `archive/`?
5. Er domænelogik i skills og ikke i hooks?

## Leveranceregel

- Kræv frisk verifikation før du hævder, at arbejdet er færdigt
- Dokumentér afvigelser og antagelser eksplicit
