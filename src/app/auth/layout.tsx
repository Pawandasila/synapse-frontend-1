import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Authentication - Synapse',
  description: 'Login or create your Synapse account',
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="auth-layout ">
      {children}
    </div>
  );
}
