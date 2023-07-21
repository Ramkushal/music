import { faker } from "@faker-js/faker";
const chats_list = [
  {
    _id:"617a077e18c25468bc7c4dd4",
    img: faker.image.avatar(),
    chatName: "Piyush",
    msg: faker.music.songName(),
    time: "9:36",
    unread: 3,
    pinned: true,
    online: true,
    users: [
      {
        firstName: "Ram kushal",
        email: "ramkushalreddy@gmail.com",
      },
      {
        name: "Piyush",
        email: "19311a0473@sreenidhi.edu.in",
      },
    ],
  },
  {
    _id:"617a077e18c25468bc8c4dd4",
    img: faker.image.avatar(),
    chatName: "Ram kushal",
    msg: faker.music.songName(),
    time: "9:36",
    unread: 3,
    pinned: true,
    online: true,
    users: [
      {
        firstName: "Piyush",
        email: "19311a0473@sreenidhi.edu.in",
      },
      {
        name: "Ram kushal",
        email: "ramkushalreddy@gmail.com",
      },
    ],
  },
];
export {chats_list};