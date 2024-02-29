import { BellIcon, ChevronDownIcon } from '@chakra-ui/icons';
import {
  Avatar,
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Input,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Spinner,
  Text,
  Tooltip,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Effect } from 'react-notification-badge';
import NotificationBadge from 'react-notification-badge/lib/components/NotificationBadge';
import { useHistory } from 'react-router-dom';
import { getSender } from '../../config/chatLogic';
import { ChatState } from '../../context/chatProvider';
import Chatloading from '../Chatloading';
import UserListItem from '../userComponents/UserListItem';
import ProfileModel from './ProfileModel';

const SideDraw = () => {
  const [search, setSearch] = useState('');
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);
  const[loggedUser,setLoggedUser]=useState()
  const { user, setSelectedChat, chats, setChats,notification,setNotification } = ChatState();
  const history = useHistory();

  const Toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem('userInfo')));
  },[]);
  console.log(loggedUser);

  const logOutHandler = () => {
    localStorage.removeItem('userInfo');
    history.push('/');
  };
  const handleSearch = async () => {
    if (!search) {
      Toast({
        title: 'Please enter something in search',
        status: 'warning',
        duration: 5000,
        isClosable: true,
        position: 'top-left',
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
      const { data } = await axios.get(
        `http://localhost:3000/api/user?search=${search}`,
        config
      );

      setLoading(false);
      setSearchResult(data);
      console.log(searchResult);
    } catch (error) {
      Toast({
        title: "can't find the user",
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top-left',
      });
      return;
    }
  };
  const accessChat = async (userId) => {
    try {
      setLoadingChat(true);
      const config = {
        headers: {
          'Content-type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.post(
        `http://localhost:3000/api/chat`,
        { userId },
        config
      );

      if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
      setSelectedChat(data);
      setLoadingChat(false);
      onClose();
    } catch (error) {
      Toast({
        title: 'Error fetching chat',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'bottom-left',
      });
    }
  };

  return (
    <>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        bg="white"
        w="100%"
        p="5 10 5 10"
        borderWidth="5px"
      >
        <Tooltip label="search User to chat" hasArrow placement="bottom-end">
          <Button variant="ghost" onClick={onOpen}>
            <i className="fas fa-search"></i>
            <Text display={{ base: 'none', md: 'flex' }} px="4">
              Search User
            </Text>
          </Button>
        </Tooltip>
        <Text fontSize="2xl" fontFamily="work-sans">
          Talk-a-tive
        </Text>
        <div>
          <Menu>
            <MenuButton p={1}>
              <NotificationBadge
              count={notification.length}
              effect={Effect.SCALE}
              />
              <BellIcon fontSize="2xl" m={1} />
            </MenuButton>
            <MenuList>
              {!notification.length &&" No new message"}
              {notification.map((notif) => (
                <MenuItem
                  key={notif._id}
                  onClick={() => {
                    setSelectedChat(notif.chat);
                    setNotification(notification.filter((n) => n !== notif));
                  }}
                >
                  {console.log(loggedUser)}
                  {console.log(getSender(loggedUser, notif.chat.users)+"   user:"+loggedUser.name+"  all users:"+notif.chat.users)}
                  {notif.chat.isGroupChat
                    ? `New Message in ${notif.chat.chatName}`
                    : `New Message from ${getSender(loggedUser, notif.chat.users)}`}
                    
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
          <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
              <Avatar
                size="sm"
                cursor="pointer"
                name={user.name}
                src={user.picture}
              />
            </MenuButton>
            <MenuList>
              <ProfileModel user={user}>
                <MenuItem>My Profile</MenuItem>
              </ProfileModel>

              <MenuDivider />
              <MenuItem onClick={logOutHandler}>Log Out</MenuItem>
            </MenuList>
          </Menu>
        </div>
      </Box>
      <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth="1px"> Search User</DrawerHeader>

          <DrawerBody>
            <Box display="flex" pb={2}>
              <Input
                placeholder="Search by name or email"
                mr={2}
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                }}
              />
              <Button onClick={handleSearch}>Search </Button>
            </Box>
            {loading ? (
              <Chatloading />
            ) : (
              searchResult?.map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => accessChat(user._id)}
                />
              ))
            )}
            {loadingChat && <Spinner ml="auto" display="flex" />}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default SideDraw;
