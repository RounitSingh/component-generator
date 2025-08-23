import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { duotoneSpace } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Download, Copy, Send, Image as ImageIcon, Save, Loader2, AlertCircle } from 'lucide-react';
import useChatStore from '../store/chatStore';
import useComponentStore from '../store/componentStore';
import { generateComponentWithGemini } from '../utils/geminiApi';
import DynamicPreview from '../components/DynamicPreview';
import PersistenceStatus from '../components/PersistenceStatus';
import {
  getSessionMessages,
  addSessionMessage,
  getSessionInteractions,
  saveSessionInteraction,
  getSessionComponents,
  saveSessionComponent,
  saveAIResponse,
  createSession,
} from '../utils/api';
import {
  convertBackendMessagesToFrontend,
  convertFrontendMessageToBackend,
  convertBackendComponentsToFrontend,
  convertFrontendComponentToBackend,
  convertBackendInteractionsToFrontend,
  convertFrontendInteractionToBackend,
  convertFrontendAIResponseToBackend,
  saveSessionDataLocally,
  loadSessionDataLocally,
} from '../utils/persistence';

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

const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    // Failed to copy to clipboard
  }
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

const AIEditor = ({ sessionId, createNewSession = false }) => {
  const {
    messages,
    setMessages,
    addMessage,
    setInteractions,
  } = useChatStore();
  
  const {
    setComponents,
    addComponent,
    clearError: clearComponentError,
  } = useComponentStore();
  
  const [code, setCode] = useState({ jsx: '', css: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('preview');
  const [userPrompt, setUserPrompt] = useState('');
  const [image, setImage] = useState(null);
  const [isLoadingSession, setIsLoadingSession] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const [persistenceError, setPersistenceError] = useState(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [currentSessionId, setCurrentSessionId] = useState(sessionId);
  const fileInputRef = useRef(null);

  // Online/offline detection
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Clear errors when session changes
  useEffect(() => {
    setError('');
    setPersistenceError(null);
    clearComponentError();
  }, [sessionId, clearComponentError]);

  // Load session data
  const loadSessionData = useCallback(async () => {
    if (!currentSessionId) {return};

    setIsLoadingSession(true);
    setError('');
    setPersistenceError(null);

    try {
      // Try to load from backend first
      const [backendMessages, backendComponents, backendInteractions] = await Promise.all([
          getSessionMessages(currentSessionId),
          getSessionComponents(currentSessionId),
          getSessionInteractions(currentSessionId),
      ]);

      // Convert backend data to frontend format
      const frontendMessages = convertBackendMessagesToFrontend(backendMessages);
      const frontendComponents = convertBackendComponentsToFrontend(backendComponents);
      const frontendInteractions = convertBackendInteractionsToFrontend(backendInteractions);

      // Update stores
      setMessages(frontendMessages);
      setComponents(frontendComponents);
      setInteractions(frontendInteractions);

      // Set current component code
      const currentComponent = frontendComponents.find(comp => comp.isCurrent);
      if (currentComponent) {
        setCode({ jsx: currentComponent.jsxCode, css: currentComponent.cssCode });
      } else {
        setCode({ jsx: '', css: '' });
      }

      // Save to local storage as backup
      saveSessionDataLocally(currentSessionId, {
        messages: frontendMessages,
        components: frontendComponents,
        interactions: frontendInteractions,
      });

      setLastSaved(Date.now());
      // Session data loaded successfully

    } catch {
      // Failed to load session data from backend
      
      // Try to load from local storage as fallback
      try {
        const localData = loadSessionDataLocally(sessionId);
        if (localData && localData.messages) {
          setMessages(localData.messages);
          setComponents(localData.components || []);
          setInteractions(localData.interactions || []);
          
          const currentComponent = localData.components?.find(comp => comp.isCurrent);
          if (currentComponent) {
            setCode({ jsx: currentComponent.jsxCode, css: currentComponent.cssCode });
          }
          
          setPersistenceError('Loaded from local backup - some data may be outdated');
          // Loaded session data from local backup
        } else {
          setError('Failed to load session data. Please try refreshing the page.');
        }
      } catch {
        // Failed to load from local storage
        setError('Failed to load session data. Please try refreshing the page.');
      }
      } finally {
      setIsLoadingSession(false);
    }
  }, [currentSessionId, setMessages, setComponents, setInteractions]);

  // Create new session if needed
  useEffect(() => {
    const createNewSessionIfNeeded = async () => {
      if (createNewSession && !currentSessionId) {
        try {
          const newSession = await createSession({
            title: 'New AI Component Session',
            description: 'AI-powered component generation session',
          });
          setCurrentSessionId(newSession.id);
        } catch (error) {
          console.error('Failed to create new session:', error);
          setError('Failed to create new session. Please try again.');
        }
      }
    };

    createNewSessionIfNeeded();
  }, [createNewSession, currentSessionId]);

  // Load session data when sessionId or currentSessionId changes
  useEffect(() => {
    if (currentSessionId) {
      loadSessionData();
    }
  }, [currentSessionId, loadSessionData]);

  // Save data to backend with retry logic
  const saveToBackend = useCallback(async (operation, data) => {
    if (!sessionId || !isOnline) {return false};

    const maxRetries = 3;
    let lastError;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        let result;
        switch (operation) {
          case 'message':
            result = await addSessionMessage(sessionId, data);
            break;
          case 'component':
            result = await saveSessionComponent(sessionId, data);
            break;
          case 'interaction':
            result = await saveSessionInteraction(sessionId, data);
            break;
          default:
            throw new Error(`Unknown operation: ${operation}`);
        }
        
        setLastSaved(Date.now());
        setPersistenceError(null);
        return result;
      } catch (err) {
        console.error(`Failed to save ${operation} (attempt ${attempt}):`, err);
        lastError = err;
        // Attempt failed, will retry if attempts remain
        
        if (attempt < maxRetries) {
          // Wait before retrying (exponential backoff)
          await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
        }
      }
    }

    setPersistenceError(`Failed to save ${operation} after ${maxRetries} attempts`);
    throw lastError;
  }, [sessionId, isOnline]);

  const handleSend = async () => {
    if (!userPrompt.trim() && !image) {return};

    setLoading(true);
    setError('');
    setPersistenceError(null);

    // Generate conversation ID for this interaction
    const conversationId = `conv_${sessionId}_${Date.now()}`;
    const startTime = Date.now();

    const promptMsg = {
      type: 'prompt',
      text: userPrompt,
      image: image || null,
      conversationId,
    };

    try {
      // Add user message to local state immediately
      addMessage(promptMsg);

      // Save user message to backend
      let savedUserMessage = null;
      if (sessionId) {
        const backendMessage = convertFrontendMessageToBackend(promptMsg);
        console.log('Saving user message to backend:', backendMessage);
        savedUserMessage = await saveToBackend('message', backendMessage);
        console.log('User message saved:', savedUserMessage);
      }

      // Prepare AI request
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

      // Generate AI response
      const output = await generateComponentWithGemini(promptText, imagePart);
      const responseTime = Date.now() - startTime;

      // Add AI response to local state
      const responseMsg = { 
        type: 'response', 
        text: output,
        conversationId,
      };
      addMessage(responseMsg);

      // Save AI response to backend
      if (sessionId) {
        const aiResponseData = {
          conversationId,
          userMessageId: savedUserMessage?.id || null,
          promptText: userPrompt,
          responseText: output,
          modelName: 'gemini',
          responseTimeMs: responseTime,
          tokensUsed: null, // Could be extracted from Gemini response if available
          metadata: {
            hasImage: !!image,
            imageType: image?.type || null,
          },
        };

        const backendAIResponse = convertFrontendAIResponseToBackend(aiResponseData);
        console.log('Saving AI response to backend:', backendAIResponse);
        const savedAIResponse = await saveAIResponse(sessionId, backendAIResponse);
        console.log('AI response saved:', savedAIResponse);
      }

      // Save AI interaction to backend (for backward compatibility)
      const interactionData = {
        prompt: userPrompt,
        response: output,
        interactionType: 'component_generation',
        targetElement: null,
        conversationId,
        relatedMessageId: savedUserMessage?.id || null,
        metadata: {},
      };
      
      if (sessionId) {
        const backendInteraction = convertFrontendInteractionToBackend(interactionData);
        console.log('Saving interaction to backend:', backendInteraction);
        const savedInteraction = await saveToBackend('interaction', backendInteraction);
        console.log('Interaction saved:', savedInteraction);
      }

      // Parse and set component code
      const parsed = parseGeminiResponse(output);
      setCode(parsed);

      // Save generated component to backend
      if (sessionId && parsed.jsx && parsed.css) {
        setIsSaving(true);
        try {
          const componentData = {
            name: 'AIComponent',
            jsxCode: parsed.jsx,
            cssCode: parsed.css,
            componentType: 'generated',
            metadata: {
              conversationId,
              generatedFrom: savedUserMessage?.id || null,
            },
          };

          const backendComponent = convertFrontendComponentToBackend(componentData);
          await saveToBackend('component', backendComponent);

          // Add component to local state
          addComponent({
            ...componentData,
            isCurrent: true,
          });

          // Update local storage backup
          saveSessionDataLocally(sessionId, {
            messages: [...messages, promptMsg, responseMsg],
            components: [...(useComponentStore.getState().components || []), { ...componentData, isCurrent: true }],
            interactions: [...(useChatStore.getState().interactions || []), interactionData],
          });

        } catch {
          setPersistenceError('Component generated but failed to save');
        } finally {
          setIsSaving(false);
        }
      }

    } catch {
      setError('Error generating component. Please try again.');
      addMessage({ type: 'response', text: 'Error generating component. Please try again.' });
    } finally {
      setLoading(false);
      setUserPrompt('');
      setImage(null);
    }
  };

  const handleSaveComponent = async () => {
    if (!code.jsx || !sessionId) {return};

    setIsSaving(true);
    setPersistenceError(null);

    try {
      const componentData = {
        name: 'ManualComponent',
        jsxCode: code.jsx,
        cssCode: code.css,
        componentType: 'manual',
        metadata: {},
      };

      const backendComponent = convertFrontendComponentToBackend(componentData);
      await saveToBackend('component', backendComponent);

      // Add component to local state
      addComponent({
        ...componentData,
        isCurrent: true,
      });

      // Update local storage backup
      const currentState = useComponentStore.getState();
      saveSessionDataLocally(sessionId, {
        messages: useChatStore.getState().messages,
        components: [...currentState.components, { ...componentData, isCurrent: true }],
        interactions: useChatStore.getState().interactions,
      });

    } catch {
      setPersistenceError('Failed to save component');
    } finally {
      setIsSaving(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (isLoadingSession) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="animate-spin h-8 w-8 mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading session data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 grid grid-cols-1 md:grid-cols-4">
      {/* Chat Panel */}
      <div className="md:col-span-1 w-full p-6 flex flex-col border border-red-600 max-h-screen overflow-y-auto bg-white/80">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-blue-700">AI Component Generator</h2>
          {sessionId && (
            <PersistenceStatus
              isSaving={isSaving}
              lastSaved={lastSaved}
              error={persistenceError}
              isOnline={isOnline}
              className="text-xs"
            />
          )}
        </div>

        {/* Messages */}
        <div className="flex-1 h-[400px] overflow-y-auto mb-4 space-y-3 pr-2">
          {messages.map((msg, idx) => (
            <div key={msg.id || idx} className={`flex ${msg.type === 'prompt' ? 'justify-start' : 'justify-end'}`}>
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
              <div className="rounded-xl px-4 py-3 bg-green-100 text-gray-900 shadow text-sm animate-in flex items-center gap-2">
                <Loader2 className="animate-spin h-4 w-4" />
                Generating...
              </div>
            </div>
          )}
          
          {error && (
            <div className="flex justify-end">
              <div className="rounded-xl px-4 py-3 bg-red-100 text-red-800 shadow text-sm animate-in flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                {error}
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="flex gap-2 items-center mt-2">
          <input
            type="text"
            className="input flex-1"
            placeholder="Describe your component..."
            value={userPrompt}
            onChange={(e) => setUserPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
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

      {/* Preview/Code Panel */}
      <div className="md:col-span-3 w-full p-6 max-h-screen overflow-y-hidden flex flex-col bg-white/90">
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
                {sessionId && (
                  <button
                    className="btn cursor-pointer btn-primary flex items-center gap-1"
                    onClick={handleSaveComponent}
                    disabled={!code.jsx || isSaving}
                    title="Save Component"
                  >
                    {isSaving ? <Loader2 className="animate-spin h-4 w-4" /> : <Save size={16} />}
                    Save
                  </button>
                )}
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