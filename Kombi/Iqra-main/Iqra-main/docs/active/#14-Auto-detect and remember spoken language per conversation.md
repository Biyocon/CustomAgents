Auto-detect and remember spoken language per conversation
What & Why
The new Speech & Voice settings let users pick a single global language for voice input. But many users mix languages day to day (e.g. Danish for personal, English for work). The app should detect the language of the latest spoken/typed turn and either auto-switch the recogniser, or remember a per-conversation preference, so users do not have to keep visiting Settings.

Done looks like
Each chat conversation records its preferred speech language (defaulting to the global Settings value)
Either an automatic detector (e.g. lightweight n-gram or server-side detection) or a small per-conversation language picker chooses the right locale for the next voice turn
Switching conversation switches the recogniser language transparently
Relevant files
artifacts/omni-ai/src/lib/speechSettings.ts (global defaults)
artifacts/omni-ai/src/components/HomeView.tsx and ChatView.tsx (where speechLang is passed to composers)
artifacts/omni-ai/src/components/AdvancedPromptComposer.tsx and UniversalComposer.tsx (consume speechLang)
Dependencies

Let users pick their preferred speech language and voice
Open task