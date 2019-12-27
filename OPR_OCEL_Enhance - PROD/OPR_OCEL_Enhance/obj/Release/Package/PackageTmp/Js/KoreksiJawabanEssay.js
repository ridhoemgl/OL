var base_url = $('#urlPath').val();
var base_url = $('#urlPath').val();
var glb_data = null;
var indx = 0;
var glob_RECORD = null;
var glob_CORRECTION = null;
var glob_SCORENOW = 0;

function loadGrid() {

    $("#gridRequest").kendoGrid({
        dataSource: {
            type: "json",
            transport: {
                read: {
                    url: $("#urlPath").val() + "/KoreksiJawabanEssay/readRequest",
                    contentType: "application/json",
                    type: "POST",
                    cache: false,
                },
                parameterMap: function (data, operation) {
                    return kendo.stringify(data);
                }
            },
            pageSize: 10,
            serverPaging: true,
            serverFiltering: true,
            serverSorting: true,
            schema: {
                data: "Data",
                total: "Total",
                model: {
                    id: "CORRECTION_PID",
                    fields: { //semua field tabel/vw dari db
                        CORRECTION_PID: { type: "string", filterable: true, sortable: true, editable: false },
                        RECORD_ID: { type: "string", filterable: true, sortable: true, editable: false },
                        NRP_ACESSOR: { type: "string", filterable: true, sortable: true, editable: false },
                        NRP_KARYAWAN: { type: "string", filterable: true, sortable: true, editable: false },
                        NAME: { type: "string", filterable: true, sortable: true, editable: false },
                        INSERT_DATE: { type: "string", filterable: true, sortable: true, editable: false },
                        STATUS_CORRECTION: { type: "string", filterable: true, sortable: true, editable: false },
                        STATUS_DESC: { type: "string", filterable: true, sortable: true, editable: false },
                        REGISTRATION_ID: { type: "string", filterable: true, sortable: true, editable: false },
                        DSTRCT_CODE: { type: "string", filterable: true, sortable: true, editable: false },
                        DEPARTMENT: { type: "string", filterable: true, sortable: true, editable: false },
                        QUESTION_TYPE: { type: "number", filterable: true, sortable: true, editable: false },
                        EXAM_TYPE: { type: "number", filterable: true, sortable: true, editable: false },
                        EXAM_DESC: { type: "string", filterable: true, sortable: true, editable: false },
                        TYPE_DESC: { type: "string", filterable: true, sortable: true, editable: false },
                        EXAM_LOCATIONS: { type: "string", filterable: true, sortable: true, editable: false }
                    }
                }
            }
        },

        editable: {
            //confirmation: "Anda yakin akan menghapus data ini ?",
            mode: "popup"
        },
        resizable: true,
        height : 388,
        sortable: true,
        filterable: true,
        pageable: {
            refresh: true,
            buttonCount: 10,
            input: true,
            pageSizes: [10, 50, 100],
            info: true
        },
        columns: [
            {title: "Action", command: [{
                name: "btn_koreksi", text: " Koreksi", click: add_new_mapp
                }],  width: "80px", 
                locked : true,
                lockable : false, attributes: { style: "text-align: center" }, headerAttributes: { style: "text-align: center" }
            },
            {
                title: "No.",
                width: "40px", 
                locked : true,
                lockable : false,
                template: "#= ++RecNumerEq #",
                filterable: false,
                sortable: false,
                editable: false,
                attributes: { style: "text-align: center" }
            },
            { field: "NRP_ACESSOR", title: "NRP Asessor", 
            locked : true,
            lockable : false, width: "140px", attributes: { style: "text-align: center" } },
            { field: "NRP_KARYAWAN", 
            locked : true,
            lockable : false, title: "NRP Peserta", width: "140px", attributes: { style: "text-align: center" } },
            { field: "NAME", title: "Nama", 
            locked : true,
            lockable : false, width: "220px", attributes: { style: "text-align: left" } },
            { field: "STATUS_CORRECTION", title: "Status Koreksi", template: "#= STATUS_CORRECTION == 1 ? '<center>CORRECTED</center>' : '<center>BELUM<?center>'#", width: "140px", attributes: { style: "text-align: center" } },
            { field: "EXAM_DESC", title: "Jenis Ujian", width: "130px", attributes: { style: "text-align: left" } },            
            { field: "TYPE_DESC", title: "Jenis Soal", width: "130px", attributes: { style: "text-align: left" } },            
            { field: "EXAM_LOCATIONS", title: "Lokasi Ujian", width: "130px", attributes: { style: "text-align: center" } },            
            
        ],

        dataBinding: function () {
            window.RecNumerEq = (this.dataSource.page() - 1) * this.dataSource.pageSize();
        }
    });
}

function add_new_mapp(e) {
    e.preventDefault();

    var tr = $(e.target).closest("tr");

    var data = this.dataItem(tr);

    glob_RECORD = data.RECORD_ID;
    glob_CORRECTION = data.CORRECTION_PID;
    var sVW_QUESTION_ON_EXAMPROC = {
        REGISTRATION_ID: data.REGISTRATION_ID,
        JENIS_SOAL: data.QUESTION_TYPE,
        RECORD_ID: glob_RECORD
    };
    
    $.ajax({
        url: base_url + "/KoreksiJawabanEssay/RequestSoal",
        contentType: "application/json",
        dataType: "json",
        type: 'POST',
        cache: false,
        data: JSON.stringify(sVW_QUESTION_ON_EXAMPROC),
        success: function (data) {
            glob_SCORENOW = parseFloat(data.ScoreNow);
            $('#LBL_MAXSCORE').text(data.max_val);

            var string_to_append = "";
            $('#div_tampung_soal').empty();
            $.each(data.Question, function (i, value) {
                string_to_append += "<br>";
                string_to_append += "<b>Pertanyaan No. "+value._NO+"</b>";
                string_to_append += "<p id='"+value.QA_ID+"' class='p-0'>"+value.QUESTION_CONTENT+"</p>";
                string_to_append += "<b>Jawaban Admin</b>";
                string_to_append += "<p id='ADM"+value.QA_ID+"' class='p-0'>"+value.ANSWER_1+"</p>";
                string_to_append += "<b>Jawaban User</b>";
                string_to_append += "<p id='USR"+value.QA_ID+"' class='p-0 J_index'>"+value.ANSWER_USER+"</p>";
                string_to_append += "<h6>Skor</h6>";
                if(value.JENIS_SOAL == 3){
                    string_to_append += "<input class='form-control SCOREHITUNG' id='SCR_" + value._NO + "' type='text' onkeyup='AllowNumerics(SCR_"+value._NO+" , "+ data.max_val +")' maxlength='2' style='width:7%' />";
                }else if(value.JENIS_SOAL == 4){
                    string_to_append += "<input class='form-control SCOREHITUNG' id='SCR_" + value._NO + "' type='text' onkeyup='AllowDecimalNumeric(SCR_"+value._NO+" , "+ data.max_val +")' maxlength='4' style='width:7%' />";
                }
                string_to_append += "<hr />";
            });
            $('#div_tampung_soal').append(string_to_append);
           
            var _NO = data.Question._NO;
            var QUESTION_CONTENT = data.Question.QUESTION_CONTENT;
            var ANSWER_1 = data.Question.ANSWER_1;
            var ANSWER_USER = data.Question.ANSWER_USER;
            
            $('#lbl_pertanyaan_no').html(_NO);
            $('#lbl_question_content').html(QUESTION_CONTENT);
            $('#answer1').html(ANSWER_1);
            $('#answeruser').html(ANSWER_USER);
        }
    });

    $('#skorjawaban').show();
    $('#div_request').hide();
}

$(".SCOREHITUNG").on("keypress keyup blur",function (event) {
    $(this).val($(this).val().replace(/[^0-9\.]/g,''));
    if ((event.which != 46 || $(this).val().indexOf('.') != -1) && (event.which < 48 || event.which > 57)) {
        event.preventDefault();
    }
});

$("#btn_submit").click(function () {
    var Jm_pertanyaan = $('.SCOREHITUNG').length;

    var MaxVal = parseInt($('#LBL_MAXSCORE').text());

    var Jumlah = 0;
    var kosong = false;
    for (var i = 1; i <= Jm_pertanyaan ; i++) {
        if($('#SCR_' + i).val()){
            kosong = false;
            Jumlah += parseFloat($('#SCR_' + i).val());
        }else{
            kosong = true;
            break;
        }

    }

    if(kosong == false){
    var ScorJawaban  = (Jumlah/ (Jm_pertanyaan * MaxVal)) * 100;
    var Score = (ScorJawaban + glob_SCORENOW) / 2;
    
    // console.log("Jumlahnya : " + Jumlah/Jm_pertanyaan);
    // console.log("Jumlahn Soal : " + Jm_pertanyaan);
    // console.log("Jumlahn Real : " + ScorJawaban);
    // console.log("Skor Jawban : " + Jumlah);
    // console.log("Gloob : " + glob_SCORENOW);
    // console.log("Skoore : "+Score);
    if(glob_SCORENOW == 0){
        Score = ScorJawaban
    }
    $.confirm({
        title: 'Konfirmasi Penilaian',
        content: 'Dengan Penilaian Anda sekarang, Hasilnya adalah <br><b>Skor Penilaian Anda Sebelum Dibobotkan : ' + Jumlah +" dari "+ (Jm_pertanyaan * MaxVal) +"</b><br>Nilai Hasil = "+ ScorJawaban +"<br>Nilai Sebelumnya :  " + glob_SCORENOW + "<br>Nilai Akhir Sebelum Pembobotan: "+Score,
        escapeKey: 'cancelAction',
        animation: 'scale',
        theme: 'material',
        backgroundDismiss: false,
        backgroundDismissAnimation: 'glow',
        buttons: {
            confirm: {
                btnClass: 'btn-blue',
                text: 'Konfirmasi',
                action: function () {
                    $.ajax({
                        url: $("#urlPath").val() + "/KoreksiJawabanEssay/ConfirmationSoal",
                        type: "POST",
                        data: {
                            RECORD_ID: glob_RECORD,
                            CORRECTION_PID: glob_CORRECTION,
                            SCORE: Math.round(Score)
                        },
                        success: function (response) {
                            if (response.status == true) {
                                $.ajax({
                                    url: $("#urlPath").val() + "/KoreksiJawabanEssay/Push_Correct_details",
                                    type: "POST",
                                    contentType: "application/json; charset=utf-8",
                                    dataType: "json",
                                    data : JSON.stringify(createJSON()),
                                    success: function(result){
                                        $.alert({
                                            title: result.header,
                                            backgroundDismiss: false,
                                            backgroundDismissAnimation: 'glow',
                                            content: result.body,
                                            theme: 'material',
                                            type: result.type,
                                            animation: 'rotateX',
                                            closeAnimation: 'rotateYR'
                                        });
                                        
                                        $("#gridRequest").data("kendoGrid").dataSource.read();

                                    },
                                    error: function (error) {
                                        alert("failed in opening Trade Contribs file !!!");
                                    }
                                });
                                $('#skorjawaban').hide(0);
                                $('#div_request').show(50);
                            }
                            else if(response.status == false){
                                $.alert({
                                    title: response.MESSAGE_HEADER,
                                    content: response.MESSAGE_BODY,
                                    theme: 'material',
                                    backgroundDismiss: false,
                                    backgroundDismissAnimation: 'glow',
                                    type: response.TYPE,
                                    animation: 'rotateX',
                                    closeAnimation: 'rotateYR'
                                });
                            }
                        }
                    });
                }
            },
            cancelAction: {
                text: 'Batal'
            }
        }
    });
    }else{
        $.alert({
            title: '<strong>Koreksi Bermasalah</strong>',
            content: 'Silahkan periksa kembali koreksi anda, sistem mendeteksi masih ada field skor yang belum Anda isi',
            icon: 'fa fa-exclamation-triangle',
            animation: 'Rotate',
            closeAnimation: 'top',
            type: 'red'
        });
    }
});

function createJSON() {
    jsonObj = [];
    var i = 1;
    $(".J_index").each(function() {
        var id = $(this).prop('id');
        var QA_ID = id.substring(3, id.length);
        var NILAI = parseFloat($('#SCR_'+i).val());
        var CORRECTION_PID = glob_CORRECTION;

        item = {};

        item["CORRECTION_PID"] = CORRECTION_PID;
        item["QA_ID"] = QA_ID;
        item["NILAI"] = NILAI;

        jsonObj.push(item);
        i++;
    });

    return jsonObj;
}

function RenderQuestion(param_data) {
    $('#h_txt_QA_ID').val(param_data.QA_ID);
    $('#lbl_pertanyaan_no').text("Pertanyaan No. " + param_data._NO);
    $('#answer1').text(param_data.ANSWER_1);
    $('#answeruser').text(param_data.ANSWER_USER);
}

function show_question(e) {
    indx = parseInt(e);
    var data_source = glb_data[e];

    RenderQuestion(data_source);
}

function AllowNumerics(Obj , max){
    var Obj_id = Obj.id;
    var Values_obj = Obj.value;
    var result = '';
    if($.isNumeric(Values_obj)){
        if(parseInt(Values_obj) > max){
            result =null;
        }else{
            result = Values_obj;
        }
    }else{
        result = Values_obj.replace(/\D/g,'');
    }

    $('#'+Obj_id).val(result);
}

function AllowDecimalNumeric(Obj , max){

    var Obj_id = Obj.id;
    var Values_obj = Obj.value;
    var result = '';
    if($.isNumeric(Values_obj)){
        if(parseInt(Values_obj) > max){
            result =null;
        }else{
            result = Values_obj;
        }
    }else{
        result = Values_obj.replace(/[^\d.]/g, '');
    }

    $('#'+Obj_id).val(result);

    if($.isNumeric($('#'+Obj_id).val())){
        if( $('#'+Obj_id).val() > max){
            $('#'+Obj_id).val(null);
        }
    }
}

$("#back_to").click(function () {
    $('#skorjawaban').hide();
    $('#div_request').show();
});

$(document).ready(function () {

    loadGrid();
    
});