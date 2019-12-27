

var glb_self= false;
var glb_exam_stat = 0;
var glb_event_id = null;
var glb_quest_pid = null;
var glb_posisi = 0;
var glb_REGISTETR_ID = null;
var glb_type_soal = null;
var glb_record_id = null;
var glb_data;
var base_url = $('#urlPath').val();
$(document).ready(function() {
    $.ajax({
        url: $("#urlPath").val() + "/EmployeeExam/GetExamList",
        type: "GET",
        cache: false,
        success: function(response) {
            glb_data = response.data;
            render_card(response.data);
            //render_tables(response.data)
        }
    });
});
function render_card(res_data){
    var appd = '';
    $(res_data).each(function (index, data) {
        appd += '<div class="card col-md-4">';
        appd +=     '<div class="card-body">';
        appd +=         '<div class="table-responsive">';
        appd +=                '<table class="table">';
        appd +=                    '<tr>';
        appd +=                        '<td>KD. Registrasi</td>';
        appd +=                        '<td>'+ data.REGISTRATION_ID +'</td>';
        appd +=                    '</tr>';
        appd +=                    '<tr>';
        appd +=                        '<td>Jumlah Soal</td>';
        appd +=                        '<td>'+ data.NUMBER_OF_QUESTION +' Soal</td>';
        appd +=                    '</tr>';
        appd +=                    '<tr>';
        appd +=                        '<td>Progress</td>';
        appd +=                        '<td>'+ data.PERCENT_COMPLETE +' %</td>';
        appd +=                    '</tr>';
        appd +=                    '<tr>';
        appd +=                        '<td>Durasi</td>';
        appd +=                        '<td>'+ data.DURATION_MINUTE +' menit</td>';
        appd +=                    '</tr>';
        appd +=                    '<tr>';
        appd +=                        '<td>Sisa Waktu</td>';
        appd +=                        '<td>'+ data.REMINDING_TIME +' menit</td>';
        appd +=                    '</tr>';
        appd +=                    '<tr>';
        appd +=                        '<td>Study For Exam</td>';
                                        if (data.IS_SELF_ASSESMENT == true) {
        appd +=                        '<td><span class="label label-success">Ya , Berisi Materi</span></td>';                                    
                                        }else{
        appd +=                        '<td><span class="label label-primary">Tidak , Ini Ujian</span></td>';
                                        }
        
        appd +=                    '</tr>';
        appd +=                    '<tr>';
        appd +=                        '<td>Tanggal Registrasi</td>';
        appd +=                        '<td>'+ parseJsonDate(data.REGISTRATION_DATE) +'</td>';
        appd +=                    '</tr>';
        appd +=                    '<tr>';
        appd +=                        '<td>Asesor</td>';
        appd +=                        '<td>';
        appd +=                         SplitSparatedComma(data.KODE_ASESOR);
        appd +=                        '</td>';
        appd +=                    '</tr>';
        appd +=                '</table>';
                                if (data.IS_SELF_ASSESMENT == false) {
                                    if(parseInt(data.EXAM_STATUS) % 2 != 0){
                                        if(parseInt(data.EXAM_STATUS) != 4 && parseInt(data.EXAM_STATUS) != 5){
        appd +=                            "<button type='button' class='btn btn-primary btn-sm btn-block' onclick='GetDataOnClick("+index+")' style='width=100%'><i class='fa fa-book'></i> "+data.EXAM_STATUS_DESC+"</button>";
                                        }else{
        appd +=                            "<span class='badge badge-success badge-md'>"+data.EXAM_STATUS_DESC+"</span>";
                                        }
                                    }else{
        appd +=                            "<span class='badge badge-success badge-md'>"+data.EXAM_STATUS_DESC+"</span>";
                                    }
                                }else{
                                    if(data.EXAM_STATUS == 1 || parseInt(data.EXAM_STATUS) % 2 != 0){
        appd +=                             "<button type='button' class='btn btn-success btn-sm btn-block' onclick='GetDataOnClick("+index+")' style='width=100%'><i class='fa fa-book'></i> Read</button>";
                                    }else{
        appd +=                             "<span class='badge badge-success badge-md'>"+data.EXAM_STATUS_DESC+"</span>";
                                    }
                                }
        appd +=            '</div>';
        appd +=        '</div>';
        appd +=    '</div>&nbsp&nbsp&nbsp&nbsp';
    });

    $( "#Mobile_examList" ).append(appd);
}


// function render_tables(res_data) {
//     console.log(res_data);
//     var glob_tbl_TaskList = $('#tbl_TaskList').DataTable({
//         "data": res_data,
//         "columns": [
//             {
//                 "data": "id",
//                 render: function (data, type, row, meta) {
//                     return meta.row + meta.settings._iDisplayStart + 1;
//                 }
//             },
//             {
//                 "data": "REGISTRATION_ID",
//                 "name": "REGISTRATION_ID",
//                 orderable: false,
//                 render: function (data, type, row, meta) {
//                     return row.REGISTRATION_ID+" <br> Pada Distrik : "+row.DSTRCT_CODE
//                 }
//             },
//             {
//                 "data": "KODE_ASESOR",
//                 className: "text-center",
//                 render: function (data, type, row, meta) {
//                     var Acessors =  row.KODE_ASESOR;
//                     var ArrayAcessor = Acessors.split(",");
//                     var tmp = "<ol>";
//                     $.each(ArrayAcessor,function(i){
//                         tmp += "<li>"+ArrayAcessor[i]+"</li>"
//                      });
//                      tmp += "</ol>";

//                      return tmp;
//                 }
//             },
//             {
//                 "data": "NUMBER_OF_QUESTION",
//                 className: "text-center"
//             },
//             {
//                 "data": "DURATION_MINUTE",
//                 className: "text-center"
//             },
//             {
//                 "data": "IS_SELF_ASSESMENT",
//                 className: "text-center"
//             },
//             {
//                 "data": "PERCENT_COMPLETE",
//                 className: "text-center",
//                 render: function (data, type, row, meta) {
//                     return row.PERCENT_COMPLETE + '%';
//                 }
//             },
//             {
//                 "data": "REGISTRATION_DATE",
//                 className: "text-center"
//             },
//             {
//                 "data": null
//             },
//         ],
//         columnDefs: [{
//             // puts a button in the last column
//             targets: [8],
//             render: function(a, b, data, d) {
//                 if (data.IS_SELF_ASSESMENT != true) {
//                     if(parseInt(data.EXAM_STATUS) % 2 != 0){
//                         if(parseInt(data.EXAM_STATUS) != 4 && parseInt(data.EXAM_STATUS) != 5){
//                             return "<button type='button' class='btn btn-primary btn-sm' style='width=100%'><i class='fa fa-book'></i> "+data.EXAM_STATUS_DESC+"</button>";
//                         }else{
//                             return data.EXAM_STATUS_DESC;
//                         }
//                     }else{
//                         return data.EXAM_STATUS_DESC;
//                     }
//                 }else{
//                     if(data.EXAM_STATUS == 1){
//                         return "<button type='button' class='btn btn-success btn-sm' style='width=100%'><i class='fa fa-book'></i> Read</button>";
//                     }
//                     else if(parseInt(data.EXAM_STATUS) % 2 != 0){
//                         return "<button type='button' class='btn btn-success btn-sm' style='width=100%'><i class='fa fa-book'></i> Read</button>";
//                     }else{
//                         return data.EXAM_STATUS_DESC;
//                     }
//                 }
//             }
//         },{
//             targets: [7],
//             render: function(a, b, data, d) {
//                  return  parseJsonDate(data.REGISTRATION_DATE);
//             }
//         },{
//             targets: [0,1,7,4,8],
//             orderable : false
//         },{
//             targets: [5],
//             className: "text-center",
//             render: function(a, b, data, d) {
//                 if(data.IS_SELF_ASSESMENT == true){
//                     return '<span class="label label-success">Ya</span>';
//                 }else{
//                     return '<span class="label label-primary">Tidak</span>';
//                 }
//             }
//         }]
//     });

//     glob_tbl_TaskList.on("click", "button",
//         function() {
//             var data_clicked = (glob_tbl_TaskList.rows($(this).closest("tr")).data()[0]);
//             console.clear();
//             //console.log(data_clicked);
//             $('#Mobile_examList').hide(20, function() {
//                 $('#lbl_nrp').text(data_clicked.STUDENT_ID);
//                 $('#lbl_dstrct').text(data_clicked.DSTRCT_CODE);
//                 $('#lbl_egi').text(data_clicked.EGI);
//                 $('#lbl_jml_soal').text(data_clicked.NUMBER_OF_QUESTION);
//                 $('#lbl_min_value').text(data_clicked.PASSING_GRADE_PERCENT+' %');
//                 $('#lbl_departemen').text(data_clicked.DEPARTMENT);
//                 $('#lbl_jenis_soal').text(data_clicked.QUESTION_TYPE);
//                 if(data_clicked.RANDOMIZED_ANSWER == true){
//                     $('#lbl_random').text("Soal Telah Melalui Pengacakan");
//                 }else{
//                     $('#lbl_random').text("Telah Ditentukan")
//                 }

//                 //---------Set Digunakan pengecekan saat menekan tombol lanjutkan---
//                 glb_self = data_clicked.IS_SELF_ASSESMENT;
//                 glb_exam_stat = data_clicked.EXAM_STATUS;
//                 glb_event_id = data_clicked.EVENT_ID;
//                 glb_quest_pid = data_clicked.RECORD_ID;
//                 glb_posisi = data_clicked.EXAM_STATUS;
//                 glb_type_soal = data_clicked.QUESTION_TYPE;
//                 glb_record_id = data_clicked.RECORD_ID;

//                 //----- ---------------------------------------------------------------

//                 $('#lbl_registered_date').text(parseJsonDate(data_clicked.REGISTRATION_DATE));
//                 $('#lbl_position').text(data_clicked.POSITION_DESC);
//                 $('#lbl_jenis_ujian').text(data_clicked.JENIS_UJIAN_DESC);
//                 $('#lbl_period').text(data_clicked.PERIOD)
//                 $('#div_details_exam').show(10);
//             });
//         });
// }

function parseJsonDate(jsonDateString){
    var month, day;
    var date = new Date(new Date(parseInt(jsonDateString.replace('/Date(', '')))),
        month = ("0" + (date.getMonth() + 1)).slice(-2),
        day = ("0" + date.getDate()).slice(-2);
    hours = ("0" + date.getHours()).slice(-2);
    minutes = ("0" + date.getMinutes()).slice(-2);
    seconds = ("0" + date.getSeconds()).slice(-2);

    return  [date.getFullYear(), month, day].join("-");
    
}

function GetDataOnClick(e){
    var data_clicked = glb_data[e];
    console.log(data_clicked);
        $('#Mobile_examList').hide(20, function() {
        $('#a4head').hide(0);
        $('#lbl_nrp').text(data_clicked.STUDENT_ID);
        $('#lbl_dstrct').text(data_clicked.DSTRCT_CODE);
        $('#lbl_egi').text(data_clicked.EGI);
        $('#lbl_jml_soal').text(data_clicked.NUMBER_OF_QUESTION);
        $('#lbl_min_value').text(data_clicked.PASSING_GRADE_PERCENT+' %');
        $('#lbl_departemen').text(data_clicked.DEPARTMENT);
        $('#lbl_jenis_soal').text(data_clicked.QUESTION_TYPE);
        $('#lbl_duration_minutes').text(data_clicked.DURATION_MINUTE);
        $('#lbl_sia_waktu').text(data_clicked.REMINDING_TIME);
        if(data_clicked.RANDOMIZED_ANSWER == true){
            $('#lbl_random').text("Soal Telah Melalui Pengacakan");
        }else{
            $('#lbl_random').text("Telah Ditentukan")
        }

        //---------Set Digunakan pengecekan saat menekan tombol lanjutkan---
        glb_self = data_clicked.IS_SELF_ASSESMENT;
        glb_exam_stat = data_clicked.EXAM_STATUS;
        glb_event_id = data_clicked.EVENT_ID;
        glb_quest_pid = data_clicked.RECORD_ID;
        glb_posisi = data_clicked.EXAM_STATUS;
        glb_type_soal = data_clicked.QUESTION_TYPE;
        glb_record_id = data_clicked.RECORD_ID;

        //----- ---------------------------------------------------------------

        $('#lbl_registered_date').text(parseJsonDate(data_clicked.REGISTRATION_DATE));
        $('#lbl_position').text(data_clicked.POSITION_DESC);
        $('#lbl_jenis_ujian').text(data_clicked.JENIS_UJIAN_DESC);
        $('#lbl_period').text(data_clicked.PERIOD)
        $('#div_details_exam').show(10);
    });
}

function SplitSparatedComma (row) {
    var Acessors =  row;
    var ArrayAcessor = Acessors.split(",");
    var tmp = "<ol>";
    $.each(ArrayAcessor,function(i){
        tmp += "<li>"+ArrayAcessor[i]+"</li>"
     });
     tmp += "</ol>";

     return tmp;
}

$("#btn_cancel").click(function() {
    $("#div_details_exam").fadeOut(300,function() {
        $('#Mobile_examList').show(10);
        $('#a4head').show(0);
    });
});

$( "#btn_confirmation_exam" ).click(function() {
    $.confirm({
        title: 'Konfirmasi',
        content: 'Apakah anda akan melanjutkan proses ini ?',
        escapeKey: 'cancelAction',
        buttons: {
            confirm: {
                btnClass: 'btn-green',
                theme : 'material',
                text: 'Oke',
                action: function(){
                    if(glb_self == true){
                        window.location.href = $("#urlPath").val() + "/EmployeeExam/SelftExam?enc=" + glb_event_id + '?pid='+glb_quest_pid;
                    }else{
                        if(glb_posisi < 3){
                            request_exam();
                        }else if(glb_posisi == 3){
                            if(glb_type_soal == 1 || glb_type_soal == 2){
                                window.location.href = $("#urlPath").val() + "/EmployeeExam/ExamProcess?token=" + glb_record_id + '?Enc='+glb_event_id;
                            }else if(glb_type_soal == 3 || glb_type_soal == 4){
                                window.location.href = $("#urlPath").val() + "/EmployeeExam/ExamEssayProcess?token=" + glb_record_id + '?Enc='+glb_event_id;
                            }
                        }
                    }
                }
            },
            cancelAction: {
                text: 'Batal',
                action: function(){
                    $("#div_details_exam").fadeOut(300,function() {
                        $('#Mobile_examList').show(10);
                        $('#a4head').show(0);
                    });
                }
            }
        }
    });

    function request_exam(){
        $.ajax({
            url: base_url+"/InputRegistrasi/RequestPermission",
            cache: false,
            type: 'POST',
            data:{
                RECORD_ID : glb_quest_pid,
                EVENT_ID : glb_event_id
            },
            success: function(resp){
                $.alert({
                    title: resp.header,
                    content: resp.body+"<br>"+resp.Err,
                    theme: 'material',
                    type: resp.type,
                    buttons: {
                        okay: {
                            text: 'Ok',
                            btnClass: 'btn-'+resp.type,
                            action: function(){
                                if(resp.status == true){
                                    // if ( $.fn.DataTable.isDataTable('#tbl_TaskList') ) {
                                    //     $('#tbl_TaskList').DataTable().destroy();
                                    // }
                                      
                                    $('#Mobile_examList').empty();

                                    $.ajax({
                                        url: $("#urlPath").val() + "/EmployeeExam/GetExamList",
                                        type: "GET",
                                        cache: false,
                                        success: function(response) {
                                            render_card(response.data);
                                            $("#div_details_exam").fadeOut(300,function() {
                                                $('#Mobile_examList').show(10);
                                                $('#a4head').show(0);
                                            });
                                        }
                                    });
                                }
                            }
                        }
                    }
                });
            }
          });
    }
});