const postsEle = document.querySelector("main>.posts");
const postDetailDialog = document.getElementById("post-detail-dialog");
const allPostElements = document.querySelectorAll(".post");
const postDeleteForm = postDetailDialog.querySelector("form");
const deletPostBtn = document.getElementById("delete-post");
let selectedPostId = null;

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
    location.reload();
  } else {
    showMessage("Failed to delete post");
  }
});
