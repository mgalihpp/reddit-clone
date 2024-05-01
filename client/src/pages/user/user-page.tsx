import Loader from '@/components/loader';
import { buttonVariants } from '@/components/ui/button';
import { UserAvatar } from '@/components/user-avatar';
import NotFound from '@/not-found';
import { UserService } from '@/services/userServices';
import { dynamicTitle } from '@/utils/title';
import { useDocumentTitle } from '@mantine/hooks';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import {
  useLocation,
  useNavigate,
  useParams,
  Outlet,
  Link,
} from 'react-router-dom';

const UserPage = () => {
  const { username } = useParams();
  const { pathname } = useLocation();
  const navigate = useNavigate();

  useDocumentTitle(dynamicTitle(`${username}`));

  const correctPath = ['/posts', '/comments'];
  const absolutePath = `/user/${username}`;

  useEffect(() => {
    // Redirect if the slug contains encoded spaces ("%20")
    // examaple /r/www%20www it will be /r/wwwwww
    if (pathname && pathname.includes('%20')) {
      const newSlug = pathname.replace(/%20/g, '');
      return navigate(`${newSlug}`);
    }
  }, [pathname, navigate]);

  const { data, isLoading } = useQuery({
    queryKey: ['user', username],
    queryFn: async () => {
      const data = await UserService.fetchUsers(username as string);

      return data;
    },
    refetchOnWindowFocus: false,
  });

  const isCorrectPath = correctPath.some((p) =>
    pathname.startsWith(`/user/${username}${p}`),
  );
  if (!isCorrectPath && pathname !== absolutePath) {
    return <NotFound />;
  }

  return isLoading ? (
    <Loader />
  ) : !data ? (
    <NotFound />
  ) : (
    <div className="mx-auto py-12">
      <div className="grid items-start gap-8">
        <div className="flex items-center gap-4">
          <UserAvatar user={data.user} />
          <div className="flex flex-col">
            <h1 className="text-3xl font-bold md:text-4xl">
              {data.user.username}
            </h1>
            <span>u/{data.user.username}</span>
          </div>
        </div>

        <div className="flex max-w-lg gap-4">
          <Link
            to={`${absolutePath}`}
            className={buttonVariants({
              className: 'rounded-full',
              variant: 'subtle',
            })}
          >
            Overview
          </Link>
          <Link
            to={`${absolutePath}/posts`}
            className={buttonVariants({
              className: 'rounded-full',
              variant: 'subtle',
            })}
          >
            Post
          </Link>
          <Link
            to={`${absolutePath}/comments`}
            className={buttonVariants({
              className: 'rounded-full',
              variant: 'subtle',
            })}
          >
            Comment
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-y-4 py-6 md:grid-cols-3 md:gap-x-4">
          <Outlet context={{ user: data.user, posts: data.posts }} />
        </div>
      </div>
    </div>
  );
};

export default UserPage;
