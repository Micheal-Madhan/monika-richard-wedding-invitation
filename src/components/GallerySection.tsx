import React, { useState } from 'react';
import { Camera, Plus, X, ChevronLeft, ChevronRight, Upload } from 'lucide-react';

interface GalleryItem {
  id: string;
  url: string;
  title: string;
  category: string;
}

export default function GallerySection() {
  const [items, setItems] = useState<GalleryItem[]>([
    {
      id: 'g_1',
      url: '/src/assets/images/luxury_wedding_hero_bg_1780403106433.png',
      title: 'Our Holy Journey',
      category: 'Portrait'
    },
    {
      id: 'g_2',
      url: '/src/assets/images/engagement_rings_pillow_1780403148521.png',
      title: 'The Golden Pledge',
      category: 'Engagement'
    },
    {
      id: 'g_3',
      url: '/src/assets/images/church_lourdes_altar_1780403124429.png',
      title: 'Our Lady of Lourdes Altar',
      category: 'Ceremony'
    },
    {
      id: 'g_4',
      url: 'https://picsum.photos/seed/wed_4/600/800',
      title: 'South Indian Traditions',
      category: 'Covenant'
    },
    {
      id: 'g_5',
      url: 'https://picsum.photos/seed/wed_5/800/600',
      title: 'Bliss and Blessings',
      category: 'Celebration'
    },
    {
      id: 'g_6',
      url: 'https://picsum.photos/seed/wed_6/600/700',
      title: 'A Love that Preserves',
      category: 'Portrait'
    }
  ]);

  const [activeIdx, setActiveIdx] = useState<number | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // File Upload Handling as per UX Guidelines (drag-and-drop & manual selection)
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    processFiles(files);
  };

  const processFiles = (files: FileList) => {
    const newItems: GalleryItem[] = [];
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!file.type.startsWith('image/')) {
        setErrorMsg('Please upload image files only.');
        setTimeout(() => setErrorMsg(null), 4000);
        continue;
      }

      // Limit file size to 8MB
      if (file.size > 8 * 1024 * 1024) {
        setErrorMsg('Images must be smaller than 8MB.');
        setTimeout(() => setErrorMsg(null), 4000);
        continue;
      }

      const fileUrl = URL.createObjectURL(file);
      newItems.push({
        id: `uploaded_${Date.now()}_${i}`,
        url: fileUrl,
        title: file.name.split('.')[0] || 'My Shared Memory',
        category: 'Shared Memory'
      });
    }

    if (newItems.length > 0) {
      setItems(prev => [...newItems, ...prev]);
    }
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (activeIdx === null) return;
    setActiveIdx((activeIdx + 1) % items.length);
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (activeIdx === null) return;
    setActiveIdx((activeIdx - 1 + items.length) % items.length);
  };

  return (
    <div className="py-6 px-4 max-w-6xl mx-auto space-y-12">
      <div className="text-center">
        <h3 className="font-serif text-3xl sm:text-4xl tracking-wide text-neutral-800 dark:text-neutral-100">
          Wedding Memories
        </h3>
        <p className="font-sans text-xs uppercase tracking-widest text-neutral-500 mt-2">
          Love Rendered in Elegant Moments
        </p>
      </div>

      {/* Upload Panel */}
      <div className="max-w-xl mx-auto p-6 rounded-2xl bg-white/70 dark:bg-neutral-900/70 border border-dashed border-yellow-500/20 text-center relative hover:border-yellow-500/40 transition-colors duration-300">
        <Camera className="w-8 h-8 text-yellow-600 dark:text-yellow-500 mx-auto mb-3 animate-pulse" />
        <h4 className="font-serif text-lg font-semibold text-neutral-800 dark:text-neutral-100">
          Upload Your Captured Moments
        </h4>
        <p className="text-xs font-sans text-neutral-500 dark:text-neutral-400 mt-1 max-w-xs mx-auto">
          Add your warm memories of Monika & Richard to the interactive gallery below.
        </p>

        <label
          htmlFor="gallery_photo_uploader"
          className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-sans uppercase tracking-widest text-yellow-800 hover:text-white bg-yellow-500/10 hover:bg-yellow-600 border border-yellow-500/20 hover:border-transparent cursor-pointer shadow-sm hover:shadow active:scale-95 transition-all duration-305"
        >
          <Upload className="w-4 h-4" />
          Choose Photo
        </label>
        <input
          id="gallery_photo_uploader"
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handlePhotoUpload}
        />

        {errorMsg && (
          <p className="text-xs font-sans text-rose-500 mt-3 animate-bounce">{errorMsg}</p>
        )}
      </div>

      {/* Masonry Layout Frame */}
      <div className="columns-2 md:columns-3 gap-6 space-y-6">
        {items.map((item, idx) => (
          <div
            id={`gallery_brick_${item.id}`}
            key={item.id}
            onClick={() => setActiveIdx(idx)}
            className="break-inside-avoid relative rounded-3xl overflow-hidden bg-white dark:bg-neutral-900 border border-yellow-500/10 shadow-sm cursor-zoom-in hover:shadow-xl hover:border-yellow-500/30 transition-all duration-500 group"
          >
            <img
              src={item.url}
              alt={item.title}
              className="w-full object-cover group-hover:scale-105 group-hover:rotate-1 transition-all duration-500 ease-out select-none"
              referrerPolicy="no-referrer"
            />
            {/* Fade-in Text Veil */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
              <span className="text-[9px] uppercase tracking-widest text-yellow-400 font-semibold font-sans">
                {item.category}
              </span>
              <h5 className="text-sm font-serif text-white tracking-wide mt-1">
                {item.title}
              </h5>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal Window */}
      {activeIdx !== null && (
        <div
          id="gallery_lightbox_portal"
          onClick={() => setActiveIdx(null)}
          className="fixed inset-0 bg-black/95 backdrop-blur-md z-[100] flex items-center justify-center p-4 cursor-zoom-out select-none animate-fade-in"
        >
          {/* Close Action */}
          <button
            onClick={() => setActiveIdx(null)}
            className="absolute top-6 right-6 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white cursor-pointer transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Prev Arrow */}
          <button
            onClick={handlePrev}
            className="absolute left-4 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white cursor-pointer transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Active Image Canvas */}
          <div className="max-w-4xl max-h-[80vh] flex flex-col items-center justify-center cursor-default" onClick={e => e.stopPropagation()}>
            <img
              src={items[activeIdx].url}
              alt={items[activeIdx].title}
              className="max-w-full max-h-[75vh] object-contain rounded-lg shadow-2xl animate-scale-up"
              referrerPolicy="no-referrer"
            />
            <p className="text-sm font-serif text-white tracking-widest mt-4 uppercase">
              {items[activeIdx].title}
            </p>
            <span className="text-xs text-yellow-500 font-sans tracking-wide uppercase mt-1">
              {items[activeIdx].category}
            </span>
          </div>

          {/* Next Arrow */}
          <button
            onClick={handleNext}
            className="absolute right-4 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white cursor-pointer transition-colors"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      )}
    </div>
  );
}
