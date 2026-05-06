Single source of truth for team agents
What & Why
Yunus and Sibgha (and the other team agents) are currently defined in two files: the full record lives in AgentsView's AGENTS array, and a parallel lightweight copy lives in AdvancedPromptComposer's COMPOSER_AGENTS array. Every new team agent must be added to both lists, and metadata (role, organization, accent color, avatar) can silently drift apart. The composer should derive its picker entries from the same source AgentsView uses.

Done looks like
There is one canonical agents list in a shared module (e.g. artifacts/omni-ai/src/data/agents.ts or a new lib/agents package).
AgentsView and AdvancedPromptComposer both import from it.
Adding a new team agent requires editing only one file.
The composer picker still shows the same Team and Official groups.
Relevant files
artifacts/omni-ai/src/components/AgentsView.tsx (lines ~20–280, current owner of Agent interface and AGENTS)
artifacts/omni-ai/src/components/AdvancedPromptComposer.tsx (lines ~46–110, ComposerAgent and COMPOSER_AGENTS)
Dependencies

Add Sibgha as a Team agent
Open task