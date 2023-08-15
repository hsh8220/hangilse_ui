/*
Template Name: Ubold - Responsive Bootstrap 5 Admin Dashboard
Author: CoderThemes
Website: https://coderthemes.com/
Contact: support@coderthemes.com
File: Task init js
*/

// Bubble theme
var quill = new Quill('#bubble-editor', {
    theme: 'bubble'
});

function getProjectList() {
    var host = getSystemVar('host')

    $.ajax({
        type: "GET",
        url: host+'/api/v1/project/meta',
        contentType : "application/json; charset=utf-8",
        headers : {
            'x-auth-token' : localStorage.getItem('accessToken')
        },
        success: function(response) {
            let types = response.types.map(name => ({name}));
            let accounts =Object.entries(response.accounts).map(([id, name]) => ({ id: parseInt(id), name }));
            let clients =Object.entries(response.clients).map(([id, name]) => ({ id: parseInt(id), name }));

            $('#project-type')[0].selectize.addOption(types)
            $('#client')[0].selectize.addOption(clients)
            $('#assignee')[0].selectize.addOption(accounts)
            $('#watchers')[0].selectize.addOption(accounts)
        },
        error: function(jqXHR, textStatus, errorThrown) {
            alert("Error: " + textStatus);
            window.location.href = './index.html';
        }
    });
}