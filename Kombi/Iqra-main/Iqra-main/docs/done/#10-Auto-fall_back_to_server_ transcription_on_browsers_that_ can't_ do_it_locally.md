#10 - Auto-fall back to server transcription on browsers that can't do it locally
What & Why
Today the composer defaults to the browser (Web Speech API) backend. On Safari and Firefox the Web Speech API is missing, so the mic shows an "unsupported" error until the user manually clicks the new SERVER pill. We should detect missing browser support on first mount and auto-switch to the server backend (still letting the user override).

Done looks like
When isSpeechCaptureSupported('browser') is false but isSpeechCaptureSupported('server') is true, the composer initialises transcriptionBackend to 'server' (unless the prop overrides it or the user has previously made an explicit choice in localStorage).
Chrome/Edge users still default to the browser backend.
Relevant files
artifacts/omni-ai/src/components/AdvancedPromptComposer.tsx (the transcriptionBackendState initializer)
artifacts/omni-ai/src/hooks/useSpeechCapture.ts (isSpeechCaptureSupported is already exported)
Dependencies

Use a real Whisper / cloud transcription backend instead of the browser's built-in
Open task