import { Icons } from '@/components/icons';
import AuthForm from '@/components/auth/form';
import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import { toast } from 'react-toastify';

const SignIn = () => {
  useEffect(() => {
    try {
      const notify = localStorage.getItem('notify');
      const shouldNotify = notify === 'true';

      if (notify !== null && shouldNotify) {
        toast.error('You must be logged in to access the page!');
      }

      return () => {
        if (notify !== null && shouldNotify) {
          localStorage.removeItem('notify');
        }
      };
    } catch (error) {
      console.error('Error accessing localStorage:', error);
    }
  }, []);

  return (
    <div className="container mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px]">
      <div className="flex flex-col space-y-2 text-center">
        <Icons.logo className="mx-auto h-6 w-6" />
        <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
        <p className="mx-auto max-w-xs text-sm">
          By continuing, you are setting up a Beddit account and agree to our
          User Agreement and Privacy Policy.
        </p>
      </div>
      <AuthForm />
      <p className="px-8 text-center text-sm text-muted-foreground">
        New to Breaddit?{' '}
        <Link
          to="/sign-up"
          className="hover:text-brand text-sm underline underline-offset-4"
        >
          Sign Up
        </Link>
      </p>
    </div>
  );
};

export default SignIn;
