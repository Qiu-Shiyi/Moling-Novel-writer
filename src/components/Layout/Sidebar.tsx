import { useState } from 'react';
import { 
  BookOpen, 
  Sparkles, 
  Users, 
  Map, 
  Settings, 
  ChevronLeft, 
  ChevronRight,
  PenTool
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

interface SidebarProps {
  currentNovelId?: string;
}

const navItems = [
  { id: 'dashboard', label: '书架', icon: BookOpen, path: '/' },
  { id: 'idea-lab', label: '灵感孵化', icon: Sparkles, path: '/idea-lab' },
];

const novelNavItems = [
  { id: 'editor', label: '写作区', icon: PenTool, path: '/editor/:novelId' },
  { id: 'characters', label: '人物工坊', icon: Users, path: '/editor/:novelId/characters' },
  { id: 'world', label: '世界观', icon: Map, path: '/editor/:novelId/world' },
];

export function Sidebar({ currentNovelId }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const getPath = (path: string) => {
    if (currentNovelId) {
      return path.replace(':novelId', currentNovelId);
    }
    return path;
  };

  const isActive = (path: string) => {
    const actualPath = getPath(path);
    return location.pathname === actualPath || location.pathname.startsWith(actualPath + '/');
  };

  return (
    <aside
      className={`fixed left-0 top-0 h-screen bg-[var(--ink-800)] border-r border-[var(--ink-600)] transition-all duration-300 z-40 flex flex-col ${
        collapsed ? 'w-16' : 'w-64'
      }`}
    >
      <div className="flex items-center justify-between h-16 px-4 border-b border-[var(--ink-600)]">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--cinnabar)] to-[var(--cinnabar-light)] flex items-center justify-center">
              <span className="text-[var(--paper)] font-bold text-sm">墨</span>
            </div>
            <span className="text-[var(--paper)] font-serif text-lg">墨灵</span>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 rounded-lg hover:bg-[var(--ink-700)] text-[var(--paper-dim)] hover:text-[var(--paper)] transition-colors duration-300"
        >
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      <nav className="flex-1 py-4 overflow-y-auto">
        <ul className="space-y-1 px-2">
          {navItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-300 ${
                  isActive(item.path)
                    ? 'border-l-2 border-[var(--cinnabar)] bg-[var(--cinnabar)]/10 text-[var(--cinnabar)]'
                    : 'text-[var(--paper-dim)] hover:bg-[var(--ink-700)] hover:text-[var(--paper)]'
                }`}
              >
                <item.icon size={20} />
                {!collapsed && <span className="text-sm font-medium">{item.label}</span>}
              </button>
            </li>
          ))}
        </ul>

        {currentNovelId && (
          <>
            {!collapsed && (
              <div className="px-4 py-3">
                <span className="text-xs text-[var(--paper-dim)] uppercase tracking-wider">当前项目</span>
              </div>
            )}
            <ul className="relative space-y-1 px-2">
              {!collapsed && (
                <div className="absolute left-5 top-0 bottom-0 w-px bg-[var(--ink-600)]" />
              )}
              {novelNavItems.map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => navigate(getPath(item.path))}
                    className={`w-full flex items-center gap-3 pl-6 pr-3 py-2.5 rounded-lg transition-all duration-300 ${
                      isActive(item.path)
                        ? 'border-l-2 border-[var(--cinnabar)] bg-[var(--cinnabar)]/10 text-[var(--cinnabar)]'
                        : 'text-[var(--paper-dim)] hover:bg-[var(--ink-700)] hover:text-[var(--paper)]'
                    }`}
                  >
                    <item.icon size={20} />
                    {!collapsed && <span className="text-sm font-medium">{item.label}</span>}
                  </button>
                </li>
              ))}
            </ul>
          </>
        )}
      </nav>

      <div className="border-t border-[var(--ink-600)] p-2">
        <button
          onClick={() => navigate('/settings')}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-300 ${
            location.pathname === '/settings'
              ? 'border-l-2 border-[var(--cinnabar)] bg-[var(--cinnabar)]/10 text-[var(--cinnabar)]'
              : 'text-[var(--paper-dim)] hover:bg-[var(--ink-700)] hover:text-[var(--paper)]'
          }`}
        >
          <Settings size={20} />
          {!collapsed && <span className="text-sm font-medium">设置</span>}
        </button>
      </div>
    </aside>
  );
}