# TesyBook Frontend

A modern React application with AI-powered chatbot functionality, built with Vite and Tailwind CSS.

## 🚀 Features

- **AI Chatbot**: Powered by Google Gemini API for code generation and assistance
- **Modern UI**: Beautiful, responsive design with Tailwind CSS
- **Real-time Chat**: Interactive chat interface with code syntax highlighting
- **Secure**: API key management with local storage
- **Responsive**: Works perfectly on desktop and mobile devices

## 🛠️ Tech Stack

- **Frontend**: React 19 with Vite
- **Styling**: Tailwind CSS
- **AI**: Google Gemini API
- **Icons**: Lucide React
- **Routing**: React Router DOM
- **State Management**: React Hooks + Zustand

## 📦 Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp env.example .env
# Edit .env and add your Gemini API key
```

4. Start the development server:
```bash
npm run dev
```

5. Open [http://localhost:5173](http://localhost:5173) in your browser.

## 🤖 AI Chatbot Setup

The chatbot requires a Google Gemini API key. See [CHATBOT_SETUP.md](./CHATBOT_SETUP.md) for detailed setup instructions.

### Quick Setup:
1. Get your API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Add it to your `.env` file: `VITE_GEMINI_API_KEY=your_key_here`
3. Visit `/chatbot` to start using the AI assistant

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
├── pages/              # Page components
│   ├── Home.jsx        # Home page
│   ├── Login.jsx       # Login page
│   ├── Signup.jsx      # Signup page
│   └── Chatbot.jsx     # AI Chatbot page
├── assets/             # Static assets
├── App.jsx             # Main app component
└── main.jsx            # App entry point
```

## 🎯 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues
- `npm run format` - Format code with Prettier

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

### Tailwind CSS

The project uses Tailwind CSS v4 with PostCSS. Configuration is in `tailwind.config.js`.

## 🚀 Deployment

1. Build the project:
```bash
npm run build
```

2. Deploy the `dist` folder to your hosting provider.

## 📚 Documentation

- [Chatbot Setup Guide](./CHATBOT_SETUP.md) - Detailed AI chatbot setup and usage
- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is open source and available under the MIT License.
