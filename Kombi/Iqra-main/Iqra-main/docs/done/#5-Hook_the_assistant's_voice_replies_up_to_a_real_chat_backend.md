#5 - Hook the assistant's voice replies up to a real chat backend
What & Why
Voice mode (Stemmetilstand) currently echoes the user's transcript back as the spoken reply because the composer has no chat backend wired in. Now that transcription works, the next step is to plug the new getVoiceReply prop into a real chat completion endpoint so the assistant gives meaningful spoken responses instead of repeating the user.

Done looks like
A chat completion endpoint exists (or an existing one is reused) on the API server
The composer's getVoiceReply prop is wired in HomeView / ChatView to call that endpoint
Spoken replies in Stemmetilstand are real assistant answers, not echoes
Conversation history is preserved across voice turns
Relevant files
artifacts/omni-ai/src/components/AdvancedPromptComposer.tsx (already accepts getVoiceReply)
artifacts/omni-ai/src/components/HomeView.tsx and ChatView.tsx (callers — currently no getVoiceReply)
artifacts/api-server/src/routes/ (add chat completion route)
Dependencies

Make voice mode and dictation actually transcribe speech
Open task