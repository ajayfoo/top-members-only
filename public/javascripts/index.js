const createPostDialog = document.getElementById("create-post-dialog");
const createPostBtn = document.getElementById("create-post");
createPostBtn.addEventListener("click", () => {
  createPostDialog.showModal();
});

createPostDialog.showModal();
