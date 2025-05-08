import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

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

    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const verificationToken = Math.random().toString(36).substring(2);
    const verificationLink = `${process.env.NEXT_PUBLIC_APP_URL}/verify-email?token=${verificationToken}`;

    await resend.emails.send({
      from: 'Health Tracker <noreply@healthtracker.com>',
      to: email,
      subject: 'Verify your email address',
      html: `
        <h1>Verify your email address</h1>
        <p>Click the link below to verify your email address:</p>
        <a href="${verificationLink}">Verify Email</a>
        <p>If you didn't request this email, you can safely ignore it.</p>
      `,
    });

    // Store the verification token in your database
    // This is a placeholder - implement your actual database logic here
    // await prisma.user.update({
    //   where: { email },
    //   data: { verificationToken },
    // });

    return res.status(200).json({ message: 'Verification email sent' });
  } catch (error) {
    console.error('Error sending verification email:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
} 