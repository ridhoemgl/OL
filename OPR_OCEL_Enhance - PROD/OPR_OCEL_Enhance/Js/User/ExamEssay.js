var base_url = $('#urlPath').val();
var glb_data = null;
var indx = 0;
var glb_dijawab = 0;
var glb_total_soal = 0;
var glb_NormalDuration = 0;
var glob_percentage = (parseFloat($('#h_txt_Percentagee').val()));;
var REMINDING_TIME = (parseInt($('#h_txt_RemindingTime').val()));
var TIME_C = 0;
$(document).ready(function () {
    if(REMINDING_TIME == 0){
        window.location.href = base_url+'/EmployeeExam';
    }
    else{
        glb_NormalDuration = parseInt($('#h_txt_durationMinutes').val());
        $("#answer1").kendoEditor();

        if(glob_percentage >= 99){
            $('#btn_submit').removeAttr('hidden');
            $('#btn_submit').show();
        }

        Pst_RequestSoal();
        if (REMINDING_TIME != 0) {
            var fiveMinutes = 60 * REMINDING_TIME,
            display = document.querySelector('#time');
            startTimer(fiveMinutes, display);

            var downloadTimer = setInterval(function () {
                document.getElementById("progressBar").value = 3600 - --fiveMinutes;
                if (fiveMinutes <= 0)
                    clearInterval(downloadTimer);
            }, 1000);
    }
    }
    
});

$('#btn_confirm_exam').click(function () {
    glb_data[indx].ANSWER_USER = $("#answer1").data("kendoEditor").value();
    if(!$("#answer1").data("kendoEditor").value()){
        $.alert({
            title: "Jawaban Anda Kosong",
            content: "Mohon dijawab pertanyaan ini dengan sepengetahuan Anda, Atau jika Anda tidak berkenan menjawab mohon berikan keterangan pada kolom isian dengan <b>'Saya Belum Menjawab'</b> dengan cara klik tombol <b>'Oke'</b>",
            type: "red",
            animation: 'scale',
            closeAnimation: 'zoom',
            buttons: {
                Oke: {
                    text: 'Oke',
                    btnClass: 'btn-red',
                    action: function(){
                        $("#answer1").data("kendoEditor").value("Saya Belum Menjawab");
                        $('#btn_confirm_exam').click();
                    }
                },
                Tutup: {
                    text: 'Tutup',
                    btnClass: 'btn-green'
                }
            }
        });
    }else{
        var sVW_QUESTION_ON_EXAMPROC = {
            QA_ID: $('#h_txt_QA_ID').val(),
            ANSWER_USER: glb_data[indx].ANSWER_USER,
            in_nrp : $('#h_txt_nrp').val(),
            in_dstrct : $('#h_txt_dstrtc').val()    
        }
        //console.log("Progress : "+glob_percentage);
        $.ajax({
            url: base_url + "/EmployeeExam/ConfirmationSoal",
            type: 'POST',
            dataType: "json",
            cache: false,
            data: JSON.stringify(sVW_QUESTION_ON_EXAMPROC),
            contentType: "application/json",
            success: function (responsi) {
                glb_dijawab = $('.list-group-item-success').size() + 1;
                $('#lbl_total_soal').text(glb_total_soal);
                $('#lbl_dijawab').text(glb_dijawab);
                glob_percentage = (glb_dijawab/glb_total_soal) * 100;
                $('#progress_jawab').attr('aria-valuenow', parseInt(glob_percentage)).css('width', parseInt(glob_percentage)+'%');
                var editor = $("#answer1").data("kendoEditor");
                editor.value(responsi.ANSWER_USER);
                if(responsi.session == false){
                    $.alert({
                        title: "Komputer Idle",
                        content: "Anda terlalu lama idle menyebapkan session komputer time out.<br> Klik Ok untuk melanjutkan",
                        icon: 'fa fa-warning',
                        type: "red",
                        animation: 'scale',
                        closeAnimation: 'zoom'
                    });
                }
                else if (responsi.type === "SUCCESS") {
                    $.notify({
                        title: "<strong>Status:</strong> ",
                        message: "Jawaban Dikonfirmasi",
                        type: 'success',
                        showProgressbar: true
                    }, {
                        delay: 500,
                        animate: {
                            enter: 'animated lightSpeedIn',
                            exit: 'animated lightSpeedOut'
                        }
                    });
                    $('#L' + (indx)).addClass('list-group-item-success').removeClass('list-group-item-danger');
                    if(glob_percentage >= 99 || (glb_total_soal == glb_dijawab)){
                        $('#btn_submit').removeAttr('hidden');
                        $('#btn_submit').show();
                    }
                } else {
                    $.alert({
                        title: "Koneksi Failed",
                        content: "Session komputer telah habis karena Anda terlalu lama Idle dalam soal ini." + "<br>" + "Klik Ok untuk melanjutkan ujian ini",
                        animation: 'rotateXR',
                        type: "red",
                        closeAnimation: 'zoom'
                    });
                }
            }
        });
    }
    
});

$('#btn_submit').click(function () {
    $.confirm({
        title: "Konfirmasi",
        type: 'blue',
        theme: 'modern',
        animation: 'scaleX',
        content: "Apakah Anda yakin akan mengkonfirmasi dan mengakhiri ujian ini ?<br>Anda tidak akan bisa mengulang setelah Anda menekan tombol '<b>Oke</b>'",
        closeIcon: 'aRandomButton',
        buttons: {
            Oke: {
                text: 'Oke',
                action: function () {
                    //console.log("RECORD ID : "+$('#h_txt_record_id').val()+" EVENT_ID : "+$('#h_txt_EVENT_ID').val())
                    $.ajax({
                        url: base_url + "/EmployeeExam/SubmitEssay",
                        type: 'POST',
                        cache: false,
                        data: {
                            RECORD_ID: $('#h_txt_record_id').val(),
                            EVENT_ID: $('#h_txt_EVENT_ID').val(),
                            Progress : parseInt(glob_percentage)
                        },
                        success: function (data) {
                            $.alert({
                                title: data.title,
                                content: data.content + " <br>" + data.error,
                                type: data.type,
                                animation: 'scale',
                                closeAnimation: 'zoom',
                                buttons: {
                                    Oke: {
                                        text: 'Oke',
                                        btnClass: 'btn-'+data.type,
                                        action: function(){
                                            window.location.href = base_url+'/EmployeeExam';
                                        }
                                    }
                                }
                            });
                        }
                    });
                }
            },
            cancel: function () { }
        }
    });
});


$('#btn_back_question').click(function() {
    if(indx > 0){
        indx--;
        var data_source = glb_data[indx];
        RenderQuestion(data_source);
    }
});

$('#btn_next_question').click(function() {
    if(indx < ((glb_data.length) - 1)){
        indx++;
        var data_source = glb_data[indx];
        RenderQuestion(data_source);
    }
});

function RenderQuestion(param_data){
    $('#h_txt_QA_ID').val(param_data.QA_ID);
    $('#lbl_question_content').text(param_data.QUESTION_CONTENT);
    var editor = $("#answer1").data("kendoEditor");
    editor.value(param_data.ANSWER_USER);
    $('#lbl_pertanyaan_no').text("Pertanyaan No. " + param_data._NO);
}

function startTimer(duration, display) {
    var timer = duration, minutes, seconds;
    var start = setInterval(function () {
        minutes = parseInt(timer / 60, 10)
        seconds = parseInt(timer % 60, 10);

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;
        if (seconds == 2) {
            TIME_C++;
            var lc_sisa = REMINDING_TIME - TIME_C;
            setTimeout(function () {
                UpdateReminding($('#h_txt_record_id').val(), lc_sisa)
            }, 1300);
        }
        display.textContent = minutes + ":" + seconds;

        if (--timer < 0) {
            clearInterval(start);
            $.ajax({
                url: base_url + "/EmployeeExam/SubmitEssay",
                type: 'POST',
                cache: false,
                data: {
                    RECORD_ID: $('#h_txt_record_id').val(),
                    EVENT_ID: $('#h_txt_EVENT_ID').val(),
                    Progress : parseInt(glob_percentage)
                },
                success: function (data) {
                    glb_dijawab = $('.list-group-item-success').size() + 1;
                    glob_percentage = (glb_dijawab/glb_total_soal) * 100;
                    $('#lbl_total_soal').text(glb_total_soal);
                    $('#lbl_dijawab').text(glb_dijawab);
                    $.alert({
                        title: data.title,
                        content: "Maaf Waktu Anda Habis, <br>" + data.content + " <br>" + data.error,
                        type: data.type,
                        animation: 'scale',
                        closeAnimation: 'zoom'
                    });
                }
            });
            window.location.href = $("#urlPath").val() + "/EmployeeExam";
        }
    }, 1000);
}


function UpdateReminding(RECORD_ID, SISA) {
    $.ajax({
        url: base_url + "/EmployeeExam/UpdateExamRemindingTimeEssay",
        type: 'POST',
        cache: false,
        data: {
            R_ID: RECORD_ID,
            RemindTime: parseFloat(SISA),
            Progress : parseInt(glob_percentage)
        },
        success: function (responsi) {
            $('#progress_jawab').attr('aria-valuenow', parseInt(glob_percentage)).css('width', parseInt(glob_percentage)+'%');
            if(responsi.status == false){
                $.alert({
                    title: "Failed",
                    content: "Maaf Sistem Mendeteksi Kegagalan Koneksi" + "<br>" + responsi.errr,
                    animation: 'rotateXR',
                    closeAnimation: 'zoom'
                });
            }
        }
    });
}

function Pst_RequestSoal() {
    $.ajax({
        url: base_url + "/EmployeeExam/RequestSoal",
        type: "POST",
        data: {
            REGISTER_ID: $('#h_txt_RegistrationID').val(),
            QUESTION_TYPE_ID: parseInt($('#h_txt_QuestionType').val())
        },
        success: function (response) {
            var ulist = $('#Ul_listQuestion');
            glb_data = response.Question;
            $.each(glb_data, function (i, value) {
                var new_item = "";
                new_item += "<li id='L" + (parseInt(value._NO) - 1) + "' class='list-group-item ";
                if (value.ANSWER_USER == null) {
                    new_item += "list-group-item-danger'";
                } else {
                    new_item += "list-group-item-success'";
                }
                new_item += "id = '" + value._NO + "'>";

                new_item += '<a href="javascript:" onclick="show_question(' + (parseInt(value._NO) - 1) + ')">';
                new_item += value._NO + '. ';
                new_item += value.QUESTION_CONTENT.substring(0, 18) + '...';
                new_item += '</a>';
                new_item += '</li>';
                ulist.append(new_item);
                
            });

            glb_total_soal = $('ul#Ul_listQuestion li').length;
            glb_dijawab = $('.list-group-item-success').size();
            glob_percentage = (glb_dijawab/glb_total_soal) * 100;
            $('#progress_jawab').attr('aria-valuenow', parseInt(glob_percentage)).css('width', parseInt(glob_percentage)+'%');
            $('#lbl_total_soal').text(glb_total_soal);
            $('#lbl_dijawab').text(glb_dijawab);

            $('#h_txt_QA_ID').val(glb_data[0].QA_ID);
            $('#lbl_question_content').text(glb_data[0].QUESTION_CONTENT);
            var editor = $("#answer1").data("kendoEditor");
            editor.value(glb_data[0].ANSWER_USER);
            $('#lbl_pertanyaan_no').text("Pertanyaan No. " + glb_data[0]._NO);

            for (var i = 1; i <= (glb_data[0].QUESTION_MAX_ANSWER) ; i++) {
                $('#D' + i).attr("hidden", false);
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert("Maaf Session Komputer ini sudah habis, karena Anda terlalu lama Idle, silahkan Anda Loogin kembali untuk meneruskan ujian ini");
            window.location.href = base_url+'/Login/Logout';
        }
    });
}

function show_question(e){
    indx = parseInt(e);
    var data_source = glb_data[e];

    RenderQuestion(data_source);
}