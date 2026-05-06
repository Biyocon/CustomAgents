Use the selected agent's system prompt in chat replies
What & Why
When a user picks a team agent (Yunus, Sibgha, …) in the composer, the chip appears and the lightweight agent metadata is included in the submit payload, but the chat backend currently ignores it and replies with a generic OmniAI voice. To deliver on the agent personas, the backend should use the selected agent's full system prompt (already authored on each agent record) when generating the reply.

Done looks like
Selecting Sibgha and asking "Hvordan strukturerer jeg en KPI-rapport?" produces a reply in Sibgha's Danish finance-analyst voice.
Selecting Yunus and asking the same question produces an answer in Yunus's procurement-consultant voice.
Switching the agent mid-conversation immediately changes the assistant's tone on the next turn.
Changing back to Chat (no agent) keeps the existing generic behavior.
Relevant files
artifacts/omni-ai/src/components/AgentsView.tsx (each agent's prompt field)
artifacts/omni-ai/src/components/AdvancedPromptComposer.tsx (where agent lands in the payload)
artifacts/omni-ai/src/components/HomeView.tsx, ChatView.tsx (call sites that hit chatCompletion)
artifacts/api-server/src/routes/chat.ts (chat endpoint)
lib/integrations-openai-ai-server/src/chat.ts (system prompt assembly)
lib/api-spec/openapi.yaml (ChatRequest schema — may need an optional agentId or system override field)
Dependencies

Add Sibgha as a Team agent
Open task