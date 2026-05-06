#11 - Show the voice conversation in the chat after Stemmetilstand ends
What & Why
Voice mode now produces real assistant replies, but the back-and-forth only lives in an in-memory ref inside the composer. When the user closes the overlay there is no record of what was said. They should be able to see the spoken conversation in the chat thread (and in ChatView, append it to the active conversation).

Done looks like
After each voice turn, the user's transcript and the assistant reply appear as messages in the visible chat.
In HomeView, ending Stemmetilstand opens (or scrolls to) a chat that contains the spoken conversation, matching the same flow as a typed prompt.
Closing and reopening Stemmetilstand within the same session continues to build on the same thread.
Relevant files
artifacts/omni-ai/src/components/HomeView.tsx (voiceHistoryRef wiring)
artifacts/omni-ai/src/components/ChatView.tsx (voiceHistoryRef wiring + active conversation state)
artifacts/omni-ai/src/components/AdvancedPromptComposer.tsx (voice overlay + getVoiceReply callback site)
Dependencies

Hook the assistant's voice replies up to a real chat backend
Open task