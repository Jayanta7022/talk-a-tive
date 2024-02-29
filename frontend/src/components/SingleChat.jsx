  import { ArrowBackIcon } from '@chakra-ui/icons';
import {
  Box,
  FormControl,
  IconButton,
  Input,
  Spinner,
  Text,
  useToast,
} from '@chakra-ui/react';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import io from "socket.io-client";
import { getSender, getSenderFull } from '../config/chatLogic';
import { ChatState } from '../context/chatProvider';
import ScrollableChat from './ScrollableChat';
import ProfileModal from './miscellaneous/ProfileModel';
import UpdateGroupChatModel from './miscellaneous/UpdateGroupChatModel';
import "./style.css";
  const ENDPOINT="http://localhost:3000"
  var socket,selectedChatCompare

  const SingleChat = ({ fetchAgain, setFetchAgain }) => {
    const { user, selectedChat, setSelectedChat,notification,setNotification } = ChatState();
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [newMessage, setNewMessage] = useState();
    const[typing,setTyping]=useState();
    const[isTyping,setIstyping]=useState()
    
    const Toast = useToast();
    const[socketConnected,setSocketConnected]=useState(false)
  
    const fetchMessages = async () => {
      if (!selectedChat) return;

      try {
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };

        setLoading(true);

        const { data } = await axios.get(
          `http://localhost:3000/api/message/${selectedChat._id}`,
          config
        );

        setMessages(data);
        // console.log(messages);
        setLoading(false);
        socket.emit('join chat',selectedChat._id)
      } catch (error) {
        Toast({
          title: 'Error Occured!',
          description: 'Failed to Load the Messages',
          status: 'error',
          duration: 5000,
          isClosable: true,
          position: 'bottom',
        });
      }
    };
    useEffect(()=>{
      socket=io(ENDPOINT)
      socket.emit("setup",user)
      socket.on("connection",()=>setSocketConnected(true))
      socket.on("typing",()=>setIstyping(true))
      socket.on("stop typing",()=>setIstyping(false))

    },[])

    useEffect(()=>{
      fetchMessages()
      selectedChatCompare=selectedChat
    },[selectedChat]
    )
    useEffect(() => {
      socket.on("message recieved", (newMessageRecieved) => {
        console.log("messegaeg recieved");
        if (
          !selectedChatCompare || // if chat is not selected or doesn't match current chat
          selectedChatCompare._id !== newMessageRecieved.chat._id
        ) {
          // notificatin

          if (!notification.includes(newMessageRecieved)) {
            setNotification([newMessageRecieved,...notification ]);
            setFetchAgain(!fetchAgain);
          }
        } 
        else{
          setMessages(prevMessages => [...prevMessages, newMessageRecieved]);
        }
      });
    },[]);

    
    const sendMessage = async (e) => {
      if (e.key === 'Enter' && newMessage) {
        socket.emit("stop typing",selectedChat._id)
        try {
          const config = {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${user.token}`,
            },
          };
          setNewMessage('');
          const { data } = await axios.post(
            'http://localhost:3000/api/message/',
            {
              content: newMessage,
              chatId: selectedChat._id,
            },
            config
          );
          console.log("send");
          socket.emit("new message", data);
          setMessages([...messages, data]);
        } catch (error) {
          Toast({
            title: 'Can not send messsage',
            description: error.message,
            duration: 5000,
            status: 'error',
            isClosable: true,
            position: 'bottom',
          });
        }
      }
    };
  
    
    const typingHandler = (e) => {

      setNewMessage(e.target.value);

    if (!socketConnected) return;

    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }
    let lastTypingTime = new Date().getTime();
    var timerLength = 3000;
    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
    };

    return (
      <>
        {selectedChat ? (
          <>
            <Text
              fontSize={{ base: '28px', md: '30px' }}
              pb={3}
              px={2}
              w="100%"
              display="flex"
              fontFamily="work sans"
              alignItems="center"
              justifyContent={{ base: 'space-between' }}
            >
              <IconButton
                display={{ base: 'flex', md: 'none' }}
                icon={<ArrowBackIcon />}
                onClick={() => {
                  setSelectedChat('');
                }}
              />
              {!selectedChat.isGroupChat ? (
                <>
                  {getSender(user, selectedChat.users)}
                  <ProfileModal user={getSenderFull(user, selectedChat.users)} />
                </>
              ) : (
                <>
                  {selectedChat.chatName.toUpperCase()}
                  <UpdateGroupChatModel
                    fetchAgain={fetchAgain}
                    setFetchAgain={setFetchAgain}
                    fetchMessages={fetchMessages}
                  />
                </>
              )}
            </Text>
            <Box
              display="flex"
              flexDir="column"
              justifyContent="flex-end"
              p={3}
              bg="#E8E8E8"
              w="100%"
              h="100%"
              borderRadius="lg"
              overflowY="hidden"
            >
              {/* display messages */}
              {loading ? (
                <Spinner
                  size="xl"
                  alignSelf="center"
                  w={20}
                  h={20}
                  margin="auto"
                />
              ) : (
                
              <div className="messages">
                  <ScrollableChat messages={messages} />
                  
                </div>
                
              )}
              <FormControl onKeyDown={sendMessage} isRequired mt={3}>
                {isTyping?<>typing...</>:<> </>}
                <Input
                  variant="filled"
                  bg="E0E0E0"
                  placeholder="Enter A message "
                  onChange={typingHandler}
                  value={newMessage}
                />
              </FormControl>
            </Box>
          </>
        ) : (
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            h="100%"
          >
            <Text fontSize="3xl" pb={3} fontFamily="work sans">
              Please select a chat to continue chating
            </Text>
          </Box>
        )}
      </>
    );
  };

  export default SingleChat;
