var flag;

// --- Load Grid  --------------------------------------------------------------------------

function loadGrid() {

    $("#gridCertificator").kendoGrid({
        dataSource: {
            type: "json",
            transport: {
                read: {
                    url: $("#urlPath").val() + "/MasterCertificator/readCertificator",
                    contentType: "application/json",
                    type: "POST",
                    cache: false,
                },
                destroy: {
                    url: $("#urlPath").val() + "/MasterCertificator/deleteCertificator",
                    contentType: "application/json",
                    type: "POST",
                    cache: false,
                    complete: function (e) {
                        if (e.responseJSON.status == false) {
                            alert(e.responseJSON.remarks);
                        }
                        $("#gridCertificator").data("kendoGrid").dataSource.read();
                        alert(e.responseJSON.remarks);
                    }
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
                    id: "LOGIN_ID",
                    fields: { //semua field tabel/vw dari db
                        LOGIN_ID: { type: "string", filterable: true, sortable: true, editable: false },
                        NRP: { type: "string", filterable: true, sortable: true, editable: false },
                        NAME: { type: "string", filterable: true, sortable: true, editable: false },
                        DSTRCT_CODE: { type: "string", filterable: true, sortable: true, editable: false },
                        DEPT_CODE: { type: "string", filterable: true, sortable: true, editable: false },
                        DEPT_DESC: { type: "string", filterable: true, sortable: true, editable: false },
                        POS_TITLE: { type: "string", filterable: true, sortable: true, editable: false },
                        DATE_EXPIRED: { type: "date", filterable: true, sortable: true, editable: false },
                        IS_ACTIVE: { type: "boolean", filterable: true, sortable: true },
                        NO_URUT: { type: "int", filterable: true, sortable: true },
                        NO_REG_ASESOR: { type: "string", filterable: true, sortable: true },
                        IS_ASESOR: { type: "boolean", filterable: true, sortable: true },
                    }
                }
            }
        },
        editable: {
            //confirmation: "Anda yakin akan menghapus data ini ?",
            mode: "popup"
        },
        //height: 565,
        sortable: true,
        reorderable: true,
        groupable: true,
        resizable: true,
        filterable: true,
        columnMenu: true,
        pageable: {
            refresh: true,
            buttonCount: 10,
            input: true,
            pageSizes: [10, 50, 100],
            info: true
        },
        toolbar: [{ template: '<button id="btn_add" type="button" class="k-button" onclick= ClickAdd() >Add New</button>' },
                    "excel"],
        excel: {
            fileName: "Master_Certificators.xlsx",
            allPages: true
        },
        columns: [

            {
                title: "No.",
                width: "30px",
                template: "#= ++RecNumerEq #",
                filterable: false,
                sortable: false,
                editable: false,
                attributes: { style: "text-align: center" }
            },
            {
                command: [
                    {
                        text: "Edit",
                        click: editData,
                        class: 'glyphicon glyphicon-edit'
                    },
                    "destroy"],
                title: "<center>Action</center>",
                width: "150px",
                attributes: { style: "text-align: center" },
                headerAttributes: { style: 'text-align: center' }
            },
            { field: "LOGIN_ID", hidden: true },
            { field: "NRP", title: "NRP", width: "100px", attributes: { style: "text-align: left" } },
            { field: "NAME", title: "Nama", width: "170px", attributes: { style: "text-align: left" } },
            { field: "DSTRCT_CODE", title: "Distrik", width: "100px", attributes: { style: "text-align: center" } },
            { field: "DEPT_CODE", title: "Departemen", width: "120px", attributes: { style: "text-align: center" } },
            { field: "POS_TITLE", title: "Posisi", width: "170px", attributes: { style: "text-align: left" } },
            { field: "DATE_EXPIRED", title: "Expired", width: "100px", attributes: { style: "text-align: center" }, format: "{0:dd-MM-yyyy}", parseFormats: ["MM/dd/yyyy"] },
            {
                field: "IS_ACTIVE",
                title: "Status",
                width: "90px",
                attributes: { style: "text-align: center" },
                template: "\#= IS_ACTIVE ? 'active' : 'inactive' \#"
            },
            { field: "NO_REG_ASESOR", title: "No Registrasi", width: "150px", attributes: { style: "text-align: center" } },
            {
                field: "IS_ASESOR",
                title: "Asessor",
                width: "100px",
                attributes: { style: "text-align: center" },
                template: "\#= IS_ASESOR ? 'active' : 'inactive' \#"
            }

        ],

        dataBinding: function () {
            window.RecNumerEq = (this.dataSource.page() - 1) * this.dataSource.pageSize();
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
                create: {
                    url: $("#urlPath").val() + "/MasterCertificator/AjaxCreateVendor",
                    contentType: "application/json",
                    type: "POST",
                    cache: false,
                    complete: function (e) {
                        if (e.responseJSON.status == false) {
                            alert(e.responseJSON.remarks);
                        }
                        $("#gridVendor").data("kendoGrid").dataSource.read();
                        alert(e.responseJSON.remarks);
                    }
                },
                update: {
                    url: $("#urlPath").val() + "/MasterCertificator/AjaxUpdateVendor",
                    contentType: "application/json",
                    type: "POST",
                    cache: false,
                    complete: function (e) {
                        if (e.responseJSON.status == false) {
                            alert(e.responseJSON.remarks);
                        }
                        $("#gridVendor").data("kendoGrid").dataSource.read();
                        alert(e.responseJSON.remarks);
                    }
                },
                destroy: {
                    url: $("#urlPath").val() + "/MasterCertificator/AjaxDeleteVendor",
                    contentType: "application/json",
                    type: "POST",
                    cache: false,
                    complete: function (e) {
                        if (e.responseJSON.status == false) {
                            alert(e.responseJSON.remarks);
                        }
                        $("#gridVendor").data("kendoGrid").dataSource.read();
                        alert(e.responseJSON.remarks);
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
        toolbar: ["create"],
        columns: [
            {
                command: ["edit", "destroy",
                           { text: "Select", click: selectVendor }
                ],
                title: "<center>Action</center>",
                width: "200px",
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

function load_employee() {
    var grid = $("#gridEmployee").kendoGrid({
        dataSource: {
            type: "json",
            transport: {
                read: {
                    url: $("#urlPath").val() + "/MasterCertificator/AjaxReadEmployee",
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
                field: "DATE_EXPIRED", title: "Expired", width: "150px"
            }, {
                field: "ACTIVE_STATUS", title: "Status", width: "150px",
                attributes: { style: "text-align: center" },
                template: "\#= ACTIVE_STATUS ? 'active' : 'inactive' \#"
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

function ClickOpenVendor() {
    load_vendor();
    wnd_vendor.open().center();
}

function ClickAdd() {
    //$("#id_isAsesor").attr("disabled", true);
    $("#id_noRegis").attr("disabled", true);

    wnd_add.open().center();
    flag = 1;
}

function selects(e) {
    e.preventDefault();
    var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
    //console.log(dataItem);
    
    $("#id_nrp").val(dataItem.NRP);
    $("#id_nama").val(dataItem.NAME);
    $("#id_distrik").val(dataItem.DSTRCT_CODE);
    $("#id_departemen").val(dataItem.DEPT_DESC);
    $("#id_posisi").val(dataItem.POS_TITLE);
    $("#datepicker").val(dataItem.DATE_EXPIRED);

    //if (dataItem.ACTIVE_STATUS == '1') {
    //    $("#id_status").val('active');
    //}
    
   
    wnd_employee.close();
}

function selectVendor(e) {
    e.preventDefault();
    var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
    console.log(dataItem);

    $("#id_nrp").val(dataItem.NRP);
    $("#id_nama").val(dataItem.NAMA);
    $("#id_posisi").val(dataItem.POSISI);

    //if (dataItem.IS_ACTIVE == '1') {
    //    $("#id_status").val('active');
    //}

    wnd_vendor.close();
    wnd_employee.close();
}

var wnd_employee = $("#wnd_employee").kendoWindow({
    modal: true,
    title: "List Employee",
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
    pinned: false
}).data("kendoWindow");

//------------------ Grid ------------------------------------

var wnd_add = $("#wnd_addCertificator").kendoWindow({
    title: "Add",
    visible: false,
    width: "530px",
    height: "405px",
    close: function (e) {

        $("#id_isAsesor").removeAttr("disabled");
        $("#id_noRegis").removeAttr("disabled");
        $("#id_nrp").val('');
        $("#id_nama").val('');
        $("#id_distrik").val('');
        $("#id_departemen").val('');
        $("#id_posisi").val('');
        $("#datepicker").val('');
        $("#id_isAsesor").prop("checked", false);
        $("#id_status").prop("checked", false);
        $("#id_noRegis").val('');
        flag = null;
    },
    open: function () {

    }
}).data("kendoWindow");

var wnd_vendor = $("#wnd_vendor").kendoWindow({
    modal: true,
    title: "List Vendor",
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
    pinned: false
}).data("kendoWindow");

$("#btn_save").click(function () {

    var status = null;
    var isAsesor = null;
    var urlPath = null;

    if ($("#id_nrp").val().trim() == '') {

        alert("Data karyawan harus diisi");

    } else {
        
        if ($('#id_status').is(':checked')) {
            status = "true";
        } else {
            status = "false";
        }

        if ($('#id_isAsesor').is(':checked')) {
            isAsesor = "true";
        } else {
            isAsesor = "false";
        }

        var i_cls_data = {
            CERTIFICATOR_ID: $("#id_nrp").val(),
            CERTIFICATOR_NAME: $("#id_nama").val(),
            DATE_EXPIRED: $("#datepicker").data("kendoDatePicker").value(),
            IS_ACTIVE: status,
            NO_REG_ASESOR: $("#id_noRegis").val(),
            IS_ASESOR: isAsesor
        }

        console.log(i_cls_data);

        if (flag == 1) {
            urlPath = $("#urlPath").val() + "/MasterCertificator/AjaxInsert";
        }
        else if (flag == 0) {
            urlPath = $("#urlPath").val() + "/MasterCertificator/AjaxUpdate";
        }

        $.ajax({
            url: urlPath,
            dataType: "json",
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify({ sTBL_R_CERTIFICATOR: i_cls_data }, { sDate: $("#datepicker").val() }),
            success: function (data) {
                alert(data.remarks);
                $("#wnd_addCertificator").data("kendoWindow").close();
            }
        });

        $('#gridCertificator').data('kendoGrid').dataSource.read();
    }

    

});

$("#btn_cancel").click(function () {
    wnd_add.close();
    flag = null;
});

$("#id_isAsesor").on('change', function () {
    if ($(this).is(':checked')) {
        //$("#id_isAsesor").removeAttr("disabled");
        $("#id_noRegis").removeAttr("disabled");
    } else {
        //$("#id_isAsesor").prop("checked", false);
        //$("#id_noRegis").val("");

        //$("#id_isAsesor").attr("disabled", true);
        $("#id_noRegis").attr("disabled", true);
    }
});

function editData(e) {

    e.preventDefault();

    var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
    wnd_add.center().open();
    wnd_add.title("Edit");
    flag = 0;

    console.log(dataItem);

    $("#id_nrp").val(dataItem.NRP);
    $("#id_nama").val(dataItem.NAME);
    $("#id_distrik").val(dataItem.DSTRCT_CODE);
    $("#id_departemen").val(dataItem.DEPT_CODE);
    $("#id_posisi").val(dataItem.POS_TITLE);
    $("#datepicker").val(dataItem.DATE_EXPIRED);
    //$("#id_status").val(dataItem.ACTIVE_STATUS);
    //$("#id_isAsesor").val(dataI.IS_ASESOR);
    $("#id_noRegis").val(dataItem.NO_REG_ASESOR);

    if (dataItem.IS_ACTIVE == true) {
        //alert("Active");
        $("#id_status").prop("checked", true);
    } else if (dataItem.ACTIVE_STATUS == null || dataItem.ACTIVE_STATUS == false) {
        //alert("Inactive");
        $("#id_status").prop("checked", false);
    }

    if (dataItem.IS_ASESOR == true) {
        //alert("Active");
        $("#id_isAsesor").prop("checked", true);
    } else if (dataItem.ACTIVE_STATUS == null || dataItem.ACTIVE_STATUS == false) {
        //alert("Inactive");
        $("#id_isAsesor").prop("checked", false);
    }

}

$(document).ready(function () {

    loadGrid();
    $("#datepicker").kendoDatePicker();
});