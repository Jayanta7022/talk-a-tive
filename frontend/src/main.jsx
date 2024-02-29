import { ChakraProvider } from '@chakra-ui/react';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import ChatProvider from './context/chatProvider.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  
    <BrowserRouter>
    <ChatProvider>
      <ChakraProvider>
        <App />
      </ChakraProvider>
      </ChatProvider>
    </BrowserRouter>
  
);
