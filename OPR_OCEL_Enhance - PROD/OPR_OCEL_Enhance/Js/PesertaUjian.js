var wnd_add, wnd_update, s_str_kelJabatan, s_str_fungsional, s_str_materi;

$(document).ready(function () {
    loadGridPesertaUjian();

    $("#btn_save_changetime").click(function(){
        //console.log($('#txt_RECORD_ID').val())
        $.ajax({
            type: "POST",
            url: $("#urlPath").val() + "/PesertaUjianOnline/UpateTimes",
            data: {
                RECORD_ID : $('#txt_RECORD_ID').val(),
                REMINDING_TIME : $('#txt_changeTimes').val()
            },
            cache: false,
            success: function(data){
                if(data.status == true){
                    $("#gridPesertaUjian").data("kendoGrid").dataSource.read();
                    $('#modalUbahWaktu').modal('hide');
                }else if(data.status == false){
                    $.alert({
                        title: "Koneksi Bermasalah",
                        content: "Maaf terjadi error, "+data.message,
                        type: 'red',
                        animation: 'zoom',
                        theme : 'material',
                        draggable: true
                    });
                }
            }
          });
    });
});

$(function () {
    $("#btnView").click(function () {
        s_str_kelJabatan = $("#cb_kelompokJabatan").val();
        s_str_fungsional = $("#cb_fungsional").val();
        s_str_materi = $("#cb_materi").val();

        if (s_str_kelJabatan == "" && s_str_fungsional == "" && s_str_materi == "") {
            alert("Pilih kelompok jabatan dan fungsionalnya terlebih dahulu");
        } else if (s_str_kelJabatan == "") {
            alert("Pilih kelompok jabatan terlebih dahulu");
        } else if (s_str_fungsional == "") {
            alert("Pilih fungsionalnya terlebih dahulu");
        } else if (s_str_materi == "") {
            alert("Pilih materinya terlebih dahulu");
        } else {
            loadGridQuestListPilGan();
        }
    });
});

function alertData(remarks) {
    var myAlert = $("#myAlert");
    myAlert.html("<div><span class='glyphicon glyphicon-check'></span>&nbsp;" + remarks + "</div>");
    myAlert.slideDown(800);
    window.setTimeout(function () { myAlert.hide() }, 2000);
}

function getUrlPath() {
    return $("#urlPath").val();
}


function loadGridPesertaUjian() {
    $("#gridPesertaUjian").empty();

    var gridPesertaUjian = $("#gridPesertaUjian").kendoGrid({
        dataSource: {
            type: "json",
            transport: {
                read: {
                    url: $("#urlPath").val() + "/PesertaUjianOnline/AjaxReadPertanyaan",
                    contentType: "application/json",
                    // data: { s_str_kelJabatan: s_str_kelJabatan, s_str_fungsional: s_str_fungsional },
                    type: "POST",
                    cache: false,
                    complete: function (e) {

                    },
                },
                parameterMap: function (data, operation) {
                    return kendo.stringify(data)
                }
            },
            pageSize: 15,
            serverPaging: true,
            serverFiltering: true,
            serverSorting: true,
            schema: {
                data: "Data",
                total: "Total",
                model: {
                    id: "REGISTRATION_ID",
                    fields: {
                        REGISTRATION_ID: { type: "string", filterable: false, sortable: false, editable: false },
                        STUDENT_ID: { type: "string", filterable: false, sortable: false, editable: false },
                        NAME: { type: "string", filterable: false, sortable: false, editable: false },
                        POS_TITLE: { type: "string", filterable: false, sortable: false, editable: false },
                        DSTRCT_CODE: { type: "string", filterable: false, sortable: false, editable: false }
                    }
                }
            }
        },
        height: 620,
        pageable: true,
        pageable: {
            refresh: true,
            buttonCount: 10,
            input: true,
            pageSizes: [10, 20, 50, 100, 1000, 100000],
            info: true,
            messages: {
            }
        },
        detailInit: pertanyaanDetail,
        dataBound: function () {
            this.expandRow(this.tbody.find("tr.k-master-row"))
        },
        editable: "inline",
        filterable: true,
        sortable: true,
        resizable: true,
        columns: [
			{
			    title: "No",
			    width: "40px",
			    template: "#= ++rowNo #",
			    filterable: false
			}, {
			    field: "REGISTRATION_ID", title: "Kode Registrasi", width: "130px"

			}, {
			    field: "STUDENT_ID", title: "NRP Siswa", width: "100px"

			}, {
			    field: "NAME", title: "Nama Siswa", width: "150px"

			}, {
			    field: "DSTRCT_CODE", title: "Distrik", width: "100px"

			}, {
			    field: "POS_TITLE", title: "Posisi Jabatan", width: "150px"

			}, {
			    field: "DESCRIPTION", title: "Keterangan", width: "220px"

			}
        ],
        dataBinding: function () {
            window.rowNo = (this.dataSource.page() - 1) * this.dataSource.pageSize();
            window.noReq = (this.dataSource.page() - 1) * this.dataSource.pageSize();
        }
    });
}

function pertanyaanDetail(e) {
    $("<div/>").appendTo(e.detailCell).kendoGrid({
        dataSource: {
            type: "json",
            transport: {
                read: {
                    url: $("#urlPath").val() + "/PesertaUjianOnline/AjaxReadPertanyaanDetail",
                    contentType: "application/json",
                    type: "POST",
                    cache: false
                },
                destroy: {
                    url: $("#urlPath").val() + "/PesertaUjianOnline/DeletePertanyaanDetail",
                    contentType: "application/json",
                    type: "POST",
                    cache: false,
                    complete: function (data) {
                        $("#gridPesertaUjian").data("kendoGrid").dataSource.read();
                        alertData(data.responseJSON.message);
                    }
                },
                parameterMap: function (data, operation) {
                    return kendo.stringify(data)
                }
            },
            pageSize: 15,
            serverPaging: true,
            serverFiltering: true,
            serverSorting: true,
            sortable: true,
            resizable: true,
            scrollable: true,
            schema: {
                data: "Data",
                total: "Total",
                model: {
                    id: "RECORD_ID",
                    fields: {
                        RECORD_ID: { type: "string", filterable: true, sortable: true, editable: true },
                        REGISTRATION_ID: { type: "string", filterable: true, sortable: true, editable: true },
                        NUMBER_OF_QUESTION: { type: "number", filterable: true, sortable: true, editable: true },
                        DURATION_MINUTE: { type: "number", filterable: true, sortable: true, editable: true },
                        IS_SELF_ASSESMENT: { type: "boolean", filterable: true, sortable: true, editable: true },
                        PERCENT_COMPLETE: { type: "number", filterable: true, sortable: true, editable: true },
                        EXAM_ACTUAL_DATE: { type: "string", filterable: true, sortable: true, editable: false },
                        REMINDING_TIME: { type: "number", filterable: true, sortable: true, editable: false },
                        EXAM_LOCATIONS: { type: "string", filterable: true, sortable: true, editable: false }
                    }
                }
            },
            filter: { field: "REGISTRATION_ID", operator: "eq", value: e.data.REGISTRATION_ID }
        },
        editable: false,
        editable: {
            confirmation: "Anda yakin akan menghapus data ini?",
            mode: "inline"
        },
        toolbar: ["create"],
        columns: [
            {
                title: "No",
                width: "20px",
                template: "<center> #= ++noReq # </center>",
                filterable: false
            }, {
                field: "RECORD_ID",
                hidden: true
            }, {
                field: "REGISTRATION_ID",
                title: "Kode Registrasi",
                width: "50px"
            }, {
                field: "NUMBER_OF_QUESTION",
                title: "Jml. Soal",
                attributes: { style: "text-align: center" },
                width: "40px"
            }, {
                field: "DURATION_MINUTE",
                title: "Durasi",
                attributes: { style: "text-align: center" },
                width: "40px"
            }, {
                field: "EXAM_ACTUAL_DATE",
                title: "Disetujui",
                attributes: { style: "text-align: center" },
                width: "90px"
            }
            
            , {
                field: "IS_SELF_ASSESMENT",
                title: "Baca",
                width: "40px",
                template: "#= IS_SELF_ASSESMENT ? 'yes' : 'no' #"
            }, {
                field: "EXAM_STATUS",
                title: "E.S",
                width: "20px",
                attributes: { style: "text-align: center" }
            }, {
                field: "PERCENT_COMPLETE",
                title: "Progres",
                width: "35px",
                attributes: { style: "text-align: center" }
            },
            {
                field: "REMINDING_TIME",
                title: "Sisa Waktu",
                width: "55px",
                attributes: { style: "text-align: center" }
            },
            {
                command: [
                {
                    name: "update-data",
                    text: "<i class='fa fa-pencil-square' aria-hidden='true'></i> Reset",
                    click: grid_update
                },
                {
                    name: "destroy",
                    text: "Hapus"
                }],
                title: "Aksi",
                width: "70px"
            }
        ]
    });
}

function alertData2(remarks) {
    var myAlert = $("#myAlert2");
    myAlert.html("<div><span class='glyphicon glyphicon-check'></span>&nbsp;" + remarks + "</div>");
    myAlert.slideDown(800);
    window.setTimeout(function () { myAlert.hide() }, 2000);
}

// ======================================================================== INSERT DATA ====================================================================================== //

wnd_add = $("#wnd_add").kendoWindow({
    title: "Insert",
    modal: true,
    visible: false,
    draggable: true,
    width: "800px",
    actions: [
        "Maximize",
        "Minimize",
        "Close"
    ],
    pinned: true
}).data("kendoWindow");


function eventProcessQuestList(IMG_PATH) {

    var KJ_CODE, FUNC_CODE, CODE_MATERI, QUESTION, SELF_ASSESMENT, REAL_ASSESMENT, TRIAL, IsActive, GOLONGAN;

    if (document.getElementById('SELF_ASSESMENT').checked) {
        SELF_ASSESMENT = "true"
    } else {
        SELF_ASSESMENT = "false"
    }

    if (document.getElementById('REAL_ASSESMENT').checked) {
        REAL_ASSESMENT = "true"
    } else {
        REAL_ASSESMENT = "false"
    }

    if (document.getElementById('TRIAL').checked) {
        TRIAL = "true"
    } else {
        TRIAL = "false"
    }

    if (document.getElementById('IsActive').checked) {
        IsActive = "true"
    } else {
        IsActive = "false"
    }

    QUESTION = $("#QUESTION").val();
    KJ_CODE = $("#cb_kelompokJabatan").val();
    FUNC_CODE = $("#cb_fungsional").val();

    var param_data = $('#GOLONGAN option:selected');
    GOLONGAN = (function () {
        var param_ = "";
        var all = "";
        $(param_data).each(function (index, selected) {
            if ($(this).val() == "multiselect-all") {
                all = "1";
                return false;
            }
            param_ = param_.concat(",", $(this).val(), "");
            all = "0";
        });
        return param_;
    }());

    var param_data_kj = $('#KJ option:selected');
    KJ = (function () {
        var param_KJ = "";
        var all_KJ = "";
        $(param_data_kj).each(function (index, selected) {
            if ($(this).val() == "multiselect-all") {
                all_KJ = "1";
                return false;
            }
            param_KJ = param_KJ.concat(",", $(this).val(), "");
            all_KJ = "0";
        });
        return param_KJ;
    }());

    var param_data_func = $('#FUNCTIONAL option:selected');
    FUNCTIONAL = (function () {
        var param_func = "";
        var all_func = "";
        $(param_data_func).each(function (index, selected) {
            if ($(this).val() == "multiselect-all") {
                all_func = "1";
                return false;
            }
            param_func = param_func.concat(",", $(this).val(), "");
            all_func = "0";
        });
        return param_func;
    }());

    var param_data_materi = $('#MATERI option:selected');
    MATERI = (function () {
        var param_materi = "";
        var all_materi = "";
        $(param_data_materi).each(function (index, selected) {
            if ($(this).val() == "multiselect-all") {
                all_materi = "1";
                return false;
            }
            param_materi = param_materi.concat(",", $(this).val(), "");
            all_materi = "0";
        });
        return param_materi;
    }());

    GOLONGAN = GOLONGAN.substring(1, GOLONGAN.length);
    KJ = KJ.substring(1, KJ.length);
    FUNCTIONAL = FUNCTIONAL.substring(1, FUNCTIONAL.length);
    MATERI = MATERI.substring(1, MATERI.length);

    if (QUESTION != "" && GOLONGAN != "") {
        var sTBL_M_QUESTION_LIST = {
            QUEST_PID: "", QUESTION: QUESTION, TYPE_CODE: 1, KJ_CODE: KJ,
            FUNC_CODE: FUNCTIONAL, CODE_MATERI: MATERI, IMG_PATH: IMG_PATH, SELF_ASSESMENT: SELF_ASSESMENT,
            REAL_ASSESMENT: REAL_ASSESMENT, TRIAL: TRIAL, IsActive: IsActive, GOL: GOLONGAN
        }

        $.ajax({
            type: "POST",
            dataType: "json",
            contentType: "application/json",
            url: $("#urlPath").val() + "/QuestListPilGan/AjaxInsertQuestList",
            data: JSON.stringify(sTBL_M_QUESTION_LIST),
            success: function (response) {
                $("#QUEST_PID").val(response.quest_pid);
                loadGridQuestionAnswer(response.quest_pid);
                wnd_add.close();

                $("#gridQuestListPilGan").data("kendoGrid").dataSource.read();
                $("#IMG_PATH").val("");
            }
        });
    } else if (QUESTION == "") {
        alert("Isikan pertanyaan");
    } else if (GOLONGAN == "") {
        alert("Pilih golongan untuk pertanyaan");
    } else {
        alert("Isikan pertanyaan dan pilih golongan untuk pertanyaan");
    }
}

function loadGridQuestionAnswer(quest_pid) {
    $("#gridQuestionAnswer").empty();

    var gridQuestionAnswer = $("#gridQuestionAnswer").kendoGrid({
        dataSource: {
            type: "json",
            transport: {
                read: {
                    url: $("#urlPath").val() + "/QuestListPilGan/AjaxReadQuestAnswer",
                    contentType: "application/json",
                    data: { s_str_quest_pid: quest_pid },
                    type: "POST",
                    cache: false
                },
                create: {
                    url: $("#urlPath").val() + "/QuestListPilGan/AjaxInsertQuestAnswer",
                    contentType: "application/json",
                    data: { QUEST_PID_OLD: $("#QUEST_PID").val() },
                    type: "POST",
                    cache: false,
                    complete: function (data) {
                        $("#gridQuestionAnswer").data("kendoGrid").dataSource.read();
                        alertData2(data.responseJSON.remarks);
                    }
                },
                update: {
                    url: $("#urlPath").val() + "/QuestListPilGan/AjaxUpdateQuestAnswer",
                    contentType: "application/json",
                    type: "POST",
                    cache: false,
                    complete: function (data) {
                        $("#gridQuestionAnswer").data("kendoGrid").dataSource.read();
                        $("#gridQuestionAnswer").data("kendoGrid").refresh();
                        alertData2(data.responseJSON.remarks);
                    }
                },
                destroy: {
                    url: $("#urlPath").val() + "/QuestListPilGan/AjaxDeleteQuestAnswer",
                    contentType: "application/json",
                    type: "POST",
                    cache: false,
                    complete: function (data) {
                        $("#gridQuestionAnswer").data("kendoGrid").dataSource.read();
                        alertData2(data.responseJSON.remarks);
                    }
                },
                parameterMap: function (data, operation) {
                    return kendo.stringify(data)
                }
            },
            pageSize: 15,
            serverPaging: true,
            serverFiltering: true,
            serverSorting: true,
            schema: {
                data: "Data",
                total: "Total",
                model: {
                    id: "PID",
                    fields: {
                        PID: { type: "string", filterable: false, sortable: false, editable: false },
                        QUEST_PID: { type: "string", filterable: true, sortable: true, editable: true },
                        ANSWER_SHORT: { type: "string", filterable: false, sortable: true, editable: true },
                        ANSWER: { type: "string", filterable: true, sortable: true, editable: true },
                        IMG_PATH: { type: "string", filterable: false, sortable: false, editable: true },
                        SCORE: { type: "number", filterable: true, sortable: true, editable: true }
                    }
                }
            }
        },
        resizable: true,
        editable: "inline",
        toolbar: ["create"],
        columns: [
            {
                field: "ANSWER_SHORT", title: "Pilihan", width: "50px", editor: editor_answerShort
            }, {
                field: "ANSWER", title: "Jawaban", width: "150px"
            }, {
                field: "IMG_PATH", title: "Gambar", width: "100px",
                editor: '<input type="file" name="IMG_PATH_ANSWER" id="IMG_PATH_ANSWER" onChange="pathChange(this)"/>',
                template: $("#tempIMG_PATH_thumbnail").html()
            }, {
                field: "IMG_PATH_FILENAME", width: "100px", hidden: true
            }, {
                field: "SCORE", title: "Nilai", width: "100px"
            }, {
                command: ["edit", "destroy"], title: "Action", width: "100px"
            }
        ]
    });

    function editor_answerShort(container, options) {
        if (options.model.PID != "") {
            $('<input disabled type="text" class="k-input k-textbox" name="ANSWER_SHORT" data-bind="value:ANSWER_SHORT">').appendTo(container);
        } else {
            $('<input type="text" class="k-input k-textbox" name="ANSWER_SHORT" data-bind="value:ANSWER_SHORT">').appendTo(container);
        }
    }
}

// =========================================================================================================================================================================== //

function alertData3(remarks) {
    var myAlert = $("#myAlert3");
    myAlert.html("<div><span class='glyphicon glyphicon-check'></span>&nbsp;" + remarks + "</div>");
    myAlert.slideDown(800);
    window.setTimeout(function () { myAlert.hide() }, 2000);
}

// ======================================================================== UPDATE DATA ====================================================================================== //

wnd_update = $("#wnd_update").kendoWindow({
    title: "Update",
    modal: true,
    visible: false,
    draggable: true,
    width: "1200px",
    actions: [
        "Close"
    ],
    pinned: true
}).data("kendoWindow");

function eventUpdateQuestList(IMG_PATH) {

    var KJ_CODE, FUNC_CODE, CODE_MATERI, QUEST_PID, MDL_CODE, QUESTION, SELF_ASSESMENT, REAL_ASSESMENT, TRIAL, IsActive, GOLONGAN;

    if (document.getElementById('SELF_ASSESMENT_UPDATE').checked) {
        SELF_ASSESMENT = "true"
    } else {
        SELF_ASSESMENT = "false"
    }

    if (document.getElementById('REAL_ASSESMENT_UPDATE').checked) {
        REAL_ASSESMENT = "true"
    } else {
        REAL_ASSESMENT = "false"
    }

    if (document.getElementById('TRIAL_UPDATE').checked) {
        TRIAL = "true"
    } else {
        TRIAL = "false"
    }

    if (document.getElementById('IsActive_UPDATE').checked) {
        IsActive = "true"
    } else {
        IsActive = "false"
    }

    QUEST_PID = $("#QUEST_PID_UPDATE").val();
    QUESTION = $("#QUESTION_UPDATE").val();
    // KJ_CODE = $("#cb_kelompokJabatan").val();
    // FUNC_CODE = $("#cb_fungsional").val();

    var param_data = $('#GOLONGAN_UPDATE option:selected');
    GOLONGAN = (function () {
        var param_ = "";
        var all = "";
        $(param_data).each(function (index, selected) {
            if ($(this).val() == "multiselect-all") {
                all = "1";
                return false;
            }
            param_ = param_.concat(",", $(this).val(), "");
            all = "0";
        });
        return param_;
    }());


    var param_data_kj = $('#KJ_UPDATE option:selected');
    KJ = (function () {
        var param_KJ = "";
        var all_KJ = "";
        $(param_data_kj).each(function (index, selected) {
            if ($(this).val() == "multiselect-all") {
                all_KJ = "1";
                return false;
            }
            param_KJ = param_KJ.concat(",", $(this).val(), "");
            all_KJ = "0";
        });
        return param_KJ;
    }());

    var param_data_func = $('#FUNCTIONAL_UPDATE option:selected');
    FUNCTIONAL = (function () {
        var param_func = "";
        var all_func = "";
        $(param_data_func).each(function (index, selected) {
            if ($(this).val() == "multiselect-all") {
                all_func = "1";
                return false;
            }
            param_func = param_func.concat(",", $(this).val(), "");
            all_func = "0";
        });
        return param_func;
    }());

    var param_data_materi = $('#MATERI_UPDATE option:selected');
    MATERI = (function () {
        var param_materi = "";
        var all_materi = "";
        $(param_data_materi).each(function (index, selected) {
            if ($(this).val() == "multiselect-all") {
                all_materi = "1";
                return false;
            }
            param_materi = param_materi.concat(",", $(this).val(), "");
            all_materi = "0";
        });
        return param_materi;
    }());

    GOLONGAN = GOLONGAN.substring(1, GOLONGAN.length);
    KJ = KJ.substring(1, KJ.length);
    FUNCTIONAL = FUNCTIONAL.substring(1, FUNCTIONAL.length);
    MATERI = MATERI.substring(1, MATERI.length);

    if (QUESTION != "" && GOLONGAN != "") {
        var sTBL_M_QUESTION_LIST = {
            QUEST_PID: QUEST_PID, QUESTION: QUESTION, TYPE_CODE: 1, KJ_CODE: KJ,
            FUNC_CODE: FUNCTIONAL, CODE_MATERI: MATERI, IMG_PATH: IMG_PATH, SELF_ASSESMENT: SELF_ASSESMENT,
            REAL_ASSESMENT: REAL_ASSESMENT, TRIAL: TRIAL, IsActive: IsActive, GOL: GOLONGAN
        }

        $.ajax({
            type: "POST",
            dataType: "json",
            contentType: "application/json",
            url: $("#urlPath").val() + "/QuestListPilGan/AjaxUpdateQuestList",
            data: JSON.stringify(sTBL_M_QUESTION_LIST),
            success: function (response) {
                $("#gridQuestListPilGan").data("kendoGrid").dataSource.read();
                $("#gridQuestListPilGan").data("kendoGrid").refresh();
                alertData3(response.remarks);
            }
        });

    } else if (QUESTION == "") {
        alert("Isikan pertanyaan");
    } else if (GOLONGAN == "") {
        alert("Pilih golongan untuk pertanyaan");
    } else {
        alert("Isikan pertanyaan dan pilih golongan untuk pertanyaan");
    }
}

// =========================================================================================================================================================================== //

// ======================================================================== UPLOAD DATA ====================================================================================== //

function uploadImageQuest() {

    input = document.getElementById('IMG_PATH');

    if (!input.files[0]) {
        alert("ini");
        eventProcessQuestList();
    } else {
        if (window.FormData !== undefined) {

            var data = new FormData();
            data.append("IMG_PATH", $("#IMG_PATH")[0].files[0]);

            $.ajax({
                type: "POST",
                url: $("#urlPath").val() + "/QuestListPilGan/AjaxUploadQuestList",
                contentType: false,
                processData: false,
                data: data,
                success: function (result) {
                    eventProcessQuestList(result);
                },
                error: function (xhr, status, p3, p4) {
                    var err = "Error " + " " + status + " " + p3 + " " + p4;
                    if (xhr.responseText && xhr.responseText[0] == "{")
                        err = JSON.parse(xhr.responseText).Message;
                }
            });
        } else {
            alert("This browser doesn't support HTML5 file uploads!");
        }
    }
}

function grid_update(e) {
    e.preventDefault();
    var data = this.dataItem($(e.currentTarget).closest("tr"));
    $('#txt_changeTimes').val(null);
    $('#txt_RECORD_ID').val(data.RECORD_ID);
    $('#lbl_sisa_waktu').text(data.REMINDING_TIME+ " Menit");
    $('#lbl_sesi_time').text(data.DURATION_MINUTE+ " Menit");

    $('#modalUbahWaktu').modal('toggle');
}

function uploadImageUpdateQuest() {
    if (window.FormData !== undefined) {
        var data = new FormData();
        data.append("IMG_PATH", $("#IMG_PATH")[0].files[0]);

        $.ajax({
            type: "POST",
            url: $("#urlPath").val() + "/QuestListPilGan/AjaxUploadQuestList",
            contentType: false,
            processData: false,
            data: data,
            success: function (result) {
                eventUpdateQuestList(result);
            },
            error: function (xhr, status, p3, p4) {
                var err = "Error " + " " + status + " " + p3 + " " + p4;
                if (xhr.responseText && xhr.responseText[0] == "{")
                    err = JSON.parse(xhr.responseText).Message;
            }
        });
    } else {
        alert("This browser doesn't support HTML5 file uploads!");
    }
}


// =========================================================================================================================================================================== //

// ======================================================================== UPLOAD DATA GRID ================================================================================= //

function getPATH() {
    return $("#urlPath").val();
}

function pathChange(this_) {
    if (validOnUpload(this_)) {
        OnUpload(this_);
    }
}

function OnUpload(this_) {
    if (window.FormData !== undefined) {
        var data = new FormData();
        var param = '?TempID=' + $("#pidPath").val() + '&pathName=' + $(this_).attr("id");
        var pathUpload = '#' + $(this_).attr("id");
        data.append("file", $(pathUpload)[0].files[0]);

        $.ajax({
            type: "POST",
            url: $("#urlPath").val() + "/QuestListPilGan/AjaxUploadQuestAnswer",
            contentType: false,
            processData: false,
            data: data,
            success: function (result) {
                $("input[name='IMG_PATH_FILENAME']").val(result);
                $("input[name='IMG_PATH_FILENAME']").change();
            },
            error: function (xhr, status, p3, p4) {
                var err = "Error " + " " + status + " " + p3 + " " + p4;
                if (xhr.responseText && xhr.responseText[0] == "{")
                    err = JSON.parse(xhr.responseText).Message;
            }
        });
    } else {
        alert("This browser doesn't support HTML5 file uploads!");
    }
}

function validOnUpload(this_) {
    var pathUpload = $(this_).attr("id");
    input = document.getElementById(pathUpload);

    var iBlstatus = false;
    if (!window.File || !window.FileReader || !window.FileList || !window.Blob) {
        alert('The File APIs are not fully supported in this browser !');
    }
    if (!input) {
        alert("Um, couldn't find the fileinput element !");
    }
    else if (!input.files) {
        alert("This browser doesn't seem to support the `files` property of file inputs !");
    }
    else if (!input.files[0]) {
        alert("Pilih file lampiran sebelum klik 'Proses' !");
    }
    else if (window.FormData == undefined) {
        alert("This browser doesn't support HTML5 file uploads !")
    }
    else {
        iBlstatus = true;
    }
    return iBlstatus;
}

// =========================================================================================================================================================================== //