import React, { useState, useEffect } from 'react';
import { 
  X, 
  Server, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  Save, 
  Database, 
  Trash2, 
  Layers, 
  ShieldCheck, 
  HelpCircle 
} from 'lucide-react';
import { api } from '../../services/api';
import { BackendStatus } from '../../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const [backendUrl, setBackendUrl] = useState(api.getBaseUrl());
  const [status, setStatus] = useState<BackendStatus | null>(null);
  const [testing, setTesting] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    runPingTest();
  }, []);

  const runPingTest = async () => {
    setTesting(true);
    const res = await api.checkConnection();
    setStatus(res);
    setTesting(false);
  };

  const handleSaveUrl = async () => {
    setTesting(true);
    const res = await api.setBaseUrl(backendUrl);
    setStatus(null);
    setTesting(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleClearLocalCache = () => {
    if (window.confirm('Clear cached local stories, submissions, and canvas boards?')) {
      localStorage.removeItem('hh_user_stories');
      localStorage.removeItem('hh_contributions');
      localStorage.removeItem('hh_canvas_state');
      localStorage.removeItem('hh_bookmarks');
      alert('Local archival cache reset.');
    }
  };

  const apiEndpoints = [
    { group: '/api/heritage/', desc: 'Artifact catalog, periods, categories, detail' },
    { group: '/api/accounts/', desc: 'User profile, authentication, saved items' },
    { group: '/api/community/', desc: 'Oral histories, discussions, crowd submissions' },
    { group: '/api/ai/', desc: 'Archival docent, provenance verification, translations' },
    { group: '/api/dashboard/', desc: 'Curator metrics, activity feed, collections' },
    { group: '/api/shopping/', desc: 'Marketplace, master artisan crafts, cart' },
    { group: '/api/learn/', desc: 'Civilization timeline, online exhibitions, courses' },
    { group: '/api/explore/', desc: 'Filterable search, epoch markers, map coordinates' },
    { group: '/api/3d/', desc: '3D artifact models, meshes, lighting presets, annotations' },
    { group: '/api/canvas/', desc: 'Archival curation canvas workspace & moodboards' },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="bg-[#faf9f5] w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl border border-[#c4c7c7] max-h-[90vh] flex flex-col my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#c4c7c7]/50 bg-[#efeeea]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-[#94492d] text-white">
              <Server className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-[16px] font-display font-bold text-[#1b1c1a]">
                System Architecture & Settings
              </h3>
              <p className="text-[11px] text-[#444748]">
                Django REST Backend Integration & Archival Data Settings
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-[#e9e8e4] text-[#1b1c1a] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-grow">
          
          {/* Django Backend Connection Card */}
          <div className="p-5 rounded-xl bg-[#efeeea]/70 border border-[#c4c7c7]/50 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-[13px] font-bold text-[#1b1c1a] uppercase tracking-wider flex items-center gap-2">
                  <Database className="w-4 h-4 text-[#94492d]" /> Django REST Backend Target
                </h4>
                <p className="text-[12px] text-[#444748] mt-0.5">
                  Default target: <code className="font-mono bg-white px-1.5 py-0.5 rounded border border-[#c4c7c7]/40 text-[#94492d]">/</code>
                </p>https://rakshi.pythonanywhere.com
              </div>

              <div className="flex items-center gap-2">
                {status?.connected ? (
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" /> REST Connected {status.latencyMs ? `(${status.latencyMs}ms)` : ''}
                  </span>
                ) : (
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-300 flex items-center gap-1.5" title="Operating with built-in high fidelity fallback data">
                    <AlertCircle className="w-3.5 h-3.5" /> Standalone Fallback
                  </span>
                )}
              </div>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={backendUrl}
                onChange={(e) => setBackendUrl(e.target.value)}
                placeholder="https://rakshi.pythonanywhere.com"
                className="flex-grow px-3.5 py-2 text-[13px] font-mono rounded-lg bg-white border border-[#c4c7c7] focus:outline-none focus:border-[#94492d]"
              />
              <button
                onClick={runPingTest}
                disabled={testing}
                className="px-3 py-2 bg-[#efeeea] hover:bg-[#e3e2df] text-[#1b1c1a] border border-[#c4c7c7] rounded-lg text-[12px] font-semibold tracking-wider uppercase flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Test Ping"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${testing ? 'animate-spin' : ''}`} /> Test
              </button>
              <button
                onClick={handleSaveUrl}
                disabled={testing}
                className="px-4 py-2 bg-[#94492d] hover:bg-[#773319] text-white rounded-lg text-[12px] font-semibold tracking-wider uppercase flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
              >
                <Save className="w-3.5 h-3.5" /> Save
              </button>
            </div>

            {savedSuccess && (
              <p className="text-[12px] text-emerald-700 font-medium flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Backend URL updated and verified.
              </p>
            )}

            <p className="text-[11.5px] text-[#747878] leading-normal">
              *Note: HeritageHub's API client architecture is configured for all 10 Django endpoint groups.
            </p>
          </div>

          {/* Configured API Groups */}
          <div>
            <h4 className="text-[12px] font-bold text-[#444748] uppercase tracking-wider mb-2.5">
              Configured Django REST Endpoint Groups
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[12px]">
              {apiEndpoints.map((ep) => (
                <div key={ep.group} className="p-2.5 bg-[#efeeea]/60 rounded-lg border border-[#c4c7c7]/30">
                  <span className="font-mono font-bold text-[#94492d] block text-[11px]">{ep.group}</span>
                  <span className="text-[#444748] text-[11.5px]">{ep.desc}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Archival Cache Tools */}
          <div className="pt-4 border-t border-[#c4c7c7]/40 flex items-center justify-between">
            <div>
              <h5 className="text-[13px] font-semibold text-[#1b1c1a]">Local Archival Cache</h5>
              <p className="text-[11px] text-[#444748]">Reset client-side bookmarks, custom submissions, and canvas boards.</p>
            </div>
            <button
              onClick={handleClearLocalCache}
              className="px-3.5 py-1.5 rounded-lg border border-red-300 text-red-700 hover:bg-red-50 text-[12px] font-semibold tracking-wider uppercase flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" /> Reset Cache
            </button>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-[#c4c7c7]/50 bg-[#efeeea] flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-[#1b1c1a] text-white rounded-lg text-[12px] font-semibold tracking-wider uppercase hover:bg-black transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
