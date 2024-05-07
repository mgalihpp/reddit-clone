import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useSession } from '@/providers/SessionProvider';
import { SubredditService } from '@/services/subredditServices';
import { dynamicTitle } from '@/utils/title';
import { useDocumentTitle } from '@mantine/hooks';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const CreateCommunityPage = () => {
  const session = useSession();
  const navigate = useNavigate();
  useDocumentTitle(dynamicTitle('Create Community'));
  const [input, setInput] = useState('');

  const { mutate: createCommunity, isPending } = useMutation({
    mutationKey: ['create-subreddit'],
    mutationFn: async () => {
      const { data } = await SubredditService.createSubreddit({ name: input });

      return data;
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response?.status === 409) {
          toast.error('Subreddit name already exits');
        } else {
          toast.error('Something went wrong, please try again later');
        }
      }
    },
    onSuccess: (data) => {
      navigate(`/r/${data}`);
    },
  });

  return (
    <div className="mx-auto flex h-full items-center">
      <div className="relative h-fit w-full space-y-6 rounded-lg bg-white p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold">Create a Community</h1>
        </div>
        <hr className="h-px bg-red-500" />

        <div>
          <p className="text-lg font-medium">Name</p>
          <p className="pb-2 text-xs">
            Community names including capitalization cannot be changed.
          </p>
          <div className="relative">
            <p className="absolute inset-y-0 left-0 grid w-8 place-items-center text-sm text-zinc-400">
              r/
            </p>
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="pl-6"
            />
          </div>
        </div>
        <div className="flex justify-end gap-4">
          <Button
            disabled={isPending}
            variant="subtle"
            onClick={() => navigate(-1)}
          >
            Cancel
          </Button>
          <Button
            isLoading={isPending}
            disabled={input.length === 0}
            onClick={() => {
              if (!session.user) {
                toast.error('Please sign in to create a community');
                navigate('/sign-in');
                return;
              }

              createCommunity();
            }}
          >
            Create Community
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CreateCommunityPage;
