import Post from '@/components/post/post';
import { useSession } from '@/providers/SessionProvider';
import type { ExtendedPost } from '@/types/post';
import { useOutletContext } from 'react-router-dom';

const UserComments = () => {
  const session = useSession();
  const { posts } = useOutletContext<{
    user: User;
    posts: ExtendedPost[];
  }>();

  return (
    <div className="col-span-2">
      {posts.length === 0 ? (
        <>No comments from this user</>
      ) : (
        posts.map((post) => {
          const votesAmt = post.votes.reduce((acc, vote) => {
            if (vote.type === 'UP') return acc + 1;
            if (vote.type === 'DOWN') return acc - 1;
            return acc;
          }, 0);

          const currentVote = session
            ? post.votes.find((vote) => vote.userId === session.id)
            : undefined;

          return (
            <Post
              key={post.id}
              post={post}
              commentAmt={post.comments.length}
              votesAmt={votesAmt}
              subreddit={post.subreddit}
              currentVote={currentVote}
            />
          );
        })
      )}
    </div>
  );
};

export default UserComments;
