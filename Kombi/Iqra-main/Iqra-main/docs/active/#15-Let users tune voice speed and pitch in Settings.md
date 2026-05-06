Let users tune voice speed and pitch in Settings
What & Why
The underlying speak() helper already accepts rate and pitch options, but the new Speech & Voice settings panel only exposes language and voice. Power users — especially for accessibility (slower speech) or quick scanning (faster speech) — should be able to adjust these too, with a live preview.

Done looks like
Speech & Voice settings include rate and pitch sliders (sensible ranges, e.g. 0.5×–2× rate, 0–2 pitch)
Values persist in the same localStorage store and are passed through composers/getVoiceReply into speak()
The "Play sample" preview reflects the chosen rate and pitch
Relevant files
artifacts/omni-ai/src/lib/speechSettings.ts (extend SpeechSettings)
artifacts/omni-ai/src/components/SettingsView.tsx (SpeechPanel)
artifacts/omni-ai/src/hooks/useSpeechCapture.ts (speak() already supports rate/pitch)
artifacts/omni-ai/src/components/AdvancedPromptComposer.tsx and UniversalComposer.tsx
Dependencies

Let users pick their preferred speech language and voice
Open task