import React, { startTransition } from 'react';
import { Button } from '@/components/ui/button';
import { useMutation } from '@tanstack/react-query';
import { SubredditService } from '@/services/subredditServices';
import { toast } from 'react-toastify';

interface SubscribeBtnProps {
  isSubscribed: boolean;
  subredditId: string;
  subredditName: string;
  refetch: () => void;
}

const SubscribeBtn: React.FC<SubscribeBtnProps> = ({
  isSubscribed,
  subredditId,
  subredditName,
  refetch,
}) => {
  const { mutate: subscribe, isPending: isSubLoading } = useMutation({
    mutationKey: ['subscribe'],
    mutationFn: async () => {
      const payload = { subredditId };
      await SubredditService.subscribe(payload);
    },
    onError: () => {
      toast.error('Something went wrong!');
    },
    onSuccess: () => {
      startTransition(() => {
        refetch();
      });
      toast.success(`Subscribed! to r/${subredditName}`);
    },
  });
  const { mutate: unsubscribe, isPending: isUnsubLoading } = useMutation({
    mutationKey: ['subscribe'],
    mutationFn: async () => {
      const payload = { subredditId };
      await SubredditService.unsubscribe(payload);
    },
    onError: () => {
      toast.error('Something went wrong!');
    },
    onSuccess: () => {
      startTransition(() => {
        refetch();
      });
      toast.success(`Unsubscribed! to r/${subredditName}`);
    },
  });

  return isSubscribed ? (
    <Button
      // className="w-full mb-4 mt-1 bg-transparent border-2 text-black rounded-full"
      variant="outline"
      className="rounded-full px-2"
      size="xs"
      isLoading={isUnsubLoading}
      onClick={() => unsubscribe()}
    >
      Joined
    </Button>
  ) : (
    <Button
      className="rounded-full bg-blue-900 hover:bg-blue-950 px-2"
      size="xs"
      isLoading={isSubLoading}
      onClick={() => subscribe()}
    >
      Join
    </Button>
  );
};

export default SubscribeBtn;
