const Story = require("../models/StoriesSchema");

const createStory = async (req, res) => {
  try {
    const { title, content } = req.body;
    console.log('Req body: ', req.body)
    const userId = req.user.userId;
    console.log("UserId: ", userId)

    const newStory = new Story({
      title,
      content,
      author: userId,
    });

    if (!newStory) {
      return res.status(401).json({ message: "title and content is required" });
    }

    await newStory.save();
    res.status(201).json(newStory);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllStories = async (req, res) => {
  try {
    const stories = await Story.find().populate("author", "name username");

    res.json(stories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { createStory, getAllStories };
