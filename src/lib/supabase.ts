import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  service: string;
  additional_message?: string;
  chat_history: ChatMessage[];
  created_at: string;
}

export interface AdminUser {
  id: string;
  email: string;
  password_hash: string;
  created_at: string;
}