import { cn } from '@/lib/utils';
import { UsernameValidator } from '@/lib/validators/user';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button, buttonVariants } from '@/components/ui/button';
import { UserService } from '@/services/userServices';
import { updateUserPayload } from '@/types/user';
import { toast } from 'react-toastify';
import { useAppDispatch } from '@/hooks';
import { updateUser } from '@/reducers/authReducer';
import { persistor } from '@/store';
import { UserAvatar } from './user-avatar';
import { uploadFiles } from '@/utils/uploadthing';

interface UserFormProps extends React.HTMLAttributes<HTMLFormElement> {
  user: Pick<User, 'username' | 'name' | 'image'>;
}

type FormData = z.infer<typeof UsernameValidator>;

const UserForm: React.FC<UserFormProps> = ({ user, className, ...props }) => {
  const dispatch = useAppDispatch();
  const [uploadLoading, setUploadLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(UsernameValidator),
    defaultValues: {
      name: user.username ?? '',
    },
  });

  const queryClient = useQueryClient();

  const { mutate: updateUserMutation, isPending } = useMutation({
    mutationFn: async ({ name, image }: FormData & { image?: string }) => {
      const payload: updateUserPayload = {
        name: user.name as string,
        username: name ?? (user.username as string),
        image: image ?? (user.image as string),
      };
      const data = await UserService.updateUser(payload);

      return data;
    },
    onError: () => {
      toast.error('Something went wrong!');
    },
    onSuccess: (data) => {
      dispatch(
        updateUser({
          user: data.user,
          token: data.token,
        }),
      );

      persistor.persist();

      queryClient.invalidateQueries({
        queryKey: ['user-session'],
      });
      toast.success('User updated!');
    },
  });

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    try {
      const [res] = await uploadFiles('imageUploader', {
        files: [file],
        onUploadBegin: () => {
          setUploadLoading(true);
        },
        onUploadProgress: (val) => {
          setProgress(val.progress);
        },
      });

      const { url } = res;

      updateUserMutation({
        name: user.username as string,
        image: url,
      });

      toast.success('Image uploaded!');
      setUploadLoading(false);
    } catch (err) {
      console.error(err);
      toast.error('Failed to upload image');
      setUploadLoading(false);
    }
  };

  return (
    <form
      className={cn(className)}
      onSubmit={handleSubmit((e) => updateUserMutation(e))}
      {...props}
    >
      <Card>
        <CardHeader>
          <CardTitle>Your Username</CardTitle>
          <CardDescription>
            Please enter display name you are comfortable with.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-8">
          <div className="relative grid gap-1">
            <div className="absolute left-0 top-0 grid h-10 w-8 place-items-center">
              <span className="text-sm text-zinc-400">u/</span>
            </div>
            <Label className="sr-only" htmlFor="name">
              Name
            </Label>
            <Input
              id="name"
              className="w-[400px] pl-6"
              size={32}
              {...register('name')}
            />
            {errors && (
              <p className="px-1 text-xs text-red-600">
                {errors.name?.message}
              </p>
            )}
          </div>
          <div className="relative grid gap-1">
            <div className="flex items-center gap-4">
              <UserAvatar user={user} />
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
                onChange={handleInputChange}
              />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button isLoading={isPending}>Change name</Button>
        </CardFooter>
      </Card>
    </form>
  );
};

export default UserForm;
