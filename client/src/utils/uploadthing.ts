import { generateReactHelpers } from '@uploadthing/react/hooks'

// import type { OurFileRouter } from '@/app/api/uploadthing/core'

export const { uploadFiles } = generateReactHelpers({
    url: 'http://localhost:5000/api/uploadthing',
})