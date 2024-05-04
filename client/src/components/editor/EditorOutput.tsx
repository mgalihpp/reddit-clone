import CustomCodeRenderer from '@/components/editor/renderers/code-render';
import CustomImageRenderer from '@/components/editor/renderers/image-render';
import CustomVideoRenderer from '@/components/editor/renderers/video-render';
import CustomListRender from '@/components/editor/renderers/list-render';
import CustomTableRender from './renderers/table-render';
import { FC } from 'react';

import Output from 'editorjs-react-renderer';

interface EditorOutputProps {
  content: any;
}

const renderers = {
  header: ({ data }: { data: { text: string } }) => (
    <h2 className="text-lg font-medium">{data.text}</h2>
  ),
  image: CustomImageRenderer,
  code: CustomCodeRenderer,
  video: CustomVideoRenderer,
  list: CustomListRender,
  table: CustomTableRender,
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
