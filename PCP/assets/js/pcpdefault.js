getUser()

function getUser() {
    user = JSON.parse(sessionStorage.getItem("user"))

    if (user) {
        var displayName = document.getElementById("profile-name")
        displayName.innerText = user.user.name

    } else {
        alert("Could not fetch user, Please try Logining IN again or use a different browser")
        window.location = "/PCP/pcpauth.html"
    }
}

