
import React, { useState } from 'react';
import { useQueue } from '../store.tsx';
import { QueueStatus, VehicleType, CallType, Bay } from '../types.ts';
import { Bell, Truck, Play, CheckCircle, LogOut, RefreshCw, FileText, MapPin, Package } from 'lucide-react';

const StaffControl: React.FC = () => {
  const { queue, bays, callVehicle, recallVehicle, updateQueueStatus } = useQueue();
  const [selectedBay, setSelectedBay] = useState<string | null>(null);

  const waitingQueue = queue.filter(q => q.status === QueueStatus.WAITING);
  const activeQueue = queue.filter(q => 
    [QueueStatus.CALLED, QueueStatus.LOADING, QueueStatus.FINISHED].includes(q.status)
  );

  const getBayLabel = (bay: Bay) => {
    if (bay.name.includes('ช่อง')) {
      const bayNumber = bay.name.replace('ช่อง ', '');
      return `${bay.door}-${bayNumber}`;
    }
    return bay.door;
  };

  const handleCall = (id: string, vType: VehicleType) => {
    if (!selectedBay) {
      const typeLabel = vType === VehicleType.FG ? 'ช่องโหลด (เช่น 13-1)' : vType === VehicleType.PK ? 'จุดรับสินค้า (เช่น 17-1)' : 'จุดลงสินค้า';
      alert(`กรุณาเลือก${typeLabel}ก่อนเรียก (สำหรับ ${vType})`);
      return;
    }

    const bay = bays.find(b => b.id === selectedBay);
    if (bay?.type !== vType) {
      alert(`ช่อง/จุดที่เลือกไม่ตรงกับประเภทรถ (${vType})`);
      return;
    }

    callVehicle(id, selectedBay, CallType.LOAD);
    setSelectedBay(null);
  };

  const handleCallBill = (id: string) => {
    callVehicle(id, undefined, CallType.BILL);
  };

  const selectedBayData = bays.find(b => b.id === selectedBay);

  return (
    <div className="p-4 md:p-8 space-y-8 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-4">
          <div className="flex items-center justify-between border-b pb-2">
            <h2 className="text-xl font-bold flex items-center gap-2 text-gray-800">
              <RefreshCw className="text-indigo-600 animate-spin-slow" /> คิวรอดำเนินการ ({waitingQueue.length})
            </h2>
          </div>
          
          <div className="space-y-3">
            <div className="bg-indigo-50 p-4 rounded-2xl border border-indigo-100 shadow-sm">
              <label className="block text-xs font-black text-indigo-900 mb-3 uppercase tracking-wider flex items-center gap-2">
                <Truck className="w-4 h-4" /> เลือกช่องโหลด (สำหรับ FG)
              </label>
              <div className="grid grid-cols-3 gap-2">
                {bays.filter(b => b.type === VehicleType.FG).map(bay => (
                  <button
                    key={bay.id}
                    onClick={() => setSelectedBay(bay.id)}
                    disabled={bay.status !== 'IDLE'}
                    className={`p-2 text-xs font-bold rounded-xl border transition-all ${
                      bay.status !== 'IDLE' 
                        ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                        : selectedBay === bay.id
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-200 ring-2 ring-indigo-300 ring-offset-1'
                          : 'bg-white text-indigo-600 border-indigo-200 hover:border-indigo-400 hover:bg-indigo-100'
                    }`}
                  >
                    {getBayLabel(bay)}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-green-50 p-4 rounded-2xl border border-green-100 shadow-sm">
              <label className="block text-xs font-black text-green-900 mb-3 uppercase tracking-wider flex items-center gap-2">
                <Package className="w-4 h-4" /> เลือกจุดรับสินค้า (สำหรับ PK - แพ็คเกจ)
              </label>
              <div className="flex flex-col gap-3">
                 <div className="grid grid-cols-3 gap-2">
                    {bays.filter(b => b.type === VehicleType.PK && !['PK-A', 'PK-E', 'PK-B'].includes(b.id)).map(bay => (
                      <button
                        key={bay.id}
                        onClick={() => setSelectedBay(bay.id)}
                        disabled={bay.status !== 'IDLE'}
                        className={`p-2 text-xs font-bold rounded-xl border transition-all ${
                          bay.status !== 'IDLE' 
                            ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                            : selectedBay === bay.id
                              ? 'bg-green-600 text-white border-green-600 shadow-md shadow-green-200 ring-2 ring-green-300 ring-offset-1'
                              : 'bg-white text-green-600 border-green-200 hover:border-green-400 hover:bg-green-100'
                        }`}
                      >
                        {getBayLabel(bay)}
                      </button>
                    ))}
                 </div>
                 <div className="grid grid-cols-3 gap-2 pt-2 border-t border-green-200">
                    {bays.filter(b => ['PK-A', 'PK-E', 'PK-B'].includes(b.id)).map(bay => (
                      <button
                        key={bay.id}
                        onClick={() => setSelectedBay(bay.id)}
                        disabled={bay.status !== 'IDLE'}
                        className={`p-2 text-xs font-bold rounded-xl border transition-all ${
                          bay.status !== 'IDLE' 
                            ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                            : selectedBay === bay.id
                              ? 'bg-green-700 text-white border-green-700 shadow-md shadow-green-200 ring-2 ring-green-400 ring-offset-1'
                              : 'bg-green-100 text-green-800 border-green-300 hover:border-green-500 hover:bg-green-200'
                        }`}
                      >
                        {getBayLabel(bay)}
                      </button>
                    ))}
                 </div>
              </div>
            </div>

            <div className="bg-orange-50 p-4 rounded-2xl border border-orange-100 shadow-sm">
              <label className="block text-xs font-black text-orange-900 mb-3 uppercase tracking-wider flex items-center gap-2">
                <MapPin className="w-4 h-4" /> เลือกจุดลงสินค้า (สำหรับ RM)
              </label>
              <div className="grid grid-cols-2 gap-2">
                {bays.filter(b => b.type === VehicleType.RM).map(bay => (
                  <button
                    key={bay.id}
                    onClick={() => setSelectedBay(bay.id)}
                    disabled={bay.status !== 'IDLE'}
                    className={`p-3 text-xs font-bold rounded-xl border transition-all ${
                      bay.status !== 'IDLE' 
                        ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                        : selectedBay === bay.id
                          ? 'bg-orange-600 text-white border-orange-600 shadow-md shadow-orange-200 ring-2 ring-orange-300 ring-offset-1'
                          : 'bg-white text-orange-600 border-orange-200 hover:border-orange-400 hover:bg-orange-100'
                    }`}
                  >
                    {getBayLabel(bay)}
                  </button>
                ))}
              </div>
            </div>

            {selectedBay && (
              <div className="bg-blue-50 text-blue-700 p-2 rounded-lg text-xs font-bold text-center border border-blue-200 animate-pulse">
                เลือกแล้ว: {getBayLabel(selectedBayData!)} ({selectedBayData?.type})
              </div>
            )}
          </div>

          <div className="space-y-2 overflow-y-auto max-h-[500px] pr-2 custom-scrollbar">
            {waitingQueue.length === 0 ? (
              <div className="text-center p-12 bg-white rounded-2xl border border-dashed border-gray-300 text-gray-400 flex flex-col items-center gap-2">
                <RefreshCw className="w-8 h-8 opacity-20" />
                <p className="font-bold">ยังไม่มีคิวรอ</p>
              </div>
            ) : (
              waitingQueue.map(item => (
                <div key={item.id} className="bg-white p-4 rounded-2xl border shadow-sm hover:border-indigo-300 transition-all group">
                  <div className="flex justify-between items-start mb-2">
                    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-tighter ${
                      item.type === VehicleType.FG ? 'bg-blue-100 text-blue-700' : 
                      item.type === VehicleType.PK ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                    }`}>
                      {item.type}
                    </span>
                    <span className="text-[10px] text-gray-400 font-mono">
                      {new Date(item.entryTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <div className="text-xl font-black text-gray-800 mb-1 group-hover:text-indigo-600 transition-colors">{item.plateNumber}</div>
                  <div className="text-sm text-gray-600 font-bold truncate">{item.driverName}</div>
                  <div className="text-xs text-gray-500 italic mb-4 truncate">{item.companyName}</div>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleCall(item.id, item.type)}
                      className="flex-1 bg-indigo-600 text-white py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 hover:bg-indigo-700 active:scale-95 transition-all shadow-md shadow-indigo-100"
                    >
                      <Bell className="w-4 h-4" /> เรียกเข้าช่อง
                    </button>
                    {item.type === VehicleType.FG && (
                      <button
                        onClick={() => handleCallBill(item.id)}
                        className="bg-gray-100 text-gray-700 px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-gray-200 transition-colors"
                        title="เรียกรับบิล"
                      >
                        <FileText className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-xl font-bold flex items-center gap-2 text-gray-800">
            <Truck className="text-indigo-600" /> รถที่กำลังปฏิบัติงาน ({activeQueue.length})
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeQueue.map(item => {
              const bay = bays.find(b => b.id === item.bayId);
              return (
                <div key={item.id} className="bg-white border-2 rounded-2xl shadow-sm overflow-hidden flex flex-col transition-all hover:shadow-md">
                  <div className={`p-4 text-white flex justify-between items-center ${
                    item.status === QueueStatus.CALLED ? 'bg-red-500' :
                    item.status === QueueStatus.LOADING ? 'bg-yellow-500 text-yellow-950' : 'bg-gray-600'
                  }`}>
                    <div>
                      <div className="text-2xl font-black leading-none">{item.plateNumber}</div>
                      <div className="text-[10px] font-bold opacity-80 mt-1 uppercase tracking-widest">{item.type}</div>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] px-2 py-1 bg-black/10 rounded-lg font-black uppercase">
                         {bay ? getBayLabel(bay) : (item.lastCallType === CallType.BILL ? 'เรียกรับบิล' : 'ไม่มีช่อง')}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-5 flex-1 space-y-3">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-400 font-bold uppercase text-[10px]">คนขับ:</span>
                      <span className="font-bold text-gray-800">{item.driverName}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-400 font-bold uppercase text-[10px]">เรียกแล้ว:</span>
                      <span className={`font-black ${item.callCount > 1 ? 'text-red-500' : 'text-indigo-600'}`}>{item.callCount} ครั้ง</span>
                    </div>
                  </div>

                  <div className="p-4 bg-gray-50 grid grid-cols-2 gap-3 border-t">
                    {item.status === QueueStatus.CALLED && (
                      <>
                        <button
                          onClick={() => updateQueueStatus(item.id, QueueStatus.LOADING, item.bayId)}
                          className="flex items-center justify-center gap-2 bg-yellow-400 text-yellow-950 py-3 rounded-xl font-black text-sm hover:bg-yellow-500 shadow-sm transition-all active:scale-95"
                        >
                          <Play className="w-4 h-4 fill-current" /> เริ่มโหลด
                        </button>
                        <button
                          onClick={() => recallVehicle(item.id)}
                          className="flex items-center justify-center gap-2 bg-red-100 text-red-600 py-3 rounded-xl font-black text-sm hover:bg-red-200 transition-all active:scale-95"
                        >
                          <RefreshCw className="w-4 h-4" /> เรียกซ้ำ
                        </button>
                      </>
                    )}
                    
                    {item.status === QueueStatus.LOADING && (
                      <button
                        onClick={() => updateQueueStatus(item.id, QueueStatus.FINISHED, item.bayId)}
                        className="col-span-2 flex items-center justify-center gap-2 bg-green-500 text-white py-3 rounded-xl font-black text-sm hover:bg-green-600 shadow-md shadow-green-100 transition-all active:scale-95"
                      >
                        <CheckCircle className="w-5 h-5" /> โหลดสินค้าเสร็จสิ้น
                      </button>
                    )}

                    {item.status === QueueStatus.FINISHED && (
                      <>
                        <button
                          onClick={() => updateQueueStatus(item.id, QueueStatus.OUT_OF_AREA, item.bayId)}
                          className="flex items-center justify-center gap-2 bg-gray-800 text-white py-3 rounded-xl font-black text-sm hover:bg-gray-900 transition-all active:scale-95"
                        >
                          <LogOut className="w-4 h-4" /> ออกพื้นที่
                        </button>
                        {(item.type === VehicleType.FG || item.type === VehicleType.PK) && (
                          <button
                            onClick={() => updateQueueStatus(item.id, QueueStatus.WAITING, undefined)}
                            className="flex items-center justify-center gap-2 bg-indigo-100 text-indigo-600 py-3 rounded-xl font-black text-sm hover:bg-indigo-200 transition-all active:scale-95"
                          >
                            <RefreshCw className="w-4 h-4" /> รอเรียกซ้ำ
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffControl;
