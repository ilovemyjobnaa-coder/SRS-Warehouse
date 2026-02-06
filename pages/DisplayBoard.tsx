
import React, { useState, useEffect } from 'react';
import { useQueue } from '../store.tsx';
import { QueueStatus, VehicleType, Bay, CallType } from '../types.ts';

const DisplayBoard: React.FC = () => {
  const { bays, queue } = useQueue();
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const waitingQueue = queue.filter(q => q.status === QueueStatus.WAITING).slice(0, 8);
  const billQueue = queue.filter(q => q.status === QueueStatus.CALLED && q.lastCallType === CallType.BILL).slice(0, 3);
  
  const getBayStatusStyles = (bay: Bay) => {
    if (bay.status === 'LOADING') return 'bg-yellow-500 text-black border-yellow-600 animate-pulse';
    if (bay.status === 'BUSY') return 'bg-red-600 text-white border-red-700';
    return 'bg-gray-800 text-gray-700 border-gray-700';
  };

  const renderDoorGroup = (doorNumber: string, typeBays: Bay[]) => {
    const isFactory = doorNumber.startsWith('โรง');
    
    return (
      <div key={doorNumber} className="bg-gray-900 rounded-lg overflow-hidden border border-gray-800 flex flex-col h-full shadow-lg">
        <div className="bg-indigo-950 py-0.5 text-center border-b border-indigo-900 shrink-0">
          <span className="text-[12px] font-black text-indigo-300 uppercase tracking-tighter">
            {isFactory ? doorNumber : `ประตู ${doorNumber}`}
          </span>
        </div>
        <div className={`grid ${typeBays.length > 1 ? 'grid-cols-2' : 'grid-cols-1'} flex-1 divide-x divide-gray-800 min-h-0`}>
          {typeBays.map(bay => {
            const activeQueue = queue.find(q => q.id === bay.currentQueueId);
            const styles = getBayStatusStyles(bay);
            return (
              <div key={bay.id} className={`flex flex-col items-center justify-center p-0.5 text-center transition-all ${styles} min-h-0`}>
                <div className="text-[10px] font-bold uppercase opacity-30 leading-none mb-1">
                  {isFactory ? 'จุดรับสินค้า' : (bay.name || 'ช่องทาง')}
                </div>
                {activeQueue ? (
                  <div className="flex flex-col items-center justify-center h-full">
                    <div className={`${typeBays.length === 1 ? 'text-5xl lg:text-7xl' : 'text-4xl lg:text-6xl'} font-black tracking-tighter leading-none mb-1`}>
                      {activeQueue.plateNumber}
                    </div>
                    <div className="text-[11px] font-black opacity-90 uppercase leading-none bg-black/10 px-2 py-0.5 rounded">
                      {activeQueue.status === QueueStatus.CALLED ? 'โปรดเข้าช่อง' : 'กำลังโหลด'}
                    </div>
                  </div>
                ) : (
                  <div className="text-[10px] font-bold opacity-10 uppercase tracking-widest leading-none">ไม่พร้อมใช้งาน</div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderSection = (title: string, vType: VehicleType) => {
    const sectionBays = bays.filter(b => b.type === vType);
    const doorGroups: string[] = Array.from(new Set(sectionBays.map(b => b.door)));
    
    return (
      <div className="h-full flex flex-col min-h-0">
        <div className="flex items-center gap-2 mb-1 px-2 shrink-0">
          <div className="w-1.5 h-4 bg-indigo-600 rounded-full"></div>
          <h2 className="text-[12px] font-black text-indigo-400 uppercase tracking-widest leading-none">{title}</h2>
        </div>
        <div className="grid grid-cols-3 gap-2 flex-1 min-h-0">
          {doorGroups.map(door => renderDoorGroup(door, sectionBays.filter(b => b.door === door)))}
        </div>
      </div>
    );
  };

  return (
    <div className="h-screen w-screen bg-black text-white p-3 flex flex-col gap-3 overflow-hidden select-none font-sans">
      <div className="flex justify-between items-center bg-gray-900/60 py-2 px-6 rounded-2xl border border-gray-800 shrink-0 h-[8vh]">
        <div className="flex items-center gap-4">
          <div className="bg-indigo-600 px-3 py-1 rounded-lg shadow-xl shadow-indigo-600/20">
            <span className="text-2xl font-black italic">WH</span>
          </div>
          <div className="leading-tight">
            <h1 className="text-2xl font-black tracking-tighter text-white uppercase leading-none">Queue Monitoring System</h1>
            <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-[0.2em] opacity-80">ฝ่ายบริหารจัดการคลังสินค้าและโลจิสติกส์</p>
          </div>
        </div>
        <div className="text-right flex items-center gap-8">
          <div className="text-4xl font-black font-mono text-indigo-500 tracking-tighter leading-none">
            {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </div>
          <div className="text-[11px] text-gray-500 font-bold uppercase tracking-widest border-l border-gray-800 pl-8 flex flex-col items-end leading-none gap-1">
            <span>{time.toLocaleDateString('th-TH', { day: 'numeric', month: 'long' })}</span>
            <span className="opacity-60">{time.toLocaleDateString('th-TH', { year: 'numeric' })}</span>
          </div>
        </div>
      </div>

      <div className="flex-1 flex gap-3 min-h-0 overflow-hidden">
        <div className="flex-[4.2] flex flex-col gap-3 min-h-0 h-full">
          <div className="h-[38%] min-h-0">
            {renderSection('FG - Finished Goods (รับสินค้า)', VehicleType.FG)}
          </div>
          <div className="h-[38%] min-h-0">
            {renderSection('PK - Package (แพ็คเกจ)', VehicleType.PK)}
          </div>
          <div className="h-[20%] min-h-0 flex flex-col">
             <div className="flex items-center gap-2 mb-1 px-2 shrink-0">
              <div className="w-1.5 h-4 bg-orange-600 rounded-full"></div>
              <h2 className="text-[12px] font-black text-orange-400 uppercase tracking-widest leading-none">RM - Raw Materials (ส่งวัตถุดิบ)</h2>
            </div>
            <div className="grid grid-cols-2 gap-2 flex-1 min-h-0">
              {bays.filter(b => b.type === VehicleType.RM).map(bay => (
                 <div key={bay.id} className="bg-gray-900 rounded-lg overflow-hidden border border-gray-800 flex flex-col shadow-lg min-h-0">
                    <div className="bg-orange-950/20 py-0.5 text-center border-b border-orange-900 shrink-0">
                      <span className="text-[10px] font-black text-orange-200 uppercase">{bay.door}</span>
                    </div>
                    <div className={`flex-1 flex flex-col items-center justify-center p-1 transition-all ${getBayStatusStyles(bay)} min-h-0`}>
                       {queue.find(q => q.id === bay.currentQueueId) ? (
                        <div className="flex flex-col items-center">
                          <div className="text-4xl lg:text-5xl font-black tracking-tighter leading-none">{queue.find(q => q.id === bay.currentQueueId)?.plateNumber}</div>
                          <div className="text-[10px] font-bold opacity-60 uppercase mt-1">กำลังลงสินค้า</div>
                        </div>
                      ) : (
                        <div className="text-[12px] font-bold opacity-10 uppercase tracking-widest leading-none">ไม่พร้อมใช้งาน</div>
                      )}
                    </div>
                 </div>
              ))}
            </div>
          </div>
        </div>

        <div className="w-64 lg:w-72 flex flex-col gap-3 shrink-0 h-full overflow-hidden">
          <div className="flex-none bg-gray-900/80 rounded-2xl border border-gray-800 flex flex-col shadow-2xl overflow-hidden h-[30%]">
            <div className="bg-red-700 py-2 px-4 shrink-0 flex justify-between items-center border-b border-red-600">
              <h3 className="text-[13px] font-black uppercase tracking-widest text-white leading-none">เรียกรับบิล (FG)</h3>
              <span className="bg-white/20 text-white text-[11px] font-bold px-2 py-0.5 rounded-md animate-pulse">{billQueue.length}</span>
            </div>
            <div className="flex-1 p-2 flex flex-col gap-1.5 overflow-hidden">
              {billQueue.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center opacity-10">
                  <div className="text-[11px] font-bold uppercase tracking-widest italic text-center">ยังไม่มีการเรียก<br/>รับบิล</div>
                </div>
              ) : (
                billQueue.map((item) => (
                  <div key={item.id} className="bg-red-900/30 border border-red-500/40 p-3 rounded-xl flex justify-between items-center animate-pulse shrink-0">
                    <div className="text-2xl font-black text-red-200 leading-none">{item.plateNumber}</div>
                    <div className="text-[8px] text-red-500 font-black uppercase text-right leading-tight">โปรดติดต่อ<br/>เจ้าหน้าที่</div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="flex-1 bg-gray-900/80 rounded-2xl border border-gray-800 flex flex-col shadow-2xl overflow-hidden min-h-0">
            <div className="bg-indigo-900 py-2 px-4 shrink-0 flex justify-between items-center border-b border-indigo-800">
              <h3 className="text-[13px] font-black uppercase tracking-widest text-white leading-none">คิวที่กำลังรอ</h3>
              <span className="bg-white/10 text-white text-[11px] font-bold px-2 py-0.5 rounded-md">{queue.filter(q => q.status === QueueStatus.WAITING).length}</span>
            </div>
            <div className="flex-1 p-2 flex flex-col gap-2 overflow-hidden">
              {waitingQueue.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center opacity-10">
                  <span className="text-[11px] font-bold uppercase tracking-[0.2em]">ยังไม่มีคิวรอ</span>
                </div>
              ) : (
                waitingQueue.map((item, idx) => (
                  <div key={item.id} className="bg-gray-800/60 border border-white/5 p-2 px-3 rounded-xl flex justify-between items-center animate-fadeIn shrink-0">
                    <div className="flex flex-col min-w-0">
                      <div className="text-2xl font-black text-indigo-300 leading-none truncate">{item.plateNumber}</div>
                      <div className="text-[9px] text-gray-500 font-bold uppercase truncate mt-1">
                          {item.type} • {item.companyName.substring(0, 15)}
                      </div>
                    </div>
                    <div className="text-xl font-black text-gray-800 ml-2">#{(idx + 1).toString().padStart(2, '0')}</div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DisplayBoard;
