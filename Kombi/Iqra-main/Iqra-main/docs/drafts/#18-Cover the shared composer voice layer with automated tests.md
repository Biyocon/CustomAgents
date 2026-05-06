Cover the shared composer voice layer with automated tests
What & Why
The shared voice/dictate layer (hook + buttons + overlay + indicator) is now consumed by both composers. Today it has no dedicated unit/component tests, so future regressions (mutual exclusion, persisted backend, error dismiss, TTS pipeline) could slip through. Adding focused tests around the hook and the small components would lock in behavior across both consumers.

Done looks like
Unit tests for useComposerVoice cover: mutual exclusion (voice vs dictate), error states, clearDictateError, persisted transcription backend round-trip via localStorage, and the onVoiceFinal / onDictateFinal callbacks.
Component tests for VoiceModeButton, DictateButton, TranscriptionBackendToggle, VoiceModeOverlay, and DictateIndicator verify aria-labels, data-testids, tooltip content, and the locked/disabled states.
Tests run as part of the standard typecheck/test pipeline.
Relevant files
artifacts/omni-ai/src/components/composer/voice/useComposerVoice.ts
artifacts/omni-ai/src/components/composer/voice/VoiceControls.tsx
artifacts/omni-ai/src/components/composer/voice/VoiceModeOverlay.tsx
artifacts/omni-ai/src/components/composer/voice/DictateIndicator.tsx