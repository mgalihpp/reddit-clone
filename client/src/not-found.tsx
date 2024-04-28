import { Link } from 'react-router-dom';
import { buttonVariants } from '@/components/ui/button';
import { useDocumentTitle } from '@mantine/hooks';
import { dynamicTitle } from '@/utils/title';

/**
 * Renders the Not Found page with a 404 message and a link back to the homepage.
 *
 * @return {JSX.Element} The JSX element representing the Not Found page.
 */
export default function NotFound() {
  useDocumentTitle(dynamicTitle('Not Found'));
  return (
    <section className="bg-white dark:bg-gray-900 w-full">
      <div className="py-8 px-4 mx-auto max-w-screen-xl h-dvh flex items-center justify-center lg:py-16 lg:px-6">
        <div className="mx-auto max-w-screen-sm text-center">
          <h1 className="mb-4 text-7xl tracking-tight font-extrabold lg:text-9xl text-primary-600 dark:text-primary-500">
            404
          </h1>
          <p className="mb-4 text-3xl tracking-tight font-bold text-gray-900 md:text-4xl dark:text-white">
            Something's missing.
          </p>
          <p className="mb-4 text-lg font-light text-gray-500 dark:text-gray-400">
            Sorry, we can't find that page. You'll find lots to explore on the
            home page.{' '}
          </p>
          <Link
            to="/home"
            className={buttonVariants({
              variant: 'outline',
            })}
          >
            Back to Homepage
          </Link>
        </div>
      </div>
    </section>
  );
}
