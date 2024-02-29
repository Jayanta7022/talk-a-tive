import {
  Box,
  Button,
  FormControl,
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
import { useState } from 'react';
import { ChatState } from '../../context/chatProvider';
import UserBadge from '../userComponents/UserBadge';
import UserListItem from '../userComponents/UserListItem';

const GroupChatModel = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [groupChatName, setGroupChatName] = useState();
  const [selectedUser, setSelectedUser] = useState([]);
  const [search, setSearch] = useState('');
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const Toast = useToast();
  const { user, chats, setChats } = ChatState();
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
    }
  };
  const handleSubmit = async () => {
    if (!groupChatName || !selectedUser) {
      Toast({
        title: 'Please add all the feilds',
        status: 'warning',
        duration: '5000',
        isClosable: true,
        position: 'top',
      });
      return;
    }
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post(
        `http://localhost:3000/api/chat/group`,
        {
          name: groupChatName,
          users: JSON.stringify(selectedUser.map((u) => u._id)),
        },
        config
      );
      setChats([data, ...chats]);
      onClose();
      Toast({
        title: 'Group successfully created',
        status: 'success',
        duration: '5000',
        isClosable: true,
        position: 'top',
      });
    } catch (error) {
      Toast({
        title: 'Error occoured',
        description: error.message,
        status: 'error',
        duration: '5000',
        isClosable: true,
        position: 'top',
      });
    }
  };
  const handleGroup = (userToAdd) => {
    if (selectedUser.includes(userToAdd)) {
      Toast({
        title: 'user aleardy exist',
        status: 'warning',
        duration: '5000',
        isClosable: true,
        position: 'top',
      });
      return;
    }
    setSelectedUser([...selectedUser, userToAdd]);
  };
  const deleteUserHandler = (u) => {
    setSelectedUser(selectedUser.filter((sel) => sel._id !== u._id));
  };
  return (
    <>
      <span onClick={onOpen}>{children}</span>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize="35px"
            fontFamily="work-sans"
            display="flex"
            justifyContent="center"
          >
            Create Group Chat
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody display="flex" flexDir="column" alignItems="center">
            <FormControl>
              <Input
                placeholder="Chat Name"
                mb={3}
                onChange={(e) => {
                  setGroupChatName(e.target.value);
                }}
              />
            </FormControl>

            <FormControl>
              <Input
                placeholder="Add Users"
                mb={3}
                onChange={(e) => {
                  handleSearch(e.target.value);
                }}
              />
            </FormControl>
            <Box display="flex" w="100%" flexWrap="wrap">
              {selectedUser.map((u) => (
                <UserBadge
                  key={u._id}
                  user={u}
                  handleFunction={() => {
                    deleteUserHandler(u);
                  }}
                />
              ))}
            </Box>
            {loading ? (
              <Spinner ml="auto" display="flex" />
            ) : (
              searchResult
                .slice(0, 4)
                .map((user) => (
                  <UserListItem
                    key={user._id}
                    user={user}
                    handleFunction={() => handleGroup(user)}
                  />
                ))
            )}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={() => handleSubmit()}>
              Create Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default GroupChatModel;
