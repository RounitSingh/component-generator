import { useEffect, useRef } from "react";

const IframePreview = ({ html = "", css = "", js = "", externalCss = [], externalJs = [] }) => {
  const iframeRef = useRef(null);

  useEffect(() => {
    if (!iframeRef.current) {return;}
    const iframeDoc = iframeRef.current.contentDocument || iframeRef.current.contentWindow.document;

    // Base structure
    iframeDoc.open();
    iframeDoc.write(`
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          ${externalCss.map(link => `<link rel="stylesheet" href="${link}" />`).join("\n")}
          <style>
            body { margin: 0; padding: 0; font-family: sans-serif; }
            ${css}
          </style>
        </head>
        <body>
          ${html}
          ${externalJs.map(src => `<script src="${src}"></script>`).join("\n")}
          <script>
            ${js}
          </script>
        </body>
      </html>
    `);
    iframeDoc.close();
  }, [html, css, js, externalCss, externalJs]);

  return (
    <iframe
      ref={iframeRef}
      className="w-full h-full rounded-xl border shadow-md"
      sandbox="allow-scripts allow-same-origin"
      title="Preview"
    />
  );
};

export default IframePreview;
