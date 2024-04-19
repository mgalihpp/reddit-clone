import { useAppSelector } from "@/hooks";
import { getCurrentUser } from "@/reducers/authReducer";

export const UserService = {
  fetchUsers: async () => {
    // Implement fetching users logic here
  },

  fetchSession: async () => {
    // Implement fetching session logic here
  },

  useAuth: (): User | null => {
    const user = useAppSelector(getCurrentUser);
    return user;
  },
};
