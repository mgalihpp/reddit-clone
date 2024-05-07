import { cn } from '@/lib/utils';

interface LoaderProps {
  container?: boolean;
  container2?: boolean;
  className?: string;
}

const Loader = ({
  className,
  container = false,
  container2 = false,
}: LoaderProps) => {
  return (
    <div
      className={cn(
        'flex items-center justify-center',
        { 'h-[calc(100dvh-20rem)]': container },
        { 'h-[calc(100dvh-20rem)]': container2 },
        className,
      )}
    >
      <div className="h-12 w-12 animate-spin rounded-full border-t-4 border-solid border-black"></div>
    </div>
  );
};

export default Loader;
