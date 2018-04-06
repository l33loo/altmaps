console.log("This is register.js! 🗺️");

// For input boxes ➜ floating message with button

$(document).ready(function() {
  $('div').closest('.field').on('keyup', function () {
    var loginInfo = $(this).val().length;
    if (loginInfo < 1) {
      $(this).addClass('error');
      console.log("no input ➜ field error works");
    }
  });
  console.log("looked for content 🐱‍💻");
});



// For checkbox

$(document).ready(function() {
  $('#terms').on('click', function () {
    alert( $(this).button());

    // var $terms = $(this).val();
    // if ($terms) {
    //   $(this).addClass('error');
      console.log("no input ➜ inline field error works");
    // }
  });
  console.log("box not checked");
});










// Reg button ➜ main page

$(document).ready(function() {
  $('#submit').on('click', function (){
    alert("register clicked!");
  });
  console.log("login button works! 🎉");
});

// If all is good, it takes registered user back to /maps (via server) ✅
