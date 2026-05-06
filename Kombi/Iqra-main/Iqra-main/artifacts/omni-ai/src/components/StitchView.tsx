import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Upload,
  ClipboardPaste,
  Code2,
  Globe,
  ChevronDown,
  Plus,
  Check,
  ArrowRight,
  FileText,
  Sparkles,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { StitchCanvas } from './StitchCanvas';

type Phase = 'entry' | 'canvas';
type Platform = 'app' | 'web';

interface DesignSystem {
  id: string;
  name: string;
  desc: string;
  colors: string[];
  badge?: string;
}

const DESIGN_SYSTEMS: DesignSystem[] = [
  {
    id: 'iif',
    name: 'Institutional IIF',
    desc: 'Enterprise-grade, structured layouts',
    colors: ['#0f172a', '#1e3a8a', '#f3f4f6'],
    badge: 'Active',
  },
  {
    id: 'alexandria',
    name: 'Alexandria',
    desc: 'Warm editorial, humanist type',
    colors: ['#e26d5c', '#1e3a8a', '#fdf6ee'],
  },
  {
    id: 'bauhaus',
    name: 'Bauhaus',
    desc: 'Geometric minimal, bold contrasts',
    colors: ['#dc2626', '#171717', '#fbbf24'],
  },
  {
    id: 'glacier',
    name: 'Glacier',
    desc: 'Arctic clean, high-contrast whites',
    colors: ['#e0f2fe', '#bae6fd', '#ffffff'],
  },
  {
    id: 'omni',
    name: 'OmniAI Default',
    desc: 'Deep teal, mint accent, clean',
    colors: ['#004E51', '#43FFC8', '#fafafa'],
  },
];

const DESIGN_FILES = [
  { id: 'workspace', name: 'DESIGN.md', desc: 'Workspace root', active: true },
  { id: 'brand', name: 'brand-guidelines.md', desc: 'Brand Guidelines project' },
  { id: 'landing', name: 'landing-design.md', desc: 'Landing Page Redesign' },
];

const MODELS = ['3.0 Flash', '3.0 Pro', 'Legacy'];

export function StitchView() {
  const [phase, setPhase] = useState<Phase>('entry');
  const [platform, setPlatform] = useState<Platform>('app');
  const [selectedDS, setSelectedDS] = useState<string>('iif');
  const [selectedFile, setSelectedFile] = useState<string>('workspace');
  const [selectedModel, setSelectedModel] = useState('3.0 Flash');
  const [isModelOpen, setIsModelOpen] = useState(false);

  const activeDS = DESIGN_SYSTEMS.find(ds => ds.id === selectedDS)!;
  const activeFile = DESIGN_FILES.find(f => f.id === selectedFile)!;

  if (phase === 'canvas') {
    return (
      <StitchCanvas
        platform={platform}
        designSystem={activeDS}
        designFile={activeFile}
        onBack={() => setPhase('entry')}
      />
    );
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="entry"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="w-full h-full overflow-y-auto"
      >
        <div className="w-full min-h-full px-4 sm:px-8 md:px-12 pt-8 pb-16 max-w-[1140px] mx-auto flex flex-col gap-8">

          {/* ── Header ─────────────────────────────── */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">✨</span>
                <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Stitch</span>
              </div>
              <h1 className="text-[28px] md:text-[32px] font-bold text-foreground tracking-tight leading-tight">
                Design Workshop
              </h1>
              <p className="text-muted-foreground font-medium text-base mt-1">
                Build beautiful frontends from design systems
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* Platform toggle */}
              <div className="flex bg-[#f0f0f0] p-1 rounded-full shrink-0">
                {(['app', 'web'] as Platform[]).map(p => (
                  <button
                    key={p}
                    onClick={() => setPlatform(p)}
                    className={cn(
                      'px-5 py-1.5 rounded-full text-sm font-medium transition-all duration-200 capitalize',
                      platform === p ? 'bg-white shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'
                    )}
                    data-testid={`toggle-${p}`}
                  >
                    {p}
                  </button>
                ))}
              </div>

              {/* Model selector */}
              <div className="relative shrink-0">
                <button
                  onClick={() => setIsModelOpen(!isModelOpen)}
                  className="flex items-center gap-2 bg-white border border-border shadow-sm px-4 py-2 rounded-full text-sm font-medium hover:bg-muted/50 transition-colors"
                  data-testid="button-stitch-model"
                >
                  <span className="text-foreground">{selectedModel}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
                </button>
                <AnimatePresence>
                  {isModelOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 5, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 5, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute top-full right-0 mt-2 w-44 bg-white border border-border rounded-xl shadow-lg overflow-hidden z-50 py-1"
                    >
                      {MODELS.map(m => (
                        <button
                          key={m}
                          onClick={() => { setSelectedModel(m); setIsModelOpen(false); }}
                          className={cn(
                            'w-full text-left px-4 py-2 text-sm font-medium transition-colors hover:bg-muted flex items-center justify-between',
                            selectedModel === m ? 'text-primary bg-primary/5' : 'text-foreground'
                          )}
                          data-testid={`model-${m.toLowerCase().replace(' ', '-')}`}
                        >
                          {m}
                          {selectedModel === m && <Check className="w-3.5 h-3.5" />}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* ── Two-column body ─────────────────────── */}
          <div className="flex flex-col lg:flex-row gap-6">

            {/* LEFT: DESIGN.md starter + DS selection */}
            <div className="flex-1 flex flex-col gap-5">

              {/* DESIGN.md source */}
              <div className="bg-white border border-border rounded-[24px] p-6 shadow-[var(--shadow-card)]">
                <h2 className="text-sm font-bold text-foreground mb-1">Start with a DESIGN.md</h2>
                <p className="text-xs text-muted-foreground mb-5">Choose how you want to provide your design system file</p>

                <div className="grid grid-cols-2 gap-3">
                  {[
                    { icon: Upload, label: 'Upload file', sub: 'From local disk', id: 'upload' },
                    { icon: ClipboardPaste, label: 'Paste content', sub: 'From clipboard', id: 'paste' },
                    { icon: Code2, label: 'From codebase', sub: 'Scan repository', id: 'code' },
                    { icon: Globe, label: 'From URL', sub: 'Import from web', id: 'url' },
                  ].map(btn => (
                    <motion.button
                      key={btn.id}
                      whileHover={{ y: -2 }}
                      className="bg-[#f7f7f7] hover:bg-white border border-transparent hover:border-border rounded-[18px] p-5 flex flex-col items-center justify-center gap-3 text-center transition-all duration-200 hover:shadow-sm group"
                      data-testid={`starter-${btn.id}`}
                    >
                      <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center group-hover:bg-primary/5 transition-colors">
                        <btn.icon className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                      </div>
                      <div>
                        <div className="font-semibold text-foreground text-[13px]">{btn.label}</div>
                        <div className="text-[11px] text-muted-foreground">{btn.sub}</div>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Workspace DESIGN files */}
              <div className="bg-white border border-border rounded-[24px] p-6 shadow-[var(--shadow-card)]">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-sm font-bold text-foreground">Workspace Design Files</h2>
                  <span className="text-[11px] font-medium text-muted-foreground">{DESIGN_FILES.length} files</span>
                </div>
                <div className="flex flex-col gap-2">
                  {DESIGN_FILES.map(file => (
                    <button
                      key={file.id}
                      onClick={() => setSelectedFile(file.id)}
                      className={cn(
                        'flex items-center gap-3 p-3 rounded-xl border transition-all duration-150 text-left group',
                        selectedFile === file.id
                          ? 'border-primary/40 bg-primary/5'
                          : 'border-transparent hover:border-border hover:bg-[#f7f7f7]'
                      )}
                      data-testid={`file-${file.id}`}
                    >
                      <div className={cn(
                        'w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors',
                        selectedFile === file.id ? 'bg-primary/10' : 'bg-muted'
                      )}>
                        <FileText className={cn('w-4 h-4', selectedFile === file.id ? 'text-primary' : 'text-muted-foreground')} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold text-foreground truncate">{file.name}</div>
                        <div className="text-[11px] text-muted-foreground">{file.desc}</div>
                      </div>
                      {selectedFile === file.id && (
                        <div className="w-4 h-4 rounded-full bg-primary flex items-center justify-center shrink-0">
                          <Check className="w-2.5 h-2.5 text-white" />
                        </div>
                      )}
                      {file.active && selectedFile !== file.id && (
                        <span className="text-[10px] font-bold text-primary bg-primary/10 px-1.5 py-0.5 rounded-full">Active</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* RIGHT: Design system selector + Launch */}
            <div className="w-full lg:w-[320px] flex flex-col gap-5">

              {/* Design system picker */}
              <div className="bg-white border border-border rounded-[24px] p-6 shadow-[var(--shadow-card)] flex flex-col">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="w-4 h-4 text-primary" />
                  <h2 className="font-bold text-sm text-foreground">Design System</h2>
                </div>

                <div className="flex flex-col gap-1.5 flex-1">
                  {DESIGN_SYSTEMS.map(ds => (
                    <button
                      key={ds.id}
                      onClick={() => setSelectedDS(ds.id)}
                      className={cn(
                        'flex items-center gap-3 p-3 rounded-xl border transition-all duration-150 text-left group relative',
                        selectedDS === ds.id
                          ? 'border-primary/40 bg-primary/5'
                          : 'border-transparent hover:border-border hover:bg-[#f7f7f7]'
                      )}
                      data-testid={`ds-${ds.id}`}
                    >
                      {/* Colour swatches */}
                      <div className="flex -space-x-1.5 shrink-0">
                        {ds.colors.map((c, i) => (
                          <div
                            key={i}
                            className="w-5 h-5 rounded-full border-2 border-white shadow-sm"
                            style={{ backgroundColor: c, zIndex: 10 - i }}
                          />
                        ))}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="text-[13px] font-semibold text-foreground truncate flex items-center gap-1.5">
                          {ds.name}
                          {ds.badge && <span className="text-[9px] font-bold text-primary bg-primary/10 px-1.5 py-0.5 rounded-full">{ds.badge}</span>}
                        </div>
                        <div className="text-[11px] text-muted-foreground truncate">{ds.desc}</div>
                      </div>

                      {selectedDS === ds.id ? (
                        <div className="w-4 h-4 rounded-full bg-primary flex items-center justify-center shrink-0">
                          <Check className="w-2.5 h-2.5 text-white" />
                        </div>
                      ) : (
                        <div className="w-4 h-4 rounded-full border-2 border-border shrink-0 group-hover:border-primary/40 transition-colors" />
                      )}
                    </button>
                  ))}
                </div>

                <button
                  className="mt-4 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 border-dashed border-border bg-[#fafafa] text-muted-foreground hover:bg-[#f0f0f0] hover:border-muted-foreground/30 hover:text-foreground transition-all duration-200 text-sm font-semibold"
                  data-testid="button-upload-ds"
                >
                  <Plus className="w-4 h-4" />
                  Upload Custom
                </button>
              </div>

              {/* Launch button */}
              <motion.button
                onClick={() => setPhase('canvas')}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-primary hover:bg-[#003a3d] text-primary-foreground font-semibold text-base py-4 rounded-[18px] flex items-center justify-center gap-3 shadow-[0_4px_16px_rgba(0,78,81,0.25)] transition-colors"
                data-testid="button-launch-canvas"
              >
                <span>Launch Canvas</span>
                <ArrowRight className="w-5 h-5" />
              </motion.button>

              {/* Selection summary */}
              <div className="bg-[#f7f7f7] rounded-2xl px-4 py-3 border border-border">
                <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Configuration</p>
                <div className="flex flex-col gap-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Platform</span>
                    <span className="font-semibold text-foreground capitalize">{platform}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Design system</span>
                    <span className="font-semibold text-foreground">{activeDS.name}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Design file</span>
                    <span className="font-semibold text-foreground">{activeFile.name}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Model</span>
                    <span className="font-semibold text-foreground">{selectedModel}</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
