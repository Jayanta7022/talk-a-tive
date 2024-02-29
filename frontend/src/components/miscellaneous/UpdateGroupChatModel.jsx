import { ViewIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  FormControl,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import axios from 'axios';
import React, { useState } from 'react';
import { ChatState } from '../../context/chatProvider';
import UserBadge from '../userComponents/UserBadge';
import UserListItem from '../userComponents/UserListItem';

const UpdateGroupChatModel = ({ fetchAgain, setFetchAgain,fetchMessages }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { user, selectedChat, setSelectedChat } = ChatState();
  const [groupChatName, setGroupChatName] = useState();
  const [loading, setLoading] = useState();
  const [search, setSearch] = useState();
  const [searchResult, setSearchResult] = useState();
  const Toast = useToast();
  const [renameLoading, setReanameLoading] = useState();
  const handleRemove = async (user1) => {
    if (selectedChat.groupAdmin._id !== user._id  && user1._id !== user._id) {
      Toast({
        title: 'Only admins can remove someone!',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'bottom',
      });
      return;
    }
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        `http://localhost:3000/api/chat/groupremove`,
        {
          chatId: selectedChat._id,
          userId: user1._id,
        },
        config
      );
      user1._id===user._id?setSelectedChat():setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setLoading(false);
    } catch (error) {
      Toast({
        title: 'Error Occured!',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'bottom',
      });
      setLoading(false);
    }
  };
  const handleRename = async () => {
    if (!groupChatName) return;

    try {
      setReanameLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        'http://localhost:3000/api/chat/rename',
        {
          chatId: selectedChat._id,
          chatName: groupChatName,
        },
        config
      );
      setSelectedChat(data);
      
      setFetchAgain(!fetchAgain);
      fetchMessages();
      setReanameLoading(false);
    } catch (error) {
      Toast({
        title: 'error occoured in renaming',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'bottom',
      });
      setReanameLoading(false);
      setGroupChatName('');
      return;
    }
  };
  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) {
      return;
    }
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(
        `http://localhost:3000/api/user?search=${search}`,
        config
      );

      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      Toast({
        title: 'error occured',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'bottom-left',
      });
      setLoading(false);
      return;
    }
  };
  const handleAddUser = async (user1) => {
    if (selectedChat.users.find((u) => u._id === user1._id)) {
      Toast({
        title: 'User already exists in the group',
        duration: 5000,
        status: 'error',
        position: 'bottom',
        isClosable: true,
      });
      return;
    }
    if (selectedChat.groupAdmin._id !== user._id) {
      Toast({
        title: 'Only Admin can add someone ',
        status: 'error',
        duration: 5000,
        position: 'bottom',
        isClosable: true,
      });
      return;
    }
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        `http://localhost:3000/api/chat/groupadd`,
        {
          chatId: selectedChat._id,
          userId: user1._id,
        },
        config
      );

      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setLoading(false);
    } catch (error) {
      Toast({
        title: 'error occured',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'bottom-left',
      });
      setLoading(false);
      return;
    }
  };
  return (
    <>
      <IconButton display="flex" icon={<ViewIcon />} onClick={onOpen} />

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize="35px"
            fontFamily="work sans"
            display="flex"
            justifyContent="center"
          >
            {selectedChat.chatName}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box display="flex" w="100%" flexWrap="wrap" pb={3}>
              {selectedChat.users.map((u) => (
                <UserBadge
                  user={u}
                  key={u._id}
                  handleFunction={() => {
                    handleRemove(u);
                  }}
                />
              ))}
            </Box>
            <FormControl display="flex">
              <Input
                placeholder="Chat Name "
                value={groupChatName}
                mb={2}
                onChange={(e) => setGroupChatName(e.target.value)}
              />
              <Button
                variant="solid"
                colorScheme="teal"
                ml={1}
                isLoading={renameLoading}
                onClick={handleRename}
              >
                Update
              </Button>
            </FormControl>
            <FormControl>
              <Input
                placeholder="Add user to the Group"
                mb={1}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </FormControl>
            {loading ? (
              <Spinner size="lg" />
            ) : (
              searchResult?.map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => handleAddUser(user)}
                />
              ))
            )}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="red" mr={3} onClick={() => handleRemove(user)}>
              Remove
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default UpdateGroupChatModel;
