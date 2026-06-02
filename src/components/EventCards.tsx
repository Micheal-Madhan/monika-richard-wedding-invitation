import React from 'react';
import { Calendar, MapPin, Navigation, Clock, BellRing, Sparkles } from 'lucide-react';

export default function EventCards() {
  
  // Helper to generate and download a standard .ics calendar file dynamically
  const handleAddToCalendar = (title: string, desc: string, location: string, startDateStr: string, endDateStr: string) => {
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Monika and Richard Wedding Applet//EN',
      'BEGIN:VEVENT',
      `SUMMARY:${title}`,
      `DESCRIPTION:${desc.replace(/\n/g, '\\n')}`,
      `LOCATION:${location.replace(/\n/g, '\\n')}`,
      `DTSTART:${startDateStr}`,
      `DTEND:${endDateStr}`,
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${title.toLowerCase().replace(/\s+/g, '_')}_reminder.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const events = [
    {
      id: 'event_engagement',
      title: '💍 The Engagement Engagement',
      localTitle: 'நிச்சயதார்த்தம்',
      date: 'June 16, 2026',
      time: '6:30 PM Onwards',
      location: 'Nagarathar Community Hall, Balaji Nagar, N S C Bose Nagar, Ramani Nagar, Thanjavur',
      tamilLocation: 'நகரத்தார் கம்யூனிட்டி திருமண மண்டபம், பாலாஜி நகர், மருத்துவக்கல்லூரி சாலை, தஞ்சாவூர்',
      mapUrl: 'https://www.google.com/maps/search/?api=1&query=Nagarathar+Community+Hall+Thanjavur+Tamil+Nadu',
      icsTitle: 'Engagement: S. Monika & B. Richard',
      icsDesc: 'Join us for the grand engagement celebration of Monika and Richard in Thanjavur.',
      icsStart: '20260616T183000',
      icsEnd: '20260616T220000',
      bgImgUrl: '/src/assets/images/engagement_rings_pillow_1780403148521.png',
      badgeColor: 'bg-rose-500/10 border-rose-500/30 text-rose-700 dark:text-rose-400',
    },
    {
      id: 'event_wedding',
      title: '💒 The Holy Matrimony',
      localTitle: 'திருமணப் பெருவிழா',
      date: 'June 17, 2026',
      time: '9:30 AM – 10:45 AM',
      location: 'Our Lady of Lourdes Church, Mangalapuram, Thanjavur – 613007',
      tamilLocation: 'புனித லூர்து அன்னை ஆலயம், மங்களபுரம், தஞ்சாவூர்',
      mapUrl: 'https://www.google.com/maps/search/?api=1&query=Our+Lady+of+Lourdes+Church+Mangalapuram+Thanjavur',
      icsTitle: 'Holy Matrimony: S. Monika & B. Richard',
      icsDesc: 'Celebrate the Holy Wedding Ceremony of Monika & Richard at Our Lady of Lourdes Church, Thanjavur.',
      icsStart: '20260617T093000',
      icsEnd: '20260617T110000',
      bgImgUrl: '/src/assets/images/church_lourdes_altar_1780403124429.png',
      badgeColor: 'bg-yellow-500/10 border-yellow-500/30 text-yellow-700 dark:text-yellow-400',
    }
  ];

  return (
    <div className="py-6 px-4 max-w-4xl mx-auto space-y-12">
      <div className="text-center mb-10">
        <h3 className="font-serif text-3xl sm:text-4xl tracking-wide text-neutral-800 dark:text-neutral-100">
          The Celebrations
        </h3>
        <p className="font-sans text-xs uppercase tracking-widest text-neutral-500 mt-2">
          Join Us For These Holy Moments
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {events.map((event) => (
          <div
            id={event.id}
            key={event.id}
            className="flex flex-col h-full rounded-3xl overflow-hidden bg-white/75 dark:bg-neutral-900/75 backdrop-blur-md border border-yellow-500/15 shadow-md hover:shadow-xl hover:border-yellow-500/30 transition-all duration-500 group"
          >
            {/* Visual Header */}
            <div className="relative h-48 overflow-hidden bg-neutral-200">
              <img
                src={event.bgImgUrl}
                alt={event.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 select-none brightness-[0.9]"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] uppercase font-sans tracking-wider ${event.badgeColor} bg-white/10 backdrop-blur-sm border text-white`}>
                  {event.localTitle}
                </span>
                <h4 className="font-serif text-xl sm:text-2xl mt-1 tracking-wide text-white drop-shadow-sm">
                  {event.title}
                </h4>
              </div>
            </div>

            {/* Event Details */}
            <div className="p-6 flex-1 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                {/* Date */}
                <div className="flex items-center gap-3 text-neutral-700 dark:text-neutral-200">
                  <div className="p-2.5 rounded-full bg-yellow-500/10 text-yellow-600 dark:text-yellow-400">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-sans uppercase tracking-widest text-neutral-400 dark:text-neutral-500">Date</p>
                    <p className="font-serif text-sm font-semibold">{event.date}</p>
                  </div>
                </div>

                {/* Time */}
                <div className="flex items-center gap-3 text-neutral-700 dark:text-neutral-200">
                  <div className="p-2.5 rounded-full bg-yellow-500/10 text-yellow-600 dark:text-yellow-400">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-sans uppercase tracking-widest text-neutral-400 dark:text-neutral-500">Time</p>
                    <p className="font-serif text-sm font-semibold">{event.time}</p>
                  </div>
                </div>

                {/* Location */}
                <div className="flex gap-3 text-neutral-700 dark:text-neutral-200">
                  <div className="p-2.5 h-10 w-10 shrink-0 rounded-full bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 flex items-center justify-center">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <p className="text-[10px] font-sans uppercase tracking-widest text-neutral-400 dark:text-neutral-500">Address </p>
                    <p className="font-serif text-xs leading-relaxed font-semibold">{event.location}</p>
                    <p className="font-serif text-[11px] leading-relaxed text-neutral-500 mt-1 italic">{event.tamilLocation}</p>
                  </div>
                </div>
              </div>

              {/* Interaction Buttons */}
              <div className="grid grid-cols-2 gap-3 pt-4 border-t border-yellow-500/10">
                <a
                  href={event.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-sans uppercase tracking-widest text-yellow-750 bg-yellow-500/10 border border-yellow-500/20 hover:bg-yellow-500/20 active:scale-95 transition-all duration-300"
                >
                  <Navigation className="w-4 h-4 text-yellow-600" />
                  Navigate
                </a>

                <button
                  onClick={() => handleAddToCalendar(event.icsTitle, event.icsDesc, event.location, event.icsStart, event.icsEnd)}
                  className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-sans uppercase tracking-widest text-white bg-yellow-600 hover:bg-yellow-500 shadow-sm active:scale-95 transition-all duration-300"
                >
                  <BellRing className="w-4 h-4 text-yellow-100" />
                  Remind Me
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
