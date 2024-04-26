import { useAppDispatch, useAppSelector } from '@/hooks';
import { apiInstance } from '@/lib/axios';
import { getCurrentUser, resetState } from '@/reducers/authReducer';
import type { updateUserPayload } from '@/types/user';
import token from '@/utils/token';
import { useQuery } from '@tanstack/react-query';

export const UserService = {
  fetchUsers: async () => {
    // Implement fetching users logic here
  },

  getSession: (): Session => {
    const persistedStateString = sessionStorage.getItem('persist:user');
    const session = (
      persistedStateString ? JSON.parse(persistedStateString) : null
    ) as Session;

    return session;
  },

  useSession: (): User | null | undefined => {
    const dispatch = useAppDispatch();
    // fetching session
    const {
      data: user,
      isLoading,
      isFetching,
    } = useQuery({
      queryKey: ['user-session'],
      queryFn: async () => {
        const { data } = await apiInstance.get<User>(
          '/api/users',
          token.authorization(),
        );

        return data;
      },
      retry: false,
    });

    if (!isLoading && !isFetching && !user) {
      // Reset authentication state
      dispatch(resetState());
      return null;
    }

    return user;
  },

  useAuth: (): User | null => {
    const user = useAppSelector(getCurrentUser);
    return user;
  },

  // U for fix rules of hooks
  updateUser: async (payload: updateUserPayload) => {
    // Implement updating user logic here
    // const dispatch = useAppDispatch();

    // dispatch(updateUser(payload));

    const { data } = await apiInstance.put<{ user: User; token: string }>(
      '/api/users',
      payload,
      token.authorization(),
    );

    // persistor.persist();
    return data;
  },
};
