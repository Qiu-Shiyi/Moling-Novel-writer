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
    <header className="h-16 bg-slate-800/50 backdrop-blur-sm border-b border-slate-700 flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        <div>
          <h1 className="text-lg font-semibold text-white">{title}</h1>
          {subtitle && <p className="text-sm text-slate-400">{subtitle}</p>}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="搜索..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-64 pl-9 pr-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-sm text-white placeholder-slate-400 focus:outline-none focus:border-amber-500/50 transition-colors"
          />
        </div>

        {showActions && (
          <div className="flex items-center gap-2">
            <button
              onClick={onSave}
              className="flex items-center gap-2 px-3 py-2 bg-slate-700 hover:bg-slate-600 text-white text-sm rounded-lg transition-colors"
            >
              <Save size={16} />
              <span>保存</span>
            </button>
            <button
              onClick={onPreview}
              className="flex items-center gap-2 px-3 py-2 bg-slate-700 hover:bg-slate-600 text-white text-sm rounded-lg transition-colors"
            >
              <Eye size={16} />
              <span>预览</span>
            </button>
            <button
              onClick={onExport}
              className="flex items-center gap-2 px-3 py-2 bg-amber-500 hover:bg-amber-600 text-slate-900 text-sm font-medium rounded-lg transition-colors"
            >
              <Download size={16} />
              <span>导出</span>
            </button>
          </div>
        )}

        <button
          onClick={() => setDarkMode(!darkMode)}
          className="p-2 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white transition-colors"
        >
          {darkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>
    </header>
  );
}