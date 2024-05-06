import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';

const FeedButton = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  // if path is /r/mycom, turn into /
  // if path is /r/mycom/post/cligad6jf0003uhest4qqkeco, turn into /r/mycom

  const subredditPath = getSubredditPath(pathname);

  return (
    <Button
      onClick={() => navigate(subredditPath)}
      variant="subtle"
      className="rounded-full p-0 px-2 max-sm:hidden"
    >
      <ChevronLeft className="mr-1 size-6" />
      {/* {subredditPath === '/' ? 'Back Home' : 'Back to community'} */}
    </Button>
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
