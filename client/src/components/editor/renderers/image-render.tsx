function CustomImageRenderer({ data }: any) {
  const src = data.file.url;

  return (
    <div className="relative w-full min-h-[15rem]">
      <img
        alt="image"
        className="object-contain"
        width="100%"
        height="100%"
        src={src}
      />
    </div>
  );
}

export default CustomImageRenderer;
