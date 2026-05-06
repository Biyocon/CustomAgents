#6 - Let users pick their preferred speech language and voice
What & Why
The composer hard-codes Danish ("da-DK") for both speech recognition and text-to-speech. International users can't use voice features in their own language. Adding a settings panel for language + TTS voice selection makes the feature usable globally.

Done looks like
A settings UI (probably in the existing Settings area) lets users choose:
Speech recognition language (en-US, da-DK, sv-SE, de-DE, etc.)
Preferred TTS voice (from speechSynthesis.getVoices())
The selected language flows through the composer's speechLang prop
Selection persists across reloads (localStorage or user profile)
Relevant files
artifacts/omni-ai/src/hooks/useSpeechCapture.ts (lang option)
artifacts/omni-ai/src/components/AdvancedPromptComposer.tsx (speechLang prop, default "da-DK")
artifacts/omni-ai/src/components/SettingsView.tsx or similar (new UI)
Dependencies

Make voice mode and dictation actually transcribe speech
Open task