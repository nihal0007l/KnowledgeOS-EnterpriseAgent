export interface User {
  name: string;
  email: string;
  role: string;
  avatar: string;
  company: string;
}

export type DocType = 'pdf' | 'md' | 'csv' | 'docx' | 'audio';
export type DocStatus = 'indexed' | 'processing' | 'error';
export type Department = 'Finance' | 'Marketing' | 'Engineering' | 'Legal' | 'HR' | 'Executive';

export interface DocumentItem {
  id: string;
  name: string;
  type: DocType;
  size: string;
  uploadedAt: string;
  status: DocStatus;
  department: Department;
  progress?: number;
  content?: string;
}

export interface ActivityItem {
  id: string;
  title: string;
  time: string;
  detail: string;
  icon: string;
  agentName?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  message: string;
  timestamp: string;
  sources?: Array<{ name: string; excerpt: string }>;
  isStreaming?: boolean;
  modelName?: string;
  thinkingSteps?: string[];
}

export interface WorkflowNode {
  id: string;
  name: string;
  type: 'trigger' | 'action' | 'condition';
  status: 'active' | 'inactive' | 'running';
  description: string;
}
