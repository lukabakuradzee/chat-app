const User = require("../models/User");

const getData = async () => {
  try {
    const users = await User.find({});
    if(!users) {
      return res.status(404).json({message: "No users found"})
    }
    console.log("User: ", users)

    return res.status(200).json({message: "Users data successfully retrieved"})
  } catch (error) {
    console.error("Error fetching users from database: ", error);
    throw error;
  }
};

module.exports = getData;

