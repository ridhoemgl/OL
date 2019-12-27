var REMINDING_TIME = (parseInt($('#txt_reman_time').val()));
var TIME_C = 0;
var base_url = $('#urlPath').val();
var glob_progress = 0;
$(document).ready(function () {
    if(REMINDING_TIME != 0){
        var fiveMinutes = 60 * REMINDING_TIME,
        display = document.querySelector('#time');
    startTimer(fiveMinutes, display);

    var downloadTimer = setInterval(function(){
    glob_progress = ( parseInt($('#h_txt_time_nOrmal').val())) - --fiveMinutes;
    document.getElementById("progressBar").value = 3600 - --fiveMinutes;

    if(fiveMinutes <= 0)
        clearInterval(downloadTimer);
        },1000);
    }

    var URL = $("#urlPath").val() + "/question_image/document_examp/" + $('#txt_pdf_file').val();

    $("#pdf_viewer").data('href',URL);
    
    showToast();
    $("#pdf_viewer").pdfviewer({
        scale: 2,
        onDocumentLoaded: function() {
            var num = $(this).data('pdfviewer').pages();
            $('#pdf-autofit-width').click();
            $('#pdf-autofit-width').click();
        },
        onPrevPage: function() { 
            //alert('onPrevPage');
            return true; 
        },
        onNextPage: function() { 
            //alert('onNextPage'); 
            return true; 
        },
        onBeforeRenderPage: function(num) {
            return true;
        },
        onRenderedPage: function(num) {
            hideLoading(); 
        }
    });

    //$("object").attr("data", "http://www.twitch.tv/widgets/live_embed_player.swf?channel=liquidwifi");
    //PDFObject.embed($("#urlPath").val() + "/question_image/document_examp/" + ($('#txt_pdf_file').val())+'#toolbar=0&navpanes=', "#pdf_viewer", options);
    
});


$('#bt_finish_read').click(function() {
    //console.log($('#txt_record_id').val());
    $.confirm({
        title: 'Konfirmasi',
        content: 'Apakah anda yakin untuk mengakhiri waktu belajar Anda ?',
        escapeKey: 'cancelAction',
        buttons: {
            confirm: {
                btnClass: 'btn-green',
                theme : 'material',
                text: 'Oke',
                action: function(){
                      $.ajax({
                        url: base_url+"/EmployeeExam/FinishReadingBook",
                        type: "POST",
                        data:{
                            RECORD_ID : $('#txt_record_id').val()
                        },
                        cache: false,
                        success: function(response) {
                            REMINDING_TIME = 0;
                            glob_progress = 100;
                            $.alert({
                                title: response.title,
                                content: response.content+" "+response.error,
                                theme: 'material',
                                type: response.type,
                                buttons: {
                                    okay: {
                                        text: 'Oke',
                                        btnClass: 'btn-'+response.type,
                                        action: function(){
                                            if(response.status == true){
                                                window.location.href = base_url+'/EmployeeExam';
                                            }
                                        }
                                    }
                                }
                            });
                        }
                    });
                }
            },
            cancelAction: {
                text: 'Batal'
            }
        }
    });
});

function startTimer(duration, display) {
    var timer = duration, minutes, seconds;
    var start = setInterval(function () {
        minutes = parseInt(timer / 60, 10)
        seconds = parseInt(timer % 60, 10);

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;
        if(seconds == 03){
            TIME_C++;
            var lc_sisa = REMINDING_TIME - TIME_C;

            //console.log(TIME_C+" menit , Sisa : "+lc_sisa);
            setTimeout(function(){
                UpdateReminding($('#txt_record_id').val() , lc_sisa);
                if(glob_progress >= 30 && REMINDING_TIME != 0){
                   $('#bt_finish_read').removeAttr('hidden');
                }
            },1200); 
        }
        display.textContent = minutes + ":" + seconds;

        if (--timer < 0) {
            clearInterval(start);
            $.ajax({
                url: base_url+"/EmployeeExam/updateSelftExamToReady",
                type: 'POST',
                cache: false,
                data:{
                    RC_ID : $('#txt_record_id').val()
                },
                success: function(resq){
                    $.alert({
                        title: resq.title,
                        content: resq.content,
                        icon: resq.icon,
                        theme: 'material',
                        type: resq.type,
                        buttons: {
                            okay: {
                                text: 'Okay',
                                btnClass: 'btn-'+resq.type,
                                action: function(){
                                    if(resq.status == true){
                                        window.location.href = base_url+'/EmployeeExam';
                                    }
                                }
                            }
                        }
                    });
                }
              });
        }
    }, 1000);
}


function UpdateReminding(RECORD_ID , SISA){
    $.ajax({
        url: base_url+"/EmployeeExam/UpdateRemindingTime",
        type: 'POST',
        cache: false,
        data:{
            R_ID : RECORD_ID,
            RemindTime : parseFloat(SISA)
        },
        success: function(responsi){
            glob_progress = responsi.progress;
            //console.log(glob_progress);
            if (glob_progress >= 50){
                $('#bt_finish_read').removeAttr('hidden');
            }
            $('#lbl_progress_bar').html(glob_progress);
            $('#prog_bar').attr('aria-valuenow', glob_progress).css('width', glob_progress+'%');
        }
      });
}

function showToast(){
    var title = "Loading File";
    var icon = "loading";
    var duration = 13000;
    $.Toast.showToast({title: title,duration: duration, icon:icon,image: ''});
  }

  function hideLoading(){
    $.Toast.hideToast();
  }

