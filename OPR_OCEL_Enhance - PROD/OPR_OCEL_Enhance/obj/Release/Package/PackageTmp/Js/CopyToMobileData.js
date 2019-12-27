var base_url = $('#urlPath').val();

$(document).ready(function () {
    GetTaskDetail();
});

function GetTaskDetail() {

    if ($.fn.DataTable.isDataTable('#table_list')) {
        $('#table_list').DataTable().destroy();
    }
    $('#table_list tbody').empty();

    $('#table_list').DataTable({
        ajax: base_url + '/CopyToMobile/AjaxReadNewRegistration',
        destroy: true,
        scrollX: true,
        fixedHeader: true,
        scrollCollapse: true,
        fixedColumns:   {
            leftColumns: 2
        },
        "columns": [
            { "data": "RECORD_ID" },
            { "data": "REGISTRATION_ID" },
            { "data": "EVENT_ID" },
            { "data": "STUDENT_ID", "width": "6%" },
            { "data": "DSTRCT_CODE", "width": "5%" },
            { "data": "NAMA", "width": "15%" },

            { "data": "REGISTRATION_ID", "width": "10%" },
            { "data": "MODULE_NAME", "width": "11%" },
            { "data": "POSITION_DESC", "width": "15%" },
            {
                "data": "REGISTRATION_DATE", "width": "9%", render: function (data, type, row) {
                    return JSONDate(data);
                }
            },
            {
                "data": "QUESTION_TYPE", "width": "11%", render: function (data, type, row) {
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
            { "data": "NUMBER_OF_QUESTION", "width": "7%" },
            { "data": "DURATION_MINUTE", "width": "7%" },
            {
                "data": "EXAM_TYPE", "width": "7%", render: function (data, type, row) {
                    if (data == 1) {
                        return "Assesmen";
                    } else if (data == 2) {
                        return "Training";
                    }
                }
            },
            {
                data: "RECORD_ID", "width": "5%", "render": function (data, type, row) {
                    return '<a href="#" onclick="Confirmation('+"'" + (row['RECORD_ID']) + "','" + (row['REGISTRATION_ID']) + "','" + (row['EVENT_ID']) + "'" + ')" class="badge badge-primary"><i class="fa fa-mobile" aria-hidden="true"></i> Copy</a>';
                }
            }
        ],
        "order": [[7, "asc"]],
        "pageLength": 15,
        "lengthChange": false,
        "columnDefs": [
            {
                "targets": [0, 1, 2],
                "visible": false,
                "searchable": false
            }]
    });
}

function Confirmation(record_id, registration_id, event_id) {
    var params = {
        record_id: record_id,
        event_id: event_id,
        registration_id: registration_id
    };

    console.log(params);

    $.confirm({
        title: 'Konfirmasi',
        content: 'Anda akan menyalin data dari server lokal ke DMZ 1Pama ?',
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
                        url: base_url + "/CopyToMobile/MoveLanTomodb",
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