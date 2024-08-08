import {
  attachCommonEventListeners,
  showProgress,
  showMessage,
  hideProgress,
} from "./utils/common.js";
import { attachCommonVerifiedEventListeners } from "./utils/verified.js";

const deletePostElement = (id) =>
  document.querySelector(`[data-id="${id}"]`).remove();

const attachEventListeners = () => {
  const allPostElements = document.querySelectorAll(".post");
  let selectedPostId = null;
  allPostElements.forEach((p) => {
    const id = p.dataset.id;
    p.addEventListener("click", () => {
      selectedPostId = id;
      console.log(selectedPostId);
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
    showProgress("Deleting the post...");
    const response = await fetch(location.href, {
      headers: {
        "Content-Type": "application/json",
      },
      method: "DELETE",
      body: JSON.stringify({ id: selectedPostId }),
    });
    if (response.ok) {
      showMessage("Successfully deleted post");
      hideProgress();
      postDetailDialog.close();
      deletePostElement(selectedPostId);
    } else {
      showMessage("Failed to delete post");
    }
  });
};

attachCommonEventListeners();
attachCommonVerifiedEventListeners();
attachEventListeners();
