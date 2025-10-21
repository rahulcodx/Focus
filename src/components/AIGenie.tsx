"use client";

import { useState, useRef, useEffect } from "react";
import ReactMarkdown from 'react-markdown';

interface Message {
  id: number;
  content: string;
  isUser: boolean;
  timestamp: Date;
  sources?: Source[];
}

interface Source {
  title: string;
  url: string;
  subreddit: string;
  score: number;
  author: string;
  selftext?: string;
  num_comments?: number;
}

interface RedditPost {
  data: {
    title: string;
    permalink: string;
    subreddit: string;
    score: number;
    author: string;
    selftext: string;
    num_comments: number;
  };
}

const GEMINI_API_KEY = "AIzaSyDNYf0uevRT7zf3laeWaPzfwQTrvtlqQFM";

export default function AIGenie() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [sources, setSources] = useState<Source[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const searchReddit = async (query: string): Promise<Source[]> => {
    try {
      setIsSearching(true);
      // Search multiple productivity-related subreddits
      const subreddits = ['productivity', 'getdisciplined', 'selfimprovement', 'lifehacks', 'organization'];
      const searchQuery = encodeURIComponent(query);
      
      const allPosts: Source[] = [];
      
      for (const subreddit of subreddits) {
        try {
          const response = await fetch(
            `https://www.reddit.com/r/${subreddit}/search.json?q=${searchQuery}&restrict_sr=1&limit=3&sort=relevance`,
            {
              headers: {
                'User-Agent': 'Planly-AI-Bot/1.0'
              }
            }
          );
          
          if (response.ok) {
            const data = await response.json();
            const posts = data.data?.children || [];
            
            posts.forEach((post: RedditPost) => {
              const postData = post.data;
              allPosts.push({
                title: postData.title,
                url: `https://reddit.com${postData.permalink}`,
                subreddit: postData.subreddit,
                score: postData.score,
                author: postData.author,
                selftext: postData.selftext,
                num_comments: postData.num_comments
              });
            });
          }
        } catch (err) {
          console.error(`Error fetching from r/${subreddit}:`, err);
        }
      }
      
      // Sort by score and return top 5
      return allPosts.sort((a, b) => b.score - a.score).slice(0, 5);
    } catch (error) {
      console.error('Reddit search error:', error);
      return [];
    } finally {
      setIsSearching(false);
    }
  };

  const callGeminiAPI = async (userMessage: string, redditContext: string): Promise<string> => {
    try {
      // Check if API key is set
      if (!GEMINI_API_KEY) {
        throw new Error('Gemini API key not configured. Please set a valid API key.');
      }

      console.log("Calling Gemini API with context length:", redditContext.length);

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: `You are Planly AI, an advanced productivity assistant powered by real Reddit community insights.

Your role:
1. Analyze the Reddit discussions and user experiences provided
2. Synthesize the information into actionable, practical advice
3. Provide comprehensive answers that combine Reddit wisdom with your AI knowledge
4. Be encouraging, supportive, and focus on real-world solutions
5. Reference the Reddit insights when relevant (e.g., "Based on community experiences...")

IMPORTANT: Format your responses using proper markdown syntax:
- Use **bold** for emphasis and key points
- Use *italics* for subtle emphasis
- Use bullet points (- or *) for lists
- Use numbered lists (1., 2., etc.) when order matters
- Use \`code\` for technical terms or commands
- Use > for quotes or important notes
- Use ### for section headers
- Structure your response clearly with sections and formatting

Reddit Context:
${redditContext}

User Question: ${userMessage}

Provide a detailed, helpful response that incorporates the Reddit insights and your expertise. Format your response in a clear, organized way with proper markdown formatting.`,
                  },
                ],
              },
            ],
            generationConfig: {
              temperature: 0.8,
              topK: 40,
              topP: 0.95,
              maxOutputTokens: 2048,
            },
          }),
        },
      );

      console.log("Gemini API response status:", response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("Gemini API Error Response:", response.status, errorData);

        // Provide more specific error messages
        if (response.status === 400) {
          throw new Error('Invalid request to Gemini API. Please check the API key and request format.');
        } else if (response.status === 401) {
          throw new Error('Invalid Gemini API key. Please check your API key.');
        } else if (response.status === 403) {
          throw new Error('Gemini API access forbidden. Please check your API key permissions.');
        } else if (response.status === 429) {
          throw new Error('Gemini API rate limit exceeded. Please try again later.');
        } else if (response.status >= 500) {
          throw new Error('Gemini API server error. Please try again later.');
        } else {
          throw new Error(`Gemini API error: ${response.status} - ${JSON.stringify(errorData)}`);
        }
      }

      const data = await response.json();
      console.log("Gemini API Response received successfully");

      const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!generatedText) {
        console.error("No text generated by Gemini:", data);
        throw new Error('No response generated by Gemini API');
      }

      return generatedText;
    } catch (error: unknown) {
      console.error("Gemini API Error:", error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error("Error details:", errorMessage);
      return `I'm experiencing some technical difficulties with AI analysis. ${errorMessage || 'Please try again in a moment.'}`;
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || isTyping) return;

    const newUserMessage: Message = {
      id: Date.now(),
      content: inputMessage,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newUserMessage]);
    const currentMessage = inputMessage;
    setInputMessage("");
    setIsTyping(true);
    setSources([]);

    try {
      // Step 1: Search Reddit for relevant discussions
      const redditSources = await searchReddit(currentMessage);
      setSources(redditSources);
      
      // Step 2: Build context from Reddit posts
      let redditContext = "No specific Reddit discussions found for this topic.";
      if (redditSources.length > 0) {
        redditContext = redditSources.map((source, idx) => {
          const summary = source.selftext ? source.selftext.substring(0, 500) + (source.selftext.length > 500 ? '...' : '') : 'No text content';
          return `[${idx + 1}] r/${source.subreddit} - "${source.title}" (${source.score} upvotes, ${source.num_comments || 0} comments)\nSummary: ${summary}`;
        }).join('\n\n');
      }
      
      // Step 3: Call Gemini API with Reddit context
      let aiResponseContent = await callGeminiAPI(currentMessage, redditContext);
      
      // Fallback: If Gemini fails but we have Reddit sources, provide a basic summary
      if (aiResponseContent.includes('technical difficulties') && redditSources.length > 0) {
        aiResponseContent = `I found ${redditSources.length} relevant discussions on Reddit about "${currentMessage}":\n\n` +
          redditSources.map((source, idx) =>
            `${idx + 1}. **r/${source.subreddit}**: ${source.title} (${source.score} upvotes)`
          ).join('\n\n') +
          '\n\nClick on the sources in the right panel to read the full discussions. ' +
          '(Note: AI analysis is temporarily unavailable, but you can explore these Reddit community insights!)';
      } else if (aiResponseContent.includes('technical difficulties')) {
        // If no Reddit sources either, provide a generic response
        aiResponseContent = `I'm currently having trouble connecting to my AI analysis service. However, I can still help you find relevant discussions on Reddit!\n\nPlease try asking your question again, and I'll search for community insights from productivity subreddits.`;
      }

      const aiResponse: Message = {
        id: Date.now() + 1,
        content: aiResponseContent,
        isUser: false,
        timestamp: new Date(),
        sources: redditSources,
      };

      setMessages((prev) => [...prev, aiResponse]);
    } catch (error: unknown) {
      const errorResponse: Message = {
        id: Date.now() + 1,
        content:
          "I apologize, but I'm having trouble connecting right now. Please try again in a moment.",
        isUser: false,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, errorResponse]);
    } finally {
      setIsTyping(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
    setSources([]);
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const unusedVariable = null;

  return (
    <div className="max-w-7xl mx-auto h-[calc(100vh-140px)] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[var(--accent-teal)] flex items-center justify-center">
            <svg
              className="w-6 h-6 text-white"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
              <path d="M12 17h.01" />
              <circle cx="12" cy="12" r="10" />
            </svg>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-black">Planly AI</h1>
          </div>
        </div>
        <button
          onClick={clearChat}
          className="px-4 py-2 rounded-xl bg-white border border-gray-200 text-black font-medium hover:bg-gray-50 transition-all cursor-pointer flex items-center gap-2"
        >
          <svg
            className="w-4 h-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M3 6h18" />
            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
          </svg>
          Clear Chat
        </button>
      </div>

      {/* Main Content Area - Split Layout */}
      <div className="flex-1 flex gap-4 min-h-0">
        {/* Left Side - Chat Area (Large) */}
        <div className="flex-1 bg-white border border-gray-200 rounded-2xl overflow-hidden flex flex-col shadow-sm">
          <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-hide">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${message.isUser ? "flex-row-reverse" : "flex-row"}`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  message.isUser
                    ? "bg-[var(--accent-teal)] text-white"
                    : "bg-gray-200 text-black"
                }`}
              >
                {message.isUser ? (
                  <svg
                    className="w-4 h-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                ) : (
                  <svg
                    className="w-4 h-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                    <path d="M12 17h.01" />
                    <circle cx="12" cy="12" r="10" />
                  </svg>
                )}
              </div>
              <div
                className={`flex-1 max-w-3xl ${message.isUser ? "text-right" : "text-left"}`}
              >
                <div
                  className={`inline-block p-3 rounded-2xl ${
                    message.isUser
                      ? "bg-[var(--accent-teal)] text-white"
                      : "bg-gray-100 text-black"
                  } max-w-full break-words`}
                >
                  <div className="text-sm leading-relaxed">
                    {message.isUser ? (
                      <p className="whitespace-pre-wrap">{message.content}</p>
                    ) : (
                      <ReactMarkdown
                        components={{
                          p: ({ children }) => <p className="mb-2">{children}</p>,
                          ul: ({ children }) => <ul className="list-disc list-inside mb-2 space-y-1">{children}</ul>,
                          ol: ({ children }) => <ol className="list-decimal list-inside mb-2 space-y-1">{children}</ol>,
                          li: ({ children }) => <li className="ml-4">{children}</li>,
                          strong: ({ children }) => <strong className="font-bold">{children}</strong>,
                          em: ({ children }) => <em className="italic">{children}</em>,
                          code: ({ children }) => <code className="bg-gray-200 px-1 py-0.5 rounded text-xs font-mono">{children}</code>,
                          blockquote: ({ children }) => <blockquote className="border-l-4 border-gray-300 pl-4 italic">{children}</blockquote>,
                          h1: ({ children }) => <h1 className="text-lg font-bold mb-2">{children}</h1>,
                          h2: ({ children }) => <h2 className="text-base font-bold mb-2">{children}</h2>,
                          h3: ({ children }) => <h3 className="text-sm font-bold mb-2">{children}</h3>,
                        }}
                      >
                        {message.content}
                      </ReactMarkdown>
                    )}
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-1 px-1">
                  {message.timestamp.toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t border-gray-200 p-4">
            <form onSubmit={handleSendMessage} className="flex gap-3">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Ask me anything about productivity..."
                className="flex-1 px-4 py-3 rounded-xl border border-gray-300 bg-white text-black focus:outline-none focus:ring-2 focus:ring-[var(--accent-teal)] transition-all cursor-text"
                disabled={isTyping}
              />
              <button
                type="submit"
                disabled={!inputMessage.trim() || isTyping}
                className="px-6 py-3 rounded-xl bg-[var(--accent-teal)] text-white font-medium hover:shadow-lg transition-all cursor-pointer flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isTyping ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <svg
                    className="w-5 h-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="22" y1="2" x2="11" y2="13" />
                    <polygon points="22,2 15,22 11,13 2,9" />
                  </svg>
                )}
                {isTyping ? 'Thinking...' : 'Send'}
              </button>
            </form>
          </div>
        </div>

        {/* Right Side - Sources Panel (Small) */}
        <div className="w-80 bg-white border border-gray-200 rounded-2xl overflow-hidden flex flex-col shadow-sm">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <svg
                className="w-5 h-5 text-[var(--accent-teal)]"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
              <h2 className="text-lg font-bold text-black">Sources</h2>
            </div>
            <p className="text-xs text-gray-600 mt-1">Community insights</p>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-hide">
            {isSearching && (
              <div className="text-center py-8">
                <div className="w-8 h-8 border-2 border-[var(--accent-teal)] border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                <p className="text-sm text-gray-600">Searching Reddit...</p>
              </div>
            )}

            {!isSearching && sources.length === 0 && (
              <div className="text-center py-8">
                <svg
                  className="w-12 h-12 mx-auto mb-3 text-gray-300"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.35-4.35" />
                </svg>
                <p className="text-sm text-gray-600">Ask a question to see<br/>Reddit sources</p>
              </div>
            )}

            {sources.map((source, idx) => (
              <a
                key={idx}
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block p-3 bg-gray-50 hover:bg-gray-100 rounded-xl border border-gray-200 transition-all cursor-pointer group"
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="text-xs font-semibold text-[var(--accent-teal)]">
                    r/{source.subreddit}
                  </span>
                  <div className="flex items-center gap-1 text-xs text-gray-600">
                    <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M7 10v12" />
                      <path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z" />
                    </svg>
                    {source.score}
                  </div>
                </div>
                <h3 className="text-sm font-medium text-black line-clamp-2 group-hover:text-[var(--accent-teal)] transition-colors">
                  {source.title}
                </h3>
                <p className="text-xs text-gray-500 mt-1">by u/{source.author}</p>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}


