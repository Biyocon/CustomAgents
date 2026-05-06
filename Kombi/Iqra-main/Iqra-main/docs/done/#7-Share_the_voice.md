#7 - Share the voice and dictate controls between both chat composers
What & Why
Mirroring the new mic ("Brug Stemmetilstand") and waveform ("Dikter") controls into UniversalComposer duplicates a sizable chunk of state, hook wiring, and overlay markup from AdvancedPromptComposer. The two composers will drift over time (different copy, animations, error handling) unless this is extracted.

Pulling the speech/voice machinery into a shared hook + a small set of reusable subcomponents keeps both composers in sync, makes future changes (e.g. swapping in a real transcription backend, adding a language picker, restyling the overlay) a one-place edit, and removes ~250 lines of duplicated logic.

Done looks like
A shared hook (e.g. useComposerVoice) owns the voice/dictate state, mutual exclusion, error surfaces, and TTS reply pipeline.
Reusable <VoiceModeOverlay /> and <DictateIndicator /> (plus the two right-cluster buttons) live in their own module and are consumed by both composers.
AdvancedPromptComposer and UniversalComposer render the same controls and overlays via this shared layer; behaviour, tooltips, aria-labels, and data-testid values stay identical.
No visual or behavioural regressions in either composer.

Relevant files
artifacts/omni-ai/src/components/UniversalComposer.tsx
artifacts/omni-ai/src/components/AdvancedPromptComposer.tsx (reference + deduplicate)
artifacts/omni-ai/src/hooks/useSpeechCapture.ts (existing low-level hook to build on)
Dependencies

Mirror the new voice + dictate buttons in the simpler chat composer
Open task