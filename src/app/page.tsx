
'use client';
import { LoginForm } from '@/components/login-form';
import { Logo } from '@/components/logo';

export default function LoginPage() {
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
