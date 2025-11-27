'use client';

import { useEffect } from 'react';
import dynamic from 'next/dynamic';

const Player = dynamic(
  () => import('@lottiefiles/react-lottie-player').then(mod => mod.Player),
  { ssr: false }
);

export default function Loader({ onFinish }: { onFinish: () => void }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onFinish();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div className="fixed inset-0 bg-white flex items-center justify-center z-50">
      <Player
        autoplay
        loop
        src="/Restaurant-loader.json"
        style={{ width: '300px', height: '300px' }}
      />
    </div>
  );
}
