$(document).ready(function () {
    

    $("#txtPosisi").kendoDropDownList({
        dataTextField: "POSITION_DESC",
        dataValueField: "POSITION_CODE",
        optionLabel: "Pilih",
        filter: "contains",
        dataSource: sourcePosition,
        change: function (e) {
            var dataItem = this.dataItem(e.item);
            i_position_code = dataItem.POSITION_CODE;
            if(i_position_code !== ''){
                $("#txtJenisUjian").data("kendoDropDownList").enable(true);
            }else{
                $("#txtJenisUjian").data("kendoDropDownList").enable(false);
            }
        }
    });

    $("#txtJenisUjian").kendoDropDownList({
        dataTextField: "JENIS_UJIAN_DESC",
        dataValueField: "JENIS_UJIAN_CODE",
        optionLabel: "Pilih",
        dataSource: sourceJenisUjian
    });

    $("#txtJenisUjian").data("kendoDropDownList").enable(false);

    $( "#btn_cari" ).click(function() {
        var pos_id = $("#txtPosisi").data("kendoDropDownList").value();
        var exam_type = $("#txtJenisUjian").data("kendoDropDownList").value();
        loadgrid_data(exam_type , pos_id);
    });
});

function loadgrid_data(exam_type , pos_code) {

    $("#grid_data").kendoGrid({
        toolbar: ["excel"],
        excel: {
            allPages: true
        },
        dataSource: {
            type: "json", //tipe formating
            transport: {
                read: { //tampil
                    url: $("#urlPath").val() + "/PlanAktualExam/AjaxReadMonitoring",
                    contentType: "application/json; charset=utf-8",
                    data: {
                        exam_type: exam_type,
                        pos_code : pos_code
                    },
                    type: "POST",
                    cache: false
                },
                parameterMap: function(data, operation) //parsing biar ke grid
                {
                    return kendo.stringify(data);
                }
            },
            error: function (e) {
                alert("Error");
            },
            change: function (e) {
                hideLoading();
            },
            requestStart: function (e) {
                showToast();
            }
            ,
            serverPaging: true,
            serverFiltering: true,
            serverSorting: true,
            height: 570,
            pageable: true,
            pageSize: 50,
            schema: {
                data: "Data", //jmlh data
                total: "Total", //berapa rows
                model: {
                    id: "PID",
                    fields: {
                        NRP: {
                            type: "string",
                            filterable: true,
                            sortable: true,
                            editable: false
                        },
                        EMPLOYEE_NAME: {
                            type: "string",
                            filterable: true,
                            sortable: true,
                            editable: false
                        },
                        DSTRCT_CODE: {
                            type: "string",
                            filterable: true,
                            sortable: true,
                            editable: false
                        },
                        DSTRCT_TEST_LOCATION: {
                            type: "string",
                            filterable: true,
                            sortable: true,
                            editable: false
                        },
                        EXAM_FINISHED: {
                            type: "date",
                            filterable: true,
                            sortable: true,
                            editable: false
                        },
                        PLAN_DATE_REMARK: {
                            type: "string",
                            filterable: true,
                            sortable: true,
                            editable: false
                        },
                        RANGE_DATE: {
                            type: "string",
                            filterable: true,
                            sortable: true
                        },
                        EXAM_STATUS: {
                            type: "string",
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
            pageSizes: [50, 100, 500, 1000, 2000, 4000, 5000, 10000],
            info: true,
            messages: {}
        },
        columns: [
            {
                title: "No",
                width: "35px",
                template: "<center> #= ++rowNo # </center>",
                filterable: false
            },{
                field: "NRP",
                title: "NRP",
                width: "70px"

            },
            {
                field: "EMPLOYEE_NAME",
                title: "Nama Peserta",
                width: "150px"

            },
            {
                field: "DSTRCT_CODE",
                title: "Distrik",
                width: "80px",
                headerAttributes: {
                    "class": "center-header"
                }

            },
            {
                field: "DSTRCT_TEST_LOCATION",
                title: "Lokasi Tes",
                width: "100px"

            },
            {
                field: "EXAM_FINISHED",
                title: "Selesai Tes",
                format: '{0:dd/MM/yyyy}',
                width: "100px",
                headerAttributes: {
                    "class": "center-header"
                }
            },
            {
                field: "PLAN_DATE_REMARK",
                title: "Planing",
                width: "80px"

            },
            {
                field: "RANGE_DATE",
                title: "Selisih",
                width: "80px",
                headerAttributes: {
                    "class": "center-header"
                },
                attributes: {
                    style: "text-align: center;"
                }
            },
            {
                field: "EXAM_STATUS",
                title: "Status",
                width: "80px"
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

var sourcePosition = new kendo.data.DataSource({
    transport: {
        read: {
            url: $("#urlPath").val() + "/KelompokSoal/dropdownPosition",
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

function showToast(){
    var title = "Loading Data";
    var icon = "Please Wait...";
    var duration = 1300000;
    $.Toast.showToast({title: title,duration: duration, icon:icon,image: ''});
  }

function hideLoading(){
    $.Toast.hideToast();
}