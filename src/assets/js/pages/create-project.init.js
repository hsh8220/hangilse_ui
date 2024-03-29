/*
Template Name: Ubold - Responsive Bootstrap 5 Admin Dashboard
Author: CoderThemes
Website: https://coderthemes.com/
Contact: support@coderthemes.com
File: File uploads init js
*/


// Dropzone
!function ($) {
    "use strict";

    var FileUpload = function () {
        this.$body = $("body")
    };


    /* Initializing */
    FileUpload.prototype.init = function () {
        // Disable auto discovery

        Dropzone.autoDiscover = false;

        $('[data-plugin="dropzone"]').each(function () {
            var actionUrl = $(this).attr('action')
            var previewContainer = $(this).data('previewsContainer');

            var opts = {url: actionUrl};
            if (previewContainer) {
                opts['previewsContainer'] = previewContainer;
            }

            var uploadPreviewTemplate = $(this).data("uploadPreviewTemplate");
            if (uploadPreviewTemplate) {
                opts['previewTemplate'] = $(uploadPreviewTemplate).html();
            }

            var dropzoneEl = $(this).dropzone(opts);

        });
    },

        //init fileupload
        $.FileUpload = new FileUpload, $.FileUpload.Constructor = FileUpload

}(window.jQuery),

//initializing FileUpload
    function ($) {
        "use strict";
        $.FileUpload.init()
    }(window.jQuery);

//initializing selectize
$(function () {

    var host = getSystemVar('host')

    $.ajax({
        type: "GET",
        url: host+"/api/v1/project/meta",
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

    $('.selectize-close-btn').selectize({
        plugins: ['remove_button'],
        persist: false,
        create: true,
        render: {
            item: function(data, escape) {
                return '<div>"' + escape(data.text) + '"</div>';
            }
        },
        onDelete: function(values) {
            return confirm(values.length > 1 ? 'Are you sure you want to remove these ' + values.length + ' items?' : 'Are you sure you want to remove "' + values[0] + '"?');
        }
    });

    $('#project-type').selectize({
        maxItems: 1,
        valueField: 'name',
        labelField: 'name',
        searchField: 'name',
        options: [],
        create: false
    });

    $('#client').selectize({
        maxItems: 1,
        valueField: 'id',
        labelField: 'name',
        searchField: 'name',
        options: [],
        create: false
    });

    $('#assignee').selectize({
        maxItems: 1,
        valueField: 'id',
        labelField: 'name',
        searchField: 'name',
        options: [],
        create: false
    });

    $('#watchers').selectize({
        maxItems: null,
        valueField: 'id',
        labelField: 'name',
        searchField: 'name',
        options: [],
        create: false
    });
});

// Select 2
$('[data-toggle="select2"]').select2();

//Flat picker
$('[data-toggle="flatpicker"]').flatpickr({
    altInput: true,
    altFormat: "F j, Y",
    dateFormat: "Y-m-d",
});

//create Action
$("#create").click(function (e) {
    e.preventDefault();

    var data = {
        'name' : $("#project-name").val(),
        'type' : $("#project-type").val(),
        'clientId' : $("#client").val(),
        'accountId' : $("#assignee").val(),
        'watcherIds' : $("#watchers").val(),
        'contents' : quill.root.innerHTML,
        'targetTime' : $("#target-date").val(),
        'tags' : $("#tags").val().split(','),
        'cost' : $("#cost").val(),
    }

    var host = getSystemVar('host')

    $.ajax({
        type: "POST",
        url: host+'/api/v1/project',
        contentType : "application/json; charset=utf-8",
        headers : {
            'x-auth-token' : localStorage.getItem('accessToken')
        },
        data: JSON.stringify(data),
        success: function(response) {
            alert(response)
        },
        error: function(jqXHR, textStatus, errorThrown) {
            alert("Error: " + textStatus);
        }
    });
})