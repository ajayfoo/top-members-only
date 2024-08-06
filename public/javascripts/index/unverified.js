const postsEle = document.querySelector("main>.posts");
const joinDialog = document.getElementById("join-dialog");
const joinButton = document.getElementById("join-button");
const submitJoinFormButton = document.getElementById("submit-join-form-button");
const passcodeTxt = document.getElementById("passcode");
const postDetailDialog = document.getElementById("post-detail-dialog");
const allPostElements = document.querySelectorAll(".post");
const showPostDetail = (p) => {
  const title = p.querySelector(".title").textContent;
  const description = p.querySelector(".description").textContent;

  const postDetailTitleEle = postDetailDialog.querySelector(".title");
  postDetailTitleEle.textContent = title;

  const postDetailDescriptionEle =
    postDetailDialog.querySelector(".description");
  postDetailDescriptionEle.textContent = description;

  postDetailDialog.showModal();
};
const getNewPostElement = (title, description) => {
  const postEle = document.createElement("article");
  postEle.classList.add("post");

  const titleEle = document.createElement("p");
  titleEle.classList.add("title");

  const descriptionEle = document.createElement("p");
  descriptionEle.classList.add("description");

  titleEle.textContent = title;
  descriptionEle.textContent = description;

  postEle.append(titleEle, descriptionEle);
  return postEle;
};

const addPostElement = (title, description) => {
  const newPostEle = getNewPostElement(title, description);
  newPostEle.addEventListener("click", () => {
    showPostDetail(newPostEle);
  });
  postsEle.appendChild(newPostEle);
};

const postJoinRequest = async (passcode) => {
  const url = location.href + "join";
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify({ passcode }),
  });
  return response;
};

allPostElements.forEach((p) => {
  p.addEventListener("click", () => showPostDetail(p));
});

joinButton.addEventListener("click", () => {
  joinDialog.showModal();
});

joinDialog.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (document.activeElement.id !== submitJoinFormButton.id) {
    joinDialog.close();
    return;
  }
  const response = await postJoinRequest(passcodeTxt.value);
  if (response.status === 401) {
    showMessage("Wrong passcode");
  } else if (!response.ok) {
    showMessage("Something went wrong");
  } else if (response.ok) {
    location.reload();
  }
});
