import CustomCodeRenderer from '@/components/editor/renderers/code-render';
import CustomImageRenderer from '@/components/editor/renderers/image-render';
import CustomVideoRenderer from '@/components/editor/renderers/video-render';
import { FC } from 'react';

import Output from 'editorjs-react-renderer';

interface EditorOutputProps {
  content: any;
}

const renderers = {
  image: CustomImageRenderer,
  code: CustomCodeRenderer,
  video: CustomVideoRenderer,
};

const style = {
  paragraph: {
    fontSize: '0.875rem',
    lineHeight: '1.25rem',
  },
};

const EditorOutput: FC<EditorOutputProps> = ({ content }) => {
  return (
    <Output
      style={style}
      className="text-sm"
      renderers={renderers}
      data={content}
    />
  );
};

export default EditorOutput;
