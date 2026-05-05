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
      className={`fixed left-0 top-0 h-screen bg-slate-900 border-r border-slate-700 transition-all duration-300 z-40 flex flex-col ${
        collapsed ? 'w-16' : 'w-64'
      }`}
    >
      <div className="flex items-center justify-between h-16 px-4 border-b border-slate-700">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-orange-600 flex items-center justify-center">
              <span className="text-slate-900 font-bold text-sm">墨</span>
            </div>
            <span className="text-amber-400 font-semibold text-lg">墨灵</span>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
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
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                  isActive(item.path)
                    ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
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
                <span className="text-xs text-slate-500 uppercase tracking-wider">当前项目</span>
              </div>
            )}
            <ul className="space-y-1 px-2">
              {novelNavItems.map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => navigate(getPath(item.path))}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                      isActive(item.path)
                        ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        : 'text-slate-400 hover:bg-slate-800 hover:text-white'
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

      <div className="border-t border-slate-700 p-2">
        <button
          onClick={() => navigate('/settings')}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
            location.pathname === '/settings'
              ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
              : 'text-slate-400 hover:bg-slate-800 hover:text-white'
          }`}
        >
          <Settings size={20} />
          {!collapsed && <span className="text-sm font-medium">设置</span>}
        </button>
      </div>
    </aside>
  );
}