import { attachCommonEventListeners } from "./utils/common.js";
import { attachCommonVerifiedEventListeners } from "./utils/verified.js";

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

const attachEventListeners = () => {
  const becomeAdminDialog = document.getElementById("become-admin-dialog");
  const becomeAdminButton = document.getElementById("become-admin-button");
  becomeAdminButton.addEventListener("click", () => {
    becomeAdminDialog.showModal();
  });

  becomeAdminDialog.addEventListener("submit", async (e) => {
    e.preventDefault();
    const cancelBecomeAdminFormButton = document.getElementById(
      "cancel-become-admin-form-button"
    );
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
};

attachCommonEventListeners();
attachCommonVerifiedEventListeners();

attachEventListeners();
