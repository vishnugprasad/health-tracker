import { NextResponse } from 'next/server';
import { getCompanyBySlackWorkspaceId, createCompany, addUserToCompany } from '@/lib/services/company';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { workspaceId, companyName, domain } = await request.json();

    // Check if company already exists
    let company = await getCompanyBySlackWorkspaceId(workspaceId);
    
    if (!company) {
      // Create new company
      company = await createCompany({
        name: companyName,
        domain,
        slack_workspace_id: workspaceId,
      });

      if (!company) {
        return NextResponse.json({ error: 'Failed to create company' }, { status: 500 });
      }
    }

    // Add user to company
    const companyUser = await addUserToCompany({
      company_id: company.id,
      slack_id: session.user.slack_id,
      name: session.user.name,
      email: session.user.email,
      image: session.user.image,
      role: 'admin', // First user is always admin
      points: 0,
      check_ins: 0,
      badges: [],
    });

    if (!companyUser) {
      return NextResponse.json({ error: 'Failed to add user to company' }, { status: 500 });
    }

    return NextResponse.json({
      company,
      user: companyUser,
    });
  } catch (error) {
    console.error('Error in onboarding:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 