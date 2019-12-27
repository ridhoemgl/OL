var data_from_bag = null;
//var base_url = $('#urlPath').val();
var base_url = $('#urlPath').val();//+"/APPS/OCEL_DEV_CPMD";
$(document).ready(function () {
    data_from_bag = JSON.parse($('#json_val_bag').val());

    $('#btn_back_list').click(function () {
        $('#div_detail').hide(0);
        $('#Mobile_examList').show(0);
    });

    $('#div_detail').hide(0);
});

function RegistrationAction(aksi , task_id , record_id , step , module_id){
    var Alowed = false;
    var ImManager = parseInt($('#input_isman').val());
    var NeedManagerPosition = [2];

    if(jQuery.inArray(module_id, NeedManagerPosition) && ImManager != 1){
        Alowed = false;
    }else{
        Alowed = true;
    }

    if(Alowed == ImManager){
        $.confirm({
            title: 'Registrasi Ujian',
            content: aksi+'<br>Proses ini akan sedikit membutuhkan waktu untuk melakukan pengacakan soal untuk Anda.</b>.',
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

                        $('body').loadingModal({
                            position: 'auto',
                            text: '',
                            color: '#fff',
                            opacity: '0.7',
                            backgroundColor: 'rgb(0,0,0)',
                            animation: 'circle' // Pilihan : rotatingPlane , wave , wanderingCubes, spinner, chasingDots, threeBounce, circle, cubeGrid, fadingCircle, foldingCube
                        });

                        $.ajax({
                            url: base_url + "/TaskListExam/RegisterExam",
                            type: "POST",
                            data: {
                                NRP_EMP: $('#input_nrp').val(),
                                TASK_ID: task_id
                            },
                            cache: false,
                            success: function (response) {
                                
                                $('body').loadingModal('hide');
                                $('body').loadingModal('destroy');
                                $.alert({
                                    title: response.title,
                                    content: response.content,
                                    type: response.type,
                                    animation: 'zoom',
                                    draggable: true,
                                });

                                window.setTimeout(function () {
                                    window.location.href = base_url + '/TaskListExam';
                                }, 2000);

                            },
                            error: function (jqXHR, textStatus, errorThrown) {
                                $('body').loadingModal('hide');
                                $('body').loadingModal('destroy');
                                $.alert({
                                    title: "Koneksi Error",
                                    content: "Perikasa Koneksi Anda !!<br>" + errorThrown + "<br>" + textStatus,
                                    type: "red",
                                    animation: 'zoom',
                                    draggable: false,
                                });
                            }
                        });
                    }
                },
                cancel: function(){
                    // Do Nothing
                }
            }
        });
    }else{
        set_error_alert("Jabatan Belum Sesuai" , "Maaf materi ini hanya bisa dibuka oleh jabatan minimal <b>Section Head<b>"); 
    }
}

function Willread(aksi , task_id , record_id , step , module_id){

    var Alowed = false;
    var ImManager = parseInt($('#input_isman').val());
    var NeedManagerPosition = [2];

    if(jQuery.inArray(module_id, NeedManagerPosition) && ImManager != 1){
        Alowed = false;
    }else{
        Alowed = true;
    }

    if(Alowed == ImManager){
        $.confirm({
            title: 'Informasi User',
            content: 'Anda akan '+aksi+'<br>Anda akan kami arahkan ke halaman baca materi ketika Anda klik <b>Lanjutkan</b>.',
            theme: 'material',
            closeIcon: true,
            animation: 'rotateX',
            closeAnimation: 'rotateX',
            animateFromElement: false,
            opacity: 0.5,
            type: 'orange',
            buttons: {
                'confirm': {
                    text: 'Lanjutkan',
                    btnClass: 'btn-orange',
                    action: function(){
                        window.location.href = base_url+'/TaskListExam/ReadingExam?task_id='+task_id+'&record_id='+record_id+'&step='+parseInt(step);
                    }
                },
                cancel: function(){
                    // Do Nothing
                }
            }
        });
    }else{
        set_error_alert("Jabatan Belum Sesuai" , "Maaf materi ini hanya bisa dibuka oleh jabatan minimal <b>Section Head<b>"); 
    }

}

$('#btn_cancel').click(function () {
    $('#Mobile_examList').hide(0);
    $('#div_details_exam').hide(0);
    $('#div_detail').show(0);
})

function GetDataOnClick(aksi, task_id, record_id, step, module_id) {

    $('body').loadingModal({
        position: 'auto',
        text: '',
        color: '#fff',
        opacity: '0.5',
        backgroundColor: 'rgb(0,0,0)',
        animation: 'chasingDots' // Pilihan : rotatingPlane , wave , wanderingCubes, spinner, chasingDots, threeBounce, circle, cubeGrid, fadingCircle, foldingCube
    });

    $.ajax({
        url: base_url + "/TaskListExam/GetListDetail",
        type: "GET",
        data: {
            record: record_id
        },
        cache: false,
        success: function (response) {
            var dt_ = response.dt;
            console.log(dt_)
            $('#Mobile_examList').hide(0);
            $('#div_detail').hide(0);
                $('#a4head').hide(0);
                $('#lbl_nrp').text(dt_[0].STUDENT_ID);
                $('#lbl_dstrct').text(dt_[0].DSTRCT_CODE);
                $('#lbl_egi').text(dt_[0].MODULE_NAME);
                $('#lbl_jml_soal').text(dt_[0].NUMBER_OF_QUESTION);
                $('#lbl_min_value').text(dt_[0].PASSING_GRADE_PERCENT + ' %');
                $('#lbl_departemen').text(dt_[0].DEPARTMENT);
                $('#lbl_jenis_soal').text(dt_[0].JENIS_SOAL);
                $('#lbl_duration_minutes').text(dt_[0].DURATION_MINUTE);
                $('#lbl_jenis_ujian').text("Ujian Final");
                $('#lbl_sia_waktu').text(dt_[0].REMINDING_TIME);
                
                if (dt_[0].RANDOMIZED_ANSWER == true) {
                    $('#lbl_random').text("Soal Telah Melalui Pengacakan");
                } else {
                    $('#lbl_random').text("Telah Ditentukan")
                }

                //---------Set Digunakan pengecekan saat menekan tombol lanjutkan---
                glb_self = dt_[0].IS_SELF_ASSESMENT;
                glb_exam_stat = dt_[0].EXAM_STATUS;
                glb_event_id = dt_[0].EVENT_ID;
                glb_quest_pid = dt_[0].RECORD_ID;
                glb_posisi = dt_[0].EXAM_STATUS;
                glb_type_soal = dt_[0].QUESTION_TYPE;
                glb_record_id = dt_[0].RECORD_ID;

                //----- ---------------------------------------------------------------

                $('#lbl_registered_date').text(parseJsonDate(dt_[0].REGISTRATION_DATE));
                $('#lbl_position').text(dt_[0].POSITION_DESC);
                $('#lbl_jenis_ujian').text(dt_[0].JENIS_UJIAN_DESC);
            $('#lbl_period').text(dt_[0].PERIOD)
            $('#div_details_exam').show();

            $('body').loadingModal('hide');
            $('body').loadingModal('destroy');
        },
        error: function (jqXHR, textStatus, errorThrown) {
        $('body').loadingModal('hide');
        $('body').loadingModal('destroy');
        $.alert({
            title: "Koneksi Error",
            content: "Perikasa Koneksi Anda !!<br>" + errorThrown + "<br>" + textStatus,
            type: "red",
            animation: 'zoom',
            draggable: false,
        });
    }
    });

}

function parseJsonDate(jsonDateString) {
    var month, day;
    var date = new Date(new Date(parseInt(jsonDateString.replace('/Date(', '')))),
        month = ("0" + (date.getMonth() + 1)).slice(-2),
        day = ("0" + date.getDate()).slice(-2);
    hours = ("0" + date.getHours()).slice(-2);
    minutes = ("0" + date.getMinutes()).slice(-2);
    seconds = ("0" + date.getSeconds()).slice(-2);

    return [date.getFullYear(), month, day].join("-");

}

function GetTaskDetail(task_id) {
    var idx = parseInt(task_id.substring(1, 0));
    var dt = data_from_bag[idx].ChildData;

    $('#Mobile_examList').hide(0);
    $('#div_detail').show(0);

    if ($.fn.DataTable.isDataTable('#table_detail')) {
        $('#table_detail').DataTable().destroy();
    }
    $('#table_detail tbody').empty();
    $('#table_detail').DataTable({
        data: dt,
        destroy: true,
        "columns": [
            { "data": "STEP" },
            { "data": "RECORD_ID" },
            { "data": "TASK_ID" },
            {
                "data": "MODULE_SUB_ID", render: function (data, type, row) {
                    return parseInt(data);
                }
            },
            { "data": "MODULE_ID" },
            { "data": "EXAM_STATUS" },
            { "data": "MODULE_SUB_NAME", "width": "20%" },
            {
                "data": "DURATION_MINUTE", "width": "6%", render: function (data, type, row) {
                    return data + " Menit";
                }
            },
            {
                "data": "REGISTRATION_DATE", "width": "9%", render: function (data, type, row) {
                    return JSONDate(data);
                }
            },
            { "data": "SUPPORT_LINK" , "width": "20%", render: function (data, type, row) {
                if (row['EXAM_STATUS'] == 1 && data == 0 && row["SUPPORT_LINK"] === "00") {
                    return "Semua Materi";
                }else if (row['EXAM_STATUS'] == 2 && data == 0 && row["SUPPORT_LINK"] === "00") {
                    return "Semua Materi";
                }else{
                    return data;
                }
            }},
            {
                "data": "PERCENT_COMPLETE","className": "text-center", "width": "10%" ,render: function (data, type, row) {
                    return data + " %";
                }
            },
            {
                "data": "REMINDING_TIME","className": "text-center", "width": "10%", render: function (data, type, row) {
                    return data + " Menit";
                }
            },
            {
                "data": "UPDATE_REMINDING_TIME", "width": "10%", render: function (data, type, row) {
                    if (row['EXAM_STATUS'] == 1 && data == null && row["SUPPORT_LINK"] === "00") {
                        return "Belum registrasi"
                    }else if (data == null) {
                        return "Belum Dibaca"
                    } else {
                        return JSONDate(data)
                    }
                }
            },
            {
                data: "IS_LOCKED", "width": "50px", "render": function (data, type, row) {
                    if (data == 1) {
                        return '<span class="badge badge-danger"><i class="fa fa-lock" aria-hidden="true"></i> Terkunci</span>'
                    }else if (row['EXAM_STATUS'] == 1 && data == 0 && row["SUPPORT_LINK"] === "00") {
                        return '<span class="badge badge-light"><i class="fa fa-file-text-o" aria-hidden="true"></i> Registrasi</span>'
                    }else if (row['EXAM_STATUS'] == 3 && data == 0) {
                        return '<span class="badge badge-light"><i class="fa fa-cog" aria-hidden="true"></i> Proses</span>'
                    } else if (row['EXAM_STATUS'] == 1 && data == 0) {
                        return '<span class="badge badge-primary"><i class="fa fa-unlock" aria-hidden="true"></i> Terbuka</span>'
                    } else if (row['EXAM_STATUS'] == 5 && data == 0) {
                        return '<span class="badge badge-success"><i class="fa fa-check" aria-hidden="true"></i> Selesai</span>'
                    } else if (row['EXAM_STATUS'] == 2 && data == 0 && row["SUPPORT_LINK"] === "00") {
                        return '<span class="badge badge-primary"><i class="fa fa-registered" aria-hidden="true"></i> Diregistrasi</span>'
                    }
                }
            },
            {
                data: "IS_LOCKED", "width": "50px", "render": function (data, type, row) {
                    if (data == 1) {
                        return ''
                    }else if (row['EXAM_STATUS'] == 1 && data == 0 && row["SUPPORT_LINK"] === "00") {
                        return '<a href="#" onclick="RegistrationAction(' + "'Anda telah mencapai level untuk ujian. Proses selanjutnya adalah mendaftarkan diri Anda agar memperoleh soal untuk dikerjakan.'" + ',' + "'" + (row['TASK_ID']) + "','" + (row['RECORD_ID']) + "'," + (row['STEP']) + "," + parseInt(row['MODULE_ID'])+ ')" class="badge badge-primary"><i class="fa fa-file-text-o" aria-hidden="true"></i> Acak Soal</a>'
                    }else if (row['EXAM_STATUS'] == 2 && data == 0 && row["SUPPORT_LINK"] === "00") {
                        return '<a href="#" onclick="GetDataOnClick(' + "'oke'" + ',' + "'" + (row['TASK_ID']) + "','" + (row['RECORD_ID']) + "'," + (row['STEP']) + "," + parseInt(row['MODULE_ID']) + ')" class="badge badge-primary"><i class="fa fa-pencil" aria-hidden="true"></i> Kerjakan</a>'
                    }else if (row['EXAM_STATUS'] == 3 && data == 0) {
                        return '<a href="#" onclick="Willread(' + "'Memulai untuk membaca materi baru yang telah terbuka.'" + ',' + "'" + (row['TASK_ID']) + "','" + (row['RECORD_ID']) + "'," + (row['STEP']) + "," + parseInt(row['MODULE_ID'])+ ')" class="badge badge-primary"><i class="fa fa-hand-o-right" aria-hidden="true"></i> Lanjutkan</a>'
                    } else if (row['EXAM_STATUS'] == 1 && data == 0) {
                        return '<a href="#" onclick="Willread(' + "'Memulai untuk membaca materi baru yang telah terbuka.'" + ',' + "'" + (row['TASK_ID']) + "','" + (row['RECORD_ID']) + "'," + (row['STEP']) + "," + parseInt(row['MODULE_ID'])+ ')" class="badge badge-primary"><i class="fa fa-book" aria-hidden="true"></i> Baca</a>'
                    } else if (row['EXAM_STATUS'] == 5 && data == 0) {
                        return '<a href="#" onclick="Willread(' + "'Membaca lagi materi yang sudah terselesaikan sebelumnya,.'" + ',' + "'" + (row['TASK_ID']) + "','" + (row['RECORD_ID']) + "'," + (row['STEP']) + "," + parseInt(row['MODULE_ID'])+ ')" class="badge badge-primary"><i class="fa fa-refresh" aria-hidden="true"></i> Baca Lagi</a>'
                    }
                }
            }
        ],
        "order": [[0, "asc"]],
        "pageLength": 8,
        "lengthChange": false,
        "columnDefs": [
            {
                "targets": [ 0 , 1 , 2 , 3 , 4 , 5],
                "visible": false,
                "searchable": false
            }]
    });
}

function set_error_alert(header_message , message_error) {
    $.alert({
        title: header_message,
        theme: 'material',
        closeIcon: false,
        animation: 'rotate',
        type: 'red',
        content: message_error,
        draggable: true,
        dragWindowGap: 0
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