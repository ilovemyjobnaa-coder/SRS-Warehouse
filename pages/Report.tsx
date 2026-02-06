
import React, { useState } from 'react';
import { useQueue } from '../store.tsx';
import { VehicleType } from '../types.ts';
import { Calendar, FileText, Filter, Truck, Package, Box, Layers, Download, CheckCircle2, Archive } from 'lucide-react';

const Report: React.FC = () => {
  const { queue, archiveQueue } = useQueue();
  const [filterType, setFilterType] = useState<'daily' | 'monthly'>('daily');
  const [selectedDept, setSelectedDept] = useState<VehicleType | 'ALL'>('ALL');
  const [archiveSuccess, setArchiveSuccess] = useState(false);

  const formatTime = (ts?: number) => ts ? new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-';
  const formatDate = (ts: number) => new Date(ts).toLocaleDateString('th-TH', { day: 'numeric', month: 'long', year: 'numeric' });

  const filteredQueue = queue.filter(item => {
    const matchesDept = selectedDept === 'ALL' || item.type === selectedDept;
    const matchesType = filterType === 'daily' ? !item.isArchived : item.isArchived;
    return matchesDept && matchesType;
  });

  const exportToCSV = () => {
    if (filteredQueue.length === 0) {
      alert('ไม่มีข้อมูลสำหรับส่งออก');
      return;
    }

    const headers = ['ลำดับ', 'ทะเบียนรถ', 'ฝ่าย', 'คนขับ', 'บริษัท/ซัพพลายเออร์', 'เวลาเข้า', 'เริ่มโหลด', 'โหลดเสร็จ', 'ออกจากพื้นที่'];
    const rows = filteredQueue.map((q, idx) => [
      idx + 1,
      q.plateNumber,
      q.type,
      q.driverName,
      q.companyName,
      formatTime(q.entryTime),
      formatTime(q.startTime),
      formatTime(q.endTime),
      formatTime(q.exitTime),
    ]);

    const csvContent = "\uFEFF" + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Report_${filterType === 'daily' ? 'Daily' : 'Monthly'}_${selectedDept}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    if (filterType === 'daily') {
      const idsToArchive = filteredQueue.map(q => q.id);
      archiveQueue(idsToArchive);
      setArchiveSuccess(true);
      setTimeout(() => setArchiveSuccess(false), 3000);
    }
  };

  const deptFilters = [
    { id: 'ALL', label: 'ทั้งหมด', icon: <Layers className="w-4 h-4" /> },
    { id: VehicleType.FG, label: 'FG (รับสินค้า)', icon: <Truck className="w-4 h-4" /> },
    { id: VehicleType.PK, label: 'PK (แพ็คเกจ)', icon: <Package className="w-4 h-4" /> },
    { id: VehicleType.RM, label: 'RM (ส่งวัตถุดิบ)', icon: <Box className="w-4 h-4" /> },
  ];

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-7xl mx-auto">
      {archiveSuccess && (
        <div className="fixed top-20 right-4 z-[100] bg-blue-600 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-300">
          <Archive className="w-6 h-6" />
          <span className="font-bold">ส่งออกสำเร็จ! ข้อมูลถูกย้ายไปยัง "รายเดือน" แล้ว</span>
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 no-print">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">บันทึกการเข้า-ออก</h1>
          <p className="text-gray-500">ข้อมูลรายงานแยกตามสถานะการส่งออกข้อมูล</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={exportToCSV}
            disabled={filteredQueue.length === 0}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold transition-all shadow-md ${
              filteredQueue.length === 0 
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed shadow-none' 
              : 'bg-green-600 text-white hover:bg-green-700 shadow-green-100'
            }`}
          >
            <Download className="w-5 h-5" /> {filterType === 'daily' ? 'ส่งออกและเก็บลงรายเดือน' : 'ส่งออกรายงาน'}
          </button>
        </div>
      </div>

      <div className="bg-white p-4 rounded-2xl shadow-sm border space-y-4 no-print">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-sm font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
              <Filter className="w-4 h-4" /> เลือกฝ่าย:
            </span>
            <div className="flex flex-wrap gap-2">
              {deptFilters.map((dept) => (
                <button
                  key={dept.id}
                  onClick={() => setSelectedDept(dept.id as any)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all border ${
                    selectedDept === dept.id
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-200'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-indigo-300 hover:bg-indigo-50'
                  }`}
                >
                  {dept.icon}
                  {dept.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4 bg-gray-50 p-1.5 rounded-xl border">
            <button
              onClick={() => setFilterType('daily')}
              className={`px-4 py-1.5 text-sm rounded-lg font-bold transition-all flex items-center gap-2 ${
                filterType === 'daily' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Calendar className="w-4 h-4" /> รายวัน
            </button>
            <button
              onClick={() => setFilterType('monthly')}
              className={`px-4 py-1.5 text-sm rounded-lg font-bold transition-all flex items-center gap-2 ${
                filterType === 'monthly' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Archive className="w-4 h-4" /> รายเดือน (สรุปผล)
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b text-gray-400 font-bold uppercase text-[10px] tracking-widest print:bg-gray-100">
              <tr>
                <th className="px-6 py-4">ลำดับ</th>
                <th className="px-6 py-4">ทะเบียนรถ</th>
                <th className="px-6 py-4">ฝ่าย</th>
                <th className="px-6 py-4">คนขับ / บริษัท</th>
                <th className="px-6 py-4 text-center">เวลาเข้า</th>
                <th className="px-6 py-4 text-center">เริ่มโหลด</th>
                <th className="px-6 py-4 text-center">เสร็จ</th>
                <th className="px-6 py-4 text-center">ออกพื้นที่</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredQueue.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center gap-2 opacity-20">
                      <FileText className="w-12 h-12" />
                      <p className="text-lg font-bold uppercase tracking-widest">
                        {filterType === 'daily' ? 'ยังไม่มีข้อมูลรอส่งออก' : 'ยังไม่มีประวัติในรายเดือน'}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredQueue.map((item, idx) => (
                  <tr key={item.id} className="hover:bg-indigo-50/30 transition-colors group">
                    <td className="px-6 py-4 text-gray-400 font-mono text-sm">{idx + 1}</td>
                    <td className="px-6 py-4">
                      <div className="font-black text-indigo-900 text-lg group-hover:text-indigo-600 transition-colors">
                        {item.plateNumber}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-tighter ${
                        item.type === 'FG' ? 'bg-blue-100 text-blue-700' : 
                        item.type === 'PK' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                      }`}>
                        {item.type}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-gray-800">{item.driverName}</div>
                      <div className="text-xs text-gray-500 italic">{item.companyName}</div>
                    </td>
                    <td className="px-6 py-4 text-center font-mono text-sm text-gray-600">{formatTime(item.entryTime)}</td>
                    <td className="px-6 py-4 text-center font-mono text-sm text-gray-600">{formatTime(item.startTime)}</td>
                    <td className="px-6 py-4 text-center font-mono text-sm text-gray-600">{formatTime(item.endTime)}</td>
                    <td className="px-6 py-4 text-center font-mono text-sm text-gray-600">{formatTime(item.exitTime)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Report;
