# OmniAI Hub — Design System (DESIGN.md)

## 1. Identity
OmniAI Hub is the OS for your AI workspaces. It brings together chat, data, artifacts, and tools in a single unified interface. The identity is professional, highly functional, and refined — focusing on clarity over decoration.

## 2. Color Tokens
- **Background**: #FAFAFA
- **Foreground**: #1C1C1C
- **Card**: #FFFFFF
- **Border**: #E0E0E0
- **Primary**: #004E51 (Deep Teal)
- **Secondary**: #34D399 (Soft Cyan)
- **Muted**: #F5F5F5
- **Muted Foreground**: #616161
- **Destructive**: #E11D48

## 3. Typography
- **Sans Serif**: Inter, sans-serif
- **Serif**: Georgia, serif
- **Monospace**: Menlo, monospace

### Scale
- **xs**: 11px
- **sm**: 13px
- **base**: 15px
- **md**: 16px
- **lg**: 18px
- **xl**: 20px
- **2xl**: 24px
- **3xl**: 28px
- **4xl**: 32px
- **5xl**: 40px

## 4. Spacing Scale
- **space-1**: 4px
- **space-2**: 8px
- **space-3**: 12px
- **space-4**: 16px
- **space-5**: 20px
- **space-6**: 24px
- **space-8**: 32px
- **space-10**: 40px
- **space-12**: 48px
- **space-16**: 64px

## 5. Border Radius Scale
- **xs**: 4px
- **sm**: 6px
- **md**: 8px
- **lg**: 16px
- **xl**: 24px
- **2xl**: 32px
- **full**: 9999px

## 6. Shadow System
- **2xs**: `0 1px 2px rgba(0,0,0,0.04)`
- **xs**: `0 1px 3px rgba(0,0,0,0.06)`
- **sm**: `0 2px 4px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)`
- **default**: `0 4px 8px rgba(0,0,0,0.07), 0 2px 4px rgba(0,0,0,0.04)`
- **md**: `0 4px 16px rgba(0,0,0,0.08), 0 2px 6px rgba(0,0,0,0.04)`
- **lg**: `0 8px 24px rgba(0,0,0,0.1), 0 4px 8px rgba(0,0,0,0.04)`
- **xl**: `0 16px 40px rgba(0,0,0,0.12), 0 8px 16px rgba(0,0,0,0.06)`
- **2xl**: `0 24px 64px rgba(0,0,0,0.14), 0 12px 24px rgba(0,0,0,0.08)`

### Component Shadows
- **Card**: `0 2px 12px rgba(0,0,0,0.06)`
- **Input**: `0 4px 24px rgba(0,0,0,0.09)`
- **Dropdown**: `0 8px 24px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.06)`
- **Modal**: `0 24px 64px rgba(0,0,0,0.18)`

## 7. Component Inventory
- `WorkspaceButton` (primary, secondary, ghost, danger)
- `WorkspaceCard` (default, elevated, outlined)
- `StatusBadge` (active, idle, processing, error, success, warning, info)
- `WorkspaceDialog` (sm, md, lg)
- `WorkspaceDrawer` (sm, md, lg)
- `UniversalComposer`
- `Topbar`

## 8. Shell Architecture
- **Sidebar**: Left-aligned navigation, dark accent for primary actions
- **Topbar**: Breadcrumbs, status indicator, notifications, user profile
- **Main Content Area**: Flexible workspace that accommodates chat, document views, or tools
- **Composer**: Fixed or docked universal input at the bottom of standard views

## 9. Motion & Transitions
- Animations prioritize speed and purpose over flair.
- Uses `framer-motion` for complex mount/unmount animations (drawers, dialogs).
- Easing: `[0.16, 1, 0.3, 1]` for natural snaps.

## 10. Icon System
- We use Lucide React icons exclusively.
- Size is 16px to 24px for standard UI elements.
- Strokes are strictly 2px.
