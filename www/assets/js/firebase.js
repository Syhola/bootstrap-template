var myDataRef = new Firebase('https://bootstrap-template.firebaseio.com/');

var authData = myDataRef.getAuth();

if (authData) {
  console.log("User " + authData.uid + " is logged in with " + authData.provider);
  $scope.log = true;
  $scope.youremail = authData.password.email;
  var uid = authData.uid;
} else {
  console.log("User is logged out");
}

function register(){

  myDataRef.createUser({
    email: document.getElementById('inputEmail').value,
    password: document.getElementById('inputPassword').value
  }, function(error, userData) {
    if (error) {
      switch (error.code) {
        case "EMAIL_TAKEN":
          console.log("The new user account cannot be created because the email is already in use.");
          break;
        case "INVALID_EMAIL":
          console.log("The specified email is not a valid email.");
          break;
        default:
          console.log("Error creating user:", error);
      }
    } else {
      console.log("Successfully created user account with uid:", userData.uid);
      document.location.href="page_messages.html"
    }
  });
}

function logout(){
  myDataRef.unauth();
  document.location.href="index.html"
}
