import { User } from './auth';

export interface Company {
  id: string;
  name: string;
  domain: string; // Company email domain for validation
  slack_workspace_id: string;
  created_at: string;
  updated_at: string;
}

export interface CompanyUser extends User {
  company_id: string;
  role: 'admin' | 'employee';
  points: number;
  check_ins: number;
  badges: string[];
  last_check_in?: string;
}

export interface CompanyStats {
  total_employees: number;
  total_check_ins: number;
  total_points: number;
  active_challenges: number;
  top_performers: CompanyUser[];
} 