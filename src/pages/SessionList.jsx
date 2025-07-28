/* eslint-disable no-alert */
import React, { useEffect, useState } from 'react';
import { getSessions, deleteSession } from '../utils/api';
import useSessionStore from '../store/sessionStore';
import { useNavigate } from 'react-router-dom';

const SessionList = () => {
  const { sessions, setSessions, removeSession } = useSessionStore();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const fetchSessions = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getSessions();
      setSessions(data);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
      setError('Failed to load sessions.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
    // eslint-disable-next-line
  }, []);

  const handleDelete = async (sessionId) => {
    if (!window.confirm('Delete this session?')) {return;}
    try {
      await deleteSession(sessionId);
      removeSession(sessionId);
    } catch {
      alert('Failed to delete session.');
    }
  }

  if (loading) {
    return <div>Loading sessions...</div>;
  }
  if (error) {
    return <div className="text-red-600">{error}</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Your Sessions</h2>
      {sessions.length === 0 ? (
        <div>No sessions found.</div>
      ) : (
        <ul className="space-y-4">
          {sessions.map(session => (
            <li key={session.id} className="border p-4 rounded flex justify-between items-center">
              <div>
                <div className="font-semibold">Session #{session.id}</div>
                <div className="text-sm text-gray-600">Created: {session.created_at}</div>
                {/* Add more session info here if available */}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => navigate(`/sessions/${session.id}`)}
                  className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                >
                  View
                </button>
                <button
                  onClick={() => handleDelete(session.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SessionList; 