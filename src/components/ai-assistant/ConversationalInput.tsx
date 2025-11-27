import React, { useState } from 'react';
import { SendIcon, Loader2Icon } from 'lucide-react';
interface ConversationalInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (value: string) => void;
  isProcessing: boolean;
  placeholder?: string;
}
export function ConversationalInput({
  value,
  onChange,
  onSubmit,
  isProcessing,
  placeholder = 'Type your message...'
}: ConversationalInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (value.trim() && !isProcessing) {
        onSubmit(value);
      }
    }
  };
  return <div className={`relative border ${isFocused ? 'border-indigo-500 ring-1 ring-indigo-200' : 'border-gray-300'} rounded-lg transition-all`}>
      <textarea className="w-full px-4 py-3 pr-12 resize-none focus:outline-none rounded-lg" rows={2} placeholder={placeholder} value={value} onChange={e => onChange(e.target.value)} onKeyDown={handleKeyDown} onFocus={() => setIsFocused(true)} onBlur={() => setIsFocused(false)} disabled={isProcessing} />
      <button className={`absolute right-3 bottom-3 p-2 rounded-full ${value.trim() && !isProcessing ? 'bg-indigo-600 text-white hover:bg-indigo-700' : 'bg-gray-200 text-gray-500 cursor-not-allowed'} transition-colors`} onClick={() => {
      if (value.trim() && !isProcessing) {
        onSubmit(value);
      }
    }} disabled={!value.trim() || isProcessing}>
        {isProcessing ? <Loader2Icon className="h-5 w-5 animate-spin" /> : <SendIcon className="h-5 w-5" />}
      </button>
    </div>;
}