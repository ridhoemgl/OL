var i_position_code = null;
var i_module = null;
var i_Egi = null;
var i_type_soal = null;
var i_ujian_code = null;


$(document).ready(function () {

    document.getElementById("txtModule").readOnly = true;
    document.getElementById("txtEgi").readOnly = true;

    $("#txtPosisi").kendoDropDownList({
        dataTextField: "POSITION_DESC",
        dataValueField: "POSITION_CODE",
        optionLabel: "Pilih",
        filter: "contains",
        dataSource: sourcePosition,
        change: function (e) {
            var dataItem = this.dataItem(e.item);
            i_position_code = dataItem.POSITION_CODE;

            document.getElementById("txtModule").readOnly = false;
            getmodulle(i_position_code);
        }
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

    $("#txtTypeSoal").kendoDropDownList({
        dataTextField: "TYPE_DESC",
        dataValueField: "TYPE_CODE",
        optionLabel: "Pilih",
        dataSource: sourceTypeSoal,
        change: function (e) {
            var dataItem = this.dataItem(e.item);
            i_type_soal = dataItem.TYPE_CODE;
        }
    });
    
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
        optionLabel: "Pilih",
        filter: "contains",
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

function viewData() {
    //console.log($("#txtEgi").val() +" "+i_Egi);

    if ($("#txtPosisi").val().trim() == '') {
        set_error_alert("Position harus dipilih!");
    }else if($("#txtModule").val().trim() == ''){
        set_error_alert("Module harus dipilih!");
    } else if ($("#txtEgi").val().trim() == 'Pilih') {
        set_error_alert("EGI harus dipilih!");
    } else if ($("#txtTypeSoal").val().trim() == '') {
        set_error_alert("Type Soal harus dipilih!");
    } else if ($("#txtJenisUjian").val().trim() == '') {
        set_error_alert("Jenis Ujian harus dipilih!");
    } else {
        loadGrid(i_position_code, i_module, i_Egi, i_type_soal, i_ujian_code);
    }
}

function set_error_alert(message_error) {
    $.alert({
        title: 'Failed',
        theme: 'material',
        closeIcon: false,
        animation: 'rotate',
        type: 'red',
        content: message_error,
        draggable: true,
        dragWindowGap: 0
    });
}

function loadGrid(s_position_code, s_module, s_Egi, s_type_soal, s_ujian_code){
    //console.log(s_position_code+" "+ s_module+" "+ s_Egi+" "+ s_type_soal+" "+ s_ujian_code);
    //REFRESH GRID SEBELUM DI LOAD
    if ($("#grid").data().kendoGrid != null) {
        $("#grid").data().kendoGrid.destroy();
        $("#grid").empty();
    }

    $("#grid").kendoGrid({
        dataSource: {
            type: "json",
            transport: {
                read: {
                    url: $("#urlPath").val() + "/KelompokSoal/AjaxReadKelompokSoal",
                    contentType: "application/json",
                    data: { "s_position_code": s_position_code, "s_module": s_module, "s_Egi": s_Egi, "s_type_soal": s_type_soal, "s_ujian_code": s_ujian_code },
                    type: "POST",
                    cache: false,
                },
                update: {
                    url: $("#urlPath").val() + "/KelompokSoal/AjaxUpdateKelompoktSoal",
                    contentType: "application/json",
                    type: "POST",
                    cache: false,
                    complete: function (data) {
                        $("#grid").data("kendoGrid").dataSource.read();
                        $.alert({
                            title: 'INFORMASI',
                            theme: 'material',
                            closeIcon: false,
                            animation: 'zoom',
                            type: 'orange',
                            content: "<strong style='font-size: 15px;'>"+data.responseJSON.remarks+"<strong>",
                            draggable: true,
                            dragWindowGap: 0
                        });
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
                    id: "PID",
                    fields: { //semua field tabel/vw dari db
                        PID: { type: "string", filterable: true, sortable: true, editable: false },
                        POSITION_CODE: { type: "string", filterable: true, sortable: true, editable: false },
                        POSITION_DESC: { type: "string", filterable: true, sortable: true, editable: false },
                        MODULE_ID: { type: "string", filterable: true, sortable: true, editable: false },
                        MODULE_NAME: { type: "string", filterable: true, sortable: true, editable: false },
                        EGI_CODE: { type: "string", filterable: true, sortable: true, editable: false },
                        MODULE_SUB_ID: { type: "string", filterable: true, sortable: true, editable: false },
                        MODULE_SUB_NAME: { type: "string", filterable: true, sortable: true, editable: false },
                        TYPE_CODE: { type: "int", filterable: true, sortable: true, editable: false },
                        TYPE_DESC: { type: "string", filterable: true, sortable: true, editable: false },
                        JENIS_UJIAN_CODE: { type: "int", filterable: true, sortable: true, editable: false },
                        JENIS_UJIAN_DESC: { type: "string", filterable: true, sortable: true, editable: false },
                        J_ACTUAL: { type: "number", filterable: true, sortable: true, editable: false },
                        _P0: { type: "number", filterable: true, sortable: true },
                        _P1: { type: "number", filterable: true, sortable: true },
                        _P2: { type: "number", filterable: true, sortable: true },
                        _P3: { type: "number", filterable: true, sortable: true },
                        _P4: { type: "number", filterable: true, sortable: true },
                        _P5: { type: "number", filterable: true, sortable: true },
                        _P6: { type: "number", filterable: true, sortable: true },
                        _P7: { type: "number", filterable: true, sortable: true },
                        _P8: { type: "number", filterable: true, sortable: true },
                        _P9: { type: "number", filterable: true, sortable: true },
                        _2C: { type: "number", filterable: true, sortable: true },
                        _2D: { type: "number", filterable: true, sortable: true },
                        _2E: { type: "number", filterable: true, sortable: true },
                        _2F: { type: "number", filterable: true, sortable: true },
                        _3A: { type: "number", filterable: true, sortable: true },
                        _3B: { type: "number", filterable: true, sortable: true },
                        _3C: { type: "number", filterable: true, sortable: true },
                        _3D: { type: "number", filterable: true, sortable: true },
                        _3E: { type: "number", filterable: true, sortable: true },
                        _3F: { type: "number", filterable: true, sortable: true },
                        _4A: { type: "number", filterable: true, sortable: true },
                        _4B: { type: "number", filterable: true, sortable: true },
                        _4C: { type: "number", filterable: true, sortable: true },
                        _4D: { type: "number", filterable: true, sortable: true },
                        _4E: { type: "number", filterable: true, sortable: true },
                        _4F: { type: "number", filterable: true, sortable: true },
                        IsActive: { type: "boolean", filterable: true, sortable: true },
                    }
                }
            }
        },
        editable: {
            //confirmation: "Anda yakin akan menghapus data ini ?",
            mode: "inline"
        },
        reorderable: true,
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
        //toolbar: ["create"],
        columns: [
            {
                title: "No.",
                width: "30px",
                template: "#= ++rowNo #",
                filterable: false,
                sortable: false,
                editable: false,
                attributes: { style: "text-align: center" }
            },
             {
                 command: ["edit"], title: "Action", width: "100px"
             },
            {
                field: "POSITION_CODE",
                title: "<center>Position</center>",
                template: "#=POSITION_DESC#",
                width: "100px",
                attributes: { style: "text-align: center" }
            },
            {
                field: "MODULE_ID",
                title: "Nama Modul",
                template: "#=MODULE_NAME#",
                width: "150px",
                attributes: { style: "text-align: center" }
            },
            {
                field: "EGI_CODE",
                title: "EGI",
                width: "150px",
                attributes: { style: "text-align: center" }
            },
            {
                field: "MODULE_SUB_ID",
                title: "Kompetensi",
                template: "#=MODULE_SUB_NAME#",
                width: "150px",
                attributes: { style: "text-align: left" }
            },
            {
                field: "TYPE_DESC",
                title: "Tipe Soal",
                width: "150px",
                attributes: { style: "text-align: center" }
            },
            {
                field: "JENIS_UJIAN_DESC",
                title: "Jenis Ujian",
                width: "130px",
                attributes: { style: "text-align: center" }
            },
            { field: "J_ACTUAL", title: "ACT", width: "85px", attributes: { style: "text-align: center" } },
            { field: "_P0", title: "P0", width: "75px", attributes: { style: "text-align: center" } },
            { field: "_P1", title: "P1", width: "75px", attributes: { style: "text-align: center" } },
            { field: "_P2", title: "P2", width: "75px", attributes: { style: "text-align: center" } },
            { field: "_P3", title: "P3", width: "75px", attributes: { style: "text-align: center" } },
            { field: "_P4", title: "P4", width: "75px", attributes: { style: "text-align: center" } },
            { field: "_P5", title: "P5", width: "75px", attributes: { style: "text-align: center" } },
            { field: "_P6", title: "P6", width: "75px", attributes: { style: "text-align: center" } },
            { field: "_P7", title: "P7", width: "75px", attributes: { style: "text-align: center" } },
            { field: "_P8", title: "P8", width: "75px", attributes: { style: "text-align: center" } },
            { field: "_P9", title: "P9", width: "75px", attributes: { style: "text-align: center" } },
            { field: "_2C", title: "2C", width: "75px", attributes: { style: "text-align: center" } },
            { field: "_2D", title: "2D", width: "75px", attributes: { style: "text-align: center" } },
            { field: "_2E", title: "2E", width: "75px", attributes: { style: "text-align: center" } },
            { field: "_2F", title: "2F", width: "75px", attributes: { style: "text-align: center" } },
            { field: "_3A", title: "3A", width: "75px", attributes: { style: "text-align: center" } },
            { field: "_3B", title: "3B", width: "75px", attributes: { style: "text-align: center" } },
            { field: "_3C", title: "3C", width: "75px", attributes: { style: "text-align: center" } },
            { field: "_3D", title: "3D", width: "75px", attributes: { style: "text-align: center" } },
            { field: "_3E", title: "3E", width: "75px", attributes: { style: "text-align: center" } },
            { field: "_3F", title: "3F", width: "75px", attributes: { style: "text-align: center" } },
            { field: "_4A", title: "4A", width: "75px", attributes: { style: "text-align: center" } },
            { field: "_4B", title: "4B", width: "75px", attributes: { style: "text-align: center" } },
            { field: "_4C", title: "4C", width: "75px", attributes: { style: "text-align: center" } },
            { field: "_4D", title: "4D", width: "75px", attributes: { style: "text-align: center" } },
            { field: "_4E", title: "4E", width: "75px", attributes: { style: "text-align: center" } },
            { field: "_4F", title: "4F", width: "75px", attributes: { style: "text-align: center" } },
            {
                field: "IsActive",
                title: "Is Active",
                width: "130px",
                attributes: { style: "text-align: center" },
                template: "<input id=\"check\" type=\"checkbox\" #= IsActive == true ?\"checked\":\"\" #  />"
            }

        ],

        dataBinding: function () {
            window.rowNo = (this.dataSource.page() - 1) * this.dataSource.pageSize();

            var grid = $("#grid").data("kendoGrid");


            if (s_position_code == "PC0001") {

                //grid.hideColumn(16);
                //grid.hideColumn(17);
                //grid.hideColumn(18);
                grid.hideColumn(19);
                grid.hideColumn(20);
                grid.hideColumn(21);
                grid.hideColumn(22);
                grid.hideColumn(23);
                grid.hideColumn(24);
                grid.hideColumn(25);
                grid.hideColumn(26);
                grid.hideColumn(27);
                grid.hideColumn(28);
                grid.hideColumn(29);
                grid.hideColumn(30);
                grid.hideColumn(31);
                grid.hideColumn(32);
                grid.hideColumn(33);
                grid.hideColumn(34);

            } else {
                //grid.hideColumn(6);
                //grid.hideColumn(7);
                //grid.hideColumn(8);
                grid.hideColumn(9);
                grid.hideColumn(10);
                grid.hideColumn(11);
                grid.hideColumn(12);
                grid.hideColumn(13);
                grid.hideColumn(14);
                grid.hideColumn(15);
                grid.hideColumn(16);
                grid.hideColumn(17);
                grid.hideColumn(18);

            }

        }
    });
}


// ---------------------------------------------------------------


var sourceTypeSoal = new kendo.data.DataSource({
    transport: {
        read: {
            url: $("#urlPath").val() + "/KelompokSoal/dropdownTypeSoal",
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