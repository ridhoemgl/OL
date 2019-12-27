function loadGrid() {

    $("#grid_permintaanujian").kendoGrid({
        dataSource: {
            type: "json",
            group: [{ field: "DSTRCT_CODE", aggregates: [{ field: "DSTRCT_CODE", aggregate: "count" }] }],
            transport: {
                read: {
                    url: $("#urlPath").val() + "/PermintaanUjian/ReadPermintaanUjian",
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
                    id: "REQUEST_PID",
                    fields: { //semua field tabel/vw dari db
                        REQUEST_PID: { type: "string", filterable: true, sortable: true, editable: false },
                        RECORD_ID: { type: "string", filterable: true, sortable: true, editable: false },
                        CERTIFICATOR_NRP: { type: "string", filterable: true, sortable: true, editable: false },
                        JENIS_UJIAN_CODE: { type: "number", filterable: true, sortable: true, editable: false },
                        JENIS_UJIAN_DESC: { type: "string", filterable: true, sortable: true, editable: false },
                        REQUEST_DATE: { type: "date", filterable: true, sortable: true, editable: false },
                        STUDENT_ID: { type: "string", filterable: true, sortable: true, editable: false },
                        EGI: { type: "string", filterable: true, sortable: true, editable: false },
                        DEPARTMENT: { type: "string", filterable: true, sortable: true, editable: false },
                        REGISTRATION_DATE: { type: "date", filterable: true, sortable: true, editable: false },
                        EVENT_ID: { type: "string", filterable: true, sortable: true, editable: false },
                        DESCRIPTION: { type: "string", filterable: true, sortable: true, editable: false },
                        EXAM_TYPE: { type: "number", filterable: false, sortable: false, editable: false },
                        EXAM_STATUS: { type: "number", filterable: false, sortable: false, editable: false },
                        MODULE_NAME: { type: "string", filterable: true, sortable: true, editable: false },
                        QUESTION_TYPE: { type: "number", filterable: true, sortable: true, editable: false },
                        QUESTION_DES: { type: "string", filterable: true, sortable: true, editable: false },
                        DSTRCT_CODE: { type: "string", filterable: true, sortable: false, editable: false }
                    }
                }
            }
        },
        editable: {
            //confirmation: "Anda yakin akan menghapus data ini ?",
            mode: "popup"
        },
        //height: 565,
        resizable: true,
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
            {
                command: [{ name: "addsubmits", text: "Ijinkan", click: submit }],
                title: "<center>Action</center>",
                width: "100px",
                attributes: { style: "text-align: center" },
            },
            {
                title: "No.",
                width: "40px",
                template: "#= ++RecNumerEq #",
                filterable: false,
                sortable: false,
                editable: false,
                attributes: { style: "text-align: center" }
            },
            { field: "STUDENT_ID", title: "NRP", width: "90px"},
            { field: "EXAM_STATUS", title: "Status", width: "90px", attributes: { style: "text-align: center" } },
            { field: "EGI", title: "EGI", width: "100px", attributes: { style: "text-align: left" } },
            { field: "JENIS_UJIAN_DESC", title: "Jenis Ujian", width: "150px", attributes: { style: "text-align: center" } },
            { field: "DEPARTMENT", title: "Departemen", width: "200px", attributes: { style: "text-align: left" } },
            { field: "REGISTRATION_DATE", title: "DI Registrasi", width: "140px", format: "{0:dd/MM/yyyy}" },
            { field: "DESCRIPTION", title: "Deskripsi", width: "200px", attributes: { style: "text-align: left" } },
            { field: "QUESTION_DES", title: "Jenis Soal", width: "160px", attributes: { style: "text-align: left" } },
            { field: "REQUEST_DATE", title: "Permintaan", width: "130px", attributes: { style: "text-align: left" }, format: "{0:dd/MM/yyyy}" }
        ],


        dataBinding: function () {
            window.RecNumerEq = (this.dataSource.page() - 1) * this.dataSource.pageSize();
        }
    });
}

function submit(e) {
    e.preventDefault();

    var tr = $(e.target).closest("tr");

    var data = this.dataItem(tr);
    var localParam = {
        RECORD_ID : data.RECORD_ID,
        QUESTION_TYPE : data.QUESTION_TYPE
    };

    $.confirm({
        title: 'Konfirmasi',
        content: 'Apakah Anda yakin akan mengijinkan karyawan tersebut untuk ujian ?.',
        autoClose: 'logoutUser|10000',
        type: 'green',
        theme: 'material',
        buttons: {
            logoutUser: {
                text: 'Oke',
                action: function(){
                    $.ajax({
                        url: $("#urlPath").val() + "/PermintaanUjian/AddPermintaanUjian",
                        contentType: "application/json",
                        dataType: "json",
                        type: "POST",
                        data: JSON.stringify({ sTBL_T_REGISTRATION: localParam }),
                        success: function (response) {
                            $.alert({
                                title: 'Status Konfirmasi',
                                content: response.message+"<br>",
                                animation: 'scale',
                                closeAnimation: 'bottom',
                                backgroundDismiss: true,
                                buttons: {
                                    okay: {
                                        text: 'okay',
                                        btnClass: 'btn-blue'
                                    }
                                }
                            });
                            $("#grid_permintaanujian").data("kendoGrid").dataSource.read();
                        }
                    });
                }
            },
            cancel: function(){}
        }
    });
}


$(document).ready(function () {
    loadGrid();
});

