import React, { useState } from 'react';
import { db, isPlaceholder, handleFirestoreError, OperationType } from '../lib/firebase';
import { collection, doc, setDoc } from 'firebase/firestore';
import { Mail, Phone, Users, CheckCircle, Send, Sparkles, Loader2, Heart } from 'lucide-react';
import { RSVPPayload } from '../types';

export default function RSVPForm() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    guestsCount: 1,
    attendingEngagement: true,
    attendingWedding: true,
    message: ''
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ 
        ...prev, 
        [name]: name === 'guestsCount' ? Math.max(1, parseInt(value) || 1) : value 
      }));
    }
  };

  const handleToggle = (field: 'attendingEngagement' | 'attendingWedding') => {
    setFormData(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setErrorMsg('Please enter your name.');
      return;
    }
    if (!formData.phone.trim()) {
      setErrorMsg('Please enter your phone number.');
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    const rsvpId = `rsvp_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const payload: RSVPPayload = {
      name: formData.name.trim(),
      phone: formData.phone.trim(),
      guestsCount: formData.guestsCount,
      attendingEngagement: formData.attendingEngagement,
      attendingWedding: formData.attendingWedding,
      message: formData.message.trim(),
      createdAt: new Date().toISOString()
    };

    if (isPlaceholder) {
      // Offline Local Storage Fallback - High-Fidelity Simulator
      setTimeout(() => {
        try {
          const stored = localStorage.getItem('wedding_rsvps');
          const rsvps = stored ? JSON.parse(stored) : [];
          rsvps.push(payload);
          localStorage.setItem('wedding_rsvps', JSON.stringify(rsvps));
          setLoading(false);
          setSubmitted(true);
        } catch (err) {
          setLoading(false);
          setErrorMsg('Failed to save RSVP. Please try again.');
        }
      }, 900);
    } else {
      // Live Firestore Database Writes (Secure ABAC write-only policy)
      const path = `rsvps/${rsvpId}`;
      try {
        const docRef = doc(db, 'rsvps', rsvpId);
        // Note: Rules check that 'createdAt' matches 'request.time' and 'guestsCount' is int.
        // We write the correct Firestore Server Timestamp or compatible Iso timestamp
        // Wait, firestore.rules requires: data.createdAt == request.time.
        // Let's write the exact payload compatible with the server rules!
        // To make sure request.time comparison passes, we can write request.time on server side!
        // In the client SDK, we can use the Firestore timestamp:
        const { serverTimestamp } = await import('firebase/firestore');
        const firestorePayload = {
          ...payload,
          createdAt: serverTimestamp() // Matches 'request.time' in rules exactly!
        };
        await setDoc(docRef, firestorePayload);
        setLoading(false);
        setSubmitted(true);
      } catch (err) {
        setLoading(false);
        // Clean error handler as strictly requested by the Firebase integration skill
        try {
          handleFirestoreError(err, OperationType.WRITE, path);
        } catch (serialErr: any) {
          setErrorMsg('Form submission error. Please check your credentials.');
        }
      }
    }
  };

  return (
    <div className="py-6 px-4 max-w-xl mx-auto">
      <div className="text-center mb-8">
        <h3 className="font-serif text-3xl sm:text-4xl tracking-wide text-neutral-800 dark:text-neutral-100">
          R.S.V.P
        </h3>
        <p className="font-sans text-xs uppercase tracking-widest text-neutral-500 mt-2">
          Kindly Respond By June 10, 2026
        </p>
      </div>

      <div className="relative rounded-3xl overflow-hidden bg-white/80 dark:bg-neutral-900/85 backdrop-blur-md border border-yellow-500/15 shadow-xl p-6 sm:p-8">
        {submitted ? (
          <div className="text-center py-8 animate-fade-in space-y-4">
            <div className="w-16 h-16 bg-emerald-500/10 text-emerald-600 dark:text-emerald-450 rounded-full flex items-center justify-center mx-auto border border-emerald-500/20">
              <CheckCircle className="w-8 h-8 animate-pulse" />
            </div>
            <h4 className="font-serif text-2xl font-bold text-neutral-900 dark:text-neutral-100">
              Thank You!
            </h4>
            <p className="font-sans text-sm text-neutral-600 dark:text-neutral-300 max-w-xs mx-auto leading-relaxed">
              Your response has been registered. We are thrilled to celebrate our covenant with you in Thanjavur!
            </p>
            <div className="pt-2">
              <button
                onClick={() => setSubmitted(false)}
                className="text-xs font-sans uppercase tracking-widest text-yellow-700 dark:text-yellow-500 underline underline-offset-4 hover:text-yellow-600 transition-colors"
              >
                Change or submit another RSVP
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs font-sans text-center">
                {errorMsg}
              </div>
            )}

            {/* Name Input */}
            <div className="space-y-1">
              <label htmlFor="rsvp_name" className="text-xs font-sans uppercase tracking-widest text-neutral-500 block font-medium">
                Full Name *
              </label>
              <div className="relative">
                <input
                  id="rsvp_name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your Name"
                  required
                  className="w-full text-sm pl-11 pr-4 py-3 rounded-xl bg-ivory-50/40 dark:bg-neutral-950/40 border border-yellow-500/15 focus:border-yellow-500/40 outline-none transition-all placeholder:text-neutral-400 dark:placeholder:text-neutral-550"
                />
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400">
                  <Heart className="w-4 h-4 fill-neutral-400/10" />
                </span>
              </div>
            </div>

            {/* Phone Input */}
            <div className="space-y-1">
              <label htmlFor="rsvp_phone" className="text-xs font-sans uppercase tracking-widest text-neutral-500 block font-medium">
                Phone Number *
              </label>
              <div className="relative">
                <input
                  id="rsvp_phone"
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+91 XXXXX XXXXX"
                  required
                  className="w-full text-sm pl-11 pr-4 py-3 rounded-xl bg-ivory-50/40 dark:bg-neutral-950/40 border border-yellow-500/15 focus:border-yellow-500/40 outline-none transition-all placeholder:text-neutral-400 dark:placeholder:text-neutral-550"
                />
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400">
                  <Phone className="w-4 h-4" />
                </span>
              </div>
            </div>

            {/* Guests Count Input */}
            <div className="space-y-1">
              <label htmlFor="rsvp_guests" className="text-xs font-sans uppercase tracking-widest text-neutral-500 block font-medium">
                Number of Guests
              </label>
              <div className="relative">
                <select
                  id="rsvp_guests"
                  name="guestsCount"
                  value={formData.guestsCount}
                  onChange={handleChange}
                  className="w-full text-sm pl-11 pr-4 py-3 rounded-xl bg-ivory-50/40 dark:bg-neutral-950/40 border border-yellow-500/15 focus:border-yellow-500/40 outline-none transition-all appearance-none cursor-pointer"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
                    <option key={n} value={n} className="dark:bg-neutral-900">{n} {n === 1 ? 'Guest' : 'Guests'}</option>
                  ))}
                </select>
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400">
                  <Users className="w-4 h-4" />
                </span>
              </div>
            </div>

            {/* True Interactive Toggles for Engagement and Wedding Attendance */}
            <div className="grid grid-cols-2 gap-4">
              <button
                id="toggle_attending_engagement"
                type="button"
                onClick={() => handleToggle('attendingEngagement')}
                className={`p-4 rounded-2xl border text-center transition-all duration-300 flex flex-col items-center justify-center gap-1.5 focus:outline-none ${
                  formData.attendingEngagement
                    ? 'bg-yellow-500/10 border-yellow-500/40 text-yellow-800 dark:text-yellow-500 shadow-sm'
                    : 'bg-transparent border-neutral-200 dark:border-neutral-800 text-neutral-500 dark:text-neutral-400'
                }`}
              >
                <span className="text-xs uppercase font-sans tracking-wider font-semibold">Engagement</span>
                <span className="text-[10px] font-serif italic">June 16</span>
                <span className="text-xs font-sans leading-none font-medium mt-1">
                  {formData.attendingEngagement ? 'Attending ✓' : 'Will Miss'}
                </span>
              </button>

              <button
                id="toggle_attending_wedding"
                type="button"
                onClick={() => handleToggle('attendingWedding')}
                className={`p-4 rounded-2xl border text-center transition-all duration-300 flex flex-col items-center justify-center gap-1.5 focus:outline-none ${
                  formData.attendingWedding
                    ? 'bg-yellow-500/10 border-yellow-500/40 text-yellow-800 dark:text-yellow-500 shadow-sm'
                    : 'bg-transparent border-neutral-200 dark:border-neutral-800 text-neutral-500 dark:text-neutral-400'
                }`}
              >
                <span className="text-xs uppercase font-sans tracking-wider font-semibold">Wedding</span>
                <span className="text-[10px] font-serif italic">June 17</span>
                <span className="text-xs font-sans leading-none font-medium mt-1">
                  {formData.attendingWedding ? 'Attending ✓' : 'Will Miss'}
                </span>
              </button>
            </div>

            {/* Note / Message */}
            <div className="space-y-1">
              <label htmlFor="rsvp_msg" className="text-xs font-sans uppercase tracking-widest text-neutral-500 block font-medium">
                Wishes / Warm Message
              </label>
              <textarea
                id="rsvp_msg"
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={3}
                placeholder="Send a blessing or special note to Monika & Richard..."
                maxLength={400}
                className="w-full text-sm px-4 py-3 rounded-xl bg-ivory-50/40 dark:bg-neutral-950/40 border border-yellow-500/15 focus:border-yellow-500/40 outline-none transition-all placeholder:text-neutral-400 dark:placeholder:text-neutral-550 resize-none"
              />
            </div>

            {/* Submit Control */}
            <button
              id="btn_submit_rsvp"
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-yellow-600 to-amber-700 hover:from-yellow-500 hover:to-amber-600 text-white font-sans text-xs uppercase tracking-widest font-bold shadow-md hover:shadow-lg focus:outline-none active:scale-95 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  Registering...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 text-white" />
                  Submit RSVP Response
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
