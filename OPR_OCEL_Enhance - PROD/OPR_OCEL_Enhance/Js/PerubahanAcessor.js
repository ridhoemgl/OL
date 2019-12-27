
$(document).ready(function () {
    loadGrid();
    $( "#btn_browse" ).click(function() {
        openEmployee();
    });

    $( "#btn_switct" ).click(function() {
        var arr_obj = [];
        var record_obj = [];
        var correction_obj = [];
        var dataItem = $("#grid_switc").data("kendoGrid").dataSource.data();

        //fungsi proses
        for (var i = 0; i < dataItem.length; i++) {
            if ($("#IS_SELECTED" + dataItem[i].NRP_KARYAWAN).is(':checked')) {
                arr_obj.push(dataItem[i].NRP_KARYAWAN);
                record_obj.push(dataItem[i].RECORD_ID);
                correction_obj.push(dataItem[i].CORRECTION_PID);
            }
        }

        if(arr_obj.length > 0){
            $.confirm({
                title: 'Konfirmasi Perubahan Asesor',
                content: 'Apakah peserta yang Anda pilih sudah benar , sistem akan mengubah data asesor untuk peserta tersebut',
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
                            ProcessingUpdateAcessor(arr_obj.join(','), record_obj.join(','), correction_obj.join(','));
                        }
                    },
                    cancel: function(){
                        // Do Nothing
                    }
                }
            });
        }else{
            $.alert({
                title: 'Data Kosong',
                content: 'Pilih dahulu data peserta pada tabel, lalu klik tombol berwarna hijau yang ada di bawah tabel',
                animation: 'rotateYR',
                closeAnimation: 'rotateYR',
                animateFromElement: false,
                type : 'red',
                buttons: {
                    okay: {
                        text: 'Oke',
                        btnClass: 'btn-red'
                    }
                }
            });
        }
        });
});

function ProcessingUpdateAcessor(list_participan , list_record_id , list_cor_pid){
    $.ajax({
        type: 'POST',
        url: $("#urlPath").val() + "/KoreksiJawabanEssay/UpdatingAcessor",
        data : {
            participants_nrp: list_participan,
            record_id_list: list_record_id,
            list_cor_pid : list_cor_pid,
            acessor_nrp : $('#lbl_selected_acessor').text()
        },
        success: function (responses) {
            $.alert({
                title: responses.MESSAGE_HEADER,
                content: responses.MESSAGE_BODY,
                type: responses.TYPE,
                animation: 'zoom',
                draggable: false,
            });

            if(responses.status == true){
                $("#grid_switc").data("kendoGrid").dataSource.read();
                $('#btn_switct').prop("disabled", true);
            }
        }
    });
}

function ClickOpenVendor() {
    wnd_employee.close();
    load_vendor();
    wnd_vendor.open().center();
}

var wnd_employee = $("#wnd_employee").kendoWindow({
    modal: true,
    title: "Daftar Sertifikator",
    visible: false,
    draggable: true,
    scrollable: true,
    width: "80%",
    close: function (e) {

    },
    action: [
        "Maximize",
        "Close"
    ],
    pinned: true
}).data("kendoWindow");

var wnd_vendor = $("#wnd_vendor").kendoWindow({
    modal: true,
    title: "List Vendor",
    visible: false,
    draggable: true,
    scrollable: true,
    width: "70%",
    close: function (e) {

    },
    action: [
        "Maximize",
        "Close"
    ],
    pinned: false
}).data("kendoWindow");

function load_employee() {
    var grid = $("#gridEmployee").kendoGrid({
        dataSource: {
            type: "json",
            transport: {
                read: {
                    url: $("#urlPath").val() + "/MasterCertificator/AjaxReadCertificatorList",
                    contentType: "application/json",
                    type: "POST",
                    cache: false
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
                total: "Total"
            }
        },
        height: "520px",
        filterable: {
            extra: false
        },
        sortable: true,
        pageable: true,
        editable: "popup",
        pageable: {
            refresh: true,
            buttonCount: 10,
            input: true,
            pageSizes: [10, 20, 50, 100, 1000, 100000],
            info: true,
            messages: {
            }
        },
        toolbar: [
            { template: '<button id="btn_openVendor" type="button" class="k-button" onclick= ClickOpenVendor() >Sertifikator Vendor</button>' },
        ],
        columns: [
            {
                command: [
                    { text: "Select", click: selects }
                ], title: "<center>Action</center>", width: "85px",
                attributes: { class: "text-center" },

            },
            {
                title: "No.",
                width: "40px",
                template: "#= ++RecNumerEq #",
                filterable: false,
                sortable: false,
                editable: false,

            },
            {
                field: "NRP", title: "NRP", width: "100px"
            }, {
                field: "NAME", title: "Nama", width: "150px"
            }, {
                field: "DSTRCT_CODE", title: "Distrik", width: "150px"
            }, {
                field: "DEPT_DESC", title: "Departemen", width: "150px"
            }, {
                field: "POS_TITLE", title: "Posisi", width: "150px"
            }, {
                field: "IS_ACTIVE", title: "Status", width: "150px",
                attributes: { style: "text-align: center" },
                template: "\#= IS_ACTIVE ? 'active' : 'inactive' \#"
            }
        ],
        dataBinding: function () {
            window.RecNumerEq = (this.dataSource.page() - 1) * this.dataSource.pageSize();
        }
    });

}

function openEmployee() {
    load_employee();
    wnd_employee.open().center();
}

function selects(e) {
    e.preventDefault();
    var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
    $('#txt_selected_nrp').val(dataItem.NAME);
    $('#lbl_selected_acessor').text(dataItem.NRP);
    $('#btn_switct').prop("disabled", false);
    wnd_employee.close();
}

function loadGrid() {

    $("#grid_switc").kendoGrid({
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
            width : 320,
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
                        CERTIFICATOR_NAME: { type: "string", filterable: true, sortable: true, editable: false },
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
                        EXAM_LOCATIONS: { type: "string", filterable: true, sortable: true, editable: false },
                    }
                }
            }
        },
        resizable: true,
        sortable: true,
        filterable: true,
        pageable: {
            refresh: true,
            buttonCount: 20,
            input: true,
            pageSizes: [10, 50, 100],
            info: true
        },
        columns: [
            { title: "Pilih",
            editable: false, width: "35px", headerTemplate: "<center><input type='checkbox' class='sel' onchange='checkAllData()'/></center>", template: "<input type='checkbox' name='' id='IS_SELECTED#=NRP_KARYAWAN#' class='sel'/>", attributes: { style: "text-align: center" } },
            {
                title: "No.",
                width: "25px",

                template: "#= ++RecNumerEq #",
                filterable: false,
                sortable: false,
                editable: false,
                attributes: { style: "text-align: center" }
            },
            { field: "NRP_ACESSOR", title: "NRP Asessor", width: "135px", attributes: { style: "text-align: center" } },
            { field: "CERTIFICATOR_NAME", 

            title: "Nama Asesor", 

            width: "210px", attributes: { style: "text-align: left" } },
            { field: "NRP_KARYAWAN", title: "NRP Peserta", 

            width: "140px", attributes: { style: "text-align: center" } },
            { field: "NAME", title: "Nama", 
  
            width: "150px", attributes: { style: "text-align: left" } },
            { field: "EXAM_LOCATIONS", title: "Lokasi Ujian", width: "130px", attributes: { style: "text-align: center" } },
            { field: "STATUS_CORRECTION",width: "150px", title: "Status Koreksi", template: "#= STATUS_CORRECTION == 1 ? '<center>CORRECTED</center>' : '<center>BELUM<?center>'#", attributes: { style: "text-align: center" } },
            { field: "EXAM_DESC", title: "Jenis Ujian", width: "120px", attributes: { style: "text-align: left" } },            
            { field: "TYPE_DESC", title: "Jenis Soal", width: "120px", attributes: { style: "text-align: left" } }
        ],

        dataBinding: function () {
            window.RecNumerEq = (this.dataSource.page() - 1) * this.dataSource.pageSize();
        }
    });
}

function checkAllData() {
    var grid = $("#grid_switc").data("kendoGrid");
    $("#grid_switc").find("input:checkbox").each(function () {
        if (this.checked) {
            $(".sel").prop("checked", true);
        } else {
            $(".sel").prop("checked", false);
        }
    });
}

function load_vendor() {
    var grid = $("#gridVendor").kendoGrid({
        dataSource: {
            type: "json",
            transport: {
                read: {
                    url: $("#urlPath").val() + "/MasterCertificator/AjaxReadVendor",
                    contentType: "application/json",
                    type: "POST",
                    cache: false
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
                        PID: { type: "string", filterable: false, editable: false, sortable: true },
                        NRP: { type: "string", filterable: false, editable: true, sortable: true },
                        NAMA: { type: "string", filterable: false, editable: true, sortable: true },
                        POSISI: { type: "string", filterable: true, editable: true, sortable: true },
                        PERUSAHAAN: { type: "string", filterable: true, editable: true, sortable: true },
                        IS_ACTIVE: { type: "boolean", editable: true },
                    }
                }
            }
        },
        height: "520px",
        filterable: {
            extra: false
        },
        sortable: true,
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
        columns: [
            {
                command: [{ text: "Select", click: selectVendor }
                ],
                title: "<center>Action</center>",
                width: "70px",
                attributes: { class: "text-center" },

            },
            {
                title: "No.",
                width: "40px",
                template: "#= ++RecNumerEq #",
                filterable: false,
                sortable: false,
                editable: false,

            },
            {
                field: "NRP", title: "NRP", width: "80px"
            }, {
                field: "NAMA", title: "Nama", width: "150px"
            }, {
                field: "POSISI", title: "Posisi", width: "150px"
            }, {
                field: "PERUSAHAAN", title: "Perusahaan", width: "150px"
            }, {
                field: "IS_ACTIVE", title: "Status", width: "150px",
                attributes: { style: "text-align: center" },
                template: "\#= IS_ACTIVE ? 'active' : 'inactive' \#"
            }
        ],
        dataBinding: function () {
            window.RecNumerEq = (this.dataSource.page() - 1) * this.dataSource.pageSize();
        }
    });
}

function selectVendor(e) {
    e.preventDefault();
    var dataItem = this.dataItem($(e.currentTarget).closest("tr"));

    $('#txt_selected_nrp').val(dataItem.NAMA);
    $('#lbl_selected_acessor').text(dataItem.NRP);
    $('#btn_switct').prop("disabled", false);
    wnd_vendor.close();
    wnd_employee.close();
}