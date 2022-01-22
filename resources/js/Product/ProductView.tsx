import React, {useEffect} from 'react';
import Main from '../Main';
import {navigationActiveState} from '../atoms';
import {useSetRecoilState} from 'recoil';

export default function ProductView() {
  const setNavigation = useSetRecoilState(navigationActiveState);
  useEffect(() => {
    setNavigation('Products');
  }, []);

  return (
    <Main>
      <div className="p-6">
        <h1>View Product</h1>
      </div>
    </Main>
  );
}
