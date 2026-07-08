# mcp/

> Model Context Protocol — ressourcer, prompts, tools og servers.
> Definerer, hvordan agenten eksponerer og bruger MCP-kompatible komponenter.

---

## Formål

Denne mappe indeholder **MCP-relaterede definitioner**, der gør det muligt for agenten at interagere med MCP-servers og eksponere ressourcer, prompts og tools på en standardiseret måde.

MCP skelner mellem:
- **Prompts:** Genbrugelige prompt-skabeloner
- **Resources:** Data og kontekst, der kan hentes
- **Tools:** Funktioner, agenten kan kalde
- **Servers:** Eksterne MCP-servere, agenten kan forbinde til

---

## Hvilke filer mappen indeholder

| Fil | Indhold |
|-----|---------|
| `servers.md` | Liste over tilgængelige MCP-servere og deres konfiguration |
| `resources.md` | Definerede ressourcer, der kan hentes via MCP |
| `prompts.md` | MCP-prompts, der kan eksekveres |
| `tools.md` | MCP-tools, der kan kaldes |

---

## Hvordan agenten skal bruge mappen

1. Tjek `servers.md` for tilgængelige MCP-servere.
2. Brug `tools.md` til at forstå, hvilke tools der kan kaldes.
3. Brug `resources.md` til at hente relevant kontekst.
4. Brug `prompts.md` til genbrugelige prompt-mønstre.
5. Dokumentér alle MCP-kald og deres resultater.

---

## Hvad der ikke må gemmes her

- Server-adgangsoplysninger (passwords, tokens)
- Projekt-specifikke data
- Personfølsomme oplysninger
- Kontraktkritiske data

---

## Eksempel på brug

> Agent skal hente data fra en ekstern kilde:
> 1. Tjekker `mcp/servers.md` for relevant server
> 2. Tjekker `mcp/tools.md` for tilgængelige tools
> 3. Kalder tool med korrekte parametre
> 4. Dokumentérer resultatet
