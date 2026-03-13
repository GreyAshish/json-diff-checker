import { useState } from 'react';
import { DiffEditor, Editor, DiffOnMount } from '@monaco-editor/react';

function App() {
  const [original, setOriginal] = useState('{\n  "name": "John",\n  "age": 30\n}');
  const [modified, setModified] = useState('{\n  "name": "John Doe",\n  "age": 31\n}');
  const [showDiff, setShowDiff] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const beautify = () => {
    setError(null);
    let newOriginal = original;
    let newModified = modified;
    let errors = [];

    try {
      newOriginal = JSON.stringify(JSON.parse(original), null, 2);
    } catch (e) {
      errors.push('Original JSON is invalid');
    }

    try {
      newModified = JSON.stringify(JSON.parse(modified), null, 2);
    } catch (e) {
      errors.push('Modified JSON is invalid');
    }

    setOriginal(newOriginal);
    setModified(newModified);

    if (errors.length > 0) {
      setError(errors.join(' & '));
    }
  };

  const handleDiffOnMount: DiffOnMount = (editor) => {
    const originalEditor = editor.getOriginalEditor();
    const modifiedEditor = editor.getModifiedEditor();

    originalEditor.onDidChangeModelContent(() => {
      setOriginal(originalEditor.getValue());
    });

    modifiedEditor.onDidChangeModelContent(() => {
      setModified(modifiedEditor.getValue());
    });
  };

  const toggleDiff = () => {
    setShowDiff(!showDiff);
  };

  return (
    <div className="h-screen flex flex-col bg-[#1e1e1e] text-gray-200">
      <header className="px-6 py-4 flex justify-between items-center bg-[#252526] border-b border-[#333333] shadow-md">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-semibold tracking-tight text-white">JSON Diff Checker</h1>
          {error && (
            <div className="px-3 py-1 bg-red-900/50 border border-red-500 text-red-200 text-sm rounded shadow-sm animate-pulse">
              {error}
            </div>
          )}
        </div>
        <div className="flex gap-3">
          <button
            onClick={beautify}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-md transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            Beautify
          </button>
          <button
            onClick={toggleDiff}
            className={`px-5 py-2 font-medium rounded-md transition-all shadow-sm focus:outline-none focus:ring-2 ${
              showDiff
                ? 'bg-orange-600 hover:bg-orange-500 text-white focus:ring-orange-400'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white focus:ring-emerald-400'
            }`}
          >
            {showDiff ? 'Edit JSON' : 'Compare Diff'}
          </button>
        </div>
      </header>

      <main className="flex-1 relative">
        {showDiff ? (
          <div className="absolute inset-0">
            <DiffEditor
              height="100%"
              language="json"
              original={original}
              modified={modified}
              theme="vs-dark"
              onMount={handleDiffOnMount}
              options={{
                renderSideBySide: true,
                originalEditable: true,
                fontSize: 14,
                minimap: { enabled: true },
                scrollBeyondLastLine: false,
                automaticLayout: true,
              }}
            />
          </div>
        ) : (
          <div className="flex h-full p-4 gap-4">
            <div className="flex-1 flex flex-col bg-[#252526] rounded-lg border border-[#333333] overflow-hidden shadow-xl">
              <div className="px-4 py-2 bg-[#2d2d2d] text-xs font-bold uppercase tracking-wider text-gray-400 border-b border-[#333333]">
                Original JSON
              </div>
              <div className="flex-1 relative">
                <Editor
                  height="100%"
                  defaultLanguage="json"
                  value={original}
                  theme="vs-dark"
                  onChange={(value) => setOriginal(value || '')}
                  options={{
                    fontSize: 14,
                    minimap: { enabled: false },
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                    padding: { top: 10 },
                  }}
                />
              </div>
            </div>
            <div className="flex-1 flex flex-col bg-[#252526] rounded-lg border border-[#333333] overflow-hidden shadow-xl">
              <div className="px-4 py-2 bg-[#2d2d2d] text-xs font-bold uppercase tracking-wider text-gray-400 border-b border-[#333333]">
                Modified JSON
              </div>
              <div className="flex-1 relative">
                <Editor
                  height="100%"
                  defaultLanguage="json"
                  value={modified}
                  theme="vs-dark"
                  onChange={(value) => setModified(value || '')}
                  options={{
                    fontSize: 14,
                    minimap: { enabled: false },
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                    padding: { top: 10 },
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
