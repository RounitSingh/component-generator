import React from 'react';
import { History, ArrowRight } from 'lucide-react';

const ComponentHistory = ({ components, onSelectVersion }) => {
  if (!components || components.length <= 1) {
    return null;
  }

  const currentComponents = components.filter(comp => comp.isCurrent);
  const versionHistory = currentComponents.map((comp, index) => ({
    ...comp,
    version: index + 1,
    isLatest: index === currentComponents.length - 1
  }));

  return (
    <div className="bg-gray-50 rounded-lg p-3 mb-4">
      <div className="flex items-center gap-2 mb-2">
        <History className="h-4 w-4 text-gray-600" />
        <span className="text-sm font-medium text-gray-700">Component History</span>
      </div>
      <div className="flex items-center gap-2 flex-wrap">
        {versionHistory.map((comp, index) => (
          <React.Fragment key={comp.id || index}>
            <button
              onClick={() => onSelectVersion(comp)}
              className={`px-2 py-1 text-xs rounded border transition-colors ${
                comp.isLatest
                  ? 'bg-blue-100 border-blue-300 text-blue-700'
                  : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'
              }`}
            >
              v{comp.version}
              {comp.metadata?.modificationPrompt && (
                <span className="ml-1 text-gray-500">({comp.metadata.modificationPrompt.substring(0, 20)}...)</span>
              )}
            </button>
            {index < versionHistory.length - 1 && (
              <ArrowRight className="h-3 w-3 text-gray-400" />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default ComponentHistory;
