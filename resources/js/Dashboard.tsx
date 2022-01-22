import * as React from 'react';
import Main from './Main';
import PageHeader from './components/PageHeader';

export default function Dashboard() {

  return (
    <Main>
      <div className="p-6">
        <PageHeader text="Dashboard" />
        <div className="py-4">
          <div className="border-4 border-dashed border-gray-200 rounded-lg h-96" />
        </div>
      </div>
    </Main>
  );
}
