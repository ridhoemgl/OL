$(document).ready(function () {
    loadgrid();

});

function loadgrid() {
    if ($("#grid").data().kendoGrid != null) {
        $("#grid").data().kendoGrid.destroy();
        $("#grid").empty();
    }

    $("#grid").kendoGrid({
        dataSource: {
            type: "json",
            transport: {
                read: { //tampil
                    url: $("#urlPath").val() + "/HistorySelfAssesment/ReadAjaxReadingList",
                    contentType: "application/json",
                    type: "POST",
                    cache: false
                },
                parameterMap: function (data, operation) {
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
                    id: "STUDENT_ID",
                    fields: {
                        STUDENT_ID: {
                            type: "string",
                            filterable: true,
                            sortable: true,
                            editable: false
                        },
                        NAME: {
                            type: "string",
                            filterable: true,
                            sortable: true,
                            editable: false
                        },
                        DEPARTMENT: {
                            type: "string",
                            filterable: true,
                            sortable: true,
                            editable: false
                        },
                        PERIOD: {
                            type: "string",
                            filterable: true,
                            sortable: true,
                            editable: false
                        },
                        DURATION_MINUTE: {
                            type: "string",
                            filterable: true,
                            sortable: true,
                            editable: false
                        },
                        REGISTRATION_DATE: {
                            type: "date",
                            filterable: true,
                            sortable: true,
                            editable: true
                        },
                        EXAM_LOGIN_TIME: {
                            type: "date",
                            filterable: true,
                            sortable: true,
                            editable: true
                        },
                        EXAM_FINISH_TIME: {
                            type: "date",
                            filterable: true,
                            sortable: false,
                            editable: false
                        },
                        STATUS_READING: {
                            type: "string",
                            filterable: true,
                            sortable: true,
                            editable: true
                        },
                        SUPPORT_LINK: {
                            type: "string",
                            filterable: true,
                            sortable: true,
                            editable: false
                        },
                        PERCENT_COMPLETE: {
                            type: "string",
                            filterable: true,
                            sortable: true,
                            editable: false
                        },
                        REMINDING_TIME: {
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
        columns: [
            
            {
                title: "No",
                width: "30px",
                headerAttributes: { style: "text-align: center" },
                template: "<center> #= ++rowNo # </center>",
                filterable: false,
                editable: false
            }, {
                field: "STUDENT_ID",
                title: "Student ID",
                width: "120px",
                editable: false
            }, {
                field: "NAME",
                title: "Nama",
                width: "150px",
                editable: false
            }, {
                field: "DEPARTMENT",
                title: "Departement",
                width: "160px",
                editable: false
            }, {
                field: "PERIOD",
                title: "Periode",
                width: "110px",
                editable: false,
                attributes: { style: "text-align:center" },
                 headerAttributes: { style: "text-align:center" }
            }, {
                field: "DURATION_MINUTE",
                title: "Durasi",
                width: "120px",
                editable: false,
               
                attributes: { style: "text-align:center" }
            }, {
                field: "REGISTRATION_DATE",
                title: "Tanggal Registrasi",
                width: "180px",
                format: "{0:dd-MM-yyyy}",
                editable: false,
                 attributes: { style: "text-align:center" }
            }, {
                field: "EXAM_LOGIN_TIME",
                title: "Waktu Ujian",
                width: "130px",
                format: "{0:dd-MM-yyyy hh:mm}",
                editable: false,
                 attributes: { style: "text-align:center" },
                 headerAttributes: { style: "text-align:center" }
            }, {
                field: "EXAM_FINISH_TIME",
                title: "Waktu Ujian Selesai",
                width: "180px",
                format: "{0:dd-MM-yyyy hh:mm}",
                editable: false,
                 attributes: { style: "text-align:center" },
                 headerAttributes: { style: "text-align:center" }
            }, {
                field: "STATUS_READING",
                title: "Status Baca",
                width: "130px",
                editable: false,
                 attributes: { style: "text-align:center" },
                 headerAttributes: { style: "text-align:center" }
            }, {
                field: "SUPPORT_LINK",
                title: "Support Link",
                width: "180px",
                editable: false,
                headerAttributes: { style: "text-align:center" }
            }, {
                field: "PERCENT_COMPLETE",
                title: "Persen Selesai",
                width: "170px",
                template: "#=PERCENT_COMPLETE#%",
                attributes: { style: "text-align:center" },
                headerAttributes: { style: "text-align:center" },
                editable: false
            }, {
                field: "REMINDING_TIME",
                title: "Waktu Pengingat",
                width: "170px",
                attributes: { style: "text-align:center" },
                headerAttributes: { style: "text-align:center" },
                editable: false
            }

           
        ],
        dataBinding: function () {
            window.rowNo = (this.dataSource.page() - 1) * this.dataSource.pageSize();
        }
    });
}