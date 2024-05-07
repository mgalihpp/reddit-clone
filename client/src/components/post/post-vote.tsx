import { PostVoteRequest } from '@/lib/validators/vote';
import { usePrevious } from '@mantine/hooks';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Button } from '../ui/button';
import { ArrowBigDown, ArrowBigUp } from 'lucide-react';
import { cn, formatReadableCount } from '@/lib/utils';
import { PostService } from '@/services/postServices';
import { useSession } from '@/providers/SessionProvider';
import { useAppDispatch } from '@/hooks';
import { setModalOpen } from '@/reducers/modalReducer';

interface PostVoteProps {
  postId: string;
  initialVotesAmt: number;
  initialVote?: VoteType | null;
}

const PostVote: React.FC<PostVoteProps> = ({
  postId,
  initialVotesAmt,
  initialVote,
}) => {
  const session = useSession();
  const dispatch = useAppDispatch();
  const [votesAmt, setVotesAmt] = useState<number>(initialVotesAmt);
  const [currentVote, setCurrentVote] = useState(initialVote);
  const prevVote = usePrevious(currentVote);

  useEffect(() => {
    setCurrentVote(initialVote);
  }, [initialVote]);

  const { mutate: vote } = useMutation({
    mutationFn: async (type: VoteType) => {
      const payload: PostVoteRequest = {
        postId: postId,
        voteType: type,
      };

      const { data } = await PostService.votePost(payload);

      return data;
    },
    onError: (err, voteType) => {
      if (voteType === 'UP') setVotesAmt((prev) => prev - 1);
      else setVotesAmt((prev) => prev + 1);

      //   reset current vote
      setCurrentVote(prevVote);

      if (err instanceof AxiosError) {
        if (err.response?.status === 401) {
          //   return logintoast
        }
      }

      return toast.error('Something went wrong!');
    },
    onMutate: (type: 'UP' | 'DOWN') => {
      if (currentVote === type) {
        // User is voting the same way again, so remove their vote
        setCurrentVote(undefined);
        if (type === 'UP') setVotesAmt((prev) => prev - 1);
        else if (type === 'DOWN') setVotesAmt((prev) => prev + 1);
      } else {
        // User is voting in the opposite direction, so subtract 1
        setCurrentVote(type);
        if (type === 'UP') setVotesAmt((prev) => prev + (currentVote ? 2 : 1));
        else if (type === 'DOWN')
          setVotesAmt((prev) => prev - (currentVote ? 2 : 1));
      }
    },
  });

  return (
    <div className="flex h-fit items-center gap-1 rounded-full bg-zinc-200/50 sm:w-fit sm:gap-2 sm:pb-0">
      {/* upvote */}
      <Button
        onClick={() => {
          if (!session.user) {
            dispatch(setModalOpen(true));
            return toast.error('Please login to vote!');
          }
          vote('UP');
        }}
        size="sm"
        variant="subtle"
        aria-label="upvote"
        className="group rounded-full bg-transparent focus:ring-0 focus:ring-transparent focus:ring-offset-0"
      >
        <ArrowBigUp
          className={cn(
            'size-5 text-zinc-700 group-hover:text-emerald-500 max-sm:size-4',
            {
              'fill-emerald-500 text-emerald-500': currentVote === 'UP',
            },
          )}
        />
      </Button>

      {/* score */}
      <p className="py-2 text-center text-xs font-medium text-zinc-900">
        {formatReadableCount(votesAmt)}
      </p>

      {/* downvote */}
      <Button
        onClick={() => {
          if (!session.user) {
            dispatch(setModalOpen(true));
            return toast.error('Please login to vote!');
          }
          vote('DOWN');
        }}
        size="sm"
        variant="subtle"
        aria-label="downvote"
        className="group rounded-full bg-transparent focus:ring-0 focus:ring-transparent focus:ring-offset-0"
      >
        <ArrowBigDown
          className={cn(
            'size-5 text-zinc-700 group-hover:text-red-500 max-sm:size-4',
            {
              'fill-red-500 text-red-500': currentVote === 'DOWN',
            },
          )}
        />
      </Button>
    </div>
  );
};

export default PostVote;
