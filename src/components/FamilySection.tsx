import React from 'react';
import { User, Shield, Briefcase, Award, Sparkles, Heart } from 'lucide-react';

export default function FamilySection() {
  const brideFamily = {
    parents: [
      { name: 'Mr. G. Sudalaimani', role: 'Beloved Father' },
      { name: 'Mrs. S. Stella Mary', role: 'Beloved Mother' }
    ],
    sibling: {
      name: 'S. Michael Mathan, B.Tech.',
      role: 'Brother / Software Developer',
      company: 'Tata Consultancy Services (TCS), Chennai'
    },
  };

  const groomFamily = {
    parents: [
      { name: 'Mr. S. Balakrishnan', alias: 'Antony', role: 'Beloved Father', details: 'Assistant Sub-Inspector of Police (Retired)' },
      { name: 'Mrs. P. Susila', role: 'Beloved Mother' }
    ],
    siblings: [
      {
        name: 'Mr. Joe John Kennedy, B.E. Mech Eng.',
        role: 'Uncle / Data Center Operations Engineer',
      },
      {
        name: 'Mrs. Delsy John Kennedy',
        role: 'Sister / B.Sc Nursing'
      }
    ],
  };

  return (
    <div className="py-6 px-4 max-w-5xl mx-auto space-y-16">
      <div className="text-center">
        <h3 className="font-serif text-3xl sm:text-4xl tracking-wide text-neutral-800 dark:text-neutral-100">
          The Families
        </h3>
        <p className="font-sans text-xs uppercase tracking-widest text-neutral-500 mt-2">
          Blessed by Loving Parents and Families
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-12">
        {/* Bride's Family */}
        <div className="flex flex-col h-full p-6 sm:p-8 rounded-3xl bg-rose-50/20 dark:bg-neutral-900/40 border border-rose-500/10 shadow-sm space-y-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/5 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-500" />
          
          <div className="flex items-center gap-2 pb-4 border-b border-rose-500/10">
            <Heart className="w-5 h-5 text-rose-500 fill-rose-500/20" />
            <h4 className="font-serif text-2xl font-bold tracking-wide text-rose-800 dark:text-rose-300">
              Bride's Family
            </h4>
          </div>

          {/* Parents */}
          <div className="space-y-4">
            <p className="text-[10px] uppercase font-sans tracking-widest text-neutral-400 dark:text-neutral-500">Parents</p>
            {brideFamily.parents.map((p, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-450">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-serif text-base font-semibold text-rose-900 dark:text-rose-100">{p.name}</p>
                  <p className="text-xs font-sans text-neutral-500 dark:text-neutral-400">{p.role}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Sibling */}
          <div className="space-y-3 pt-2">
            <p className="text-[10px] uppercase font-sans tracking-widest text-neutral-400 dark:text-neutral-500">Sibling</p>
            <div className="p-4 rounded-2xl bg-white/60 dark:bg-neutral-950/40 border border-rose-500/5 space-y-1">
              <div className="flex items-center gap-2 text-rose-600 dark:text-rose-455">
                <Award className="w-4 h-4" />
                <span className="text-xs uppercase font-sans tracking-wider font-semibold">Groom's Sister-in-Law or Sibling</span>
              </div>
              <p className="font-serif text-sm font-bold text-rose-900 dark:text-rose-100">{brideFamily.sibling.name}</p>
              <p className="text-xs font-sans text-neutral-500 dark:text-neutral-400 font-medium">{brideFamily.sibling.role}</p>
              <p className="text-[11px] font-sans text-neutral-400 dark:text-neutral-400 italic">{brideFamily.sibling.company}</p>
            </div>
          </div>
        </div>

        {/* Groom's Family */}
        <div className="flex flex-col h-full p-6 sm:p-8 rounded-3xl bg-yellow-50/20 dark:bg-neutral-900/40 border border-yellow-500/10 shadow-sm space-y-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/5 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-500" />

          <div className="flex items-center gap-2 pb-4 border-b border-yellow-500/10">
            <Sparkles className="w-5 h-5 text-yellow-600 dark:text-yellow-500" />
            <h4 className="font-serif text-2xl font-bold tracking-wide text-amber-800 dark:text-amber-300">
              Groom's Family
            </h4>
          </div>

          {/* Parents */}
          <div className="space-y-4">
            <p className="text-[10px] uppercase font-sans tracking-widest text-neutral-400 dark:text-neutral-500">Parents</p>
            {groomFamily.parents.map((p, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-yellow-500/10 text-yellow-600 dark:text-yellow-450">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-serif text-base font-semibold text-amber-900 dark:text-amber-100">
                    {p.name} {p.alias ? <span className="text-sm font-sans font-normal text-neutral-500">({p.alias})</span> : ''}
                  </p>
                  <p className="text-xs font-sans text-neutral-500 dark:text-neutral-400">{p.role}</p>
                  {p.details && (
                    <p className="text-[11px] font-sans text-amber-700 dark:text-amber-500 font-medium flex items-center gap-1 mt-0.5">
                      <Shield className="w-3.5 h-3.5" />
                      {p.details}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Siblings */}
          <div className="space-y-3 pt-2">
            <p className="text-[10px] uppercase font-sans tracking-widest text-neutral-400 dark:text-neutral-500">Siblings</p>
            <div className="grid sm:grid-cols-2 gap-3">
              {groomFamily.siblings.map((sib: any, i) => (
                <div key={i} className="p-4 rounded-2xl bg-white/60 dark:bg-neutral-950/40 border border-yellow-500/5 space-y-1">
                  <div className="flex items-center gap-1.5 text-yellow-600 dark:text-yellow-550">
                    <Briefcase className="w-3.5 h-3.5" />
                    <span className="text-[9px] uppercase font-sans tracking-wider font-semibold">Sibling</span>
                  </div>
                  <p className="font-serif text-xs font-bold text-amber-900 dark:text-amber-100 leading-tight">{sib.name}</p>
                  <p className="text-[10px] font-sans text-neutral-500 dark:text-neutral-400 leading-tight">{sib.role}</p>
                  {sib.company && (
                    <p className="text-[9px] font-sans text-neutral-400 dark:text-neutral-400 italic leading-none">{sib.company}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
