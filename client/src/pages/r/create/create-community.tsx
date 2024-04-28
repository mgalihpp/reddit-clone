import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SubredditService } from '@/services/subredditServices';
import { dynamicTitle } from '@/utils/title';
import { useDocumentTitle } from '@mantine/hooks';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const CreateCommunityPage = () => {
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
    <div className="flex items-center h-full mx-auto">
      <div className="relative bg-white w-full h-fit rounded-lg p-4 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-semibold">Create a Community</h1>
        </div>
        <hr className="bg-red-500 h-px" />

        <div>
          <p className="text-lg font-medium">Name</p>
          <p className="text-xs pb-2">
            Community names including capitalization cannot be changed.
          </p>
          <div className="relative">
            <p className="absolute text-sm left-0 w-8 inset-y-0 grid place-items-center text-zinc-400">
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
            onClick={() => createCommunity()}
          >
            Create Community
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CreateCommunityPage;
