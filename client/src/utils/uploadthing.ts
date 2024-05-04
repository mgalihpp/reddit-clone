import { generateReactHelpers } from '@uploadthing/react/hooks';

// import type { OurFileRouter } from '@/app/api/uploadthing/core'

export const { uploadFiles } = generateReactHelpers({
  url: `${
    process.env.NODE_ENV === 'development'
      ? 'http://localhost:5000'
      : import.meta.env.VITE_UPLOADTHING_URL
  }/api/uploadthing`,
});
