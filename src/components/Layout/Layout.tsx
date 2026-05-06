import { Sidebar } from './Sidebar';
import { Header } from './Header';
import type { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
  currentNovelId?: string;
  onSave?: () => void;
  onPreview?: () => void;
  onExport?: () => void;
  showActions?: boolean;
}

export function Layout({ 
  children, 
  title, 
  subtitle, 
  currentNovelId, 
  onSave, 
  onPreview, 
  onExport,
  showActions = true 
}: LayoutProps) {
  return (
    <div className="min-h-screen bg-ink-900 text-paper">
      <Sidebar currentNovelId={currentNovelId} />
      <div className="ml-64">
        <Header
          title={title}
          subtitle={subtitle}
          onSave={onSave}
          onPreview={onPreview}
          onExport={onExport}
          showActions={showActions}
        />
        <main className="p-6 animate-fade-in">
          {children}
        </main>
      </div>
    </div>
  );
}