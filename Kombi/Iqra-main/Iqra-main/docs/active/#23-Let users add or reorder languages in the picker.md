Let users add or reorder languages in the picker
What & Why
The picker currently exposes a fixed list of six languages (Dansk, English, Deutsch, Svenska, Norsk, Español). Power users who dictate in less common languages — French, Italian, Polish, Arabic, Hindi, Portuguese, etc. — still can't pick them, and there's no way to surface their preferred language at the top.

Done looks like
A small "Manage languages" entry in the picker (or a Settings page section) lets users add / remove / reorder languages.
Custom language lists persist (e.g. localStorage omni-ai.transcriptionLanguages).
The picker still defaults to a sensible starter set when nothing is customised.
Relevant files
artifacts/omni-ai/src/components/composer/voice/VoiceControls.tsx (DEFAULT_TRANSCRIPTION_LANGUAGES, TranscriptionLanguagePicker)
artifacts/omni-ai/src/components/composer/voice/useComposerVoice.ts (where to thread custom options)
A Settings page if one exists, otherwise a "Manage…" item at the bottom of the dropdown.
Dependencies

Let users pick the transcription language from a small menu
Open task