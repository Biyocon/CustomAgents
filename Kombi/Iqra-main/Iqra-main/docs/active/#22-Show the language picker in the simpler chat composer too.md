Show the language picker in the simpler chat composer too
What & Why
The new transcription language picker is rendered only in AdvancedPromptComposer. The simpler UniversalComposer shares the same voice + dictate machinery (it uses useComposerVoice and stores the language in the same localStorage key), but it doesn't expose the picker UI. Once a user turns on dictation from the simpler composer they have no way to switch language without going back to the advanced composer.

Done looks like
The simpler composer renders the same picker next to its mic / dictate buttons.
Picking a language there also persists and is reflected in the advanced composer (already wired through the shared hook + localStorage).
Relevant files
artifacts/omni-ai/src/components/UniversalComposer.tsx (right cluster around the mic + dictate buttons)
artifacts/omni-ai/src/components/composer/voice/useComposerVoice.ts (already exposes transcriptionLanguage / setTranscriptionLanguage)
artifacts/omni-ai/src/components/composer/voice/VoiceControls.tsx (TranscriptionLanguagePicker is already exported from the voice barrel)
Dependencies

Let users pick the transcription language from a small menu
Open task