
import React, { useEffect, useRef } from 'react';
import { useQueue } from './store.tsx';
import { AppEvent } from './types.ts';

const NotificationService: React.FC = () => {
  const { isMuted } = useQueue();
  const audioContextRef = useRef<AudioContext | null>(null);

  const playBell = () => {
    if (isMuted) return;
    
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    
    const ctx = audioContextRef.current;
    
    if (ctx.state === 'suspended') {
      ctx.resume();
    }
    
    const createRichDing = (startTime: number) => {
      const frequencies = [880, 1760, 2640, 440];
      const gains = [0.4, 0.2, 0.1, 0.3];

      frequencies.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = i === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq, startTime);
        osc.frequency.exponentialRampToValueAtTime(freq * 0.98, startTime + 1.5);

        gain.gain.setValueAtTime(0, startTime);
        gain.gain.linearRampToValueAtTime(gains[i], startTime + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 1.5);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + 1.6);
      });
    };

    const now = ctx.currentTime;
    createRichDing(now);
    createRichDing(now + 0.7);
    createRichDing(now + 1.4);
  };

  useEffect(() => {
    const channel = new BroadcastChannel('warehouse_queue_sync');
    const handleMessage = (event: MessageEvent<AppEvent>) => {
      const msg = event.data;
      if (msg.type === 'CALL_VEHICLE' || msg.type === 'RECALL_VEHICLE') {
        playBell();
      }
    };
    channel.addEventListener('message', handleMessage);
    return () => channel.removeEventListener('message', handleMessage);
  }, [isMuted]);

  return null;
};

export default NotificationService;
