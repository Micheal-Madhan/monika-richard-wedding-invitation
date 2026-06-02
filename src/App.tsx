import React, { useState, useEffect } from 'react';
import { Sparkles, Heart, Bell, Music, Star, Volume2, Globe, Sun, Moon, Phone, MessageCircle } from 'lucide-react';
import AudioPlayer from './components/AudioPlayer';
import FloatingPetals from './components/FloatingPetals';
import Countdown from './components/Countdown';
import SectionDivider from './components/SectionDivider';
import StorySection from './components/StorySection';
import EventCards from './components/EventCards';
import FamilySection from './components/FamilySection';
import GallerySection from './components/GallerySection';
import RSVPForm from './components/RSVPForm';
import WishesWall from './components/WishesWall';
import VenueMaps from './components/VenueMaps';

export default function App() {
  const [isIntroOpen, setIsIntroOpen] = useState(true);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const weddingDate = new Date('2026-06-17T09:30:00');

  // Handle system dark mode matching or initial state
  useEffect(() => {
    const isDark = localStorage.getItem('wedding_dark_mode') === 'true';
    setDarkMode(isDark);
  }, []);

  const toggleDarkMode = () => {
    const nextMode = !darkMode;
    setDarkMode(nextMode);
    localStorage.setItem('wedding_dark_mode', String(nextMode));
  };

  const handleOpenInvitation = () => {
    setIsIntroOpen(false);
    // Start holy background music upon user gesture to comply with browser autocomplete policies
    setIsMusicPlaying(true);
  };

  return (
    <div className={`${darkMode ? 'dark bg-neutral-950 text-neutral-100' : 'bg-ivory-50 text-neutral-800'} min-h-screen transition-colors duration-500 font-sans`}>
      
      {/* Floating Petals Canvas Background */}
      <FloatingPetals />

      {/* Background Synthesizer Music Toggle */}
      {!isIntroOpen && (
        <AudioPlayer isPlaying={isMusicPlaying} onToggle={setIsMusicPlaying} />
      )}

      {/* Floating Dark/Light Toggle */}
      {!isIntroOpen && (
        <button
          id="btn_dark_mode_toggle"
          onClick={toggleDarkMode}
          className="fixed top-4 left-4 z-40 p-3 rounded-full bg-white/85 dark:bg-neutral-900/85 backdrop-blur-md shadow-lg border border-yellow-500/20 text-yellow-600 dark:text-yellow-400 hover:scale-110 active:scale-95 transition-all duration-300"
          title="Toggle Visual Theme"
        >
          {darkMode ? <Sun className="w-5 h-5 text-yellow-400 animate-spin-slow" /> : <Moon className="w-5 h-5 text-neutral-700" />}
        </button>
      )}

      {/* Floating WhatsApp SOS Button - Dynamic Link */}
      {!isIntroOpen && (
        <a
          id="btn_whatsapp_sos"
          href="https://wa.me/919994721304?text=Hi%20Monika%20%26%20Richard%21%20I%20just%20opened%20your%20beautiful%20wedding%20invitation%20website%20%E2%9C%A8"
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-6 right-6 z-40 flex items-center justify-center p-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 border border-emerald-400/20"
          title="WhatsApp Bride/Groom"
        >
          <MessageCircle className="w-6 h-6 animate-pulse" />
          <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 text-xs font-sans uppercase tracking-wider font-semibold">
            SOS
          </span>
        </a>
      )}

      {/* Luxury Intro Cover Page - Full Screen Overlay */}
      {isIntroOpen && (
        <div className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-ivory-50 dark:bg-neutral-950 p-6 text-center select-none overflow-hidden animate-fade-in">
          {/* Subtle floral background pattern or gradient glow */}
          <div className="absolute inset-0 bg-radial-gradient from-yellow-500/5 via-transparent to-transparent opacity-60" />
          
          <div className="relative max-w-sm w-full p-8 rounded-3xl bg-white/60 dark:bg-neutral-900/60 backdrop-blur-md border border-yellow-500/20 shadow-2xl space-y-6">
            <div className="space-y-2">
              <span className="text-[10px] uppercase tracking-[0.25em] font-sans font-semibold text-yellow-600 dark:text-yellow-400">
                Wedding Invitation
              </span>
              <p className="text-xs font-serif italic text-neutral-500">The Holy Covenant of</p>
            </div>

            <div className="py-4 space-y-2">
              <h1 className="font-serif text-4xl font-extrabold text-rose-600 dark:text-rose-400 tracking-wider">
                S. Monika
              </h1>
              <span className="font-cursive text-3xl text-yellow-600 block my-1">&</span>
              <h1 className="font-serif text-4xl font-extrabold text-amber-700 dark:text-amber-400 tracking-wider">
                B. Richard
              </h1>
            </div>

            <div className="h-[1px] w-12 bg-yellow-500/40 mx-auto" />

            <div className="space-y-1">
              <p className="text-[11px] uppercase tracking-widest font-sans text-neutral-400">Wedding Date</p>
              <p className="font-serif text-lg font-bold text-yellow-750 dark:text-yellow-400">June 17, 2026</p>
              <p className="text-[10px] italic font-serif text-neutral-500">புனித லூர்து அன்னை ஆலயம், தஞ்சாவூர்</p>
            </div>

            <button
              id="btn_open_invitation"
              onClick={handleOpenInvitation}
              className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-yellow-600 to-amber-700 hover:from-yellow-500 hover:to-amber-600 text-white font-sans text-xs uppercase tracking-widest font-bold shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 animate-spin-slow text-white" />
              Open Invitation
            </button>
          </div>
        </div>
      )}

      {/* Main Container Wrapper */}
      <div className="relative max-w-3xl mx-auto px-4 sm:px-6 md:px-8 py-10 space-y-20 z-20">
        
        {/* HERO SECTION */}
        <header className="relative flex flex-col items-center justify-center text-center pt-10 pb-6 space-y-8 select-none">
          <div className="space-y-2">
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-sans font-medium uppercase tracking-[0.2em] bg-yellow-500/10 border border-yellow-500/20 text-yellow-700 dark:text-yellow-400">
              <Star className="w-3 h-3 text-yellow-600 fill-yellow-600/20" />
              Precious Holy Sacrament
            </span>
            <p className="font-serif text-sm italic text-neutral-500 mt-2">
              Together with our families, we joyfully invite you to celebrate our Engagement and Wedding Ceremony.
            </p>
          </div>

          {/* Animated Intersecting Wedding Rings */}
          <div className="relative flex items-center justify-center w-36 h-20 mx-auto">
            {/* Ring 1 - Bride (Rose Gold Pink) */}
            <svg
              className="absolute left-6 w-16 h-16 text-rose-500 dark:text-rose-400 opacity-90 drop-shadow-md animate-bounce"
              viewBox="0 0 100 100"
              style={{ animationDuration: '4s' }}
            >
              <circle cx="50" cy="50" r="35" stroke="currentColor" strokeWidth="8" fill="none" />
              {/* Ring jewel accent */}
              <polygon points="50,5 57,15 43,15" fill="#fbcfe8" stroke="currentColor" strokeWidth="2" />
            </svg>
            {/* Ring 2 - Groom (Gold) */}
            <svg
              className="absolute right-6 w-16 h-16 text-yellow-600 dark:text-yellow-400 opacity-90 drop-shadow-md animate-bounce"
              viewBox="0 0 100 100"
              style={{ animationDuration: '4.5s', animationDelay: '0.5s' }}
            >
              <circle cx="50" cy="50" r="35" stroke="currentColor" strokeWidth="8" fill="none" />
              {/* Thick masculine texture line */}
              <circle cx="50" cy="50" r="28" stroke="currentColor" strokeWidth="2" fill="none" strokeDasharray="6,4" />
            </svg>
          </div>

          {/* Couple Display Names */}
          <div className="space-y-1">
            <h2 className="font-serif text-4xl sm:text-5xl font-extrabold tracking-wide text-rose-600 dark:text-rose-400 hover:scale-102 transition-transform duration-300">
              S. Monika <span className="text-sm font-sans font-normal text-neutral-500 block sm:inline italic">B.Sc Nursing</span>
            </h2>
            <p className="font-cursive text-4xl text-yellow-600 dark:text-yellow-500 my-2">&</p>
            <h2 className="font-serif text-4xl sm:text-5xl font-extrabold tracking-wide text-amber-700 dark:text-amber-400 hover:scale-102 transition-transform duration-300">
              B. Richard <span className="text-sm font-sans font-normal text-neutral-500 block sm:inline italic">B.E., Software Engineer</span>
            </h2>
            <p className="text-[11px] font-sans text-neutral-400 dark:text-neutral-500 uppercase tracking-widest mt-2">
              Thanjavur & Hyderabad
            </p>
          </div>

          <SectionDivider type="simple" />

          {/* Wedding Countdown Wrapper */}
          <div className="w-full">
            <Countdown weddingDate={weddingDate} />
          </div>
        </header>

        {/* BIBLE SCRIPTURE QUOTE */}
        <section id="section_bible_quote" className="py-4 text-center max-w-xl mx-auto">
          <div className="p-6 sm:p-8 rounded-3xl bg-yellow-500/5 border border-yellow-500/10 shadow-sm relative overflow-hidden">
            <div className="absolute top-2 left-3 text-7xl font-serif text-yellow-500/10 leading-none">“</div>
            <p className="font-serif text-base sm:text-lg italic text-yellow-800 dark:text-yellow-400 leading-relaxed relative z-10 px-4">
              "Love is patient, love is kind. It always protects, always trusts, always hopes, always perseveres."
            </p>
            <p className="font-sans text-[10px] uppercase tracking-widest font-semibold mt-4 text-neutral-500">
              — 1 Corinthians 13:4-7
            </p>
          </div>
        </section>

        <SectionDivider type="scroll" />

        {/* SECTION 1: STORY TIMELINE */}
        <section id="section_story">
          <StorySection />
        </section>

        <SectionDivider type="cross" />

        {/* SECTION 2 & 3: ENGAGEMENT & WEDDING EVENTS */}
        <section id="section_events">
          <EventCards />
        </section>

        {/* Animated Custom Church Bells Highlight */}
        <div className="py-6 flex flex-col items-center justify-center text-center space-y-3">
          <div className="p-4 rounded-full bg-yellow-500/10 text-yellow-600 dark:text-yellow-500 animate-bounce">
            <Bell className="w-8 h-8" />
          </div>
          <p className="font-serif text-[11px] tracking-widest uppercase text-yellow-750 dark:text-yellow-450">
            Hear the Church Bells Ring
          </p>
          <p className="font-sans text-xs text-neutral-400 max-w-xs leading-relaxed">
            Click the bell in the top right corner to ring the bells and share in our celebration sound.
          </p>
        </div>

        <SectionDivider type="scroll" />

        {/* SECTION 4 & 5: FAMILIES REGISTRY */}
        <section id="section_families">
          <FamilySection />
        </section>

        <SectionDivider type="cross" />

        {/* SECTION 6: WEDDING GALLERY */}
        <section id="section_gallery">
          <GallerySection />
        </section>

        <SectionDivider type="scroll" />

        {/* SECTION 7: rsvp submission */}
        <section id="section_rsvp">
          <RSVPForm />
        </section>

        <SectionDivider type="simple" />

        {/* SECTION 8: wishes board */}
        <section id="section_wishes">
          <WishesWall />
        </section>

        <SectionDivider type="cross" />

        {/* SECTION 9: locations maps */}
        <section id="section_maps">
          <VenueMaps />
        </section>

        {/* FOOTER */}
        <footer className="pt-10 pb-6 text-center border-t border-yellow-500/10 space-y-4">
          <p className="text-rose-500 text-lg sm:text-xl font-serif">
            ❤️ Thank You For Being Part Of Our Special Day ❤️
          </p>
          
          <div className="space-y-1">
            <p className="font-cursive text-3xl font-bold text-yellow-700 dark:text-yellow-400">
              Monika & Richard
            </p>
            <p className="text-[10px] font-sans uppercase tracking-[0.2em] text-neutral-400">
              June 17, 2026
            </p>
          </div>
        </footer>

      </div>
    </div>
  );
}
