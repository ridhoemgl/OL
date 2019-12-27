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

//beginning delete request selected
function checkAllData() {
    var grid = $("#grid_soalessay").data("kendoGrid");
    $("#grid_soalessay").find("input:checkbox").each(function () {
        if (this.checked) {
            $(".sel").prop("checked", true);
           //console.log("Aksi Cek");
        } else {
            $(".sel").prop("checked", false);
           //console.log("Aksi UnCek");
        }
    });
}

//fungsi utk check salah satu data
function ischeck() {
    var arr_obj = [];
    var dataItem = $("#grid_soalessay").data("kendoGrid").dataSource.data();

    for (var i = 0; i < dataItem.length; i++) {

        if ($("#IS_SELECTED" + dataItem[i].QUESTION_ID).is(':checked')) {
            var i_cls_data = {

                QUESTION_ID: dataItem[i].QUESTION_ID
            }
            $("#IS_SELECTED" + dataItem[i].QUESTION_ID).prop('checked', 1);
            arr_obj.push(i_cls_data);
        }
    }
   //console.log(arr_obj);
}

function deleteSoalEssaySelected() {
    var arr_obj = [];
    var dataItem = $("#grid_soalessay").data("kendoGrid").dataSource.data();

    //fungsi proses
    for (var i = 0; i < dataItem.length; i++) {
        if ($("#IS_SELECTED" + dataItem[i].QUESTION_ID).is(':checked')) {
            var i_cls_data =
                {
                    QUESTION_ID: dataItem[i].QUESTION_ID
                }
            arr_obj.push(i_cls_data);
        }
    }

    //console.log(arr_obj);

    //fungsi proses 
    if (arr_obj.length > 0) {
        var r = confirm("Anda yakin akan menghapus data ini?");
        if (r == true) {
            $.ajax({
                url: $("#urlPath").val() + "/SoalEssay/DestroySelectedSoalEssay",
                contentType: "application/json",
                dataType: "json",
                type: "POST",
                data: JSON.stringify(arr_obj),
                success: function (response) {
                    loadMessage(response.type, response.message);
                    $("#grid_soalessay").data("kendoGrid").dataSource.read();
                    $("#CHECK_ALL").prop('checked', 0);
                }
            });
        } else {
            //console.log("Batal");
        }
    }
    else {
        loadMessage("WARNING", "Pilih data yang akan dihapus!");
        $("#CHECK_ALL").prop('checked', 0);
        $("#IS_SELECTED").prop('checked', 0);
    }
}

function add_new_mapp() {
    $('#div-card').show();
    $('#grid_soalessay').hide();
    $('#popup_dlg_dua').hide();
}

function onSuccessUpload(e) {
    //wndUpld.center().open();
    $('#md_temp').modal('show');
    loadGridUpload();
    //console.log("oN SUCCESS : "+iSessUpload)
}

function onErrorUpload(e) {
    $.alert({
        title: 'Upload Failed',
        content: 'Periksa Format Excel dan konektifitas jaringan Anda',
        theme: 'material',
        type: 'red'
    });
    $("#grid_soalessay").data("kendoGrid").dataSource.read();
}

function loadGridUpload() {

    $("#gridUpload").kendoGrid({
        dataSource: {
            type: "json", //tipe formating
            transport: {
                read: { //tampil
                    url: $("#urlPath").val() + "/SoalEssay/AJaxReadUpload",
                    contentType: "application/json",
                    data: {
                        sSession: iSessUpload
                    },
                    type: "POST",
                    cache: false
                },
                parameterMap: function (data, operation) //parsing biar ke grid
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
                        }, SESSION: {
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
                        DESTINATION_POSITION: {
                            type: "string",
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
                            sortable: false
                        },
                        ANSWER_1_SCORE: {
                            type: "number",
                            filterable: true,
                            sortable: true
                        },
                        ANSWER_2: {
                            type: "string",
                            filterable: true,
                            sortable: false
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
                width: "230px"
            },
            {
                field: "ANSWER_1",
                title: "Jawaban",
                width: "280px"
            }
        ],
        dataBinding: function () {
            window.rowNo = (this.dataSource.page() - 1) * this.dataSource.pageSize();
        }
    });
}

function saveUpload() {
    $.ajax({
        url: $("#urlPath").val() + "/SoalEssay/AJaxSaveUpload",
        dataType: 'json',
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify({ SESS_ID: iSessUpload }),
        success: function (data) {
            //console.log("Pas Mau save ke table utama : " + iSessUpload)
            Swal(
              'Good job!',
              'Data telah dimasukkan di database',
              'success'
            )
            document.getElementById("fl_SoalEssay").value = null;
            $(".k-upload-files.k-reset").find("li").remove();
            $('#md_temp').modal('hide');
            $("#grid_soalessay").data("kendoGrid").dataSource.read();
        }
    });
}

function cancelUpload() {
    document.getElementById("fl_SoalEssay").value = null;
    $(".k-upload-files.k-reset").find("li").remove();
    $.ajax({
        url: $("#urlPath").val() + "/SoalEssay/AJaxCancelUpload",
        dataType: 'json',
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify({ SESS_ID: iSessUpload }),
        success: function (data) {
            //console.log("Pas Cancel: " + iSessUpload)
            $('#md_temp').modal('hide');

            $("#grid_soalessay").data("kendoGrid").dataSource.read();
        }
    });
}

function uploadFile(e) {
    var files = e.files;

    var MODULE_ID = $("#txt_modulxl").val();
    var MODULE_SUB_ID = $("#txt_submodulxl").val();
    var EGI_GENERAL = $("#txt_egixl").val();
    var SOALTIPE = $("#soaltipexl").val();
    var POSISI = $("#posisixl").val();
    var JENIS_SOAL = $("#jenissoalxl").data("kendoDropDownList").value();

    //session_tempt = randomString(10, 'PAMAPERSADANUSANTARA');

    //console.log("Pas Mau upload :"+iSessUpload);

    $.each(files, function () {
        $("#fl_SoalEssay").data("kendoUpload").options.async.saveUrl = $("#urlPath").val() + '/SoalEssay/Upload?sMODULE_ID=' + MODULE_ID + '&sMODULE_SUB_ID=' + MODULE_SUB_ID + '&sEGI_GENERAL=' + EGI_GENERAL + '&sSOALTIPE=' + SOALTIPE + '&sPOSISI=' + POSISI + '&sSession=' + iSessUpload + '&sQType=' + JENIS_SOAL;
    });
}

//Modul Notification Message
function loadMessage(type, message) {
    var popup_msg;

    //PopUp Dialog
    popup_msg = $("#popup_msg").kendoWindow({
        actions: [],
        modal: true,
        title: type,
        width: 350,
        height: 120,
        visible: false,
        draggable: true,
        close: function () { },
        open: function (e) { }
    }).data("kendoWindow").center();

    popup_msg.center().open();

    $("#btn_accept").hide();
    if (type == "SUCCESS") {
        document.getElementById("alert").setAttribute("class", "alert alert-success");
        document.getElementById("alert-glyphicon").setAttribute("class", "glyphicon glyphicon-ok-sign");
    }
    else if (type == "WARNING") {
        document.getElementById("alert").setAttribute("class", "alert alert-warning");
        document.getElementById("alert-glyphicon").setAttribute("class", "glyphicon glyphicon-exclamation-sign");
    }
    else if (type == "DANGER") {
        document.getElementById("alert").setAttribute("class", "alert alert-danger");
        document.getElementById("alert-glyphicon").setAttribute("class", "glyphicon glyphicon-remove-sign");
    }
    else if (type == "INFO") {
        document.getElementById("alert").setAttribute("class", "alert alert-info");
        document.getElementById("alert-glyphicon").setAttribute("class", "glyphicon glyphicon-info-sign");
    }
    else {
        document.getElementById("alert").setAttribute("class", "alert alert-danger");
        document.getElementById("alert-glyphicon").setAttribute("class", "glyphicon glyphicon-remove-sign");
    }
    document.getElementById("message").innerHTML = message;

    $("#btn_close").click(function () {
        popup_msg.center().close();
    });
};

function addSoalEssay() {
    //Input
    $("#txt_mode").val("ADD");
    openPopupDlg2();
}
var aidi;

function loadGridSummary(MODULE_ID , EGI_GENERAL , EXAM_TYPE, APP_ELLIPSE_CODE , Question_Type) {
    if ($("#grid_total").data().kendoGrid != null) {
        $("#grid_total").data().kendoGrid.destroy();
        $("#grid_total").empty();
    }

    //OBJEK GRID
    $("#grid_total").kendoGrid({
        dataSource: {
            type: "json",
            error: function (e) {
                if (e.errors == true) {
                    var grid_error = $("#grid_total").data("kendoGrid");
                    grid_error.one("dataBinding", function (e) {
                        e.preventDefault();
                    })
                }
            },
            //FUNGSI LOAD JSON SCRIPT
            transport: {
                //UNTUK MEMANGGIL DATA
                read: {
                    url: $("#urlPath").val() + "/SoalEssay/ReadCountSummary",
                    dataType: "json",
                    contentType: "application/json",
                    type: "POST",
                    data: {
                        MODULE_ID : MODULE_ID,
                        EGI_GENERAL : EGI_GENERAL,
                        EXAM_TYPE : EXAM_TYPE,
                        APP_ELLIPSE_CODE : APP_ELLIPSE_CODE,
                        QUESTION_TYPE : Question_Type
                    },
                    cache: false
                },
                //UNTUK MENGIRIMKAN DATA JSON
                parameterMap: function (data, operation) {
                    return kendo.stringify(data);
                }
            },
            pageSize: 15, //JUMLAH BARIS PER-HALAMAN
            serverPaging: true,
            serverFiltering: true,
            serverSorting: true,
            schema: {
                errors: function (response) {
                    return false;
                },
                data: "Data",
                total: "Total",
                model: {
                    id: "PID",
                    fields: {
                        PID: { type: "string", filterable: false, sortable: false },
                        MODULE_ID: { type: "string", filterable: false, sortable: false },
                        MODULE_SUB_NAME: { type: "string", filterable: false, sortable: false },
                        JENIS_UJIAN_DESC: { type: "string", filterable: true, sortable: true },
                        EGI_CODE: { type: "string", filterable: true, sortable: true },
                        J_ACTUAL: { type: "number", filterable: true, sortable: true }
                    }
                }
            }
        },
        editable: false,
        resizable: false,
        sortable: true,
        filterable: true,
        pageable: {
            refresh: true,
            buttonCount: 10,
            input: true,
            pageSizes: [10,25,50, 100],
            info: true
        },
        toolbar: [
           {
                  name: "excel",
                  imageClass: '<button type="button" button id="btn_export" class="btn btn-info"><span class="glyphicon glyphicon-export"></span>Export ke Excel</button>'
            }
        ],
        excelExport: function (e) {
            var sheet = e.workbook.sheets[0];

            for (var rowIndex = 1; rowIndex < sheet.rows.length; rowIndex++) {
                var row = sheet.rows[rowIndex];
                for (var cellIndex = 0; cellIndex < row.cells.length; cellIndex++) {
                    if (row.cells[cellIndex].value == "" || row.cells[cellIndex].value == null) {
                        row.cells[cellIndex].value = "";
                    }
                }
            }
        },
        excel: {

            fileName: "Ringkasan Data Soal Essay.xlsx",
            allPages: true,
            filterable: true
        },

        columns: [
            {
                title: "No", width: "30px", template: "#=++rowNo #", attributes: { style: "text-align: center" }, filterable: false,
                sortable: false,
                editable: false
            },

            { field: "MODULE_SUB_NAME", title: "Kompetensi", width: "160px", attributes: { style: "text-align: left" }, headerAttributes: { style: "text-align: left" } },
            { field: "EGI_CODE", title: "EGI", width: "80px", attributes: { style: "text-align: left" }, headerAttributes: { style: "text-align: center" } },
            { field: "J_ACTUAL", title: "Σ", width: "50px", attributes: { style: "text-align: center" }, headerAttributes: { style: "text-align: center" } }
        ],
        dataBinding: function () {
            window.rowNo = (this.dataSource.page() - 1) * this.dataSource.pageSize();
            //Render Table To Chart Mode
            var source  = this.dataSource._pristineData;
            if(source != null){
                for(var i = 0; i < source.length; i++){
                    source[i].name = source[i].MODULE_SUB_NAME;
                    source[i].y = source[i].J_ACTUAL;
                    delete source[i].EGI_CODE;
                    delete source[i].JENIS_UJIAN_CODE;
                    delete source[i].MODULE_ID;
                    delete source[i].PID;
                    delete source[i].POSITION_CODE;
                    delete source[i].TYPE_CODE;
                    delete source[i].J_ACTUAL;
                    delete source[i].MODULE_SUB_NAME;
                    delete source[i].JENIS_UJIAN_DESC;
                }
                RenderChartResume(source);
            }else{
                $('#ChartTotal').empty();
            }
        }
    });
}
//Modul GRID Soal Essay
function loadGridSoalEssay(MODULE_ID , EGI_GENERAL , EXAM_TYPE, APP_ELLIPSE_CODE , Question_Type) {
    //REFRESH GRID SEBELUM DI LOAD
    if ($("#grid_soalessay").data().kendoGrid != null) {
        $("#grid_soalessay").data().kendoGrid.destroy();
        $("#grid_soalessay").empty();
    }

    //OBJEK GRID
    $("#grid_soalessay").kendoGrid({
        dataSource: {
            type: "json",
            error: function (e) {
                if (e.errors == true) {
                    var grid_error = $("#grid_soalessay").data("kendoGrid");
                    grid_error.one("dataBinding", function (e) {
                        e.preventDefault();
                    })
                }
            },
            requestEnd: function (e) {
                if (e.type == "destroy" && e.response.status == false) {
                    this.cancelChanges();
                    var grid = $("#grid_soalessay").data("kendoGrid");
                }
                if ((e.type == "create" || e.type == "update") && e.response.status == true) {
                    $("#grid_soalessay").data("kendoGrid").dataSource.read();
                    var grid = $("#grid_soalessay").data("kendoGrid");
                }
            },

            //FUNGSI LOAD JSON SCRIPT
            transport: {
                //UNTUK MEMANGGIL DATA
                read: {
                    url: $("#urlPath").val() + "/SoalEssay/ReadSoalEssay",
                    dataType: "json",
                    contentType: "application/json",
                    type: "POST",
                    data: {
                        MODULE_ID : MODULE_ID,
                        EGI_GENERAL : EGI_GENERAL,
                        EXAM_TYPE : EXAM_TYPE,
                        APP_ELLIPSE_CODE : APP_ELLIPSE_CODE,
                        QUESTION_TYPE : Question_Type
                    },
                    cache: false
                },

                //UNTUK DELETE DATA
                destroy: {
                    url: $("#urlPath").val() + "/SoalEssay/DestroySoalEssay",
                    contentType: "application/json",
                    type: "POST",
                    cache: false,
                    complete: function (response) {
                        var i_obj_grid = $("#grid_soalessay").data("kendoGrid");
                        i_obj_grid.dataSource.read();
                        loadMessage(response.responseJSON.type, response.responseJSON.message);
                    }
                },
                //UNTUK MENGIRIMKAN DATA JSON
                parameterMap: function (data, operation) {
                    return kendo.stringify(data);
                }
            },

            pageSize: 15, //JUMLAH BARIS PER-HALAMAN
            serverPaging: true,
            serverFiltering: true,
            serverSorting: true,
            schema: {
                errors: function (response) {
                    if (response.status == false) {
                        alert("Error1: " + response.remarks);
                        return true;
                    } else if (response.status == true) {
                        alert(response.remarks);
                    }
                    return false;
                },
                data: "Data",
                total: "Total",
                model: {
                    id: "QUESTION_ID",
                    fields: {
                        MODULE_ID: { type: "string", filterable: true, sortable: true },
                        MODULE_SUB_ID: { type: "string", filterable: true, sortable: true },
                        CERT_FOR: { type: "string", filterable: true, sortable: true },
                        QUESTION_TYPE: { type: "number", filterable: true, sortable: true },
                        DESTINATION_POSITION: { type: "string", filterable: true, sortable: true },
                        POSITION_CODE: { type: "string", filterable: true, sortable: true },
                        QUESTION_MAX_TIME: { type: "number", filterable: true, sortable: true },
                        QUESTION_MAX_SCORE: { type: "number", filterable: true, sortable: true },
                        QUESTION_MAX_ANSWER: { type: "number", filterable: true, sortable: true },
                        QUESTION_CONTENT: { type: "string", filterable: true, sortable: true },
                        ANSWER_1: { type: "string", filterable: true, sortable: true },
                        ANSWER_1_SCORE: { type: "number", filterable: true, sortable: true },
                        ANSWER_2: { type: "string", filterable: true, sortable: true },
                        ANSWER_2_SCORE: { type: "number", filterable: true, sortable: true },
                        ANSWER_3: { type: "string", filterable: true, sortable: true },
                        ANSWER_3_SCORE: { type: "number", filterable: true, sortable: true },
                        ANSWER_4: { type: "string", filterable: true, sortable: true },
                        ANSWER_4_SCORE: { type: "number", filterable: true, sortable: true },
                        ANSWER_5: { type: "string", filterable: true, sortable: true },
                        ANSWER_5_SCORE: { type: "number", filterable: true, sortable: true },
                        ANSWER_6: { type: "string", filterable: true, sortable: true },
                        ANSWER_6_SCORE: { type: "number", filterable: true, sortable: true },
                        ANSWER_7: { type: "string", filterable: true, sortable: true },
                        ANSWER_7_SCORE: { type: "number", filterable: true, sortable: true },
                        ANSWER_8: { type: "string", filterable: true, sortable: true },
                        ANSWER_8_SCORE: { type: "number", filterable: true, sortable: true },
                        ANSWER_9: { type: "string", filterable: true, sortable: true },
                        ANSWER_9_SCORE: { type: "number", filterable: true, sortable: true },
                        ANSWER_10: { type: "string", filterable: true, sortable: true },
                        ANSWER_10_SCORE: { type: "number", filterable: true, sortable: true },
                        IS_ACTIVE: { type: "boolean", filterable: true, sortable: true },
                        IMAGE_PATH: { type: "string", filterable: true, sortable: true },
                        MODIFICATION_DATE: { type: "date", filterable: true, sortable: true, editable: false },
                        EGI_GENERAL: { type: "string", filterable: true, sortable: true },
                    }
                }
            }
        },
        editable: true,
        editable: {
            confirmation: "Anda yakin akan menghapus data ini?",
            mode: "inline"
        },
        resizable: true,
        sortable: true,
        filterable: true,
        pageable: {
            refresh: true,
            buttonCount: 10,
            input: true,
            pageSizes: [10, 100, 1000], //OPSI MENAMPILKAN BARIS PER-HALAMAN
            info: true
        },
        toolbar: [
            { name: "create", template: "<button class='k-button' onclick='addSoalEssay();'><span class='glyphicon glyphicon-plus'></span>Tambah Data</button>" },
              //{ name: "create", text: "ADD NEW" },
              { name: "btn_deleteSelected", template: "<button class='k-button' onclick='deleteSoalEssaySelected()'><span class='k-icon k-delete'></span>Hapus yang Dipilih</button>" },
              {
                  name: "excel"
                  //imageClass: '<button type="button" button id="btn_export" class="btn btn-info"><span class="glyphicon glyphicon-export"></span>Export ke Excel</button>'
              },
              {
                  name: "btn_uploadExcel", template: "<button class='k-button' onclick='add_new_mapp()'><span class='k-icon k-upload'></span>Upload dengan Excel</button>"
              }
        ],
        excelExport: function (e) {
            var sheet = e.workbook.sheets[0];

            for (var rowIndex = 1; rowIndex < sheet.rows.length; rowIndex++) {
                var row = sheet.rows[rowIndex];
                // row.cells[17].value = kendo.toString(kendo.parseDate(row.cells[17].value, 'dd/MM/yyyy'), 'dd/MM/yyyy');
                //row.cells[4].value = kendo.toString(kendo.parseInt(row.cells[4].value, '0:n0'), '0:n0');
                //row.cells[18].value = kendo.toString(kendo.parseDate(row.cells[18].value, 'dd-MM-yyyy hh:mm:ss'), 'dd-MM-yyyy hh:mm:ss');
                for (var cellIndex = 0; cellIndex < row.cells.length; cellIndex++) {
                    if (row.cells[cellIndex].value == "" || row.cells[cellIndex].value == null) {
                        row.cells[cellIndex].value = "";
                    }
                }
            }
        },
        excel: {

            fileName: "Master Soal Essay.xlsx",
            allPages: true,
            filterable: true
        },

        columns: [
            { title: "Pilih", editable: false, width: "40px", headerTemplate: "<center><input type='checkbox' class='sel' onchange='checkAllData()' /></center>", template: "<input type='checkbox' name='' id='IS_SELECTED#=QUESTION_ID#' class='sel' onchange='ischeck()' />", attributes: { style: "text-align: center" } },

            {
                title: "No", width: "30px", template: "#=++rowNo #", attributes: { style: "text-align: center" }, filterable: false,
                sortable: false,
                editable: false
            },

            { field: "QUESTION_CONTENT", title: "PERTANYAAN", width: "200px", attributes: { style: "text-align: left" }, headerAttributes: { style: "text-align: center" } },
            { field: "ANSWER_1", title: "JAWABAN", width: "300px", attributes: { style: "text-align: left" }, headerAttributes: { style: "text-align: center" } },
            { field: "IS_ACTIVE", title: "AKTIF", template: "#= IS_ACTIVE == 1 ? '<center>Yes</center>' : '<center>No<?center>'#", width: "75px", attributes: { style: "text-align: center" }, headerAttributes: { style: "text-align: center" } },
            {
                title: "Action", command: [{
                    name: "editws", text: " Ubah", imageClass: "k-edit",width: "150px", iconClass: "glyphicon glyphicon-edit spasi-kiri", click: function (e) {
                        e.preventDefault();

                        var tr = $(e.target).closest("tr");

                        var data = this.dataItem(tr);
                        aidi = data.QUESTION_ID;
                        var multi = data.CERT_FOR;
                        var select = data.DESTINATION_POSITION;
                        var val_multi = multi.split(',');
                        var val_multi2 = select.split(',');
                        var ddl = $("#soaltipe").data("kendoMultiSelect");
                        var ddl2 = $("#posisi").data("kendoMultiSelect");
                        ddl.value(val_multi);
                        ddl2.value(val_multi2);

                        openPopupDlg2();
                        ListModul(data.MODULE_ID);
                        ListEgi(data.MODULE_PID);
                        $("#txt_mode").val("EDIT");
                        $("#txt_modul").data("kendoDropDownList").value(data.MODULE_ID);
                        $("#txt_submodul").data("kendoDropDownList").value(data.MODULE_SUB_ID);
                        $("#txt_egi").data("kendoDropDownList").value(data.EGI_GENERAL);

                        $("#timepicker").val(data.QUESTION_MAX_TIME);
                        //$("#txt_question").val(data.QUESTION_CONTENT);
                        $("#txt_question").data("kendoEditor").value(data.QUESTION_CONTENT);
                        //$("#txt_answer").val(data.ANSWER_1);
                        $("#txt_answer").data("kendoEditor").value(data.ANSWER_1);
                        $("#fileUpload").val(data.IMAGE_PATH);
                    },
                }

                    , { name: "destroy", text: "Hapus" }
                ], width: "60px", attributes: { style: "text-align: center" }, headerAttributes: { style: "text-align: center" }
            },
        ],
        dataBinding: function () {
            window.rowNo = (this.dataSource.page() - 1) * this.dataSource.pageSize();
        }
    });
}

var popup_dlg2;

//PopUp Dialog
popup_dlg_dua = $("#popup_dlg_dua").kendoWindow({
    modal: true,
    title: "Master Soal Essay",
    width: 800,
    height: 700,
    visible: false,
    draggable: true,
    //scrollable: true,
    close: function () {
        $("#txt_modul").data("kendoDropDownList").value("");
        $("#txt_submodul").data("kendoDropDownList").value("");
        $("#txt_egi").data("kendoDropDownList").value("");
        //$("#soaltipe").val("");
        $("#soaltipe").data("kendoMultiSelect").value("");
        // $("#posisi").val("");
        $("#posisi").data("kendoMultiSelect").value("");
        $("#timepicker").val("");
        $("#txt_question").data("kendoEditor").value("");
        $("#txt_answer").data("kendoEditor").value("");
        $("#fileUpload").val("");
    },
    open: function (e) {
        loadmodule();
        ListModul();
        ListEgi();
    }
}).data("kendoWindow").center();

function save(result) {

    if ($("#btn_save").click) {
       //console.log("Iki result : " + aidi);
        var image = "no_image.jpg";
        if ($("#fileUpload").val() != "") {
            image = $("#fileUpload").val()
        }
        var i_TBL_M_ITID_PR = {
            QUESTION_ID: aidi,
            MODULE_ID: $("#txt_modul").val(),
            MODULE_SUB_ID: $("#txt_submodul").val().toString(),
            EGI_GENERAL: $("#txt_egi").val().toString(),
            CERT_FOR: $("#soaltipe").val().toString(),
            DESTINATION_POSITION: $("#posisi").val().toString(),
            QUESTION_CONTENT: $("#txt_question").data("kendoEditor").value(),
            ANSWER_1: $("#txt_answer").data("kendoEditor").value(),
            QUESTION_MAX_TIME: $("#timepicker").val().toString(),
            IMAGE_PATH: image
        }

        if (($("#txt_mode").val()) == "ADD") {
            $.ajax({
                type: "POST",
                dataType: "json",
                contentType: "application/json",

                url: $("#urlPath").val() + "/SoalEssay/AddSoalEssay",

                data: JSON.stringify(i_TBL_M_ITID_PR),
                success: function (response) {
                    //console.log(response);
                    if (response.type === "SUCCESS") {
                        var files = $("#fileUpload").get(0).files;
                        var data = new FormData();
                        if (files.length > 0) {
                            data.append("UploadedImage", files[0]);

                            var ajaxRequest = $.ajax({
                                type: "POST",
                                url: $("#urlPath").val() + "/SoalEssay/upload_question_image",
                                contentType: false,
                                processData: false,
                                data: data,
                                success: function (result) {

                                    if (result.message == 1) {
                                        $.alert({
                                            title: 'Update Success',
                                            content: response.message,
                                            icon: 'fa fa-check-square',
                                            theme: 'material',
                                            type: 'green'
                                        });
                                    } else {
                                        $.alert({
                                            title: 'Update Success',
                                            content: 'Data List Pertanyaan Berubah tapi gambar gagal diunggah',
                                            icon: 'fa fa-check-square',
                                            theme: 'material',
                                            type: 'orange'
                                        });
                                    }
                                }
                            });
                        } else {
                            $.alert({
                                title: 'Penambahan Success',
                                content: 'Data pertanyaan essay telah ditambahakan',
                                icon: 'fa fa-check-square',
                                theme: 'material',
                                type: 'green'
                            });
                        }
                    }

                    $("#grid_soalessay").data("kendoGrid").dataSource.read();

                    popup_dlg_dua.center().close();

                }
            });
        } else if (($("#txt_mode").val()) == "EDIT") {
            //console.log(($("#txt_mode").val()));
           //console.log(i_TBL_M_ITID_PR);
            $.ajax({
                type: "POST",
                dataType: "json",
                contentType: "application/json",

                url: $("#urlPath").val() + "/SoalEssay/EditSoalEssay",
                data: JSON.stringify(i_TBL_M_ITID_PR),
                success: function (response) {
                   //console.log(response);
                    //alert("updates");
                    //FILE_PATH: $("#FILE_NAME").val(),
                    $("#grid_soalessay").data("kendoGrid").dataSource.read();
                    loadMessage(response.type, response.message);
                    popup_dlg_dua.center().close();
                }
            });
        }
        else { }
    }
}

$("#btn_cancel").click(function () {
    popup_dlg_dua.center().close();
    //popup_grid.center().close();
});

function openPopupDlg2() {
    popup_dlg_dua.center().open();
   //console.log("test");

    //popup_grid.center().open();
};

var modul;

$(document).ready(function () {

    $("#popup_msg").hide();
    JenisSoalxl();
    loadmodule();
    loadmodulexl();
    tipesoal();
    posisi();
    tipesoalxl();
    ListEgixl();
    posisixl();
    

    document.getElementById("txtModule").readOnly = true;
    document.getElementById("txtEgi").readOnly = true;

    $("#txtPosisi").kendoDropDownList({
        dataTextField: "POSITION_DESC",
        dataValueField: "POSITION_CODE",
        optionLabel: "Pilih",
        dataSource: sourcePosition,
        change: function (e) {
            var dataItem = this.dataItem(e.item);
            i_position_code = dataItem.POSITION_CODE;

            document.getElementById("txtModule").readOnly = false;
            getmodulle(i_position_code);
        }
    });

    //Button Search On Clik => Cari data soal essaynya
    $('#btn_searchEssay').click(function() {
        var Module_id = $("#txtModule").data("kendoDropDownList").value();
        var Egi_general = $("#txtEgi").data("kendoDropDownList").value();
        var Position_Apps = $("#txtPosisi").data("kendoDropDownList").value();
        var Exam_Type = $("#txtJenisUjian").data("kendoDropDownList").value();
        var Question_Type = $("#txtjenis_soal").data("kendoDropDownList").value();

        if(Module_id && Egi_general && Position_Apps && Exam_Type){
            loadGridSoalEssay(Module_id , Egi_general , Exam_Type, Position_Apps , Question_Type);
            loadGridSummary(Module_id , Egi_general , Exam_Type, Position_Apps , Question_Type);
        }

        $('#div_tab_container').removeAttr('hidden');
    });

    $("#txtJenisUjian").kendoDropDownList({
        dataTextField: "JENIS_UJIAN_DESC",
        dataValueField: "JENIS_UJIAN_CODE",
        optionLabel: "Pilih",
        dataSource: sourceJenisUjian,
        change: function (e) {
            var dataItem = this.dataItem(e.item);
            i_ujian_code = dataItem.JENIS_UJIAN_CODE;
        }
    });

    $("#txt_question , #txt_answer").kendoEditor({
        resizable: {
            content: true,
            toolbar: true
        }
    });

    $(".nav-tabs a").click(function(){
        $(this).tab('show');
      });
      $('.nav-tabs a').on('shown.bs.tab', function(event){
        var x = $(event.target).text();         // active tab
        var y = $(event.relatedTarget).text();  // previous tab
        $(".act span").text(x);
        $(".prev span").text(y);
      });

    $("#fl_SoalEssay").kendoUpload({
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
    //console.clear();
});

function getmodulle(i_position_code) {
    $("#txtModule").kendoDropDownList({
        dataTextField: "MODULE_NAME",
        dataValueField: "MODULE_PID",
        filter: "contains",
        dataSource: {
            type: "json",
            transport: {
                read: {
                    url: $("#urlPath").val() + "/KelompokSoal/dropdownModule?position_code=" + i_position_code,
                    contentType: "application/json",
                    type: "POST",
                    cache: false,
                    complete: function (e) {
                    }
                }
            },
            schema: {
                data: "Data",
                total: "Total"
            }
        },
        change: function (e) {
            var dataItem = this.dataItem(e.item);
            i_module = dataItem.MODULE_PID;

            document.getElementById("txtEgi").readOnly = false;
            getegi(i_module);
        }
    });

}

function getegi(i_module) {

    $("#txtEgi").kendoDropDownList({
        dataTextField: "EGI_GENERAL",
        dataValueField: "EGI_GENERAL",
        filter: "contains",
        optionLabel: "Masukkan EGI yang akan dicari",
        dataSource: {
            type: "json",
            transport: {
                read: {
                    url: $("#urlPath").val() + "/KelompokSoal/dropdownEgi?modul_id=" + i_module,
                    contentType: "application/json",
                    type: "POST",
                    cache: false,
                    complete: function (e) {
                    }
                }
            },
            schema: {
                data: "Data",
                total: "Total"
            }
        },
        change: function (e) {
            var dataItem = this.dataItem(e.item);
            i_Egi = dataItem.EGI_GENERAL;
        }
    });
}

function loadmodule() {
    var modulutama = $("#txt_modul").width(180).kendoDropDownList({
        optionLabel: "Pilih Modul Soal...",
        dataTextField: "MODULE_NAME",
        dataValueField: "MODULE_ID",
        filter: "contains",
        dataSource: {
            type: "json",
            transport: {
                read: {
                    url: $("#urlPath").val() + "/SoalEssay/AjaxReadModul",
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
        select: function (e) {
            var dataItem = this.dataItem(e.item.index());
            //console.log(dataItem);
            modul = dataItem.MODULE_ID;
           //console.log(modul);
            ListModul(modul);
            ListEgi(modul);
        }
    });
}

function ListModul(modul) {
    var submodul = { 'smodul': modul }
    $("#txt_submodul").width(180).kendoDropDownList({
        optionLabel: "Pilih",
        dataTextField: "MODULE_SUB_NAME",
        dataValueField: "MODULE_SUB_ID",
        dataSource: {
            type: "json",
            transport: {
                read: {
                    url: $("#urlPath").val() + "/SoalEssay/AjaxReadSubModul?smodul=" + modul,
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
    //console.log(modul);
    var egi = { 'egi': modul }
    $("#txt_egi").width(180).kendoDropDownList({
        optionLabel: "Pilih",
        dataTextField: "EGI_GENERAL",
        dataValueField: "EGI_GENERAL",
        dataSource: {
            type: "json",
            transport: {
                read: {
                    url: $("#urlPath").val() + "/SoalEssay/AjaxReadEgi?egi=" + modul,
                    contentType: "application/json",
                    type: "POST",
                    cache: false,
                    success: function (e) {
                       //console.log(e)
                    }
                }
            },
            schema: {
                data: "Data",
                total: "Total"
            }
        }
    });
}

function loadmodulexl() {
    var modulutama = $("#txt_modulxl").width(180).kendoDropDownList({
        optionLabel: "Pilih",
        dataTextField: "MODULE_NAME",
        dataValueField: "MODULE_ID",
        dataSource: {
            type: "json",
            transport: {
                read: {
                    url: $("#urlPath").val() + "/SoalEssay/AjaxReadModul",
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
        select: function (e) {
            var dataItem = this.dataItem(e.item.index());
            //console.log(dataItem);
            modul = dataItem.MODULE_ID;
            ListModulxl(modul);
            ListEgixl(modul);
        }
    });
}

function ListModulxl(modul) {
    var submodul = { 'smodul': modul }

    $("#txt_submodulxl").width(180).kendoDropDownList({
        optionLabel: "Pilih",
        dataTextField: "MODULE_SUB_NAME",
        dataValueField: "MODULE_SUB_ID",
        dataSource: {
            type: "json",
            transport: {
                read: {
                    url: $("#urlPath").val() + "/SoalEssay/AjaxReadSubModul?smodul=" + modul,
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

function JenisSoalxl() {

    $("#jenissoalxl , #txtjenis_soal").width(180).kendoDropDownList({
        optionLabel: "Pilih Jenis Soal",
        dataTextField: "TYPE_DESC",
        dataValueField: "TYPE_CODE",
        dataSource: {
            type: "json",
            transport: {
                read: {
                    url: $("#urlPath").val() + "/SoalEssay/AjaxReadJenisSoal",
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

function ListEgixl(modul) {
    //console.log(modul);
    var egi = { 'egi': modul }
    $("#txt_egixl").width(180).kendoDropDownList({
        optionLabel: "Pilih",
        dataTextField: "EGI_GENERAL",
        dataValueField: "EGI_GENERAL",
        dataSource: {
            type: "json",
            transport: {
                read: {
                    url: $("#urlPath").val() + "/SoalEssay/AjaxReadEgi?egi=" + modul,
                    contentType: "application/json",
                    type: "POST",
                    cache: false,
                    success: function (e) {
                       //console.log(e)
                    }
                }
            },
            schema: {
                data: "Data",
                total: "Total"
            }
        }
    });
}

$("#back_to").click(function () {
    $('#div-card').hide();
    $('#grid_soalessay').show();
    $('#popup_dlg_dua').show();
    $('#grid_soalessay').data('kendoGrid').dataSource.read();
});

function randomString(len, charSet) {
    charSet = charSet || 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var randomString = '';
    for (var i = 0; i < len; i++) {
        var randomPoz = Math.floor(Math.random() * charSet.length);
        randomString += charSet.substring(randomPoz, randomPoz + 1);
    }
    return randomString;
}

var urlPathFile = $("#urlPath").val() + "/FileUpload/Template/";

function clickDownload() {
    window.location.href = urlPathFile + "Template Essay.xlsx";
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
                    url: $("#urlPath").val() + "/SoalEssay/AjaxReadTipeSoal",
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
function RenderChartResume(DataSources){
    var source_json = JSON.parse(JSON.stringify(DataSources));

    var chart = new CanvasJS.Chart("ChartTotal", {
        exportEnabled: true,
        animationEnabled: true,
        theme: "light2",
        height:260,
        legend:{
            cursor: "pointer",
            itemclick: explodePie
        },
        data: [{
            type: "doughnut",
            showInLegend: true,
            toolTipContent: "{name}: <strong>{y} Soal</strong>",
            indexLabel: "{name} - {y} ",
            dataPoints: source_json
        }]
    });
    chart.render();
}

function explodePie (e) {
	if(typeof (e.dataSeries.dataPoints[e.dataPointIndex].exploded) === "undefined" || !e.dataSeries.dataPoints[e.dataPointIndex].exploded) {
		e.dataSeries.dataPoints[e.dataPointIndex].exploded = true;
	} else {
		e.dataSeries.dataPoints[e.dataPointIndex].exploded = false;
	}
	e.chart.render();
}

function posisi() {

    $("#posisi").kendoMultiSelect({
        optionLabel: "Pilih",
        dataTextField: "POSITION_DESC",
        dataValueField: "POSITION_CODE",
        dataSource: {
            type: "json",
            transport: {
                read: {
                    url: $("#urlPath").val() + "/SoalEssay/AjaxReadPosisi",
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

function tipesoalxl() {

    var tipesoalxl = $("#soaltipexl").kendoMultiSelect({
        optionLabel: "Pilih Jenis Ujian",
        dataTextField: "JENIS_UJIAN_DESC",
        dataValueField: "JENIS_UJIAN_CODE",
        dataSource: {
            type: "json",
            transport: {
                read: {
                    url: $("#urlPath").val() + "/SoalEssay/AjaxReadTipeSoal",
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

function posisixl() {

    var posisixl = $("#posisixl").kendoMultiSelect({
        optionLabel: "Pilih",
        dataTextField: "POSITION_DESC",
        dataValueField: "POSITION_CODE",
        dataSource: {
            type: "json",
            transport: {
                read: {
                    url: $("#urlPath").val() + "/SoalEssay/AjaxReadPosisi",
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

var sourceJenisUjian = new kendo.data.DataSource({
    transport: {
        read: {
            url: $("#urlPath").val() + "/KelompokSoal/dropdownJenisUjian",
            dataType: "json",
            type: "POST",
            ache: false
        }
    },
    schema: {
        data: "Data",
        total: "Total",
    }

});

var sourcePosition = new kendo.data.DataSource({
    transport: {
        read: {
            url: $("#urlPath").val() + "/KelompokSoal/dropdownPosition",
            dataType: "json",
            type: "POST",
            cache: false
        }
    },
    schema: {
        data: "Data",
        total: "Total",
    }
});