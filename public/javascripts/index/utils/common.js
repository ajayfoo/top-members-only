const resultDialog = document.getElementById("result-dialog");

const showProgress = (msg) => {
  const progressDialog = document.getElementById("progress-dialog");
  const progressMessage = document.getElementById("progress-message");
  progressMessage.textContent = msg;
  progressDialog.showModal();
};

const hideProgress = () => {
  const progressDialog = document.getElementById("progress-dialog");
  progressDialog.close();
};

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

const showMessage = (msg) => {
  const result = resultDialog.querySelector("form>.result");
  result.textContent = msg;
  resultDialog.showModal();
};

const dispatchPostCreationSuccessfulEvent = (title, description, response) => {
  const postCreationSuccessfulEvent = new CustomEvent(
    "postCreationSuccessful",
    {
      detail: { title, description, response },
    }
  );
  window.dispatchEvent(postCreationSuccessfulEvent);
};

const attachCommonEventListeners = () => {
  const logoutBtn = document.getElementById("logout-button");
  const logoutConfirmDialog = document.getElementById("logout-confirm-dialog");
  logoutBtn.addEventListener("click", () => {
    logoutConfirmDialog.showModal();
  });

  const createPostDialog = document.getElementById("create-post-dialog");
  const createPostForm = createPostDialog.querySelector("form:only-of-type");
  const createPostBtn = document.getElementById("create-post");
  createPostForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (document.activeElement.id !== createPostBtn.id) {
      createPostDialog.close();
      return;
    }
    const titleTxt = document.getElementById("title");
    const descriptionTxt = document.getElementById("description");
    const title = titleTxt.value;
    const description = descriptionTxt.value;
    try {
      showProgress("Creating your post...");
      const response = await postPost(title, description);
      if (response.ok) {
        createPostDialog.close();
        createPostForm.reset();
        showMessage("Post created successfully");
        dispatchPostCreationSuccessfulEvent(title, description, response);
      } else {
        showMessage("Failed to create your post");
      }
    } finally {
      hideProgress();
    }
  });

  createPostBtn.addEventListener("click", () => {
    createPostDialog.showModal();
  });
};

const forAllPostElementsDo = (task) => {
  const allPostElements = document.querySelectorAll(".post");
  allPostElements.forEach(task);
};

export {
  showProgress,
  hideProgress,
  postPost,
  showMessage,
  attachCommonEventListeners,
  forAllPostElementsDo,
};
