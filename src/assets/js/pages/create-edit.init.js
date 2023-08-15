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
const urlParams = new URLSearchParams(window.location.search);
const project_id = urlParams.get('id');
var target_data;
$(function () {
    init();

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

    getData(
        project_id,
        function onSuccess(response) {
            set_data(response)
        },
        function onError(jqXHR, textStatus, errorThrown) {
            alert("Error: " + textStatus);
            window.location.href = './index.html';
        }
    );

    $("#edit").click(function (e) {
        e.preventDefault();
        edit()
    });
});

function init() {
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

    //Flat picker
    target_date = $('[data-toggle="flatpicker"]').flatpickr({
        altInput: true,
        altFormat: "F j, Y",
        dateFormat: "Y-m-d",
    });
}

function edit() {
    var data = {
        'id' : project_id,
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
        type: "PUT",
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
}


function set_data(data) {
    if(data.name) $("#project-name").val(data.name)
    if(data.type) $("#project-type")[0].selectize.setValue(data.type)
    if(data.client) $("#client")[0].selectize.setValue(data.client.id)
    if(data.account) $("#assignee")[0].selectize.setValue(data.account.id)
    if(data.watchers) $("#watchers")[0].selectize.setValue(data.watchers.map(item => item.id))

    if(data.contents) {
        const delta = quill.clipboard.convert(data.contents)
        quill.setContents(delta)
    }

    if(data.targetTime) target_date.setDate(data.targetTime)

    if(data.tags) {
        const tags = data.tags.map(item => item.name)
        var tags_selectize = $("#tags")[0].selectize
        for (var i = 0; i < tags.length; i++) {
            tags_selectize.addOption({value: tags[i], text: tags[i]});
            tags_selectize.addItem(tags[i]);
        }
    }

    if(data.cost) $("#cost").val(data.cost)
}

function getData(id, successCallback, errorCallback) {
    if(!id) {
        alert("no exist project id")
        return
    }

    var host = getSystemVar('host')

    $.ajax({
        type: "GET",
        url: host+"/api/v1/project/"+id,
        contentType : "application/json; charset=utf-8",
        headers : {
            'x-auth-token' : localStorage.getItem('accessToken')
        },
        success: function (response) {
            if (typeof successCallback === 'function') {
                successCallback(response);
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            if (typeof errorCallback === 'function') {
                errorCallback(jqXHR, textStatus, errorThrown);
            } else {
                alert("Error: " + textStatus);
                window.location.href = './index.html';
            }
        }
    });
}