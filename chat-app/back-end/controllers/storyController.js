const Story = require("../models/StoriesSchema");

exports.createStory = async (req, res) => {
  try {
    const { title, media } = req.body;
    console.log("Req body: ", req.body);
    const userId = req.user.userId;
    console.log("User id: ", userId);

    const newStory = new Story({
      author: userId,
      title,
      media,
  });

    if (!newStory) {
      return res.status(401).json({ message: "title and media is required" });
    }

    await newStory.save();
    res.status(201).json(newStory);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getActiveStories = async (req, res) => {
  try {
    console.log('Auth user: ', req.user)
    const stories = await Story.find({
      expiresAt: { $gte: Date.now() },
    }).populate("author", "username avatar");
    console.log("Stories: ", stories);

    if (!stories) {
      return res.status(404).json({ message: "No stories to find" });
    }

    res.json(stories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
