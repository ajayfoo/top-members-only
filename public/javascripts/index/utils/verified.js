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
  postEle.addEventListener("click", () => {
    showPostDetail(username, timestamp, title, description);
  });

  return postEle;
};

const addPostElement = async (postsEle, title, description, response) => {
  const newPostElement = await getNewPostElement(title, description, response);
  postsEle.appendChild(newPostElement);
};

const showPostDetail = (username, timestamp, title, description) => {
  const postDetailDialog = document.getElementById("post-detail-dialog");
  const postDetailusernameEle = postDetailDialog.querySelector(".username");
  postDetailusernameEle.textContent = username;

  const postDetailTimestampEle = postDetailDialog.querySelector(".timestamp");
  postDetailTimestampEle.textContent = timestamp;

  const postDetailTitleEle = postDetailDialog.querySelector(".title");
  postDetailTitleEle.textContent = title;

  const postDetailDescriptionEle =
    postDetailDialog.querySelector(".description");
  postDetailDescriptionEle.textContent = description;

  postDetailDialog.showModal();
};

const attachCommonVerifiedEventListeners = () => {
  const postsEle = document.querySelector("main>.posts");
  window.addEventListener("postCreationSuccessful", (e) => {
    const { title, description, response } = e.detail;
    addPostElement(postsEle, title, description, response);
  });

  const allPostElements = document.querySelectorAll(".post");
  allPostElements.forEach((p) => {
    const username = p.querySelector(".username").textContent;
    const timestamp = p.querySelector(".timestamp").textContent;
    const title = p.querySelector(".title").textContent;
    const description = p.querySelector(".description").textContent;

    p.addEventListener("click", () => {
      showPostDetail(username, timestamp, title, description);
    });
  });
};

export { attachCommonVerifiedEventListeners };
