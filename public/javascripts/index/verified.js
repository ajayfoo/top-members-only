const postsEle = document.querySelector("main>.posts");
const becomeAdminDialog = document.getElementById("become-admin-dialog");
const becomeAdminButton = document.getElementById("become-admin-button");
const cancelBecomeAdminFormButton = document.getElementById(
  "cancel-become-admin-form-button"
);
const postDetailDialog = document.getElementById("post-detail-dialog");
const allPostElements = document.querySelectorAll(".post");

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

allPostElements.forEach((p) => {
  const username = p.querySelector(".username").textContent;
  const timestamp = p.querySelector(".timestamp").textContent;
  const title = p.querySelector(".title").textContent;
  const description = p.querySelector(".description").textContent;

  p.addEventListener("click", () => {
    showPostDetail(username, timestamp, title, description);
  });
});

becomeAdminButton.addEventListener("click", () => {
  becomeAdminDialog.showModal();
});

becomeAdminDialog.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (document.activeElement.id === cancelBecomeAdminFormButton.id) {
    becomeAdminDialog.close();
    return;
  }
  const passcodeTxt = document.getElementById("passcode");
  const response = await postBecomeAdminRequest(passcodeTxt.value);
  if (response.status === 401) {
    showMessage("Wrong passcode");
  } else if (!response.ok) {
    showMessage("Something went wrong");
  } else if (response.ok) {
    location.reload();
  }
});
