interface CodeRendererProps {
  data: { code: string };
}

function CustomCodeRenderer({ data }: CodeRendererProps) {
  return (
    <pre className="max-w-lg rounded-md bg-gray-800 p-4">
      <code className="text-sm text-gray-100">{data.code}</code>
    </pre>
  );
}

export default CustomCodeRenderer;
