const users = [
  {
    username: "luka92",
    profilePicture:
      "https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?cs=srgb&dl=pexels-stefan-stefancik-91227.jpg&fm=jpg",
    userPosts: 12,
    followersCount: 100,
    followingCount: 50,
  },
]
module.exports = users;


// const User = require("../models/User");

// const getUsers = async () => {
//   try {
//     const users = await User.find({});
//     if(!users) {
//       return res.status(404).json({message: "No users found"})
//     }
//     console.log("User: ", users)

//     return res.status(200).json({message: "Users data successfully retrieved"})
//   } catch (error) {
//     console.error("Error fetching users from database: ", error);
//     throw error;
//   }
// };

// module.exports = { getUsers };
