import { SignUpForm } from '@/components/signup-form';
import { Logo } from '@/components/logo';

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-md animate-fade-in-up">
        <div className="mb-8 flex justify-center text-center flex-col items-center gap-2">
          <Logo />
           <p className="text-muted-foreground">Take it easy</p>
        </div>
        <SignUpForm />
      </div>
      <footer className="mt-8 text-center text-sm text-muted-foreground animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
        © {new Date().getFullYear()} PharmaChain. All Rights Reserved.
      </footer>
    </div>
  );
}
