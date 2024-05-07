import SignInModal from '@/components/modal/sign-in';
import { useState, useEffect } from 'react';

export default function ModalProvider() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <SignInModal />
    </>
  );
}
