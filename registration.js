function validateForm() {
  let email = document.forms["registration"]["dlsuemail"].value;
  let firstname = document.forms["registration"]["firstname"].value;
  let lastname = document.forms["registration"]["lastname"].value;
  let password = document.forms["registration"]["password"].value;
  let role = document.forms["registration"]["role"].value;

  let caps = /[A-Z]/;
  let special = /[!@#$%^&*(),.?":{}|<>_]/;
  let num = /[0-9]/;

  if (!email.endsWith('@dlsu.edu.ph')) {
      alert("Email should end with @dlsu.edu.ph");
      return false;
  }
  if (firstname.length > 25 || firstname.length < 1) {
      alert("Please input your first name");
      return false;
  }
  if (lastname.length > 25 || lastname.length < 1) {
      alert("Please input your last name");
      return false;
  }
  if (password.length > 25 || password.length < 8) {
      alert("Password should be 8-25 characters long");
      return false;
  }
  if (!caps.test(password)) {
      alert("Password should contain at least one capital letter");
      return false;
  }
  if (!special.test(password)) {
      alert("Password should contain at least one special character");
      return false;
  }
  if (!num.test(password)) {
      alert("Password should contain at least one number");
      return false;
  }
  if (role === "") {
      alert("Please select a role");
      return false;
  }
  return true;
}