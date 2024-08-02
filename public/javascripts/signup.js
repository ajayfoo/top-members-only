const passwordTxt = document.getElementById("password");
const passwordConfirmTxt = document.getElementById("password_confirm");

const validatePasswordConfirmTxt = () => {
  if (passwordConfirmTxt.value !== passwordTxt.value) {
    passwordConfirmTxt.setCustomValidity("Passwords don't match");
  } else {
    passwordConfirmTxt.setCustomValidity("");
  }
};

passwordConfirmTxt.addEventListener("change", () => {
  validatePasswordConfirmTxt();
});
