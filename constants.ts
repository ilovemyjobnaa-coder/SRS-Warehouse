
import { VehicleType, Bay } from './types';

export const CP_DCS = [
  'ชลบุรี', 'หาดใหญ่', 'นครสวรรค์', 'บุรีรัมย์', 'ขอนแก่น', 
  'บางบัวทอง', 'สุวรรณภูมิ', 'ลำพูน', 'สุราษฎร์ธานี', 'มหาชัย'
];

export const GENERAL_CUSTOMERS = [
  'ล ธนวงศ์', 'โนเบิ้ล', 'บ้านออนไลน์', 'ย้งรุ่งเรือง', 'สุวัฒน์ เดโชกุล', 'C&P', 
  'เอมธรรม รองเมือง', 'บีกิน ฟู้ดแอนด์เฮลท์', 'เดโมพาวเวอร์', 'UM Food', 
  'โฮคิทเช่น', 'ไวเซอร์ พัฒนาการ', 'พรรษา พาเพลิน (BPALL)', 'เอมธรรม ดอนเมือง', 
  'ซีเล็คดอนเมือง', 'กิมเฮง บางกะปิ', 'มาคัส', 'เว็ปเอสพีที', 'มุ่งพัฒนา (MPI)', 
  'อาหารสุขภาพดี', '100 Yen', 'วิลล่า', 'B-Best ลาดกระบัง', 'NFB', 'อูมาอิ', 
  'Well-grow', 'All Complex', 'เซ็นทรัลฟู้ดรีเทล (Tops)', 'Lotus บางบัวทอง', 
  'FB Food', 'สมกวี', 'นีโอสุกี้', 'เอมธรรม กิ่งแก้ว', 'EVA', 'LaZada', 
  'LinFox', 'อิออน', 'DIY', 'ฟู้ดโค้ตติ้ง (FCI)', 'ตันตราภัณฑ์', 
  'Big C ครอสด็อก-ธัญบุรี', 'กริฟฟิท', 'The Mall', 'Family Mart', 
  'BLUE & WHITE', 'แมสมาร์เก็ตติ้ง', 'KJR บ้านโป่ง', 'CJ Express โพธาราม', 
  'ปิโตรเลียมไทย วังน้อย', 'ปตท. วังน้อย', 'R&B', 'Lotus วังน้อย', 
  'CJ Express บางปะกง', 'CJ Express ขอนแก่น', 'สปริง', 'ริชชี่ไรท์'
];

export const INITIAL_BAYS: Bay[] = [
  // FG Doors 13, 14, 16 (2 bays each)
  { id: 'FG-13-1', door: '13', name: 'ช่อง 1', type: VehicleType.FG, status: 'IDLE' },
  { id: 'FG-13-2', door: '13', name: 'ช่อง 2', type: VehicleType.FG, status: 'IDLE' },
  { id: 'FG-14-1', door: '14', name: 'ช่อง 1', type: VehicleType.FG, status: 'IDLE' },
  { id: 'FG-14-2', door: '14', name: 'ช่อง 2', type: VehicleType.FG, status: 'IDLE' },
  { id: 'FG-16-1', door: '16', name: 'ช่อง 1', type: VehicleType.FG, status: 'IDLE' },
  { id: 'FG-16-2', door: '16', name: 'ช่อง 2', type: VehicleType.FG, status: 'IDLE' },
  // PK Doors 17, 19, 21 (2 bays each)
  { id: 'PK-17-1', door: '17', name: 'ช่อง 1', type: VehicleType.PK, status: 'IDLE' },
  { id: 'PK-17-2', door: '17', name: 'ช่อง 2', type: VehicleType.PK, status: 'IDLE' },
  { id: 'PK-19-1', door: '19', name: 'ช่อง 1', type: VehicleType.PK, status: 'IDLE' },
  { id: 'PK-19-2', door: '19', name: 'ช่อง 2', type: VehicleType.PK, status: 'IDLE' },
  { id: 'PK-21-1', door: '21', name: 'ช่อง 1', type: VehicleType.PK, status: 'IDLE' },
  { id: 'PK-21-2', door: '21', name: 'ช่อง 2', type: VehicleType.PK, status: 'IDLE' },
  // PK Factory Points (New)
  { id: 'PK-A', door: 'โรงA', name: 'จุดรับสินค้า', type: VehicleType.PK, status: 'IDLE' },
  { id: 'PK-E', door: 'โรงE', name: 'จุดรับสินค้า', type: VehicleType.PK, status: 'IDLE' },
  { id: 'PK-B', door: 'โรงB', name: 'จุดรับสินค้า', type: VehicleType.PK, status: 'IDLE' },
  // RM Points
  { id: 'RM-P1', door: 'จุดรับของ', name: '', type: VehicleType.RM, status: 'IDLE' },
  { id: 'RM-P2', door: 'จุดลงข้าว', name: '', type: VehicleType.RM, status: 'IDLE' },
];
