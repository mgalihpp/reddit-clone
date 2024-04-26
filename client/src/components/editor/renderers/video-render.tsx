import ReactPlayer from 'react-player/lazy';
import { useLocation } from 'react-router-dom';

const CustomVideoRenderer = ({ data }: any) => {
  const src = data.file.url;
  const { pathname } = useLocation();
  const preloadValue = pathname.includes('/post') ? "metadata" : "none"

  console.log(pathname)
  console.log(pathname.includes('/post'))
    // pathname === '/' || pathname === '/home'
    //   ? 'none'
    //   : pathname.startsWith('/post')
    //     ? 'metadata'
    //     : 'auto';

  return (
    <ReactPlayer
      url={src}
      width='100%'
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
