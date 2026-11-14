import React, { useState } from 'react';
import { Plus, Check, Trash2, Send } from 'lucide-react';
import { NoteItem } from '../../types/launcher';

interface MessagesNotesAppProps {
  notes: NoteItem[];
  onAddNote: (text: string) => void;
  onToggleNote: (id: string) => void;
  onDeleteNote: (id: string) => void;
}

export const MessagesNotesApp: React.FC<MessagesNotesAppProps> = ({
  notes,
  onAddNote,
  onToggleNote,
  onDeleteNote,
}) => {
  const [draft, setDraft] = useState('');
  const [smsBody, setSmsBody] = useState('');
  const [smsPhone, setSmsPhone] = useState('');
  const [tab, setTab] = useState<'notes' | 'sms'>('notes');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!draft.trim()) return;
    onAddNote(draft.trim());
    setDraft('');
  };

  return (
    <div className="flex flex-col h-full px-4 pt-2 pb-4">
      <div className="flex items-center gap-1 p-1 rounded-xl bg-black/5 dark:bg-white/8 self-center mb-4">
        <button
          type="button"
          onClick={() => setTab('notes')}
          className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-colors ${
            tab === 'notes'
              ? 'bg-white dark:bg-zinc-800 shadow-sm text-zinc-900 dark:text-white'
              : 'text-zinc-500'
          }`}
        >
          Quick Notes
        </button>
        <button
          type="button"
          onClick={() => setTab('sms')}
          className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-colors ${
            tab === 'sms'
              ? 'bg-white dark:bg-zinc-800 shadow-sm text-zinc-900 dark:text-white'
              : 'text-zinc-500'
          }`}
        >
          Send SMS
        </button>
      </div>

      {tab === 'notes' ? (
        <>
          <form onSubmit={handleCreate} className="flex gap-2 mb-4">
            <input
              type="text"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Add a note or task..."
              className="flex-1 h-11 px-3.5 rounded-xl bg-black/5 dark:bg-white/8 border border-black/8 dark:border-white/10 text-sm focus:outline-none focus:border-[#D71921]"
            />
            <button
              type="submit"
              aria-label="Add note"
              className="w-11 h-11 rounded-xl bg-[#D71921] text-white flex items-center justify-center active:scale-92 transition-transform"
            >
              <Plus className="w-5 h-5" />
            </button>
          </form>

          <div className="flex-1 overflow-y-auto no-scrollbar space-y-2">
            {notes.map((n) => (
              <div
                key={n.id}
                className="flex items-center justify-between gap-2 p-3 rounded-2xl bg-black/4 dark:bg-white/6 border border-black/5 dark:border-white/8"
              >
                <button
                  type="button"
                  onClick={() => onToggleNote(n.id)}
                  className="flex items-center gap-3 flex-1 min-w-0 text-left"
                >
                  <span
                    className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 transition-colors ${
                      n.done
                        ? 'bg-[#D71921] border-[#D71921] text-white'
                        : 'border-zinc-400 dark:border-zinc-600'
                    }`}
                  >
                    {n.done && <Check className="w-3 h-3" strokeWidth={3} />}
                  </span>
                  <span
                    className={`text-sm truncate ${
                      n.done ? 'line-through text-zinc-400' : ''
                    }`}
                  >
                    {n.text}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => onDeleteNote(n.id)}
                  aria-label="Delete note"
                  className="p-1.5 text-zinc-400 hover:text-[#D71921]"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="space-y-3">
          <input
            type="tel"
            value={smsPhone}
            onChange={(e) => setSmsPhone(e.target.value)}
            placeholder="Recipient number (e.g. +14155550142)"
            className="w-full h-11 px-3.5 rounded-xl bg-black/5 dark:bg-white/8 border border-black/8 dark:border-white/10 text-sm focus:outline-none"
          />
          <textarea
            rows={4}
            value={smsBody}
            onChange={(e) => setSmsBody(e.target.value)}
            placeholder="Compose text message..."
            className="w-full p-3.5 rounded-xl bg-black/5 dark:bg-white/8 border border-black/8 dark:border-white/10 text-sm focus:outline-none resize-none"
          />
          <a
            href={`sms:${encodeURIComponent(smsPhone)}?body=${encodeURIComponent(smsBody)}`}
            className="w-full h-12 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-sm font-semibold flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
          >
            <Send className="w-4 h-4" />
            <span>Open in Android Messages</span>
          </a>
        </div>
      )}
    </div>
  );
};
