$(document).ready(function() {
  $("#username").focus();

  $("form").on("click", "button", function(event) {
    event.preventDefault();
    var $inputs = $("input").map(function() {
      return $(this).val();
    }).toArray();
    var data = {
      username: $inputs[0],
      email: $inputs[1],
      first_name: $inputs[2],
      last_name: $inputs[3],
      password: $inputs[4]
    };

    $.post("/register", data, function(response) {
      $("span.error").remove();
      var msgOne = "This username is already registered. Please select another one.";
      var msgTwo = "This email is already registered. Please log in or use a different email.";
      var msgThree = "Please fill out all the fields.";
      function errMessage(text) {
        var $errMsg = $("<span>").addClass("error").text(text);
        return $("form").append($errMsg);
      }
      if (Number(response) === 1) {
        return errMessage(msgOne);
      } else if (Number(response) === 2) {
        return errMessage(msgTwo);
      } else if (Number(response) === 3) {
        return errMessage(msgThree);
      } else {
        return window.location.replace(response);
      }
    });
  });

});
