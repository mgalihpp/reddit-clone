import { Link, useLocation } from 'react-router-dom';
import { buttonVariants } from '../ui/button';
import { ChevronLeft } from 'lucide-react';

const FeedButton = () => {
  const { pathname } = useLocation();

  // if path is /r/mycom, turn into /
  // if path is /r/mycom/post/cligad6jf0003uhest4qqkeco, turn into /r/mycom

  const subredditPath = getSubredditPath(pathname);

  return (
    <Link to={subredditPath} className={buttonVariants({ variant: 'ghost' })}>
      <ChevronLeft className="size-4 mr-1" />
      {subredditPath === '/' ? 'Back Home' : 'Back to community'}
    </Link>
  );
};

const getSubredditPath = (pathname: string) => {
  const splitPath = pathname.split('/');

  if (splitPath.length === 3) return '/';
  else if (splitPath.length > 3) return `/${splitPath[1]}/${splitPath[2]}`;
  // default path, in case pathname does not match expected format
  else return '/';
};

export default FeedButton;
