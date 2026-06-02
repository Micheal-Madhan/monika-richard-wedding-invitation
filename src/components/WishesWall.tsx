import React, { useState, useEffect } from 'react';
import { db, isPlaceholder, handleFirestoreError, OperationType } from '../lib/firebase';
import { collection, doc, setDoc, onSnapshot, query, orderBy, limit } from 'firebase/firestore';
import { Sparkles, MessageCircle, Heart, Send, Loader2, Award } from 'lucide-react';
import { GuestWish } from '../types';

export default function WishesWall() {
  const [wishes, setWishes] = useState<GuestWish[]>([
    {
      id: 'seed_1',
      name: 'Mrs. S. Stella Mary (Mother of Bride)',
      message: 'Dearest Monika and Richard, we shower you with our prayers and love. May God lead your hearts together in absolute love, joy, and peace all the days of your family life. Love is the strongest covenant! 🌸',
      createdAt: new Date(Date.now() - 3600000 * 4).toISOString()
    },
    {
      id: 'seed_2',
      name: 'Mr. S. Balakrishnan (Father of Groom)',
      message: 'Wishing you both a blessed marital journey! Build your family on trust, mutual affection, and laughter. Congratulations Monika and Richard! 💐',
      createdAt: new Date(Date.now() - 3600000 * 24).toISOString()
    },
    {
      id: 'seed_3',
      name: 'S. Michael Mathan (Bride\'s Brother)',
      message: 'So happy for my sister Monika and brother Richard! Welcome to the family, Richard! May God bless your engagement, holy ceremony, and future together. 🚀 Cheers to a long happy chapter!',
      createdAt: new Date(Date.now() - 3600000 * 48).toISOString()
    }
  ]);

  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [panelError, setPanelError] = useState<string | null>(null);

  // Bind Real-Time Queries if Firebase is Live
  useEffect(() => {
    if (isPlaceholder) return;

    const path = 'wishes';
    const wishesQuery = query(collection(db, 'wishes'), orderBy('createdAt', 'desc'), limit(40));

    // Construct the live onSnapshot subscription as strictly defined by Firebase Skill
    const unsubscribe = onSnapshot(wishesQuery, (snapshot) => {
      const fetched: GuestWish[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        fetched.push({
          id: docSnap.id,
          name: data.name,
          message: data.message,
          createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : data.createdAt
        });
      });
      
      // Merge with seed wishes so the guest list is incredibly rich
      setWishes(prev => {
        const seedWishes = prev.filter(w => w.id.startsWith('seed_'));
        const uniqueFetched = fetched.filter(f => !seedWishes.some(s => s.id === f.id));
        return [...fetched, ...seedWishes];
      });
    }, (error) => {
      // MANDATORY onError Callback
      handleFirestoreError(error, OperationType.LIST, path);
    });

    return () => unsubscribe();
  }, []);

  // Fetch local storage ones if placeholder at startup
  useEffect(() => {
    if (!isPlaceholder) return;
    try {
      const stored = localStorage.getItem('wedding_wishes');
      if (stored) {
        const storedWishes: GuestWish[] = JSON.parse(stored);
        setWishes(prev => {
          const seeds = prev.filter(w => w.id.startsWith('seed_'));
          return [...storedWishes, ...seeds];
        });
      }
    } catch (e) {}
  }, []);

  const handlePostWish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) {
      setPanelError('Please enter both name and blessing message.');
      return;
    }

    setLoading(true);
    setPanelError(null);

    const wishId = `wish_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const newWish: GuestWish = {
      id: wishId,
      name: name.trim(),
      message: message.trim(),
      createdAt: new Date().toISOString()
    };

    if (isPlaceholder) {
      setTimeout(() => {
        try {
          const stored = localStorage.getItem('wedding_wishes');
          const localList: GuestWish[] = stored ? JSON.parse(stored) : [];
          localList.unshift(newWish);
          localStorage.setItem('wedding_wishes', JSON.stringify(localList));
          
          setWishes(prev => [newWish, ...prev]);
          setName('');
          setMessage('');
          setLoading(false);
        } catch (err) {
          setLoading(false);
          setPanelError('Failed to save message.');
        }
      }, 700);
    } else {
      const path = `wishes/${wishId}`;
      try {
        const { serverTimestamp } = await import('firebase/firestore');
        const docRef = doc(db, 'wishes', wishId);
        const payload = {
          name: newWish.name,
          message: newWish.message,
          createdAt: serverTimestamp() // Matches 'request.time' in firestore.rules exactly!
        };
        await setDoc(docRef, payload);
        
        setName('');
        setMessage('');
        setLoading(false);
      } catch (err) {
        setLoading(false);
        try {
          handleFirestoreError(err, OperationType.WRITE, path);
        } catch (e) {
          setPanelError('Permission denied or submission error.');
        }
      }
    }
  };

  return (
    <div className="py-6 px-4 max-w-4xl mx-auto space-y-12">
      <div className="text-center">
        <h3 className="font-serif text-3xl sm:text-4xl tracking-wide text-neutral-800 dark:text-neutral-100">
          The Wishes Wall
        </h3>
        <p className="font-sans text-xs uppercase tracking-widest text-neutral-500 mt-2">
          Shower Monika & Richard with Loving Blessings
        </p>
      </div>

      <div className="grid md:grid-cols-5 gap-8 items-start">
        {/* Form panel - 2/5 columns */}
        <div className="md:col-span-2 p-6 rounded-2xl bg-white/75 dark:bg-neutral-900/85 backdrop-blur-md border border-yellow-500/15 shadow-lg space-y-4">
          <div className="flex items-center gap-2 text-yellow-600 dark:text-yellow-500">
            <MessageCircle className="w-5 h-5" />
            <h4 className="font-serif text-lg font-semibold">Write Blessing</h4>
          </div>

          <form onSubmit={handlePostWish} className="space-y-4">
            {panelError && (
              <p className="text-xs font-sans text-rose-500 bg-rose-500/10 p-2 rounded-lg border border-rose-500/20 text-center animate-bounce">
                {panelError}
              </p>
            )}

            <div>
              <label htmlFor="wish_name" className="text-[10px] font-sans uppercase tracking-wider text-neutral-400 block font-medium">Your Name</label>
              <input
                id="wish_name"
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Uncle, Aunt, Friend..."
                maxLength={40}
                required
                className="w-full text-xs px-3 py-2.5 rounded-lg bg-ivory-50/40 dark:bg-neutral-950/40 border border-yellow-500/15 focus:border-yellow-500/40 outline-none transition-all placeholder:text-neutral-400"
              />
            </div>

            <div>
              <label htmlFor="wish_message" className="text-[10px] font-sans uppercase tracking-wider text-neutral-400 block font-medium">Your Wish or Prayer</label>
              <textarea
                id="wish_message"
                value={message}
                onChange={e => setMessage(e.target.value)}
                rows={4}
                placeholder="May God bless your sacred bond with eternal smiles and happiness..."
                maxLength={300}
                required
                className="w-full text-xs px-3 py-2.5 rounded-lg bg-ivory-50/40 dark:bg-neutral-950/40 border border-yellow-500/15 focus:border-yellow-500/40 outline-none transition-all placeholder:text-neutral-400 resize-none"
              />
            </div>

            <button
              id="btn_post_wish"
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 rounded-lg bg-yellow-600 hover:bg-yellow-500 text-white font-sans text-[10px] uppercase tracking-widest font-bold shadow active:scale-95 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  Post Wish ✨
                </>
              )}
            </button>
          </form>
        </div>

        {/* Scrollable list panel - 3/5 columns */}
        <div className="md:col-span-3 space-y-4 max-h-[480px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-yellow-500/10 hover:scrollbar-thumb-yellow-500/20">
          {wishes.map((w, index) => {
            const isFamilySeed = w.id.startsWith('seed_');
            return (
              <div
                id={`wish_bubble_${w.id}`}
                key={w.id}
                className={`p-5 rounded-2xl border transition-all duration-300 relative group truncate-none ${
                  isFamilySeed 
                    ? 'bg-rose-500/5 dark:bg-rose-500/10 border-rose-500/20 hover:border-rose-500/45' 
                    : 'bg-white/60 dark:bg-neutral-900/40 border-yellow-500/10 hover:border-yellow-500/35'
                }`}
              >
                <div className="flex items-center justify-between mb-2 pb-1 border-b border-yellow-500/5">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <Heart className={`w-3.5 h-3.5 shrink-0 ${isFamilySeed ? 'text-rose-500 fill-rose-500/20' : 'text-yellow-600 dark:text-yellow-500'}`} />
                    <span className="font-serif text-xs font-bold text-neutral-800 dark:text-neutral-100 truncate">
                      {w.name}
                    </span>
                  </div>
                  {isFamilySeed && (
                    <span className="text-[8px] font-sans uppercase tracking-widest font-semibold bg-rose-500/10 text-rose-700 dark:text-rose-400 px-2 py-0.5 rounded-full flex items-center gap-0.5">
                      <Sparkles className="w-2.5 h-2.5" />
                      Family
                    </span>
                  )}
                </div>

                <p className="font-sans text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed font-normal whitespace-pre-wrap">
                  {w.message}
                </p>

                <p className="text-[10px] text-neutral-400 font-sans mt-3 text-right">
                  {new Date(w.createdAt).toLocaleDateString(undefined, { 
                    month: 'short', 
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
