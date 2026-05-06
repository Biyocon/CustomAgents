// Shared composer types — extends what AdvancedPromptComposer already uses.
// Existing types (Mode, ConversationType, OutputTarget, ToolsMode, Attachment,
// QuickPromptMeta, SelectedTemplate, RaceModeConfig) remain inside the composer.
// New types live here so popover/directory components can import them without
// pulling the full composer module.

import type { ReactNode } from 'react';

// ── Project ────────────────────────────────────────────────
export interface ProjectMeta {
  id: string;
  name: string;
  workspace?: string;
}

// ── Style (response tone — NOT theme) ──────────────────────
export type StyleId = 'normal' | 'learning' | 'concise' | 'explanatory' | 'formal';

export interface StyleMeta {
  id: StyleId;
  label: string;
  description?: string;
}

// ── Model (concrete model — NOT mode) ──────────────────────
export interface ModelMeta {
  id: string;
  label: string;
  description?: string;
}

// ── Tool access (loading policy — NOT permission policy) ───
export type ToolAccessMode = 'load-when-needed' | 'preload-tools';

export interface ToolAccessOption {
  id: ToolAccessMode;
  label: string;
  description: string;
}

// ── Plugin (distinct from Skill / Connector / Tool) ────────
export type PluginAvailability = 'web' | 'desktop-only' | 'mock';

export interface Plugin {
  id: string;
  name: string;
  description: string;
  provider?: string;
  enabled: boolean;
  availability: PluginAvailability;
  category?: string;
  downloads?: number;
}

// ── Context item (extended with sourceType union) ──────────
export type ContextSourceType =
  | 'recent-chat'
  | 'artifact'
  | 'file'
  | 'document'
  | 'memory'
  | 'company-knowledge'
  | 'connector'
  | 'url'
  | 'web';

export type ContextItemStatus = 'connected' | 'disconnected' | 'requires-auth' | 'available';

export interface ContextItem {
  id: string;
  title: string;
  sourceType: ContextSourceType;
  connectorId?: string;
  sourceName?: string;
  status: ContextItemStatus;
  selected?: boolean;
  description?: string;
}

// ── GitHub source (mock shape used by GitHubSourcePicker) ──
export interface GitHubRepo {
  id: string;
  fullName: string;
  defaultBranch: string;
  description?: string;
  paths: string[];
}

// ── MCP server (Model Context Protocol) ────────────────────
// Distinct from Connector (SaaS OAuth) and Plugin (UI extension):
// an MCP server exposes tools, resources, and prompts to the model
// over a transport (stdio, SSE, or streamable HTTP).
export type MCPTransport = 'stdio' | 'sse' | 'http';
export type MCPStatus = 'connected' | 'available' | 'requires-auth' | 'error';

export interface MCPServer {
  id: string;
  name: string;
  description: string;
  provider: string;
  transport: MCPTransport;
  status: MCPStatus;
  toolCount: number;
  resourceCount?: number;
  category?: string;
  iconLetter?: string;
  iconColor?: string;
  popularity?: 'Most popular' | 'Popular' | 'Trending' | 'New';
  installed?: boolean;
}

// ── Directory modal ────────────────────────────────────────
export type DirectoryTab = 'skills' | 'connectors' | 'plugins' | 'mcps';

export interface DirectoryState {
  isOpen: boolean;
  activeTab: DirectoryTab;
  searchQuery: string;
  selectedCategory: string;
  filterBy?: string;
  sortBy?: string;
}

// Directory card shapes (uniform shape so DirectoryCard can render any tab)
export interface DirectorySkillEntry {
  id: string;
  name: string;
  provider: string;
  description: string;
  downloads: number;
  category: string;
  installed?: boolean;
}

export interface DirectoryConnectorEntry {
  id: string;
  name: string;
  description: string;
  category: string;
  popularity?: string;
  connected?: boolean;
  iconLetter?: string;
  iconColor?: string;
}

// ── Quick Action item (used by QuickActionMenu). Optional helper. ──
export interface QuickActionItem {
  label: string;
  desc: string;
  icon: ReactNode;
  active?: boolean;
  toggle?: boolean;
  sub?: boolean;
  onClick: () => void;
  testId: string;
}
