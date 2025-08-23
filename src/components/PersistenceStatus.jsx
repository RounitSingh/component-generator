import React from 'react';
import { CheckCircle, AlertCircle, Clock, Save } from 'lucide-react';

const PersistenceStatus = ({ 
  isSaving, 
  lastSaved, 
  error, 
  isOnline = true,
  className = '' 
}) => {
  const getStatusIcon = () => {
    if (error) {
      return <AlertCircle className="h-4 w-4 text-red-500" />;
    }
    if (isSaving) {
      return <Clock className="h-4 w-4 text-yellow-500 animate-spin" />;
    }
    if (lastSaved) {
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    }
    return <Save className="h-4 w-4 text-gray-400" />;
  };

  const getStatusText = () => {
    if (error) {
      return 'Save failed';
    }
    if (isSaving) {
      return 'Saving...';
    }
    if (lastSaved) {
      return `Saved ${new Date(lastSaved).toLocaleTimeString()}`;
    }
    return 'Not saved';
  };

  const getStatusColor = () => {
    if (error) {
      return 'text-red-600';
    }
    if (isSaving) {
      return 'text-yellow-600';
    }
    if (lastSaved) {
      return 'text-green-600';
    }
    return 'text-gray-500';
  };

  return (
    <div className={`flex items-center gap-2 text-sm ${className}`}>
      {getStatusIcon()}
      <span className={getStatusColor()}>
        {getStatusText()}
      </span>
      {!isOnline && (
        <span className="text-orange-600 text-xs">
          (Offline)
        </span>
      )}
    </div>
  );
};

export default PersistenceStatus;


