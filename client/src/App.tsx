import { useState } from 'react';
import { Switch, Route } from 'wouter';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/queryClient';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Navigation } from '@/components/navigation';
import { GalleryPage } from '@/pages/gallery';
import { SubmitPage } from '@/pages/submit';
import { ProfilePage } from '@/pages/profile';
import NotFound from '@/pages/not-found';

function App() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen bg-gray-50">
          <Navigation onSearch={setSearchQuery} />
          <main>
            <Switch>
              <Route path="/" component={() => <GalleryPage searchQuery={searchQuery} />} />
              <Route path="/submit" component={SubmitPage} />
              <Route path="/profile" component={ProfilePage} />
              <Route component={NotFound} />
            </Switch>
          </main>
        </div>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
