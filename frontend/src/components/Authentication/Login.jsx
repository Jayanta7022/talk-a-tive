// import React from 'react';

import {
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  VStack,
  useToast,
} from '@chakra-ui/react';
import axios from 'axios';
import { useState } from 'react';
import { useHistory } from 'react-router-dom';
function login() {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [show, setShow] = useState(false);
  const Toast = useToast();
  const [loading, setLoading] = useState();
  const history = useHistory();

  const handleClick = async () => {
    setLoading(true);
    if (!email || !password) {
      Toast({
        title: 'Please Feild all Feilds',
        status: 'warning',
        duration: 5000,
        isClosable: true,
        position: 'bottom',
      });
      setLoading(false);
      return;
    }
    try {
      const config = {
        headers: { 'content-type': 'application/json' },
      };

      const { data } = await axios.post(
        'http://localhost:3000/api/user/login',
        { email, password },
        config
      );
      Toast({
        title: 'Login SuccessFull',
        status: 'success',
        duration: 5000,
        isClosable: true,
        position: 'bottom',
      });
      localStorage.setItem('userInfo', JSON.stringify(data));
      setLoading(false);
      history.push('/chats');
    } catch (error) {
      Toast({
        title: 'Login unuccessFull',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'bottom',
      });
      setLoading(false);
    }
  };
  return (
    <VStack spacing="5px">
      <FormControl id="email" isRequired>
        <FormLabel>Email</FormLabel>
        <Input
          placeholder="Enter Your Email"
          onChange={(e) => {
            setEmail(e.target.value);
          }}
        />
      </FormControl>
      <FormControl id="password" isRequired>
        <FormLabel> Confirm Password</FormLabel>
        <InputGroup>
          <Input
            placeholder="Enter Your Password"
            type={show ? 'text' : 'password'}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
          <InputRightElement width="4.5rem">
            <Button
              h="1.75rem"
              size="sm"
              onClick={() => {
                setShow((prev) => !prev);
              }}
            >
              {show ? 'Hide' : 'Show'}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>

      <Button
        colorScheme="blue"
        width="100%"
        style={{ marginTop: 15 }}
        onClick={handleClick}
        isLoading={loading}
      >
        Log In
      </Button>
    </VStack>
  );
}

export default login;
