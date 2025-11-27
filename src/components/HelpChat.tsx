import React, { useEffect, useState } from 'react';
import { MessageSquareIcon, XIcon, SendIcon } from 'lucide-react';
import { Button } from './Button';
export function HelpChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<{
    text: string;
    fromUser: boolean;
    timestamp: Date;
  }[]>([]);
  const [hasNotification, setHasNotification] = useState(false);
  const [isSending, setIsSending] = useState(false);
  // Welcome message when chat is first opened
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([{
        text: 'Hej! Hur kan jag hjälpa dig med SponsrAI-plattformen idag?',
        fromUser: false,
        timestamp: new Date()
      }]);
    }
    if (isOpen && hasNotification) {
      setHasNotification(false);
    }
  }, [isOpen, messages.length, hasNotification]);
  // Simulate receiving a help notification after 30 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isOpen) {
        setHasNotification(true);
      }
    }, 30000);
    return () => clearTimeout(timer);
  }, [isOpen]);
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    // Add user message
    const userMessage = {
      text: message,
      fromUser: true,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    setIsSending(true);
    // Simulate sending message to email
    console.log(`Sending message to Preslav@thecoffeeparty.se: ${message}`);
    // In a real app, this would be an API call to send an email
    // For example:
    // fetch('/api/send-email', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({
    //     to: 'Preslav@thecoffeeparty.se',
    //     subject: 'New Chat Message from SponsrAI User',
    //     message: message
    //   })
    // })
    setMessage('');
    // Simulate response after a short delay
    setTimeout(() => {
      setIsSending(false);
      let responseText = '';
      if (message.toLowerCase().includes('avtal') || message.toLowerCase().includes('kontrakt')) {
        responseText = 'För att skapa ett avtal, acceptera först en match och klicka sedan på "Skapa sponsringsavtal". Båda parter måste godkänna avtalet för att det ska aktiveras.';
      } else if (message.toLowerCase().includes('match') || message.toLowerCase().includes('matcha')) {
        responseText = 'Vår AI-algoritm matchar varumärken och arrangörer baserat på målgrupp, bransch, budget och flera andra faktorer. Ju mer information du anger i din profil, desto bättre blir matchningarna!';
      } else if (message.toLowerCase().includes('test') || message.toLowerCase().includes('panel') || message.toLowerCase().includes('sampling')) {
        responseText = 'Varumärken kan ange information om kommande testpaneler eller samplingaktiviteter i sin profil. Detta hjälper oss att matcha dem med lämpliga eventarrangörer.';
      } else if (message.toLowerCase().includes('betala') || message.toLowerCase().includes('pris') || message.toLowerCase().includes('kostnad')) {
        responseText = 'Betalningsvillkor bestäms mellan varumärket och arrangören och dokumenteras i sponsringsavtalet. Plattformen tar för närvarande inte ut någon avgift för matchningar.';
      } else {
        responseText = 'Tack för din fråga! Ditt meddelande har skickats till vår support. En av våra medarbetare kommer att kontakta dig inom kort.';
      }
      const botResponse = {
        text: responseText,
        fromUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botResponse]);
    }, 1000);
  };
  return <div className="fixed bottom-4 right-4 z-50">
      {isOpen ? <div className="bg-white rounded-lg shadow-lg w-80 md:w-96 flex flex-col" style={{
      height: '400px'
    }}>
          <div className="bg-indigo-600 text-white p-3 rounded-t-lg flex justify-between items-center">
            <h3 className="font-medium">Support</h3>
            <button onClick={() => setIsOpen(false)} className="text-white hover:text-indigo-100">
              <XIcon className="h-5 w-5" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            {messages.map((msg, index) => <div key={index} className={`flex ${msg.fromUser ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-3/4 rounded-lg p-3 ${msg.fromUser ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-800'}`}>
                  <p className="text-sm">{msg.text}</p>
                  <div className="text-xs mt-1 text-right opacity-70">
                    {msg.timestamp.toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit'
              })}
                  </div>
                </div>
              </div>)}
          </div>
          <form onSubmit={handleSendMessage} className="border-t p-3 flex">
            <input type="text" placeholder="Skriv ett meddelande..." className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" value={message} onChange={e => setMessage(e.target.value)} disabled={isSending} />
            <Button type="submit" variant="primary" className="ml-2" disabled={isSending}>
              {isSending ? <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span> : <SendIcon className="h-4 w-4" />}
            </Button>
          </form>
        </div> : <button onClick={() => setIsOpen(true)} className="bg-indigo-600 text-white rounded-full p-3 shadow-lg hover:bg-indigo-700 relative">
          <MessageSquareIcon className="h-6 w-6" />
          {hasNotification && <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full h-5 w-5 flex items-center justify-center text-xs">
              1
            </span>}
        </button>}
    </div>;
}