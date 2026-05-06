#2 - Make voice mode and dictation actually transcribe speech
What & Why
The new "Brug Stemmetilstand" and "Dikter" buttons in the OmniAI composer currently only show animated UI mocks. To deliver real value, both modes should actually capture the user's microphone input and either (a) transcribe speech into the textarea (Dikter) or (b) have a back-and-forth voice conversation with the assistant (Stemmetilstand).

Done looks like
Clicking "Dikter" requests microphone permission and streams the user's speech as text into the composer textarea in near real time, ending when the button is clicked again.
Clicking "Brug Stemmetilstand" enters a continuous voice conversation: user speech is transcribed and sent automatically, and the assistant's reply is read aloud through TTS while the overlay shows live amplitude.
Microphone errors (denied permission, no device) are surfaced gracefully in the UI instead of failing silently.
Works in modern Chromium-based browsers via the Web Speech API or a Whisper / OpenAI Realtime backend; gracefully degrades when unsupported.
Relevant files
artifacts/omni-ai/src/components/AdvancedPromptComposer.tsx (state for voiceMode / dictateMode and the overlay live near toggleVoiceMode / toggleDictateMode)
New hook suggestion: artifacts/omni-ai/src/hooks/useSpeechCapture.ts
Backend: artifacts/api-server for any server-side proxy to a transcription API (if not using browser-native Web Speech).
Dependencies

Voice mode + Dikter buttons