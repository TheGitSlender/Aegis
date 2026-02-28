import { useState, useEffect, useRef } from 'react';
import { Send, Loader2, FileText, Sparkles } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { askConcept, listConcepts } from '../api';

export default function ConceptChat() {
  const [messages, setMessages]   = useState([]);
  const [input, setInput]         = useState('');
  const [loading, setLoading]     = useState(false);
  const [concepts, setConcepts]   = useState([]);
  const [sources, setSources]     = useState([]);

  const messagesEndRef  = useRef(null);
  const lastMsgRef      = useRef(null);
  const messagesAreaRef = useRef(null);

  useEffect(() => {
    listConcepts().then(res => setConcepts(res.data)).catch(() => {});
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const question = input.trim();
    if (!question || loading) return;

    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: question }]);
    setLoading(true);

    try {
      const res  = await askConcept(question);
      const data = res.data;
      const msgSources = data.sources || [];
      setSources(msgSources);
      setMessages(prev => [...prev, {
        role:    'assistant',
        content: data.answer,
        related: data.related_concepts,
        sources: msgSources,
        time:    data.processing_time_ms,
      }]);
    } catch {
      setMessages(prev => [...prev, {
        role:    'assistant',
        content: 'Sorry, I could not process your question. Please check that the LLM service is running.',
        error:   true,
      }]);
    } finally {
      setLoading(false);
    }
  };

  const quickAsk = (term) => {
    setInput(`What is ${term} and why does it matter for Morocco?`);
  };

  return (
    <div className="flex gap-6 h-[calc(100vh-11rem)]">

      {/* ── Chat Area ── */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Header */}
        <div className="mb-5 pb-4 border-b border-gray-100">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-7 h-7 bg-aegis-green rounded-lg flex items-center justify-center">
              <Sparkles size={14} className="text-white" />
            </div>
            <h1 className="text-xl font-bold text-ink">AI Concepts</h1>
          </div>
          <p className="text-gray-400 text-sm pl-9">Ask about AI policy concepts — answers are tailored to Morocco&rsquo;s context.</p>
        </div>

        {/* Messages */}
        <div ref={messagesAreaRef} className="flex-1 overflow-y-auto space-y-5 pr-1">

          {/* Empty state with concept chips */}
          {messages.length === 0 && !loading && concepts.length > 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center gap-6 pb-8">
              <div className="w-14 h-14 bg-aegis-green-50 rounded-2xl flex items-center justify-center">
                <Sparkles size={24} className="text-aegis-green" />
              </div>
              <div>
                <p className="font-semibold text-ink mb-1">Explore AI Policy Concepts</p>
                <p className="text-sm text-gray-400 max-w-xs">
                  Select a concept below or type your own question.
                </p>
              </div>
              <div className="flex flex-wrap gap-2 justify-center max-w-lg">
                {concepts.slice(0, 8).map(c => (
                  <button
                    key={c.id}
                    onClick={() => quickAsk(c.term)}
                    className="px-3.5 py-1.5 text-xs font-medium bg-white border border-aegis-green-100
                               text-aegis-green rounded-full hover:bg-aegis-green-50
                               transition-colors duration-200"
                  >
                    {c.term}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg, i) => {
            const isLast      = i === messages.length - 1;
            const isAssistant = msg.role === 'assistant';

            return (
              <div
                key={i}
                ref={isLast && isAssistant ? lastMsgRef : null}
                className={`flex ${isAssistant ? 'justify-start' : 'justify-end'}`}
              >
                {isAssistant ? (
                  <div className="max-w-[90%] w-full">
                    {/* Assistant bubble */}
                    <div className={`rounded-2xl border text-sm overflow-hidden ${
                      msg.error
                        ? 'bg-red-50 border-red-200 text-red-700'
                        : 'bg-white border-aegis-green-100'
                    }`}>
                      {/* Icon header strip */}
                      {!msg.error && (
                        <div className="flex items-center gap-2 px-4 pt-3 pb-2 border-b border-aegis-green-50">
                          <div className="w-5 h-5 bg-aegis-green rounded-md flex items-center justify-center">
                            <Sparkles size={10} className="text-white" />
                          </div>
                          <span className="text-xs font-semibold text-aegis-green">Policy Assistant</span>
                          {msg.time && (
                            <span className="ml-auto text-xs text-gray-300">{(msg.time / 1000).toFixed(1)}s</span>
                          )}
                        </div>
                      )}

                      <div className="px-4 py-3">
                        <div className="prose prose-sm max-w-none text-gray-800">
                          <ReactMarkdown>{msg.content}</ReactMarkdown>
                        </div>

                        {msg.related && msg.related.length > 0 && (
                          <div className="mt-3 pt-3 border-t border-gray-100">
                            <p className="text-xs text-gray-400 mb-1.5">Related concepts:</p>
                            <div className="flex flex-wrap gap-1.5">
                              {msg.related.map(r => (
                                <button
                                  key={r.id}
                                  onClick={() => quickAsk(r.term)}
                                  className="px-2.5 py-0.5 text-xs bg-aegis-green-50 text-aegis-green
                                             rounded-full hover:bg-aegis-green-100 transition-colors duration-200"
                                >
                                  {r.term}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  /* User bubble */
                  <div className="max-w-[75%] bg-ink text-white rounded-2xl px-4 py-3 text-sm">
                    <p>{msg.content}</p>
                  </div>
                )}
              </div>
            );
          })}

          {loading && (
            <div className="flex justify-start">
              <div className="bg-white border border-aegis-green-100 rounded-2xl px-4 py-3 flex items-center gap-2 text-gray-400">
                <Loader2 size={14} className="animate-spin text-aegis-green" />
                <span className="text-sm">Thinking&hellip;</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <form onSubmit={handleSubmit} className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Ask about an AI policy concept..."
            className="flex-1 px-4 py-3 border border-gray-200 rounded-xl text-sm bg-white
                       focus:outline-none focus:ring-2 focus:ring-aegis-green focus:border-transparent
                       transition-shadow duration-200"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="px-4 py-3 bg-aegis-green text-white rounded-xl hover:bg-aegis-green-700
                       disabled:opacity-40 disabled:cursor-not-allowed transition-colors duration-200"
          >
            <Send size={16} />
          </button>
        </form>
      </div>

      {/* ── Right Panel: Source Documents (conditional) ── */}
      {sources.length > 0 && (
        <aside className="w-72 shrink-0 flex flex-col">
          <div className="bg-white border border-aegis-green-100 rounded-2xl p-5 flex flex-col gap-4 h-fit sticky top-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText size={15} className="text-aegis-green" />
                <span className="text-sm font-semibold text-ink">Source Documents</span>
              </div>
              <span className="px-2 py-0.5 bg-aegis-green-50 text-aegis-green text-xs font-semibold rounded-full">
                Active
              </span>
            </div>

            <div className="space-y-2">
              {sources.map((src, i) => (
                <div
                  key={i}
                  className="bg-aegis-green-50 rounded-xl p-3 border border-aegis-green-100"
                >
                  <p className="text-xs font-semibold text-ink leading-snug">{src}</p>
                </div>
              ))}
            </div>

            <p className="text-xs text-gray-400 leading-relaxed">
              These documents were referenced to generate the above response.
            </p>
          </div>
        </aside>
      )}
    </div>
  );
}
