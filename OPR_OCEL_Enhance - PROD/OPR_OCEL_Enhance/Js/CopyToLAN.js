var base_url = $('#urlPath').val();

$(document).ready(function () {
    GetTaskDetail()
});

function GetTaskDetail() {

    if ($.fn.DataTable.isDataTable('#table_list')) {
        $('#table_list').DataTable().destroy();
    }
    $('#table_list tbody').empty();

    $('#table_list').DataTable({
        ajax: base_url + '/CopyToLAN/AjaxReadNewRegistration',
        destroy: true,
        scrollX: true,
        fixedHeader: true,
        scrollCollapse: true,
        fixedColumns: {
            leftColumns: 2
        },
        "columns": [
            { "data": "record_id" },
            { "data": "student_id", "width": "6%" },            // NRP
            { "data": "dstrct_code", "width": "5%"},            // Distrik
            { "data": "registration_id", "width": "10%" },      // Kd. Register
            { "data": "module_name", "width": "10%" },          // Modul
            { "data": "position_desc", "width": "15%" },        // Posisi Jabatan
            {
                "data": "registration_date", "width": "9%", render: function (data, type, row) {
                    return JSONDate(data);
                }
            },
            {
                "data": "question_type", "width": "11%", render: function (data, type, row) {
                    if (data == 1) {
                        return "Pilgan 1 Jawaban";
                    } else if (data == 2) {
                        return "Pilgan Multi Jawaban";
                    } else if (data == 3) {
                        return "Essay"
                    } else if (data == 4) {
                        return "Study Case";
                    }
                }
            },
            { "data": "number_of_question", "width": "7%" },    // jumlah soal
            { "data": "duration_minute", "width": "7%" },       // jumlah waktu      
            { "data": "jenis_ujian", "width": "7%" },           // jenis ujian
            {
                data: "record_id", "width": "5%", "render": function (data, type, row) {
                    return '<a href="#" onclick="Copy(' + "'" + (row['record_id']) + "','" + (row['registration_id']) + "'" + ')" class="badge badge-primary"><i class="fa fa-mobile" aria-hidden="true"></i> Copy</a>';
                }
            },
        ],
        "order": [[7, "asc"]],
        "pageLength": 15,
        "lengthChange": false,
        "columnDefs": [
            {
                "targets": [0],
                "visible": false,
                "searchable": false
            }]
    });
}

function Copy(record_id, registration_id) {
    var params = {
        record_id: record_id,
        registration_id: registration_id
        //event_id: event_id,
    };

    console.log(params);

    $.confirm({
        title: 'Konfirmasi',
        content: 'Anda akan menyalin data?',
        theme: 'material',
        closeIcon: true,
        animation: 'rotateX',
        closeAnimation: 'rotateX',
        animateFromElement: false,
        opacity: 0.5,
        type: 'blue',
        buttons: {
            'confirm': {
                text: 'Lanjutkan',
                btnClass: 'btn-blue',
                action: function () {
                    $.ajax({
                        type: 'POST',
                        url: base_url + "/CopyToLAN/Copy",
                        data: params,
                        success: function (resultData) {
                            $.alert({
                                title: resultData.header,
                                content: resultData.body,
                                animation: 'rotateX',
                                type: resultData.type,
                                theme: 'bootstrap',
                                closeAnimation: 'rotateXR',
                                backgroundDismiss: true,
                                buttons: {
                                    okay: {
                                        text: 'Tutup',
                                        btnClass: 'btn-blue',
                                        action: function () {
                                            $('#table_list').DataTable().ajax.reload();
                                        }
                                    }
                                }
                            });
                        },
                        error: function (XMLHttpRequest, textStatus, errorThrown) {
                            $.alert({
                                title: "Error Script Code",
                                content: XMLHttpRequest,
                                animation: 'rotateX',
                                type: "red",
                                theme: 'material',
                                closeAnimation: 'rotateXR',
                                backgroundDismiss: true,
                                buttons: {
                                    oke: {
                                        text: 'Tutup',
                                        btnClass: 'btn-blue',
                                        action: function () {
                                            //----
                                        }
                                    }
                                }
                            });
                        }
                    });
                }
            },
            cancel: function () {
                // Do Nothing
            }
        }
    });
}

function JSONDate(dateStr) {
    var m, day;
    jsonDate = dateStr;
    var d = new Date(parseInt(jsonDate.substr(6)));
    m = d.getMonth() + 1;
    if (m < 10)
        m = '0' + m
    if (d.getDate() < 10)
        day = '0' + d.getDate()
    else
        day = d.getDate();
    return (day + '/' + m + '/' + d.getFullYear())
}