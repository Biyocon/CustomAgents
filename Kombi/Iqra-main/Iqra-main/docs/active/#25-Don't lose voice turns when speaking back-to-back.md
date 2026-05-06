Don't lose voice turns when speaking back-to-back
What & Why
In Stemmetilstand, transcripts captured while the assistant is still reading its previous reply aloud are silently dropped (useComposerVoice.ts returns early when voiceSpeakingRef.current is true). This is intended to prevent the mic from hearing the assistant's own TTS, but it also drops legitimate user turns that arrive before TTS finishes — the second of two quick utterances disappears from the visible chat thread.

Done looks like
A user can speak two utterances back-to-back without losing either.
TTS feedback is still avoided (e.g. by cancelling current playback when a new final transcript lands and restarting the recogniser, or by queuing pending utterances and processing them after speak() resolves).
e2e test verifies two quick turns produce four chat bubbles, not two.
Relevant files
artifacts/omni-ai/src/components/composer/voice/useComposerVoice.ts (the if (voiceSpeakingRef.current) return drop in onVoiceFinal).
artifacts/omni-ai/src/hooks/useSpeechCapture.ts (speak()).
artifacts/omni-ai/src/components/HomeView.tsx and ChatView.tsx (getVoiceReply).
Dependencies

Show the voice conversation in the chat after Stemmetilstand ends
Open task