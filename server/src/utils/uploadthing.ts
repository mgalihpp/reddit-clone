import { createUploadthing, type FileRouter } from 'uploadthing/express';

const f = createUploadthing();

export const uploadRouter = {
  imageUploader: f({
    image: {
      maxFileSize: '4MB',
      maxFileCount: 4,
    },
  })
    .middleware(({ req }) => {
      return { userId: req.user?.id };
    })
    .onUploadComplete((data) => {
      console.log('upload completed', data);
    }),
  videoUploader: f({
    video: {
      maxFileSize: '128MB',
      maxFileCount: 1,
    },
  })
    .middleware(({ req }) => {
      return { userId: req.user?.id };
    })
    .onUploadComplete((data) => {
      console.log('upload video completed', data);
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof uploadRouter;
