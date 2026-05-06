import { Save, Eye, Download, Moon, Sun, Search } from 'lucide-react';
import { useState } from 'react';

interface HeaderProps {
  title: string;
  subtitle?: string;
  onSave?: () => void;
  onPreview?: () => void;
  onExport?: () => void;
  showActions?: boolean;
}

export function Header({ title, subtitle, onSave, onPreview, onExport, showActions = true }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [darkMode, setDarkMode] = useState(true);

  return (
    <header className="h-16 bg-[ink-800]/80 backdrop-blur-md border-b border-[ink-600] flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        <div>
          <h1 className="font-serif text-xl font-semibold text-[paper]">{title}</h1>
          {subtitle && <p className="text-sm text-[paper-dim]">{subtitle}</p>}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[paper-dim]" />
          <input
            type="text"
            placeholder="搜索..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-64 pl-9 pr-4 py-2 bg-[ink-700]/50 border border-[ink-600] rounded-lg text-sm text-[paper] placeholder-[paper-dim] focus:outline-none focus:border-[cinnabar]/50 focus:shadow-[0_0_15px_rgba(196,92,72,0.2)] transition-colors"
          />
        </div>

        {showActions && (
          <div className="flex items-center gap-2">
            <button
              onClick={onSave}
              className="flex items-center gap-2 px-3 py-2 bg-[ink-700] hover:bg-[ink-600] text-[paper] text-sm rounded-lg transition-all duration-200 hover:-translate-y-0.5"
            >
              <Save size={16} />
              <span>保存</span>
            </button>
            <button
              onClick={onPreview}
              className="flex items-center gap-2 px-3 py-2 bg-[ink-700] hover:bg-[ink-600] text-[paper] text-sm rounded-lg transition-all duration-200 hover:-translate-y-0.5"
            >
              <Eye size={16} />
              <span>预览</span>
            </button>
            <button
              onClick={onExport}
              className="flex items-center gap-2 px-3 py-2 bg-[cinnabar] hover:bg-[cinnabar-light] text-white text-sm font-medium rounded-lg transition-all duration-200 hover:-translate-y-0.5"
            >
              <Download size={16} />
              <span>导出</span>
            </button>
          </div>
        )}

        <button
          onClick={() => setDarkMode(!darkMode)}
          className="p-2 rounded-lg text-[paper-dim] hover:text-[paper] hover:bg-[ink-700] transition-colors"
        >
          {darkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>
    </header>
  );
}