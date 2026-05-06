# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.

## API server transcription endpoint (artifacts/api-server/src/routes/transcribe.ts)

`POST /api/transcribe` — multipart/form-data with `audio` (required Blob/File) and optional `language` (BCP-47). Proxies to OpenAI's `gpt-4o-mini-transcribe` via the `@workspace/integrations-openai-ai-server/audio` module. ffmpeg is installed at the system level and is used by `ensureCompatibleFormat` to auto-convert recordings to a Whisper-compatible container. Max upload is 25 MB. Response: `{ text: string, durationMs: number }`. Schema is defined in `lib/api-spec/openapi.yaml` (operation `transcribeAudio`, body schema `TranscribeAudioForm`); orval generates `useTranscribeAudio` (React Query mutation) in `@workspace/api-client-react` and the `TranscribeAudioResponse` Zod validator in `@workspace/api-zod`.

## API server chat completion endpoint (artifacts/api-server/src/routes/chat.ts)

`POST /api/chat/completions` — JSON body `{ messages: ChatMessage[], language?: string, agentId?: string }` where each `ChatMessage` is `{ role: 'user'|'assistant'|'system', content: string }`. The last message must have `role: 'user'`. Proxies to OpenAI's `gpt-5-mini` chat-completions via `chatCompletion()` in `@workspace/integrations-openai-ai-server` (in `src/chat.ts`). Injects a system prompt tuned for spoken output (concise, no markdown, no URLs/emoji), a per-language directive (Danish/Norwegian/Swedish/German/French/Spanish/English fallback), and, when `agentId` is present, the matching server-side system prompt from `@workspace/agents`. Unknown `agentId` values return 400. Caller-supplied `system` messages are preserved and appended to ours. Server trims to the most recent 20 history turns to bound spoken sessions. Same per-IP rate limit (30/min) and global concurrency cap (8) as `/transcribe`. Response: `{ reply: string, durationMs: number }`. Schema in `lib/api-spec/openapi.yaml` (operation `chatCompletion`, request `ChatRequest`, reply `ChatReply`, error `ChatError`); orval generates `useChatCompletion` / `chatCompletion` in `@workspace/api-client-react` and `ChatCompletionBody` / `ChatCompletionResponse` Zod validators in `@workspace/api-zod`. Used by `HomeView` and `ChatView` to power typed chat and the composer's voice mode (Stemmetilstand). The visible chat thread is a single `chatMessages: ChatMessage[]` state lifted to `App` and shared between views; each view appends the user turn immediately, then awaits `chatCompletion()` (server history capped at 20) and appends the assistant reply, so typed and spoken turns persist as visible bubbles. On Home, `AdvancedPromptComposer`'s new `onVoiceEnd` prop fires when Stemmetilstand toggles off; if any turns were produced this session the view auto-switches to Chat. `ChatView` renders the thread when non-empty (`[data-testid="chat-thread"]` with `[data-testid="chat-message-N"]` bubbles, `[data-role="user"|"assistant"]`) and falls back to the hero/recent layout otherwise. Reopening Stemmetilstand from either view continues the same shared thread and uses the currently selected agent when one is active.


## IQRA app (artifacts/omni-ai)

React + Vite UI for the IQRA AI platform. Design system: Inter font, deep teal #004E51 primary, mint cyan #43FFC8 accent, #fafafa background, 256px sidebar.

### AdvancedPromptComposer (artifacts/omni-ai/src/components/AdvancedPromptComposer.tsx) — DONE

Central composer used by HomeView and ChatView. Implements the FINAL OVERRIDE PATCH spec:

- Quick prompt pills (Create slide deck / Design system / Document to skill / Analyze data) always set `outputTarget`, set `selectedQuickPrompt = {id,label}`, auto-set `conversationType` only when `lastConversationTypeSetBy !== 'user'`, insert hint text, optionally open a picker.
- Source-tracked overrides via `lastConversationTypeSetBy` ∈ `{user, team-mode, deep-research, slash-command, quick-prompt}`. User wins over all system sources.
- Send gating: disabled when uploading or empty; enabled when prompt OR complete attachment OR template OR valid (non-disconnected, non-requires-auth) context item exists.
- Normalized submit payload (`NormalizedSubmitPayload`): prompt, mode, conversationType, outputTarget, attachments (only `complete`), contextItems (only valid), skills (only enabled), toolsPolicy, voice/team/deepResearch flags, theme `{id,name,palette}`, optional raceMode, optional selectedTemplate `{id,title,category}`, optional quickPrompt `{id,label}`, createdAt ISO.
- `selectedQuickPrompt` persists across submits within an instance; cleared only on full reset.
- Single popover invariant via `activePopover` state; Escape and outside click close it; textarea is refocused after popover closes; Cmd/Ctrl+K opens slash palette globally; IME guard on Enter.
- Right cluster has two voice controls (mutually exclusive): `button-voice-mode` (mic, "Brug Stemmetilstand") opens a Wispr-Flow-style overlay (`overlay-voice-mode`) above the composer with animated waveform and "Afslut" (`button-end-voice-mode`); `button-dictate` (waveform, "Dikter") activates inline dictation indicator (`indicator-dictating`). Both buttons have Radix tooltips (`TooltipProvider`) and `aria-label` / `aria-pressed`. Submit payload `voiceEnabled` is true if either mode is active.

