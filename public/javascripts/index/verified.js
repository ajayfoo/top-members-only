const postsEle = document.querySelector("main>.posts");
const becomeAdminDialog = document.getElementById("become-admin-dialog");
const becomeAdminButton = document.getElementById("become-admin-button");
const submitBecomeAdminFormButton = document.getElementById(
  "submit-become-admin-form-button"
);
const passcodeTxt = document.getElementById("passcode");
const postDetailDialog = document.getElementById("post-detail-dialog");
const allPostElements = document.querySelectorAll(".post");
const postDeleteForm = postDetailDialog.querySelector("form");
const deletPostBtn = document.getElementById("delete-post");
let selectedPostId = null;

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

const postBecomeAdminRequest = async (passcode) => {
  const url = location.href + "become-admin";
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify({ passcode }),
  });
  return response;
};

const showPostDetail = (username, timestamp, title, description) => {
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

allPostElements.forEach((p) => {
  const username = p.querySelector(".username").textContent;
  const timestamp = p.querySelector(".timestamp").textContent;
  const title = p.querySelector(".title").textContent;
  const description = p.querySelector(".description").textContent;
  const id = p.dataset.id;

  p.addEventListener("click", () => {
    showPostDetail(username, timestamp, title, description);
    selectedPostId = id;
  });
});
becomeAdminButton.addEventListener("click", () => {
  becomeAdminDialog.showModal();
});

becomeAdminDialog.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (document.activeElement.id !== submitBecomeAdminFormButton.id) {
    becomeAdminDialog.close();
    return;
  }
  const response = await postBecomeAdminRequest(passcodeTxt.value);
  if (response.status === 401) {
    showMessage("Wrong passcode");
  } else if (!response.ok) {
    showMessage("Something went wrong");
  } else if (response.ok) {
    location.reload();
  }
});

postDeleteForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (document.activeElement.id !== deletPostBtn.id) {
    postDetailDialog.close();
    return;
  }
  progressDialog.showModal();
  const response = await fetch(location.href, {
    headers: {
      "Content-Type": "application/json",
    },
    method: "DELETE",
    body: JSON.stringify({ id: selectedPostId }),
  });
  if (response.ok) {
    showMessage("Successfully deleted post");
    location.reload();
  } else {
    showMessage("Failed to delete post");
  }
});
