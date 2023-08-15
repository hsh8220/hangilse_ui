/*
Template Name: Ubold - Responsive Bootstrap 5 Admin Dashboard
Author: CoderThemes
Website: https://coderthemes.com/
Contact: support@coderthemes.com
File: Authentication init js
*/

$("[data-password]").on('click', function () {
    if ($(this).attr('data-password') == "false") {
        $(this).siblings("input").attr("type", "text");
        $(this).attr('data-password', 'true');
        $(this).addClass("show-password");
    } else {
        $(this).siblings("input").attr("type", "password");
        $(this).attr('data-password', 'false');
        $(this).removeClass("show-password");
    }
});

$('#submit').click(function(e) {
    e.preventDefault();

    var data = {
        'email' : $('#emailaddress').val(),
        'password' : $('#password').val()
    };

    var host = getSystemVar('host')

    $.ajax({
        type: "POST",
        url: host+'/login/sign',
        contentType : "application/json; charset=utf-8",
        data: JSON.stringify(data),
        success: function(response) {
            // save accessToken to local storage
            localStorage.setItem('accessToken', response.accessToken);
            localStorage.setItem('account', JSON.stringify(response.account));
            // redirect to home.html
            window.location.href = './home.html';
        },
        error: function(jqXHR, textStatus, errorThrown) {
            alert("Error: " + textStatus);
        }
    });
});