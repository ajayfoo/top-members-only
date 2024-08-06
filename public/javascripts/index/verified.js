const postsEle = document.querySelector("main>.posts");
const becomeAdminDialog = document.getElementById("become-admin-dialog");
const becomeAdminButton = document.getElementById("become-admin-button");
const submitBecomeAdminFormButton = document.getElementById(
  "submit-become-admin-form-button"
);
const passcodeTxt = document.getElementById("passcode");
const getNewPostElement = async (title, description, response) => {
  const postEle = document.createElement("article");
  postEle.classList.add("post");

  const header = document.createElement("header");

  const usernameEle = document.createElement("p");
  usernameEle.classList.add("username");
  const { username, timestamp } = await response.json();
  usernameEle.textContent = username;

  const timestampEle = document.createElement("p");
  timestampEle.classList.add("timestamp");
  timestampEle.textContent = timestamp;

  header.append(usernameEle, timestampEle);

  const titleEle = document.createElement("p");
  titleEle.classList.add("title");

  const descriptionEle = document.createElement("p");
  descriptionEle.classList.add("description");

  titleEle.textContent = title;
  descriptionEle.textContent = description;

  postEle.append(header, titleEle, descriptionEle);
  return postEle;
};

const addPostElement = async (title, description, response) => {
  const newPostElement = await getNewPostElement(title, description, response);
  postsEle.appendChild(newPostElement);
};

const postBecomeAdminRequest = async (passcode) => {
  const url = location.href + "become-admin";
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify({ passcode }),
  });
  return response;
};

becomeAdminButton.addEventListener("click", () => {
  becomeAdminDialog.showModal();
});

becomeAdminDialog.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (document.activeElement.id !== submitBecomeAdminFormButton.id) {
    becomeAdminDialog.close();
    return;
  }
  console.log("become admin");
  const response = await postBecomeAdminRequest(passcodeTxt.value);
  if (response.status === 401) {
    showJoinUnsuccessfulMessage("Wrong passcode");
  } else if (!response.ok) {
    showJoinUnsuccessfulMessage("Something went wrong");
  } else if (response.ok) {
    location.reload();
  }
});
