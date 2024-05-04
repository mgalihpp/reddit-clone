import ReactPlayer from 'react-player/lazy';
import { useLocation } from 'react-router-dom';

interface VideoRendererProps {
  data: {
    file: {
      url: string;
    };
  };
}

const CustomVideoRenderer = ({ data }: VideoRendererProps) => {
  const src = data.file.url;
  const { pathname } = useLocation();
  const preloadValue = pathname.includes('/post') ? 'metadata' : 'none';

  return (
    <ReactPlayer
      url={src}
      width="100%"
      controls
      stopOnUnmount={false}
      config={{
        file: {
          attributes: {
            controlsList: 'nodownload',
            preload: preloadValue,
          },
        },
      }}
    />
  );
};

export default CustomVideoRenderer;
