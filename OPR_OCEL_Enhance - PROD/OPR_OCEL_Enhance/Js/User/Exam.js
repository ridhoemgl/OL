var base_url = $('#urlPath').val();
var glb_data = null;
var indx = 0;
var progress = 0;
var glb_NormalDuration = 0;
var REMINDING_TIME = (parseInt($('#h_txt_RemindingTime').val()));
var TIME_C = 0;
$( document ).ready(function() {
    glb_NormalDuration = parseInt($('#h_txt_durationMinutes').val());
    Pst_RequestSoal();
    if(REMINDING_TIME != 0){
        var fiveMinutes = 60 * REMINDING_TIME,
        display = document.querySelector('#time');
        startTimer(fiveMinutes, display);

        var downloadTimer = setInterval(function(){
        document.getElementById("progressBar").value = 3600 - --fiveMinutes;
        if(fiveMinutes <= 0)
            clearInterval(downloadTimer);
        },1000);
    }
});

$('#btn_confirm_exam').click(function() {
    if(glb_data[indx].JENIS_SOAL == 1){
        var radioValue = $("input[name='rpertanyaan']:checked").val();
        glb_data[indx].ANSWER_USER = parseInt(radioValue);
        
        $.ajax({
            url: base_url+"/EmployeeExam/UpdateExamAnswer",
            type: "POST",
            cache:false,
            data: {
                QA_ID : (glb_data[indx].QA_ID) , 
                ANSWER : glb_data[indx].ANSWER_USER,
                REGISTRATION_ID : $('#h_txt_RegistrationID').val(),
                JENIS_SOAL : parseInt($('#h_txt_QuestionType').val()),
                RECORD_ID : $('#h_txt_record_id').val(),
                PERCENT_COMPLETE : parseInt(progress),
                nrp : $('#h_txt_nrp').val(),
                dstrct : $('#h_txt_dstrtc').val()
            } ,
            success: function (response) {
                if(response.session == false){
                    $.alert({
                        title: "Komputer Idle",
                        content: "Anda terlalu lama idle menyebapkan session komputer time out.<br> Klik Ok untuk melanjutkan",
                        icon: 'fa fa-warning',
                        type: "red",
                        animation: 'scale',
                        closeAnimation: 'zoom'
                    });
                }
                else if(response.status == false){
                    $.alert({
                        title: response.hearder,
                        content: response.remarks+", karena : <br>Tipe : "+response.error_type+"<br>Details : "+response.error_message,
                        icon: 'fa fa-warning',
                        type: response.type,
                        animation: 'scale',
                        closeAnimation: 'zoom'
                    });
                }else if(response.status == true){
                    $.notify({
                        title: "<strong>Status:</strong> ",
                        message: "Jawaban Dikonfirmasi",
                        type: 'success',
                        showProgressbar: true
                    }, {
                        delay: 800,
                        
                        animate: {
                            enter: 'animated lightSpeedIn',
                            exit: 'animated lightSpeedOut'
                        }
                    });
                    var belum = CountAnwered(response.Question);
                    var sudah = (glb_data.length) - belum;
                    progress = (sudah / glb_data.length)*100;

                    if(progress == 100){
                        $('#btn_finallyActionn').removeAttr('hidden');                        
                    }

                    $('#lbl_sudah').text(sudah);
                    $('#lbl_belum').text(belum);
                    $('#lbl_progress').text(progress);
                    $('#progress_jawab').attr('aria-valuenow', progress).css('width', progress+'%');

                    $("#L"+(indx)).addClass('list-group-item-success').removeClass('list-group-item-danger');
                }
            },
            error: function(jqXHR, textStatus, errorThrown) {
               //showErrorMessage(textStatus, errorThrown);
               alert("Maaf Session Komputer ini sudah habis, karena Anda terlalu lama Idle");
               window.location.href = base_url+'/Login/Logout';
            }
        });
    }
});

$('#btn_finallyActionn').click(function() {
    $.confirm({
        title:"Konfirmasi",
        type:'blue',
        theme:'material',
        animation: 'zoom',
        content: "Apakah Anda yakin akan mengkonfirmasi dan mengakhiri ujian ini ?<br>Anda tidak akan bisa mengulang setelah Anda menekan tombol '<b>Oke</b>'",
        closeIcon: 'aRandomButton',
        buttons: {
            Oke: {
                text: 'Oke',
                action: function(){
                    TimeCloseSession(progress);
                }
            },
            cancel: function(){}
        }
    });
});

function TimeCloseSession(percentage){
    $.ajax({
        type: "POST",
        url: base_url+"/EmployeeExam/CountResult_AndUpdate",
        data: {
            EVENT_ID : $('#h_txt_EVENT_ID').val(),
            RECORD_ID : $('#h_txt_record_id').val(),
            REGISTRATION_ID : $('#h_txt_RegistrationID').val(),
            QUESTION_TYPE_ID : parseInt($('#h_txt_QuestionType').val()),
            PROGRESS : percentage
        },
        cache: false,
        success: function(data){
            $.alert({
                title: data.title,
                content: data.content+" <br>"+data.error,
                type: data.type,
                animation: 'scale',
                autoClose: 'Oke|10000',
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

$('#btn_back_question').click(function() {
    if(indx > 0){
        indx--;
        var data_source = glb_data[indx];
        RenderList(data_source);
    }
});

$('#btn_next_question').click(function() {
    if(indx < ((glb_data.length) - 1)){
        indx++;
        var data_source = glb_data[indx];
        RenderList(data_source);
    }
});

function CountAnwered(data){
    var counts = 0;
    $.each(data, function(key, value) {
        if(value.ANSWER_USER == null){
            counts++;
        }
    });

    return counts;
}

function showErrorMessage(header, konten){
    $.alert({
        title: header,
        content: konten,
        icon: 'fa fa-warning',
        type: "red",
        animation: 'scale',
        closeAnimation: 'zoom'
    });
}

function startTimer(duration, display) {
    var timer = duration, minutes, seconds;
    var start = setInterval(function () {
        minutes = parseInt(timer / 60, 10)
        seconds = parseInt(timer % 60, 10);

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;
        if(seconds == 55){
            TIME_C++;
            var lc_sisa = REMINDING_TIME - TIME_C;
            setTimeout(function(){
                UpdateReminding($('#h_txt_record_id').val() , lc_sisa)
            },1300); 
        }
        display.textContent = minutes + ":" + seconds;

        if (--timer < 0) {
            clearInterval(start);
            TimeCloseSession(progress);
        }
    }, 1000);
}


function UpdateReminding(RECORD_ID , SISA){
    // console.log("POST record_id : "+RECORD_ID);
    // console.log("POST Sisa : "+SISA);
    $.ajax({
        url: base_url+"/EmployeeExam/UpdateExamRemindingTime",
        type: 'POST',
        cache: false,
        data:{
            R_ID : RECORD_ID,
            RemindTime : parseFloat(SISA)
        },
        success: function(responsi){
            //console.log(responsi);
        }
      });
}

function Pst_RequestSoal(){
    $.ajax({
        url: base_url+"/EmployeeExam/RequestSoal",
        type: "POST",
        data: {
            REGISTER_ID : $('#h_txt_RegistrationID').val(),
            QUESTION_TYPE_ID: parseInt($('#h_txt_QuestionType').val())
        } ,
        success: function (response) {
           var ulist = $('#Ul_listQuestion');
            glb_data = response.Question;

            var belum = CountAnwered(response.Question);
            var sudah = (glb_data.length) - belum;
            progress = (sudah/glb_data.length)*100;
            if(progress == 100){
                $('#btn_finallyActionn').removeAttr('hidden');                        
            }
            $('#lbl_sudah').text(sudah);
            $('#lbl_belum').text(belum);
            $('#lbl_progress').text(progress);
            $('#progress_jawab').attr('aria-valuenow', progress).css('width', progress+'%');

            $.each(glb_data, function (i, value) {
                var new_item = "";
                    new_item += "<li id='L"+(parseInt(value._NO)-1)+"' class='list-group-item ";
                    if (value.ANSWER_USER == null){
                        new_item += "list-group-item-danger'";
                    }else{
                        new_item += "list-group-item-success'";
                    }
                    new_item += "id = '"+ value._NO +"'>";
                        
                        new_item += '<a href="javascript:" onclick="show_question('+ (parseInt(value._NO)-1)+')">';
                        new_item += value._NO+'. ';
                        new_item += value.QUESTION_CONTENT.substring(0,19)+'...';
                        new_item += '</a>';
                    new_item += '</li>';
                ulist.append(new_item);
            });

            RenderList(glb_data[0]);
        },
        error: function(jqXHR, textStatus, errorThrown) {
           //console.log(textStatus, errorThrown);
           $.alert({
                title: 'Error: Request Soal Ujian',
                content: 'Maaf , Sepertinya Network pada distrik ini sedang bermasalah',
                icon: 'fa fa-warning',
                animation: 'opacity',
                closeAnimation: 'rotate'
            });
        }
    });
}

function show_question(e){
    indx = parseInt(e);
    var data_source = glb_data[e];

    RenderList(data_source);
}

function RenderList(data_source){

    $('#lbl_question_content').text(data_source.QUESTION_CONTENT);
    $('#p_number').text("Pertanyaan No. "+data_source._NO);
    //console.log("Jawaban User = "+data_source.ANSWER_USER);

    if(data_source.JENIS_SOAL == 1){
        $('#UL_checkbox').attr("hidden",true);
        $('#UL_radio').attr("hidden",false);
        $('#lbl_radio4').html(data_source.ANSWER_4);
        $('#lbl_radio3').html(data_source.ANSWER_3);
        $('#lbl_radio2').html(data_source.ANSWER_2);
        $('#lbl_radio1').html(data_source.ANSWER_1);
        $('#lbl_radio5').html(data_source.ANSWER_5);
        $('#lbl_radio6').html(data_source.ANSWER_6);
        $('#lbl_radio7').html(data_source.ANSWER_7);
        $('#lbl_radio8').html(data_source.ANSWER_8);
        $('#lbl_radio9').html(data_source.ANSWER_9);
        $('#lbl_radio10').html(data_source.ANSWER_10);

        for(var i=1; i <= (data_source.QUESTION_MAX_ANSWER); i++){
            $('#RD'+i).attr("hidden",false);
        }

        if(data_source.ANSWER_USER == null){
            $('input:radio').removeAttr('checked');
        }else{
            $('#radio'+(data_source.ANSWER_USER)).prop('checked',true);
        }

        for(var h = data_source.QUESTION_MAX_ANSWER+1; h <= 10; h++ ){
            $('#RD'+h).attr("hidden",true)
        }

        $('.checkbox').attr("hidden",true);

    }else if(data_source.JENIS_SOAL == 2){
        $('#UL_radio').attr("hidden",true);
        $('#UL_checkbox').attr("hidden",false);
        $('#lbl_checkbox4').html(data_source.ANSWER_4);
        $('#lbl_checkbox3').html(data_source.ANSWER_3);
        $('#lbl_checkbox2').html(data_source.ANSWER_2);
        $('#lbl_checkbox1').html(data_source.ANSWER_1);
        $('#lbl_checkbox5').html(data_source.ANSWER_5);
        $('#lbl_checkbox6').html(data_source.ANSWER_6);
        $('#lbl_checkbox7').html(data_source.ANSWER_7);
        $('#lbl_checkbox8').html(data_source.ANSWER_8);
        $('#lbl_checkbox9').html(data_source.ANSWER_9);
        $('#lbl_checkbox10').html(data_source.ANSWER_10);

        for(var i=1; i <= (data_source.QUESTION_MAX_ANSWER); i++){
            $('#CD'+i).attr("hidden",false);
        }

        if(data_source.ANSWER_USER == null){
            $('input:checkbox').removeAttr('checked');
        }else{
            $('#checkbox'+(data_source.ANSWER_USER)).attr('checked',true);
        }

        for(var h = data_source.QUESTION_MAX_ANSWER+1; h <= 10; h++ ){
            $('#CD'+h).attr("hidden",true)
        }
        
        $('.radio').attr("hidden",true);
    }else{
        $.alert({
            title: 'Error: Jenis Soal',
            content: 'Maaf , tidak seharusnya jenis soal tersebut dimuat pada halaman ini',
            icon: 'fa fa-warning',
            animation: 'opacity',
            closeAnimation: 'rotate'
        });
    }

    $('html, body').animate({scrollTop:0}, 100);
}