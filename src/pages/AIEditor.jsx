import React, { useRef, useState, useEffect } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { duotoneSpace } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Download, Copy, Send, Image as ImageIcon } from 'lucide-react';
import useChatStore from '../store/chatStore';
import useComponentStore from '../store/componentStore';
import { generateComponentWithGemini } from '../utils/geminiApi';
import DynamicPreview from '../components/DynamicPreview';
import {
  getSessionMessages,
  addSessionMessage,
  getSessionInteractions,
  saveSessionInteraction,
  getSessionComponents,
  saveSessionComponent,
} from '../utils/api';

const parseGeminiResponse = (text) => {
  const jsxMatch = text.match(/```(?:jsx|tsx)?([\s\S]*?)```/i);
  const cssMatch = text.match(/```css([\s\S]*?)```/i);
  return {
    jsx: jsxMatch ? jsxMatch[1].trim() : '',
    css: cssMatch ? cssMatch[1].trim() : '',
  };
};

const downloadFile = (filename, content) => {
  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};

const copyToClipboard = (text) => {
  navigator.clipboard.writeText(text);
};

const toBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        const base64 = reader.result.split(',')[1];
        resolve(base64);
      } else {
        reject(new Error('FileReader result is not a string'));
      }
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

const AIEditor = ({ sessionId }) => {
  const {
    messages,
    setMessages,
    addMessage,
    setInteractions,
  } = useChatStore();
  const {
    setComponents,
    addComponent,
  } = useComponentStore();
  const [code, setCode] = useState({ jsx: '', css: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('preview');
  const [userPrompt, setUserPrompt] = useState('');
  const [image, setImage] = useState(null);
  const fileInputRef = useRef(null);

  // Hydrate state from backend on sessionId change
  useEffect(() => {
    if (!sessionId) {
      return;
    }
    const hydrate = async () => {
      setLoading(true);
      try {
        const [msgs, comps, inters] = await Promise.all([
          getSessionMessages(sessionId),
          getSessionComponents(sessionId),
          getSessionInteractions(sessionId),
        ]);
        setMessages(msgs || []);
        setComponents(comps || []);
        setInteractions(inters || []);
        if (comps && comps.length > 0) {
          setCode({ jsx: comps[0].jsxCode, css: comps[0].cssCode });
        } else {
          setCode({ jsx: '', css: '' });
        }
      } catch {
        setError('Failed to load session data.');
      } finally {
        setLoading(false);
      }
    };
    hydrate();
    // eslint-disable-next-line
  }, [sessionId]);

  const handleSend = async () => {
    if (!userPrompt.trim() && !image) {
      return;
    }
    setLoading(true);
    setError('');
    const promptMsg = { role: 'user', content: userPrompt, message_type: 'text', metadata: {} };
    try {
      // Save user message
      if (sessionId) {
        await addSessionMessage(sessionId, promptMsg);
      }
      addMessage({ type: 'prompt', text: userPrompt, image: image || null });
      let promptText = userPrompt;
      let imagePart = [];
      if (image) {
        promptText += '\n[Image attached]';
        imagePart = [
          {
            inlineData: {
              mimeType: image.type,
              data: await toBase64(image),
            },
          },
        ];
      }
      const output = await generateComponentWithGemini(promptText, imagePart);
      // Save AI interaction
      if (sessionId) {
        await saveSessionInteraction(sessionId, {
          prompt: userPrompt,
          response: output,
          interaction_type: 'component_generation',
          target_element: null,
          metadata: {},
        });
      }
      addMessage({ type: 'response', text: output });
      const parsed = parseGeminiResponse(output);
      setCode(parsed);
      // Save generated component
      if (sessionId && parsed.jsx && parsed.css) {
        await saveSessionComponent(sessionId, {
          name: 'AIComponent',
          jsx_code: parsed.jsx,
          css_code: parsed.css,
          component_type: 'generated',
          metadata: {},
        });
        addComponent({ name: 'AIComponent', jsxCode: parsed.jsx, cssCode: parsed.css, componentType: 'generated', metadata: {} });
      }
    } catch {
      setError('Error fetching response.');
      addMessage({ type: 'response', text: 'Error fetching response.' });
    } finally {
      setLoading(false);
      setUserPrompt('');
      setImage(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 grid grid-cols-1 md:grid-cols-4">
      <div className="md:col-span-1 w-full p-6 flex flex-col border-r border-gray-200 bg-white/80">
        <h2 className="text-2xl font-bold mb-4 text-blue-700">AI Component Generator</h2>
        <div className="flex-1 h-[400px] overflow-y-auto mb-4 space-y-3 pr-2">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.type === 'prompt' ? 'justify-start' : 'justify-end'}`}>
              <div
                className={`rounded-xl px-4 py-3 max-w-[80%] shadow text-sm whitespace-pre-line animate-in ${
                  msg.type === 'prompt'
                    ? 'bg-blue-100 text-gray-800'
                    : 'bg-green-100 text-gray-900'
                }`}
              >
                {msg.text}
                {msg.image && (
                  <img
                    src={URL.createObjectURL(msg.image)}
                    alt="User upload"
                    className="mt-2 max-h-32 rounded border"
                  />
                )}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-end">
              <div className="rounded-xl px-4 py-3 bg-green-100 text-gray-900 shadow text-sm animate-in">
                Generating...
              </div>
            </div>
          )}
          {error && (
            <div className="flex justify-end">
              <div className="rounded-xl px-4 py-3 bg-red-100 text-red-800 shadow text-sm animate-in">
                {error}
              </div>
            </div>
          )}
        </div>
        <div className="flex gap-2 items-center mt-2">
          <input
            type="text"
            className="input flex-1"
            placeholder="Describe your component..."
            value={userPrompt}
            onChange={(e) => setUserPrompt(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            disabled={loading}
          />
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                setImage(e.target.files[0]);
              }
            }}
            disabled={loading}
          />
          <button
            className="btn btn-outline"
            onClick={() => fileInputRef.current && fileInputRef.current.click()}
            disabled={loading}
            title="Attach image"
          >
            <ImageIcon size={20} />
          </button>
          <button
            className="btn btn-primary"
            onClick={handleSend}
            disabled={loading || (!userPrompt.trim() && !image)}
            title="Send"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
      <div className="md:col-span-3 w-full p-6 flex flex-col bg-white/90">
        <div className="flex gap-2 mb-4 border-b border-gray-200">
          <button
            className={`px-4 py-2 font-semibold border-b-2 transition-colors ${
              activeTab === 'preview'
                ? 'border-blue-600 text-blue-700'
                : 'border-transparent text-gray-500 hover:text-blue-600'
            }`}
            onClick={() => setActiveTab('preview')}
          >
            Preview
          </button>
          <button
            className={`px-4 py-2 font-semibold border-b-2 transition-colors ${
              activeTab === 'code'
                ? 'border-blue-600 text-blue-700'
                : 'border-transparent text-gray-500 hover:text-blue-600'
            }`}
            onClick={() => setActiveTab('code')}
          >
            Code
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">
          {activeTab === 'preview' ? (
            code.jsx ? (
              <DynamicPreview jsx={code.jsx} css={code.css} />
            ) : (
              <div className="text-gray-400 text-center mt-20">No component generated yet.</div>
            )
          ) : (
            <div>
              <div className="flex gap-2 mb-2">
                <button
                  className="btn cursor-pointer btn-outline flex items-center gap-1"
                  onClick={() => copyToClipboard(code.jsx)}
                  disabled={!code.jsx}
                  title="Copy JSX/TSX"
                >
                  <Copy size={16} /> JSX/TSX
                </button>
                <button
                  className="btn cursor-pointer btn-outline flex items-center gap-1"
                  onClick={() => copyToClipboard(code.css)}
                  disabled={!code.css}
                  title="Copy CSS"
                >
                  <Copy size={16} /> CSS
                </button>
                <button
                  className="btn cursor-pointer btn-outline flex items-center gap-1"
                  onClick={() => {
                    if (code.jsx) {
                      downloadFile('Component.jsx', code.jsx);
                    }
                    if (code.css) {
                      downloadFile('styles.css', code.css);
                    }
                  }}
                  disabled={!code.jsx}
                  title="Download Files"
                >
                  <Download size={16} /> Download
                </button>
              </div>
              <div className="mb-4">
                <div className="font-semibold text-gray-700 mb-1">JSX/TSX</div>
                <SyntaxHighlighter
                  language="jsx"
                  style={duotoneSpace}
                  customStyle={{ borderRadius: 8, fontSize: 14 }}
                  showLineNumbers
                >
                  {code.jsx || ''}
                </SyntaxHighlighter>
              </div>
              <div>
                <div className="font-semibold text-gray-700 mb-1">CSS</div>
                <SyntaxHighlighter
                  language="css"
                  style={duotoneSpace}
                  customStyle={{ borderRadius: 8, fontSize: 14 }}
                  showLineNumbers
                >
                  {code.css || ''}
                </SyntaxHighlighter>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIEditor;