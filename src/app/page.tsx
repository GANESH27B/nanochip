
'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LoginForm } from '@/components/login-form';
import { Logo } from '@/components/logo';
import { Loader2 } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();

  useEffect(() => {
    const userRole = localStorage.getItem('userRole');
    if (userRole) {
      if (userRole === 'Patient') {
        router.replace('/my-prescriptions');
      } else {
        router.replace('/dashboard');
      }
    }
  }, [router]);

  // Render a loading state or null while the check is happening
  // to avoid a flash of the login form.
  const userRole = typeof window !== 'undefined' ? localStorage.getItem('userRole') : null;
  if (userRole) {
    return (
      <div className="flex min-h-[calc(100vh-180px)] flex-col items-center justify-center bg-background p-4">
        <Loader2 className="h-8 w-8 animate-spin" />
        <p className="mt-4 text-muted-foreground">Redirecting to your dashboard...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-[calc(100vh-180px)] flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-md animate-fade-in-up">
        <div className="mb-8 flex justify-center text-center flex-col items-center gap-2">
          <Logo />
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
