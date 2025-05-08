import { createClient } from '@supabase/supabase-js';
import { Company, CompanyUser, CompanyStats } from '@/types/company';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function getCompanyBySlackWorkspaceId(workspaceId: string): Promise<Company | null> {
  const { data, error } = await supabase
    .from('companies')
    .select('*')
    .eq('slack_workspace_id', workspaceId)
    .single();

  if (error) {
    console.error('Error fetching company:', error);
    return null;
  }

  return data;
}

export async function createCompany(company: Omit<Company, 'id' | 'created_at' | 'updated_at'>): Promise<Company | null> {
  const { data, error } = await supabase
    .from('companies')
    .insert([company])
    .select()
    .single();

  if (error) {
    console.error('Error creating company:', error);
    return null;
  }

  return data;
}

export async function addUserToCompany(user: Omit<CompanyUser, 'id' | 'created_at' | 'updated_at'>): Promise<CompanyUser | null> {
  const { data, error } = await supabase
    .from('company_users')
    .insert([user])
    .select()
    .single();

  if (error) {
    console.error('Error adding user to company:', error);
    return null;
  }

  return data;
}

export async function getCompanyStats(companyId: string): Promise<CompanyStats | null> {
  const { data: users, error: usersError } = await supabase
    .from('company_users')
    .select('*')
    .eq('company_id', companyId);

  if (usersError) {
    console.error('Error fetching company users:', usersError);
    return null;
  }

  const { data: challenges, error: challengesError } = await supabase
    .from('challenges')
    .select('*')
    .eq('company_id', companyId)
    .eq('status', 'active');

  if (challengesError) {
    console.error('Error fetching company challenges:', challengesError);
    return null;
  }

  const stats: CompanyStats = {
    total_employees: users.length,
    total_check_ins: users.reduce((sum, user) => sum + user.check_ins, 0),
    total_points: users.reduce((sum, user) => sum + user.points, 0),
    active_challenges: challenges.length,
    top_performers: users
      .sort((a, b) => b.points - a.points)
      .slice(0, 5),
  };

  return stats;
} 