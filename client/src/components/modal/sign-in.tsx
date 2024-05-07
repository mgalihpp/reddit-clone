import { Icons } from '@/components/icons';
import AuthForm from '@/components/auth/form';
import { useAppDispatch, useAppSelector } from '@/hooks';
import { isModalOpen, setModalOpen } from '@/reducers/modalReducer';
import { Dialog, DialogContent } from '@/components/ui/dialog';

const SignInModal = () => {
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector(isModalOpen);
  const handleClose = () => dispatch(setModalOpen(false));

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent>
        <div className="container mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px]">
          <div className="flex flex-col space-y-2 text-center">
            <Icons.logo className="mx-auto h-6 w-6" />
            <h1 className="text-2xl font-semibold tracking-tight">
              Welcome back
            </h1>
            <p className="mx-auto max-w-xs text-sm">
              By continuing, you are setting up a Beddit account and agree to
              our User Agreement and Privacy Policy.
            </p>
          </div>
          <AuthForm />
          <p className="px-8 text-center text-sm text-muted-foreground">
            New to Breaddit?{' '}
            {/* <Link
          to="/sign-up"
          className="hover:text-brand text-sm underline underline-offset-4"
          >
          Sign Up
        </Link> */}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SignInModal;
