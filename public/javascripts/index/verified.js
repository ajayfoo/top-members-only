import {
  attachCommonEventListeners,
  hideProgress,
  showMessage,
  showProgress,
} from "./utils/common.js";
import {
  onSuccessfulPostCreationDo,
  getNewPostElement,
  showPostDetail,
} from "./utils/verified.js";

const postViewModelMap = new Map();
const addPostElement = async (postsEle, title, description, response) => {
  showProgress("Loading...");
  const { username, timestamp } = await response.json();
  hideProgress();
  const post = {
    username,
    timestamp,
    title,
    description,
  };
  const newPostElement = getNewPostElement(post);
  postViewModelMap.set(newPostElement, post);
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

const attachEventListeners = () => {
  const allPostElements = document.querySelectorAll(".post");
  allPostElements.forEach((p) => {
    const username = p.querySelector(".username").textContent;
    const timestamp = p.querySelector(".timestamp").textContent;
    const title = p.querySelector(".title").textContent;
    const description = p.querySelector(".description").textContent;
    const post = { username, timestamp, title, description };
    postViewModelMap.set(p, post);
    p.addEventListener("click", () => {
      showPostDetail(post);
    });
  });

  const becomeAdminDialog = document.getElementById("become-admin-dialog");
  const becomeAdminButton = document.getElementById("become-admin-button");
  becomeAdminButton.addEventListener("click", () => {
    becomeAdminDialog.showModal();
  });

  becomeAdminDialog.addEventListener("submit", async (e) => {
    e.preventDefault();
    const cancelBecomeAdminFormButton = document.getElementById(
      "cancel-become-admin-form-button"
    );
    if (document.activeElement.id === cancelBecomeAdminFormButton.id) {
      becomeAdminDialog.close();
      return;
    }
    const passcodeTxt = document.getElementById("passcode");
    showProgress("Checking passcode...");
    try {
      const response = await postBecomeAdminRequest(passcodeTxt.value);
      if (response.status === 401) {
        showMessage("Wrong passcode");
      } else if (!response.ok) {
        showMessage("Something went wrong");
      } else if (response.ok) {
        location.reload();
      }
    } catch (err) {
      showMessage("Something went wrong");
    } finally {
      hideProgress();
    }
  });
};

attachCommonEventListeners();
onSuccessfulPostCreationDo(addPostElement);

attachEventListeners();
