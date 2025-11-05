import { LoginForm } from '@/components/login-form';
import { Logo } from '@/components/logo';

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex justify-center">
          <Logo />
        </div>
        <LoginForm />
      </div>
      <footer className="mt-8 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} PharmaTrust. All Rights Reserved.
      </footer>
    </div>
  );
}
