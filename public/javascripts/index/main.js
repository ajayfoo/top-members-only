const createPostDialog = document.getElementById("create-post-dialog");
const createPostBtn = document.getElementById("create-post");
const titleTxt = document.getElementById("title");
const descriptionTxt = document.getElementById("description");
const progressDialog = document.getElementById("progress-dialog");
const resultDialog = document.getElementById("result-dialog");
const createPostForm = createPostDialog.querySelector("form:only-of-type");
const logoutBtn = document.getElementById("logout-button");
const logoutConfirmDialog = document.getElementById("logout-confirm-dialog");

const postPost = async (title, description) => {
  const response = await fetch(location.href, {
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify({
      title,
      description,
    }),
  });
  return response.ok;
};

const showPostCreationResult = (done) => {
  const result = resultDialog.querySelector("form>.result");
  if (done) {
    result.textContent = "Post created successfully";
  } else {
    result.textContent = "Failed to create your post";
  }
  resultDialog.showModal();
};

logoutBtn.addEventListener("click", () => {
  logoutConfirmDialog.showModal();
});

createPostForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (document.activeElement.id !== createPostBtn.id) {
    createPostDialog.close();
  }
  const title = titleTxt.value;
  const descption = descriptionTxt.value;
  try {
    progressDialog.showModal();
    const done = await postPost(title, descption);
    if (done) {
      createPostDialog.close();
      createPostForm.reset();
      addPostElement(title, descption);
    }
    showPostCreationResult(done);
  } finally {
    progressDialog.close();
  }
});
createPostBtn.addEventListener("click", () => {
  createPostDialog.showModal();
});
