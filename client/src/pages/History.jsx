import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import ContentCard from '../components/ContentCard';
import { PlusCircle, Loader2 } from 'lucide-react';

const History = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await api.get('/content/history');
      setHistory(res.data);
    } catch (err) {
      setError('Failed to fetch history');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (deletedId) => {
    setHistory(history.filter(item => item._id !== deletedId));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <Loader2 className="h-8 w-8 text-primary-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Campaign History</h1>
          <p className="mt-1 text-slate-400 text-sm">View and manage your generated marketing materials.</p>
        </div>
        <Link 
          to="/generate" 
          className="bg-primary-600 hover:bg-primary-500 text-white px-5 py-2.5 rounded-lg text-sm font-bold transition-all shadow-sm flex items-center space-x-2"
        >
          <PlusCircle className="h-4 w-4" />
          <span>New Content</span>
        </Link>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-4 rounded-xl mb-6">
          {error}
        </div>
      )}

      {history.length === 0 ? (
        <div className="text-center py-20 bg-dark-surface rounded-2xl border border-dark-border border-dashed">
          <h3 className="text-lg font-medium text-white mb-2">No content yet</h3>
          <p className="text-slate-400 mb-6 max-w-sm mx-auto text-sm">Get started by generating your first piece of multi-platform marketing content.</p>
          <Link 
            to="/generate" 
            className="inline-flex items-center space-x-2 bg-primary-600 hover:bg-primary-500 text-white px-6 py-3 rounded-lg font-bold transition-all"
          >
            <PlusCircle className="h-4 w-4" />
            <span>Generate Now</span>
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {history.map((content) => (
            <ContentCard key={content._id} content={content} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  );
};

export default History;
