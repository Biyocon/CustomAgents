#3 - Mirror the new voice + dictate buttons in the simpler chat composer
What & Why
The new mic ("Brug Stemmetilstand") and waveform ("Dikter") controls were intentionally added only to AdvancedPromptComposer (used by HomeView and ChatView). The lighter-weight UniversalComposer used elsewhere in the app still has the old single voice button (or none), which leads to inconsistent voice affordances depending on where the user is.

Done looks like
UniversalComposer exposes the same two side-by-side controls with matching tooltips ("Brug Stemmetilstand" / "Dikter"), focus rings, aria-labels, and data-testid values.
The two modes are mutually exclusive in that composer too.
Visual styling matches the advanced composer at the same scale.
Relevant files
artifacts/omni-ai/src/components/UniversalComposer.tsx (or wherever the simpler composer lives)
Reference implementation: artifacts/omni-ai/src/components/AdvancedPromptComposer.tsx (right cluster + overlay block)
Dependencies

Voice mode + Dikter buttons
Open task