import { hideProgress, showProgress } from "./common.js";

const getNewPostElement = (post) => {
  const { username, timestamp, title, description } = post;
  const postEle = document.createElement("article");
  postEle.classList.add("post");

  const header = document.createElement("header");

  const usernameEle = document.createElement("p");
  usernameEle.classList.add("username");
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
    showPostDetail(post);
  });

  return postEle;
};

const showPostDetail = (post) => {
  const { username, timestamp, title, description } = post;

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

const onSuccessfulPostCreationDo = (addPostElement) => {
  const postsEle = document.querySelector("main>.posts");
  window.addEventListener("postCreationSuccessful", async (e) => {
    const { title, description, response } = e.detail;
    await addPostElement(postsEle, title, description, response);
  });
};

export { onSuccessfulPostCreationDo, getNewPostElement, showPostDetail };
