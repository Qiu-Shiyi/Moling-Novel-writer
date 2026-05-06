import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Trash2, Calendar, MapPin } from 'lucide-react';
import { Layout } from '@/components/Layout/Layout';
import { useNovelStore } from '@/hooks/useNovelStore';
import type { WorldSetting } from '@/types';

export function WorldBuilder() {
  const { novelId } = useParams<{ novelId: string }>();
  const [activeTab, setActiveTab] = useState<'settings' | 'timeline'>('settings');
  const [newSetting, setNewSetting] = useState({ category: '', key: '', value: '' });
  const [newEvent, setNewEvent] = useState({ year: 0, title: '', description: '' });

  const { currentNovel, worldSettings, timelineEvents, loading, loadNovel, createWorldSetting, deleteWorldSetting, createTimelineEvent, deleteTimelineEvent } = useNovelStore();

  useEffect(() => {
    if (novelId) {
      loadNovel(novelId);
    }
  }, [novelId, loadNovel]);

  const handleCreateSetting = async () => {
    if (!newSetting.category || !newSetting.key || !newSetting.value || !novelId) return;
    await createWorldSetting(novelId, newSetting.category, newSetting.key, newSetting.value);
    setNewSetting({ category: '', key: '', value: '' });
  };

  const handleCreateEvent = async () => {
    if (!newEvent.year || !newEvent.title || !novelId) return;
    await createTimelineEvent(novelId, newEvent.year, newEvent.title, newEvent.description);
    setNewEvent({ year: 0, title: '', description: '' });
  };

  const groupedSettings = worldSettings.reduce((acc, setting) => {
    if (!acc[setting.category]) {
      acc[setting.category] = [];
    }
    acc[setting.category].push(setting);
    return acc;
  }, {} as Record<string, WorldSetting[]>);

  if (loading) {
    return (
      <Layout title="加载中..." showActions={false}>
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-4 border-[var(--cinnabar)] border-t-transparent rounded-full animate-spin" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout
      title="世界观设定"
      subtitle={currentNovel?.title}
      currentNovelId={novelId || undefined}
    >
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-8">
          <div className="bg-[var(--ink-800)] rounded-xl border border-[var(--ink-600)] overflow-hidden">
            <div className="flex border-b border-[var(--ink-600)]">
              <button
                onClick={() => setActiveTab('settings')}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${
                  activeTab === 'settings'
                    ? 'bg-[var(--ink-700)] text-[var(--cinnabar)]'
                    : 'text-[var(--paper-dim)] hover:text-[var(--paper)] hover:bg-[var(--ink-700)]/50'
                }`}
              >
                <MapPin size={18} />
                设定集
              </button>
              <button
                onClick={() => setActiveTab('timeline')}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${
                  activeTab === 'timeline'
                    ? 'bg-[var(--ink-700)] text-[var(--cinnabar)]'
                    : 'text-[var(--paper-dim)] hover:text-[var(--paper)] hover:bg-[var(--ink-700)]/50'
                }`}
              >
                <Calendar size={18} />
                编年史
              </button>
            </div>

            <div className="p-6">
              {activeTab === 'settings' ? (
                <>
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <input
                      type="text"
                      value={newSetting.category}
                      onChange={(e) => setNewSetting({ ...newSetting, category: e.target.value })}
                      placeholder="分类"
                      className="px-4 py-2 bg-[var(--ink-700)]/50 border border-[var(--ink-600)] rounded-lg text-[var(--paper)] placeholder-[var(--paper-dim)] focus:outline-none focus:border-[var(--cinnabar)]/50"
                    />
                    <input
                      type="text"
                      value={newSetting.key}
                      onChange={(e) => setNewSetting({ ...newSetting, key: e.target.value })}
                      placeholder="设定项"
                      className="px-4 py-2 bg-[var(--ink-700)]/50 border border-[var(--ink-600)] rounded-lg text-[var(--paper)] placeholder-[var(--paper-dim)] focus:outline-none focus:border-[var(--cinnabar)]/50"
                    />
                    <button
                      onClick={handleCreateSetting}
                      disabled={!newSetting.category || !newSetting.key}
                      className="px-4 py-2 bg-[var(--cinnabar)] hover:bg-[var(--cinnabar-light)] disabled:bg-[var(--ink-600)] text-white font-medium rounded-lg transition-colors"
                    >
                      添加
                    </button>
                  </div>

                  <div className="space-y-6">
                    {Object.keys(groupedSettings).length > 0 ? (
                      Object.entries(groupedSettings).map(([category, settings]) => (
                        <div key={category} className="bg-[var(--ink-700)]/30 rounded-xl p-4">
                          <h4 className="font-serif text-[var(--cinnabar)] mb-3">{category}</h4>
                          <div className="space-y-2">
                            {settings.map((setting) => (
                              <div key={setting.id} className="flex items-center justify-between bg-[var(--ink-700)]/50 rounded-lg px-4 py-2">
                                <div className="flex items-center gap-4">
                                  <span className="text-[var(--paper)] font-medium">{setting.key}</span>
                                  <span className="text-[var(--paper-dim)]">{setting.value}</span>
                                </div>
                                <button
                                  onClick={() => deleteWorldSetting(setting.id)}
                                  className="p-1.5 hover:bg-[var(--cinnabar)]/20 rounded text-[var(--paper-dim)] hover:text-[var(--cinnabar)] transition-colors"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-12">
                        <MapPin size={48} className="mx-auto text-[var(--ink-600)] mb-4" />
                        <p className="text-[var(--paper-dim)]">还没有设定项，开始构建你的世界吧</p>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <div className="grid grid-cols-4 gap-4 mb-6">
                    <input
                      type="number"
                      value={newEvent.year}
                      onChange={(e) => setNewEvent({ ...newEvent, year: parseInt(e.target.value) || 0 })}
                      placeholder="年份"
                      className="px-4 py-2 bg-[var(--ink-700)]/50 border border-[var(--ink-600)] rounded-lg text-[var(--paper)] placeholder-[var(--paper-dim)] focus:outline-none focus:border-[var(--cinnabar)]/50"
                    />
                    <input
                      type="text"
                      value={newEvent.title}
                      onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                      placeholder="事件名称"
                      className="px-4 py-2 bg-[var(--ink-700)]/50 border border-[var(--ink-600)] rounded-lg text-[var(--paper)] placeholder-[var(--paper-dim)] focus:outline-none focus:border-[var(--cinnabar)]/50"
                    />
                    <input
                      type="text"
                      value={newEvent.description}
                      onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                      placeholder="描述"
                      className="px-4 py-2 bg-[var(--ink-700)]/50 border border-[var(--ink-600)] rounded-lg text-[var(--paper)] placeholder-[var(--paper-dim)] focus:outline-none focus:border-[var(--cinnabar)]/50"
                    />
                    <button
                      onClick={handleCreateEvent}
                      disabled={!newEvent.year || !newEvent.title}
                      className="px-4 py-2 bg-[var(--cinnabar)] hover:bg-[var(--cinnabar-light)] disabled:bg-[var(--ink-600)] text-white font-medium rounded-lg transition-colors"
                    >
                      添加
                    </button>
                  </div>

                  <div className="relative">
                    <div className="absolute left-8 top-0 bottom-0 w-px bg-[var(--ink-600)]" />
                    <div className="space-y-6">
                      {timelineEvents.length > 0 ? (
                        timelineEvents.map((event) => (
                          <div key={event.id} className="relative pl-16">
                            <div className="absolute left-6 w-4 h-4 rounded-full bg-[var(--cinnabar)] border-4 border-[var(--ink-800)]" />
                            <div className="bg-[var(--ink-700)]/50 rounded-lg p-4">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-xl font-bold text-[var(--cinnabar)]">{event.year}</span>
                                <button
                                  onClick={() => deleteTimelineEvent(event.id)}
                                  className="p-1.5 hover:bg-[var(--cinnabar)]/20 rounded text-[var(--paper-dim)] hover:text-[var(--cinnabar)] transition-colors"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                              <h4 className="text-[var(--paper)] font-medium mb-1">{event.title}</h4>
                              <p className="text-sm text-[var(--paper-dim)]">{event.description}</p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-12">
                          <Calendar size={48} className="mx-auto text-[var(--ink-600)] mb-4" />
                          <p className="text-[var(--paper-dim)]">还没有时间线事件</p>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="col-span-4">
          <div className="bg-[var(--ink-800)] rounded-xl border border-[var(--ink-600)] p-6">
            <h3 className="font-serif text-[var(--paper)] mb-4">设定提示</h3>
            <div className="space-y-4">
              <div className="bg-[var(--ink-700)]/30 rounded-lg p-4">
                <p className="text-sm text-[var(--paper-dim)]">
                  <span className="text-[var(--bamboo)] font-medium">✦</span> 记录世界的核心规则，帮助保持故事一致性
                </p>
              </div>
              <div className="bg-[var(--ink-700)]/30 rounded-lg p-4">
                <p className="text-sm text-[var(--paper-dim)]">
                  <span className="text-[var(--bamboo)] font-medium">✦</span> 创建时间线可以追踪故事中的重要事件
                </p>
              </div>
              <div className="bg-[var(--ink-700)]/30 rounded-lg p-4">
                <p className="text-sm text-[var(--paper-dim)]">
                  <span className="text-[var(--bamboo)] font-medium">✦</span> 设定会在写作时自动检查一致性
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
