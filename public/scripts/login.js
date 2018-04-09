$(document).ready(function(){
  $('#logemail').focus();
  $('#login-button').on('click', function(){
    $hiddenButtons = $(this).siblings('.button').hide();
    $navForm = $(this).siblings('form').toggleClass('hidden');
    $('#login-button').on('click', function(){
        var data = {};
        console.dir($navForm.children());
        data.email = $navForm.children()[0].value;
        data.password = $navForm.children()[1].value;
        console.dir(data);
        $.post("/login", data).done(function(response){
          console.log(response);
        });
    });
  });
});
