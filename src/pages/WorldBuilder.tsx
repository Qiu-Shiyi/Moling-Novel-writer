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
          <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
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
          <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
            <div className="flex border-b border-slate-700">
              <button
                onClick={() => setActiveTab('settings')}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${
                  activeTab === 'settings'
                    ? 'bg-slate-700 text-amber-400'
                    : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                }`}
              >
                <MapPin size={18} />
                设定集
              </button>
              <button
                onClick={() => setActiveTab('timeline')}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${
                  activeTab === 'timeline'
                    ? 'bg-slate-700 text-amber-400'
                    : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
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
                      className="px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-amber-500/50"
                    />
                    <input
                      type="text"
                      value={newSetting.key}
                      onChange={(e) => setNewSetting({ ...newSetting, key: e.target.value })}
                      placeholder="设定项"
                      className="px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-amber-500/50"
                    />
                    <button
                      onClick={handleCreateSetting}
                      disabled={!newSetting.category || !newSetting.key}
                      className="px-4 py-2 bg-amber-500 hover:bg-amber-600 disabled:bg-slate-600 text-slate-900 font-medium rounded-lg transition-colors"
                    >
                      添加
                    </button>
                  </div>

                  <div className="space-y-6">
                    {Object.keys(groupedSettings).length > 0 ? (
                      Object.entries(groupedSettings).map(([category, settings]) => (
                        <div key={category} className="bg-slate-700/30 rounded-xl p-4">
                          <h4 className="font-semibold text-amber-400 mb-3">{category}</h4>
                          <div className="space-y-2">
                            {settings.map((setting) => (
                              <div key={setting.id} className="flex items-center justify-between bg-slate-700/50 rounded-lg px-4 py-2">
                                <div className="flex items-center gap-4">
                                  <span className="text-white font-medium">{setting.key}</span>
                                  <span className="text-slate-400">{setting.value}</span>
                                </div>
                                <button
                                  onClick={() => deleteWorldSetting(setting.id)}
                                  className="p-1.5 hover:bg-red-500/20 rounded text-slate-400 hover:text-red-400 transition-colors"
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
                        <MapPin size={48} className="mx-auto text-slate-600 mb-4" />
                        <p className="text-slate-400">还没有设定项，开始构建你的世界吧</p>
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
                      className="px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-amber-500/50"
                    />
                    <input
                      type="text"
                      value={newEvent.title}
                      onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                      placeholder="事件名称"
                      className="px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-amber-500/50"
                    />
                    <input
                      type="text"
                      value={newEvent.description}
                      onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                      placeholder="描述"
                      className="px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-amber-500/50"
                    />
                    <button
                      onClick={handleCreateEvent}
                      disabled={!newEvent.year || !newEvent.title}
                      className="px-4 py-2 bg-amber-500 hover:bg-amber-600 disabled:bg-slate-600 text-slate-900 font-medium rounded-lg transition-colors"
                    >
                      添加
                    </button>
                  </div>

                  <div className="relative">
                    <div className="absolute left-8 top-0 bottom-0 w-px bg-slate-600" />
                    <div className="space-y-6">
                      {timelineEvents.length > 0 ? (
                        timelineEvents.map((event) => (
                          <div key={event.id} className="relative pl-16">
                            <div className="absolute left-6 w-4 h-4 rounded-full bg-amber-500 border-4 border-slate-800" />
                            <div className="bg-slate-700/50 rounded-lg p-4">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-xl font-bold text-amber-400">{event.year}</span>
                                <button
                                  onClick={() => deleteTimelineEvent(event.id)}
                                  className="p-1.5 hover:bg-red-500/20 rounded text-slate-400 hover:text-red-400 transition-colors"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                              <h4 className="text-white font-medium mb-1">{event.title}</h4>
                              <p className="text-sm text-slate-400">{event.description}</p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-12">
                          <Calendar size={48} className="mx-auto text-slate-600 mb-4" />
                          <p className="text-slate-400">还没有时间线事件</p>
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
          <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
            <h3 className="font-semibold text-white mb-4">设定提示</h3>
            <div className="space-y-4">
              <div className="bg-slate-700/30 rounded-lg p-4">
                <p className="text-sm text-slate-300">
                  <span className="text-amber-400 font-medium">✦</span> 记录世界的核心规则，帮助保持故事一致性
                </p>
              </div>
              <div className="bg-slate-700/30 rounded-lg p-4">
                <p className="text-sm text-slate-300">
                  <span className="text-amber-400 font-medium">✦</span> 创建时间线可以追踪故事中的重要事件
                </p>
              </div>
              <div className="bg-slate-700/30 rounded-lg p-4">
                <p className="text-sm text-slate-300">
                  <span className="text-amber-400 font-medium">✦</span> 设定会在写作时自动检查一致性
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}