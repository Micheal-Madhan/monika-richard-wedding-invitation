import React, { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX, Music, Bell } from 'lucide-react';
import weddingSong from '../assets/music/wedding-song.mp3';

interface AudioPlayerProps {
  isPlaying: boolean;
  onToggle: (play: boolean) => void;
}

export default function AudioPlayer({ isPlaying, onToggle }: AudioPlayerProps) {
  const audioCtxRef = useRef<AudioContext | null>(null);
  const bgAudioRef = useRef<HTMLAudioElement | null>(null);
  const bgSourceNodeRef = useRef<MediaElementAudioSourceNode | null>(null);
  const isStartingRef = useRef(false);
  const isMountedRef = useRef(true);
  const bellIntervalRef = useRef<any>(null);
  const synthIntervalRef = useRef<any>(null);
  const activeNodesRef = useRef<AudioNode[]>([]);
  const [bellCount, setBellCount] = useState(0);

  // sync refs to avoid start/stop races between click handler and effect
  const isPlayingRef = useRef<boolean>(isPlaying);
  const lastUserToggleRef = useRef<boolean>(false);
  
  const BG_TRACK = weddingSong;
  // YouTube stream option (no download): video id for the URL you provided
  const YT_VIDEO_ID = 'I7ytxuPnkZ0';
  const ytPlayerRef = useRef<any>(null);

  const loadYouTubeApi = (): Promise<void> => {
    return new Promise((resolve) => {
      if ((window as any).YT && (window as any).YT.Player) return resolve();
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      document.body.appendChild(tag);
      (window as any).onYouTubeIframeAPIReady = () => resolve();
    });
  };

  const initAudio = () => {
    if (!audioCtxRef.current) {
      const AudioCtxConstructor = window.AudioContext || (window as any).webkitAudioContext;
      audioCtxRef.current = new AudioCtxConstructor();
    }
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
  };

  const startBackgroundAudio = async () => {
    // serialize start attempts to avoid play/pause race (AbortError) in dev StrictMode
    if (isStartingRef.current) return;
    isStartingRef.current = true;
    try {
      if (!audioCtxRef.current) initAudio();

      if (!bgAudioRef.current) {
        bgAudioRef.current = new Audio(BG_TRACK);
        bgAudioRef.current.loop = true;
        bgAudioRef.current.preload = 'auto';
        bgAudioRef.current.crossOrigin = 'anonymous';
        bgAudioRef.current.volume = 0.6;
      }

      // Resume AudioContext if suspended (user gesture may be required)
      if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
        await audioCtxRef.current.resume();
      }

      // create MediaElementSource only once and connect
      if (audioCtxRef.current && !bgSourceNodeRef.current) {
        try {
          bgSourceNodeRef.current = audioCtxRef.current.createMediaElementSource(bgAudioRef.current);
          bgSourceNodeRef.current.connect(audioCtxRef.current.destination);
        } catch (e) {
          console.warn('Could not create MediaElementAudioSourceNode:', e);
        }
      }

      // bail out if component unmounted while awaiting
      if (!isMountedRef.current) return;

      // play() can be aborted; swallow AbortError and return gracefully
      await bgAudioRef.current.play().catch((err) => {
        if (err && err.name === 'AbortError') {
          console.warn('play() aborted (likely race with pause):', err);
          return;
        }
        // NotSupportedError often means the file was missing or unsupported
        console.error('Background audio play failed:', err);
        throw err;
      });

      console.log('Background audio started:', BG_TRACK);
    } catch (error) {
      // helpful hint for NotSupportedError
      if (error && (error.name === 'NotSupportedError' || /NotSupported/i.test(error.message || ''))) {
        console.error('NotSupportedError: check that the MP3 exists and is a supported format, and that the path is correct.');
      } else {
        console.error('Error starting background audio:', error);
      }
    } finally {
      isStartingRef.current = false;
    }
  };

  const stopBackgroundAudio = () => {
    try {
      // prevent stopping while starting
      if (isStartingRef.current) {
        // small delay to allow start to finish; avoids AbortError races
        setTimeout(() => {
          try {
            if (bgAudioRef.current) { bgAudioRef.current.pause(); bgAudioRef.current.currentTime = 0; }
            if (bgSourceNodeRef.current) { bgSourceNodeRef.current.disconnect(); bgSourceNodeRef.current = null; }
          } catch (e) {}
        }, 50);
      } else {
        if (bgAudioRef.current) { bgAudioRef.current.pause(); bgAudioRef.current.currentTime = 0; }
        if (bgSourceNodeRef.current) { try { bgSourceNodeRef.current.disconnect(); } catch (e) {} bgSourceNodeRef.current = null; }
      }
      console.log('Background audio stopped');
    } catch (e) {
      console.warn('Error stopping background audio', e);
    }
  };

  // Synthesize a beautiful cathedral bell strike
  const playChurchBell = (frequency: number = 220, intensity: number = 0.5) => {
    if (!audioCtxRef.current || audioCtxRef.current.state === 'suspended') return;
    const ctx = audioCtxRef.current;
    const now = ctx.currentTime;

    // A bell has multiple inharmonic partials
    const partials = [
      { ratio: 1.0, gainVal: 0.8 },
      { ratio: 1.5, gainVal: 0.4 },
      { ratio: 2.0, gainVal: 0.3 },
      { ratio: 2.6, gainVal: 0.2 },
      { ratio: 3.2, gainVal: 0.15 },
      { ratio: 4.1, gainVal: 0.1 },
    ];

    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0, now);
    masterGain.gain.linearRampToValueAtTime(intensity * 0.4, now + 0.05);
    masterGain.gain.exponentialRampToValueAtTime(0.0001, now + 6); // Ring decay of 6 seconds
    masterGain.connect(ctx.destination);
    activeNodesRef.current.push(masterGain);

    partials.forEach((partial) => {
      const osc = ctx.createOscillator();
      const pGain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(frequency * partial.ratio, now);
      pGain.gain.setValueAtTime(partial.gainVal, now);

      osc.connect(pGain);
      pGain.connect(masterGain);
      osc.start(now);
      osc.stop(now + 6);
    });

    setBellCount(prev => prev + 1);
  };

  // Synthesize a continuous traditional Shruthi Box drone
  const playShruthiDrone = () => {
    if (!audioCtxRef.current || audioCtxRef.current.state === 'suspended') return;
    const ctx = audioCtxRef.current;
    const now = ctx.currentTime;

    const droneGain = ctx.createGain();
    droneGain.gain.setValueAtTime(0, now);
    droneGain.gain.linearRampToValueAtTime(0.04, now + 2.0); // slow fade in
    droneGain.connect(ctx.destination);
    activeNodesRef.current.push(droneGain);

    // Deep rich roots: C2, C3, G3, C4 representing traditional Shruthi Box grounding chords
    const tones = [65.41, 130.81, 196.00, 261.63];
    tones.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const pGain = ctx.createGain();

      osc.type = 'triangle'; // Sweet woodwind
      osc.frequency.setValueAtTime(freq, now);
      // Sweet chorus detuning
      osc.detune.setValueAtTime(idx * 3 - 5, now);
      
      pGain.gain.setValueAtTime(0.25, now);

      // Lowpass filter for warm background noise avoidance
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(250, now);

      osc.connect(pGain);
      pGain.connect(filter);
      filter.connect(droneGain);

      osc.start(now);
      
      activeNodesRef.current.push(osc);
    });
  };

  // Play a traditional simulated flute/nadaswaram note with elegant pitch slides (portamento) and vibrato
  const playMelodyNote = (freq: number, duration: number, nextFreq: number = 0) => {
    if (!audioCtxRef.current || audioCtxRef.current.state === 'suspended' || freq === 0) return;
    const ctx = audioCtxRef.current;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    osc.type = 'triangle'; // Warm breathing woodwind
    osc.frequency.setValueAtTime(freq, now);

    const buzzOsc = ctx.createOscillator();
    buzzOsc.type = 'sawtooth';
    buzzOsc.frequency.setValueAtTime(freq, now);

    // Warm resonant filter to give that rich real wooden instrument feel
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(700, now);
    filter.Q.setValueAtTime(5, now);

    // Slow organic attack and release envelope
    const envelope = ctx.createGain();
    envelope.gain.setValueAtTime(0, now);
    envelope.gain.linearRampToValueAtTime(0.04, now + 0.1); // attack
    envelope.gain.setValueAtTime(0.04, now + duration - 0.15); // sustain
    envelope.gain.exponentialRampToValueAtTime(0.0001, now + duration); // release

    // Authentic slides (glide/portamento) to next melody tone
    if (nextFreq > 0) {
      osc.frequency.exponentialRampToValueAtTime(nextFreq, now + duration);
      buzzOsc.frequency.exponentialRampToValueAtTime(nextFreq, now + duration);
    }

    // Dynamic wind vibrato (6 Hz oscillator)
    const vibratoOsc = ctx.createOscillator();
    const vibratoGain = ctx.createGain();
    vibratoOsc.frequency.setValueAtTime(5.8, now);
    vibratoGain.gain.setValueAtTime(4.5, now);

    vibratoOsc.connect(vibratoGain);
    vibratoGain.connect(osc.frequency);
    vibratoGain.connect(buzzOsc.frequency);

    const oscGain = ctx.createGain();
    oscGain.gain.setValueAtTime(0.5, now);
    osc.connect(oscGain);

    const buzzGain = ctx.createGain();
    buzzGain.gain.setValueAtTime(0.12, now); // subtle reed buzz
    buzzOsc.connect(buzzGain);

    oscGain.connect(filter);
    buzzGain.connect(filter);
    filter.connect(envelope);
    envelope.connect(ctx.destination);

    // Engage
    osc.start(now);
    buzzOsc.start(now);
    vibratoOsc.start(now);

    osc.stop(now + duration + 0.1);
    buzzOsc.stop(now + duration + 0.1);
    vibratoOsc.stop(now + duration + 0.1);

    activeNodesRef.current.push(osc, buzzOsc, vibratoOsc, envelope);
  };

  useEffect(() => {
    // keep ref in sync for async start/stop logic
    isPlayingRef.current = isPlaying;

    // If the change originated from the user's click handler we already performed the action,
    // so skip the duplicate work here. This prevents immediate stop/start races.
    if (lastUserToggleRef.current) {
      lastUserToggleRef.current = false;
      return;
    }

    if (isPlaying) {
      initAudio();
      // Only play the external background track. Remove synthesized melody/drone/bells.
      startBackgroundAudio();
    } else {
      // Stop background audio and clear any timers if present
      if (bellIntervalRef.current) {
        clearInterval(bellIntervalRef.current);
        bellIntervalRef.current = null;
      }
      if (synthIntervalRef.current) {
        clearTimeout(synthIntervalRef.current);
        synthIntervalRef.current = null;
      }
      // Stop any active synth nodes (if accidentally running)
      activeNodesRef.current.forEach((node) => {
        try {
          if ('gain' in node) {
            (node as GainNode).gain.setValueAtTime(0, audioCtxRef.current?.currentTime || 0);
          }
          // disconnect if possible
          if ('disconnect' in node) {
            (node as any).disconnect();
          }
        } catch (e) {}
      });
      activeNodesRef.current = [];
      // stop the HTMLAudioElement and disconnect its source node
      if (bgAudioRef.current) {
        try {
          bgAudioRef.current.pause();
          bgAudioRef.current.currentTime = 0;
        } catch (e) {}
      }
      if (bgSourceNodeRef.current) {
        try {
          bgSourceNodeRef.current.disconnect();
        } catch (e) {}
        bgSourceNodeRef.current = null;
      }
    }

    return () => {
      if (bellIntervalRef.current) clearInterval(bellIntervalRef.current);
      if (synthIntervalRef.current) clearTimeout(synthIntervalRef.current);
      if (bgSourceNodeRef.current) {
        try { bgSourceNodeRef.current.disconnect(); } catch (e) {}
        bgSourceNodeRef.current = null;
      }
      if (bgAudioRef.current) {
        try { bgAudioRef.current.pause(); bgAudioRef.current.currentTime = 0; } catch (e) {}
        bgAudioRef.current = null;
      }
    };
  }, [isPlaying]);

  // Try autoplay on mount; if blocked, wait for first user gesture then start
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        await startBackgroundAudio();
        if (mounted && !isPlaying) onToggle(true);
        console.log('Autoplay attempt succeeded');
      } catch (err: any) {
        const msg = err?.message || '';
        if (err?.name === 'NotAllowedError' || /not.*allowed|user gesture/i.test(msg)) {
          console.log('Autoplay blocked — will start on first user gesture');
          const onFirstGesture = async () => {
            try {
              await startBackgroundAudio();
              if (!isPlaying) onToggle(true);
            } catch (e) { /* ignore */ }
          };
          document.addEventListener('click', onFirstGesture, { once: true });
          document.addEventListener('keydown', onFirstGesture, { once: true });
        } else {
          console.error('Autoplay error', err);
        }
      }
    })();
    return () => { mounted = false; };
  }, []); 

  // Expose an imperative starter so other UI (e.g. "Open invitation" button) can
  // trigger the audio to start, e.g. after a user gesture.
  // @ts-ignore
  window._startAudio = startBackgroundAudio;

  const toggleSound = () => {
    // mark that this toggle came from the user to avoid duplicate work in useEffect
    lastUserToggleRef.current = true;
    // keep ref up-to-date for any async start/stop
    isPlayingRef.current = isPlaying ? false : true;
    // notify parent state immediately
    onToggle(!isPlaying);
    // perform start/stop immediately under the user gesture
    if (!isPlaying) {
      initAudio();
      startBackgroundAudio();
    } else {
      stopBackgroundAudio();
    }
  };

  const ringManualBell = () => {
    initAudio();
    // Beautiful random bell chord
    const bellFrequencies = [261.63, 311.13, 329.63, 392.00, 523.25];
    const randFreq = bellFrequencies[Math.floor(Math.random() * bellFrequencies.length)];
    playChurchBell(randFreq, 0.75);
  };

  const startYouTube = async () => {
    try {
      await loadYouTubeApi();
      if (!ytPlayerRef.current) {
        ytPlayerRef.current = new (window as any).YT.Player('yt-player', {
          height: '0', width: '0',
          videoId: YT_VIDEO_ID,
          playerVars: { autoplay: 0, controls: 0, modestbranding: 1, rel: 0, playsinline: 1 },
          events: {
            onReady: (e: any) => { try { e.target.playVideo(); } catch (e) {} },
          },
        });
      } else {
        try { ytPlayerRef.current.playVideo(); } catch (e) {}
      }
      console.log('YouTube player started');
    } catch (e) {
      console.error('YouTube start error', e);
    }
  };

  const stopYouTube = () => {
    try {
      if (ytPlayerRef.current) {
        ytPlayerRef.current.pauseVideo();
      }
    } catch (e) {}
  };

  return (
    <div className="fixed top-4 right-4 z-50 flex items-center gap-2">
      <button
        id="btn_manual_bell_ring"
        onClick={ringManualBell}
        className="p-3 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md rounded-full shadow-lg border border-yellow-500/30 text-yellow-600 dark:text-yellow-500 hover:scale-110 active:scale-95 transition-all duration-300 group"
        title="Ring Church Bell"
      >
        <Bell className="w-5 h-5 animate-pulse group-hover:rotate-12" />
      </button>

      <button
        id="btn_music_toggle"
        onClick={toggleSound}
        className="flex items-center gap-2 px-4 py-3 bg-white/85 dark:bg-neutral-900/85 backdrop-blur-md rounded-full shadow-lg border border-yellow-500/20 text-neutral-800 dark:text-neutral-200 hover:scale-105 active:scale-95 transition-all duration-300"
      >
        {isPlaying ? (
          <>
            <Volume2 className="w-5 h-5 text-emerald-600 animate-bounce" />
            <span className="text-xs font-serif tracking-widest hidden sm:inline uppercase text-yellow-600 dark:text-yellow-500">Music Playing</span>
          </>
        ) : (
          <>
            <VolumeX className="w-5 h-5 text-rose-500" />
            <span className="text-xs font-serif tracking-widest hidden sm:inline uppercase text-neutral-500">Muted</span>
          </>
        )}
      </button>
    </div>
  );
}
