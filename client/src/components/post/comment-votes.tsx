import { ArrowBigDown, ArrowBigUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import React, { useState } from 'react';
import { usePrevious } from '@mantine/hooks';
import { useMutation } from '@tanstack/react-query';
import { CommentVoteRequest } from '@/lib/validators/vote';
import { PostService } from '@/services/postServices';
import { toast } from 'react-toastify';

interface CommentVotesProps {
  commentId: string;
  votesAmt: number;
  currentVote?: PartialVote;
}

type PartialVote = Pick<CommentVote, 'type'>;

const CommentVotes: React.FC<CommentVotesProps> = ({
  commentId,
  currentVote: _currentVote,
  votesAmt: _votesAmt,
}) => {
  const [votesAmt, setVotesAmt] = useState<number>(_votesAmt);
  const [currentVote, setCurrentVote] = useState<PartialVote | undefined>(
    _currentVote,
  );
  const prevVote = usePrevious(currentVote);

  const { mutate: vote } = useMutation({
    mutationFn: async (type: VoteType) => {
      const payload: CommentVoteRequest = {
        commentId,
        voteType: type,
      };

      const { data } = await PostService.voteComment(payload);

      return data;
    },
    onError: (err, voteType) => {
      if (voteType === 'UP') setVotesAmt((prev) => prev - 1);
      else setVotesAmt((prev) => prev + 1);

      //   reset current vote
      setCurrentVote(prevVote);

      return toast.error('Something went wrong!');
    },
    onMutate: (type: VoteType) => {
      if (currentVote?.type === type) {
        setCurrentVote(undefined);

        if (type === 'UP') setVotesAmt((prev) => prev - 1);
        else if (type === 'DOWN') setVotesAmt((prev) => prev + 1);
      } else {
        setCurrentVote({ type });
        if (type === 'UP') setVotesAmt((prev) => prev + (currentVote ? 2 : 1));
        else if (type === 'DOWN') {
          setVotesAmt((prev) => prev - (currentVote ? 2 : 1));
        }
      }
    },
  });

  return (
    <div className="flex gap-1">
      {/* upvote */}
      <Button
        onClick={() => vote('UP')}
        size="xs"
        variant="ghost"
        aria-label="upvote"
      >
        <ArrowBigUp
          className={cn('h-5 w-5 text-zinc-700', {
            'fill-emerald-500 text-emerald-500': currentVote?.type === 'UP',
          })}
        />
      </Button>

      {/* score */}
      <p className="px-1 py-2 text-center text-xs font-medium text-zinc-900">
        {votesAmt}
      </p>

      {/* downvote */}
      <Button
        onClick={() => vote('DOWN')}
        size="xs"
        className={cn({
          'text-emerald-500': currentVote?.type === 'DOWN',
        })}
        variant="ghost"
        aria-label="downvote"
      >
        <ArrowBigDown
          className={cn('h-5 w-5 text-zinc-700', {
            'fill-red-500 text-red-500': currentVote?.type === 'DOWN',
          })}
        />
      </Button>
    </div>
  );
};

export default CommentVotes;
