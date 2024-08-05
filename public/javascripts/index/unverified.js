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
  return response;
};

const showJoinUnsuccessfulMessage = (msg) => {
  const result = resultDialog.querySelector("form>.result");
  result.textContent = msg;
  resultDialog.showModal();
};

joinButton.addEventListener("click", () => {
  joinDialog.showModal();
});

joinDialog.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (document.activeElement.id !== submitJoinFormButton.id) {
    joinDialog.close();
  }
  const response = await postJoinRequest(passcodeTxt.value);
  if (response.status === 401) {
    showJoinUnsuccessfulMessage("Wrong passcode");
  } else if (!response.ok) {
    showJoinUnsuccessfulMessage("Something went wrong");
  } else if (response.ok) {
    location.reload();
  }
});
