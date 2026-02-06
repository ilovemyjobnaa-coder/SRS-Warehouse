
export enum VehicleType {
  FG = 'FG',
  PK = 'PK',
  RM = 'RM'
}

export enum QueueStatus {
  WAITING = 'WAITING',
  CALLED = 'CALLED',
  LOADING = 'LOADING',
  FINISHED = 'FINISHED',
  COMPLETED = 'COMPLETED',
  OUT_OF_AREA = 'OUT_OF_AREA'
}

export enum CallType {
  LOAD = 'LOAD',
  BILL = 'BILL'
}

export interface QueueItem {
  id: string;
  type: VehicleType;
  plateNumber: string;
  driverName: string;
  companyName: string;
  dcType?: 'CP' | 'General';
  destinations?: string[];
  entryTime: number;
  startTime?: number;
  endTime?: number;
  exitTime?: number;
  status: QueueStatus;
  bayId?: string;
  callCount: number;
  lastCallType?: CallType;
  isArchived?: boolean; // New: To track if moved to monthly report
}

export interface Bay {
  id: string;
  door: string;
  name: string;
  type: VehicleType;
  currentQueueId?: string;
  status: 'IDLE' | 'BUSY' | 'LOADING';
}

export type AppEvent = 
  | { type: 'CALL_VEHICLE', payload: { id: string, bayId?: string, callType: CallType } }
  | { type: 'RECALL_VEHICLE', payload: { id: string } }
  | { type: 'SYNC_STATE', payload: { queue: QueueItem[], bays: Bay[] } };
