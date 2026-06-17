export type Priority = 'low' | 'medium' | 'high';
export type TaskStatus = 'pending' | 'in-progress' | 'completed';
export type FollowupStatus = 'scheduled' | 'completed';

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: Priority;
  dueDate?: string;
  category?: string;
  uid: string;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  notified?: boolean;
}

export interface Followup {
  id: string;
  contactName: string;
  notes?: string;
  followupDate: string;
  status: FollowupStatus;
  uid: string;
  createdAt: string;
  updatedAt?: string;
  completedAt?: string;
  notified?: boolean;
}

export interface Category {
  id: string;
  name: string;
  color: string;
  uid: string;
}

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string;
    email?: string | null;
    emailVerified?: boolean;
    isAnonymous?: boolean;
    tenantId?: string | null;
    providerInfo: {
      providerId: string;
      displayName: string | null;
      email: string | null;
      photoUrl: string | null;
    }[];
  }
}
