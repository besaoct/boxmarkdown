import React from 'react';
import { currentUser, getUserByEmail } from '@/lib/auth';
import SettingsPage from '@/components/settings/UserSettings';

const page = async () => {
  const user = await currentUser();
  const userData = await getUserByEmail(user?.email);


  return (
      <SettingsPage userData={userData}/>
  );
};

export default page;
