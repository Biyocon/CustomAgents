#8 - Show a 'transcribing…' indicator while the server is processing speech
What & Why
When the user uses server-side transcription (the new "SERVER" pill in the composer), there is currently no visible feedback between the moment they stop speaking and the moment the transcribed text appears. A short pending state (~300–800ms) feels broken even though it isn't. The composer should surface a small "transcriberer..." spinner / shimmer next to the mic indicator so users understand the system is still working.

Done looks like
While at least one server-transcription request is in flight, the dictate textarea and the voice-mode overlay show a clear "transcriberer..." (or equivalent) indicator.
The indicator clears automatically when the request resolves (success or error).
Browser-backend behavior is unchanged.
Relevant files
artifacts/omni-ai/src/hooks/useSpeechCapture.ts (useServerSpeechCapture — expose a pendingRequests: number or transcribing: boolean field on UseSpeechCaptureResult)
artifacts/omni-ai/src/components/AdvancedPromptComposer.tsx (voice overlay header + dictate interim row)
Dependencies

Use a real Whisper / cloud transcription backend instead of the browser's built-in
Open task