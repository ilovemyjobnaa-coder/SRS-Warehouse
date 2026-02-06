
import React, { useState } from 'react';
import { useQueue } from '../store.tsx';
import { VehicleType, QueueStatus } from '../types.ts';
import { CP_DCS, GENERAL_CUSTOMERS } from '../constants.ts';
import { Truck, Package, Box, Search, Plus, CheckCircle2 } from 'lucide-react';

const Registration: React.FC = () => {
  const { addQueue } = useQueue();
  const [activeType, setActiveType] = useState<VehicleType>(VehicleType.FG);
  const [formData, setFormData] = useState({
    plateNumber: '',
    driverName: '',
    companyName: '',
    dcType: 'CP' as 'CP' | 'General',
    destinations: [] as string[],
    otherDC: '',
  });
  const [searchDC, setSearchDC] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalDestinations = [...formData.destinations];
    if (formData.otherDC) finalDestinations.push(formData.otherDC);
    
    addQueue({
      ...formData,
      type: activeType,
      destinations: finalDestinations,
    });
    
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({
        plateNumber: '',
        driverName: '',
        companyName: '',
        dcType: 'CP',
        destinations: [],
        otherDC: '',
      });
      setSearchDC('');
    }, 2000);
  };

  const toggleDestination = (dest: string) => {
    setFormData(prev => ({
      ...prev,
      destinations: prev.destinations.includes(dest)
        ? prev.destinations.filter(d => d !== dest)
        : [...prev.destinations, dest]
    }));
  };

  const renderDCSelector = () => {
    const list = formData.dcType === 'CP' ? CP_DCS : GENERAL_CUSTOMERS;
    const filtered = list.filter(item => item.toLowerCase().includes(searchDC.toLowerCase()));

    return (
      <div className="space-y-4">
        <label className="block text-sm font-medium text-gray-700">
          เลือก {formData.dcType === 'CP' ? 'DC ปลายทาง' : 'ลูกค้า'} (เลือกได้มากกว่า 1)
        </label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
            placeholder="ค้นหารายการ..."
            value={searchDC}
            onChange={(e) => setSearchDC(e.target.value)}
          />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-48 overflow-y-auto p-2 bg-gray-50 rounded-lg border">
          {filtered.map(item => (
            <button
              key={item}
              type="button"
              onClick={() => toggleDestination(item)}
              className={`p-2 text-xs rounded-md text-left transition-colors border ${
                formData.destinations.includes(item)
                  ? 'bg-indigo-600 text-white border-indigo-600'
                  : 'bg-white text-gray-700 border-gray-200 hover:border-indigo-300'
              }`}
            >
              {item}
            </button>
          ))}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">หรือ พิมพ์ระบุเอง</label>
          <div className="flex gap-2">
            <input
              type="text"
              className="flex-1 px-4 py-2 border rounded-lg"
              placeholder="ระบุเพิ่มเติม..."
              value={formData.otherDC}
              onChange={(e) => setFormData(prev => ({ ...prev, otherDC: e.target.value }))}
            />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-2xl mx-auto p-4 md:p-8">
      {submitted ? (
        <div className="bg-white p-12 rounded-2xl shadow-xl text-center space-y-4 animate-bounce">
          <CheckCircle2 className="w-20 h-20 text-green-500 mx-auto" />
          <h2 className="text-3xl font-bold text-gray-800">จองคิวสำเร็จ!</h2>
          <p className="text-gray-500">กรุณารอการเรียกคิวจากพนักงานคลัง</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border">
          <div className="flex border-b">
            {(Object.keys(VehicleType) as Array<keyof typeof VehicleType>).map((key) => (
              <button
                key={key}
                onClick={() => setActiveType(VehicleType[key])}
                className={`flex-1 py-6 flex flex-col items-center gap-2 font-bold transition-all ${
                  activeType === VehicleType[key] 
                    ? 'bg-indigo-600 text-white' 
                    : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
                }`}
              >
                {key === 'FG' ? <Truck /> : key === 'PK' ? <Package /> : <Box />}
                <span>{key === 'FG' ? 'FG (รับสินค้า)' : key === 'PK' ? 'PK (แพ็คเกจ)' : 'RM (ส่งวัตถุดิบ)'}</span>
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ทะเบียนรถ *</label>
                <input
                  required
                  type="text"
                  className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 uppercase text-lg"
                  value={formData.plateNumber}
                  onChange={(e) => setFormData(prev => ({ ...prev, plateNumber: e.target.value }))}
                  placeholder="เช่น 1กข-1234"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ชื่อ-นามสกุล คนขับ *</label>
                <input
                  required
                  type="text"
                  className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500"
                  value={formData.driverName}
                  onChange={(e) => setFormData(prev => ({ ...prev, driverName: e.target.value }))}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {activeType === VehicleType.FG ? 'ชื่อบริษัท' : 'ชื่อซัพพลายเออร์'} *
              </label>
              <input
                required
                type="text"
                className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500"
                value={formData.companyName}
                onChange={(e) => setFormData(prev => ({ ...prev, companyName: e.target.value }))}
              />
            </div>

            {activeType === VehicleType.FG && (
              <>
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-gray-700">ประเภท DC ปลายทาง</label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer bg-gray-50 px-4 py-2 rounded-lg border hover:bg-gray-100">
                      <input
                        type="radio"
                        name="dcType"
                        className="w-4 h-4 text-indigo-600"
                        checked={formData.dcType === 'CP'}
                        onChange={() => setFormData(prev => ({ ...prev, dcType: 'CP' }))}
                      />
                      <span>CP</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer bg-gray-50 px-4 py-2 rounded-lg border hover:bg-gray-100">
                      <input
                        type="radio"
                        name="dcType"
                        className="w-4 h-4 text-indigo-600"
                        checked={formData.dcType === 'General'}
                        onChange={() => setFormData(prev => ({ ...prev, dcType: 'General' }))}
                      />
                      <span>ลูกค้าทั่วไป</span>
                    </label>
                  </div>
                </div>
                {renderDCSelector()}
              </>
            )}

            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold text-xl hover:bg-indigo-700 shadow-lg active:transform active:scale-95 transition-all"
            >
              จองคิวรับสินค้า
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Registration;
