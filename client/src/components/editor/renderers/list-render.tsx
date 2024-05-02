import { cn } from '@/lib/utils';

function CustomListRender({ data }: any) {
  const items = data?.items;
  const style = data?.style;
  const ListComponent = style === 'ordered' ? 'ol' : 'ul';

  return (
    <ListComponent className="ml-8 text-sm">
      {items.map((item: any, index: number) => (
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
