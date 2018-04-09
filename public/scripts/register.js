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

// jQuery.post()
// Categories: Ajax > Shorthand Methods
// jQuery.post( url [, data ] [, success ] [, dataType ] )


  $("form").on("submit", function() {
    var $inputs = $(this).children("input");
    var data = {
      username: $inputs[0].value,
      email: $inputs[1].value,
      first_name: $inputs[2].value,
      last_name: $inputs[3].value,
      password: $inputs[4].value
    }

  $.post("/register", $inputs, function(response) {
    console.log("SERVEERRRR: " + response);
  });
});

});
