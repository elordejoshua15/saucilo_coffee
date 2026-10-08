document.addEventListener('DOMContentLoaded', () => {

    const loginForm = document.getElementById('loginForm');
    const regForm = document.getElementById('regForm');
    const createAccountBtn = document.getElementById('createAccountBtn');
    const signInBtn = document.getElementById('signInBtn');

    if (!loginForm || !regForm || !createAccountBtn || !signInBtn) {

        console.error(
            'register.js: could not find one of the required elements.',
            {
                loginForm,
                regForm,
                createAccountBtn,
                signInBtn
            }
        );

        return;
    }


    // ==========================================
    // SHOW REGISTER FORM
    // ==========================================

    function showRegisterForm() {

        loginForm.style.display = 'none';
        regForm.style.display = 'flex';

    }


    // ==========================================
    // SHOW LOGIN FORM
    // ==========================================

    function showLoginForm() {

        regForm.style.display = 'none';
        loginForm.style.display = 'flex';

    }


    // ==========================================
    // BUTTON EVENTS
    // ==========================================

    createAccountBtn.addEventListener(
        'click',
        showRegisterForm
    );

    signInBtn.addEventListener(
        'click',
        showLoginForm
    );


    // ==========================================
    // REGISTER ACCOUNT
    // ==========================================

    regForm.addEventListener('submit', async (event) => {

        event.preventDefault();


        const name =
            document.getElementById('regName')
                .value
                .trim();

        const email =
            document.getElementById('regEmail')
                .value
                .trim();

        const password =
            document.getElementById('regPassword')
                .value;


        // CHECK FIELDS

        if (!name || !email || !password) {

            alert('Please complete all fields.');

            return;
        }


        // PASSWORD LENGTH

        if (password.length < 6) {

            alert(
                'Password must be at least 6 characters.'
            );

            return;
        }


        // DISABLE BUTTON WHILE SUBMITTING

        const submitButton =
            regForm.querySelector(
                'button[type="submit"]'
            );

        const originalText =
            submitButton.textContent;

        submitButton.disabled = true;
        submitButton.textContent =
            'Creating account...';


        try {

            // ==================================
            // SEND DATA TO PHP API
            // ==================================

            const response = await fetch(
                'API/register.php',
                {
                    method: 'POST',

                    headers: {
                        'Content-Type':
                            'application/json'
                    },

                    body: JSON.stringify({
                        name: name,
                        email: email,
                        password: password
                    })
                }
            );


            const data =
                await response.json();


            // ==================================
            // SUCCESS
            // ==================================

            if (response.ok && data.success) {

                alert(
                    data.message ||
                    'Account created successfully!'
                );

                regForm.reset();

                // Go back to login so they can sign in with
                // the account they just created
                showLoginForm();

            } else {

                alert(
                    data.message ||
                    'Registration failed.'
                );

            }


        } catch (error) {

            console.error(
                'Registration Error:',
                error
            );

            alert(
                'Unable to connect to the server. ' +
                'Please make sure Apache is running.'
            );


        } finally {

            // ENABLE BUTTON AGAIN

            submitButton.disabled = false;

            submitButton.textContent =
                originalText;

        }

    });


    // ==========================================
    // LOGIN ACCOUNT
    // ==========================================

    loginForm.addEventListener('submit', async (event) => {

        event.preventDefault();


        const email =
            document.getElementById('loginEmail')
                .value
                .trim();

        const password =
            document.getElementById('loginPass')
                .value;


        // CHECK FIELDS

        if (!email || !password) {

            alert(
                'Please enter your email and password.'
            );

            return;
        }


        // ======================================
        // DISABLE LOGIN BUTTON
        // ======================================

        const submitButton =
            loginForm.querySelector(
                'button[type="submit"]'
            );

        const originalText =
            submitButton.textContent;

        submitButton.disabled = true;

        submitButton.textContent =
            'Logging in...';


        try {

            // ==================================
            // SEND LOGIN DATA TO PHP
            // ==================================

            const response = await fetch(
                'API/login.php',
                {
                    method: 'POST',

                    headers: {
                        'Content-Type':
                            'application/json'
                    },

                    body: JSON.stringify({
                        email: email,
                        password: password
                    })
                }
            );


            // ==================================
            // READ PHP RESPONSE
            // ==================================

            const data =
                await response.json();


            // ==================================
            // LOGIN SUCCESS
            // ==================================

            if (response.ok && data.success) {

                alert(
                    data.message ||
                    'Login successful!'
                );


                // Save logged-in user under the SAME key
                // menu.html / account.js check for:
                // "brewtney_user"
                localStorage.setItem(
                    'brewtney_user',
                    JSON.stringify(data.user)
                );


                // Head back to the menu after a successful
                // login
                window.location.href = 'menu.html';


            } else {

                // LOGIN FAILED

                alert(
                    data.message ||
                    'Invalid email or password.'
                );

            }


        } catch (error) {

            console.error(
                'Login Error:',
                error
            );

            alert(
                'Unable to connect to the server. ' +
                'Please make sure Apache is running.'
            );


        } finally {

            // ENABLE LOGIN BUTTON AGAIN

            submitButton.disabled = false;

            submitButton.textContent =
                originalText;

        }

    });


    console.log('register.js loaded successfully.');

});