import React, { useState } from 'react';
import { Copy, Check, Trash2, Briefcase, MessageCircle, Camera, Mail } from 'lucide-react';
import api from '../services/api';

const PlatformIcon = ({ platform }) => {
  switch (platform) {
    case 'linkedin': return <Briefcase className="h-4 w-4 text-accent-500" />;
    case 'twitter': return <MessageCircle className="h-4 w-4 text-primary-400" />;
    case 'instagram': return <Camera className="h-4 w-4 text-[#e879f9]" />;
    case 'email': return <Mail className="h-4 w-4 text-slate-300" />;
    default: return null;
  }
};

const ContentCard = ({ content, onDelete }) => {
  const [copied, setCopied] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleCopy = (platform, text) => {
    navigator.clipboard.writeText(text);
    setCopied(platform);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this content?')) {
      setIsDeleting(true);
      try {
        await api.delete(`/content/${content._id}`);
        onDelete(content._id);
      } catch (error) {
        console.error('Failed to delete content', error);
        alert('Failed to delete content');
      } finally {
        setIsDeleting(false);
      }
    }
  };

  return (
    <div className="bg-dark-surface border border-dark-border rounded-2xl overflow-hidden mb-6 transition-all hover:border-primary-500/30 group">
      <div className="bg-[#0B0F19] px-6 py-4 border-b border-dark-border flex justify-between items-start">
        <div>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-accent-500"></span>
            {new Date(content.createdAt).toLocaleDateString()}
          </p>
          <h3 className="text-lg font-bold text-white line-clamp-1">
            {content.productDescription}
          </h3>
          <div className="flex space-x-2 mt-3">
            <span className="inline-flex items-center px-2.5 py-1 rounded border border-primary-500/30 text-[10px] font-bold bg-primary-600/10 text-primary-400 uppercase tracking-widest">
              {content.tone}
            </span>
            <span className="inline-flex items-center px-2.5 py-1 rounded border border-slate-700 text-[10px] font-bold bg-slate-800 text-slate-300 uppercase tracking-widest">
              Audience: {content.targetAudience}
            </span>
          </div>
        </div>
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="text-slate-500 hover:text-red-400 p-2 rounded-lg hover:bg-red-500/10 transition-colors disabled:opacity-50"
          title="Delete"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
      <div className="p-6">
        <div className="space-y-4">
          {Object.entries(content.generatedContent).map(([platform, text]) => (
            <div key={platform} className="bg-[#0B0F19] rounded-xl p-5 border border-dark-border">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-lg bg-dark-surface border border-dark-border flex items-center justify-center">
                    <PlatformIcon platform={platform} />
                  </div>
                  <span className="font-bold text-white uppercase tracking-wider text-xs">{platform}</span>
                </div>
                <button
                  onClick={() => handleCopy(platform, typeof text === 'object' ? `Subject: ${text.subject}\n\n${text.body}` : text)}
                  className="flex items-center space-x-1 text-xs font-bold text-slate-300 hover:text-white bg-dark-surface hover:bg-slate-800 border border-dark-border px-3 py-1.5 rounded-md transition-colors"
                >
                  {copied === platform ? <Check className="h-3 w-3 text-accent-500" /> : <Copy className="h-3 w-3" />}
                  <span className={copied === platform ? 'text-accent-500' : ''}>{copied === platform ? 'COPIED' : 'COPY'}</span>
                </button>
              </div>
              <div className="text-slate-300 whitespace-pre-wrap text-sm leading-relaxed bg-dark-surface p-4 rounded-lg border border-dark-border font-mono text-xs">
                {typeof text === 'object' ? (
                  <>
                    <strong className="block mb-2 text-primary-400">Subject: {text.subject}</strong>
                    {text.body}
                  </>
                ) : (
                  text
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ContentCard;
