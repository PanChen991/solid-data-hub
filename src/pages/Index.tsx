import { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Dashboard } from '@/components/pages/Dashboard';
import { Documents } from '@/components/pages/Documents';
import { IntelligencePage } from '@/components/pages/Intelligence';
import { AIAssistant } from '@/components/pages/AIAssistant';
import { Organization } from '@/components/pages/Organization';

const Index = () => {
  const [currentPage, setCurrentPage] = useState('dashboard');

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard onNavigate={setCurrentPage} />;
      case 'documents':
        return <Documents />;
      case 'intelligence':
        return <IntelligencePage />;
      case 'assistant':
        return <AIAssistant />;
      case 'organization':
        return <Organization />;
      default:
        return <Dashboard onNavigate={setCurrentPage} />;
    }
  };

  return (
    <AppLayout currentPage={currentPage} onNavigate={setCurrentPage}>
      {renderPage()}
    </AppLayout>
  );
};

export default Index;
