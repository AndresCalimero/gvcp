var input = $('form').find('input[type="text"]');

input.keyup(function() {
    input.val(input.val().replace(' ', '-').trim());
});

$('#join').click(function() {
   if (validateRoomName()) {
       window.location = "/?" + input.attr('name') + "=" + input.val().trim();
   }
});

$('form').submit(function(e) {
    if (!validateRoomName()) {
        e.preventDefault();
    } else {
        input.val(input.val().trim());
    }
});

function validateRoomName() {
    if (input.val().trim().length == 0) {
        return false;
    } else {
        return true;
    }
}