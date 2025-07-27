# AI Chatbot Setup Guide

This project includes a powerful AI chatbot powered by Google's Gemini API that can generate code, explain concepts, and help with debugging.

## Features

- 🤖 **AI-Powered Code Generation**: Generate code snippets, components, and full applications
- 💬 **Real-time Chat Interface**: Clean, modern chat UI with message history
- 📝 **Code Syntax Highlighting**: Beautiful code display with syntax highlighting
- 📋 **One-Click Copy**: Copy generated code with a single click
- 🔐 **Secure API Key Management**: Local storage for API key with easy management
- 📱 **Responsive Design**: Works perfectly on desktop and mobile devices
- 🎨 **Modern UI**: Beautiful gradient design with smooth animations

## Setup Instructions

### 1. Get Your Gemini API Key

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the generated API key

### 2. Configure Environment Variables

1. Copy the `.env.example` file to `.env`:
   ```bash
   cp env.example .env
   ```

2. Edit the `.env` file and replace `your_gemini_api_key_here` with your actual API key:
   ```
   VITE_GEMINI_API_KEY=your_actual_api_key_here
   ```

### 3. Install Dependencies

The required dependencies are already installed, but if you need to reinstall:

```bash
npm install @google/generative-ai react-syntax-highlighter
```

### 4. Start the Development Server

```bash
npm run dev
```

### 5. Access the Chatbot

Navigate to `http://localhost:5173/chatbot` in your browser.

## How to Use

### First Time Setup
1. When you first visit the chatbot, you'll see an API key input screen
2. Enter your Gemini API key and click "Get Started"
3. The API key will be securely stored in your browser's local storage

### Using the Chatbot
1. **Left Panel**: Type your prompts in the chat input area
2. **Right Panel**: Generated code will appear here with syntax highlighting
3. **Examples**:
   - "Create a red button with hover effects"
   - "Build a React component for a todo list"
   - "Write a function to sort an array of objects"
   - "Create a responsive navigation bar"

### Features
- **Enter**: Send message
- **Shift + Enter**: New line in input
- **Copy Code**: Click the copy button on any code block
- **Clear Chat**: Remove all conversation history
- **Change API Key**: Update your API key anytime

## Edge Cases Handled

### Error Handling
- ✅ Invalid API key detection
- ✅ Network connection errors
- ✅ API rate limiting
- ✅ Malformed responses
- ✅ Empty or invalid prompts

### User Experience
- ✅ Loading states with spinners
- ✅ Auto-scroll to latest messages
- ✅ Responsive design for all screen sizes
- ✅ Keyboard shortcuts (Enter to send)
- ✅ Copy feedback (shows "Copied!" confirmation)
- ✅ Message timestamps
- ✅ Code block language detection

### Security
- ✅ API key stored in local storage (not in code)
- ✅ Option to change API key anytime
- ✅ No sensitive data in URLs or logs

## API Key Management

### Storing API Key
- API keys are stored in browser's local storage
- Keys are never sent to our servers
- Keys persist across browser sessions

### Changing API Key
1. Click "Change API Key" in the chatbot header
2. Enter your new API key
3. Click "Get Started"

### Security Best Practices
- Never commit your `.env` file to version control
- Use different API keys for development and production
- Regularly rotate your API keys
- Monitor your API usage in Google AI Studio

## Troubleshooting

### Common Issues

**"API key not found" error**
- Make sure you've entered the API key correctly
- Check that the `.env` file is in the project root
- Restart the development server after adding the API key

**"Network error" or "Failed to fetch"**
- Check your internet connection
- Verify the API key is valid
- Check if you've exceeded API rate limits

**Code not generating properly**
- Try rephrasing your prompt
- Be more specific about what you want
- Check the browser console for error messages

### Getting Help
- Check the browser console for detailed error messages
- Verify your API key is working in Google AI Studio
- Try clearing your browser's local storage and re-entering the API key

## Example Prompts

### Code Generation
- "Create a React button component with TypeScript"
- "Write a CSS grid layout for a photo gallery"
- "Build a JavaScript function to validate email addresses"
- "Create a responsive navigation menu with hamburger icon"

### Code Explanation
- "Explain how React hooks work"
- "What's the difference between let, const, and var?"
- "How does CSS Flexbox work?"
- "Explain async/await in JavaScript"

### Debugging Help
- "Why is my React component not re-rendering?"
- "How do I fix this CSS layout issue?"
- "What's wrong with this JavaScript code?"
- "How do I handle API errors in React?"

## Technical Details

### Dependencies
- `@google/generative-ai`: Google's official Gemini API client
- `react-syntax-highlighter`: Code syntax highlighting
- `lucide-react`: Beautiful icons
- `react-router-dom`: Navigation and routing

### Architecture
- **Frontend**: React with Vite
- **Styling**: Tailwind CSS
- **State Management**: React hooks (useState, useEffect)
- **API**: Google Gemini Pro model
- **Storage**: Browser localStorage for API key

### Performance Optimizations
- Lazy loading of syntax highlighter
- Debounced input handling
- Efficient re-rendering with React hooks
- Optimized bundle size with Vite

## Contributing

To add features or fix issues:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the MIT License. 