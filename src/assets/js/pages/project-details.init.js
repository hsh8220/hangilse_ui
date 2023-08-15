/*
Template Name: Ubold - Responsive Bootstrap 5 Admin Dashboard
Author: CoderThemes
Website: https://coderthemes.com/
Contact: support@coderthemes.com
File: Project Detail init js
*/
var quill = new Quill('#bubble-editor', {
    theme: 'bubble',
    readOnly: true
});

const urlParams = new URLSearchParams(window.location.search);
const project_id = urlParams.get('id');

$(document).ready(function () {

    getData(
        project_id,
        function onSuccess(response) {
            body_render(response);
            cmt_render(response);
        },
        function onError(jqXHR, textStatus, errorThrown) {
            alert("Error: " + textStatus);
            window.location.href = './index.html';
        }
    );

    $('#cmt_bt').click(function() {
        save_cmt(project_id)
    });
});

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

function body_render(data) {
    $("#project_name").text(data.name)
    $("#project_status").text(data.status)

    const delta = quill.clipboard.convert(data.contents)
    quill.setContents(delta, 'silent')

    var tags = $("#tags");

    $.each(data.tags, function(index, item) {
        var iElement = $("<i></i>"); // <i> 요소 생성
        iElement.addClass("badge badge-soft-primary me-1");
        iElement.text(item.name); // data의 name 값 설정

        tags.append(iElement); // <i> 요소를 div 요소에 추가
    });

    $("#createDate").text(data.createTime)
    $("#targetDate").text(data.targetTime)

    var watchers = $("#watchers");

    $.each(data.watchers, function(index, item) {
        var iElement = $("<i></i>"); // <i> 요소 생성
        iElement.addClass("badge badge-soft-primary me-1");
        iElement.text(item.name); // data의 name 값 설정

        watchers.append(iElement); // <i> 요소를 div 요소에 추가
    });
}

function cmt_render(data) {
    var comments = $("#cmt_body");
    comments.html("");

    var project_id = data.id

    $.each(data.comments, function(index, item) {
        var id = item.id
        var name = item.account.name
        var contents = item.contents
        var createTime = new Date(item.createTime).toLocaleString()
        var updateTime = new Date(item.updateTime).toLocaleString()

        var iElement = `
        <div class="d-flex align-items-start mt-3">
            <img class="me-2 avatar-sm rounded-circle" src="assets/images/users/default.png" alt="Generic placeholder image">
            <div class="w-100">
                <h5 class="mt-0">${name}    <small class="text-muted">${createTime}</small></h5>
                ${contents}
                <br/>
                <a href="javascript: delete_cmt(${project_id}, ${id});" class="text-muted font-13 d-inline-block mt-2"><i class="mdi mdi-delete"></i> Delete</a>
            </div>
        </div>
        `;

        comments.append(iElement);
    });
}

function save_cmt(project_id) {
    var cmt = {}

    var account = JSON.parse(localStorage.account)
    if(!account.id) {
        alert("no exist user info");
        return
    }
    var contents = $("#cmt_textarea").val()
    if(!contents) {
        alert("no exist contents");
        return
    }

    cmt.projectId = project_id
    cmt.accountId = account.id
    cmt.contents = contents

    var host = getSystemVar('host')

    $.ajax({
        type: "POST",
        url: host+"/api/v1/project/comment",
        contentType : "application/json; charset=utf-8",
        data: JSON.stringify(cmt),
        headers : {
            'x-auth-token' : localStorage.getItem('accessToken')
        },
        success: function(response) {
            getData(
                project_id,
                function onSuccess(response) {
                    cmt_render(response);
                },
                function onError(jqXHR, textStatus, errorThrown) {
                    alert("Error: " + textStatus);
                    window.location.href = './index.html';
                }
            );

            $("#cmt_textarea").val('')
        },
        error: function(jqXHR, textStatus, errorThrown) {
            alert("Error: " + textStatus);
            // window.location.href = './index.html';
        }
    });
}

function delete_cmt(project_id, comment_id) {

    var host = getSystemVar('host')

    $.ajax({
        type: "DELETE",
        url: host+"/api/v1/project/comment/"+comment_id,
        contentType : "application/json; charset=utf-8",
        headers : {
            'x-auth-token' : localStorage.getItem('accessToken')
        },
        success: function(response) {
            getData(
                project_id,
                function onSuccess(response) {
                    cmt_render(response);
                },
                function onError(jqXHR, textStatus, errorThrown) {
                    alert("Error: " + textStatus);
                    window.location.href = './index.html';
                }
            );
        },
        error: function(jqXHR, textStatus, errorThrown) {
            alert("Error: " + textStatus);
            // window.location.href = './index.html';
        }
    });
}

function edit() {
    window.location.href = './project-edit.html?id=' + project_id;
}