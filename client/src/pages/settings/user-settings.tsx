import Loader from '@/components/loader';
import { UserService } from '@/services/userServices';
import { dynamicTitle } from '@/utils/title';
import { useDocumentTitle } from '@mantine/hooks';
import React, { Suspense } from 'react';

const UserForm = React.lazy(() => import('@/components/user-form'));

const UserSettings = () => {
  const user = UserService.useAuth();

  //   dynamic title
  useDocumentTitle(dynamicTitle(`${user?.name} Settings`));

  return (
    <div className="mx-auto py-12">
      <div className="grid items-start gap-8">
        <h1 className="text-3xl font-bold md:text-4xl">Settings</h1>

        <div className="grid gap-10">
          <Suspense fallback={<Loader />}>
            <UserForm user={user as User} />
          </Suspense>
        </div>
      </div>
    </div>
  );
};

export default UserSettings;
