import { useOnClickOutside } from '@/hooks/use-on-click-outside';
import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { SubredditService } from '@/services/subredditServices';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Users } from 'lucide-react';

interface SearchBarProps {}

const SearchBar: React.FC<SearchBarProps> = () => {
  const [input, setInput] = useState('');
  const [filter, setFilter] = useState<Subreddit[]>([]);
  const [isFocused, setIsFocused] = useState(false);
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const commandRef = useRef<HTMLDivElement>(null);

  useOnClickOutside(commandRef, () => {
    setIsFocused(false);
  });

  const { data, isLoading } = useQuery({
    queryKey: ['subreddits'],
    queryFn: async () => await SubredditService.getAllSubreddit(),
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    setFilter(data ?? []);
  }, [data]);

  useEffect(() => {
    setInput('');
    setIsFocused(false);
  }, [pathname]);

  const handleInputChange = (text: string) => {
    setInput(text);
  };

  return (
    <Command
      ref={commandRef}
      className="relative z-50 max-w-lg overflow-visible rounded-lg border"
    >
      <CommandInput
        isLoading={isLoading}
        onValueChange={handleInputChange}
        onClick={() => setIsFocused(true)}
        value={input}
        className="border-none outline-none ring-0 focus:border-none focus:outline-none"
        placeholder="Search Communities..."
      />
      <CommandList className="absolute inset-x-0 top-full max-h-[250px] rounded-b-md bg-white shadow">
        {!isLoading && filter.length === 0 && (
          <CommandEmpty>No results found.</CommandEmpty>
        )}
        {isFocused && (
          <CommandGroup heading="Communities">
            {filter
              .filter((subreddit) =>
                subreddit.name.toLowerCase().includes(input.toLowerCase()),
              )
              .map((subreddit) => (
                <CommandItem
                  onSelect={(e) => navigate(`/r/${e}`)}
                  onClick={() => navigate(`/r/${subreddit.name}`)}
                  key={subreddit.id}
                  value={subreddit.name}
                >
                  <Users className="mr-2 size-4" />
                  <Link to={`/r/${subreddit.name}`}>r/{subreddit.name}</Link>
                </CommandItem>
              ))}
          </CommandGroup>
        )}
      </CommandList>
    </Command>
  );
};

export default SearchBar;
