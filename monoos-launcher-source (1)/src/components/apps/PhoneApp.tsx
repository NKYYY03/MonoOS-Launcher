import React, { useState } from 'react';
import { Phone, Delete, User } from 'lucide-react';

const CONTACTS = [
  { name: 'Aria Chen', label: 'Studio', number: '+14155550142' },
  { name: 'Marcus Vance', label: 'Mobile', number: '+14155550198' },
  { name: 'Emergency', label: 'Priority', number: '911' },
];

export const PhoneApp: React.FC = () => {
  const [digits, setDigits] = useState('');
  const [tab, setTab] = useState<'keypad' | 'contacts'>('keypad');

  const appendDigit = (d: string) => {
    if (digits.length < 18) setDigits((prev) => prev + d);
  };

  const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'];

  return (
    <div className="flex flex-col h-full justify-between px-5 pb-4 pt-2">
      {/* Segmented Switch */}
      <div className="flex items-center gap-1 p-1 rounded-xl bg-black/5 dark:bg-white/8 self-center">
        <button
          type="button"
          onClick={() => setTab('keypad')}
          className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-colors ${
            tab === 'keypad'
              ? 'bg-white dark:bg-zinc-800 shadow-sm text-zinc-900 dark:text-white'
              : 'text-zinc-500'
          }`}
        >
          Keypad
        </button>
        <button
          type="button"
          onClick={() => setTab('contacts')}
          className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-colors ${
            tab === 'contacts'
              ? 'bg-white dark:bg-zinc-800 shadow-sm text-zinc-900 dark:text-white'
              : 'text-zinc-500'
          }`}
        >
          Contacts
        </button>
      </div>

      {tab === 'keypad' ? (
        <div className="flex-1 flex flex-col justify-end pb-2">
          <div className="h-16 flex items-center justify-center mb-4">
            <span className="font-mono-tabular text-3xl font-semibold tracking-wider truncate">
              {digits || 'Enter number'}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-3 max-w-[260px] mx-auto w-full">
            {keys.map((k) => (
              <button
                key={k}
                type="button"
                onClick={() => appendDigit(k)}
                className="h-14 rounded-2xl bg-black/5 dark:bg-white/8 hover:bg-black/10 dark:hover:bg-white/14 font-mono-tabular text-xl font-medium active:scale-92 transition-transform"
              >
                {k}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-3 max-w-[260px] mx-auto w-full mt-4 items-center">
            <div />
            <a
              href={digits ? `tel:${digits}` : undefined}
              onClick={(e) => {
                if (!digits) e.preventDefault();
              }}
              aria-label="Call number"
              className={`h-14 w-14 mx-auto rounded-full flex items-center justify-center transition-all active:scale-90 ${
                digits
                  ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/25'
                  : 'bg-black/10 dark:bg-white/10 text-zinc-400'
              }`}
            >
              <Phone className="w-6 h-6 fill-current" />
            </a>
            <button
              type="button"
              onClick={() => setDigits((prev) => prev.slice(0, -1))}
              aria-label="Delete digit"
              className="h-14 flex items-center justify-center text-zinc-500 hover:text-zinc-900 dark:hover:text-white active:scale-90 transition-transform"
            >
              <Delete className="w-5 h-5" />
            </button>
          </div>
        </div>
      ) : (
        <div className="flex-1 mt-5 space-y-2 overflow-y-auto no-scrollbar">
          {CONTACTS.map((c) => (
            <a
              key={c.number}
              href={`tel:${c.number}`}
              className="flex items-center justify-between p-3.5 rounded-2xl bg-black/4 dark:bg-white/6 hover:bg-black/8 dark:hover:bg-white/10 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-zinc-900 dark:bg-zinc-800 text-white flex items-center justify-center">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-sm font-semibold">{c.name}</div>
                  <div className="text-xs text-zinc-500 font-mono-tabular">
                    {c.label} · {c.number}
                  </div>
                </div>
              </div>
              <Phone className="w-4 h-4 text-emerald-500" />
            </a>
          ))}
        </div>
      )}
    </div>
  );
};
