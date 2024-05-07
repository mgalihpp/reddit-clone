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
import { toast } from 'react-toastify';

interface CommentOptionsProps {
  commentId: string;
  authorId: string;
  refetch: () => void;
}

const CommentOptions: React.FC<CommentOptionsProps> = ({
  commentId,
  authorId,
  refetch,
}) => {
  const session = useSession();

  const { mutate: deleteComment, isPending } = useMutation({
    mutationKey: ['delete-comment'],
    mutationFn: async () => {
      const { data } = await PostService.deleteComment(commentId);

      return data;
    },
    onError: () => {
      toast.error('Failed to delete comment, please try again later');
    },
    onSuccess: () => {
      refetch();
      toast.success('Comment deleted successfully');
    },
  });

  useCursorWait(isPending);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Ellipsis className="size-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="m-0 p-0">
        <DropdownMenuGroup className="text-lg">
          <DropdownMenuItem className="flex w-full items-center gap-3 px-4 py-3">
            <Flag className="size-5" />
            Report
          </DropdownMenuItem>
          {session.user?.id === authorId && (
            <DropdownMenuItem
              className="flex w-full items-center gap-3 px-4 py-3"
              onClick={() => {
                deleteComment();
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

export default CommentOptions;
