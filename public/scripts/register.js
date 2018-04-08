// doc on focus first field
function errorMsg(msg) {
  console.log(errorMsg);
  $('form').delete("div.error");
            // event.preventDefault();
            // $('button').attr('disabled', 'disabled');
            var errorMsg = $("<div class='error'>").text(msg);
            $('form').append(errorMsg);
}

function successReg(info) {
  console.log("successReg");
  $('form').delete("div.error");
      bcrypt.hash(info.password, 12).then(function(hash) {
        knex('users').insert({
          username: info.username,
          email: info.email,
          first_name: info.firstName,
          last_name: info.lastName,
          password_hash: hash
        })
        .then( // fetch userID
          req.session.userId = info.email)
        .then(res.redirect("/maps/json"));
      });
}
