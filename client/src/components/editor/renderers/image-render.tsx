interface ImageRendererProps {
  data: {
    file: {
      url: string;
    };
  };
}

function CustomImageRenderer({ data }: ImageRendererProps) {
  const src = data.file.url;

  return (
    <div className="relative max-h-96 w-full my-2">
      <img
        alt="image"
        className="object-contain max-h-96"
        width="384px"
        height="384px"
        loading="lazy"
        src={src}
      />
    </div>
  );
}

export default CustomImageRenderer;
