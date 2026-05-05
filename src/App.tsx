import { Routes, Route } from 'react-router-dom';
import { Dashboard } from '@/pages/Dashboard';
import { IdeaLab } from '@/pages/IdeaLab';
import { Editor } from '@/pages/Editor';
import { CharacterWorkshop } from '@/pages/CharacterWorkshop';
import { WorldBuilder } from '@/pages/WorldBuilder';
import { Settings } from '@/pages/Settings';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/idea-lab" element={<IdeaLab />} />
      <Route path="/editor/:novelId" element={<Editor />} />
      <Route path="/editor/:novelId/characters" element={<CharacterWorkshop />} />
      <Route path="/editor/:novelId/world" element={<WorldBuilder />} />
      <Route path="/settings" element={<Settings />} />
    </Routes>
  );
}

export default App;