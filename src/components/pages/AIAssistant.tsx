import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles } from 'lucide-react';
import { aiResponses, ChatMessage } from '@/data/mockData';
import { cn } from '@/lib/utils';

const starterPrompts = [
  '总结 LLZO 锆酸镧锂的最新改性研究',
  '生成硅基负极膨胀数据的对比报告',
  '查询宁德时代最新的固态电池专利',
];

export function AIAssistant() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getAIResponse = (userMessage: string): string => {
    if (userMessage.includes('LLZO') || userMessage.includes('锆酸镧锂')) {
      return aiResponses['LLZO'];
    }
    if (userMessage.includes('硅基') || userMessage.includes('硅负极') || userMessage.includes('膨胀')) {
      return aiResponses['硅基负极'];
    }
    if (userMessage.includes('宁德') || userMessage.includes('专利')) {
      return aiResponses['宁德时代'];
    }
    return aiResponses['default'];
  };

  const handleSend = async (message: string) => {
    if (!message.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: message,
      timestamp: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate AI thinking time
    await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 1000));

    const aiResponse: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: getAIResponse(message),
      timestamp: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
    };

    setIsTyping(false);
    setMessages((prev) => [...prev, aiResponse]);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend(input);
    }
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-semibold text-foreground">AI 助手</h1>
        <p className="text-muted-foreground mt-1">智能研发问答与文献分析</p>
      </div>

      {/* Chat Container */}
      <div className="flex-1 bg-card rounded-3xl shadow-apple border border-border/50 flex flex-col overflow-hidden">
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.length === 0 ? (
            // Welcome Screen
            <div className="h-full flex flex-col items-center justify-center text-center px-4">
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center mb-6 shadow-apple-lg">
                <Sparkles className="w-10 h-10 text-primary-foreground" />
              </div>
              <h2 className="text-2xl font-semibold text-foreground mb-2">固态电池研发 AI 助手</h2>
              <p className="text-muted-foreground max-w-md mb-8">
                我可以帮您检索文献、分析专利、生成报告。选择下方快捷提示开始对话，或直接输入您的问题。
              </p>

              {/* Starter Prompts */}
              <div className="flex flex-wrap justify-center gap-3 max-w-2xl">
                {starterPrompts.map((prompt) => (
                  <button
                    key={prompt}
                    onClick={() => handleSend(prompt)}
                    className="px-4 py-2.5 bg-accent hover:bg-accent/80 text-accent-foreground rounded-full text-sm font-medium transition-all duration-200 hover:scale-105 hover:shadow-apple"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            // Messages
            <>
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    'flex gap-4 animate-fade-in',
                    message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                  )}
                >
                  {/* Avatar */}
                  <div className={cn(
                    'w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0',
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-gradient-to-br from-purple-500 to-blue-500 text-white'
                  )}>
                    {message.role === 'user' ? (
                      <User className="w-5 h-5" />
                    ) : (
                      <Bot className="w-5 h-5" />
                    )}
                  </div>

                  {/* Message Bubble */}
                  <div className={cn(
                    'max-w-[70%] rounded-2xl p-4',
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground rounded-tr-sm'
                      : 'bg-accent/70 text-foreground rounded-tl-sm'
                  )}>
                    <div className={cn(
                      'text-sm leading-relaxed whitespace-pre-wrap',
                      message.role === 'assistant' && 'prose prose-sm max-w-none prose-headings:text-foreground prose-p:text-foreground prose-strong:text-foreground prose-code:text-primary prose-code:bg-primary/10 prose-code:px-1 prose-code:rounded'
                    )}>
                      {message.role === 'assistant' ? (
                        <div dangerouslySetInnerHTML={{ 
                          __html: message.content
                            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                            .replace(/## (.*?)(?=\n|$)/g, '<h3 class="text-base font-semibold mt-4 mb-2">$1</h3>')
                            .replace(/### (.*?)(?=\n|$)/g, '<h4 class="text-sm font-semibold mt-3 mb-1">$1</h4>')
                            .replace(/\n/g, '<br/>')
                            .replace(/\| (.*?) \|/g, '<span class="font-mono text-xs">$1</span>')
                        }} />
                      ) : (
                        message.content
                      )}
                    </div>
                    <p className={cn(
                      'text-xs mt-2 opacity-70',
                      message.role === 'user' ? 'text-right' : 'text-left'
                    )}>
                      {message.timestamp}
                    </p>
                  </div>
                </div>
              ))}

              {/* Typing Indicator */}
              {isTyping && (
                <div className="flex gap-4 animate-fade-in">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center flex-shrink-0">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                  <div className="bg-accent/70 rounded-2xl rounded-tl-sm px-5 py-4">
                    <div className="flex gap-1.5">
                      <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-border/50">
          <div className="flex items-end gap-3">
            <div className="flex-1 relative">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="输入您的问题..."
                rows={1}
                className="w-full resize-none rounded-2xl border border-border/50 bg-background px-4 py-3 pr-12 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all"
                style={{ minHeight: '48px', maxHeight: '120px' }}
              />
            </div>
            <button
              onClick={() => handleSend(input)}
              disabled={!input.trim() || isTyping}
              className="w-12 h-12 rounded-xl bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-apple hover:shadow-apple-lg"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
