Tell users when the mic switched to server transcription automatically
What & Why
Safari and Firefox users now silently get the server transcription backend on first mount (because the browser has no Web Speech API). Without any visible cue, they may not realise their audio is being uploaded to the server or that their experience differs from Chrome users. A small one-time notice (or a subtle "Server" badge near the mic with a tooltip explaining why) would make this transparent and let them opt back to the browser backend if they prefer.

Done looks like
First-time Safari/Firefox users see a brief, dismissible explanation the first time they open the mic, e.g. "We're using server transcription because your browser doesn't support local speech recognition."
The notice is shown at most once per browser (e.g. via localStorage flag) and never appears for users who already have a saved preference.
The existing transcription backend toggle remains the source of truth for changing the backend.
Relevant files
artifacts/omni-ai/src/components/composer/voice/useComposerVoice.ts (auto-fallback initializer)
artifacts/omni-ai/src/components/composer/voice/TranscriptionBackendToggle.tsx (where to anchor the notice)
artifacts/omni-ai/src/hooks/useSpeechCapture.ts (isSpeechCaptureSupported)
Dependencies

Auto-fall back to server transcription on browsers that can't do it locally
Open task