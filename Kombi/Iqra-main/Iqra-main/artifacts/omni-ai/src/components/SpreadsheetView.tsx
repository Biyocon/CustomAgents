import { useState, useRef, useEffect, useCallback, KeyboardEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, Plus, X, Search, ChevronDown, ChevronRight,
  Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight,
  Percent, DollarSign, Minus, Sparkles, Download,
  LayoutGrid, BarChart2, Image, Shapes, Link, MessageSquare,
  Maximize2, Minimize2, Columns, Rows, Filter as FilterIcon,
  Play, RefreshCw, Check, FileText, FolderOpen, Save,
  Undo2, Redo2, Copy, Scissors, Paintbrush, WrapText,
  Merge, Sigma, SortAsc, Trash2,
  Settings as SettingsIcon, Printer, Smartphone, Layers,
  ExternalLink, MoreHorizontal, BookOpen, Cpu, Clock, Database,
  ChevronUp, Folder, Upload as UploadIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';

/* ═══════════════════════════════════════════
   Column & data helpers
═══════════════════════════════════════════ */
const ALL_COLS: string[] = [];
for (let i = 0; i < 26; i++) ALL_COLS.push(String.fromCharCode(65 + i));
for (let i = 0; i < 5; i++) ALL_COLS.push('A' + String.fromCharCode(65 + i));

const NUM_ROWS = 52;

const INITIAL_CELLS: Record<string, string> = {
  'A1':'Product', 'B1':'Q1', 'C1':'Q2', 'D1':'Q3', 'E1':'Q4', 'F1':'Total', 'G1':'YoY %',
  'A2':'OmniAI Pro',   'B2':'124,500', 'C2':'138,200', 'D2':'151,900', 'E2':'167,600', 'F2':'582,200',  'G2':'+34%',
  'A3':'Design Hub',   'B3':'48,200',  'C3':'52,400',  'D3':'61,800',  'E3':'73,200',  'F3':'235,600',  'G3':'+52%',
  'A4':'API Access',   'B4':'29,100',  'C4':'31,800',  'D4':'34,200',  'E4':'37,500',  'F4':'132,600',  'G4':'+29%',
  'A5':'Enterprise',   'B5':'89,000',  'C5':'94,500',  'D5':'108,000', 'E5':'127,000', 'F5':'418,500',  'G5':'+43%',
  'A6':'Total',        'B6':'290,800', 'C6':'316,900', 'D6':'355,900', 'E6':'405,300', 'F6':'1,368,900','G6':'',
};

type RibbonTab = 'Home' | 'Insert' | 'Page Layout' | 'Formulas' | 'Data' | 'View' | 'Settings';
type WorkspaceTab = 'Files' | 'Skills' | 'Templates' | 'Memories' | 'Backups';
type ShortcutsTab = 'Prompt Library' | 'Skills' | 'Tutorials' | 'Chat History';

const MOCK_FILES = [
  { name: 'BKP_v170 1.xlsx',                                      opened: '3/3/2026',  sizeKb: 28.42 },
  { name: 'BKP_v170.xlsx',                                         opened: '3/3/2026',  sizeKb: 28.42 },
  { name: '2026-02-24-sheet.xlsx',                                 opened: '2/24/2026', sizeKb: 13.66 },
  { name: 'Banebyg_K_liste_BBTR_Supportsag_udfyldt_2.xlsx',       opened: '2/16/2026', sizeKb: 12.22 },
  { name: 'empty-sheet.xlsx',                                      opened: '2/15/2026', sizeKb: 8.44  },
  { name: 'empty-sheet_6.xlsx',                                    opened: '11/20/2025',sizeKb: 19.12 },
  { name: 'Evalueringsark til Banedanmark; clean, 20.11.2025.xlsx',opened: '11/20/2025',sizeKb: 431.48},
  { name: 'Evalueringsark til Banedanmark; clean.xlsx',            opened: '11/20/2025',sizeKb: 304.34},
  { name: 'Evalueringsark til Banedanmark; proto.xlsx',            opened: '11/20/2025',sizeKb: 301.34},
];

const MOCK_SKILLS = [
  { id:'s1',  title:'Spreadsheet Cleaner',       desc:'Removes duplicates and normalises data formats',    tags:['Data'],         scope:'personal' as const },
  { id:'s2',  title:'KPI Dashboard Builder',     desc:'Generates KPI summaries from raw sheet data',       tags:['Analytics'],    scope:'default' as const },
  { id:'s3',  title:'SumSheet Builder',          desc:'Creates model summary worksheets automatically',    tags:['Finance'],      scope:'default' as const },
  { id:'s4',  title:'Formula Debugger',          desc:'Identifies and explains broken formulas',           tags:['Dev'],          scope:'personal' as const },
  { id:'s5',  title:'Financial Model Auditor',   desc:'Audits financial models for common errors',         tags:['Finance'],      scope:'default' as const },
  { id:'s6',  title:'Banedanmark Tender Helper', desc:'Structures bids for Banedanmark procurement',       tags:['Tendering'],    scope:'personal' as const },
  { id:'s7',  title:'Forecast Builder',          desc:'Generates 12-month forecasts from assumptions',     tags:['Finance'],      scope:'default' as const },
  { id:'s8',  title:'Scenario Analyzer',         desc:'Runs base/bull/bear scenario analysis',             tags:['Analytics'],    scope:'personal' as const },
  { id:'s9',  title:'Export Formatter',          desc:'Formats sheets for PDF or Excel export',            tags:['Export'],       scope:'default' as const },
  { id:'s10', title:'Data Validation Helper',    desc:'Sets up validation rules and highlights errors',    tags:['Data'],         scope:'personal' as const },
];

const MOCK_TUTORIALS = [
  { id:'t1', title:'Create a model summary worksheet using the sumsheet-builder skill', tags:['Sample Workflows','financial-modeling'], bg:'from-blue-500 to-indigo-600' },
  { id:'t2', title:'Use python to create a KPI dashboard for a model',                 tags:['financial-modeling'],                   bg:'from-green-500 to-teal-600' },
  { id:'t3', title:'Reformat a multi-sheet model into a single worksheet',             tags:['Sample Workflows','financial-modeling'], bg:'from-purple-500 to-violet-600' },
  { id:'t4', title:'How to create a KPI dashboard using Python',                       tags:['financial-modeling'],                   bg:'from-orange-500 to-amber-600' },
  { id:'t5', title:'Refresh / rollforward stale model',                                tags:['Sample Workflows','financial-modeling'], bg:'from-pink-500 to-rose-600' },
  { id:'t6', title:'Auditing using skill',                                             tags:['Onboarding','financial-modeling'],       bg:'from-cyan-500 to-blue-600' },
];

const CHAT_HISTORY = [
  { workbook:'2026-02-24-SHEET.XLSX',                               title:"MASTER PROMPT \u2013 \u201CWBS- og MS Project-planl\xE6gger\u201D (kopi\xE9r direkte til CustomGPT) Du er en spe\u2026", time:'2 months ago' },
  { workbook:'BANEBYG_K_LISTE_BBTR_SUPPORTSAG_UDFYLDT_2.XLSX',      title:'Betinget formatering er ikke korrekt implementeret p\xE5 Prioritet-kolonnen (M2:M50). Baggrundsfar\u2026', time:'2 months ago' },
];

/* ═══════════════════════════════════════════
   Ribbon helpers
═══════════════════════════════════════════ */
function RibbonGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-stretch border-r border-[#e5e7eb] last:border-0 pr-2 mr-1">
      <div className="flex flex-col h-full min-w-0">
        <div className="flex items-center gap-0.5 flex-1 py-1">{children}</div>
        <span className="text-[8.5px] text-[#9ca3af] text-center pb-0.5 leading-none">{label}</span>
      </div>
    </div>
  );
}

function RibbonBtn({ icon: Icon, label, disabled }: { icon: React.ElementType; label?: string; disabled?: boolean }) {
  return (
    <button className={cn('flex flex-col items-center gap-0.5 px-1.5 py-1 rounded hover:bg-[#f3f4f6] transition-colors min-w-[30px]', disabled && 'opacity-40 cursor-not-allowed')} disabled={disabled} title={label}>
      <Icon className="w-4 h-4 text-[#374151]" />
      {label && <span className="text-[9px] text-[#6b7280] whitespace-nowrap leading-none">{label}</span>}
    </button>
  );
}

function RibbonSmall({ icon: Icon, label, active }: { icon: React.ElementType; label: string; active?: boolean }) {
  return (
    <button className={cn('flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium transition-colors', active ? 'bg-[#16a34a14] text-[#16a34a]' : 'text-[#374151] hover:bg-[#f3f4f6]')}>
      <Icon className="w-3 h-3" /> {label}
    </button>
  );
}

function RibbonSelect({ value, options, width = 80 }: { value: string; options: string[]; width?: number }) {
  return (
    <div className="relative" style={{ width }}>
      <select className="w-full appearance-none text-[10px] border border-[#d1d5db] rounded px-1.5 pr-4 py-0.5 bg-white text-[#374151] outline-none focus:ring-1 focus:ring-[#16a34a]/30 cursor-pointer">
        {options.map(o => <option key={o}>{o}</option>)}
      </select>
      <ChevronDown className="absolute right-0.5 top-1/2 -translate-y-1/2 w-2.5 h-2.5 text-[#9ca3af] pointer-events-none" />
    </div>
  );
}

/* ═══════════════════════════════════════════
   Ribbon command areas per tab
═══════════════════════════════════════════ */
function HomeRibbon({ cellFormat, onFormat }: { cellFormat: Record<string,boolean>; onFormat: (k:string) => void }) {
  return (
    <div className="flex items-stretch h-[72px] px-2 gap-1 overflow-x-auto">
      <RibbonGroup label="Clipboard">
        <div className="flex flex-col gap-0.5">
          <RibbonBtn icon={Undo2} label="Undo" />
          <RibbonBtn icon={Redo2} label="Redo" />
        </div>
        <div className="flex flex-col gap-0.5">
          <RibbonBtn icon={Copy} label="Copy" />
          <RibbonBtn icon={Scissors} label="Cut" />
        </div>
        <RibbonBtn icon={Paintbrush} label="Format Painter" />
      </RibbonGroup>

      <RibbonGroup label="Font">
        <div className="flex flex-col gap-0.5">
          <RibbonSelect value="Aptos Narrow" options={['Aptos Narrow','Inter','Arial','Calibri']} width={100} />
          <RibbonSelect value="12" options={['8','9','10','11','12','14','16','18','20','24']} width={50} />
        </div>
        <div className="flex flex-col gap-0.5">
          <div className="flex gap-0.5">
            <button onClick={() => onFormat('bold')} className={cn('w-5 h-5 flex items-center justify-center rounded text-[11px] font-bold transition-colors', cellFormat.bold ? 'bg-[#16a34a14] text-[#16a34a]' : 'hover:bg-[#f3f4f6] text-[#374151]')}><Bold className="w-3 h-3" /></button>
            <button onClick={() => onFormat('italic')} className={cn('w-5 h-5 flex items-center justify-center rounded text-[11px] transition-colors', cellFormat.italic ? 'bg-[#16a34a14] text-[#16a34a]' : 'hover:bg-[#f3f4f6] text-[#374151]')}><Italic className="w-3 h-3" /></button>
            <button onClick={() => onFormat('underline')} className={cn('w-5 h-5 flex items-center justify-center rounded text-[11px] transition-colors', cellFormat.underline ? 'bg-[#16a34a14] text-[#16a34a]' : 'hover:bg-[#f3f4f6] text-[#374151]')}><Underline className="w-3 h-3" /></button>
          </div>
          <div className="flex gap-0.5">
            <button className="w-5 h-5 flex items-center justify-center rounded hover:bg-[#f3f4f6]"><div className="w-3 h-3 border border-[#374151] rounded-sm" /></button>
            <button className="w-5 h-5 flex items-center justify-center rounded hover:bg-[#f3f4f6]"><div className="w-3 h-2 bg-yellow-300 rounded-sm" /></button>
            <button className="w-5 h-5 flex items-center justify-center rounded hover:bg-[#f3f4f6]"><div className="w-3 h-2 bg-red-400 rounded-sm" /></button>
          </div>
        </div>
      </RibbonGroup>

      <RibbonGroup label="Alignment">
        <div className="flex flex-col gap-0.5">
          <div className="flex gap-0.5">
            <button className="w-5 h-5 flex items-center justify-center rounded hover:bg-[#f3f4f6]"><AlignLeft className="w-3 h-3 text-[#374151]" /></button>
            <button className="w-5 h-5 flex items-center justify-center rounded hover:bg-[#f3f4f6]"><AlignCenter className="w-3 h-3 text-[#374151]" /></button>
            <button className="w-5 h-5 flex items-center justify-center rounded hover:bg-[#f3f4f6]"><AlignRight className="w-3 h-3 text-[#374151]" /></button>
          </div>
          <div className="flex gap-0.5">
            <button className="w-5 h-5 flex items-center justify-center rounded hover:bg-[#f3f4f6] text-[9px] text-[#374151]">↑</button>
            <button className="w-5 h-5 flex items-center justify-center rounded hover:bg-[#f3f4f6] text-[9px] text-[#374151]">↕</button>
            <button className="w-5 h-5 flex items-center justify-center rounded hover:bg-[#f3f4f6] text-[9px] text-[#374151]">↓</button>
          </div>
        </div>
        <div className="flex flex-col gap-0.5">
          <button className="flex items-center gap-0.5 px-1 py-0.5 text-[9px] text-[#374151] hover:bg-[#f3f4f6] rounded"><WrapText className="w-3 h-3" /> Wrap</button>
          <button className="flex items-center gap-0.5 px-1 py-0.5 text-[9px] text-[#374151] hover:bg-[#f3f4f6] rounded"><Merge className="w-3 h-3" /> Merge</button>
        </div>
      </RibbonGroup>

      <RibbonGroup label="Number">
        <div className="flex flex-col gap-0.5">
          <RibbonSelect value="General" options={['General','Number','Currency','Percent','Date','Text']} width={80} />
          <div className="flex gap-0.5">
            <button className="w-5 h-5 flex items-center justify-center rounded hover:bg-[#f3f4f6] text-[9px] font-bold text-[#374151]">$</button>
            <button className="w-5 h-5 flex items-center justify-center rounded hover:bg-[#f3f4f6]"><Percent className="w-3 h-3 text-[#374151]" /></button>
            <button className="w-5 h-5 flex items-center justify-center rounded hover:bg-[#f3f4f6] text-[9px] text-[#374151]">,</button>
            <button className="w-5 h-5 flex items-center justify-center rounded hover:bg-[#f3f4f6] text-[9px] text-[#374151]">.0</button>
          </div>
        </div>
      </RibbonGroup>

      <RibbonGroup label="Styles">
        <div className="flex flex-col gap-0.5">
          <button className="flex items-center gap-0.5 px-1.5 py-0.5 text-[9px] text-[#374151] hover:bg-[#f3f4f6] rounded border border-[#e5e7eb]">Conditional Format</button>
          <button className="flex items-center gap-0.5 px-1.5 py-0.5 text-[9px] text-[#374151] hover:bg-[#f3f4f6] rounded border border-[#e5e7eb]">Format Table</button>
          <button className="flex items-center gap-0.5 px-1.5 py-0.5 text-[9px] text-[#374151] hover:bg-[#f3f4f6] rounded border border-[#e5e7eb]">Cell Styles</button>
        </div>
      </RibbonGroup>

      <RibbonGroup label="Cells">
        <div className="flex flex-col gap-0.5">
          <RibbonBtn icon={Plus} label="Insert" />
          <RibbonBtn icon={Trash2} label="Delete" />
          <RibbonBtn icon={SettingsIcon} label="Format" />
        </div>
      </RibbonGroup>

      <RibbonGroup label="Editing">
        <div className="flex flex-col gap-0.5">
          <div className="flex gap-0.5">
            <button className="flex items-center gap-0.5 px-1.5 py-0.5 text-[9px] text-[#374151] hover:bg-[#f3f4f6] rounded border border-[#e5e7eb]"><Sigma className="w-2.5 h-2.5" /> Sum</button>
            <button className="flex items-center gap-0.5 px-1.5 py-0.5 text-[9px] text-[#374151] hover:bg-[#f3f4f6] rounded border border-[#e5e7eb]">Fill</button>
          </div>
          <div className="flex gap-0.5">
            <button className="flex items-center gap-0.5 px-1.5 py-0.5 text-[9px] text-[#374151] hover:bg-[#f3f4f6] rounded border border-[#e5e7eb]">Clear</button>
            <button className="flex items-center gap-0.5 px-1.5 py-0.5 text-[9px] text-[#374151] hover:bg-[#f3f4f6] rounded border border-[#e5e7eb]"><SortAsc className="w-2.5 h-2.5" /> Sort</button>
          </div>
          <button className="flex items-center gap-0.5 px-1.5 py-0.5 text-[9px] text-[#374151] hover:bg-[#f3f4f6] rounded border border-[#e5e7eb]"><Search className="w-2.5 h-2.5" /> Find</button>
        </div>
      </RibbonGroup>
    </div>
  );
}

function InsertRibbon() {
  return (
    <div className="flex items-stretch h-[72px] px-2 gap-1">
      <RibbonGroup label="Tables"><RibbonBtn icon={LayoutGrid} label="Table" /><RibbonBtn icon={LayoutGrid} label="Pivot" /></RibbonGroup>
      <RibbonGroup label="Charts"><RibbonBtn icon={BarChart2} label="Charts" /></RibbonGroup>
      <RibbonGroup label="Illustrations"><RibbonBtn icon={Image} label="Picture" /><RibbonBtn icon={Shapes} label="Shapes" /></RibbonGroup>
      <RibbonGroup label="Links"><RibbonBtn icon={Link} label="Hyperlink" /></RibbonGroup>
      <RibbonGroup label="Comments"><RibbonBtn icon={MessageSquare} label="Comment" /></RibbonGroup>
    </div>
  );
}

function PageLayoutRibbon() {
  return (
    <div className="flex items-stretch h-[72px] px-2 gap-1">
      <RibbonGroup label="Themes">
        <div className="flex flex-col gap-0.5"><RibbonSmall icon={Layers} label="Themes" /><RibbonSmall icon={Paintbrush} label="Colors" /></div>
      </RibbonGroup>
      <RibbonGroup label="Page Setup">
        <div className="flex flex-col gap-0.5">
          <div className="flex gap-0.5"><RibbonSmall icon={Rows} label="Margins" /><RibbonSmall icon={Smartphone} label="Orientation" /></div>
          <div className="flex gap-0.5"><RibbonSmall icon={Printer} label="Print Area" /><RibbonSmall icon={Columns} label="Size" /></div>
        </div>
      </RibbonGroup>
      <RibbonGroup label="Scale to Fit">
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-1 text-[9px] text-[#374151]"><span>Width</span><RibbonSelect value="Auto" options={['Auto','1','2','3']} width={55} /></div>
          <div className="flex items-center gap-1 text-[9px] text-[#374151]"><span>Height</span><RibbonSelect value="Auto" options={['Auto','1','2','3']} width={55} /></div>
          <div className="flex items-center gap-1 text-[9px] text-[#374151]"><span>Scale</span><RibbonSelect value="100%" options={['75%','90%','100%','110%','125%']} width={55} /></div>
        </div>
      </RibbonGroup>
      <RibbonGroup label="Sheet Options">
        <div className="flex flex-col gap-0.5 text-[9px] text-[#374151]">
          <label className="flex items-center gap-1 cursor-pointer"><input type="checkbox" defaultChecked className="w-2.5 h-2.5 accent-[#16a34a]" /> Gridlines View</label>
          <label className="flex items-center gap-1 cursor-pointer"><input type="checkbox" className="w-2.5 h-2.5 accent-[#16a34a]" /> Gridlines Print</label>
          <label className="flex items-center gap-1 cursor-pointer"><input type="checkbox" defaultChecked className="w-2.5 h-2.5 accent-[#16a34a]" /> Headings View</label>
        </div>
      </RibbonGroup>
    </div>
  );
}

function FormulasRibbon() {
  return (
    <div className="flex items-stretch h-[72px] px-2 gap-1">
      <RibbonGroup label="Function Library">
        <div className="flex flex-col gap-0.5">
          <div className="flex gap-0.5"><RibbonSmall icon={Sigma} label="AutoSum" /><RibbonSmall icon={DollarSign} label="Financial" /></div>
          <div className="flex gap-0.5"><RibbonSmall icon={Database} label="Logical" /><RibbonSmall icon={Clock} label="Date & Time" /></div>
          <div className="flex gap-0.5"><RibbonSmall icon={Layers} label="Lookup" /><RibbonSmall icon={Cpu} label="Math" /></div>
        </div>
      </RibbonGroup>
      <RibbonGroup label="Names"><RibbonSmall icon={BookOpen} label="Name Manager" /></RibbonGroup>
      <RibbonGroup label="Formula Auditing">
        <div className="flex flex-col gap-0.5">
          <RibbonSmall icon={Check} label="Show Formulas" />
          <RibbonSmall icon={Search} label="Formula Editor" />
        </div>
      </RibbonGroup>
      <RibbonGroup label="Calculation">
        <div className="flex flex-col gap-0.5">
          <RibbonSmall icon={Play} label="Calculate Now" />
          <RibbonSmall icon={RefreshCw} label="Calc Sheet" />
          <RibbonSmall icon={SettingsIcon} label="Calc Options" />
        </div>
      </RibbonGroup>
    </div>
  );
}

function DataRibbon() {
  return (
    <div className="flex items-stretch h-[72px] px-2 gap-1">
      <RibbonGroup label="Data Binding"><RibbonSmall icon={Link} label="Sheet Binding" /><RibbonSmall icon={ExternalLink} label="Edit Links" /></RibbonGroup>
      <RibbonGroup label="Sort & Filter"><RibbonSmall icon={SortAsc} label="Sort" /><RibbonSmall icon={FilterIcon} label="Filter" /></RibbonGroup>
      <RibbonGroup label="Data Tools">
        <div className="flex flex-col gap-0.5">
          <div className="flex gap-0.5"><RibbonSmall icon={Columns} label="Text Cols" /><RibbonSmall icon={Check} label="Validation" /></div>
          <RibbonSmall icon={RefreshCw} label="Remove Dupes" />
        </div>
      </RibbonGroup>
      <RibbonGroup label="Outline">
        <div className="flex flex-col gap-0.5"><RibbonSmall icon={Layers} label="Group" /><RibbonSmall icon={Minimize2} label="Ungroup" /><RibbonSmall icon={Sigma} label="Subtotal" /></div>
      </RibbonGroup>
    </div>
  );
}

function ViewRibbon() {
  return (
    <div className="flex items-stretch h-[72px] px-2 gap-1">
      <RibbonGroup label="Show/Hide">
        <div className="flex flex-col gap-0.5 text-[9px] text-[#374151]">
          <label className="flex items-center gap-1 cursor-pointer"><input type="checkbox" defaultChecked className="w-2.5 h-2.5 accent-[#16a34a]" /> Row Header</label>
          <label className="flex items-center gap-1 cursor-pointer"><input type="checkbox" defaultChecked className="w-2.5 h-2.5 accent-[#16a34a]" /> Column Header</label>
          <label className="flex items-center gap-1 cursor-pointer"><input type="checkbox" defaultChecked className="w-2.5 h-2.5 accent-[#16a34a]" /> V. Gridlines</label>
          <label className="flex items-center gap-1 cursor-pointer"><input type="checkbox" defaultChecked className="w-2.5 h-2.5 accent-[#16a34a]" /> H. Gridlines</label>
        </div>
      </RibbonGroup>
      <RibbonGroup label="Zoom">
        <div className="flex flex-col gap-0.5"><RibbonSmall icon={Search} label="Zoom" /><RibbonSmall icon={Maximize2} label="100%" /><RibbonSmall icon={Maximize2} label="Zoom to Sel." /></div>
      </RibbonGroup>
      <RibbonGroup label="Viewport">
        <div className="flex flex-col gap-0.5"><RibbonSmall icon={Rows} label="Freeze Panes" /><RibbonSmall icon={Rows} label="Unfreeze" /></div>
      </RibbonGroup>
      <RibbonGroup label="Pane"><RibbonSmall icon={Layers} label="Selection Pane" /></RibbonGroup>
      <RibbonGroup label="Command Palette"><RibbonSmall icon={Search} label="Command Palette" /></RibbonGroup>
    </div>
  );
}

function SettingsRibbon() {
  return (
    <div className="flex items-stretch h-[72px] px-2 gap-1">
      <RibbonGroup label="Spread Settings">
        <div className="flex flex-col gap-0.5 text-[9px] text-[#374151]">
          <label className="flex items-center gap-1 cursor-pointer"><input type="checkbox" defaultChecked className="w-2.5 h-2.5 accent-[#16a34a]" /> Scrollbars</label>
          <label className="flex items-center gap-1 cursor-pointer"><input type="checkbox" defaultChecked className="w-2.5 h-2.5 accent-[#16a34a]" /> Calculation</label>
          <label className="flex items-center gap-1 cursor-pointer"><input type="checkbox" defaultChecked className="w-2.5 h-2.5 accent-[#16a34a]" /> Tab Strip</label>
        </div>
        <RibbonSelect value="General" options={['General','Strict']} width={70} />
      </RibbonGroup>
      <RibbonGroup label="Sheet Settings">
        <div className="flex flex-col gap-0.5 text-[9px] text-[#374151]">
          <label className="flex items-center gap-1 cursor-pointer"><input type="checkbox" defaultChecked className="w-2.5 h-2.5 accent-[#16a34a]" /> Gridlines</label>
          <label className="flex items-center gap-1 cursor-pointer"><input type="checkbox" defaultChecked className="w-2.5 h-2.5 accent-[#16a34a]" /> Headers</label>
        </div>
        <RibbonSelect value="General" options={['General','Compact']} width={70} />
      </RibbonGroup>
    </div>
  );
}

/* ═══════════════════════════════════════════
   Right Panel: Shortcut Assistant
═══════════════════════════════════════════ */
function ShortcutAssistant({ onSwitchWorkspace, onShortcuts }: { onSwitchWorkspace: () => void; onShortcuts: () => void }) {
  const [prompt, setPrompt] = useState('');
  const ACTIONS = ['Automate my Excel work with /skills', 'Build a sales forecast', 'Analyse rent vs buy'];
  return (
    <div className="w-[360px] bg-white border-l border-[#e5e7eb] flex flex-col shrink-0">
      <div className="flex items-center justify-between px-4 pt-4 pb-2 shrink-0">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[17px] font-extrabold text-[#16a34a] tracking-tight uppercase">IqRA
</span>
            <button className="text-[#9ca3af] hover:text-[#374151]"><X className="w-3.5 h-3.5" /></button>
          </div>
          <p className="text-[10px] text-[#9ca3af] mt-0.5">A Fundamental Research Labs Product</p>
          <button className="text-[10px] text-[#16a34a] hover:underline">See what&apos;s new</button>
        </div>
        <button onClick={onSwitchWorkspace} className="flex items-center gap-1 text-[11px] font-semibold text-[#374151] border border-[#e5e7eb] px-2.5 py-1.5 rounded-lg hover:bg-[#f9fafb] transition-colors" data-testid="btn-workspace-toggle">Workspace</button>
      </div>
      {/* Prompt box */}
      <div className="px-4 pb-2 shrink-0">
        <div className="border-2 border-[#16a34a] rounded-xl overflow-hidden">
          <textarea
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
            placeholder="Ask Shortcut anything — use @ for references, / for skills and commands"
            rows={3}
            className="w-full px-3 pt-3 pb-1 text-[12px] text-[#374151] placeholder:text-[#9ca3af] bg-transparent outline-none resize-none leading-relaxed"
            data-testid="shortcut-prompt"
          />
          <div className="flex items-center gap-2 px-3 pb-2">
            <button className="text-[#9ca3af] hover:text-[#374151]"><Layers className="w-3.5 h-3.5" /></button>
            <button className="text-[#9ca3af] hover:text-[#374151]"><ChevronDown className="w-3.5 h-3.5" /></button>
            <div className="relative ml-auto">
              <select className="appearance-none text-[10px] font-semibold text-[#374151] bg-transparent pr-4 outline-none cursor-pointer">
                <option>Opus 4.6 (1M)</option>
                <option>Sonnet 4.5</option>
              </select>
              <ChevronDown className="absolute right-0 top-1/2 -translate-y-1/2 w-2.5 h-2.5 text-[#9ca3af] pointer-events-none" />
            </div>
            <button className={cn('w-6 h-6 rounded-lg flex items-center justify-center transition-colors', prompt ? 'bg-[#16a34a] text-white' : 'bg-[#f3f4f6] text-[#9ca3af]')}>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
        <div className="flex items-center justify-between mt-1.5">
          <button className="flex items-center gap-1 text-[10px] text-[#6b7280] hover:text-[#374151]">Action mode <ChevronDown className="w-2.5 h-2.5" /></button>
          <button className="text-[10px] text-[#6b7280] hover:text-[#374151]" onClick={onShortcuts}>My Shortcuts</button>
        </div>
      </div>
      {/* Quick actions */}
      <div className="px-4 flex flex-col gap-1.5 shrink-0">
        {ACTIONS.map(a => (
          <button key={a} className="flex items-center justify-between w-full text-left text-[11px] text-[#374151] hover:text-[#16a34a] py-1.5 border-b border-[#f3f4f6] transition-colors group">
            <span className="truncate">{a}</span>
            <ChevronRight className="w-3 h-3 text-[#9ca3af] group-hover:text-[#16a34a] shrink-0 ml-2" />
          </button>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   Right Panel: Workspace (dark)
═══════════════════════════════════════════ */
function WorkspacePanel({ onClose, onShortcuts }: { onClose: () => void; onShortcuts: () => void }) {
  const [tab, setTab] = useState<WorkspaceTab>('Skills');
  const [skillScope, setSkillScope] = useState<'Personal'|'Default'>('Personal');
  const [skillSearch, setSkillSearch] = useState('');
  const TABS: WorkspaceTab[] = ['Files','Skills','Templates','Memories','Backups'];

  const filteredSkills = MOCK_SKILLS.filter(s =>
    (skillScope === 'Personal' ? s.scope === 'personal' : true) &&
    (!skillSearch || s.title.toLowerCase().includes(skillSearch.toLowerCase()))
  );

  return (
    <div className="w-[380px] bg-[#3a3a39] text-white border-l border-[#4a4a48] flex flex-col shrink-0 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 shrink-0">
        <span className="text-[13px] font-bold">Workspace</span>
        <div className="flex items-center gap-1">
          <button className="p-1.5 text-[#9ca3af] hover:text-white transition-colors"><RefreshCw className="w-3.5 h-3.5" /></button>
          <button onClick={onClose} className="p-1.5 text-[#9ca3af] hover:text-white transition-colors"><X className="w-3.5 h-3.5" /></button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#4a4a48] px-4 shrink-0 gap-3">
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)} className={cn('text-[11px] font-semibold pb-2 border-b-2 transition-colors whitespace-nowrap', tab === t ? 'border-[#16a34a] text-white' : 'border-transparent text-[#9ca3af] hover:text-white')}>{t}</button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-3">
        {tab === 'Skills' && (
          <div className="flex flex-col gap-3">
            <button onClick={onShortcuts} className="w-full flex items-center justify-center gap-2 py-2 border border-[#16a34a] text-[11px] font-semibold text-[#16a34a] rounded-lg hover:bg-[#16a34a14] transition-colors">
              <Plus className="w-3.5 h-3.5" /> Create or Edit Skills with /Skill-Studio
            </button>
            <div className="flex rounded-lg border border-[#4a4a48] overflow-hidden">
              {(['Personal','Default'] as const).map(s => (
                <button key={s} onClick={() => setSkillScope(s)} className={cn('flex-1 py-1.5 text-[11px] font-semibold transition-colors', skillScope === s ? 'bg-[#4a4a48] text-white' : 'text-[#9ca3af] hover:text-white')}>{s}</button>
              ))}
            </div>
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-[#9ca3af] pointer-events-none" />
              <input value={skillSearch} onChange={e => setSkillSearch(e.target.value)} placeholder="Search skills..." className="w-full pl-7 pr-3 py-1.5 bg-[#2f2f2e] border border-[#4a4a48] rounded-lg text-[11px] text-white placeholder:text-[#6b7280] outline-none focus:border-[#16a34a]/50" />
            </div>
            {filteredSkills.length > 0 ? filteredSkills.map(sk => (
              <div key={sk.id} className="flex items-start gap-3 p-3 bg-[#2f2f2e] rounded-xl border border-[#4a4a48] hover:border-[#16a34a]/30 transition-colors">
                <div className="w-7 h-7 rounded-lg bg-[#16a34a14] flex items-center justify-center shrink-0"><Sparkles className="w-3.5 h-3.5 text-[#16a34a]" /></div>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-semibold text-white truncate">{sk.title}</p>
                  <p className="text-[10px] text-[#9ca3af] mt-0.5 leading-relaxed">{sk.desc}</p>
                  <div className="flex gap-1 mt-1.5">{sk.tags.map(t => <span key={t} className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-[#16a34a14] text-[#16a34a]">{t}</span>)}</div>
                </div>
              </div>
            )) : (
              <p className="text-[12px] text-[#6b7280] text-center py-8">No personal skills yet</p>
            )}
          </div>
        )}
        {tab !== 'Skills' && (
          <p className="text-[12px] text-[#6b7280] text-center py-8">{tab} — coming soon</p>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   Open File Modal
═══════════════════════════════════════════ */
function OpenFileModal({ onClose, onOpen }: { onClose: () => void; onOpen: (name: string) => void }) {
  const [search, setSearch] = useState('');
  const filtered = MOCK_FILES.filter(f => !search || f.name.toLowerCase().includes(search.toLowerCase()));
  useEffect(() => {
    const h = (e: globalThis.KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', h);
    return () => document.removeEventListener('keydown', h);
  }, [onClose]);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-6" onClick={onClose} data-testid="modal-open-file">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-[900px] max-h-[88vh] flex flex-col overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-8 py-6 border-b border-[#e5e7eb] shrink-0">
          <h2 className="text-[28px] font-bold text-[#111827]">Open File</h2>
          <button onClick={onClose} className="text-[#9ca3af] hover:text-[#374151] transition-colors"><X className="w-5 h-5" /></button>
        </div>
        <div className="flex items-center justify-between px-8 py-4 border-b border-[#e5e7eb] shrink-0">
          <button className="flex items-center gap-2 px-4 py-2 border border-[#e5e7eb] text-[12px] font-semibold text-[#374151] rounded-lg hover:bg-[#f9fafb] transition-colors"><FolderOpen className="w-4 h-4" /> Open File from Computer</button>
          <div className="flex items-center gap-4">
            <span className="text-[12px] text-[#6b7280]">{MOCK_FILES.length} files in history</span>
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#9ca3af] pointer-events-none" />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search files..." className="pl-8 pr-4 py-2 border border-[#e5e7eb] rounded-lg text-[12px] text-[#374151] placeholder:text-[#9ca3af] outline-none focus:ring-2 focus:ring-[#16a34a]/20 w-52" />
            </div>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto px-8 py-4">
          <div className="border border-[#e5e7eb] rounded-xl overflow-hidden">
            <table className="w-full">
              <thead><tr className="bg-[#f9fafb] border-b border-[#e5e7eb]">
                <th className="text-left px-4 py-3 text-[11px] font-bold text-[#6b7280] uppercase tracking-wider">File Name</th>
                <th className="text-left px-4 py-3 text-[11px] font-bold text-[#6b7280] uppercase tracking-wider">Last Opened</th>
                <th className="text-left px-4 py-3 text-[11px] font-bold text-[#6b7280] uppercase tracking-wider">Size</th>
                <th className="w-24" />
              </tr></thead>
              <tbody>
                {filtered.map((f, i) => (
                  <tr key={i} className="border-b border-[#f3f4f6] last:border-0 hover:bg-[#f9fafb] transition-colors">
                    <td className="px-4 py-3 flex items-center gap-3">
                      <Folder className="w-4 h-4 text-[#9ca3af] shrink-0" />
                      <span className="text-[12px] font-medium text-[#111827] truncate max-w-[320px]">{f.name}</span>
                    </td>
                    <td className="px-4 py-3 text-[12px] text-[#6b7280]">Opened {f.opened}</td>
                    <td className="px-4 py-3 text-[12px] text-[#6b7280]">{f.sizeKb.toFixed(2)} kB</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 justify-end">
                        <button onClick={() => { onOpen(f.name); onClose(); }} className="flex items-center gap-1 px-3 py-1.5 text-[11px] font-semibold text-[#374151] border border-[#e5e7eb] rounded-lg hover:bg-[#f9fafb] transition-colors">
                          <ExternalLink className="w-3 h-3" /> Open
                        </button>
                        <button className="p-1.5 text-[#9ca3af] hover:text-[#374151] border border-[#e5e7eb] rounded-lg hover:bg-[#f9fafb] transition-colors"><ChevronDown className="w-3 h-3" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   New File Modal
═══════════════════════════════════════════ */
function NewFileModal({ onClose, onCreate }: { onClose: () => void; onCreate: () => void }) {
  useEffect(() => {
    const h = (e: globalThis.KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', h);
    return () => document.removeEventListener('keydown', h);
  }, [onClose]);
  const CARDS = [
    { title:'Open File From Computer', desc:'Upload your existing spreadsheet to work on with Shortcut', bg:'from-blue-300 via-cyan-400 to-blue-500', iconBg:'#3b82f6' },
    { title:'View Templates', desc:'Use your own templates or browse our examples', bg:'from-orange-300 via-pink-400 to-yellow-400', iconBg:'#f97316' },
    { title:'Quick Start', desc:'Create a blank spreadsheet or generate one with AI', bg:'from-green-300 via-emerald-400 to-teal-500', iconBg:'#16a34a' },
  ];
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-6" onClick={onClose} data-testid="modal-new-file">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-[900px] overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-8 py-6 border-b border-[#e5e7eb]">
          <h2 className="text-[28px] font-bold text-[#111827]">New File</h2>
          <button onClick={onClose} className="text-[#9ca3af] hover:text-[#374151] transition-colors"><X className="w-5 h-5" /></button>
        </div>
        <div className="px-8 py-4">
          <p className="text-[13px] text-[#6b7280]">
            Choose an option below, or{' '}
            <button onClick={onCreate} className="font-semibold text-[#374151] underline underline-offset-2 hover:text-[#16a34a] transition-colors">start from scratch →</button>
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 px-8 pb-8">
          {CARDS.map(card => (
            <button key={card.title} onClick={onCreate} className="group text-left flex flex-col rounded-2xl border border-[#e5e7eb] overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 bg-white">
              <div className={`h-40 bg-gradient-to-br ${card.bg} flex items-center justify-center`}>
                <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <Folder className="w-7 h-7 text-white" />
                </div>
              </div>
              <div className="flex items-end justify-between p-5">
                <div className="flex-1 pr-3">
                  <p className="text-[14px] font-bold text-[#111827] mb-1">{card.title}</p>
                  <p className="text-[11px] text-[#6b7280] leading-relaxed">{card.desc}</p>
                </div>
                <div className="w-9 h-9 rounded-xl bg-[#111827] group-hover:bg-[#374151] flex items-center justify-center shrink-0 transition-colors">
                  <ChevronRight className="w-5 h-5 text-white" />
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   My Shortcuts Modal
═══════════════════════════════════════════ */
function MyShortcutsModal({ onClose }: { onClose: () => void }) {
  useEffect(() => {
    const h = (e: globalThis.KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', h);
    return () => document.removeEventListener('keydown', h);
  }, [onClose]);
  const [tab, setTab] = useState<ShortcutsTab>('Prompt Library');
  const [promptTitle, setPromptTitle] = useState('');
  const [promptText, setPromptText] = useState('');
  const [chatSearch, setChatSearch] = useState('');
  const TABS: ShortcutsTab[] = ['Prompt Library', 'Skills', 'Tutorials', 'Chat History'];

  const grouped = CHAT_HISTORY.reduce<Record<string, typeof CHAT_HISTORY>>((acc, c) => {
    (acc[c.workbook] ??= []).push(c); return acc;
  }, {});

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-6" onClick={onClose} data-testid="modal-shortcuts">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-[700px] h-[85vh] flex flex-col overflow-hidden" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#e5e7eb] shrink-0">
          <h2 className="text-[20px] font-bold text-[#111827]">My Shortcuts</h2>
          <button onClick={onClose} className="text-[#9ca3af] hover:text-[#374151] transition-colors"><X className="w-5 h-5" /></button>
        </div>
        {/* Tabs */}
        <div className="flex border-b border-[#e5e7eb] px-6 shrink-0 gap-5">
          {TABS.map(t => (
            <button key={t} onClick={() => setTab(t)} className={cn('text-[12px] font-semibold py-3 border-b-2 transition-colors', tab === t ? 'border-[#111827] text-[#111827]' : 'border-transparent text-[#9ca3af] hover:text-[#374151]')}>
              {t}{t === 'Skills' ? ' 10' : ''}
            </button>
          ))}
        </div>
        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {/* Prompt Library */}
          {tab === 'Prompt Library' && (
            <div className="px-6 py-5">
              <p className="text-[11px] text-[#6b7280] mb-4">Type / to invoke in chat. Quick-access prompts you can reuse across conversations.</p>
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[13px] font-bold text-[#111827]">New Prompt</span>
                  <div className="flex gap-2">
                    <button onClick={() => { setPromptTitle(''); setPromptText(''); }} className="text-[11px] font-semibold text-[#6b7280] hover:text-[#374151] transition-colors">Cancel</button>
                    <button disabled={!promptText} className="text-[11px] font-bold px-3 py-1.5 bg-[#16a34a] text-white rounded-lg hover:bg-[#15803d] transition-colors disabled:opacity-40 disabled:cursor-not-allowed">Create</button>
                  </div>
                </div>
                <div className="flex flex-col gap-3">
                  <div>
                    <label className="text-[10px] font-semibold text-[#6b7280] uppercase tracking-wide">Title (optional)</label>
                    <input value={promptTitle} onChange={e => setPromptTitle(e.target.value)} placeholder="Banedanmark" className="mt-1 w-full border border-[#e5e7eb] rounded-lg px-3 py-2 text-[12px] text-[#374151] placeholder:text-[#d1d5db] outline-none focus:ring-2 focus:ring-[#16a34a]/20" data-testid="prompt-title-input" />
                  </div>
                  <div>
                    <label className="text-[10px] font-semibold text-[#6b7280] uppercase tracking-wide">Prompt</label>
                    <textarea value={promptText} onChange={e => setPromptText(e.target.value)} placeholder="Test" rows={4} className="mt-1 w-full border border-[#e5e7eb] rounded-lg px-3 py-2 text-[12px] text-[#374151] placeholder:text-[#d1d5db] outline-none focus:ring-2 focus:ring-[#16a34a]/20 resize-none" data-testid="prompt-text-input" />
                  </div>
                </div>
              </div>
            </div>
          )}
          {/* Skills */}
          {tab === 'Skills' && (
            <div className="px-6 py-5 grid grid-cols-1 gap-3">
              {MOCK_SKILLS.map(sk => (
                <div key={sk.id} className="flex items-start gap-3 p-3 border border-[#e5e7eb] rounded-xl hover:bg-[#f9fafb] transition-colors">
                  <div className="w-8 h-8 rounded-xl bg-[#16a34a14] flex items-center justify-center shrink-0"><Sparkles className="w-4 h-4 text-[#16a34a]" /></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] font-semibold text-[#111827]">{sk.title}</p>
                    <p className="text-[11px] text-[#6b7280] mt-0.5">{sk.desc}</p>
                    <div className="flex gap-1.5 mt-1.5">
                      {sk.tags.map(t => <span key={t} className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-[#f0fdf4] text-[#16a34a]">{t}</span>)}
                      <span className={cn('text-[9px] font-bold px-1.5 py-0.5 rounded-full', sk.scope === 'personal' ? 'bg-[#eff6ff] text-[#3b82f6]' : 'bg-[#f9fafb] text-[#6b7280]')}>{sk.scope}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          {/* Tutorials */}
          {tab === 'Tutorials' && (
            <div className="px-6 py-5">
              <p className="text-[11px] text-[#6b7280] mb-4">Step-by-step tutorials you can open and follow in web replay.</p>
              <div className="mb-3"><span className="text-[11px] font-bold text-[#374151]">Official</span></div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {MOCK_TUTORIALS.map(t => (
                  <button key={t.id} className="group text-left flex flex-col border border-[#e5e7eb] rounded-2xl overflow-hidden hover:shadow-md transition-all">
                    <div className={`h-28 bg-gradient-to-br ${t.bg} flex items-end p-3`}>
                      <div className="bg-white/20 rounded-lg px-2 py-1"><p className="text-[9px] font-bold text-white uppercase tracking-wide">Spreadsheet</p></div>
                    </div>
                    <div className="p-3">
                      <div className="flex items-start gap-2 mb-2">
                        <FileText className="w-3.5 h-3.5 text-[#6b7280] shrink-0 mt-0.5" />
                        <p className="text-[11px] font-semibold text-[#374151] leading-snug">{t.title}</p>
                      </div>
                      <div className="flex gap-1 flex-wrap">{t.tags.map(tag => <span key={tag} className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-[#f3f4f6] text-[#6b7280]">{tag}</span>)}</div>
                    </div>
                  </button>
                ))}
              </div>
              <button className="mt-4 text-[11px] font-semibold text-[#16a34a] hover:underline">Explore all tutorials →</button>
            </div>
          )}
          {/* Chat History */}
          {tab === 'Chat History' && (
            <div className="px-6 py-5">
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#9ca3af] pointer-events-none" />
                <input value={chatSearch} onChange={e => setChatSearch(e.target.value)} placeholder="Search conversations..." className="w-full pl-9 pr-4 py-2.5 border border-[#e5e7eb] rounded-xl text-[12px] text-[#374151] placeholder:text-[#9ca3af] outline-none focus:ring-2 focus:ring-[#16a34a]/20" data-testid="chat-history-search" />
              </div>
              {Object.entries(grouped).map(([wb, convs]) => {
                const filtered = convs.filter(c => !chatSearch || c.title.toLowerCase().includes(chatSearch.toLowerCase()));
                if (!filtered.length) return null;
                return (
                  <div key={wb} className="mb-4">
                    <p className="text-[10px] font-bold text-[#9ca3af] uppercase tracking-wider mb-2">{wb}</p>
                    {filtered.map((c, i) => (
                      <button key={i} className="flex items-center gap-3 w-full text-left py-2.5 border-b border-[#f3f4f6] last:border-0 hover:bg-[#f9fafb] -mx-2 px-2 rounded-lg transition-colors group">
                        <ChevronRight className="w-3.5 h-3.5 text-[#9ca3af] group-hover:text-[#374151] shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-[11px] font-medium text-[#374151] truncate">{c.title}</p>
                          <p className="text-[10px] text-[#9ca3af] mt-0.5">{c.time}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                );
              })}
              {chatSearch && Object.values(grouped).every(convs => !convs.some(c => c.title.toLowerCase().includes(chatSearch.toLowerCase()))) && (
                <p className="text-[12px] text-[#9ca3af] text-center py-8">No conversations match</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   Spreadsheet Grid
═══════════════════════════════════════════ */
function SpreadsheetGrid({
  cells, activeCell, onCellClick, onCellChange, zoom,
}: {
  cells: Record<string,string>;
  activeCell: string;
  onCellClick: (col: string, row: number) => void;
  onCellChange: (key: string, val: string) => void;
  zoom: number;
}) {
  const [editingCell, setEditingCell] = useState<string | null>(null);
  const [editVal, setEditVal] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (editingCell && inputRef.current) inputRef.current.focus();
    else if (!editingCell && containerRef.current) containerRef.current.focus();
  }, [editingCell]);

  const parseCell = useCallback((cell: string) => {
    const m = cell.match(/^([A-Z]+)(\d+)$/);
    if (!m) return null;
    return { col: m[1], row: parseInt(m[2]) };
  }, []);

  const moveCell = useCallback((dc: number, dr: number) => {
    const p = parseCell(activeCell);
    if (!p) return;
    const ci = ALL_COLS.indexOf(p.col);
    const newCi = Math.max(0, Math.min(ALL_COLS.length - 1, ci + dc));
    const newRow = Math.max(1, Math.min(NUM_ROWS, p.row + dr));
    onCellClick(ALL_COLS[newCi], newRow);
  }, [activeCell, onCellClick, parseCell]);

  const commitEdit = useCallback(() => {
    if (editingCell) { onCellChange(editingCell, editVal); setEditingCell(null); }
  }, [editingCell, editVal, onCellChange]);

  const startEdit = (key: string, initialVal?: string) => {
    setEditingCell(key);
    setEditVal(initialVal !== undefined ? initialVal : (cells[key] ?? ''));
  };

  const handleGridKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (editingCell) return;
    switch (e.key) {
      case 'ArrowUp':    e.preventDefault(); moveCell(0, -1); break;
      case 'ArrowDown':  e.preventDefault(); moveCell(0,  1); break;
      case 'ArrowLeft':  e.preventDefault(); moveCell(-1, 0); break;
      case 'ArrowRight': e.preventDefault(); moveCell( 1, 0); break;
      case 'Tab':        e.preventDefault(); moveCell(e.shiftKey ? -1 : 1, 0); break;
      case 'Enter':      e.preventDefault(); moveCell(0, 1); break;
      case 'F2':         e.preventDefault(); startEdit(activeCell); break;
      case 'Delete':
      case 'Backspace':  e.preventDefault(); onCellChange(activeCell, ''); break;
      default:
        if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
          startEdit(activeCell, e.key);
        }
    }
  };

  const handleCellInputKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter')  { e.preventDefault(); commitEdit(); moveCell(0, 1); }
    if (e.key === 'Tab')    { e.preventDefault(); commitEdit(); moveCell(e.shiftKey ? -1 : 1, 0); }
    if (e.key === 'Escape') { setEditingCell(null); }
  };

  const COL_W = 100;
  const ROW_H = 21;
  const ROW_HDR_W = 40;

  const scale = zoom / 100;

  return (
    <div
      ref={containerRef}
      tabIndex={0}
      onKeyDown={handleGridKeyDown}
      className="flex-1 overflow-auto bg-white outline-none"
      style={{ fontSize: `${scale * 11}px` }}
    >
      <div style={{ width: Math.max((ALL_COLS.length + 1) * COL_W + ROW_HDR_W, 800) }}>
        {/* Column header row */}
        <div className="flex sticky top-0 z-10 bg-[#f0f0f0] border-b border-[#d1d5db]">
          <div style={{ width: ROW_HDR_W, minWidth: ROW_HDR_W, height: ROW_H }} className="border-r border-[#d1d5db] bg-[#e8e8e8] shrink-0" />
          {ALL_COLS.map(col => {
            const isActive = activeCell.startsWith(col) && activeCell.replace(col,'') && !isNaN(Number(activeCell.replace(col,'')));
            return (
              <div key={col} style={{ width: COL_W, minWidth: COL_W, height: ROW_H }} className={cn('border-r border-[#d1d5db] flex items-center justify-center text-[10px] font-bold shrink-0', isActive ? 'bg-[#16a34a18] text-[#16a34a]' : 'text-[#6b7280]')}>
                {col}
              </div>
            );
          })}
        </div>

        {/* Data rows */}
        {Array.from({ length: NUM_ROWS }, (_, ri) => {
          const rowNum = ri + 1;
          const rowActive = parseInt(activeCell.replace(/[A-Z]+/,'')) === rowNum;
          return (
            <div key={rowNum} className="flex border-b border-[#e5e7eb]">
              <div style={{ width: ROW_HDR_W, minWidth: ROW_HDR_W, height: ROW_H }} className={cn('border-r border-[#d1d5db] flex items-center justify-center text-[10px] font-medium select-none shrink-0', rowActive ? 'bg-[#16a34a18] text-[#16a34a] font-bold' : 'bg-[#f7f7f7] text-[#6b7280]')}>
                {rowNum}
              </div>
              {ALL_COLS.map((col, ci) => {
                const key = `${col}${rowNum}`;
                const isActive = activeCell === key;
                const isEditing = editingCell === key;
                const val = cells[key] ?? '';
                const isHeader = rowNum === 1 && !!val;
                const isTotal = (rowNum === 6 || col === 'A') && rowNum > 1 && rowNum <= 6;
                return (
                  <div
                    key={col}
                    style={{ width: COL_W, minWidth: COL_W, height: ROW_H }}
                    onClick={() => { onCellClick(col, rowNum); setEditingCell(null); containerRef.current?.focus(); }}
                    onDoubleClick={() => startEdit(key)}
                    className={cn(
                      'border-r border-[#e5e7eb] px-1.5 overflow-hidden cursor-cell select-none shrink-0 flex items-center relative',
                      isActive ? 'outline outline-2 outline-[#16a34a] outline-offset-[-1px] bg-[#16a34a05] z-[1]' : 'hover:bg-[#f8fafb]',
                      isHeader ? 'font-bold bg-[#f7f7f7] text-[#111827]' : '',
                      isTotal && !isHeader ? 'font-semibold text-[#111827] bg-[#f9fafb]' : '',
                      !isHeader && !isTotal ? 'text-[#374151]' : '',
                    )}
                    data-testid={`cell-${key}`}
                  >
                    {isEditing ? (
                      <input
                        ref={inputRef}
                        value={editVal}
                        onChange={e => setEditVal(e.target.value)}
                        onBlur={commitEdit}
                        onKeyDown={handleCellInputKeyDown}
                        className="absolute inset-0 px-1.5 text-[inherit] outline-none bg-white z-10"
                      />
                    ) : (
                      <span className="truncate text-[inherit] leading-none">{val}</span>
                    )}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   Root SpreadsheetView
═══════════════════════════════════════════ */
export function SpreadsheetView({ onBack }: { onBack: () => void }) {
  const [ribbonTab, setRibbonTab] = useState<RibbonTab>('Home');
  const [cells, setCells] = useState<Record<string,string>>(INITIAL_CELLS);
  const [activeCell, setActiveCell] = useState('A1');
  const [cellFormats, setCellFormats] = useState<Record<string,Record<string,boolean>>>({});
  const [zoom, setZoom] = useState(100);
  const [filename, setFilename] = useState('empty-sheet.xlsx');
  const [panelMode, setPanelMode] = useState<'shortcut'|'workspace'|'closed'>('shortcut');
  const [openFileModal, setOpenFileModal] = useState(false);
  const [newFileModal, setNewFileModal] = useState(false);
  const [shortcutsModal, setShortcutsModal] = useState(false);
  const [exported, setExported] = useState(false);

  const RIBBON_TABS: RibbonTab[] = ['Home','Insert','Page Layout','Formulas','Data','View','Settings'];

  const activeFormat = cellFormats[activeCell] ?? {};

  const handleFormat = (key: string) => {
    setCellFormats(prev => ({
      ...prev,
      [activeCell]: { ...(prev[activeCell] ?? {}), [key]: !(prev[activeCell]?.[key] ?? false) }
    }));
  };

  const handleCellClick = (col: string, row: number) => setActiveCell(`${col}${row}`);

  const handleCellChange = (key: string, val: string) => setCells(prev => ({ ...prev, [key]: val }));

  const formulaVal = cells[activeCell] ?? '';

  const handleExport = () => { setExported(true); setTimeout(() => setExported(false), 2000); };

  const colName = activeCell.match(/^[A-Z]+/)?.[0] ?? 'A';
  const rowName = activeCell.match(/\d+/)?.[0] ?? '1';

  return (
    <div className="flex flex-col h-full overflow-hidden bg-white" data-testid="spreadsheet-view">
      {/* ── Top file bar ── */}
      <div className="flex items-center h-[38px] bg-white border-b border-[#e5e7eb] px-3 gap-2 shrink-0">
        <button onClick={onBack} className="p-1.5 text-[#6b7280] hover:text-[#374151] transition-colors" title="Back to Apps"><ArrowLeft className="w-3.5 h-3.5" /></button>
        <div className="h-4 w-px bg-[#e5e7eb]" />
        <button onClick={() => setOpenFileModal(true)} className="flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-semibold text-[#374151] border border-[#e5e7eb] rounded-md hover:bg-[#f9fafb] transition-colors" data-testid="btn-open-file"><FolderOpen className="w-3 h-3" /> Open File</button>
        <button onClick={() => setNewFileModal(true)} className="flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-semibold text-[#374151] border border-[#e5e7eb] rounded-md hover:bg-[#f9fafb] transition-colors" data-testid="btn-new-file"><Plus className="w-3 h-3" /> New File</button>
        <button onClick={handleExport} className="flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-semibold text-[#374151] border border-[#e5e7eb] rounded-md hover:bg-[#f9fafb] transition-colors" data-testid="btn-export-file">
          {exported ? <><Check className="w-3 h-3 text-[#16a34a]" /> Exported!</> : <><Download className="w-3 h-3" /> Export File</>}
        </button>
        <div className="flex-1 flex justify-center">
          <input value={filename} onChange={e => setFilename(e.target.value)} className="text-[11px] font-bold text-[#374151] text-center bg-transparent outline-none border-b border-transparent hover:border-[#e5e7eb] focus:border-[#16a34a]/40 transition-colors w-40" data-testid="filename-input" />
        </div>
        <div className="flex items-center gap-1">
          <button className="px-2 py-1 text-[10px] font-semibold text-[#6b7280] hover:bg-[#f3f4f6] rounded transition-colors">Pro Tips</button>
          <button className="px-2 py-1 text-[10px] font-semibold text-[#6b7280] hover:bg-[#f3f4f6] rounded transition-colors">Set AI Rules</button>
          <button className="px-2 py-1 text-[10px] font-semibold text-[#6b7280] border border-[#e5e7eb] rounded hover:bg-[#f3f4f6] transition-colors flex items-center gap-0.5">Add-Ins <ChevronDown className="w-2.5 h-2.5" /></button>
          <button className="px-2 py-1 text-[10px] font-semibold text-[#374151] bg-[#f3f4f6] border border-[#e5e7eb] rounded hover:bg-[#e5e7eb] transition-colors">Account</button>
          <button
            onClick={() => setPanelMode(p => p === 'closed' ? 'shortcut' : 'closed')}
            className={cn('px-2 py-1 text-[10px] font-semibold border rounded transition-colors', panelMode !== 'closed' ? 'bg-[#16a34a14] border-[#16a34a]/30 text-[#16a34a]' : 'text-[#6b7280] border-[#e5e7eb] hover:bg-[#f3f4f6]')}
            data-testid="btn-toggle-workspace"
          >Workspace</button>
        </div>
      </div>

      {/* ── Ribbon tabs ── */}
      <div className="flex border-b border-[#e5e7eb] bg-white px-2 gap-0.5 shrink-0">
        {RIBBON_TABS.map(t => (
          <button key={t} onClick={() => setRibbonTab(t)} className={cn('px-3 py-1.5 text-[11px] font-semibold transition-colors border-b-2', ribbonTab === t ? 'border-[#16a34a] text-[#16a34a]' : 'border-transparent text-[#374151] hover:text-[#111827] hover:bg-[#f9fafb]')} data-testid={`ribbon-tab-${t.toLowerCase().replace(' ','-')}`}>{t}</button>
        ))}
      </div>

      {/* ── Ribbon command area ── */}
      <div className="border-b border-[#e5e7eb] bg-white shrink-0 overflow-x-auto">
        {ribbonTab === 'Home'        && <HomeRibbon cellFormat={activeFormat} onFormat={handleFormat} />}
        {ribbonTab === 'Insert'      && <InsertRibbon />}
        {ribbonTab === 'Page Layout' && <PageLayoutRibbon />}
        {ribbonTab === 'Formulas'    && <FormulasRibbon />}
        {ribbonTab === 'Data'        && <DataRibbon />}
        {ribbonTab === 'View'        && <ViewRibbon />}
        {ribbonTab === 'Settings'    && <SettingsRibbon />}
      </div>

      {/* ── Formula bar ── */}
      <div className="flex items-center h-[30px] border-b border-[#e5e7eb] bg-white shrink-0 gap-2 px-2">
        <div className="flex items-center gap-1.5 shrink-0">
          <input value={activeCell} readOnly className="w-[52px] text-center text-[11px] font-bold text-[#374151] border border-[#e5e7eb] rounded px-1 py-0.5 bg-white outline-none" data-testid="name-box" />
          <div className="h-4 w-px bg-[#e5e7eb]" />
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <button className="text-[#9ca3af] hover:text-[#374151] text-[11px]">✕</button>
          <button className="text-[#9ca3af] hover:text-[#16a34a] text-[11px]">✓</button>
          <span className="text-[10px] font-bold text-[#9ca3af] italic">fx</span>
          <div className="h-4 w-px bg-[#e5e7eb]" />
        </div>
        <input
          value={formulaVal}
          onChange={e => handleCellChange(activeCell, e.target.value)}
          className="flex-1 text-[11px] text-[#374151] bg-transparent outline-none placeholder:text-[#9ca3af]"
          placeholder="Value or formula…"
          data-testid="formula-bar"
        />
      </div>

      {/* ── Main area: grid + panel ── */}
      <div className="flex-1 flex overflow-hidden min-h-0">
        {/* Grid */}
        <div className="flex-1 flex flex-col overflow-hidden min-w-0">
          <SpreadsheetGrid cells={cells} activeCell={activeCell} onCellClick={handleCellClick} onCellChange={handleCellChange} zoom={zoom} />

          {/* ── Bottom: sheet tabs + status ── */}
          <div className="flex items-center h-[26px] border-t border-[#e5e7eb] bg-[#f7f7f7] px-3 shrink-0">
            <button className="flex items-center gap-1 px-3 py-0.5 text-[10px] font-bold border-t-2 border-[#16a34a] bg-white text-[#16a34a] mr-1 -mt-px rounded-t">Sheet1</button>
            <button className="w-5 h-5 flex items-center justify-center text-[#9ca3af] hover:text-[#374151] hover:bg-[#e5e7eb] rounded transition-colors"><Plus className="w-3 h-3" /></button>
            <div className="flex-1" />
            <span className="text-[10px] text-[#9ca3af] mr-4">Ready</span>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-[#6b7280]">{zoom}%</span>
              <input type="range" min={50} max={200} step={10} value={zoom} onChange={e => setZoom(Number(e.target.value))} className="w-20 accent-[#16a34a]" data-testid="zoom-slider" />
              <span className="text-[10px] text-[#6b7280]">─</span>
            </div>
          </div>
        </div>

        {/* Right panel */}
        <AnimatePresence>
          {panelMode === 'shortcut' && (
            <motion.div key="shortcut" initial={{ x: 360, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 360, opacity: 0 }} transition={{ duration: 0.2, ease: [0.16,1,0.3,1] }} className="flex shrink-0">
              <ShortcutAssistant onSwitchWorkspace={() => setPanelMode('workspace')} onShortcuts={() => setShortcutsModal(true)} />
            </motion.div>
          )}
          {panelMode === 'workspace' && (
            <motion.div key="workspace" initial={{ x: 380, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 380, opacity: 0 }} transition={{ duration: 0.2, ease: [0.16,1,0.3,1] }} className="flex shrink-0">
              <WorkspacePanel onClose={() => setPanelMode('shortcut')} onShortcuts={() => setShortcutsModal(true)} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {openFileModal && <OpenFileModal onClose={() => setOpenFileModal(false)} onOpen={name => setFilename(name)} />}
        {newFileModal && <NewFileModal onClose={() => setNewFileModal(false)} onCreate={() => { setCells({}); setActiveCell('A1'); setFilename('new-sheet.xlsx'); setNewFileModal(false); }} />}
        {shortcutsModal && <MyShortcutsModal onClose={() => setShortcutsModal(false)} />}
      </AnimatePresence>
    </div>
  );
}
