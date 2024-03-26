export const usersData = async () => {
  try {
    const url = "http://localhost:5500/api/users";
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to fetch data');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching data:', error.message);
    throw error; // Re-throw the error to propagate it to the caller
  }
};

export const usersPosts = async () => {
  try {
    const urlPosts = "http://localhost:5500/api/posts";
    const response = await fetch(urlPosts);
    if (!response.ok) {
      throw new Error('Failed to fetch data');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching data:', error.message);
    throw error; // Re-throw the error to propagate it to the caller
  }
};

