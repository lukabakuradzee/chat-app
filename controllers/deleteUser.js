const User =  require("../models/User")

exports.deleteUser = async (req,res) => {
    const userId = req.params.userId;

    try {
        const deleteUser = await User.findOneAndDelete(userId);
        
        if(!deleteUser) {
            return res.status(404).json({message: "User not found"})
        }

        return res.status(200).json({message: "User deleted successfully"})
       
    } catch (error) {
        console.error("Error while deleting", error)
        return res.status(500).json({message: "Internal server error"})
    }
} 


