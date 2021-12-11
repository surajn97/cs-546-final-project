(function ($) {
  let loginForm = $("#login-form");
  let unameInput = $("#username");
  let pwInput = $("#password");
  let errors = $(".error");

  loginForm.submit((event) => {
    event.preventDefault();
    unameInput.removeClass("is-invalid");
    pwInput.removeClass("is-invalid");
    errors.hide();
    let user = {
      username: unameInput.val().trim(),
      password: pwInput.val().trim(),
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
    if (!hasErrors) loginForm.unbind().submit();
  });
})(jQuery);
