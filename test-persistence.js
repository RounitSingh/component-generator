// Test script for AI Editor Persistence System
// Run this in the browser console to test the persistence functionality

const testPersistence = async () => {
  console.log('🧪 Starting AI Editor Persistence Tests...');
  
  // Test 1: Check if stores are properly initialized
  console.log('\n📋 Test 1: Store Initialization');
  try {
    const chatStore = window.useChatStoreTesting?.getState();
    const componentStore = window.useComponentStoreTesting?.getState();
    
    if (chatStore && componentStore) {
      console.log('✅ Stores are properly initialized');
      console.log('Chat Store:', chatStore);
      console.log('Component Store:', componentStore);
    } else {
      console.log('❌ Stores not found');
    }
  } catch (error) {
    console.error('❌ Store initialization test failed:', error);
  }

  // Test 2: Test data conversion utilities
  console.log('\n🔄 Test 2: Data Conversion Utilities');
  try {
    // Test message conversion
    const backendMessage = {
      id: 1,
      role: 'user',
      content: 'Create a button component',
      message_type: 'text',
      metadata: { image: null },
      created_at: new Date().toISOString(),
    };

    const frontendMessage = window.convertBackendMessageToFrontend?.(backendMessage);
    if (frontendMessage && frontendMessage.type === 'prompt') {
      console.log('✅ Message conversion working');
    } else {
      console.log('❌ Message conversion failed');
    }

    // Test component conversion
    const backendComponent = {
      id: 1,
      name: 'TestComponent',
      jsx_code: '<button>Click me</button>',
      css_code: 'button { color: blue; }',
      component_type: 'generated',
      is_current: true,
      metadata: {},
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const frontendComponent = window.convertBackendComponentToFrontend?.(backendComponent);
    if (frontendComponent && frontendComponent.jsxCode) {
      console.log('✅ Component conversion working');
    } else {
      console.log('❌ Component conversion failed');
    }
  } catch (error) {
    console.error('❌ Data conversion test failed:', error);
  }

  // Test 3: Test local storage utilities
  console.log('\n💾 Test 3: Local Storage Utilities');
  try {
    const testData = { test: 'data', timestamp: Date.now() };
    const sessionId = 'test-session-123';
    
    // Test save
    const saveResult = window.saveSessionDataLocally?.(sessionId, testData);
    if (saveResult) {
      console.log('✅ Local storage save working');
    } else {
      console.log('❌ Local storage save failed');
    }

    // Test load
    const loadResult = window.loadSessionDataLocally?.(sessionId);
    if (loadResult && loadResult.test === 'data') {
      console.log('✅ Local storage load working');
    } else {
      console.log('❌ Local storage load failed');
    }
  } catch (error) {
    console.error('❌ Local storage test failed:', error);
  }

  // Test 4: Test API endpoints (if authenticated)
  console.log('\n🌐 Test 4: API Endpoints');
  try {
    const token = localStorage.getItem('accessToken');
    if (token) {
      console.log('✅ User is authenticated');
      
      // Test getting sessions
      const sessions = await window.getSessions?.();
      if (sessions && Array.isArray(sessions)) {
        console.log('✅ Sessions API working');
        console.log('Found sessions:', sessions.length);
      } else {
        console.log('❌ Sessions API failed');
      }
    } else {
      console.log('⚠️ User not authenticated - skipping API tests');
    }
  } catch (error) {
    console.error('❌ API test failed:', error);
  }

  // Test 5: Test persistence status component
  console.log('\n📊 Test 5: Persistence Status Component');
  try {
    const statusProps = {
      isSaving: false,
      lastSaved: Date.now(),
      error: null,
      isOnline: true,
    };
    
    console.log('✅ Persistence status props:', statusProps);
  } catch (error) {
    console.error('❌ Persistence status test failed:', error);
  }

  console.log('\n🎉 Persistence Tests Complete!');
  console.log('\n📝 Next Steps:');
  console.log('1. Create a new session');
  console.log('2. Send a prompt to generate a component');
  console.log('3. Refresh the page to verify data persistence');
  console.log('4. Check the browser console for any errors');
};

// Test persistence utilities
const testPersistenceUtilities = () => {
  console.log('🔧 Testing Persistence Utilities...');
  
  // Test message conversion
  const testBackendMessage = {
    id: 1,
    role: 'user',
    content: 'Test message',
    message_type: 'text',
    metadata: {},
    created_at: new Date().toISOString(),
  };

  const testFrontendMessage = {
    type: 'prompt',
    text: 'Test message',
    image: null,
  };

  // Test component conversion
  const testBackendComponent = {
    id: 1,
    name: 'TestComponent',
    jsx_code: '<div>Test</div>',
    css_code: 'div { color: red; }',
    component_type: 'generated',
    is_current: true,
    metadata: {},
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const testFrontendComponent = {
    name: 'TestComponent',
    jsxCode: '<div>Test</div>',
    cssCode: 'div { color: red; }',
    componentType: 'generated',
    metadata: {},
  };

  // Test interaction conversion
  const testBackendInteraction = {
    id: 1,
    prompt: 'Test prompt',
    response: 'Test response',
    interaction_type: 'component_generation',
    target_element: null,
    metadata: {},
    created_at: new Date().toISOString(),
  };

  const testFrontendInteraction = {
    prompt: 'Test prompt',
    response: 'Test response',
    interactionType: 'component_generation',
    targetElement: null,
    metadata: {},
  };

  console.log('Test data prepared:', {
    backendMessage: testBackendMessage,
    frontendMessage: testFrontendMessage,
    backendComponent: testBackendComponent,
    frontendComponent: testFrontendComponent,
    backendInteraction: testBackendInteraction,
    frontendInteraction: testFrontendInteraction,
  });
};

// Export test functions to global scope
window.testPersistence = testPersistence;
window.testPersistenceUtilities = testPersistenceUtilities;

console.log('🧪 Persistence test functions loaded!');
console.log('Run testPersistence() to start testing');
console.log('Run testPersistenceUtilities() to test utilities');





