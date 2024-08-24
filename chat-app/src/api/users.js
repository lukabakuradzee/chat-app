export const usersData = async () => {
  try {
    const url = "https://localhost:5500/api/users";
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to fetch data');
    }
    const data = await response.json();

    console.log("USer data: ", data);

    return data;
  } catch (error) {
    console.error('Error fetching data:', error.message);
    throw error; // Re-throw the error to propagate it to the caller
  }
};

export const usersPosts = async () => {
  try {
    const urlPosts = "https://localhost:5500/api/posts";
    const response = await fetch(urlPosts)
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

export const personInfo = async () => {
    const personUrl = "https://localhost:5500/api/users";
    const response = await fetch(personUrl, {
      method: "GET",
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        // body: JSON.stringify(users),
      }
    })
    const data = await response.json();
    console.log("User data: ", data)
    if(response.ok) {
      return data;
    } 
    throw new Error("Failed to fetch user information")
  }
