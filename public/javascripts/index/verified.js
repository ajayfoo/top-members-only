const postsEle = document.querySelector("main>.posts");
const getNewPostElement = async (title, description, response) => {
  const postEle = document.createElement("article");
  postEle.classList.add("post");

  const header = document.createElement("header");

  const usernameEle = document.createElement("p");
  usernameEle.classList.add("username");
  const { username, timestamp } = await response.json();
  usernameEle.textContent = username;

  const timestampEle = document.createElement("p");
  timestampEle.classList.add("timestamp");
  timestampEle.textContent = timestamp;

  header.append(usernameEle, timestampEle);

  const titleEle = document.createElement("p");
  titleEle.classList.add("title");

  const descriptionEle = document.createElement("p");
  descriptionEle.classList.add("description");

  titleEle.textContent = title;
  descriptionEle.textContent = description;

  postEle.append(header, titleEle, descriptionEle);
  return postEle;
};

const addPostElement = async (title, description, response) => {
  const newPostElement = await getNewPostElement(title, description, response);
  postsEle.appendChild(newPostElement);
};
