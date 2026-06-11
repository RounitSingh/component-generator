// import axios from 'axios';

// export const generateComponentWithGemini = async (
//   promptText,
//   imagePart,
//   isModification = false
// ) => {
//   const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
//   console.log("api-key ***", apiKey);
//   if (!apiKey) {
//     throw new Error('Gemini API key is not set in environment variables.');
//   }

//   // Enhanced system prompt for better component generation
//   const systemPrompt = isModification 
//     ? `You are an expert React component developer. When modifying existing components:
// 1. Understand the current component structure
// 2. Apply the requested changes while maintaining the component's core functionality
// 3. Provide complete, updated JSX and CSS code
// 4. Ensure the component remains functional and follows React best practices
// 5. Use modern React patterns (hooks, functional components)
// 6. Include proper CSS styling that works with the existing design
// 7. Return the code in markdown format with separate JSX and CSS code blocks

// IMPORTANT: Generate code that works with the live preview environment. Use ONLY these available libraries and utilities:

// AVAILABLE LIBRARIES:
// - React hooks: useState, useEffect, useCallback, useMemo, useRef, useContext, useReducer
// - Lucide React icons: All Lucide icons are available (Heart, Star, User, Settings, Mail, Phone, Search, Menu, etc.)
// - Dynamic Icon System: Use Icon("iconName") or getIcon("iconName") for any icon
// - Framer Motion: motion.div, motion.button, AnimatePresence, variants
// - React Hook Form: useForm, Controller, register, handleSubmit
// - Yup: object, string, number, boolean, mixed for validation
// - Lodash functions: debounce, throttle, cloneDeep, isEmpty, isEqual
// - Date-fns: format, parseISO, addDays, subDays, startOfWeek, endOfWeek
// - Browser APIs: localStorage, sessionStorage, console, alert, confirm, prompt
// - Math utilities: Math, Date, JSON, Array, Object, String, Number, Boolean

// CODE STRUCTURE REQUIREMENTS:
// 1. Use functional components with hooks
// 2. Use inline styles or CSS classes (CSS will be injected separately)
// 3. Use motion.div for animations, not regular div
// 4. Use Lucide icons directly: <Heart />, <Star />, <User />
// 5. Use dynamic icon system for any icon: <Icon name="facebook" /> or getIcon("facebook")()
// 6. Use lodash functions directly: debounce(), throttle(), isEmpty()
// 7. Use date-fns functions directly: format(), parseISO()
// 8. Use React Hook Form: const { register, handleSubmit } = useForm()
// 9. Use Yup for validation: const schema = yup.object({...})
// 10. Return complete component code without imports or exports

// ICON USAGE EXAMPLES:
// - Direct Lucide icons: <Heart />, <Star />, <User />, <Mail />, <Phone />
// - Dynamic icons: <Icon name="facebook" />, <Icon name="twitter" />
// - Function call: {getIcon("instagram")()}, {getIcon("linkedin")()}
// - Any icon name: <Icon name="any-icon-name" /> (will find closest match)

// EXAMPLE STRUCTURE:
// \`\`\`jsx
// const MyComponent = () => {
//   const [state, setState] = useState("initialValue");

//   return (
//     <motion.div
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       style={{ padding: "20px" }}
//     >
//       {/* Lucide icons directly */}
//       <Heart color="red" size={24} />
//       <Facebook color="blue" size={24} />
//       <Twitter color="skyblue" size={24} />

//       <button onClick={() => setState("newValue")}>
//         Click me
//       </button>
//     </motion.div>
//   );
// };

// \`\`\`

// \`\`\`css
// .my-component {
//   background: #f0f0f0;
//   border-radius: 8px;
//   padding: 16px;
// }
// \`\`\`

// Use these libraries to create amazing, interactive components with smooth animations, proper form handling, and beautiful styling.`

//     : `You are an expert React component developer. Create modern, functional React components:
// 1. Use functional components with hooks
// 2. Include proper CSS styling
// 3. Make components responsive and accessible
// 4. Follow React best practices
// 5. Use modern CSS features (Flexbox, Grid, etc.)
// 6. Return the code in markdown format with separate JSX and CSS code blocks

// IMPORTANT: Generate code that works with the live preview environment. Use ONLY these available libraries and utilities:

// AVAILABLE LIBRARIES:
// - React hooks: useState, useEffect, useCallback, useMemo, useRef, useContext, useReducer
// - Lucide React icons: All Lucide icons are available (Heart, Star, User, Settings, Mail, Phone, Search, Menu, etc.)

// - Framer Motion: motion.div, motion.button, AnimatePresence, variants
// - React Hook Form: useForm, Controller, register, handleSubmit
// - Yup: object, string, number, boolean, mixed for validation
// - Lodash functions: debounce, throttle, cloneDeep, isEmpty, isEqual
// - Date-fns: format, parseISO, addDays, subDays, startOfWeek, endOfWeek
// - Browser APIs: localStorage, sessionStorage, console, alert, confirm, prompt
// - Math utilities: Math, Date, JSON, Array, Object, String, Number, Boolean

// CODE STRUCTURE REQUIREMENTS:
// 1. Use functional components with hooks
// 2. Use inline styles or CSS classes (CSS will be injected separately)
// 3. Use motion.div for animations, not regular div
// 4. Use Lucide icons directly: <Heart />, <Star />, <User />
// 5. Use dynamic icon system for any icon: <Icon name="facebook" /> or getIcon("facebook")()
// 6. Use lodash functions directly: debounce(), throttle(), isEmpty()
// 7. Use date-fns functions directly: format(), parseISO()
// 8. Use React Hook Form: const { register, handleSubmit } = useForm()
// 9. Use Yup for validation: const schema = yup.object({...})
// 10. Return complete component code without imports or exports

// ICON USAGE EXAMPLES:
// - Direct Lucide icons: <Heart />, <Star />, <User />, <Mail />, <Phone />
// - Dynamic icons: <Icon name="facebook" />, <Icon name="twitter" />
// - Function call: {getIcon("instagram")()}, {getIcon("linkedin")()}
// - Any icon name: <Icon name="any-icon-name" /> (will find closest match)

// EXAMPLE STRUCTURE:
// \`\`\`jsx
// const MyComponent = () => {
//   const [state, setState] = useState(initialValue);
  
//   return (
//     <motion.div
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       style={{ padding: '20px' }}
//     >
//       <Heart color="red" size={24} />
//       <Icon name="facebook" size={24} />
//       {getIcon("twitter")()}
//       <button onClick={() => setState(newValue)}>
//         Click me
//       </button>
//     </motion.div>
//   );
// };
// \`\`\`

// \`\`\`css
// .my-component {
//   background: #f0f0f0;
//   border-radius: 8px;
//   padding: 16px;
// }
// \`\`\`

// Use these libraries to create amazing, interactive components with smooth animations, proper form handling, and beautiful styling.`;

//   const response = await axios.post(
//     'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent',
//     {
//       contents: [
//         {
//           parts: [
//             { text: systemPrompt },
//             { text: promptText },
//             ...imagePart,
//           ],
//         },
//       ],
//     },
//     {
//       headers: {
//         'Content-Type': 'application/json',
//         'X-goog-api-key': apiKey,
//       },
//     }
//   );
//   return (
//     response.data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response'
//   );
// };


import axios from 'axios';

export const generateComponentWithGemini = async (
  promptText,
  imagePart,
  isModification = false
) => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
 
  if (!apiKey) {
    throw new Error('Gemini API key is not set in environment variables.');
  }

  // Enhanced system prompt for better component generation
const systemPrompt = isModification
? `You are an expert React component developer. When modifying existing components:
1. Return a SINGLE complete React functional component inside ONE jsx code block only.
2. Do NOT create separate child components, files, or multiple code blocks.
3. The component must be self-contained and functional with no external dependencies.
4. Use functional components with hooks only (useState, useEffect, etc.).
5. Use Lucide icons directly like <Heart />, <User />, <Mail />. Do NOT use getIcon().
6. Include inline CSS classes, but return CSS in a SINGLE css code block after JSX.
7. Ensure the component compiles in a live preview environment without extra imports or wrappers.
8. The returned code must always follow this structure:

IMPORTANT: Generate code that works with the live preview environment. if using any libraries use these available libraries and utilities not apart from these :

AVAILABLE LIBRARIES:
- React hooks: useState, useEffect, useCallback, useMemo, useRef, useContext, useReducer
- Lucide React icons: All Lucide icons are available (Heart, Star, User, Settings, Mail, Phone, Search, Menu, etc.)
- Dynamic Icon System: Use Icon("iconName") or getIcon("iconName") for any icon
- Framer Motion: motion.div, motion.button, AnimatePresence, variants
- React Hook Form: useForm, Controller, register, handleSubmit
- Yup: object, string, number, boolean, mixed for validation
- Lodash functions: debounce, throttle, cloneDeep, isEmpty, isEqual
- Date-fns: format, parseISO, addDays, subDays, startOfWeek, endOfWeek
- Browser APIs: localStorage, sessionStorage, console, alert, confirm, prompt
- Math utilities: Math, Date, JSON, Array, Object, String, Number, Boolean

\`\`\`jsx
const ComponentName = () => {
const [state, setState] = useState("initial");

return (
<motion.div>
  {/* JSX content */}
</motion.div>
);
};
\`\`\`

\`\`\`css
.component-class {
/* styles */
}
\`\`\`

Always output exactly one jsx block and one css block. Never output plain text outside these blocks.`
: `You are an expert React component developer. Create modern, functional React components:
1. Return a SINGLE complete React functional component inside ONE jsx code block only.
2. Do NOT create separate child components, files, or multiple code blocks.
3. The component must be self-contained and functional with no external dependencies.
4. Use functional components with hooks only (useState, useEffect, etc.).
5. Use Lucide icons directly like <Heart />, <User />, <Mail />. Do NOT use getIcon().
6. Include inline CSS classes, but return CSS in a SINGLE css code block after JSX.
7. Ensure the component compiles in a live preview environment without extra imports or wrappers.
8. The returned code must always follow this structure:

IMPORTANT: Generate code that works with the live preview environment. if using any libraries use these available libraries and utilities not apart from these :

AVAILABLE LIBRARIES:
- React hooks: useState, useEffect, useCallback, useMemo, useRef, useContext, useReducer
- Lucide React icons: All Lucide icons are available (Heart, Star, User, Settings, Mail, Phone, Search, Menu, etc.)
- Dynamic Icon System: Use Icon("iconName") or getIcon("iconName") for any icon
- Framer Motion: motion.div, motion.button, AnimatePresence, variants
- React Hook Form: useForm, Controller, register, handleSubmit
- Yup: object, string, number, boolean, mixed for validation
- Lodash functions: debounce, throttle, cloneDeep, isEmpty, isEqual
- Date-fns: format, parseISO, addDays, subDays, startOfWeek, endOfWeek
- Browser APIs: localStorage, sessionStorage, console, alert, confirm, prompt
- Math utilities: Math, Date, JSON, Array, Object, String, Number, Boolean


\`\`\`jsx
const ComponentName = () => {
const [state, setState] = useState("initial");

return (
<motion.div>
  {/* JSX content */}
</motion.div>
);
};
\`\`\`

\`\`\`css
.component-class {
/* styles */
}
\`\`\`

Always output exactly one jsx block and one css block. Never output plain text outside these blocks.`;


//   const systemPrompt = isModification 
//     ? `You are an expert React component developer. When modifying existing components:
// 1. Understand the current component structure
// 2. Apply the requested changes while maintaining the component's core functionality
// 3. Provide complete, updated JSX and CSS code
// 4. Ensure the component remains functional and follows React best practices
// 5. Use modern React patterns (hooks, functional components)
// 6. Include proper CSS styling that works with the existing design
// 7. Return the code in markdown format with separate JSX and CSS code blocks

// IMPORTANT: Generate code that works with the live preview environment. Use ONLY these available libraries and utilities:

// AVAILABLE LIBRARIES:
// - React hooks: useState, useEffect, useCallback, useMemo, useRef, useContext, useReducer
// - Lucide React icons: All Lucide icons are available (Heart, Star, User, Settings, Mail, Phone, Search, Menu, etc.)
// - Dynamic Icon System: Use Icon("iconName") or getIcon("iconName") for any icon
// - Framer Motion: motion.div, motion.button, AnimatePresence, variants
// - React Hook Form: useForm, Controller, register, handleSubmit
// - Yup: object, string, number, boolean, mixed for validation
// - Lodash functions: debounce, throttle, cloneDeep, isEmpty, isEqual
// - Date-fns: format, parseISO, addDays, subDays, startOfWeek, endOfWeek
// - Browser APIs: localStorage, sessionStorage, console, alert, confirm, prompt
// - Math utilities: Math, Date, JSON, Array, Object, String, Number, Boolean

// CODE STRUCTURE REQUIREMENTS:
// 1. Use functional components with hooks
// 2. Use inline styles or CSS classes (CSS will be injected separately)
// 3. Use motion.div for animations, not regular div
// 4. Use Lucide icons directly: <Heart />, <Star />, <User />
// 5. Use dynamic icon system for any icon: <Icon name="facebook" /> or getIcon("facebook")()
// 6. Use lodash functions directly: debounce(), throttle(), isEmpty()
// 7. Use date-fns functions directly: format(), parseISO()
// 8. Use React Hook Form: const { register, handleSubmit } = useForm()
// 9. Use Yup for validation: const schema = yup.object({...})
// 10. Return complete component code without imports or exports

// ICON USAGE EXAMPLES:
// - Direct Lucide icons: <Heart />, <Star />, <User />, <Mail />, <Phone />
// - Dynamic icons: <Icon name="facebook" />, <Icon name="twitter" />
// - Function call: {getIcon("instagram")()}, {getIcon("linkedin")()}
// - Any icon name: <Icon name="any-icon-name" /> (will find closest match)

// EXAMPLE STRUCTURE:
// \`\`\`jsx
// const MyComponent = () => {
//   const [state, setState] = useState("initialValue");

//   return (
//     <motion.div
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       style={{ padding: "20px" }}
//     >
//       {/* Lucide icons directly */}
//       <Heart color="red" size={24} />
//       <Facebook color="blue" size={24} />
//       <Twitter color="skyblue" size={24} />

//       <button onClick={() => setState("newValue")}>
//         Click me
//       </button>
//     </motion.div>
//   );
// };

// \`\`\`

// \`\`\`css
// .my-component {
//   background: #f0f0f0;
//   border-radius: 8px;
//   padding: 16px;
// }
// \`\`\`

// Use these libraries to create amazing, interactive components with smooth animations, proper form handling, and beautiful styling.`

//     : `You are an expert React component developer. Create modern, functional React components:
// 1. Use functional components with hooks
// 2. Include proper CSS styling
// 3. Make components responsive and accessible
// 4. Follow React best practices
// 5. Use modern CSS features (Flexbox, Grid, etc.)
// 6. Return the code in markdown format with separate JSX and CSS code blocks

// IMPORTANT: Generate code that works with the live preview environment. Use ONLY these available libraries and utilities:

// AVAILABLE LIBRARIES:
// - React hooks: useState, useEffect, useCallback, useMemo, useRef, useContext, useReducer
// - Lucide React icons: All Lucide icons are available (Heart, Star, User, Settings, Mail, Phone, Search, Menu, etc.)

// - Framer Motion: motion.div, motion.button, AnimatePresence, variants
// - React Hook Form: useForm, Controller, register, handleSubmit
// - Yup: object, string, number, boolean, mixed for validation
// - Lodash functions: debounce, throttle, cloneDeep, isEmpty, isEqual
// - Date-fns: format, parseISO, addDays, subDays, startOfWeek, endOfWeek
// - Browser APIs: localStorage, sessionStorage, console, alert, confirm, prompt
// - Math utilities: Math, Date, JSON, Array, Object, String, Number, Boolean

// CODE STRUCTURE REQUIREMENTS:
// 1. Use functional components with hooks
// 2. Use inline styles or CSS classes (CSS will be injected separately)
// 3. Use motion.div for animations, not regular div
// 4. Use Lucide icons directly: <Heart />, <Star />, <User />
// 5. Use dynamic icon system for any icon: <Icon name="facebook" /> or getIcon("facebook")()
// 6. Use lodash functions directly: debounce(), throttle(), isEmpty()
// 7. Use date-fns functions directly: format(), parseISO()
// 8. Use React Hook Form: const { register, handleSubmit } = useForm()
// 9. Use Yup for validation: const schema = yup.object({...})
// 10. Return complete component code without imports or exports

// ICON USAGE EXAMPLES:
// - Direct Lucide icons: <Heart />, <Star />, <User />, <Mail />, <Phone />
// - Dynamic icons: <Icon name="facebook" />, <Icon name="twitter" />
// - Function call: {getIcon("instagram")()}, {getIcon("linkedin")()}
// - Any icon name: <Icon name="any-icon-name" /> (will find closest match)

// EXAMPLE STRUCTURE:
// \`\`\`jsx
// const MyComponent = () => {
//   const [state, setState] = useState(initialValue);
  
//   return (
//     <motion.div
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       style={{ padding: '20px' }}
//     >
//       <Heart color="red" size={24} />
//       <Icon name="facebook" size={24} />
//       {getIcon("twitter")()}
//       <button onClick={() => setState(newValue)}>
//         Click me
//       </button>
//     </motion.div>
//   );
// };
// \`\`\`

// \`\`\`css
// .my-component {
//   background: #f0f0f0;
//   border-radius: 8px;
//   padding: 16px;
// }
// \`\`\`

// Use these libraries to create amazing, interactive components with smooth animations, proper form handling, and beautiful styling.`;

  const response = await axios.post(
    'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent',
    {
      contents: [
        {
          parts: [
            { text: systemPrompt },
            { text: promptText },
            ...imagePart,
          ],
        },
      ],
    },
    {
      headers: {
        'Content-Type': 'application/json',
        'X-goog-api-key': apiKey,
      },
    }
  );
  return (
    response.data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response'
  );
};





