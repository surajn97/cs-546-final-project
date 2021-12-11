(function ($) {
  let signupForm = $("#signup-form");
  let unameInput = $("#username");
  let pwInput = $("#password");
  let submitB = $("#submitButton");
  let errors = $(".error");
  let firstNameInput = $("#firstname");
  let lastNameInput = $("#lastname");
  let emailInput = $("#email");
  let ageInput = $("#age");

  function validateEmail(mail) {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail)) {
      return true;
    }
    return false;
  }

  signupForm.submit((event) => {
    event.preventDefault();
    unameInput.removeClass("is-invalid");
    pwInput.removeClass("is-invalid");
    firstNameInput.removeClass("is-invalid");
    lastNameInput.removeClass("is-invalid");
    emailInput.removeClass("is-invalid");
    ageInput.removeClass("is-invalid");
    errors.hide();
    let user = {
      username: unameInput.val().trim(),
      password: pwInput.val().trim(),
      firstName: firstNameInput.val().trim(),
      lastName: lastNameInput.val().trim(),
      email: emailInput.val().trim(),
      age: ageInput.val().trim(),
    };
    let hasErrors = false;
    if (!user.username || user.username.length < 1) {
      unameInput.addClass("is-invalid");
      hasErrors = true;
    }
    if (!user.password || user.password.length < 6) {
      pwInput.addClass("is-invalid");
      hasErrors = true;
    }
    if (!user.firstName || user.firstName.length < 1) {
      firstNameInput.addClass("is-invalid");
      hasErrors = true;
    }
    if (!user.lastName || user.lastName.length < 1) {
      lastNameInput.addClass("is-invalid");
      hasErrors = true;
    }
    if (!user.email || user.email.length < 1 || !validateEmail(user.email)) {
      emailInput.addClass("is-invalid");
      hasErrors = true;
    }
    if (
      !user.age ||
      user.age.length < 1 ||
      isNaN(parseInt(user.age)) ||
      parseInt(user.age) < 1
    ) {
      ageInput.addClass("is-invalid");
      hasErrors = true;
    }
    if (!hasErrors) signupForm.unbind().submit();
  });
})(jQuery);
