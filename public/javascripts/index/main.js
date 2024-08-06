const createPostDialog = document.getElementById("create-post-dialog");
const createPostBtn = document.getElementById("create-post");
const titleTxt = document.getElementById("title");
const descriptionTxt = document.getElementById("description");
const progressDialog = document.getElementById("progress-dialog");
const resultDialog = document.getElementById("result-dialog");
const createPostForm = createPostDialog.querySelector("form:only-of-type");
const logoutBtn = document.getElementById("logout-button");
const logoutConfirmDialog = document.getElementById("logout-confirm-dialog");

const allPosts = document.querySelectorAll(".post");

const postPost = (title, description) => {
  return fetch(location.href, {
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify({
      title,
      description,
    }),
  });
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

const showJoinUnsuccessfulMessage = (msg) => {
  const result = resultDialog.querySelector("form>.result");
  result.textContent = msg;
  resultDialog.showModal();
};

allPosts.forEach((p) => {
  p.addEventListener("click", () => showPostDetail(p));
});

logoutBtn.addEventListener("click", () => {
  logoutConfirmDialog.showModal();
});

createPostForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (document.activeElement.id !== createPostBtn.id) {
    createPostDialog.close();
    return;
  }
  const title = titleTxt.value;
  const descption = descriptionTxt.value;
  try {
    progressDialog.showModal();
    const response = await postPost(title, descption);
    if (response.ok) {
      createPostDialog.close();
      createPostForm.reset();
      addPostElement(title, descption, response);
    }
    showPostCreationResult(response.ok);
  } finally {
    progressDialog.close();
  }
});
createPostBtn.addEventListener("click", () => {
  createPostDialog.showModal();
});
