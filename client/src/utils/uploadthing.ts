import { generateReactHelpers } from '@uploadthing/react/hooks'

// import type { OurFileRouter } from '@/app/api/uploadthing/core'

export const { uploadFiles } = generateReactHelpers({
    url: 'https://reddit-clone-server-umber.vercel.app/api/uploadthing',
})