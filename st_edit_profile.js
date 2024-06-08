function validateForm() {
    var profileImg = document.getElementById("profile-img").value;
    var profileDesc = document.getElementById("profile-desc").value;

    if (profileImg === "") {
        alert("Please select a profile picture.");
        return false;
    }

    if (profileDesc.trim() === "") {
        alert("Please enter a profile description.");
        return false;
    }

    return true;
}