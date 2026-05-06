Let users start a new chat without losing the spoken thread
What & Why
The shared chatMessages state in App.tsx is a single in-memory thread that lives for the session. There's no UI to clear it, start a new chat, or browse past chats — so once the spoken conversation is in the panel, the only way out is to refresh the page. Hooking the "New Chat" sidebar button (and the existing chat list) into this state would close the loop.

Done looks like
The sidebar "New Chat" button clears the visible thread and returns the user to an empty chat composer.
Past spoken/typed conversations can be saved as entries the user can revisit (even if just in localStorage to start).
Reopening Stemmetilstand from a saved chat continues that chat's thread.
Relevant files
artifacts/omni-ai/src/App.tsx (lifted chatMessages state).
artifacts/omni-ai/src/components/Sidebar.tsx ("New Chat" button + chat list).
artifacts/omni-ai/src/components/ChatView.tsx (thread renderer).
Dependencies

Show the voice conversation in the chat after Stemmetilstand ends
Open task