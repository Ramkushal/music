import { Box, Fab, IconButton, InputAdornment, Stack, TextField, Tooltip } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { styled, useTheme } from "@mui/material/styles";
import { LinkSimple, PaperPlaneTilt, Smiley,Camera, File, Image, Sticker, User } from 'phosphor-react';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import { useMessageContext } from './MessageContext';
import { ChatState } from '../../contexts/chatProvider';
import axios from 'axios';
import { io } from 'socket.io-client';

const ENDPOINT = "http://localhost:5000"; // "https://talk-a-tive.herokuapp.com"; -> After deployment
var socket;

const StyledInput = styled(TextField)(({ theme }) => ({
    "& .MuiInputBase-input": {
      paddingTop: '12px',
      paddingBottom: '12px',
    }  
  }));

  const Actions = [
    {
        color:'#4da5fe',
        icon: <Image size={24}/>,
        y:102,
        title:'Photo/Video'
    },
    {
        color:'#1b8cfe',
        icon: <Sticker size={24}/>,
        y:172,
        title:'Stickers'
    },
    {
        color:'#0172e4',
        icon: <Camera size={24}/>,
        y:242,
        title:'Image'
    },
    {
        color:'#0159b2',
        icon: <File size={24}/>,
        y:312,
        title:'Document'
    },
    {
        color:'#013f7f',
        icon: <User size={24}/>,
        y:382,
        title:'Contact'
    }
  ];

const ChatInput = ({setOpenPicker, onInputChange}) =>{
    const [openAction, setOpenAction] = useState(false);
    const [inputValue, setInputValue] = useState(''); 
    const handleInputChange = (event) => {
        const value = event.target.value;
        setInputValue(value);
        onInputChange(value); 
    };
    return (
        <StyledInput fullWidth placeholder='Write a message...' variant='filled' 
        value={inputValue}
        onChange={handleInputChange}
        InputProps={{
            disableUnderline: true,
            startAdornment: 
            <Stack sx={{width:'max-content'}}>
                <Stack sx={{position:'relative', display: openAction ? 'inline-block' : 'none'}}>
                    {Actions.map((el)=>(
                        <Tooltip placement='right' title={el.title}>
                            <Fab sx={{position:'absolute', top: -el.y, backgroundColor: el.color}}>
                                {el.icon}
                            </Fab>
                        </Tooltip>
                      
                    ))}
                </Stack>
                <InputAdornment>
                    <IconButton onClick={()=>{
                        setOpenAction((prev)=>!prev)
                    }}>
                        <LinkSimple/>
                    </IconButton>
                </InputAdornment>
            </Stack>
            ,
            endAdornment: <InputAdornment>
            <IconButton onClick={()=>{
                setOpenPicker((prev)=> !prev);
            }}>
                <Smiley/>
            </IconButton>
            </InputAdornment>
        }}/>
    )
}

const Footer = () => {
    const theme = useTheme();
    const [openPicker, setOpenPicker] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const {messages ,setMessages ,setIsTyping, setSocketConnected} = useMessageContext();
    const { selectedChat, user, notification, setNotification } =
      ChatState();
    const handleInputChange = (value) => {
        setInputValue(value);
    };
    const sendMessage = async () => {
        if (inputValue) {
        socket.emit("stop typing", selectedChat._id);
        try {
            const config = {
            headers: {
                "Content-type": "application/json",
                Authorization: `Bearer ${user.token}`,
            },
            };
            setInputValue("");
            const { data } = await axios.post(
            "/api/message",
            {
                content: inputValue,
                chatId: selectedChat,
            },
            config
            );
            socket.emit("new message", data);
            console.log(data);
            setMessages([...messages, data]);
        } catch (error) {
            console.log(error);
        }
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

  return (
    <Box p={2} sx={{ width:'100%', backgroundColor: theme.palette.mode === 'light' ? '#F8FAFF' :
     theme.palette.background.paper, boxShadow:'0px 0px 2px rgba(0,0,0,0.25)'}}>
    <Stack direction='row' alignItems={'center'} spacing={3}>

        <Stack sx={{width:'100%'}}> 
             {/* Chat Input */}
            <Box sx={{ display: openPicker ? 'inline' : 'none' , zIndex:10, position:'fixed',bottom:81, right:100}}>
                <Picker theme={theme.palette.mode} data={data} onEmojiSelect={console.log}/>
            </Box> 
            <ChatInput setOpenPicker={setOpenPicker} onInputChange={handleInputChange}/>
        </Stack>
        
        <Box sx={{height:48, width: 48, backgroundColor:theme.palette.primary.main, 
        borderRadius: 1.5}}>
            <Stack sx={{height:'100%', width:'100%', alignItems:'center', justifyContent:'center'}}>
                <IconButton onClick={sendMessage}>
                    <PaperPlaneTilt color='#fff'/>
                </IconButton>
            </Stack>
            
        </Box>
    </Stack>
</Box>
  )
}

export default Footer