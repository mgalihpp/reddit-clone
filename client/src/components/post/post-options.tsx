import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useCursorWait } from '@/hooks/use-cursor-wait';
import { useSession } from '@/providers/SessionProvider';
import { PostService } from '@/services/postServices';
import { useMutation } from '@tanstack/react-query';
import { Delete, Ellipsis, Flag } from 'lucide-react';
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

interface PostOptionsProps {
  postId: string;
  authorId: string;
  refetch: () => void;
}

const PostOptions: React.FC<PostOptionsProps> = ({
  postId,
  authorId,
  refetch,
}) => {
  const session = useSession();
  const { slug } = useParams();
  const navigate = useNavigate();

  const { mutate: deletePost, isPending } = useMutation({
    mutationKey: ['delete-post'],
    mutationFn: async () => {
      const { data } = await PostService.deletePost(postId);

      return data;
    },
    onError: () => {
      toast.error('Failed to delete post, please try again later');
    },
    onSuccess: () => {
      refetch();
      toast.success('Post deleted successfully');

      return navigate(`/r/${slug}`);
    },
  });

  useCursorWait(isPending);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Ellipsis className="size-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="m-0 mr-2 p-0">
        <DropdownMenuGroup className="text-lg">
          <DropdownMenuItem className="flex w-full items-center gap-3 px-4 py-3">
            <Flag className="size-5" />
            Report
          </DropdownMenuItem>
          {session?.id === authorId || session?.username === authorId && (
            <DropdownMenuItem
              className="flex w-full items-center gap-3 px-4 py-3"
              onClick={() => {
                deletePost();
              }}
            >
              <Delete className="size-5" />
              {isPending ? 'Deleting...' : 'Delete'}
            </DropdownMenuItem>
          )}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default PostOptions;
