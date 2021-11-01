import * as React from 'react';
import Main from './Main';
import {useSetRecoilState} from 'recoil';
import {navigationActiveState} from './atoms';
import PageHeader from './components/PageHeader';

export default function Dashboard() {
  const setNavigation = useSetRecoilState(navigationActiveState);

  React.useEffect(() => {
    setNavigation('Home');
  }, []);

  return (
    <Main>
      <div className='p-6'>
        <PageHeader text='Dashboard' />
        <div className='py-4'>
          <div className='border-4 border-dashed border-gray-200 rounded-lg h-96' />
        </div>
      </div>
    </Main>
  );
}
