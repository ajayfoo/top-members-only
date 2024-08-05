const createPostDialog = document.getElementById("create-post-dialog");
const createPostBtn = document.getElementById("create-post");
const titleTxt = document.getElementById("title");
const descriptionTxt = document.getElementById("description");
const progressDialog = document.getElementById("progress-dialog");
const resultDialog = document.getElementById("result-dialog");
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

const createPostForm = createPostDialog.querySelector("form:only-of-type");

const showPostCreationResult = (done) => {
  const result = resultDialog.querySelector("form>.result");
  if (done) {
    result.textContent = "Post created successfully";
  } else {
    result.textContent = "Failed to create your post";
  }
  resultDialog.showModal();
};

createPostForm.addEventListener("submit", async (e) => {
  if (document.activeElement.id !== createPostBtn.id) return;
  e.preventDefault();
  try {
    progressDialog.showModal();
    const done = await postPost(titleTxt.value, descriptionTxt.value);
    if (done) {
      createPostDialog.close();
      createPostForm.reset();
    }
    showPostCreationResult(done);
  } finally {
    progressDialog.close();
  }
});
createPostBtn.addEventListener("click", () => {
  createPostDialog.showModal();
});
createPostDialog.showModal();
