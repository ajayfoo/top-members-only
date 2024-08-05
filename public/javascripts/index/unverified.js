const postsEle = document.querySelector("main>.posts");
const joinDialog = document.getElementById("join-dialog");
const joinButton = document.getElementById("join-button");
const submitJoinFormButton = document.getElementById("submit-join-form-button");
const passcodeTxt = document.getElementById("passcode");
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
  postsEle.appendChild(getNewPostElement(title, description));
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
  return response.ok;
};

joinButton.addEventListener("click", () => {
  joinDialog.showModal();
});

joinDialog.addEventListener("submit", async (e) => {
  if (document.activeElement.id !== submitJoinFormButton.id) return;
  e.preventDefault();
  const done = await postJoinRequest(passcodeTxt.value);
  if (done) {
    console.log("joined");
  } else {
    console.log("failed to join");
  }
});
