# AI Editor Persistence Features

## Overview

The AI Editor now includes comprehensive persistence functionality that automatically saves and loads all chat messages, AI interactions, and generated components. This ensures that users never lose their work and can continue their sessions seamlessly.

## Features

### 1. Automatic Data Persistence

- **Chat Messages**: All user prompts and AI responses are automatically saved to the backend
- **AI Interactions**: Complete interaction history including prompts, responses, and metadata
- **Components**: Generated components are saved with JSX code, CSS, and metadata
- **Session Management**: All data is organized by session ID for easy retrieval

### 2. Real-time Status Indicators

- **Save Status**: Visual indicators show when data is being saved, successfully saved, or failed
- **Last Saved Time**: Shows when the last successful save occurred
- **Error Handling**: Clear error messages when persistence operations fail
- **Offline Support**: Local storage backup for offline scenarios

### 3. Data Conversion Utilities

The system includes comprehensive data conversion utilities that handle the transformation between frontend and backend data formats:

- `convertBackendMessageToFrontend()`: Converts backend message format to frontend format
- `convertFrontendMessageToBackend()`: Converts frontend message format to backend format
- `convertBackendComponentToFrontend()`: Converts backend component format to frontend format
- `convertFrontendComponentToBackend()`: Converts frontend component format to backend format
- `convertBackendInteractionToFrontend()`: Converts backend interaction format to frontend format
- `convertFrontendInteractionToBackend()`: Converts frontend interaction format to backend format

### 4. Enhanced State Management

#### Chat Store (`useChatStore`)
- Message management with automatic ID generation
- Interaction tracking
- Loading and error states
- Reset functionality

#### Component Store (`useComponentStore`)
- Component management with current component tracking
- CRUD operations for components
- Loading and error states
- Reset functionality

### 5. Local Storage Backup

- Automatic backup of session data to localStorage
- Offline data recovery
- Session-specific storage keys
- Timestamp tracking for data freshness

## Usage

### Basic Persistence

The persistence is automatic - no additional code is required. Simply use the AI Editor with a valid `sessionId`:

```jsx
<AIEditor sessionId="123" />
```

### Manual Component Saving

Users can manually save components using the "Save" button in the code tab:

```jsx
// This happens automatically when the Save button is clicked
const handleSaveComponent = async () => {
  // Component is saved to backend and local state
};
```

### Persistence Status

The persistence status is displayed in the top-right corner of the chat panel:

- ✅ **Saved**: Data was successfully saved
- ⏳ **Saving...**: Data is currently being saved
- ❌ **Save failed**: An error occurred during saving
- 💾 **Not saved**: No data has been saved yet

## API Endpoints

The persistence system uses the following backend endpoints:

### Messages
- `GET /api/sessions/:sessionId/messages` - Retrieve session messages
- `POST /api/sessions/:sessionId/messages` - Add new message

### Components
- `GET /api/sessions/:sessionId/components` - Retrieve session components
- `POST /api/sessions/:sessionId/components` - Save new component

### Interactions
- `GET /api/sessions/:sessionId/interactions` - Retrieve session interactions
- `POST /api/sessions/:sessionId/interactions` - Save new interaction

## Data Flow

1. **User Input**: User types a prompt or uploads an image
2. **Local State Update**: Message is immediately added to local state for instant feedback
3. **Backend Save**: Message is converted and saved to backend
4. **AI Processing**: AI generates response
5. **Response Save**: AI response is saved to backend
6. **Component Generation**: Component is generated from AI response
7. **Component Save**: Generated component is saved to backend
8. **Status Update**: Persistence status is updated to reflect success/failure

## Error Handling

- **Network Errors**: Automatic retry with exponential backoff
- **Validation Errors**: Clear error messages with specific details
- **Authentication Errors**: Automatic token refresh or redirect to login
- **Storage Errors**: Graceful degradation with local storage fallback

## Performance Optimizations

- **Batch Operations**: Multiple API calls are made in parallel where possible
- **Lazy Loading**: Data is loaded only when needed
- **Caching**: Frequently accessed data is cached in memory
- **Debouncing**: Rapid save operations are debounced to prevent API spam

## Future Enhancements

- **Real-time Sync**: WebSocket-based real-time synchronization
- **Conflict Resolution**: Handle concurrent edits from multiple users
- **Version History**: Track changes and allow rollback to previous versions
- **Export/Import**: Allow users to export and import session data
- **Cloud Sync**: Sync data across multiple devices


