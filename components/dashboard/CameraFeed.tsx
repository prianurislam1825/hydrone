'use client'

import { useEffect, useState } from 'react'
import { Camera, Wifi, WifiOff } from 'lucide-react'

type FeedState = 'connecting' | 'buffering' | 'signal_lost'

const FEED_MESSAGES: Record<FeedState, string> = {
  connecting:   'Connecting to Hydrone…',
  buffering:    'Buffering feed…',
  signal_lost:  'Signal lost — retrying…',
}

export default function CameraFeed() {
  const [state, setState] = useState<FeedState>('connecting')
  const [dots, setDots]   = useState('')

  // Cycle through states to simulate a realistic connecting sequence
  useEffect(() => {
    const sequence: FeedState[] = ['connecting', 'buffering', 'signal_lost', 'connecting']
    let idx = 0
    const stateTimer = setInterval(() => {
      idx = (idx + 1) % sequence.length
      setState(sequence[idx])
    }, 4500)
    return () => clearInterval(stateTimer)
  }, [])

  // Animated dots
  useEffect(() => {
    const t = setInterval(() => {
      setDots(d => (d.length >= 3 ? '' : d + '.'))
    }, 500)
    return () => clearInterval(t)
  }, [])

  const isLost = state === 'signal_lost'

  return (
    <div
      role="region"
      aria-label="Camera feed"
      className="flex flex-col gap-0 rounded-xl bg-[#111827] border border-[#1E2D50] overflow-hidden"
    >
      {/* Title bar */}
      <div className="flex items-center justify-between px-4 sm:px-5 py-3.5 border-b border-[#1E2D50]">
        <div className="flex items-center gap-2">
          <Camera size={14} className="text-[#1A56DB]" />
          <span className="text-xs font-semibold tracking-widest uppercase text-[#8B9EC7]">Camera Feed</span>
        </div>
        <div className="flex items-center gap-1.5">
          {isLost
            ? <WifiOff size={12} className="text-[#EF4444]" />
            : <Wifi     size={12} className="text-[#22C55E]" />
          }
          <span className={`text-[10px] font-[family-name:var(--font-jetbrains-mono)] ${isLost ? 'text-[#EF4444]' : 'text-[#22C55E]'}`}>
            ESP32-CAM
          </span>
        </div>
      </div>

      {/* Feed area */}
      <div
        className="relative flex flex-col items-center justify-center"
        style={{
          background:  '#050A14',
          aspectRatio: '16 / 9',
          minHeight:   120,
        }}
        aria-hidden="true"
      >
        {/* Film grain noise overlay */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
            backgroundSize: '200px',
          }}
        />

        {/* Scan line effect */}
        <div
          className="absolute inset-0 pointer-events-none opacity-10"
          style={{
            backgroundImage:  'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(26,86,219,0.15) 2px, rgba(26,86,219,0.15) 4px)',
            backgroundSize:   '100% 4px',
          }}
        />

        {/* Subtle corner brackets */}
        {[['top-3 left-3', 'border-t-2 border-l-2 rounded-tl-lg'],
          ['top-3 right-3', 'border-t-2 border-r-2 rounded-tr-lg'],
          ['bottom-3 left-3', 'border-b-2 border-l-2 rounded-bl-lg'],
          ['bottom-3 right-3', 'border-b-2 border-r-2 rounded-br-lg']
        ].map(([pos, style], i) => (
          <div
            key={i}
            className={`absolute ${pos} w-4 h-4 border-[#1A56DB]/40 ${style}`}
          />
        ))}

        {/* Center content */}
        <div className="flex flex-col items-center gap-3 text-center px-4">
          {isLost
            ? <WifiOff size={28} className="text-[#EF4444] opacity-60" />
            : <Camera  size={28} className="text-[#1A56DB] opacity-60" />
          }

          <div>
            <div className="text-xs font-semibold text-[#8B9EC7] tracking-wider">
              ESP32-CAM · Live Feed
            </div>
            <div
              className="text-xs mt-1 font-[family-name:var(--font-jetbrains-mono)] transition-opacity duration-500"
              style={{ color: isLost ? '#EF4444' : '#8B9EC7', opacity: 0.8 }}
            >
              {FEED_MESSAGES[state]}{dots}
            </div>
          </div>

          {/* Connecting spinner */}
          {!isLost && (
            <div className="flex gap-1.5" aria-hidden="true">
              {[0, 1, 2].map(i => (
                <div
                  key={i}
                  className="w-1.5 h-1.5 rounded-full bg-[#1A56DB]"
                  style={{
                    animation: `live-pulse 1.2s ease-in-out ${i * 0.2}s infinite`,
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Bottom info bar */}
        <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between px-3 py-1.5 bg-gradient-to-t from-black/60 to-transparent">
          <span className="text-[9px] font-[family-name:var(--font-jetbrains-mono)] text-[#8B9EC7] opacity-70">
            HYDRONE · CAM-01
          </span>
          <span className="text-[9px] font-[family-name:var(--font-jetbrains-mono)] text-[#8B9EC7] opacity-70">
            RES: 1600×1200
          </span>
        </div>
      </div>
    </div>
  )
}
