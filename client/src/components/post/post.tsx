import React, { useRef } from 'react';
import PostVote from './post-vote';
import { Link } from 'react-router-dom';
import { formatTimeToNow } from '@/lib/utils';
import EditorOutput from '@/components/editor/EditorOutput';
import { MessageSquare } from 'lucide-react';

type PartialVote = Pick<Vote, 'type'>;

interface PostProps {
  post: Post & {
    author: User;
    votes: Vote[];
  };
  votesAmt: number;
  subredditName: string;
  currentVote?: PartialVote;
  commentAmt: number;
}

const Post: React.FC<PostProps> = ({
  post,
  votesAmt: _votesAmt,
  currentVote: _currentVote,
  subredditName,
  commentAmt,
}) => {
  const paraRef = useRef<HTMLParagraphElement>(null);

  return (
    <div className="rounded-md bg-white shadow">
      <div className="flex justify-between px-6 py-4">
        <PostVote
          postId={post.id}
          initialVotesAmt={_votesAmt}
          initialVote={_currentVote?.type}
        />

        <div className="w-0 flex-1">
          <div className="mt-1 max-h-40 text-xs text-gray-500">
            {subredditName ? (
              <>
                <Link
                  to={`/r/${subredditName}`}
                  className="text-sm text-zinc-900 underline underline-offset-2"
                >
                  r/{subredditName}
                </Link>
                <span className="px-1">•</span>
              </>
            ) : null}
            <span>
              Posted by{' '}
              <Link to={`/user/${post.author.username}`} className='underline'>
                u/{post.author.username}
              </Link>
            </span>{' '}
            {formatTimeToNow(new Date(post.createdAt))}
          </div>
          <Link to={`/r/${subredditName}/post/${post.id}`}>
            <h1 className="py-2 text-lg font-semibold leading-6 text-gray-900">
              {post.title}
            </h1>
          </Link>

          <div
            className="relative max-h-40 w-full overflow-clip text-sm"
            ref={paraRef}
          >
            <EditorOutput content={post.content} />
            {paraRef.current?.clientHeight === 160 ? (
              // blur bottom if content is too long
              <div className="to absolute bottom-0 left-0 h-24 w-full bg-gradient-to-t from-white to-transparent"></div>
            ) : null}
          </div>
        </div>
      </div>
      <div className="z-20 bg-gray-50 px-4 py-4 text-sm sm:px-6">
        <Link
          to={`/r/${subredditName}/post/${post.id}`}
          className="flex w-fit items-center gap-2"
        >
          <MessageSquare className="size-4" /> {commentAmt} comments
        </Link>
      </div>
    </div>
  );
};

export default Post;
