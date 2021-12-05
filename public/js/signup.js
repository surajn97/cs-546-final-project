(function ($) {
    let signupForm = $('#signup-form')
    let unameInput = $('#username');
    let pwInput = $('#password');
    let submitB = $('#submitButton');
    let errors = $('.error');
    let firstNameInput = $('#firstname');
    let lastNameInput = $('#lastname');
    let emailInput = $('#email');
    let ageInput = $('#age');


    signupForm.submit((event) => {
        event.preventDefault();
        unameInput.removeClass('is-invalid');
        pwInput.removeClass('is-invalid');
        firstNameInput.removeClass('is-invalid');
        lastNameInput.removeClass('is-invalid');
        emailInput.removeClass('is-invalid');
        ageInput.removeClass('is-invalid')

        submitB.prop('disabled', true);
        errors.hide();

        let user = {
            username: unameInput.val().trim(),
            password: pwInput.val().trim(),
            firstName: firstNameInput.val().trim(),
            lastName: lastNameInput.val().trim(),
            email: emailInput,
            age: ageInput,

        };

        let hasErrors = false;
        if (!user.username || !user.password || !user.firstName || !user.lastName || !user.email || !user.age || user.password.length < 6) {    //
            unameInput.addClass('is-invalid');
            pwInput.addClass('is-invalid');
            hasErrors = true;
        }

        if (!hasErrors) {
            signupForm.unbind().submit();
        } else {
            submitB.prop('disabled', false);
        }
    });
})(jQuery);