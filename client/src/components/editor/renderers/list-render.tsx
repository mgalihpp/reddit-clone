import { cn } from '@/lib/utils';

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

  return (
    <ListComponent className="ml-8 text-sm">
      {items.map((item, index) => (
        <li
          key={index}
          className={cn('last:mb-2', {
            'list-disc': ListComponent === 'ul',
            'list-desimal': ListComponent === 'ol',
          })}
        >
          {item}
        </li>
      ))}
    </ListComponent>
  );
}

export default CustomListRender;
