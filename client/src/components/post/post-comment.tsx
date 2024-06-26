import { UserAvatar } from '@/components/user-avatar';
import { formatTimeToNow } from '@/lib/utils';
import CommentVotes from './comment-votes';
import { useRef, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { CommentRequest } from '@/lib/validators/comment';
import { PostService } from '@/services/postServices';
import { toast } from 'react-toastify';
import { useOnClickOutside } from '@/hooks/use-on-click-outside';
import { Button } from '@/components/ui/button';
import { MessageSquare } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import React from 'react';
import CommentContent from './comment-content';
import { Link } from 'react-router-dom';
import CommentOptions from './comment-options';
import { useCursorWait } from '@/hooks/use-cursor-wait';
import UserHover from '@/components/user-hover';
import { setModalOpen } from '@/reducers/modalReducer';
import { useSession } from '@/providers/SessionProvider';
import { useAppDispatch } from '@/hooks';

type ExtendedComment = Comments & {
  votes: CommentVote[];
  author: User;
};

interface PostCommentProps {
  comment: ExtendedComment;
  votesAmt: number;
  currentVote: CommentVote | undefined;
  postId: string;
  refetch: () => void;
}

const PostComment: React.FC<PostCommentProps> = ({
  comment,
  votesAmt,
  currentVote,
  postId,
  refetch,
}) => {
  const session = useSession();
  const dispatch = useAppDispatch();
  const [isReplying, setIsReplying] = useState<boolean>(false);
  const commentRef = useRef<HTMLDivElement>(null);
  const [input, setInput] = useState<string>(`@${comment.author.username} `);

  useOnClickOutside(commentRef, () => {
    setIsReplying(false);
  });

  const { mutate: createComment, isPending } = useMutation({
    mutationKey: ['create-comment'],
    mutationFn: async ({ postId, text, replyToId }: CommentRequest) => {
      const payload: CommentRequest = {
        postId,
        text,
        replyToId,
      };

      const { data } = await PostService.createComment(payload);

      return data;
    },
    onError: () => {
      toast.error('Something went wrong!');
    },
    onSuccess: () => {
      refetch();
      setIsReplying(false);
    },
  });

  useCursorWait(isPending);

  return (
    <div className="flex flex-col">
      <Link
        to={`/user/${comment.author.username}`}
        className="flex w-fit items-center"
      >
        <UserHover
          author={comment.author}
          customTrigger
          className="flex items-center gap-0 no-underline"
        >
          <UserAvatar
            user={{
              name: comment.author.name || null,
              image: comment.author.image || null,
            }}
            className="size-7"
          />
          <div className="ml-2 flex items-center gap-x-2">
            <p className="text-sm font-medium text-gray-900">
              {comment.author.username}
            </p>
            <p className="max-h-40 truncate text-xs text-zinc-500">
              {formatTimeToNow(new Date(comment.createdAt))}
            </p>
          </div>
        </UserHover>
      </Link>

      <CommentContent text={comment.text} />

      <div className="flex items-center gap-4">
        <CommentVotes
          commentId={comment.id}
          votesAmt={votesAmt}
          currentVote={currentVote}
        />

        <Button
          onClick={() => {
            setIsReplying(true);
          }}
          variant="ghost"
          size="xs"
        >
          <MessageSquare className="mr-1.5 size-4" />
          Reply
        </Button>

        <CommentOptions
          commentId={comment.id}
          authorId={comment.author.id}
          refetch={refetch}
        />
      </div>

      {isReplying && (
        <div className="grid w-full gap-1.5">
          <Label htmlFor="comment">Your comment</Label>
          <div className="mt-2">
            <Textarea
              onFocus={(e) =>
                e.currentTarget.setSelectionRange(
                  e.currentTarget.value.length,
                  e.currentTarget.value.length,
                )
              }
              autoFocus
              id="comment"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              rows={1}
              placeholder="What are your thoughts?"
            />

            <div className="mt-2 flex justify-end gap-2">
              <Button
                tabIndex={-1}
                variant="subtle"
                onClick={() => setIsReplying(false)}
              >
                Cancel
              </Button>
              <Button
                isLoading={isPending}
                disabled={isPending}
                onClick={() => {
                  if (!input) return;
                  if (!session.user) {
                    toast.error('Please login to post a comment');

                    dispatch(setModalOpen(true));
                    return;
                  }
                  createComment({
                    postId,
                    text: input,
                    replyToId: comment.replyToId ?? comment.id,
                  });
                }}
              >
                Post
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostComment;
