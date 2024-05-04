import { AvatarProps } from '@radix-ui/react-avatar'

import { Icons } from '@/components/icons'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

interface SubredditAvatarProps extends AvatarProps {
  subbreddit: Pick<Subreddit, 'image' | 'name'>
}

export function SubredditAvatar({ subbreddit, ...props }: SubredditAvatarProps) {
  return (
    <Avatar {...props}>
      {subbreddit.image ? (
        <div className='relative aspect-square h-full w-full'>
          <img
            width='100%'
            height='100%'
            src={subbreddit.image}
            alt='profile picture'
            referrerPolicy='no-referrer'
            className='min-w-full min-h-full object-cover'
          />
        </div>
      ) : (
        <AvatarFallback>
          <span className='sr-only'>{subbreddit?.name}</span>
          <Icons.user className='size-6' />
        </AvatarFallback>
      )}
    </Avatar>
  )
}