#9 - Let users pick the transcription language from a small menu
What & Why
Both transcription backends are currently hard-wired to the composer's speechLang prop (default da-DK). Users who want to dictate in English or another language have no way to switch. A tiny language picker next to the new BROWSER/SERVER pill would let them choose between, e.g., Danish, English, German, and Swedish, with the choice persisted in localStorage like the backend toggle.

Done looks like
A new picker exposes 4–6 common languages (label + BCP-47 code).
The chosen code is passed to useSpeechCapture as lang for both dictate and voice modes, AND sent in the language field on /api/transcribe.
The choice persists across reloads.
Relevant files
artifacts/omni-ai/src/components/AdvancedPromptComposer.tsx (next to the BROWSER/SERVER pill near line 2207)
artifacts/omni-ai/src/hooks/useSpeechCapture.ts
Dependencies

Use a real Whisper / cloud transcription backend instead of the browser's built-in
Open task