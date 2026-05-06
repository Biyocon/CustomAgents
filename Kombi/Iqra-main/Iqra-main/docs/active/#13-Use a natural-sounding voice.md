Use a natural-sounding voice for spoken replies instead of the browser default
What & Why
The voice overlay currently plays the assistant reply with the browser's built-in SpeechSynthesis voice, which sounds robotic and varies wildly by OS/browser. Now that the reply text is real assistant output, switching the playback to a high-quality TTS (e.g. OpenAI tts-1 / gpt-4o-mini-tts) would make Stemmetilstand sound like a real product.

Done looks like
A new server endpoint streams synthesized speech audio for a given reply + language, and the voice overlay plays that audio.
The Danish default and the existing language picker both use a good-quality voice.
Browser SpeechSynthesis is removed (or kept only as an offline fallback).
Relevant files
artifacts/omni-ai/src/components/AdvancedPromptComposer.tsx (current SpeechSynthesis usage)
artifacts/api-server/src/routes/ (new TTS route)
lib/integrations-openai-ai-server/src/ (new TTS helper, sibling of chat.ts/audio)
lib/api-spec/openapi.yaml
Dependencies

Hook the assistant's voice replies up to a real chat backend
Open task