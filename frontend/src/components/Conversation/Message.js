import { Box, Stack } from '@mui/material'
import React, { useEffect, useState } from 'react';
import {Chat_History} from '../../data'
import { DocMsg, LinkMsg, MediaMsg, ReplyMsg, TextMsg, TimeLine } from './MsgTypes';
import io from "socket.io-client";
import { ChatState } from '../../contexts/chatProvider';
import axios from 'axios';
import { useMessageContext } from './MessageContext';

const ENDPOINT = "http://localhost:5000"; // "https://talk-a-tive.herokuapp.com"; -> After deployment
var socket, selectedChatCompare;

const Message = ({menu , fetchAgain, setFetchAgain}) => {
    const [loading, setLoading] = useState(false);
    const { selectedChat, setSelectedChat, user, notification, setNotification } =
      ChatState();
    const {messages, setMessages ,newMessage ,setNewMessage ,socketConnected ,setSocketConnected ,typing ,setTyping ,istyping ,setIsTyping} = useMessageContext();
    
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
          `/api/message/${selectedChat._id}`,
          config
        );
        setMessages(data);

        if (messages!==[]){
            setLoading(false);
        }

        socket.emit("join chat", selectedChat._id);

      } catch (error) {
        console.log(error)
      }
    };
    useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));

    // eslint-disable-next-line
  }, []);
  useEffect(() => {
    fetchMessages();

    selectedChatCompare = selectedChat;
    // eslint-disable-next-line
  }, [selectedChat]);

  useEffect(() => {
    socket.on("message recieved", (newMessageRecieved) => {
      if (
        !selectedChatCompare || // if chat is not selected or doesn't match current chat
        selectedChatCompare._id !== newMessageRecieved.chat._id
      ) {
        if (!notification.includes(newMessageRecieved)) {
          setNotification([newMessageRecieved, ...notification]);
          setFetchAgain(!fetchAgain);
        }
      } else {
        setMessages([...messages, newMessageRecieved]);
      }
    });
  });
  return (
    <Box p={3}>
      {loading ? (
              console.log("loading..")
            ) : (
        <Stack spacing={3}>
            {messages.map((el)=>{
                switch (el.type) {
                    case 'divider':
                      return <TimeLine el={el}/>
                        
                    case 'msg':
                        switch (el.subtype) {
                            case 'img':
                              return <MediaMsg el={el} menu={menu}/>
                            case 'doc':
                                return <DocMsg el={el} menu={menu}/>
                                
                            case 'link':
                                return <LinkMsg el={el} menu={menu}/>
                            case 'reply':
                                return <ReplyMsg el={el} menu={menu}/>
                        
                            default:
                               return <TextMsg el={el} menu={menu}/>
                        }
                        break;
                
                    default:
                      return <></>;
                }
            })}
        </Stack>
        )}
    </Box>
  )
}

export default Message

