import { cn } from '@/lib/utils';
import { UsernameValidator } from '@/lib/validators/user';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import React from 'react';
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
import { Button } from '@/components/ui/button';
import { UserService } from '@/services/userServices';
import { updateUserPayload } from '@/types/user';
import { toast } from 'react-toastify';
import { useAppDispatch } from '@/hooks';
import { updateUser } from '@/reducers/authReducer';
import { persistor } from '@/store';

interface UserFormProps extends React.HTMLAttributes<HTMLFormElement> {
  user: Pick<User, 'username' | 'name' | 'image'>;
}

type FormData = z.infer<typeof UsernameValidator>;

const UserForm: React.FC<UserFormProps> = ({ user, className, ...props }) => {
  const dispatch = useAppDispatch();
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
    mutationFn: async ({ name }: FormData) => {
      const payload: updateUserPayload = {
        name: user.name as string,
        username: name ?? (user.username as string),
        image: user.image as string,
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

        <CardContent>
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
        </CardContent>
        <CardFooter>
          <Button isLoading={isPending}>Change name</Button>
        </CardFooter>
      </Card>
    </form>
  );
};

export default UserForm;
