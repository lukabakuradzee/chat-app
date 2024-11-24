import React, {useState, useEffect} from 'react'
import { getActiveStories } from '../../api/services/userServices'

function Stories() {
    const [stories, setStories] = useState([])
    const [currentStory, setCurrentStory] = useState(0)

    useEffect(() => {
        const fetchStories = async () => {
            try {
                const data = await getActiveStories()
                console.log('Stories data: ', data)
                setStories(data)
            } catch (error) {
                console.error('Error fetching stories', error)
            }
        }
        fetchStories();
    }, [])

    const nextStory = () => {
        setCurrentStory((prev) => (prev + 1) % stories.length)
    }


  return (
    <div className="stories">
    {stories.length > 0 ? (
        <div className="story">
            <img src={stories[currentStory]?.media} alt={stories[currentStory]?.title} />
            <p>{stories[currentStory]?.author?.username}</p>
            <button onClick={nextStory}>Next</button>
        </div>
    ) : (
        <p>No stories to display</p>
    )}
</div>
  )
}

export default Stories