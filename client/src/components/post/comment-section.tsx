import { ExtendedComment } from '@/types/comment';
import CreateComment from './create-comment';
import { useSession } from '@/providers/SessionProvider';
import PostComment from './post-comment';

interface CommentsSectionProps {
  postId: string;
  comments?: ExtendedComment[];
  refetch: () => void;
}

const CommentSection: React.FC<CommentsSectionProps> = ({
  postId,
  comments,
  refetch,
}) => {
  const session = useSession();
  return (
    <div className="mt-4 flex flex-col gap-y-4">
      <hr className="my-6 h-px w-full" />

      <CreateComment postId={postId} refetch={refetch} />

      <div className="mt-4 flex flex-col gap-y-6">
        {comments
          ?.filter((comment) => !comment.replyToId)
          .map((topLevelComment) => {
            const topLevelCommentVotesAmt = topLevelComment.votes.reduce(
              (acc, vote) => {
                if (vote.type === 'UP') return acc + 1;
                if (vote.type === 'DOWN') return acc - 1;
                return acc;
              },
              0,
            );

            const topLevelCommentVote = topLevelComment.votes.find(
              (vote) => vote.userId === session?.id,
            );

            return (
              <div key={topLevelComment.id} className="flex flex-col">
                <div className="mb-2">
                  <PostComment
                    comment={topLevelComment}
                    currentVote={topLevelCommentVote}
                    votesAmt={topLevelCommentVotesAmt}
                    postId={postId}
                    refetch={refetch}
                  />
                </div>

                {/* render replies */}
                {topLevelComment.replies
                  .sort((a, b) => b.votes.length - a.votes.length)
                  .map((reply) => {
                    const replyVotesAmt = reply.votes.reduce((acc, vote) => {
                      if (vote.type === 'UP') return acc + 1;
                      if (vote.type === 'DOWN') return acc - 1;
                      return acc;
                    }, 0);

                    const replyVote = reply.votes.find(
                      (vote) => vote.userId === session?.id,
                    );

                    return (
                      <div
                        key={reply.id}
                        className="ml-2 border-l-2 border-zinc-200 py-2 pl-4"
                      >
                        <PostComment
                          comment={reply}
                          currentVote={replyVote}
                          votesAmt={replyVotesAmt}
                          postId={postId}
                          refetch={refetch}
                        />
                      </div>
                    );
                  })}
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default CommentSection;
