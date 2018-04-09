// doc on focus first field
// function errorMsg(msg) {
//   console.log(errorMsg);
//   $('form').delete("div.error");
//             // event.preventDefault();
//             // $('button').attr('disabled', 'disabled');
//             var errorMsg = $("<div class='error'>").text(msg);
//             $('form').append(errorMsg);
// }

// function successReg(info) {
//   console.log("successReg");
//   $('form').delete("div.error");
//       bcrypt.hash(info.password, 12).then(function(hash) {
//         knex('users').insert({
//           username: info.username,
//           email: info.email,
//           first_name: info.firstName,
//           last_name: info.lastName,
//           password_hash: hash
//         })
//         .then( // fetch userID
//           req.session.userId = info.email)
//         .then(res.redirect("/maps/json"));
//       });
// }
// <div class="ui container segment">
//         <form class="ui form">
//           <div class="field">
//             <label>Username</label>
//             <input id="username" type="text" name="username" placeholder="Username">
//           </div>
//           <div class="field">
//             <label>Email</label>
//             <input id="email" type="text" name="email" placeholder="you@...">
//           </div>
//           <div class="field">
//             <label>First Name</label>
//             <input id="firstname" type="text" name="first-name" placeholder="First Name">
//           </div>
//           <div class="field">
//             <label>Last Name</label>
//             <input id="lastname" type="text" name="last-name" placeholder="Last Name">
//           </div>
//           <div class="field">
//             <label>Password</label>
//             <input id="password" type="password" name="password" placeholder="Enter Password">
//           </div>
//           <button class="ui button" type="submit">Submit</button>
//         </form>
//       </div>

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
    }

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
