import { AvatarProps } from '@radix-ui/react-avatar'

import { Icons } from '@/components/icons'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

interface UserAvatarProps extends AvatarProps {
  user: Pick<User, 'image' | 'name'>
}

export function UserAvatar({ user, ...props }: UserAvatarProps) {
  return (
    <Avatar {...props}>
      {user.image ? (
        <div className='relative aspect-square h-full w-full'>
          <img
            width='100%'
            height='100%'
            src={user.image}
            alt='profile picture'
            referrerPolicy='no-referrer'
            className='min-w-full min-h-full object-cover'
          />
        </div>
      ) : (
        <AvatarFallback>
          <span className='sr-only'>{user?.name}</span>
          <Icons.user className='size-4' />
        </AvatarFallback>
      )}
    </Avatar>
  )
}