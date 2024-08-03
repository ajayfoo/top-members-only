const commonValidationMessages = {
  valueMissing: "Required",
  tooLong: (max) => "Must be at most " + max + " characters long",
  tooShort: (min) => "Must be at least " + min + " characters long",
};

const firstNameTxt = document.getElementById("first-name");
const firstNameValidationMessage = document.getElementById(
  "first-name-validation-message"
);

const lastNameTxt = document.getElementById("last-name");
const usernameTxt = document.getElementById("username");
const passwordTxt = document.getElementById("password");
const passwordConfirmTxt = document.getElementById("password-confirm");

let triedToSubmitInvalidForm = false;

const isTouchedMap = {};
const isBlurredMap = {};

const signUpForm = document.getElementById("signup-form");

const showValidationMessage = (ele, customValidationMessages) => {
  const minLength = ele.getAttribute("minlength");
  const maxLength = ele.getAttribute("maxlength");
  const validationMessages = {
    valueMissing: commonValidationMessages.valueMissing,
    tooLong: commonValidationMessages.tooLong(maxLength),
    tooShort: commonValidationMessages.tooShort(minLength),
    ...customValidationMessages,
  };
  for (const [key, value] of Object.entries(validationMessages)) {
    if (!ele.validity[key]) {
      ele.setCustomValidity("");
      continue;
    }
    ele.setCustomValidity(value);
    const validationMessageEle = ele.parentNode.querySelector(
      ".validation-message"
    );
    validationMessageEle.textContent = value;
    return;
  }
};

const formFields = [firstNameTxt, lastNameTxt, usernameTxt, passwordTxt];

formFields.forEach((ele) => {
  const customValidationMessages = {
    patternMismatch: "Must contain only alphabets",
  };
  if (ele === passwordTxt) {
    customValidationMessages.patternMismatch =
      "Must contain at least one uppercase and lowercase letter, one number and one special character(e.g., !,@,#,$, etc)";
  } else if (ele === usernameTxt) {
    customValidationMessages.patternMismatch =
      "Must contain only alphabets and numeric digits(e.g., 1,2,3,etc)";
  }

  ele.addEventListener("input", () => {
    isTouchedMap[ele.id] = true;
    if (!isBlurredMap[ele.id] && !triedToSubmitInvalidForm) {
      return;
    }
    showValidationMessage(ele, customValidationMessages);
  });
  ele.addEventListener("blur", () => {
    if (!isTouchedMap[ele.id]) return;
    isBlurredMap[ele.id] = true;
    showValidationMessage(ele, customValidationMessages);
  });
});

const showPasswordMismatchValidationMessage = (msg) => {
  passwordConfirmTxt.setCustomValidity(msg);
  const validationMessageEle = passwordConfirmTxt.parentNode.querySelector(
    ".validation-message"
  );
  validationMessageEle.textContent = msg;
};

const passwordMismatchMsg = "Password doesn't match";

passwordTxt.addEventListener("input", () => {
  if (
    passwordTxt.value !== passwordConfirmTxt.value &&
    passwordConfirmTxt.value !== ""
  ) {
    showPasswordMismatchValidationMessage(passwordMismatchMsg);
  } else if (
    passwordTxt.value === passwordConfirmTxt.value &&
    passwordTxt.value !== ""
  ) {
    showPasswordMismatchValidationMessage("");
  }
});

passwordConfirmTxt.addEventListener("input", () => {
  if (passwordTxt.value !== passwordConfirmTxt.value) {
    showPasswordMismatchValidationMessage(passwordMismatchMsg);
  } else {
    showPasswordMismatchValidationMessage("");
  }
});

const validatePasswordConfirm = () => {
  if (passwordConfirmTxt.value === "") {
    showPasswordMismatchValidationMessage("Required");
  }
};

const validateAllFields = () => {
  formFields.forEach((ele) => {
    showValidationMessage(ele, {});
  });
  validatePasswordConfirm();
};

signUpForm.addEventListener("submit", (e) => {
  if (!signUpForm.checkValidity()) {
    e.preventDefault();
    validateAllFields();
    triedToSubmitInvalidForm = true;
  }
});
