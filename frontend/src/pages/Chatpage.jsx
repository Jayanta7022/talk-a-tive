// import React from 'react'

import { Box } from '@chakra-ui/react';
import { useState } from 'react';
import ChatBox from '../components/ChatBox.jsx';
import MyChat from '../components/MyChat.jsx';
import SideDraw from '../components/miscellaneous/SideDraw';
import { ChatState } from '../context/chatProvider';

function Chatpage() {
  const { user } = ChatState();
  const [fetchAgain, setFetchAgain] = useState(false);
  return (
    <div style={{ width: '100%' }}>
      {user && <SideDraw />}
      <Box
        display="flex "
        justifyContent="space-between"
        w="100%"
        p="10px"
        h="91.5vh"
      >
        {user && <MyChat fetchAgain={fetchAgain} />}
        {user && (
          <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
        )}
      </Box>
    </div>
  );
}

export default Chatpage;
