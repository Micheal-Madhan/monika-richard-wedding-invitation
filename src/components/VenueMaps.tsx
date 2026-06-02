import React, { useState } from 'react';
import { MapPin, Navigation, Map, Globe, ShieldCheck } from 'lucide-react';

export default function VenueMaps() {
  const [activeTab, setActiveTab] = useState<'engagement' | 'wedding'>('wedding');

  const venues = {
    engagement: {
      name: 'Nagarathar Community Hall',
      area: 'Balaji Nagar, NSC Bose Nagar, Thanjavur',
      embedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.1!2d79.1!3d10.76!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3baab!2sThanjavur!5e0!3m2!1sen!2sin!4v1780403148521',
      directUrl: 'https://www.google.com/maps/search/?api=1&query=Nagarathar+Community+Hall+Thanjavur+Tamil+Nadu',
      coordinates: '10.7684, 79.1378',
    },
    wedding: {
      name: 'Our Lady of Lourdes Church',
      area: 'Mangalapuram, Thanjavur – 613007',
      embedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.0620803306877!2d79.1305417!3d10.7816111!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3baab898cc00bfbb%3A0x868c2ee347dfafaf!2sOur+Lady+of+Lourdes+Church+Thanjavur!5e0!3m2!1sen!2sin!4v1780403160000',
      directUrl: 'https://www.google.com/maps/search/?api=1&query=Our+Lady+of+Lourdes+Church+Mangalapuram+Thanjavur',
      coordinates: '10.7816° N, 79.1305° E',
    }
  };

  const activeVenue = venues[activeTab];

  return (
    <div className="py-6 px-4 max-w-4xl mx-auto space-y-10">
      <div className="text-center">
        <h3 className="font-serif text-3xl sm:text-4xl tracking-wide text-neutral-800 dark:text-neutral-100">
          Interactive Venues Map
        </h3>
        <p className="font-sans text-xs uppercase tracking-widest text-neutral-500 mt-2">
          Navigate Effortlessly to our Celebration Venues
        </p>
      </div>

      <div className="rounded-3xl overflow-hidden bg-white/75 dark:bg-neutral-900/85 backdrop-blur-md border border-yellow-500/15 shadow-xl p-4 sm:p-6 space-y-6">
        {/* Venue Toggles */}
        <div className="grid grid-cols-2 p-1.5 rounded-2xl bg-ivory-50/50 dark:bg-neutral-950/40 border border-yellow-500/10">
          <button
            id="tab_venue_wedding"
            onClick={() => setActiveTab('wedding')}
            className={`py-3.5 rounded-xl font-serif text-sm tracking-wide transition-all duration-300 flex items-center justify-center gap-2 focus:outline-none ${
              activeTab === 'wedding'
                ? 'bg-yellow-600 text-white shadow-md font-semibold'
                : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
            }`}
          >
            <Globe className="w-4 h-4 shrink-0" />
            💒 Wedding Venue
          </button>

          <button
            id="tab_venue_engagement"
            onClick={() => setActiveTab('engagement')}
            className={`py-3.5 rounded-xl font-serif text-sm tracking-wide transition-all duration-300 flex items-center justify-center gap-2 focus:outline-none ${
              activeTab === 'engagement'
                ? 'bg-yellow-600 text-white shadow-md font-semibold'
                : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
            }`}
          >
            <Map className="w-4 h-4 shrink-0" />
            💍 Engagement Venue
          </button>
        </div>

        {/* Info detail banner */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4 rounded-2xl bg-yellow-500/5 border border-yellow-500/10 animate-fade-in">
          <div className="space-y-1">
            <h4 className="font-serif text-base font-bold text-neutral-800 dark:text-neutral-100">
              {activeVenue.name}
            </h4>
            <p className="text-xs font-sans text-neutral-500 dark:text-neutral-400 font-medium flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-yellow-600" />
              {activeVenue.area}
            </p>
            <p className="text-[10px] font-mono text-neutral-400">
              Coordinates: {activeVenue.coordinates}
            </p>
          </div>

          <a
            href={activeVenue.directUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-xs font-sans uppercase tracking-widest font-bold text-white bg-yellow-600 hover:bg-yellow-500 hover:scale-[1.02] active:scale-95 transition-all duration-300 shadow"
          >
            <Navigation className="w-4 h-4" />
            Get Direct Routes
          </a>
        </div>

        {/* Map Frame Holder */}
        <div className="relative aspect-video sm:h-[400px] w-full rounded-2xl overflow-hidden border border-yellow-500/10 shadow-inner bg-neutral-100">
          {/* Note: Standard embedded google map iframer */}
          <iframe
            src={activeVenue.embedUrl}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen={false}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title={activeVenue.name}
            className="w-full h-full grayscale-[0.25] brightness-[0.98] contrast-[1.01]"
          />

          <div className="absolute bottom-3 left-3 bg-white/90 dark:bg-neutral-900/90 backdrop-blur px-3 py-1.5 rounded-lg border border-yellow-500/20 shadow text-[9px] font-sans tracking-wide font-semibold text-neutral-600 dark:text-neutral-300 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            Actual coordinates resolved
          </div>
        </div>
      </div>
    </div>
  );
}
