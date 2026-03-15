'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const LAMBDA_URL = 'https://5nwmzsi0hb.execute-api.us-east-1.amazonaws.com/Prod/generate';

export default function Home() {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [status, setStatus] = useState('idle'); // idle | recording | done | generating | success | error
  const [hindiPost, setHindiPost] = useState('');
  const [englishPost, setEnglishPost] = useState('');
  const [copied, setCopied] = useState(false);
  const [particles, setParticles] = useState([]);
  const recognitionRef = useRef(null);

  // Generate floating particles on mount
  useEffect(() => {
    const p = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 2,
      duration: Math.random() * 10 + 8,
      delay: Math.random() * 5,
    }));
    setParticles(p);
  }, []);

  // Setup speech recognition
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        const rec = new SpeechRecognition();
        rec.lang = 'hi-IN';
        rec.continuous = false;
        rec.interimResults = false;
        rec.onstart = () => { setIsRecording(true); setStatus('recording'); };
        rec.onresult = (e) => { setTranscript(e.results[0][0].transcript); setStatus('done'); };
        rec.onerror = () => setStatus('error');
        rec.onend = () => setIsRecording(false);
        recognitionRef.current = rec;
      }
    }
  }, []);

  const handleMic = () => {
    if (!recognitionRef.current) return alert('Use Chrome or Edge for voice input!');
    if (isRecording) {
      recognitionRef.current.stop();
    } else {
      setTranscript('');
      setHindiPost('');
      setEnglishPost('');
      recognitionRef.current.start();
    }
  };

  const handleGenerate = async () => {
    if (!transcript.trim()) return alert('Please record or type something first!');
    setStatus('generating');
    try {
      const res = await fetch(LAMBDA_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: transcript }),
      });
      const data = await res.json();
      setHindiPost(data.hindi);
      setEnglishPost(data.english);
      setStatus('success');
    } catch {
      setStatus('error');
      alert('Error connecting to backend.');
    }
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const statusConfig = {
    idle: { text: 'बोलिए — Tap to speak', color: 'text-orange-400' },
    recording: { text: '🔴 Recording... बोलिए!', color: 'text-red-400' },
    done: { text: '✅ Recording complete!', color: 'text-green-400' },
    generating: { text: '✨ Nova is generating...', color: 'text-orange-400' },
    success: { text: '🎉 Posts ready!', color: 'text-green-400' },
    error: { text: '❌ Something went wrong', color: 'text-red-400' },
  };

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white overflow-x-hidden font-sans relative">

      {/* Ambient background glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-[20%] w-[600px] h-[600px] rounded-full bg-orange-500/5 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[10%] w-[400px] h-[400px] rounded-full bg-green-500/5 blur-[100px]" />
        {particles.map(p => (
          <motion.div
            key={p.id}
            className="absolute rounded-full bg-orange-400/20"
            style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.size, height: p.size }}
            animate={{ y: [0, -30, 0], opacity: [0.2, 0.6, 0.2] }}
            transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: 'easeInOut' }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-2xl mx-auto px-4 py-12">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="text-center mb-16"
        >
          <motion.div
            className="inline-block text-6xl mb-4"
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          >
            🚀
          </motion.div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-3"
            style={{ background: 'linear-gradient(135deg, #ff8c00, #ff4500)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            BizBoost AI
          </h1>
          <p className="text-green-400 text-xl font-medium tracking-wide">
            Bol ke becho — <span className="font-bold">बोल के बेचो</span>
          </p>
          <p className="text-zinc-500 text-sm mt-2 tracking-widest uppercase">
            Voice → AI → WhatsApp Catalog
          </p>
        </motion.div>

        {/* Mic Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="flex flex-col items-center mb-10"
        >
          {/* Mic Button */}
          <div className="relative mb-6">
            {/* Pulse rings when recording */}
            {isRecording && (
              <>
                <motion.div
                  className="absolute inset-0 rounded-full border-2 border-red-400/50"
                  animate={{ scale: [1, 1.8], opacity: [0.6, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
                <motion.div
                  className="absolute inset-0 rounded-full border-2 border-red-400/30"
                  animate={{ scale: [1, 2.4], opacity: [0.4, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}
                />
              </>
            )}
            <motion.button
              onClick={handleMic}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.94 }}
              className={`w-32 h-32 rounded-full flex items-center justify-center text-5xl shadow-2xl transition-all duration-300 ${
                isRecording
                  ? 'bg-gradient-to-br from-red-500 to-red-700 shadow-red-500/40'
                  : 'bg-gradient-to-br from-orange-400 to-orange-600 shadow-orange-500/40'
              }`}
            >
              {isRecording ? '⏹️' : '🎤'}
            </motion.button>
          </div>

          {/* Status */}
          <AnimatePresence mode="wait">
            <motion.p
              key={status}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className={`text-base font-medium ${statusConfig[status]?.color}`}
            >
              {statusConfig[status]?.text}
            </motion.p>
          </AnimatePresence>
        </motion.div>

        {/* Transcript */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-6"
        >
          <label className="block text-orange-400 font-semibold mb-2 text-sm uppercase tracking-widest">
            Voice Input (Hindi)
          </label>
          <textarea
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            placeholder="आपकी आवाज़ यहाँ दिखेगी... या यहाँ टाइप करें"
            className="w-full min-h-[100px] p-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-zinc-600 focus:outline-none focus:border-orange-400/50 resize-none text-base leading-relaxed transition-all"
          />
        </motion.div>

        {/* Generate Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mb-10"
        >
          <motion.button
            onClick={handleGenerate}
            disabled={status === 'generating'}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-5 rounded-xl font-bold text-lg uppercase tracking-widest text-black bg-gradient-to-r from-green-400 to-emerald-500 shadow-lg shadow-green-500/20 disabled:opacity-60 disabled:cursor-not-allowed transition-all"
          >
            {status === 'generating' ? (
              <motion.span
                animate={{ opacity: [1, 0.5, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                ✨ Nova is thinking...
              </motion.span>
            ) : '✨ Generate Catalog Post'}
          </motion.button>
        </motion.div>

        {/* Results */}
        <AnimatePresence>
          {(hindiPost || englishPost) && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 30 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            >
              {/* Hindi Post */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="mb-4 p-5 rounded-xl bg-white/5 border border-white/10 border-l-4 border-l-green-400"
              >
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-orange-400 font-bold text-sm uppercase tracking-widest">📱 Hindi Post</h3>
                  <button
                    onClick={() => handleCopy(hindiPost)}
                    className="text-xs text-zinc-400 hover:text-white transition-colors px-3 py-1 rounded-lg bg-white/5 hover:bg-white/10"
                  >
                    Copy
                  </button>
                </div>
                <p className="text-zinc-200 leading-relaxed whitespace-pre-wrap">{hindiPost}</p>
              </motion.div>

              {/* English Post */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="mb-6 p-5 rounded-xl bg-white/5 border border-white/10 border-l-4 border-l-orange-400"
              >
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-orange-400 font-bold text-sm uppercase tracking-widest">🌐 English Post</h3>
                  <button
                    onClick={() => handleCopy(englishPost)}
                    className="text-xs text-zinc-400 hover:text-white transition-colors px-3 py-1 rounded-lg bg-white/5 hover:bg-white/10"
                  >
                    Copy
                  </button>
                </div>
                <p className="text-zinc-200 leading-relaxed whitespace-pre-wrap">{englishPost}</p>
              </motion.div>

              {/* Copy Both Button */}
              <motion.button
                onClick={() => handleCopy(`${hindiPost}\n\n---\n\n${englishPost}`)}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-4 rounded-xl font-bold uppercase tracking-widest text-white bg-gradient-to-r from-orange-500 to-orange-600 shadow-lg shadow-orange-500/20"
              >
                {copied ? '✅ Copied!' : '📋 Copy Both to WhatsApp'}
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-center mt-16 text-zinc-600 text-sm"
        >
          Made with ❤️ for India's 60M small businesses
          <br />
          <span className="text-zinc-700">Powered by AWS Bedrock Nova • Lambda • DynamoDB</span>
        </motion.footer>
      </div>
    </main>
  );
}