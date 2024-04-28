import React, { useCallback, useEffect, useRef, useState } from 'react';
import TextAreaAutoSize from 'react-textarea-autosize';
import EditorJs from '@editorjs/editorjs';
import { useLocation, useNavigate } from 'react-router-dom';
import { uploadFiles } from '@/utils/uploadthing';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { PostCreationRequest, PostValidator } from '@/lib/validators/post';
import { z } from 'zod';
import { toast } from 'react-toastify';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { PostService } from '@/services/postServices';
import { useAppSelector } from '@/hooks';
import { getToken } from '@/reducers/authReducer';

type FormData = z.infer<typeof PostValidator>;

interface EditorProps {
  subredditId: string;
}

const Editor: React.FC<EditorProps> = ({ subredditId }) => {
  const [isMounted, setIsMounted] = useState(false);
  const token = useAppSelector(getToken);

  const queryClient = useQueryClient();

  const ref = useRef<EditorJs>();
  const _titleRef = useRef<HTMLTextAreaElement>(null);

  const navigate = useNavigate();
  const { pathname } = useLocation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(PostValidator),
    defaultValues: {
      subredditId,
      title: '',
      content: null,
    },
  });

  const { mutate: createPost } = useMutation({
    mutationKey: ['create-post'],
    mutationFn: async ({
      title,
      content,
      subredditId,
    }: PostCreationRequest) => {
      const payload: PostCreationRequest = { title, content, subredditId };

      const data = await PostService.createPost(payload);

      return data;
    },
    onError: () => {
      toast.error('Something went wrong!');
    },
    onSuccess: () => {
      const newPathname = pathname.split('/').slice(0, -1).join('/');
      toast.success('Post created!');
      queryClient.invalidateQueries({
        queryKey: ['posts'],
      });
      navigate(newPathname);
    },
  });

  const initializeEditor = useCallback(async () => {
    const EditorJS = (await import('@editorjs/editorjs')).default;
    const Header = (await import('@editorjs/header')).default;
    const Embed = (await import('@editorjs/embed')).default;
    const Table = (await import('@editorjs/table')).default;
    const List = (await import('@editorjs/list')).default;
    const Code = (await import('@editorjs/code')).default;
    const LinkTool = (await import('@editorjs/link')).default;
    const InlineCode = (await import('@editorjs/inline-code')).default;
    const ImageTool = (await import('@editorjs/image')).default;
    const VideoTool = (await import('@weekwood/editorjs-video')).default;

    if (!ref.current) {
      const editor = new EditorJS({
        holder: 'editor',
        onReady() {
          ref.current = editor;
        },
        placeholder: 'Type here to write your post...',
        inlineToolbar: true,
        data: {
          blocks: [],
        },
        tools: {
          header: Header,
          linkTool: {
            class: LinkTool,
            config: {
              endpoint: '/api/link',
            },
          },
          image: {
            class: ImageTool,
            config: {
              uploader: {
                async uploadByFile(files: File) {
                  const [res] = await uploadFiles('imageUploader', {
                    files: [files],
                    headers: {
                      Authorization: `Bearer ${token}`,
                    },
                  });

                  return {
                    success: 1,
                    file: {
                      url: res.url,
                    },
                  };
                },
              },
            },
          },
          video: {
            class: VideoTool,
            config: {
              uploader: {
                async uploadByFile(file: File) {
                  const [res] = await uploadFiles('videoUploader', {
                    files: [file],
                    headers: {
                      Authorization: `Bearer ${token}`,
                    },
                  });
                  return {
                    success: 1,
                    file: {
                      url: res.url,
                    },
                  };
                },
              },
              player: {
                controls: true,
                autoplay: false,
              },
            },
          },
          list: List,
          code: Code,
          inlinecode: InlineCode,
          table: Table,
          embed: Embed,
        },
      });
    }
  }, [token]);

  useEffect(() => {
    if (Object.keys(errors).length) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      for (const [_key, value] of Object.entries(errors)) {
        value;
        toast.error('Something went wrong!');
      }
    }
  }, [errors]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsMounted(true);
    }
  }, []);

  useEffect(() => {
    const init = async () => {
      await initializeEditor();

      setTimeout(() => {
        _titleRef?.current?.focus();
      }, 0);
    };

    if (isMounted) {
      init();

      return () => {
        ref.current?.destroy();
        ref.current = undefined;
      };
    }
  }, [isMounted, initializeEditor]);

  const onSubmit = async (data: FormData) => {
    const blocks = await ref.current?.save();

    const payload: PostCreationRequest = {
      title: data.title,
      content: blocks,
      subredditId: data.subredditId,
    };

    createPost(payload);
  };

  if (!isMounted) {
    return null;
  }

  const { ref: titleRef, ...rest } = register('title');

  return (
    <div className="w-full rounded-lg border border-zinc-200 bg-zinc-50 p-4">
      <form
        id="subreddit-post-form"
        className="w-fit"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="prose prose-stone dark:prose-invert">
          <TextAreaAutoSize
            ref={(e) => {
              titleRef(e);
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              _titleRef.current = e;
            }}
            {...rest}
            placeholder="Title"
            className="w-full resize-none appearance-none overflow-hidden bg-transparent text-5xl font-bold focus:outline-none"
          />
          <div id="editor" className="min-h-[500px]" />
          <p className="text-sm text-gray-500">
            Use{' '}
            <kbd className="rounded-md border bg-muted px-1 text-xs uppercase">
              Tab
            </kbd>{' '}
            to open the command menu.
          </p>
        </div>
      </form>
    </div>
  );
};

export default Editor;
