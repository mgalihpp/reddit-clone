import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { UserAvatar } from "@/components/user-avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link2 } from "lucide-react";

interface MiniCreatePostProps {
  session: User | null | undefined;
}

const MiniCreatePost: React.FC<MiniCreatePostProps> = ({ session }) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  return (
    <li className="overflow-hidden rounded-md bg-white shadow">
      <div className="flex h-full justify-between gap-6 px-6 py-4">
        <div className="relative">
          <UserAvatar
            user={{
              name: session?.name || null,
              image: session?.image || null,
            }}
          />

          <span className="absolute bottom-0 right-0 size-3 rounded-full bg-green-500 outline outline-2 outline-white" />
        </div>
        <Input
          readOnly
          onClick={() => navigate(pathname + "/submit")}
          placeholder="Create post"
        />
        <Button onClick={() => navigate(pathname + "/submit")} variant="ghost">
          <Link2 className="text-zinc-600" />
        </Button>
      </div>
    </li>
  );
};

export default MiniCreatePost;
