Wire UniversalComposer into the chat view so users see the simpler composer there
What & Why
UniversalComposer is now refactored to share the voice/dictate layer with AdvancedPromptComposer, but it isn't yet rendered anywhere in the app. The chat view currently uses the heavyweight command-center composer (or no composer at all). We should mount UniversalComposer at the bottom of the chat view so ongoing conversations get a slimmer, lighter-weight composer with the same voice/dictate behavior.

Done looks like
UniversalComposer is rendered at the bottom of the chat view (and optionally in any other "in-conversation" surface).
Sending a message from UniversalComposer works the same as from AdvancedPromptComposer.
Voice and dictate buttons behave identically across both composers (covered automatically by the shared module).
Relevant files
artifacts/omni-ai/src/components/UniversalComposer.tsx
artifacts/omni-ai/src/components/ChatView.tsx (or wherever the active chat surface lives)
artifacts/omni-ai/src/components/composer/voice/ (shared voice layer)