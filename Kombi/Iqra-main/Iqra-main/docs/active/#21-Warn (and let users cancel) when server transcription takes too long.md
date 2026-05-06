Warn (and let users cancel) when server transcription takes too long
What & Why
We now show a "Transkriberer…" indicator while a server-transcription request is in flight, but if the request stalls (slow network, hung backend) the user is stuck staring at a spinner with no way out and no idea how long is reasonable. After ~5 seconds we should escalate the indicator (e.g. "Tager længere end forventet…") and give the user a one-click way to abort the in-flight upload and keep dictating.

Done looks like
After a configurable delay (~5s) the spinner copy escalates to a "still waiting" message in both the dictate pill and the voice-mode overlay.
The user can cancel the in-flight transcription request, which aborts the fetch, decrements the pending counter, and lets them keep speaking without losing the session.
Cancelling does not surface a generic network error.
Relevant files
artifacts/omni-ai/src/hooks/useSpeechCapture.ts (useServerSpeechCapture — track an AbortController per request, expose cancelPendingTranscriptions, plus a pendingSinceMs timestamp).
artifacts/omni-ai/src/components/composer/voice/DictateIndicator.tsx and VoiceModeOverlay.tsx (escalated copy + cancel button).
Dependencies

Show a 'transcribing…' indicator while the server is processing speech
Open task