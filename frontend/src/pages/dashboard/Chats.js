import { Box, IconButton, Stack, Typography, InputBase, Button, Divider, Avatar, Badge } from
  '@mui/material'
import { ArchiveBox, CircleDashed, MagnifyingGlass } from 'phosphor-react';
import {useTheme } from '@mui/material/styles';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { faker } from '@faker-js/faker';
import {chats_list} from '../../data/data';
import { Search, SearchIconWrapper, StyledInputBase } from '../../components/Search';
import ChatElement from '../../components/ChatElement';
import { ChatState } from "../../contexts/chatProvider";
import ChatLoading from "./ChatLoading";

const Chats = ({fetchAgain}) => {
  const theme = useTheme();
  const [loggedUser, setLoggedUser] = useState();
  const { selectedChat, setSelectedChat, user, chats, setChats } = ChatState();
  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        }, 
      };
      const { data } = await axios.get("/api/chat", config);
      setChats(data);
    } catch (error) {
      console.log("error");
    } ;
  };  

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats(); 
    // eslint-disable-next-line
  }, [fetchAgain]);
  return (    
    <Box sx={{ 
      position: "relative", width: 320, 
      backgroundColor: theme.palette.mode === 'light'? "#F8FAFF" : theme.palette.background.paper,
      boxShadow: '0px 0px 2px rgba(0,0,0,0.25)'
    }}>
      <Stack p={3} spacing={2} sx={{height:"100vh"}}>
        <Stack direction="row" alignItems='center' justifyContent='space-between'>
          <Typography variant='h5'>
            Chats
          </Typography>
          <IconButton>
            <CircleDashed />
          </IconButton>
        </Stack>

        <Stack sx={{ width: "100%" }}>
          <Search>
            <SearchIconWrapper>
              <MagnifyingGlass color="#709CE6" />
            </SearchIconWrapper>
            <StyledInputBase placeholder='Search...' inputProps={{ "aria-label": "search" }} />
          </Search>
        </Stack>

        <Stack spacing={1}>
          <Stack direction='row' alignItems='center' spacing={1.5}>
            <ArchiveBox size={24} />
            <Button>
              Archive
            </Button>
          </Stack>
          <Divider />
        </Stack> 
        {chats ? (
        <Stack className='scrollbar' spacing={2} direction='column' sx={{flexGrow:1, overflow:'scroll', height:'100%'}}>
            <Stack spacing={2.4}>
              <Typography variant='subtitle2' sx={{color:"#676767"}}>
                Pinned
              </Typography>
              {chats.filter((el)=> el.pinned).map((el)=>{
                return <ChatElement  {...el}/>
              })} 
            </Stack>
             
          <Stack spacing={2.4}>
            <Typography variant='subtitle2' sx={{color:"#676767"}}>
              All Chats
            </Typography>
            {chats.filter((el)=> !el.pinned).map((el)=>{
              return <ChatElement {...el}/>
            })}
          </Stack>
        </Stack>
        ) : (
            <ChatLoading/>
          )}
      </Stack>

    </Box>
  )
}

export default Chats