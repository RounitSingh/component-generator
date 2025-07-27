
/* eslint-disable no-useless-escape */

// import { LiveProvider, LiveEditor, LiveError, LivePreview } from 'react-live'
// import * as React from 'react';

// const scope = { React, useState: React.useState };
// const preprocessCode = (code) => {
//   try {
//     // Remove all import/export statements
//     let cleaned = code.replace(/^[ \t]*import[^;]*;?$/gm, '')
//       .replace(/^[ \t]*export[^;]*;?$/gm, '')
//       .replace(/export\s+default\s+/g, '');

//     // Convert function declarations to arrow function expressions
//     cleaned = cleaned.replace(
//       /function\s+([A-Za-z0-9_]+)\s*\(([^)]*)\)\s*{([\s\S]*?)}\s*(?=<|$)/g,
//       (match, name, params, body) => {
//         return `const ${name} = (${params}) => {${body}}`;
//       }
//     );

//     // Remove extra semicolons and whitespace
//     cleaned = cleaned.replace(/;+\s*\n/g, '\n').replace(/\n{3,}/g, '\n\n').trim();

//     // Try to find a component name (arrow or function expression)
//     const match = cleaned.match(/const\s+([A-Za-z0-9_]+)\s*=\s*\(/);
//     if (match) {
//       const componentName = match[1];
//       // Check if the code already renders the component
//       const renderRegex = new RegExp(`<${componentName} ?/?>`);
//       if (!renderRegex.test(cleaned)) {
//         cleaned += `\n\nrender(<${componentName} />)`;
//       }
//     }

//     return { code: cleaned, error: null };
//   } catch (err) {
//     return { code: '', error: err.message };
//   }
// };


// const DynamicPreview = ({ jsx,css}) => {
//   console.log('DynamicPreview received css:', css);
//   console.log('DynamicPreview received jsx:', jsx);
//   const { code: processedCode, error: preprocessError } = preprocessCode(jsx);
//   return (
    
//     <LiveProvider code={processedCode} scope={scope} noInline>
//       <div className="grid grid-cols-1 gap-4">
//         <LiveEditor className="font-mono text-base p-4 bg-gray-900 text-white rounded-md border border-gray-700" />
//         <div className="p-4 bg-gray-100 rounded-md border border-gray-300">
//           <LivePreview className="mb-2" />
//           <LiveError error={preprocessError} className="text-red-600" />
//         </div>
//       </div>
//     </LiveProvider>
//   );
// };

// export default DynamicPreview; 



import { LiveProvider, LiveEditor, LiveError, LivePreview } from 'react-live';
import * as React from 'react';

const scope = { React, useState: React.useState };

const preprocessCode = (code) => {
  try {
    // Remove import/export statements
    let cleaned = code
      .replace(/^[ \t]*import[^;]*;?$/gm, '')
      .replace(/^[ \t]*export[^;]*;?$/gm, '')
      .replace(/export\s+default\s+/g, '');

    // Convert function declarations to arrow functions
    cleaned = cleaned.replace(
      /function\s+([A-Za-z0-9_]+)\s*\(([^)]*)\)\s*{([\s\S]*?)}\s*(?=<|$)/g,
      (match, name, params, body) => {
        return `const ${name} = (${params}) => {${body}}`;
      }
    );

    // Clean up extra semicolons and newlines
    cleaned = cleaned.replace(/;+\s*\n/g, '\n').replace(/\n{3,}/g, '\n\n').trim();

    // Try to find a component name
    const match = cleaned.match(/const\s+([A-Za-z0-9_]+)\s*=\s*\(/);
    if (match) {
      const componentName = match[1];
      const renderRegex = new RegExp(`<${componentName} ?/?>`);
      if (!renderRegex.test(cleaned)) {
        cleaned += `\n\nrender(<${componentName} />)`;
      }
    }

    return { code: cleaned, error: null };
  } catch (err) {
    return { code: '', error: err.message };
  }
};

// Inject CSS into the document head
const injectCSS = (css) => {
  const existing = document.getElementById('live-preview-style');
  if (existing) { 
    existing.remove(); // remove previous
  }

  const style = document.createElement('style');
  style.id = 'live-preview-style';
  style.textContent = css || '';
  document.head.appendChild(style);
};

const DynamicPreview = ({ jsx, css }) => {
  React.useEffect(() => {
    injectCSS(css);
  }, [css]);

  const { code: processedCode, error: preprocessError } = preprocessCode(jsx);

  return (
    <LiveProvider code={processedCode} scope={scope} noInline>
      <div className="grid grid-cols-1 gap-4">
        
        <div className="p-4 bg-gray-100 rounded-md border border-gray-300">
          <LivePreview className="mb-2" />
          <LiveError className="text-red-600" />
          {preprocessError && <div className="text-red-500">{preprocessError}</div>}
        </div>
      </div>
    </LiveProvider>
  );
};

export default DynamicPreview;
