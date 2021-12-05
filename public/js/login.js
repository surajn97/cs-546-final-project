(function ($) {
    let loginForm = $('#login-form')
    let unameInput = $('#username');
    let pwInput = $('#password');
    let submitB = $('#submitButton');
    let errors = $('.error');

    loginForm.submit((event) => {
        event.preventDefault();
        unameInput.removeClass('is-invalid');
        pwInput.removeClass('is-invalid');
        submitB.prop('disabled', true);
        errors.hide();

        let user = {
            username: unameInput.val().trim(),
            password: pwInput.val().trim()
        };

        let hasErrors = false;
        if (!user.username || !user.password || user.password.length < 6) {
            unameInput.addClass('is-invalid');
            pwInput.addClass('is-invalid');
            hasErrors = true;
        }

        if (!hasErrors) {
            loginForm.unbind().submit();
        } else {
            submitB.prop('disabled', false);
        }
    });
})(jQuery);