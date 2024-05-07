import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { SORT_OPTIONS } from '@/constants/sort';
import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

const Sort = () => {
  const [filter, setFilter] = useState<FilterProps>({
    sort: 'none',
  });

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="subtle" className="rounded-full text-gray-600 bg-transparent hover:bg-zinc-200/50" size="xs">
          Sort
          <ChevronDown className="text-grey-3 group-hover:text-gray-600 -mr-1 ml-1 size-4 flex-shrink-0" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="center" className="p-0">
        {SORT_OPTIONS.map((option) => (
          <button
            key={option.name}
            className={cn(
              'block w-full px-4 py-2 text-left text-sm hover:bg-gray-100',
              {
                'bg-gray-100 text-gray-900': option.value === filter.sort,
                'text-gray-500': option.value !== filter.sort,
              },
            )}
            onClick={() => {
              setFilter((prev) => ({
                ...prev,
                sort: option.value,
              }));
            }}
          >
            {option.name}
          </button>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default Sort;
