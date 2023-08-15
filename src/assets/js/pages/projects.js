/*
Template Name: Ubold - Responsive Bootstrap 5 Admin Dashboard
Author: CoderThemes
Website: https://coderthemes.com/
Contact: support@coderthemes.com
File: Tickets init js
*/

$(document).ready(function () {
    $('#addProject').on('click', function() {
        window.location.href = 'project-create.html';
    });

    var table = $('#project-table').DataTable({
        "columns" : [
            {data: 'id'},
            {data: 'name'},
            {data: 'assignee'},
            {data: 'type'},
            {data: 'clientName'},
            {data: 'status'},
            {data: 'createTime'},
            {data: 'targetTime'}
        ],
        "language": {
            "paginate": {
                "previous": "<i class='mdi mdi-chevron-left'>",
                "next": "<i class='mdi mdi-chevron-right'>"
            }
        },
        "drawCallback": function () {
            $('.dataTables_paginate > .pagination').addClass('pagination-rounded');

            $('#project-table tbody').on('click', 'tr', function() {
                var data = table.row(this).data();
                if (data) {
                    // 행의 id 값을 가져와서 URL에 파라미터로 추가하여 페이지 이동
                    var id = data.id;
                    window.location.href = './project-detail.html?id=' + id;
                }
            });
        }
    });

    $(".dataTables_length select").addClass('form-select form-select-sm');
    $(".dataTables_length select").removeClass('custom-select custom-select-sm');

    $(".dataTables_length label").addClass('form-label');

    var data = {};
    updateData(table, data)
});

function updateData(Datatable, filter) {
    var host = getSystemVar('host')

    $.ajax({
        type: "POST",
        url: host+"/api/v1/project/list",
        data: JSON.stringify(filter),
        contentType : "application/json; charset=utf-8",
        headers : {
            'x-auth-token' : localStorage.getItem('accessToken')
        },
        success: function(response) {
            updateWidget(response)
            Datatable.clear()
            Datatable.rows.add(response);
            Datatable.draw();
        },
        error: function(jqXHR, textStatus, errorThrown) {
            alert("Error: " + textStatus);
            window.location.href = './index.html';
        }
    });
}

function updateWidget(data) {
    const total = data.length;
    const todo = data.filter(item => item.status === "TODO").length;
    const working = data.filter(item => item.status === "WORKING").length;
    const review = data.filter(item => item.status === "REVIEW").length;
    const accounting = data.filter(item => item.status === "ACCOUNTING").length;
    const done = data.filter(item => item.status === "DONE").length;

    $("#total").text(total);
    $("#todo").text(todo);
    $("#working").text(working);
    $("#review").text(review);
    $("#accounting").text(accounting);
    $("#done").text(done);

    $('.text-dark').counterUp();

}