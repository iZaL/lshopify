import * as React from 'react';
import PageHeader from './components/PageHeader';
import Main from './Main';

export default function Dashboard() {
  return (
    <Main>
      <div className="p-6">
        <PageHeader text="Dashboard" />
        <div className="py-4">
          <div className="h-96 rounded-lg border-4 border-dashed border-gray-200" />
        </div>
      </div>
    </Main>
  );
}
