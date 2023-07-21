import { Avatar, Badge, Box, Stack, Typography } from '@mui/material';
import {useTheme , styled} from '@mui/material/styles';
import StyledBadge from './StyledBadge';
import { ChatState } from '../contexts/chatProvider';

//single chat element
const ChatElement = ({ _id, chatName, img, msg, time, online, unread }) => {
    const theme = useTheme();
    const { selectedChat, setSelectedChat} = ChatState();
    return (
      <Box sx={{
        width: "100%",
        borderRadius: 1,
        backgroundColor: theme.palette.mode === 'light'? "#fff" : theme.palette.background.default
      }}
      onClick={() => setSelectedChat({ _id, chatName, img, msg, time, online, unread })}
        p={2}>
          {console.log(selectedChat)}
        <Stack direction="row" alignItems='center' justifyContent='space-between'>
          <Stack direction='row' spacing={2}>
            {online ? <StyledBadge overlap='circular' anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              variant="dot">
            <Avatar src={img} />
            </StyledBadge> : <Avatar src={img} /> }
            <Stack spacing={0.3}>
              <Typography variant='subtitle2'>
                {chatName}
              </Typography>
              <Typography variant='caption'>
                {msg}
              </Typography>
            </Stack>
            </Stack>
            <Stack spacing={2} alignItems='center'>
              <Typography sx={{fontWeight:600}} variant='caption'>
                {time}
              </Typography>
              <Badge color='primary' badgeContent={unread}>
              </Badge>
            </Stack>
        </Stack>
      </Box>
    )
  };

  export default ChatElement