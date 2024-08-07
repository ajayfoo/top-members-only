import { forAllPostElementsDo, attachCommonEventListeners } from "./utils.js";

attachCommonEventListeners();
const showPostDetail = (p) => {
  const title = p.querySelector(".title").textContent;
  const description = p.querySelector(".description").textContent;

  const postDetailDialog = document.getElementById("post-detail-dialog");
  const postDetailTitleEle = postDetailDialog.querySelector(".title");
  postDetailTitleEle.textContent = title;

  const postDetailDescriptionEle =
    postDetailDialog.querySelector(".description");
  postDetailDescriptionEle.textContent = description;

  postDetailDialog.showModal();
};
forAllPostElementsDo((p) => {
  p.addEventListener("click", () => showPostDetail(p));
});

const getNewPostElement = (title, description) => {
  const postEle = document.createElement("article");
  postEle.classList.add("post");

  const titleEle = document.createElement("p");
  titleEle.classList.add("title");

  const descriptionEle = document.createElement("p");
  descriptionEle.classList.add("description");

  titleEle.textContent = title;
  descriptionEle.textContent = description;

  postEle.append(titleEle, descriptionEle);
  return postEle;
};

const addPostElement = (title, description) => {
  const newPostEle = getNewPostElement(title, description);
  const postsEle = document.querySelector("main>.posts");
  newPostEle.addEventListener("click", () => {
    showPostDetail(newPostEle);
  });
  postsEle.appendChild(newPostEle);
};
window.addEventListener("postCreationSuccessful", (e) => {
  const { title, description } = e.detail;
  addPostElement(title, description);
});

const postJoinRequest = async (passcode) => {
  const url = location.href + "join";
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify({ passcode }),
  });
  return response;
};

const joinDialog = document.getElementById("join-dialog");
const joinButton = document.getElementById("join-button");
joinButton.addEventListener("click", () => {
  joinDialog.showModal();
});

joinDialog.addEventListener("submit", async (e) => {
  e.preventDefault();
  const cancelJoinFormButton = document.getElementById(
    "cancel-join-form-button"
  );
  if (document.activeElement.id === cancelJoinFormButton.id) {
    joinDialog.close();
    return;
  }
  const passcodeTxt = document.getElementById("passcode");
  const response = await postJoinRequest(passcodeTxt.value);
  if (response.status === 401) {
    showMessage("Wrong passcode");
  } else if (!response.ok) {
    showMessage("Something went wrong");
  } else if (response.ok) {
    location.reload();
  }
});
