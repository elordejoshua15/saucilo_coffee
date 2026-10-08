/* =====================================================
   BREWTNEY CAFÉ
   LOGIN / ACCOUNT SYSTEM
===================================================== */


/* =====================================================
   GET LOGGED-IN USER
===================================================== */

function getLoggedInUser() {

    const savedUser =
        localStorage.getItem("brewtney_user");

    if (
        !savedUser ||
        savedUser === "null" ||
        savedUser === "undefined"
    ) {
        return null;
    }

    try {

        return JSON.parse(savedUser);

    } catch (error) {

        localStorage.removeItem("brewtney_user");
        localStorage.removeItem("brewtney_user_name");

        return null;

    }

}


/* =====================================================
   CHECK LOGIN
===================================================== */

function isUserLoggedIn() {

    return getLoggedInUser() !== null;

}


/* =====================================================
   LOGIN POPUP
===================================================== */

function openLoginPrompt() {

    const popup =
        document.getElementById("loginPrompt");

    if (popup) {

        popup.classList.add("show");

    }

}


/* =====================================================
   CLOSE LOGIN POPUP
   CANCEL = GO BACK TO INDEX
===================================================== */

function closeLoginPrompt() {

    window.location.href = "index.html";

}


/* =====================================================
   LOG IN BUTTON
   GO TO REGISTER / LOGIN PAGE
===================================================== */

function goToLogin() {

    window.location.href = "register.html";

}


/* =====================================================
   USER MENU
===================================================== */

function toggleUserMenu() {

    const dropdown =
        document.getElementById("userDropdown");

    if (!dropdown) {
        return;
    }

    dropdown.classList.toggle("show");

}


/* =====================================================
   CLOSE USER DROPDOWN WHEN CLICKING OUTSIDE
===================================================== */

document.addEventListener("click", function(event) {

    const account =
        document.getElementById("userAccount");

    const dropdown =
        document.getElementById("userDropdown");

    if (!account || !dropdown) {
        return;
    }

    if (!account.contains(event.target)) {

        dropdown.classList.remove("show");

    }

});


/* =====================================================
   ACCOUNT
===================================================== */

function goToAccount() {

    window.location.href = "account.html";

}


/* =====================================================
   PROFILE
===================================================== */

function goToProfile() {

    window.location.href = "profile.html";

}


/* =====================================================
   SETTINGS
===================================================== */

function goToSettings() {

    window.location.href = "settings.html";

}


/* =====================================================
   LOGOUT
===================================================== */

function logoutUser() {

    localStorage.removeItem("brewtney_user");
    localStorage.removeItem("brewtney_user_name");

    window.location.href = "index.html";

}


/* =====================================================
   DISPLAY USER
===================================================== */

function updateUserDisplay() {

    const user =
        getLoggedInUser();

    const account =
        document.getElementById("userAccount");

    const nameDisplay =
        document.getElementById("userNameDisplay");

    if (!account || !nameDisplay) {
        return;
    }


    /* ---------------------------------------------
       NOT LOGGED IN
    --------------------------------------------- */

    if (!user) {

        account.style.display = "none";

        nameDisplay.textContent = "";

        return;

    }


    /* ---------------------------------------------
       LOGGED IN
    --------------------------------------------- */

    account.style.display = "block";


    const displayName =
        user.name ||
        user.full_name ||
        user.fullName ||
        localStorage.getItem("brewtney_user_name") ||
        "Customer";


    nameDisplay.textContent =
        displayName;

}


/* =====================================================
   RUN WHEN PAGE LOADS
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    function() {

        updateUserDisplay();

    }
);