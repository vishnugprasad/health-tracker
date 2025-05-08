import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const session = await getSession({ req });
    if (!session) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { token } = req.body;
    if (!token) {
      return res.status(400).json({ message: 'Verification token is required' });
    }

    // Verify the token and update the user's email verification status
    // This is a placeholder - implement your actual database logic here
    // const user = await prisma.user.findFirst({
    //   where: { verificationToken: token },
    // });
    // 
    // if (!user) {
    //   return res.status(400).json({ message: 'Invalid verification token' });
    // }
    // 
    // await prisma.user.update({
    //   where: { id: user.id },
    //   data: {
    //     email_verified: true,
    //     verificationToken: null,
    //   },
    // });

    return res.status(200).json({ message: 'Email verified successfully' });
  } catch (error) {
    console.error('Error verifying email:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
} 