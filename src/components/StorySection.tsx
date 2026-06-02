import React, { useState } from 'react';
import { Heart, Sparkles, Star } from 'lucide-react';

export default function StorySection() {
  const [selectedEvent, setSelectedEvent] = useState<number | null>(null);

  const timeline = [
    {
      title: 'Our Beautiful Beginning',
      subtitle: 'Where Hearts Met',
      date: 'The Union of Two Families',
      description: 'S. Monika, pursuing B.Sc Nursing in historical Thanjavur, and B. Richard, a software engineer with sutherland (Hyderabad), were brought together through their families. Bridging Thanjavur and Hyderabad, they discovered a shared sense of faith, laughter, and high values. Instantly, an enduring promise blossomed.',
      icon: <Heart className="w-5 h-5 text-rose-500 animate-pulse" />,
      colorClass: 'border-rose-300 shadow-rose-200/20 text-rose-700 dark:text-rose-400',
    },
    {
      title: 'The Engagement Pledge',
      subtitle: '💍 The Promise of Forever',
      date: 'June 16, 2026',
      description: 'An exchange of rings at the Nagarathar Community Hall in Thanjavur. This stands as the gorgeous pre-wedding celebration where both extended families unite to bless their covenant, sealing their hearts together ahead of the holy sacrament.',
      icon: <Sparkles className="w-5 h-5 text-yellow-500" />,
      colorClass: 'border-yellow-300 shadow-yellow-250/20 text-yellow-700 dark:text-yellow-400',
    },
    {
      title: 'The Holy Sacrament',
      subtitle: '💒 Becoming One in Christ',
      date: 'June 17, 2026',
      description: 'The crowning peak of our journey under the magnificent vaulted columns of Our Lady of Lourdes Church, Thanjavur. Monika and Richard join hands under God’s ultimate blessing to begin their lifelong journey together as one.',
      icon: <Star className="w-5 h-5 text-emerald-500 animate-spin-slow" />,
      colorClass: 'border-emerald-300 shadow-emerald-250/20 text-emerald-700 dark:text-emerald-400',
    }
  ];

  return (
    <div className="relative py-4 px-4 sm:px-6">
      <div className="text-center mb-10">
        <h3 className="font-serif text-3xl sm:text-4xl tracking-wide text-neutral-800 dark:text-neutral-100">
          Our Love Story
        </h3>
        <p className="font-sans text-xs uppercase tracking-widest text-neutral-500 mt-2">
          Two Lives, One Holy Sacrament
        </p>
      </div>

      <div className="relative border-l border-yellow-500/30 max-w-lg mx-auto pl-6 sm:pl-8 space-y-12 py-4">
        {timeline.map((item, index) => (
          <div
            id={`story_card_${index}`}
            key={index}
            onClick={() => setSelectedEvent(selectedEvent === index ? null : index)}
            className="relative cursor-pointer group"
          >
            {/* Timeline Circle Bullet */}
            <div className={`absolute -left-[37px] sm:-left-[45px] top-1.5 w-7 sm:w-8 h-7 sm:h-8 rounded-full bg-white dark:bg-neutral-900 border border-yellow-500 flex items-center justify-center shadow-md group-hover:scale-110 active:scale-95 transition-all duration-300 z-10`}>
              {item.icon}
            </div>

            {/* Glassmorphism Card */}
            <div className={`p-5 sm:p-6 rounded-2xl bg-white/75 dark:bg-neutral-900/75 backdrop-blur-md border border-yellow-500/15 shadow-sm hover:shadow-lg hover:border-yellow-500/30 transition-all duration-300 group-hover:-translate-y-0.5`}>
              <span className="text-[10px] font-sans uppercase tracking-widest bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 px-2.5 py-1 rounded-full font-medium">
                {item.date}
              </span>

              <h4 className="font-serif text-xl text-neutral-800 dark:text-neutral-100 mt-3 font-semibold tracking-wide">
                {item.title}
              </h4>
              <p className="font-serif text-xs italic text-yellow-600 dark:text-yellow-400 mt-0.5">
                {item.subtitle}
              </p>

              <p className={`font-sans text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 mt-3 leading-relaxed transition-all duration-500 ${
                selectedEvent === index ? 'line-clamp-none' : 'line-clamp-3 sm:line-clamp-none'
              }`}>
                {item.description}
              </p>
              
              <div className="mt-3 flex justify-end">
                <span className="text-[10px] font-sans tracking-wide text-neutral-400 dark:text-neutral-500 sm:hidden">
                  {selectedEvent === index ? 'Tap to close' : 'Tap to read more'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
