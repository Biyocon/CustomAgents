# Iqra - Omni AI Workspace

Iqra er en avanceret, samlet AI-arbejdsplatform inspireret af koncepter som Microsoft 365 Copilot og Anthropic's Claude. Platformen integrerer intelligent chat, avanceret stemmestyring (Voice Mode), specialiserede team-agenter og interaktive arbejdsområder som Artifacts og Stitch Canvas i ét moderne interface.

## ✨ Nøglefunktioner

* 🎙️ **Voice Mode & Lydtransskription**: Real-time stemmeinteraktion med automatisk sprogdetektion, Whisper-baseret cloud-transskription og justerbare stemmeindstillinger (hastighed, tonehøjde).
* 🤖 **Team Agents**: Samarbejd med specifikke AI-agenter (som f.eks. Sibgha eller Yunus), der har dedikerede roller og systemprompts (Design DNA).
* 🎨 **Artifacts & Workspace**: Et dedikeret modul til at bygge, fremvise og redigere kode, designs og regneark direkte i applikationen.
* ✏️ **Advanced Prompt Composer**: En kraftfuld input-komponent med understøttelse af slash-kommandoer, @-mentions (til f.eks. GitHub, projekter, modeller) og stemmeinput.
* 🧩 **Stitch Canvas**: Et visuelt lærred (designsystem) til at sammensætte og overskue komplekse projekter og workflows.

## 🏗️ Projektstruktur

Dette projekt er sat op som et monorepo (håndteret via `pnpm`) med følgende primære struktur:

### Artifacts (Applikationer)
* **`artifacts/omni-ai/`**: Frontend-applikationen. Bygget med React, Vite, Tailwind CSS og shadcn/ui. Indeholder alle UI-komponenter, views (Chat, Artifacts, Agents, Settings) og voice-logik.
* **`artifacts/api-server/`**: Backend-serveren. Håndterer integrationer med OpenAI, lydtransskription (`/transcribe`), chat-routing (`/chat`) og generel backend-forretningslogik.
* **`artifacts/mockup-sandbox/`**: Et isoleret miljø til hurtig test og udvikling af nye UI-komponenter (shadcn/ui) uden at påvirke hovedapplikationen.

### Libs (Delte pakker)
* **`lib/api-zod/`**: Delte Zod-skemaer for API-requests og responses (sikrer typesikkerhed mellem frontend og backend).
* **`lib/api-spec/`**: OpenAPI-specifikationer for serveren.
* **`lib/api-client-react/`**: Autogenererede React API-klienter (fx med Orval) til at tale med `api-server`.
* **`lib/db/`**: Databaseskemaer og konfiguration sat op med Drizzle ORM.
* **`lib/integrations-openai-ai-server/`**: Abstraktionslag og værktøjer til direkte kommunikation med OpenAI's API'er (Chat, Audio, Whisper).

## 🚀 Teknologistak

* **Frontend**: React, Vite, TypeScript, Tailwind CSS, shadcn/ui.
* **Backend**: Node.js, TypeScript, Express/Hono (API Server), OpenAI API.
* **Database**: Drizzle ORM.
* **Pakkehåndtering**: pnpm workspaces.
* **Validering & Types**: Zod.

## 🛠️ Kom Godt I Gang

### Forudsætninger
Sørg for, at du har følgende installeret på din maskine:
* [Node.js](https://nodejs.org/) (anbefalet version >= 18)
* [pnpm](https://pnpm.io/) (Pakkehåndtering)

### Installation

1. Klon repository'et og naviger ind i projektmappen:
   ```bash
   git clone <repository-url>
   cd Iqra-main