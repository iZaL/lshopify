import React, {useEffect} from 'react';
import Main from '../Main';
import {navigationActiveState} from '../atoms';
import {useSetRecoilState} from 'recoil';

interface Props {
  data: {product: object};
}

export default function ProductView({}: Props) {
  const setNavigation = useSetRecoilState(navigationActiveState);
  useEffect(() => {
    setNavigation('Products');
  }, []);

  return (
    <Main>
      <div className='p-6'>
        <h1>View Product</h1>
      </div>
    </Main>
  );
}
