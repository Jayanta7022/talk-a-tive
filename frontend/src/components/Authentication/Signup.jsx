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

const Signup = () => {
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [confirmPassword, setCofirmPassword] = useState();
  const [picture, setPicture] = useState();
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const Toast = useToast();
  const history = useHistory();

  const postDetails = async (pic) => {
    setLoading(true);
    if (pic == undefined) {
      Toast({
        title: 'Please select an Item',
        status: 'warning',
        duration: 5000,
        isClosable: true,
        position: 'bottom',
      });
      return;
    }
    if (pic.type === 'image/jpeg' || pic.type === 'image/png') {
      const data = new FormData();
      data.append('file', pic);
      data.append('upload_preset', 'chat-app');
      data.append('coloud_name', 'dzjf0vl1u');
      fetch(`https://api.cloudinary.com/v1_1/dzjf0vl1u/image/upload`, {
        method: 'POST',
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          setPicture(data.url.toString());
          console.log(data.url.toString());
          setLoading(false);
        });
    } else {
      Toast({
        title: 'Please select an Item',
        status: 'warning',
        duration: 5000,
        isClosable: true,
        position: 'bottom',
      });
      setLoading(false);
      return;
    }
  };
  const submitHandler = async () => {
    setLoading(true);
    if (!name || !email || !password || !confirmPassword) {
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
    if (password !== confirmPassword) {
      Toast({
        title: 'Password Do Not Match',
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
        headers: {
          'content-type': 'application/json',
        },
      };

      const { data } = await axios.post(
        'http://localhost:3000/api/user',
        {
          name,
          email,
          password,
          picture,
        },
        config
      );
      Toast({
        title: 'Regestration Successfull',
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
        title: 'Error occoured',
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
      <FormControl id="first-name" isRequired>
        <FormLabel>Name</FormLabel>
        <Input
          placeholder="Enter Your Name"
          onChange={(e) => {
            setName(e.target.value);
          }}
        />
      </FormControl>
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
        <FormLabel> Password</FormLabel>
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
      <FormControl id="confirm-password" isRequired>
        <FormLabel> Confirm Password</FormLabel>
        <InputGroup>
          <Input
            placeholder="Confirm Your Password"
            type={show ? 'text' : 'password'}
            onChange={(e) => {
              setCofirmPassword(e.target.value);
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
      <FormControl id="picture" isRequired>
        <FormLabel>Picture</FormLabel>
        <Input
          placeholder="Enter Your Profile Pic"
          type="file"
          p="1.5"
          accept="image"
          onChange={(e) => {
            postDetails(e.target.files[0]);
          }}
        />
      </FormControl>

      <Button
        colorScheme="blue"
        width="100%"
        style={{ marginTop: 15 }}
        onClick={submitHandler}
        isLoading={loading}
      >
        Sign Up
      </Button>
    </VStack>
  );
};

export default Signup;
