import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  Share2,
  Download,
  ChevronDown,
  ChevronRight,
  Layers,
  Palette,
  Package,
  FileOutput,
  Plus,
  Send,
  Paperclip,
  Maximize2,
  MoreHorizontal,
  Monitor,
  Smartphone,
  Type,
  Square,
  MousePointer,
  Hand,
  ZoomIn,
  ZoomOut,
  Users,
  Check,
  X,
  Copy,
  RefreshCw,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface DesignSystem {
  id: string;
  name: string;
  desc: string;
  colors: string[];
  badge?: string;
}

interface DesignFile {
  id: string;
  name: string;
  desc: string;
  active?: boolean;
}

interface StitchCanvasProps {
  platform: 'app' | 'web';
  designSystem: DesignSystem;
  designFile: DesignFile;
  onBack: () => void;
}

type RightTab = 'properties' | 'design' | 'components' | 'export';

interface Screen {
  id: string;
  name: string;
  status: 'generated' | 'pending' | 'selected';
  desc: string;
  components: string[];
}

const SCREENS: Screen[] = [
  { id: 'login', name: 'Login / Auth', status: 'generated', desc: 'Authentication entry point with email and password fields, social login options, and brand header.', components: ['Input', 'Button', 'Logo', 'Divider', 'SocialButton'] },
  { id: 'dashboard', name: 'Home Dashboard', status: 'generated', desc: 'Main workspace overview with greeting, stats row, quick actions, and recent activity feed.', components: ['Topbar', 'StatCard', 'QuickAction', 'ActivityFeed', 'Sidebar'] },
  { id: 'settings', name: 'Settings / Profile', status: 'generated', desc: 'User profile settings with account details, notification preferences, and plan information.', components: ['Avatar', 'Input', 'Toggle', 'Select', 'Button', 'Section'] },
  { id: 'analytics', name: 'Analytics', status: 'pending', desc: 'Data visualisation dashboard with charts, metrics, and filterable tables.', components: ['Chart', 'MetricCard', 'DatePicker', 'Table', 'Filter'] },
];

const TOKEN_GROUPS = [
  { label: 'Colours', tokens: [
    { name: 'Primary', value: '#004E51', swatch: '#004E51' },
    { name: 'Accent', value: '#43FFC8', swatch: '#43FFC8' },
    { name: 'Background', value: '#FAFAFA', swatch: '#FAFAFA' },
    { name: 'Foreground', value: '#1C1C1C', swatch: '#1C1C1C' },
    { name: 'Border', value: '#E0E0E0', swatch: '#E0E0E0' },
  ]},
  { label: 'Typography', tokens: [
    { name: 'Font', value: 'Inter' },
    { name: 'H1', value: '32px / 700' },
    { name: 'Body', value: '15px / 400' },
    { name: 'Small', value: '13px / 500' },
  ]},
  { label: 'Spacing', tokens: [
    { name: 'Base', value: '4px' },
    { name: 'Card padding', value: '24px' },
    { name: 'Section gap', value: '48px' },
  ]},
];

const COMPONENTS_LIBRARY = [
  { name: 'Button', variants: 4, category: 'Action' },
  { name: 'Input', variants: 3, category: 'Form' },
  { name: 'Card', variants: 3, category: 'Layout' },
  { name: 'Avatar', variants: 2, category: 'Display' },
  { name: 'Badge', variants: 5, category: 'Display' },
  { name: 'Sidebar', variants: 2, category: 'Navigation' },
  { name: 'Topbar', variants: 2, category: 'Navigation' },
  { name: 'Toggle', variants: 2, category: 'Form' },
  { name: 'Modal', variants: 2, category: 'Overlay' },
  { name: 'Dropdown', variants: 3, category: 'Navigation' },
];

const EXPORT_FORMATS = [
  { id: 'react', label: 'React + Tailwind', desc: 'Production-ready JSX components', icon: '⚛️' },
  { id: 'html', label: 'HTML + CSS', desc: 'Static web-ready output', icon: '🌐' },
  { id: 'png', label: 'PNG (2×)', desc: 'High-res artboard image', icon: '🖼️' },
  { id: 'figma', label: 'Figma JSON', desc: 'Import to Figma design tool', icon: '🎨' },
];

/* ── Screen Artboard previews ──────────────────────── */
function LoginArtboard({ primary, platform }: { primary: string; platform: 'app' | 'web' }) {
  const h = platform === 'app' ? 420 : 340;
  return (
    <div className="flex flex-col items-center justify-center gap-4 px-8 py-10" style={{ height: h }}>
      <div className="w-8 h-8 rounded-lg shrink-0" style={{ backgroundColor: primary }} />
      <div className="h-2 bg-gray-200 rounded-full w-32" />
      <div className="h-1.5 bg-gray-100 rounded-full w-24" />
      <div className="w-full flex flex-col gap-2 mt-4">
        <div className="h-8 border border-gray-200 rounded-lg bg-gray-50 w-full" />
        <div className="h-8 border border-gray-200 rounded-lg bg-gray-50 w-full" />
        <div className="h-9 rounded-lg w-full" style={{ backgroundColor: primary }} />
      </div>
      <div className="flex items-center gap-2 w-full mt-2">
        <div className="h-px bg-gray-200 flex-1" />
        <div className="h-1.5 bg-gray-200 rounded-full w-6" />
        <div className="h-px bg-gray-200 flex-1" />
      </div>
      <div className="flex gap-2 w-full">
        <div className="h-8 border border-gray-200 rounded-lg flex-1 bg-white" />
        <div className="h-8 border border-gray-200 rounded-lg flex-1 bg-white" />
      </div>
    </div>
  );
}

function DashboardArtboard({ primary, platform }: { primary: string; platform: 'app' | 'web' }) {
  const h = platform === 'app' ? 420 : 340;
  return (
    <div className="flex flex-col" style={{ height: h }}>
      <div className="h-8 border-b border-gray-100 flex items-center px-4 gap-2" style={{ backgroundColor: `${primary}10` }}>
        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: primary }} />
        <div className="h-1.5 bg-gray-300 rounded-full w-16" />
        <div className="flex-1" />
        <div className="w-5 h-5 rounded-full bg-gray-200" />
      </div>
      <div className="flex-1 px-4 py-3 flex flex-col gap-3">
        <div className="h-1.5 bg-gray-300 rounded-full w-28" />
        <div className="grid grid-cols-3 gap-2">
          {[0,1,2].map(i => (
            <div key={i} className="border border-gray-100 rounded-lg p-2 flex flex-col gap-1 bg-white">
              <div className="h-1 bg-gray-200 rounded-full w-10" />
              <div className="h-3 font-bold text-center" style={{ color: primary, fontSize: 14 }}>—</div>
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-1.5 mt-1">
          {[0,1,2].map(i => (
            <div key={i} className="h-7 border border-gray-100 rounded-lg bg-white flex items-center px-2 gap-2">
              <div className="w-3 h-3 rounded bg-gray-200 shrink-0" />
              <div className="h-1 bg-gray-200 rounded-full flex-1" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function SettingsArtboard({ primary, platform }: { primary: string; platform: 'app' | 'web' }) {
  const h = platform === 'app' ? 420 : 340;
  return (
    <div className="flex flex-col gap-3 px-5 py-4" style={{ height: h }}>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full" style={{ backgroundColor: `${primary}30` }} />
        <div className="flex flex-col gap-1">
          <div className="h-2 bg-gray-300 rounded-full w-20" />
          <div className="h-1.5 bg-gray-200 rounded-full w-14" />
        </div>
      </div>
      <div className="h-px bg-gray-100 w-full" />
      {[0,1,2,3].map(i => (
        <div key={i} className="flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <div className="h-1.5 bg-gray-300 rounded-full w-20" />
            <div className="h-1 bg-gray-100 rounded-full w-28" />
          </div>
          <div className="w-8 h-4 rounded-full" style={{ backgroundColor: i < 2 ? primary : '#e0e0e0' }} />
        </div>
      ))}
      <div className="mt-auto h-8 rounded-lg border border-gray-200 flex items-center justify-center">
        <div className="h-1.5 bg-gray-300 rounded-full w-16" />
      </div>
    </div>
  );
}

function PendingArtboard({ platform }: { platform: 'app' | 'web' }) {
  const h = platform === 'app' ? 420 : 340;
  return (
    <div className="flex flex-col items-center justify-center gap-3" style={{ height: h }}>
      <div className="w-10 h-10 rounded-xl border-2 border-dashed border-gray-200 flex items-center justify-center">
        <Plus className="w-5 h-5 text-gray-300" />
      </div>
      <div className="text-[11px] text-gray-400 font-medium">Ready to generate</div>
    </div>
  );
}

/* ── Device Frame ──────────────────────────────────── */
function DeviceFrame({ platform, children, selected, onSelect, label, status, primary }:
  { platform: 'app' | 'web'; children: React.ReactNode; selected: boolean; onSelect: () => void; label: string; status: string; primary: string }) {

  if (platform === 'app') {
    return (
      <motion.div
        onClick={onSelect}
        whileHover={{ y: -3 }}
        className={cn(
          'flex flex-col items-center gap-3 cursor-pointer group',
        )}
      >
        <div className={cn(
          'relative rounded-[36px] border-[3px] bg-white transition-all duration-200 overflow-hidden',
          selected ? 'border-primary shadow-[0_0_0_3px_rgba(0,78,81,0.2)]' : 'border-gray-300 hover:border-gray-400 hover:shadow-md'
        )} style={{ width: 200, height: 434 }}>
          {/* Notch */}
          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-16 h-4 bg-gray-300 rounded-full z-10" />
          <div className="absolute inset-0 top-0 overflow-hidden rounded-[33px]">
            {children}
          </div>
          {/* Bottom bar */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 w-20 h-1 bg-gray-300 rounded-full" />
        </div>
        <div className="flex flex-col items-center gap-1">
          <div className="flex items-center gap-1.5">
            <span className="text-[13px] font-semibold text-foreground">{label}</span>
            {selected && <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: primary }} />}
          </div>
          <span className={cn('text-[10px] font-medium px-2 py-0.5 rounded-full', status === 'pending' ? 'bg-gray-100 text-gray-400' : 'bg-primary/10 text-primary')}>
            {status === 'pending' ? 'Pending' : 'Generated'}
          </span>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      onClick={onSelect}
      whileHover={{ y: -3 }}
      className="flex flex-col items-center gap-3 cursor-pointer"
    >
      <div className={cn(
        'relative rounded-xl border-[3px] bg-white transition-all duration-200 overflow-hidden',
        selected ? 'border-primary shadow-[0_0_0_3px_rgba(0,78,81,0.2)]' : 'border-gray-300 hover:border-gray-400 hover:shadow-md'
      )} style={{ width: 280, height: 186 }}>
        {/* Browser chrome */}
        <div className="h-8 bg-gray-100 border-b border-gray-200 flex items-center px-3 gap-1.5 shrink-0">
          <div className="w-2.5 h-2.5 rounded-full bg-red-300" />
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-300" />
          <div className="w-2.5 h-2.5 rounded-full bg-green-300" />
          <div className="flex-1 mx-3 h-4 bg-white rounded border border-gray-200" />
        </div>
        <div className="overflow-hidden" style={{ height: 150 }}>
          {children}
        </div>
      </div>
      <div className="flex flex-col items-center gap-1">
        <div className="flex items-center gap-1.5">
          <span className="text-[13px] font-semibold text-foreground">{label}</span>
          {selected && <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: primary }} />}
        </div>
        <span className={cn('text-[10px] font-medium px-2 py-0.5 rounded-full', status === 'pending' ? 'bg-gray-100 text-gray-400' : 'bg-primary/10 text-primary')}>
          {status === 'pending' ? 'Pending' : 'Generated'}
        </span>
      </div>
    </motion.div>
  );
}

/* ── Main Canvas Component ─────────────────────────── */
export function StitchCanvas({ platform, designSystem, designFile, onBack }: StitchCanvasProps) {
  const [selectedScreenId, setSelectedScreenId] = useState<string>('dashboard');
  const [rightTab, setRightTab] = useState<RightTab>('properties');
  const [prompt, setPrompt] = useState('');
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [selectedExport, setSelectedExport] = useState('react');
  const [leftCollapsed, setLeftCollapsed] = useState(false);
  const [screensExpanded, setScreensExpanded] = useState(true);
  const [zoom, setZoom] = useState(100);

  const primary = designSystem.colors[0] ?? '#004E51';
  const selectedScreen = SCREENS.find(s => s.id === selectedScreenId)!;

  const rightTabs: { id: RightTab; icon: React.ElementType; label: string }[] = [
    { id: 'properties', icon: Layers, label: 'Properties' },
    { id: 'design', icon: Palette, label: 'Design' },
    { id: 'components', icon: Package, label: 'Components' },
    { id: 'export', icon: FileOutput, label: 'Export' },
  ];

  return (
    <div className="flex flex-col h-full bg-[#EFEFEF] overflow-hidden">

      {/* ── Canvas Topbar ───────────────────────── */}
      <div className="h-[52px] bg-white border-b border-border flex items-center justify-between px-3 shrink-0 gap-2 z-20">
        {/* Left */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors group shrink-0"
            data-testid="button-canvas-back"
          >
            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            <span className="hidden sm:inline">Entry</span>
          </button>
          <div className="w-px h-5 bg-border shrink-0" />
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-base">✨</span>
            <span className="text-sm font-semibold text-foreground truncate">Stitch</span>
            <ChevronRight className="w-3 h-3 text-muted-foreground shrink-0" />
            <span className="text-sm text-muted-foreground truncate hidden md:block">{designSystem.name}</span>
            <ChevronRight className="w-3 h-3 text-muted-foreground shrink-0 hidden md:block" />
            <span className="text-sm text-muted-foreground truncate hidden md:block">{designFile.name}</span>
          </div>
        </div>

        {/* Centre: tools */}
        <div className="hidden md:flex items-center gap-0.5 bg-[#f5f5f5] border border-border rounded-lg p-0.5 shrink-0">
          {[
            { icon: MousePointer, id: 'select', title: 'Select' },
            { icon: Hand, id: 'hand', title: 'Pan' },
            { icon: Square, id: 'frame', title: 'Frame' },
            { icon: Type, id: 'text', title: 'Text' },
          ].map(tool => (
            <button
              key={tool.id}
              title={tool.title}
              className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-white transition-colors"
              data-testid={`tool-${tool.id}`}
            >
              <tool.icon className="w-3.5 h-3.5" />
            </button>
          ))}
        </div>

        {/* Right: zoom + share + export + collab */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Zoom */}
          <div className="hidden sm:flex items-center gap-1 border border-border rounded-lg px-2 py-1 bg-white text-xs font-medium">
            <button onClick={() => setZoom(z => Math.max(25, z - 25))} className="text-muted-foreground hover:text-foreground"><ZoomOut className="w-3 h-3" /></button>
            <span className="w-10 text-center text-muted-foreground">{zoom}%</span>
            <button onClick={() => setZoom(z => Math.min(200, z + 25))} className="text-muted-foreground hover:text-foreground"><ZoomIn className="w-3 h-3" /></button>
          </div>

          {/* Collab avatars */}
          <div className="hidden sm:flex items-center -space-x-1.5">
            {['AC', 'JR'].map((init, i) => (
              <div key={i} className={cn('w-7 h-7 rounded-full border-2 border-white flex items-center justify-center text-[10px] font-bold text-white', i === 0 ? 'bg-[#004E51]' : 'bg-[#6d28d9]')}>
                {init}
              </div>
            ))}
          </div>

          {/* Share */}
          <div className="relative">
            <button
              onClick={() => { setIsShareOpen(!isShareOpen); setIsExportOpen(false); }}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium border border-border rounded-lg hover:bg-muted/50 transition-colors"
              data-testid="button-share"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Share</span>
            </button>
            <AnimatePresence>
              {isShareOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 5, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 5, scale: 0.96 }}
                  transition={{ duration: 0.15 }}
                  className="absolute top-full right-0 mt-2 w-72 bg-white border border-border rounded-2xl shadow-xl z-50 p-4"
                  data-testid="panel-share"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-bold text-foreground">Share Canvas</h3>
                    <button onClick={() => setIsShareOpen(false)} className="text-muted-foreground hover:text-foreground"><X className="w-4 h-4" /></button>
                  </div>
                  <div className="flex items-center gap-2 mb-4">
                    <input
                      readOnly
                      value="https://omni.ai/canvas/cairo-v2"
                      className="flex-1 text-xs bg-[#f5f5f5] border border-border rounded-lg px-3 py-2 font-mono text-muted-foreground"
                    />
                    <button className="p-2 border border-border rounded-lg hover:bg-muted/50 transition-colors"><Copy className="w-3.5 h-3.5 text-muted-foreground" /></button>
                  </div>
                  <div className="flex flex-col gap-2">
                    {[
                      { label: 'Can edit', role: 'Editor' },
                      { label: 'Can view', role: 'Viewer' },
                    ].map(opt => (
                      <div key={opt.role} className="flex items-center justify-between p-2 rounded-lg hover:bg-[#f5f5f5]">
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm text-foreground">{opt.label}</span>
                        </div>
                        <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full">{opt.role}</span>
                      </div>
                    ))}
                  </div>
                  <button className="w-full mt-3 bg-primary text-primary-foreground text-sm font-medium py-2 rounded-lg hover:bg-[#003a3d] transition-colors">
                    Copy link
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Export */}
          <div className="relative">
            <button
              onClick={() => { setIsExportOpen(!isExportOpen); setIsShareOpen(false); }}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold bg-primary text-primary-foreground rounded-lg hover:bg-[#003a3d] transition-colors"
              data-testid="button-export"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Export</span>
            </button>
            <AnimatePresence>
              {isExportOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 5, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 5, scale: 0.96 }}
                  transition={{ duration: 0.15 }}
                  className="absolute top-full right-0 mt-2 w-72 bg-white border border-border rounded-2xl shadow-xl z-50 p-4"
                  data-testid="panel-export"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-bold text-foreground">Export</h3>
                    <button onClick={() => setIsExportOpen(false)} className="text-muted-foreground hover:text-foreground"><X className="w-4 h-4" /></button>
                  </div>
                  <div className="flex flex-col gap-2 mb-4">
                    {EXPORT_FORMATS.map(fmt => (
                      <button
                        key={fmt.id}
                        onClick={() => setSelectedExport(fmt.id)}
                        className={cn(
                          'flex items-center gap-3 p-3 rounded-xl border text-left transition-all',
                          selectedExport === fmt.id ? 'border-primary/40 bg-primary/5' : 'border-border hover:bg-[#f5f5f5]'
                        )}
                        data-testid={`export-${fmt.id}`}
                      >
                        <span className="text-xl shrink-0">{fmt.icon}</span>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-semibold text-foreground">{fmt.label}</div>
                          <div className="text-[11px] text-muted-foreground">{fmt.desc}</div>
                        </div>
                        {selectedExport === fmt.id && (
                          <div className="w-4 h-4 rounded-full bg-primary flex items-center justify-center shrink-0">
                            <Check className="w-2.5 h-2.5 text-white" />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                  <button className="w-full bg-primary text-primary-foreground text-sm font-medium py-2.5 rounded-lg hover:bg-[#003a3d] transition-colors flex items-center justify-center gap-2">
                    <Download className="w-4 h-4" />
                    Download {selectedExport.toUpperCase()}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* ── Body ───────────────────────────────── */}
      <div className="flex-1 flex overflow-hidden">

        {/* Left Panel: Layers / Screens */}
        <AnimatePresence initial={false}>
          {!leftCollapsed && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 200, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="bg-white border-r border-border flex flex-col shrink-0 overflow-hidden"
              data-testid="panel-layers"
            >
              <div className="p-3 border-b border-border flex items-center justify-between">
                <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Layers</span>
                <button onClick={() => setLeftCollapsed(true)} className="text-muted-foreground hover:text-foreground"><ChevronLeft className="w-3.5 h-3.5" /></button>
              </div>

              <div className="flex-1 overflow-y-auto py-2">
                {/* Pages */}
                <div className="px-3 mb-1">
                  <span className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-wider">Pages</span>
                </div>
                <button className="w-full flex items-center gap-2 px-3 py-1.5 hover:bg-[#f5f5f5] transition-colors text-left">
                  <div className="w-3 h-3 rounded-[3px] border border-gray-300 shrink-0" />
                  <span className="text-[13px] font-medium text-foreground">Main Flow</span>
                  <span className="text-[10px] text-muted-foreground ml-auto">{SCREENS.length}</span>
                </button>

                {/* Screens */}
                <div className="px-3 mt-3 mb-1 flex items-center justify-between">
                  <span className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-wider">Screens</span>
                  <button onClick={() => setScreensExpanded(!screensExpanded)}>
                    <ChevronDown className={cn('w-3 h-3 text-muted-foreground transition-transform', !screensExpanded && '-rotate-90')} />
                  </button>
                </div>

                <AnimatePresence initial={false}>
                  {screensExpanded && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: 'auto' }}
                      exit={{ height: 0 }}
                      className="overflow-hidden"
                    >
                      {SCREENS.map(screen => (
                        <button
                          key={screen.id}
                          onClick={() => setSelectedScreenId(screen.id)}
                          className={cn(
                            'w-full flex items-center gap-2 px-4 py-1.5 transition-colors text-left group',
                            selectedScreenId === screen.id ? 'bg-primary/8 text-primary' : 'hover:bg-[#f5f5f5] text-muted-foreground hover:text-foreground'
                          )}
                          data-testid={`layer-${screen.id}`}
                        >
                          <div className={cn(
                            'w-3 h-3 rounded-[3px] border shrink-0 transition-colors',
                            selectedScreenId === screen.id ? 'border-primary bg-primary/20' : 'border-gray-300'
                          )} />
                          <span className="text-[12px] font-medium truncate">{screen.name}</span>
                          {screen.status === 'pending' && (
                            <span className="text-[9px] text-muted-foreground/50 ml-auto">—</span>
                          )}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Components */}
                <div className="px-3 mt-3 mb-1">
                  <span className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-wider">Components</span>
                </div>
                {selectedScreen.components.slice(0, 4).map(comp => (
                  <button key={comp} className="w-full flex items-center gap-2 px-4 py-1.5 hover:bg-[#f5f5f5] transition-colors text-left text-muted-foreground hover:text-foreground">
                    <div className="w-3 h-3 rounded border border-dashed border-gray-300 shrink-0" />
                    <span className="text-[12px] font-medium">{comp}</span>
                  </button>
                ))}
              </div>

              {/* Add screen */}
              <div className="p-3 border-t border-border">
                <button className="w-full flex items-center justify-center gap-1.5 py-1.5 text-[12px] font-medium text-muted-foreground hover:text-foreground border border-dashed border-border rounded-lg hover:border-muted-foreground/30 transition-colors" data-testid="button-add-screen">
                  <Plus className="w-3 h-3" /> Add Screen
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Expand left panel button */}
        {leftCollapsed && (
          <button
            onClick={() => setLeftCollapsed(false)}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-5 h-10 bg-white border border-border rounded-r-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
            data-testid="button-expand-layers"
          >
            <ChevronRight className="w-3 h-3" />
          </button>
        )}

        {/* ── Canvas Area ──────────────────────── */}
        <div className="flex-1 flex flex-col overflow-hidden relative">
          {/* Grid canvas area */}
          <div
            className="flex-1 overflow-auto flex items-start justify-center py-12 px-8 gap-8 md:gap-12 flex-wrap"
            style={{ background: 'radial-gradient(circle at 1px 1px, rgba(0,0,0,0.06) 1px, transparent 0)', backgroundSize: '24px 24px' }}
          >
            {SCREENS.map(screen => {
              const artboard = screen.id === 'login'
                ? <LoginArtboard primary={primary} platform={platform} />
                : screen.id === 'dashboard'
                  ? <DashboardArtboard primary={primary} platform={platform} />
                  : screen.id === 'settings'
                    ? <SettingsArtboard primary={primary} platform={platform} />
                    : <PendingArtboard platform={platform} />;

              return (
                <DeviceFrame
                  key={screen.id}
                  platform={platform}
                  selected={selectedScreenId === screen.id}
                  onSelect={() => { setSelectedScreenId(screen.id); setRightTab('properties'); }}
                  label={screen.name}
                  status={screen.status}
                  primary={primary}
                >
                  {artboard}
                </DeviceFrame>
              );
            })}
          </div>

          {/* ── Bottom Composer ─────────────────── */}
          <div className="border-t border-border bg-white/90 backdrop-blur-sm px-4 py-3 shrink-0">
            {/* Suggestion chips */}
            <div className="flex items-center gap-2 mb-2 overflow-x-auto scrollbar-none pb-1">
              {[
                { label: 'Add new screen', icon: Plus },
                { label: 'Regenerate layout', icon: RefreshCw },
                { label: 'Apply design tokens', icon: Palette },
                { label: 'Export all screens', icon: FileOutput },
              ].map((chip, i) => (
                <button
                  key={i}
                  className="flex items-center gap-1.5 px-3 py-1 bg-[#f5f5f5] hover:bg-[#eeeeee] border border-border rounded-full text-xs font-medium text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap shrink-0"
                  data-testid={`chip-${i}`}
                >
                  <chip.icon className="w-3 h-3" />
                  {chip.label}
                </button>
              ))}
            </div>

            <div className="flex items-end gap-2">
              <button className="p-2 text-muted-foreground hover:text-foreground transition-colors shrink-0 mb-0.5">
                <Paperclip className="w-4 h-4" />
              </button>
              <div className="flex-1 bg-[#f5f5f5] border border-border rounded-2xl px-4 py-2.5 flex items-end gap-2">
                <textarea
                  value={prompt}
                  onChange={e => setPrompt(e.target.value)}
                  placeholder={`Describe changes for ${selectedScreen.name}…`}
                  rows={1}
                  className="flex-1 bg-transparent text-sm resize-none outline-none placeholder:text-muted-foreground/60 leading-relaxed min-h-[20px] max-h-[120px]"
                  style={{ overflowY: 'auto' }}
                  data-testid="canvas-composer-input"
                />
                <button
                  className="p-1.5 bg-primary text-primary-foreground rounded-lg hover:bg-[#003a3d] transition-colors shrink-0 mb-0.5 disabled:opacity-40"
                  disabled={!prompt.trim()}
                  data-testid="canvas-composer-send"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="flex items-center gap-1 shrink-0 mb-0.5">
                <button className="p-1.5 text-muted-foreground hover:text-foreground transition-colors">
                  <Maximize2 className="w-4 h-4" />
                </button>
                {platform === 'app'
                  ? <Smartphone className="w-4 h-4 text-muted-foreground" />
                  : <Monitor className="w-4 h-4 text-muted-foreground" />
                }
              </div>
            </div>
          </div>
        </div>

        {/* ── Right Panel ──────────────────────── */}
        <div className="w-[260px] xl:w-[280px] bg-white border-l border-border flex flex-col shrink-0 hidden md:flex" data-testid="panel-right">
          {/* Tab bar */}
          <div className="flex border-b border-border shrink-0">
            {rightTabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setRightTab(tab.id)}
                title={tab.label}
                className={cn(
                  'flex-1 flex flex-col items-center justify-center gap-0.5 py-2.5 text-[10px] font-semibold transition-colors border-b-2',
                  rightTab === tab.id ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'
                )}
                data-testid={`right-tab-${tab.id}`}
              >
                <tab.icon className="w-4 h-4" />
                <span className="hidden xl:block">{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div className="flex-1 overflow-y-auto">
            <AnimatePresence mode="wait">

              {/* Properties */}
              {rightTab === 'properties' && (
                <motion.div
                  key="properties"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="p-4 flex flex-col gap-4"
                >
                  <div>
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1.5 block">Screen Name</label>
                    <input
                      defaultValue={selectedScreen.name}
                      key={selectedScreen.id}
                      className="w-full text-sm font-medium bg-[#f5f5f5] border border-border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all"
                      data-testid="input-screen-name"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1.5 block">Dimensions</label>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="bg-[#f5f5f5] border border-border rounded-lg px-3 py-2 text-sm text-muted-foreground">
                        W: {platform === 'app' ? '390' : '1440'}
                      </div>
                      <div className="bg-[#f5f5f5] border border-border rounded-lg px-3 py-2 text-sm text-muted-foreground">
                        H: {platform === 'app' ? '844' : '900'}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1.5 block">Status</label>
                    <div className={cn(
                      'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold',
                      selectedScreen.status === 'pending' ? 'bg-gray-100 text-gray-500' : 'bg-primary/10 text-primary'
                    )}>
                      <div className={cn('w-1.5 h-1.5 rounded-full', selectedScreen.status === 'pending' ? 'bg-gray-400' : 'bg-primary')} />
                      {selectedScreen.status === 'pending' ? 'Pending generation' : 'Generated'}
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1.5 block">AI Description</label>
                    <p className="text-xs text-muted-foreground leading-relaxed bg-[#f7f7f7] rounded-lg p-3 border border-border">
                      {selectedScreen.desc}
                    </p>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1.5 block">Components</label>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedScreen.components.map(c => (
                        <span key={c} className="text-[11px] font-medium bg-muted text-muted-foreground px-2 py-0.5 rounded-full border border-border/60">
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 pt-2 border-t border-border">
                    <button className="w-full text-sm font-semibold text-primary hover:text-primary/80 py-2 flex items-center justify-center gap-1.5 transition-colors" data-testid="button-regenerate-screen">
                      <RefreshCw className="w-3.5 h-3.5" />Regenerate screen
                    </button>
                    <button className="w-full text-sm font-medium text-muted-foreground hover:text-foreground py-2 flex items-center justify-center gap-1.5 transition-colors" data-testid="button-duplicate-screen">
                      <Copy className="w-3.5 h-3.5" />Duplicate
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Design tokens */}
              {rightTab === 'design' && (
                <motion.div
                  key="design"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="p-4 flex flex-col gap-4"
                >
                  <div className="flex items-center gap-2 p-3 bg-[#f7f7f7] rounded-xl border border-border">
                    <div className="flex -space-x-1.5">
                      {designSystem.colors.map((c, i) => (
                        <div key={i} className="w-5 h-5 rounded-full border-2 border-white shadow-sm" style={{ backgroundColor: c }} />
                      ))}
                    </div>
                    <div>
                      <div className="text-[12px] font-bold text-foreground">{designSystem.name}</div>
                      <div className="text-[10px] text-muted-foreground">{designSystem.desc}</div>
                    </div>
                  </div>

                  {TOKEN_GROUPS.map(group => (
                    <div key={group.label}>
                      <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2 block">{group.label}</label>
                      <div className="flex flex-col gap-1.5">
                        {group.tokens.map(token => (
                          <div key={token.name} className="flex items-center justify-between py-1">
                            <span className="text-[12px] text-muted-foreground">{token.name}</span>
                            <div className="flex items-center gap-2">
                              {"swatch" in token && token.swatch && (
                                <div className="w-4 h-4 rounded border border-border/60 shadow-sm" style={{ backgroundColor: token.swatch as string }} />
                              )}
                              <span className="text-[11px] font-mono font-medium text-foreground">{token.value}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </motion.div>
              )}

              {/* Components library */}
              {rightTab === 'components' && (
                <motion.div
                  key="components"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="p-4 flex flex-col gap-3"
                >
                  <div className="relative">
                    <input
                      placeholder="Search components…"
                      className="w-full pl-3 pr-3 py-2 text-xs bg-[#f5f5f5] border border-border rounded-lg outline-none focus:ring-2 focus:ring-primary/20 placeholder:text-muted-foreground/60"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    {COMPONENTS_LIBRARY.map(comp => (
                      <div
                        key={comp.name}
                        className="flex items-center justify-between p-2 rounded-lg hover:bg-[#f5f5f5] transition-colors cursor-pointer group"
                        data-testid={`comp-${comp.name.toLowerCase()}`}
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="w-6 h-6 rounded border border-border bg-white flex items-center justify-center shrink-0">
                            <Square className="w-3 h-3 text-muted-foreground" />
                          </div>
                          <div>
                            <div className="text-[12px] font-semibold text-foreground">{comp.name}</div>
                            <div className="text-[10px] text-muted-foreground">{comp.category}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-muted-foreground">{comp.variants}v</span>
                          <button className="opacity-0 group-hover:opacity-100 transition-opacity">
                            <MoreHorizontal className="w-3.5 h-3.5 text-muted-foreground" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Export */}
              {rightTab === 'export' && (
                <motion.div
                  key="export"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="p-4 flex flex-col gap-4"
                >
                  <p className="text-[11px] text-muted-foreground">Select format and scope, then download.</p>

                  <div className="flex flex-col gap-2">
                    {EXPORT_FORMATS.map(fmt => (
                      <button
                        key={fmt.id}
                        onClick={() => setSelectedExport(fmt.id)}
                        className={cn(
                          'flex items-center gap-3 p-3 rounded-xl border text-left transition-all',
                          selectedExport === fmt.id ? 'border-primary/40 bg-primary/5' : 'border-border hover:bg-[#f5f5f5]'
                        )}
                        data-testid={`right-export-${fmt.id}`}
                      >
                        <span className="text-lg">{fmt.icon}</span>
                        <div className="flex-1 min-w-0">
                          <div className="text-[12px] font-semibold text-foreground">{fmt.label}</div>
                          <div className="text-[10px] text-muted-foreground truncate">{fmt.desc}</div>
                        </div>
                        {selectedExport === fmt.id && (
                          <Check className="w-3.5 h-3.5 text-primary shrink-0" />
                        )}
                      </button>
                    ))}
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2 block">Scope</label>
                    <div className="flex flex-col gap-1">
                      {['Current screen only', 'All screens', 'Components only'].map(scope => (
                        <label key={scope} className="flex items-center gap-2.5 py-1.5 cursor-pointer">
                          <div className={cn('w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center', scope === 'Current screen only' ? 'border-primary' : 'border-border')}>
                            {scope === 'Current screen only' && <div className="w-1.5 h-1.5 rounded-full bg-primary" />}
                          </div>
                          <span className="text-[12px] text-foreground">{scope}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <button className="w-full bg-primary text-primary-foreground text-sm font-semibold py-2.5 rounded-xl hover:bg-[#003a3d] transition-colors flex items-center justify-center gap-2" data-testid="button-download">
                    <Download className="w-4 h-4" />
                    Download {selectedExport.toUpperCase()}
                  </button>
                </motion.div>
              )}

            </AnimatePresence>
          </div>
        </div>

      </div>
    </div>
  );
}
