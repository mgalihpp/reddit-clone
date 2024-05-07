import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import React from 'react';
import { SubredditAvatar } from '@/components/subreddit-avatar';
import { buttonVariants, Button } from '@/components/ui/button';
import { DialogHeader } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import type { UseMutateFunction } from '@tanstack/react-query';
import type { updateSubredditPayload } from '@/types/subreddit';

interface EditSubredditProps {
  dialogOpen: boolean;
  setDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  subreddit: Subreddit;
  uploadLoading: boolean;
  progress: number;
  description?: string;
  setDescription: React.Dispatch<React.SetStateAction<string | undefined>>;
  updateSubreddit: UseMutateFunction<
    string,
    Error,
    updateSubredditPayload,
    unknown
  >;
  isPending: boolean;
  isSubcribed: boolean;
  handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const EditSubreddit: React.FC<EditSubredditProps> = ({
  subreddit,
  dialogOpen,
  setDialogOpen,
  description,
  setDescription,
  uploadLoading,
  progress,
  updateSubreddit,
  isPending,
  handleImageChange,
  isSubcribed
}) => {
  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="xs" className="rounded-full px-2" disabled={!isSubcribed} >
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit r/{subreddit.name}</DialogTitle>
          <DialogDescription>
            You can edit your subreddit here
          </DialogDescription>
        </DialogHeader>
        <div>
          <div className="flex flex-col">
            <div className="flex items-center gap-4">
              <SubredditAvatar subbreddit={subreddit} className="size-10" />
              <div className="flex flex-col gap-2">
                {uploadLoading ? (
                  <p className="text-xs">Uploading... {progress.toFixed(2)}%</p>
                ) : (
                  <Label
                    className={buttonVariants({
                      variant: 'outline',
                      size: 'xs',
                    })}
                    htmlFor="image"
                  >
                    Change Profile
                  </Label>
                )}
                <span className="text-[10px]">* Max file size 5mb</span>
              </div>
              <Input
                type="file"
                id="image"
                className="hidden"
                accept={'.jpg, .jpeg, .png, .webp'}
                onChange={handleImageChange}
              />
            </div>

            <Separator className="my-2" />

            <div className="space-y-4">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                rows={1}
                placeholder="(optional)"
                autoFocus
                onChange={(e) => setDescription(e.target.value)}
                className='max-h-96'
              />

              <Button
                type="button"
                onClick={() =>
                  updateSubreddit(
                    {
                      id: subreddit.id as string,
                      description,
                    },
                    {
                      onSuccess: () => {
                        setDialogOpen(false);
                      },
                    },
                  )
                }
                isLoading={isPending}
                disabled={isPending}
              >
                Update
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditSubreddit;
