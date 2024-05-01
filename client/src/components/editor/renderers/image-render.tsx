function CustomImageRenderer({ data }: any) {
  const src = data.file.url;

  return (
    <div className="relative w-full max-h-96">
      <img
        alt="image"
        className="object-contain"
        width="384px"
        height="384px"
        loading="lazy"
        src={src}
      />
    </div>
  );
}

export default CustomImageRenderer;
