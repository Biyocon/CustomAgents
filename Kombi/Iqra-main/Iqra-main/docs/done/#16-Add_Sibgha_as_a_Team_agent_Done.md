#4 - Use a real Whisper / cloud transcription backend instead of the browser's built-in
What & Why
Voice and dictation now work via the browser's Web Speech API. That works in modern Chromium browsers but quality is mediocre, Safari/Firefox support is limited, and accuracy for Danish technical terms is poor. Routing audio to a real Whisper / OpenAI Realtime endpoint through the API server would dramatically improve transcription accuracy and unlock cross-browser support.

Done looks like
A new endpoint on the API server proxies audio to a Whisper-style transcription service
The composer has a configuration option to switch between "browser" and "server" transcription
Server-side transcription works in Safari and Firefox, not just Chromium
Latency stays under ~1.5s per utterance
Relevant files
artifacts/omni-ai/src/hooks/useSpeechCapture.ts (current Web Speech API implementation)
artifacts/omni-ai/src/components/AdvancedPromptComposer.tsx (consumer)
artifacts/api-server/src/routes/ (add new transcription route)
lib/api-spec/ (define the contract)
Dependencies

Make voice mode and dictation actually transcribe speech
Open task