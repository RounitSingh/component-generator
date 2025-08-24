import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { duotoneSpace } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Download, Copy, Send, Image as ImageIcon, Save, Loader2, AlertCircle, StarsIcon } from 'lucide-react';
import useSessionChatStore from '../store/sessionChatStore';
import useSessionComponentStore from '../store/sessionComponentStore';
import { generateComponentWithGemini } from '../utils/geminiApi';
import DynamicPreview from '../components/DynamicPreview';
import PersistenceStatus from '../components/PersistenceStatus';
import ComponentHistory from '../components/ComponentHistory';
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
  } = useSessionChatStore();
  
  const {
    setComponents,
    addComponent,
    clearError: clearComponentError,
  } = useSessionComponentStore();
  
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

      // Check if this is a follow-up prompt (modifying existing component)
      const hasExistingComponent = code.jsx && code.css;
      const isFollowUpPrompt = hasExistingComponent && messages.length > 0;
      
      // Prepare AI request with context
      let promptText = userPrompt;
      let imagePart = [];
      
      if (isFollowUpPrompt) {
        // For follow-up prompts, include the current component code
        promptText = `I have an existing React component. Please modify it according to this request: "${userPrompt}"

Current JSX code:
\`\`\`jsx
${code.jsx}
\`\`\`

Current CSS code:
\`\`\`css
${code.css}
\`\`\`

Please provide the complete updated component with the requested changes.`;
      }
      
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
      const output = await generateComponentWithGemini(promptText, imagePart, isFollowUpPrompt);
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
            isFollowUpPrompt,
            previousComponentExists: hasExistingComponent,
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
        interactionType: isFollowUpPrompt ? 'component_modification' : 'component_generation',
        targetElement: null,
        conversationId,
        relatedMessageId: savedUserMessage?.id || null,
        metadata: {
          isFollowUpPrompt,
          previousComponentExists: hasExistingComponent,
        },
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
            name: isFollowUpPrompt ? 'ModifiedAIComponent' : 'AIComponent',
            jsxCode: parsed.jsx,
            cssCode: parsed.css,
            componentType: isFollowUpPrompt ? 'modified' : 'generated',
            metadata: {
              conversationId,
              generatedFrom: savedUserMessage?.id || null,
              isFollowUpPrompt,
              previousComponentExists: hasExistingComponent,
              modificationPrompt: isFollowUpPrompt ? userPrompt : null,
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
            components: [...(useSessionComponentStore.getState().components || []), { ...componentData, isCurrent: true }],
            interactions: [...(useSessionChatStore.getState().interactions || []), interactionData],
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
      const currentState = useSessionComponentStore.getState();
      saveSessionDataLocally(sessionId, {
        messages: useSessionChatStore.getState().messages,
        components: [...currentState.components, { ...componentData, isCurrent: true }],
        interactions: useSessionChatStore.getState().interactions,
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

  const handleSelectVersion = (component) => {
    setCode({
      jsx: component.jsxCode,
      css: component.cssCode
    });
  };

  const handleRestoreFromMessage = (messageId) => {
    const { restoreComponentFromMessage } = useSessionComponentStore.getState();
    const restoredComponent = restoreComponentFromMessage(messageId);
    
    if (restoredComponent) {
      setCode({
        jsx: restoredComponent.jsxCode,
        css: restoredComponent.cssCode
      });
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
    <div className="h-screen   p-4 gap-4 grid grid-cols-1 md:grid-cols-4">
      {/* Chat Panel */}
      <div className="md:col-span-1 w-full  p-6  flex flex-col  rounded-2xl border-gray-200  drop-shadow-lg max-h-screen overflow-y-auto bg-white">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl flex flex-row gap-2 font-bold text-blue-700"><span className="rounded-lg bg-blue-500 p-2"><StarsIcon className='h-5 w-5 text-blue-50'/ ></span> AI Session Editor</h2>
          <div className="flex items-center gap-4">
            {code.jsx && code.css && (
              <div className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded">
                Component v{useSessionComponentStore.getState().components?.filter(c => c.isCurrent).length || 1}
              </div>
            )}
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
        </div>

        {/* Messages */}
        <div className="flex-1 h-[400px] overflow-y-auto mb-4 space-y-3 pr-2">
          {messages.map((msg, idx) => (
            <div key={msg.id || idx} className={`flex ${msg.type === 'prompt' ? 'justify-start' : 'justify-end'}`}>
              <div className="flex flex-col">
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
                {/* Restore button for user messages that have associated components */}
                {msg.type === 'prompt' && (() => {
                  const { components } = useSessionComponentStore.getState();
                  const hasAssociatedComponent = components.some(comp => 
                    comp.metadata?.generatedFrom === (msg.id || msg.conversationId) ||
                    comp.metadata?.conversationId === (msg.id || msg.conversationId)
                  );
                  
                  return hasAssociatedComponent ? (
                    <div className="mt-1 ml-2">
                      <button
                        onClick={() => handleRestoreFromMessage(msg.id || msg.conversationId)}
                        className="text-xs bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded transition-colors flex items-center gap-1"
                        title="Restore component from this message"
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        Restore
                      </button>
                    </div>
                  ) : null;
                })()}
              </div>
            </div>
          ))}
          
          {loading && (
            <div className="flex justify-end">
              <div className="rounded-xl px-4 py-3 bg-green-100 text-gray-900 shadow text-sm animate-in flex items-center gap-2">
                <Loader2 className="animate-spin h-4 w-4" />
                {code.jsx && code.css ? 'Modifying component...' : 'Generating component...'}
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

        {/* Component History */}
        <ComponentHistory 
          components={useSessionComponentStore.getState().components}
          onSelectVersion={handleSelectVersion}
        />

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
      <div className="md:col-span-3  rounded-2xl  w-full p-6 max-h-screen overflow-y-hidden  drop-shadow-lg flex flex-col bg-white">
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
            {code.jsx && code.css && useSessionComponentStore.getState().components?.filter(c => c.isCurrent).length > 1 && (
              <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                Modified
              </span>
            )}
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