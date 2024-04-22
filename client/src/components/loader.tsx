import { cn } from '@/lib/utils';

interface LoaderProps {
  container?: boolean;
  className?: string;
}

const Loader = ({ className, container = false }: LoaderProps) => {
  return (
    <div
      className={cn(
        'flex items-center justify-center',
        { 'h-dvh': container },
        className,
      )}
    >
      <div className="animate-spin rounded-full border-t-4 border-black border-solid h-12 w-12"></div>
    </div>
  );
};

export default Loader;
