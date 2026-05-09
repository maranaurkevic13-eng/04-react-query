import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './components/App/App';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import 'modern-normalize';

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>
);