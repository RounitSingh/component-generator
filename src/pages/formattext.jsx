// const formatMessageWithCode = (text) => {
//   if (!text) {return null};
  
//   // Split text into parts, separating code blocks
//   const parts = text.split(/(```[\s\S]*?```)/g);
  
//   return parts.map((part, index) => {
//     if (part.startsWith('```') && part.endsWith('```')) {
//       // Extract language and code content
//       const codeMatch = part.match(/```(\w+)?\n?([\s\S]*?)```/);
//       if (!codeMatch) {return part};
      
//       const language = codeMatch[1] || 'text';
//       const codeContent = codeMatch[2].trim();
      
//       return (
//         <div key={index} className="my-3 rounded-lg overflow-hidden border border-slate-200 bg-slate-50">
//           <div className="bg-slate-800 text-slate-200 px-4 py-2 text-xs font-medium flex justify-between items-center">
//             <span className="font-mono">{language.toUpperCase()}</span>
//             <button 
//               onClick={() => copyToClipboard(codeContent)}
//               className="text-slate-300 hover:text-white flex items-center gap-1 text-xs font-sans"
//             >
//               <Copy size={12} /> Copy
//             </button>
//           </div>
//           <pre className="p-4 overflow-x-auto text-xs">
//             <code className={`font-mono block ${language === 'css' ? 'language-css' : 'language-jsx'}`}>
//               {codeContent}
//             </code>
//           </pre>
//         </div>
//       );
//     }
    
//     // Regular text with proper line breaks
//     return (
//       <div key={index} className="whitespace-pre-wrap break-words font-sans">
//         {part}
//       </div>
//     );
//   });
// };

const copyToClipboard = async (text) => {
    try {
        await navigator.clipboard.writeText(text);
    } catch {
        // Failed to copy to clipboard
    }
};


export const formatMessageWithCode = (text) => {
  if (!text) {return null};
  
  // Split text into parts, separating code blocks
  const parts = text.split(/(```[\s\S]*?```)/g);
  
  return parts.map((part, index) => {
    if (part.startsWith('```') && part.endsWith('```')) {
      // Extract language and code content
      const codeMatch = part.match(/```(\w+)?\n?([\s\S]*?)```/);
      if (!codeMatch){ return part};
      
      const language = codeMatch[1] || 'text';
      const codeContent = codeMatch[2].trim();
      
      return (
        <div key={index} className="my-3 rounded-lg overflow-hidden border border-slate-700 bg-slate-900">
          <div className="bg-slate-800 text-slate-200 px-4 py-2 text-xs font-medium flex justify-between items-center">
            <span className="font-mono">{language.toUpperCase()}</span>
            <button 
              onClick={() => copyToClipboard(codeContent)}
              className="text-slate-300 hover:text-white flex items-center gap-1 text-xs font-sans"
            >
              <Copy size={12} /> Copy
            </button>
          </div>
          <pre className="p-4 overflow-x-auto text-xs bg-slate-900">
            <code className={`font-mono block text-slate-200 ${language === 'css' ? 'language-css' : 'language-jsx'}`}>
              {codeContent}
            </code>
          </pre>
        </div>
      );
    }
    
    // Regular text with proper line breaks
    return (
      <div key={index} className="whitespace-pre-wrap break-words text-slate-200">
        {part}
    </div>
    );
  });
};