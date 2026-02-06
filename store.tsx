
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { QueueItem, Bay, VehicleType, QueueStatus, CallType, AppEvent } from './types.ts';
import { INITIAL_BAYS } from './constants.ts';

interface QueueContextType {
  queue: QueueItem[];
  bays: Bay[];
  addQueue: (item: Partial<QueueItem>) => void;
  updateQueueStatus: (id: string, status: QueueStatus, bayId?: string) => void;
  callVehicle: (id: string, bayId: string | undefined, callType: CallType) => void;
  recallVehicle: (id: string) => void;
  archiveQueue: (ids: string[]) => void;
  clearAllData: () => void;
  isMuted: boolean;
  toggleMute: () => void;
}

const QueueContext = createContext<QueueContextType | undefined>(undefined);

const channel = new BroadcastChannel('warehouse_queue_sync');

export const QueueProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [queue, setQueue] = useState<QueueItem[]>(() => {
    try {
      const saved = localStorage.getItem('warehouse_queue');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });
  
  const [bays, setBays] = useState<Bay[]>(() => {
    try {
      const saved = localStorage.getItem('warehouse_bays');
      return saved ? JSON.parse(saved) : INITIAL_BAYS;
    } catch (e) {
      return INITIAL_BAYS;
    }
  });

  const [isMuted, setIsMuted] = useState(() => {
    try {
      const saved = localStorage.getItem('app_muted');
      return saved ? JSON.parse(saved) : false;
    } catch (e) {
      return false;
    }
  });

  useEffect(() => {
    const today = new Date();
    if (today.getDate() === 1) {
      const filteredQueue = queue.filter(item => !item.isArchived);
      if (filteredQueue.length !== queue.length) {
        setQueue(filteredQueue);
        localStorage.setItem('warehouse_queue', JSON.stringify(filteredQueue));
        channel.postMessage({ type: 'SYNC_STATE', payload: { queue: filteredQueue, bays } });
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('warehouse_queue', JSON.stringify(queue));
    localStorage.setItem('warehouse_bays', JSON.stringify(bays));
  }, [queue, bays]);

  useEffect(() => {
    localStorage.setItem('app_muted', JSON.stringify(isMuted));
  }, [isMuted]);

  const syncState = useCallback((q: QueueItem[], b: Bay[]) => {
    setQueue(q);
    setBays(b);
  }, []);

  useEffect(() => {
    const handleMessage = (event: MessageEvent<AppEvent>) => {
      const msg = event.data;
      if (msg.type === 'SYNC_STATE') {
        syncState(msg.payload.queue, msg.payload.bays);
      }
    };
    channel.addEventListener('message', handleMessage);
    return () => channel.removeEventListener('message', handleMessage);
  }, [syncState]);

  const broadcast = (data: AppEvent) => {
    channel.postMessage(data);
  };

  const addQueue = (item: Partial<QueueItem>) => {
    const newItem: QueueItem = {
      id: Math.random().toString(36).substr(2, 9),
      entryTime: Date.now(),
      status: QueueStatus.WAITING,
      callCount: 0,
      plateNumber: '',
      driverName: '',
      companyName: '',
      type: VehicleType.FG,
      isArchived: false,
      ...item,
    };
    const newQueue = [...queue, newItem];
    setQueue(newQueue);
    broadcast({ type: 'SYNC_STATE', payload: { queue: newQueue, bays } });
  };

  const updateQueueStatus = (id: string, status: QueueStatus, bayId?: string) => {
    const newQueue = queue.map(q => {
      if (q.id === id) {
        let update: Partial<QueueItem> = { status };
        if (status === QueueStatus.LOADING) update.startTime = Date.now();
        if (status === QueueStatus.FINISHED) update.endTime = Date.now();
        if (status === QueueStatus.OUT_OF_AREA) update.exitTime = Date.now();
        if (bayId) update.bayId = bayId;
        return { ...q, ...update };
      }
      return q;
    });

    const newBays = bays.map(b => {
      if (bayId && b.id === bayId) {
        if (status === QueueStatus.CALLED) return { ...b, currentQueueId: id, status: 'BUSY' as const };
        if (status === QueueStatus.LOADING) return { ...b, currentQueueId: id, status: 'LOADING' as const };
        if (status === QueueStatus.FINISHED) return { ...b, currentQueueId: undefined, status: 'IDLE' as const };
      }
      if (b.currentQueueId === id && status === QueueStatus.OUT_OF_AREA) {
         return { ...b, currentQueueId: undefined, status: 'IDLE' as const };
      }
      return b;
    });

    setQueue(newQueue);
    setBays(newBays);
    broadcast({ type: 'SYNC_STATE', payload: { queue: newQueue, bays: newBays } });
  };

  const callVehicle = (id: string, bayId: string | undefined, callType: CallType) => {
    const newQueue = queue.map(q => {
      if (q.id === id) {
        return { 
          ...q, 
          status: QueueStatus.CALLED, 
          bayId, 
          callCount: q.callCount + 1, 
          lastCallType: callType 
        };
      }
      return q;
    });

    const newBays = bays.map(b => {
      if (bayId && b.id === bayId) {
        return { ...b, currentQueueId: id, status: 'BUSY' as const };
      }
      return b;
    });

    setQueue(newQueue);
    setBays(newBays);
    broadcast({ type: 'CALL_VEHICLE', payload: { id, bayId, callType } });
    broadcast({ type: 'SYNC_STATE', payload: { queue: newQueue, bays: newBays } });
  };

  const recallVehicle = (id: string) => {
    broadcast({ type: 'RECALL_VEHICLE', payload: { id } });
  };

  const archiveQueue = (ids: string[]) => {
    const newQueue = queue.map(q => {
      if (ids.includes(q.id)) {
        return { ...q, isArchived: true };
      }
      return q;
    });
    setQueue(newQueue);
    broadcast({ type: 'SYNC_STATE', payload: { queue: newQueue, bays } });
  };

  const clearAllData = useCallback(() => {
    const emptyQueue: QueueItem[] = [];
    const resetBays = [...INITIAL_BAYS];
    setQueue(emptyQueue);
    setBays(resetBays);
    broadcast({ type: 'SYNC_STATE', payload: { queue: emptyQueue, bays: resetBays } });
  }, []);

  const toggleMute = () => setIsMuted((prev: boolean) => !prev);

  return (
    <QueueContext.Provider value={{ 
      queue, bays, addQueue, updateQueueStatus, callVehicle, recallVehicle, 
      archiveQueue, clearAllData, isMuted, toggleMute 
    }}>
      {children}
    </QueueContext.Provider>
  );
};

export const useQueue = () => {
  const context = useContext(QueueContext);
  if (!context) throw new Error('useQueue must be used within a QueueProvider');
  return context;
};
