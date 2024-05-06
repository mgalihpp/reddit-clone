interface ListRenderProps {
  data: {
    items: string[];
    style: string;
  };
}

function CustomListRender({ data }: ListRenderProps) {
  const items = data?.items;
  const style = data?.style;
  const ListComponent = style === 'ordered' ? 'ol' : 'ul';
  const listDiscClass = ListComponent === 'ul' ? 'list-disc' : '';
  const listDecimalClass = ListComponent === 'ol' ? 'list-decimal' : '';

  return (
    <ListComponent className="ml-8 text-sm">
      {items.map((item, index) => (
        <li
          key={index}
          className={`last:mb-2 ${listDiscClass} ${listDecimalClass}`}
          dangerouslySetInnerHTML={{
            __html: item.replace(/<br>/g, '\n'),
          }}
        />
      ))}
    </ListComponent>
  );
}

export default CustomListRender;
