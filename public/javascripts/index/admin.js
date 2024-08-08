import {
  attachCommonEventListeners,
  showProgress,
  showMessage,
  hideProgress,
} from "./utils/common.js";
import {
  onSuccessfulPostCreationDo,
  showPostDetail,
  getNewPostElement,
} from "./utils/verified.js";

const postViewModelMap = new Map();
let selectedPostElement = null;
const addPostElement = async (postsEle, title, description, response) => {
  const { username, timestamp, id } = await response.json();
  const post = {
    id,
    username,
    timestamp,
    title,
    description,
  };
  const newPostElement = getNewPostElement(post);
  postViewModelMap.set(newPostElement, post);
  postsEle.appendChild(newPostElement);
  newPostElement.addEventListener("click", () => {
    selectedPostElement = newPostElement;
  });
};

const attachEventListeners = () => {
  const allPostElements = document.querySelectorAll(".post");
  allPostElements.forEach((p) => {
    const username = p.querySelector(".username").textContent;
    const timestamp = p.querySelector(".timestamp").textContent;
    const title = p.querySelector(".title").textContent;
    const description = p.querySelector(".description").textContent;
    const id = p.dataset.id;
    const post = { username, timestamp, title, description, id };
    postViewModelMap.set(p, post);
    p.addEventListener("click", () => {
      selectedPostElement = p;
      showPostDetail(post);
    });
  });

  const postDetailDialog = document.getElementById("post-detail-dialog");
  const postDeleteForm = postDetailDialog.querySelector("form");
  const deletPostBtn = document.getElementById("delete-post");
  postDeleteForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (document.activeElement.id !== deletPostBtn.id) {
      postDetailDialog.close();
      return;
    }
    const { id } = postViewModelMap.get(selectedPostElement);
    showProgress("Deleting the post...");
    const response = await fetch(location.href, {
      headers: {
        "Content-Type": "application/json",
      },
      method: "DELETE",
      body: JSON.stringify({ id }),
    });
    if (response.ok) {
      showMessage("Successfully deleted post");
      hideProgress();
      postDetailDialog.close();
      selectedPostElement.remove();
    } else {
      showMessage("Failed to delete post");
    }
  });
};

attachCommonEventListeners();
onSuccessfulPostCreationDo(addPostElement);
attachEventListeners();
