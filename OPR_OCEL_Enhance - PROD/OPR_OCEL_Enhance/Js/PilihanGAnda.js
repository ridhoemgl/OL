var iSessUpload = guid();
var session_tempt;

function guid() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4();
}

var iCnt = 0;
var container = $(document.createElement('div'));
var add_event = 1;

function dropdown_module() {
    $.ajax({
        type: 'GET',
        url: $("#urlPath").val() + '/PilihanGanda/DropdownModul',
        success: function(data) {
            $.each(data.Data, function(key, value) {
                $("#S_MODUL").append("<option value='" + value.MODULE_ID + "'>" + value.MODULE_NAME + "</option>");
            });

            $.each(data.Data_cert, function(a, b) {
                $("#S_MCERT").append("<option value='" + b.JENIS_UJIAN_CODE + "'>" + b.JENIS_UJIAN_DESC + "</option>");
            });

            $.each(data.Data_manposition, function(a, b) {
                $("#S_MPOSITION").append("<option value='" + b.POSITION_CODE + "'>" + b.POSITION_DESC + "</option>");
            });

            $('#S_MCERT').selectpicker();
            $('#S_MPOSITION').selectpicker();
            $("#S_SUBMODUL , #S_MODUL , #S_TYPE").select2();

        }
    });

    $.ajax({
        type: 'GET',
        url: $("#urlPath").val() + '/PilihanGanda/dropdownTypeSoal',
        success: function(data) {
            $.each(data.Data, function(key, value) {
                $("#S_TYPE").append("<option value='" + value.TYPE_CODE + "'>" + value.TYPE_DESC + "</option>");
            });
        }
    });
}


$('.cbx_score').on('change', function() {
    if (this.checked) {
        $(this).val(1);
        $(this).id;
    } else {
        $(this).val(0);
    }

    $('#tbx_maxscore').val($('input.cbx_score:checked').length);
});


$("#S_MODUL").change(function() {
    var MODL_ID = ($(this).val());
    $('#S_SUBMODUL').select2("val", "");
    $('#S_SUBMODUL').empty();
    $.ajax({
        type: 'POST',
        url: $("#urlPath").val() + '/PilihanGanda/dropdownSubmodul',
        cache: false,
        data: {
            modul_ids: MODL_ID
        },
        success: function(data) {

            $.each(data.Data, function(key, value) {
                $("#S_SUBMODUL").append("<option value='" + value.MODULE_SUB_ID + "'>" + value.MODULE_SUB_NAME + "</option>");
            });

            $('#S_EGI option:not(:first)').remove();
            $.each(data.EGI, function(key, value) {
                $("#S_EGI").append("<option value='" + value.EGI_GENERAL + "'>" + value.EGI_GENERAL + "</option>");
            });
            $('#S_EGI').selectpicker('refresh');
        }
    });
});



$("#btn_view").click(function() {
    //var data = { P_MODULE_ID: , P_MODULE_SUB_ID: $('#S_SUBMODUL').select2('data'), P_QUESTION_TYPE: $('#S_TYPE').select2('data') };

    var mod_id = ($('#S_MODUL').select2('data')[0].id)
    var mod_subid = ($('#S_SUBMODUL').select2('data')[0].id)
    var quest_type = ($('#S_TYPE').select2('data')[0].id)

    if (!$('#S_MODUL').val()) {
        $.alert({
            title: 'Parameter Kurang',
            content: 'Silahkan anda pilih dahulu Modul dan Submodul soal',
            icon: 'fa fa-exclamation-triangle',
            type: 'red',
            animation: 'scale',
            theme: 'material',
            closeAnimation: 'scale',
            buttons: {
                okay: {
                    text: 'Ok',
                    btnClass: 'btn-red'
                }
            }
        });
    } else {
        loadGrid(mod_id, mod_subid, quest_type);
    }
});


function loadGrid(s_modulid, s_submodulid, s_type) {

    //REFRESH GRID SEBELUM DI LOAD
    if ($("#gridPilgan").data().kendoGrid != null) {
        $("#gridPilgan").data().kendoGrid.destroy();
        $("#gridPilgan").empty();
    }

    $("#gridPilgan").kendoGrid({
        dataSource: {
            type: "json", //tipe formating
            transport: {
                read: { //tampil
                    url: $("#urlPath").val() + "/PilihanGAnda/AjaxReadPilgan",
                    contentType: "application/json",
                    cache: false,
                    data: {
                        s_modulid: s_modulid,
                        s_submodulid: s_submodulid,
                        s_type: s_type
                    },
                    type: "POST",
                    cache: false
                },
                destroy: { //hapus
                    url: $("#urlPath").val() + "/PilihanGAnda/deletePilihanGanda",
                    type: "POST",
                    data: {
                        s_modulid: s_modulid,
                        s_submodulid: s_submodulid,
                        s_type: s_type
                    },
                    cache: false,
                    complete: function(e) {
                        alert(e.responseJSON.remarks);
                    }
                },
                parameterMap: function(data, operation) //parsing biar ke grid
                {
                    return kendo.stringify(data);
                }
            },
            serverPaging: true,
            serverFiltering: true,
            serverSorting: true,
            pageable: true,
            pageSize: 10,
            schema: {
                data: "Data", //jmlh data
                total: "Total", //berapa rows
                model: {
                    id: "QUESTION_ID",
                    fields: {
                        QUESTION_ID: {
                            type: "string",
                            filterable: true,
                            sortable: true,
                            editable: false
                        },
                        MODULE_ID: {
                            type: "string",
                            filterable: true,
                            sortable: true,
                            editable: false
                        },
                        MODULE_SUB_ID: {
                            type: "string",
                            filterable: true,
                            sortable: true,
                            editable: false
                        },
                        DESTINATION_POSITION: {
                            type: "string",
                            filterable: true,
                            sortable: true,
                            editable: false
                        },
                        CERT_FOR: {
                            type: "string",
                            filterable: true,
                            sortable: true,
                            editable: false
                        },
                        QUESTION_TYPE: {
                            type: "number",
                            filterable: true,
                            sortable: true,
                            editable: false
                        },
                        QUESTION_CONTENT: {
                            type: "string",
                            filterable: true,
                            sortable: false,
                            editable: false
                        },
                        ANSWER_1: {
                            type: "string",
                            filterable: true,
                            sortable: true
                        },
                        ANSWER_1_SCORE: {
                            type: "number",
                            filterable: true,
                            sortable: true
                        },
                        ANSWER_2: {
                            type: "string",
                            filterable: true,
                            sortable: true
                        },
                        ANSWER_2_SCORE: {
                            type: "number",
                            filterable: true,
                            sortable: true
                        },
                        ANSWER_3: {
                            type: "string",
                            filterable: true,
                            sortable: true
                        },
                        ANSWER_3_SCORE: {
                            type: "number",
                            filterable: true,
                            sortable: true
                        },
                        ANSWER_4: {
                            type: "string",
                            filterable: true,
                            sortable: true
                        },
                        ANSWER_4_SCORE: {
                            type: "number",
                            filterable: true,
                            sortable: true
                        },
                        ANSWER_5: {
                            type: "string",
                            filterable: true,
                            sortable: true
                        },
                        ANSWER_5_SCORE: {
                            type: "number",
                            filterable: true,
                            sortable: true
                        },
                        ANSWER_6: {
                            type: "string",
                            filterable: true,
                            sortable: true
                        },
                        ANSWER_6_SCORE: {
                            type: "number",
                            filterable: true,
                            sortable: true
                        },
                        ANSWER_7: {
                            type: "string",
                            filterable: true,
                            sortable: true
                        },
                        ANSWER_7_SCORE: {
                            type: "number",
                            filterable: true,
                            sortable: true
                        },
                        ANSWER_8: {
                            type: "string",
                            filterable: true,
                            sortable: true
                        },
                        ANSWER_8_SCORE: {
                            type: "number",
                            filterable: true,
                            sortable: true
                        },
                        ANSWER_9: {
                            type: "string",
                            filterable: true,
                            sortable: true
                        },
                        ANSWER_9_SCORE: {
                            type: "number",
                            filterable: true,
                            sortable: true
                        },
                        ANSWER_10: {
                            type: "string",
                            filterable: true,
                            sortable: true
                        },
                        ANSWER_10_SCORE: {
                            type: "number",
                            filterable: true,
                            sortable: true
                        },
                        IS_ACTIVE: {
                            type: "boolean",
                            filterable: true,
                            sortable: true,
                            editable: false

                        },
                        MODIFICATION_DATE: {
                            type: "date",
                            filterable: true,
                            sortable: true,
                            editable: false

                        },
                        IMAGE_PATH: {
                            type: "string",
                            filterable: true,
                            sortable: true,
                            editable: false
                        },
                        EGI_GENERAL: {
                            type: "string",
                            filterable: true,
                            sortable: true,
                            editable: false
                        }
                    }
                }

            }

        },
        filterable: true,
        sortable: true,
        editable: true,
        pageable: true,
        scrollable: true,
        pageable: {
            refresh: true,
            buttonCount: 10,
            input: true,
            pageSizes: [10, 20, 50, 100, 1000, 100000],
            info: true,
            messages: {}
        },
        columns: [{
            command: [{
                name: "add-data",
                text: "<span class='k-icon k-add'></span>Add new record"
            }],
            hidden: true
        },
            {
                title: "No",
                width: "20px",
                template: "<center> #= ++rowNo # </center>",
                filterable: false
            }, {
                field: "QUESTION_ID",
                hidden: true
            }, {
                field: "QUESTION_CONTENT",
                title: "Pertanyaan",
                width: "300px"

            }, {
                field: "CERT_FOR",
                title: "Tipe Ujian",
                width: "70px",
                template: $("#tempIMG_PATH").html()
            }, {
                field: "MODIFICATION_DATE",
                title: "Update",
                template: '#= kendo.toString(kendo.parseDate(MODIFICATION_DATE), "dd/MM/yyyy")#',
                width: "60px"
            }, {
                field: "IS_ACTIVE",
                title: "X",
                template: "#= IS_ACTIVE == 1 ? '<center>Yes</center>' : '<center>No<?center>'#",
                width: "40px"
            }, {
                command: [{
                    name: "update-data",
                    text: "<span class='k-icon k-edit'></span>Edit",
                    click: grid_update
                }, {
                    name: "delete-data",
                    text: "<span class='k-icon k-i-close'></span>Hapus",
                    click: grid_delete
                }],
                title: "Action",
                width: "95px"
            }
        ],
        dataBinding: function() {
            window.rowNo = (this.dataSource.page() - 1) * this.dataSource.pageSize();
        },
        toolbar: [{
            template: kendo.template($("#template").html())
        }, "excel"]
    });
}


var indexadd = 1;

$("#bt_remove_answer").click(function() {

    var minimum = 2;

    if (indexadd > minimum) {
        $("#ans_row" + indexadd).hide();
        $("#tbt_score" + indexadd).val(0);
        $("#tbx_answer" + indexadd).val("");
        indexadd--;
    } else {
        alert("Maaf, minimum soal terdiri dari " + minimum + " jawaban pilihan ganda");
    }

});

$("#bt_add_answer").click(function() {
    var minimum = 2;
    //console.log(indexadd);
    if (indexadd <= 10) {
        $("#ans_row" + (indexadd)).show();
        $("#tbt_score" + (indexadd)).val(0);
        $("#tbx_answer" + (indexadd)).val("");
        indexadd++;
    } else {
        alert("Maaf, maksimal list jawaban adalah 10");
    }
});

$('#btn_save_question').on('click', function() {

    var mod_id_tmp = $('#S_MODUL').select2().val().length;
    var mod_sub_id_tmp = $('#S_SUBMODUL').select2().val().length;

    var tmp_mod_id, tmp_submod_id;

    //var tempt_score = 0;
    set_rb_value();

    //$(".in_score").each(function() {
    //    tempt_score = tempt_score + parseInt($(this).val());
    //});

    if (mod_id_tmp < 2) {
        mod_id_tmp = "0" + $('#S_MODUL').select2().val().toString();
    } else {
        mod_id_tmp = $('#S_MODUL').select2().val().toString();
    }

    if (mod_sub_id_tmp < 2) {
        mod_sub_id_tmp = "0" + $('#S_SUBMODUL').select2().val().toString();
    } else {
        mod_sub_id_tmp = $('#S_SUBMODUL').select2().val().toString();
    }
    //console.log($('.cbx_score').val());

    var ur_;
    var lbl_upload;

    if (add_event == 2) {
        ur_ = $("#urlPath").val() + "/PilihanGanda/AjaxPostAnswerList";
        if (!document.getElementById("fileUpload").files.length == 0) {
            var filename = $("#fileUpload").val();
            var extension = filename.replace(/^.*\./, '');
            lbl_upload = $('#tbx_question_id').val() + "." + extension;
        } else {
            lbl_upload = $('#lbl_file_upload').val();
        }
    } else if (add_event == 1) {
        ur_ = $("#urlPath").val() + "/PilihanGanda/AjaxCreteAnswerList";

        if (!document.getElementById("fileUpload").files.length == 0) {
            var filename = $("#fileUpload").val();
            var extension = filename.replace(/^.*\./, '');
            lbl_upload = "." + extension;
        } else {
            lbl_upload = "";
        }
    }

    if (($("select[name='S_MPOSITION[]'] option:selected").length == 0) || ($("select[name='S_MCERT[]'] option:selected").length == 0)) {
        $('#modal-editor').modal('hide');
        $.alert({
            title: 'Parameter Belum dipilih',
            content: 'Sebelum menyimpan data, Silahkan pilih Posisi dan Jenis Ujian dari soal yang telah anda buat',
            icon: 'fa fa-exclamation-triangle',
            type: 'red',
            animation: 'scale',
            theme: 'material',
            closeAnimation: 'scale',
            buttons: {
                okay: {
                    text: 'Ok',
                    btnClass: 'btn-red'
                }
            }
        });
    } else {

        if (!$('#S_EGI').val()) {
            $('#modal-editor').modal('hide');
            $.alert({
                title: 'EGI ERROR',
                content: 'Maaf anda harus mengisi field EGI untuk melanjutkan proses update atau insert',
                icon: 'fa fa-exclamation-triangle',
                animation: 'zoom',
                closeAnimation: 'scale',
                type: 'red',
                theme: 'material',
                buttons: {
                    okay: {
                        text: 'Okay',
                        btnClass: 'btn-red'
                    }
                }
            });
        } else {
            if (parseInt(($('#S_TYPE').select2('data')[0].id)) == 1) {
                post_answer_list(
                    $('#tbx_question_id').val(),
                    mod_id_tmp,
                    mod_sub_id_tmp,
                    $('#S_MCERT').val().join(),
                    $("#tbx_maxtime").val(),
                    ($('#tb tr:visible').length) - 1,
                    $('#S_TYPE').select2().val(),
                    $('#S_MPOSITION').val().join(),
                    $('#tbx_maxscore').val(),
                    $('#txa_question').val(),
                    $('#tbx_answer1').val(), $('#tbt_score1').val(),
                    $('#tbx_answer2').val(), $('#tbt_score2').val(),
                    $('#tbx_answer3').val(), $('#tbt_score3').val(),
                    $('#tbx_answer4').val(), $('#tbt_score4').val(),
                    $('#tbx_answer5').val(), $('#tbt_score5').val(),
                    $('#tbx_answer6').val(), $('#tbt_score6').val(),
                    $('#tbx_answer7').val(), $('#tbt_score7').val(),
                    $('#tbx_answer8').val(), $('#tbt_score8').val(),
                    $('#tbx_answer9').val(), $('#tbt_score9').val(),
                    $('#tbx_answer10').val(), $('#tbt_score10').val(),
                    lbl_upload,
                    $('#S_EGI').val(),
                    ur_)
            } else {

                post_answer_list(
                    $('#tbx_question_id').val(),
                    mod_id_tmp,
                    mod_sub_id_tmp,
                    $('#S_MCERT').val().join(),
                    $("#tbx_maxtime").val(),
                    ($('#tb tr:visible').length) - 1,
                    $('#S_TYPE').select2().val(),
                    $('#S_MPOSITION').val().join(),
                    $('#tbx_maxscore').val(),
                    $('#txa_question').val(),
                    $('#tbx_answer1').val(), $('#cbx_score1').val(),
                    $('#tbx_answer2').val(), $('#cbx_score2').val(),
                    $('#tbx_answer3').val(), $('#cbx_score3').val(),
                    $('#tbx_answer4').val(), $('#cbx_score4').val(),
                    $('#tbx_answer5').val(), $('#cbx_score5').val(),
                    $('#tbx_answer6').val(), $('#cbx_score6').val(),
                    $('#tbx_answer7').val(), $('#cbx_score7').val(),
                    $('#tbx_answer8').val(), $('#cbx_score8').val(),
                    $('#tbx_answer9').val(), $('#cbx_score9').val(),
                    $('#tbx_answer10').val(), $('#cbx_score10').val(),
                    lbl_upload,
                    $('#S_EGI').val(),
                    ur_)
            }
        }

    }

    //}
});

$("#remove_upload").click(function() {
    $("#fileUpload").val(null);
    $("#lbl_file_upload").val("no_image.jpg");
    $('#img-upload').attr('src', $("#urlPath").val() + "/question_image/no_image.jpg");
});

function Populate_answer_alphabet() {
    var r = 0;
    $('#tb tr').each(function() {
        r++;
    });

}

function set_rb_value() {
    //if (parseInt(($('#S_TYPE').select2('data')[0].id)) == 1){
    //    $(".in_score").each(function() {
    //        if ($(this).is(':checked')) {
    //            $(this).val(1);
    //        }else{
    //            $(this).val(0);
    //        }
    //    });
    //}else if (parseInt(($('#S_TYPE').select2('data')[0].id)) == 2) {
    //    $(".cbx_score").each(function() {
    //        console.log($(this));
    //        if ($(this).is(':checked')) {
    //            $(this).val(1);
    //        }else{
    //            $(this).val(0);
    //        }
    //    });
    //}
}

function post_answer_list(
    question_id,
    module_id,
    sub_module_id,
    cert_for,
    question_max_time,
    question_max_answer,
    question_type,
    destination_position,
    max_score,
    content,
    answer1, answer1_score,
    answer2, answer2_score,
    answer3, answer3_score,
    answer4, answer4_score,
    answer5, answer5_score,
    answer6, answer6_score,
    answer7, answer7_score,
    answer8, answer8_score,
    answer9, answer9_score,
    answer10, answer10_score,
    image_path,
    egi_general,
    url
) {
    var obj_answer = new Object();

    var isactive;
    if ($('#cbx_isactive').prop('checked')) {
        isactive = true;
    } else {
        isactive = false;
    }



    obj_answer.question_id = question_id;
    obj_answer.module_id = parseInt(module_id);
    obj_answer.sub_module_id = parseInt(sub_module_id);
    obj_answer.cert_for = cert_for;
    obj_answer.question_max_answer = parseInt(question_max_answer);
    obj_answer.question_type = parseInt(question_type);
    obj_answer.destination_position = destination_position;
    obj_answer.question_max_time = parseInt(question_max_time);
    obj_answer.question_max_score = parseInt(max_score);
    obj_answer.question_content = content;
    obj_answer.answer_1 = answer1;
    obj_answer.answer_1_score = parseInt(answer1_score);
    obj_answer.answer_2 = answer2;
    obj_answer.answer_2_score = parseInt(answer2_score);
    obj_answer.answer_3 = answer3;
    obj_answer.answer_3_score = parseInt(answer3_score);
    obj_answer.answer_4 = answer4;
    obj_answer.answer_4_score = parseInt(answer4_score);
    obj_answer.answer_5 = answer5;
    obj_answer.answer_5_score = parseInt(answer5_score);
    obj_answer.answer_6 = answer6;
    obj_answer.answer_6_score = parseInt(answer6_score);
    obj_answer.answer_7 = answer7;
    obj_answer.answer_7_score = parseInt(answer7_score);
    obj_answer.answer_8 = answer8;
    obj_answer.answer_8_score = parseInt(answer8_score);
    obj_answer.answer_9 = answer9;
    obj_answer.answer_9_score = parseInt(answer9_score);
    obj_answer.answer_10 = answer10;
    obj_answer.answer_10_score = parseInt(answer10_score);
    obj_answer.is_active = isactive;
    obj_answer.image_path = image_path;
    obj_answer.egi_general = egi_general;
    //console.log("Sub modul id :"+sub_module_id)
    //console.log("Module ID : "+module_id);
    if (obj_answer != null) {
        $.ajax({
            type: "POST",
            url: url,
            data: JSON.stringify(obj_answer),
            contentType: "application/json; charset=utf-8;",
            dataType: "json",
            success: function(response) {
                //console.log(response);
                if (response != null) {
                    if (response.sts_code == 1) {

                        //return true;
                        var files = $("#fileUpload").get(0).files;
                        var data = new FormData();

                        if (files.length > 0) {
                            data.append("UploadedImage", files[0]);

                            var ajaxRequest = $.ajax({
                                type: "POST",
                                url: $("#urlPath").val() + "/PilihanGanda/upload_question_image?name=" + (response.code_file),
                                contentType: false,
                                processData: false,
                                data: data,
                                success: function(response) {
                                    //console.log(response);
                                    if (response.message == 1) {
                                        $('#gridPilgan').data('kendoGrid').dataSource.read();
                                        $('#modal-editor').modal('hide');
                                        Swal(
                                            'SUKSES',
                                            'Data List Pertanyaan Diperbarui',
                                            'success'
                                        );
                                    } else {
                                        $('#modal-editor').modal('hide');
                                        Swal(
                                            'FAILED',
                                            'Data List Pertanyaan Tidak Berubah',
                                            'error'
                                        );
                                    }
                                }
                            });

                            ajaxRequest.done(function(xhr, textStatus) {
                                // Do other operation
                            });
                        } else {
                            $('#gridPilgan').data('kendoGrid').dataSource.read();
                            $('#modal-editor').modal('hide');
                            Swal(
                                'SUKSES',
                                'Data List Pertanyaan Diperbarui & No Upload',
                                'success'
                            );
                        }
                    } else if (parseInt(response.sts_code) == 0) {
                        $('#modal-editor').modal('hide');
                        Swal({
                            type: 'error',
                            title: 'FAILED',
                            text: response.error,
                        });
                        return false;
                    }
                } else {
                    $('#modal-editor').modal('hide');
                    Swal({
                        type: 'error',
                        title: 'Error Code : Unkwonw',
                        text: "something went wrong please try again",
                    });
                    return false;
                }
            },
            failure: function(response) {
                $('#modal-editor').modal('hide');
                Swal({
                    type: 'error',
                    title: 'Error Code : FAILTURE',
                    text: response.responseText,
                });
                return false;
            },
            error: function(response) {
                $('#modal-editor').modal('hide');
                Swal({
                    type: 'error',
                    title: 'Error Code : Error',
                    text: response.responseText,
                });
                return false;
            }
        });
    }
}

function grid_add() {
    add_event = 1;
    indexadd = 5;
    var min_pool = 4;
    for (var i = 1; i <= min_pool; i++) {
        $("#ans_row" + i).show();
    }

    for (var i = min_pool + 1; i <= 10; i++) {
        $("#ans_row" + i).hide();
    }

    $("#S_MPOSITION , #S_MCERT").val('default').selectpicker("refresh");
    $('#lbl_modul').text($('#S_MODUL').select2('data')[0].text);
    $('#lbl_submodul').text($('#S_SUBMODUL').select2('data')[0].text);
    $('.in_score').attr('checked', false);
    $('.cbx_score').attr('checked', false);
    $('.in_answer , #txa_question , #lbl_file_upload').val(null);
    $('#img-upload').attr('src', $("#urlPath").val() + "/question_image/no_image.jpg");

    $('#tbx_maxscore').val(1);
    $('#tbx_maxtime').val(0);

    element_show();

    $('#modal-editor').modal('show');
}

function grid_update(e) {
    e.preventDefault();
    add_event = 2;

    var data = this.dataItem($(e.currentTarget).closest("tr"));

    var jumlah_list_jawab = get_jml_ListJawaban();
    indexadd = get_jml_ListJawaban() + 1;


    for (var i = 1; i <= jumlah_list_jawab; i++) {
        $("#ans_row" + i).show();
    }

    for (var i = jumlah_list_jawab + 1; i <= 10; i++) {
        $("#ans_row" + i).hide();
    }

    element_show();

    $('#modal-editor').modal('show');
    $('#S_MCERT').val(((data.CERT_FOR).split(','))).change();
    $('#S_MPOSITION').val(((data.DESTINATION_POSITION).split(','))).change();
    $('#S_EGI').val(data.EGI_GENERAL).change();
    $('#lbl_modul').text($('#S_MODUL').select2('data')[0].text);
    $('#lbl_submodul').text($('#S_SUBMODUL').select2('data')[0].text);
    $('#txa_question').val(data.QUESTION_CONTENT);
    $('#tbx_maxscore').val(data.QUESTION_MAX_SCORE);
    $('#tbx_maxtime').val(data.QUESTION_MAX_TIME);
    $('#tbx_question_id').val(data.QUESTION_ID);
    $('#lbl_file_upload').val(data.IMAGE_PATH);
    $('#img-upload').attr('src', $("#urlPath").val() + "/question_image/" + data.IMAGE_PATH);

    if ($('#lbl_file_upload').val() === "no_image.jpg") {
        $("#remove_upload").prop("disabled", true);
    } else {
        $("#remove_upload").prop("disabled", false);
    }

    var tmp_answ = [data.ANSWER_1, data.ANSWER_2, data.ANSWER_3, data.ANSWER_4, data.ANSWER_5, data.ANSWER_6, data.ANSWER_7, data.ANSWER_8, data.ANSWER_9, data.ANSWER_10];
    var tmp_ansscore = [data.ANSWER_1_SCORE, data.ANSWER_2_SCORE, data.ANSWER_3_SCORE, data.ANSWER_4_SCORE, data.ANSWER_5_SCORE, data.ANSWER_6_SCORE, data.ANSWER_7_SCORE, data.ANSWER_8_SCORE, data.ANSWER_9_SCORE, data.ANSWER_10_SCORE];

    for (var i = 1; i <= jumlah_list_jawab; i++) {
        $("#tbt_score" + i).val(tmp_ansscore[(i - 1)]);
        if (tmp_ansscore[(i - 1)] == 1) {
            if (parseInt(($('#S_TYPE').select2('data')[0].id)) == 1) {
                $("#tbt_score" + i).prop("checked", true);
            } else if (parseInt(($('#S_TYPE').select2('data')[0].id)) == 2) {
                $("#cbx_score" + i).prop("checked", true);
            }
        } else {
            if (parseInt(($('#S_TYPE').select2('data')[0].id)) == 1) {
                $("#tbt_score" + i).prop("checked", false);
            } else if (parseInt(($('#S_TYPE').select2('data')[0].id)) == 2) {
                $("#cbx_score" + i).prop("checked", false);
            }
        }

        $("#tbx_answer" + i).val(tmp_answ[(i - 1)]);
    }

    if (data.IS_ACTIVE == 1) {
        $("#cbx_isactive").attr('checked', true).val(1);
    } else {
        $("#cbx_isactive").attr('checked', false).val(0);
    }

    function get_jml_ListJawaban() {
        var count = 1
        if (data.ANSWER_2 == '') {
            count = 1;
        } else if (data.ANSWER_3 === '' || data.ANSWER_3 === 'NULL' || data.ANSWER_3 === null) {
            count = 2;
        } else if (data.ANSWER_4 === '' || data.ANSWER_4 === 'NULL' || data.ANSWER_4 === null) {
            count = 3;
        } else if (data.ANSWER_5 === '' || data.ANSWER_5 === 'NULL' || data.ANSWER_5 === null) {
            count = 4;
        } else if (data.ANSWER_6 === '' || data.ANSWER_6 === 'NULL' || data.ANSWER_6 === null) {
            count = 5;
        } else if (data.ANSWER_7 === '' || data.ANSWER_7 === 'NULL' || data.ANSWER_7 === null) {
            count = 6;
        } else if (data.ANSWER_8 === '' || data.ANSWER_8 === 'NULL' || data.ANSWER_8 === null) {
            count = 7;
        } else if (data.ANSWER_9 === '' || data.ANSWER_9 === 'NULL' || data.ANSWER_9 === null) {
            count = 8;
        } else if (data.ANSWER_10 === '' || data.ANSWER_10 === 'NULL' || data.ANSWER_10 === null) {
            count = 9;
        } else {
            count = 10;
        }

        return count;
    }
}

function element_show() {

    if (parseInt(($('#S_TYPE').select2('data')[0].id)) == 1) {
        $('.in_score').show();
        $('.cbx_score').hide();
    } else {
        $('.in_score').hide();
        $('.cbx_score').show();
    }
}

function createul(data) {
    var YourArray = data.split(",");

    var ObjUl = $('<ul></ul>');
    for (i = 0; i < YourArray.length; i++) {
        var Objli = $('<li></li>');
        var Obja = $('<a></a>');

        ObjUl.addClass("ui-menu-item");
        ObjUl.attr("role", "menuitem");

        Obja.addClass("ui-all");
        Obja.attr("tabindex", "-1");

        Obja.text(YourArray[i]);
        Objli.append(Obja);

        ObjUl.append(Objli);
    }

    return ObjUl;
}

function grid_delete(e) {
    var data = this.dataItem($(e.currentTarget).closest("tr"));

    Swal({
        title: 'Konfirmasi',
        text: "Anda akan menghapus data pertanyaan ini ?",
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Oke'
    }).then((result) => {
        if (result.value) {
            $.ajax({
        type: 'POST',
    url: $("#urlPath").val() + '/PilihanGanda/deletePilihanGanda',
    cache: false,
    data: {
        question_id: data.QUESTION_ID
    },
    success: function(req) {
        Swal({
            type: req.type,
            title: req.hearder,
            text: req.remarks
        });

        $("#gridPilgan").data("kendoGrid").dataSource.read();
    }
});
}
});
}

function add_new_mapp() {
    $('#div-card').show();
    $('#filter').hide();
    $('#bot-up').hide();
    $("#gridPilgan").hide()

}

function loadmodule() {

    var modulutama = $("#txt_modulpg").kendoDropDownList({
        optionLabel: "Pilih",
        dataTextField: "MODULE_NAME",
        dataValueField: "MODULE_ID",
        dataSource: {
            type: "json",
            serverFiltering: true,
            transport: {
                read: {
                    url: $("#urlPath").val() + "/PilihanGAnda/AjaxReadModul",
                    contentType: "application/json",
                    type: "POST",
                    cache: false
                }
            },
            schema: {
                data: "Data",
                total: "Total"
            }
        },
        select: function(e) {
            var dataItem = this.dataItem(e.item.index());
            //console.log(dataItem);
            modul = dataItem.MODULE_ID;
            ListModul(modul);
            ListEgi(modul);
        }
    });
}

function ListModul(modul) {
    var submodul = {
        'smodul': modul
    }

    $("#txt_submodulpg").kendoDropDownList({
        optionLabel: "Pilih",
        dataTextField: "MODULE_SUB_NAME",
        dataValueField: "MODULE_SUB_ID",
        dataSource: {
            type: "json",
            serverFiltering: true,
            transport: {
                read: {
                    url: $("#urlPath").val() + "/PilihanGAnda/AjaxReadSubModul?smodul=" + modul,
                    contentType: "application/json",
                    type: "POST",
                    cache: false
                }
            },
            schema: {
                data: "Data",
                total: "Total"
            }
        }
    });
}

function loadtipe() {
    var tipe = $("#txt_tipepg").kendoDropDownList({
        optionLabel: "Pilih",
        dataTextField: "TYPE_DESC",
        dataValueField: "TYPE_CODE",
        dataSource: {
            type: "json",
            serverFiltering: true,
            transport: {
                read: {
                    url: $("#urlPath").val() + "/PilihanGAnda/AjaxReadTipe",
                    contentType: "application/json",
                    type: "POST",
                    cache: false
                }
            },
            schema: {
                data: "Data",
                total: "Total"
            }
        },
        select: function(e) {
            var dataItem = this.dataItem(e.item.index());
            //console.log(dataItem);
            modul = dataItem.TYPE_CODE;
            ListModul(modul);
        }
    });
}

$("#back_to").click(function() {
    $('#div-card').hide();
    $('#gridPilgan').show();
    $('#filter').show();
    $('#bot-up').show();
    //$('#gridPilgan').data('kendoGrid').dataSource.read();
});

var urlPathFile = $("#urlPath").val() + "/FileUpload/Template/";

function clickDownload() {
    window.location.href = urlPathFile + "Template Pilihan Ganda.xlsx";
}

function saveUpload() {
    $.ajax({
        url: $("#urlPath").val() + "/PilihanGanda/AJaxSaveUpload",
        dataType: 'json',
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify({
            SESS_ID: iSessUpload
        }),
        success: function(data) {
            //console.log("Pas Mau save ke table utama : " + iSessUpload)
            Swal(
                'Good job!',
                'Data telah dimasukkan di database',
                'success'
            )
            document.getElementById("fl_SoalPG").value = null;
            $(".k-upload-files.k-reset").find("li").remove();
            $('#md_temp').modal('hide');
            $("#gridPilgan").data("kendoGrid").dataSource.read();
        }
    });
}

function cancelUpload() {
    document.getElementById("fl_SoalPG").value = null;
    $(".k-upload-files.k-reset").find("li").remove();
    $.ajax({
        url: $("#urlPath").val() + "/PilihanGanda/AJaxCancelUpload",
        dataType: 'json',
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify({
            SESS_ID: iSessUpload
        }),
        success: function(data) {
            //console.log("Pas Cancel: " + iSessUpload)
            $('#md_temp').modal('hide');

            $("#gridPilgan").data("kendoGrid").dataSource.read();
        }
    });
}

$(document).ready(function() {

    loadmodule();
    loadtipe();
    tipesoal();
    posisi();
    $("#fl_SoalPG").kendoUpload({
        allowmultiple: false,
        batch: false,
        async: {
            saveUrl: "save",
            autoUpload: false
        },
        upload: uploadFile,
        success: onSuccessUpload,
        error: onErrorUpload
    });
});

function uploadFile(e) {
    var files = e.files;

    var MODULE_ID = $("#txt_modulpg").val();
    var MODULE_SUB_ID = $("#txt_submodulpg").val();
    var TIPE = $("#txt_tipepg").val();
    var SOALTIPE = $("#soaltipe").val();
    var POSISI = $("#posisi").val();
    var EGI_GENERAL = $("#txt_egipg").val();
    //session_tempt = randomString(10, 'PAMAPERSADANUSANTARA');

    //console.log("Pas Mau upload :"+iSessUpload);

    $.each(files, function() {
        $("#fl_SoalPG").data("kendoUpload").options.async.saveUrl = $("#urlPath").val() + '/PilihanGanda/Upload?sMODULE_ID=' + MODULE_ID + '&sMODULE_SUB_ID=' + MODULE_SUB_ID + '&sEGI_GENERAL=' + EGI_GENERAL + '&sTIPE=' + TIPE + '&sSOALTIPE=' + SOALTIPE + '&sPOSISI=' + POSISI + '&sSession=' + iSessUpload;
    });
}

function onSuccessUpload(e) {
    console.log(e.response);
    //wndUpld.center().open();
    $('#md_temp').modal('show');
    loadGridUpload();
    //console.log("oN SUCCESS : "+iSessUpload)
}

function onErrorUpload(e) {
    console.log(e);

    alert("Upload Gagal !");
    //$("#filter").show();
    $("#bot-up").hide();
}

function loadGridUpload() {

    $("#gridUpload").kendoGrid({
        dataSource: {
            type: "json", //tipe formating
            transport: {
                read: { //tampil
                    url: $("#urlPath").val() + "/PilihanGanda/AJaxReadUpload",
                    contentType: "application/json",
                    data: {
                        sSession: iSessUpload
                    },
                    type: "POST",
                    cache: false
                },
                parameterMap: function(data, operation) //parsing biar ke grid
                {
                    return kendo.stringify(data);
                }
            },
            serverPaging: true,
            serverFiltering: true,
            serverSorting: true,
            height: 570,
            pageable: true,
            pageSize: 15,
            schema: {
                data: "Data", //jmlh data
                total: "Total", //berapa rows
                model: {
                    id: "QUESTION_ID",
                    fields: {
                        QUESTION_ID: {
                            type: "string",
                            filterable: true,
                            sortable: true,
                            editable: false
                        },
                        SESSION: {
                            type: "string",
                            filterable: true,
                            sortable: true,
                            editable: false
                        },
                        MODULE_ID: {
                            type: "string",
                            filterable: true,
                            sortable: true,
                            editable: false
                        },
                        MODULE_SUB_ID: {
                            type: "string",
                            filterable: true,
                            sortable: true,
                            editable: false
                        },
                        QUESTION_TYPE: {
                            type: "number",
                            filterable: true,
                            sortable: true,
                            editable: false
                        },
                        QUESTION_CONTENT: {
                            type: "string",
                            filterable: true,
                            sortable: true,
                            editable: false
                        },
                        ANSWER_1: {
                            type: "string",
                            filterable: true,
                            sortable: true
                        },
                        ANSWER_1_SCORE: {
                            type: "number",
                            filterable: true,
                            sortable: true
                        },
                        ANSWER_2: {
                            type: "string",
                            filterable: true,
                            sortable: true
                        },
                        ANSWER_2_SCORE: {
                            type: "number",
                            filterable: true,
                            sortable: true
                        },
                        ANSWER_3: {
                            type: "string",
                            filterable: true,
                            sortable: true
                        },
                        ANSWER_3_SCORE: {
                            type: "number",
                            filterable: true,
                            sortable: true
                        },
                        ANSWER_4: {
                            type: "string",
                            filterable: true,
                            sortable: true
                        },
                        ANSWER_4_SCORE: {
                            type: "number",
                            filterable: true,
                            sortable: true
                        },
                        ANSWER_5: {
                            type: "string",
                            filterable: true,
                            sortable: true
                        },
                        ANSWER_5_SCORE: {
                            type: "number",
                            filterable: true,
                            sortable: true
                        },
                        ANSWER_6: {
                            type: "string",
                            filterable: true,
                            sortable: true
                        },
                        ANSWER_6_SCORE: {
                            type: "number",
                            filterable: true,
                            sortable: true
                        },
                        ANSWER_7: {
                            type: "string",
                            filterable: true,
                            sortable: true
                        },
                        ANSWER_7_SCORE: {
                            type: "number",
                            filterable: true,
                            sortable: true
                        },
                        ANSWER_8: {
                            type: "string",
                            filterable: true,
                            sortable: true
                        },
                        ANSWER_8_SCORE: {
                            type: "number",
                            filterable: true,
                            sortable: true
                        },
                        ANSWER_9: {
                            type: "string",
                            filterable: true,
                            sortable: true
                        },
                        ANSWER_9_SCORE: {
                            type: "number",
                            filterable: true,
                            sortable: true
                        },
                        ANSWER_10: {
                            type: "string",
                            filterable: true,
                            sortable: true
                        },
                        ANSWER_10_SCORE: {
                            type: "number",
                            filterable: true,
                            sortable: true
                        }
                    }
                }

            }

        },
        filterable: true,
        sortable: true,
        editable: true,
        pageable: true,
        scrollable: true,
        pageable: {
            refresh: true,
            buttonCount: 10,
            input: true,
            pageSizes: [10, 20, 50, 100, 1000, 100000],
            info: true,
            messages: {}
        },
        columns: [{
            command: [{
                name: "add-data",
                text: "<span class='k-icon k-add'></span>Add new record"
            }],
            hidden: true
        },
            {
                title: "No",
                width: "35px",
                template: "<center> #= ++rowNo # </center>",
                filterable: false
            }, {
                field: "QUESTION_ID",
                hidden: true
            }, {
                field: "QUESTION_CONTENT",
                title: "Pertanyaan",
                width: "300px"

            },
            {
                field: "ANSWER_1",
                title: "Jawaban 1",
                width: "300px"

            },
            {
                field: "ANSWER_1_SCORE",
                title: "A",
                width: "50px",
                headerAttributes: {
                    "class": "center-header"
                }

            },
            {
                field: "ANSWER_2",
                title: "Jawaban 2",
                width: "300px"

            },
            {
                field: "ANSWER_2_SCORE",
                title: "B",
                width: "50px",
                headerAttributes: {
                    "class": "center-header"
                }
            },
            {
                field: "ANSWER_3",
                title: "Jawaban 3",
                width: "300px"

            },
            {
                field: "ANSWER_3_SCORE",
                title: "C",
                width: "50px",
                headerAttributes: {
                    "class": "center-header"
                }
            },
            {
                field: "ANSWER_4",
                title: "Jawaban 4",
                width: "300px"
            },
            {
                field: "ANSWER_4_SCORE",
                title: "D",
                width: "50px",
                headerAttributes: {
                    "class": "center-header"
                }
            }
        ],
        dataBinding: function() {
            window.rowNo = (this.dataSource.page() - 1) * this.dataSource.pageSize();
        }
    });
}

function tipesoal() {

    var tipesoal = $("#soaltipe").kendoMultiSelect({
        optionLabel: "Pilih",
        dataTextField: "JENIS_UJIAN_DESC",
        dataValueField: "JENIS_UJIAN_CODE",
        dataSource: {
            type: "json",
            transport: {
                read: {
                    url: $("#urlPath").val() + "/PilihanGAnda/AjaxReadTipeSoal",
                    contentType: "application/json",
                    type: "POST",
                    cache: false
                }
            },
            schema: {
                data: "Data",
                total: "Total"
            }
        }
    });
}

function ListEgi(modul) {
    var egi = {
        'egi': modul
    }

    $("#txt_egipg").kendoDropDownList({
        optionLabel: "Pilih",
        dataTextField: "EGI_GENERAL",
        dataValueField: "EGI_GENERAL",
        dataSource: {
            type: "json",
            serverFiltering: true,
            transport: {
                read: {
                    url: $("#urlPath").val() + "/PilihanGAnda/AjaxReadEgi?egi=" + modul,
                    contentType: "application/json",
                    type: "POST",
                    cache: false
                }
            },
            schema: {
                data: "Data",
                total: "Total"
            }
        }
    });
}

function posisi() {

    var tipesoal = $("#posisi").kendoMultiSelect({
        optionLabel: "Pilih",
        dataTextField: "POSITION_DESC",
        dataValueField: "POSITION_CODE",
        dataSource: {
            type: "json",
            transport: {
                read: {
                    url: $("#urlPath").val() + "/PilihanGAnda/AjaxReadPosisi",
                    contentType: "application/json",
                    type: "POST",
                    cache: false
                }
            },
            schema: {
                data: "Data",
                total: "Total"
            }
        }
    });
}