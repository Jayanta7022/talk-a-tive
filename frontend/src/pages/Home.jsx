// import React from 'react'
import {
  Box,
  Container,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from '@chakra-ui/react';
import { useHistory } from 'react-router-dom';

import { useEffect } from 'react';
import Signup from '../components/Authentication/SignUp';
import Login from '../components/Authentication/login';

function Home() {
  const history = useHistory();
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('userInfo'));
    if (user) {
      history.push('/chats');
    }
  });
  return (
    <Container maxW="xl" centerContent>
      <Box
        d="flex"
        justifyContent="center"
        bg="white"
        p={3}
        w="100%"
        m="40px 0 15px 0"
        borderRadius="lg"
        borderWidth="1px"
        fontFamily="work-sans"
        color="black"
      >
        <Text
          fontSize="4xl"
          fontFamily="work-sans"
          color="black"
          textAlign="center"
        >
          Talk-A-Tive
        </Text>
      </Box>
      <Box bg="white" p={4} w="100%" borderRadius="lg" borderWidth="1px">
        <Tabs variant="soft-rounded">
          <TabList mb="1em">
            <Tab width="50%">Login</Tab>
            <Tab width="50%">Sign-Up</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Login />
            </TabPanel>
            <TabPanel>
              <Signup />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  );
}

export default Home;
