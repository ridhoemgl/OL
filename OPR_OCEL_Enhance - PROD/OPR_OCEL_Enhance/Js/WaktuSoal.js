var i_position_code = null;
var i_ujian_code = null;

$(document).ready(function () {
   
    $("#txtPosisi").kendoDropDownList({
        dataTextField: "POSITION_DESC", 
        dataValueField: "POSITION_CODE", 
        optionLabel: "Pilih", 
        dataSource: sourcePosition,
        change: function (e) {
            var dataItem = this.dataItem(e.item);
            i_position_code = dataItem.POSITION_CODE;
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

});

function viewData() {

    if ($("#txtPosisi").val().trim() == '' || $("#txtJenisUjian").val().trim() == '') {
        alert("Posisi dan Kode Ujian harus dipilih!");
    } else {
        var action;
        if($('#txtPosisi option:selected').text() == "OPERATOR"){
            action = "YES";
        } else {
            action = "NO";
        }

        loadGrid(action, i_position_code, i_ujian_code);
    }
}

function loadGrid(action , s_position_code, s_ujian_code) {
    console.log(s_position_code +" "+ s_ujian_code);
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
                    url: $("#urlPath").val() + "/WaktuSoal/AjaxReadSetWaktu",
                    contentType: "application/json",
                    data: { "action" : action , "s_position_code": s_position_code, "s_ujian_code": s_ujian_code},
                    type: "POST",
                    cache: false,
                },
                update: {
                    url: $("#urlPath").val() + "/WaktuSoal/AjaxUpdateSetWaktu",
                    contentType: "application/json",
                    type: "POST",
                    cache: false,
                    complete: function (data) {
                        $("#grid").data("kendoGrid").dataSource.read();
                        alert(data.responseJSON.remarks);
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
                    id: "PID_SW",
                    fields: { //semua field tabel/vw dari db
                        PID_SW: { type: "string", filterable: true, sortable: true, editable: false },
                        POSITION_CODE: { type: "string", filterable: true, sortable: true, editable: false },
                        POSITION_DESC: { type: "string", filterable: true, sortable: true, editable: false },
                        GOL: { type: "string", filterable: true, sortable: true, editable: false },
                        COUNT_PilihanGanda: { type: "int", filterable: true, sortable: true},
                        COUNT_GandaCampur: { type: "int", filterable: true, sortable: true},
                        COUNT_ESSAI: { type: "int", filterable: true, sortable: true},
                        TIME_PilihanGanda: { type: "number", filterable: true, sortable: true},
                        TIME_GandaCampur: { type: "number", filterable: true, sortable: false },
                        TIME_ESSAI: { type: "number", filterable: true, sortable: true },
                        JENIS_UJIAN_CODE: { type: "int", filterable: true, sortable: true },
                        //MODIF_BY: { type: "string", filterable: true, sortable: true },
                        //CREATE_DATE: { type: "date", filterable: true, sortable: true },
                        //CREATE_BY: { type: "string", filterable: true, sortable: true },
                        //MODIF_DATE: { type: "date", filterable: true, sortable: true },
                    }
                }
            }
        },
        editable: {
            //confirmation: "Anda yakin akan menghapus data ini ?",
            mode: "inline"
        },
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
        //toolbar: ["create"],
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
                 command: ["edit"],
                 title: "<center>Action</center>",
                 width: "80px",
                 attributes: { style: "text-align: center" }
             },
            {
                field: "POSITION_CODE",
                title: "<center>Position</center>",
                template: "#=POSITION_DESC#",
                editor: PositionDropdownEditor,
                width: "100px",
                attributes: { style: "text-align: center" }
            },
            {
                field: "GOL",
                title: "<center>GOL</center>",
                width: "100px",
                attributes: { style: "text-align: center" }
            },
            {
                field: "KATEGORI", title: " ", width: "100px",
                filterable: false,
                sortable: false,
                editor: "<table>" +
                                "<tr><td><center>Waktu</center></td></tr>" +
                            "</table>",
                template: "<table>" +
                                "<tr><td><center>Soal</center></td></tr>" +
                                "<tr><td><center>Waktu</center></td></tr>" +
                            "</table>"
            },
            {
                title: 'Type Soal', headerAttributes: { style: 'text-align: center' },
                columns: [
                    {
                        field: "TIME_PilihanGanda",
                        title: "<center>Pilihan Ganda</center>",
                        width: "100px",
                        attributes: { style: "text-align: center" },
                        template: "<table>" +
                                       "<tr><td><center>#=COUNT_PilihanGanda#</center></td></tr>" +
                                       "<tr><td><center>#=TIME_PilihanGanda#</center></td></tr>" +
                                   "</table>"
                    },
                    {
                        field: "TIME_GandaCampur",
                        title: "<center>Ganda Campur</center>",
                        width: "100px",
                        attributes: { style: "text-align: center" },
                        template: "<table>" +
                                       "<tr><td><center>#=COUNT_GandaCampur#</center></td></tr>" +
                                       "<tr><td><center>#=TIME_GandaCampur#</center></td></tr>" +
                                   "</table>"
                    },
                    {
                        field: "TIME_ESSAI",
                        title: "<center>ESSAI</center>",
                        width: "100px",
                        attributes: { style: "text-align: center" },
                        template: "<table>" +
                                       "<tr><td><center>#=COUNT_ESSAI#</center></td></tr>" +
                                       "<tr><td><center>#=TIME_ESSAI#</center></td></tr>" +
                                   "</table>"
                    }
                ]
            },

        ],

        dataBinding: function () {
            window.RecNumerEq = (this.dataSource.page() - 1) * this.dataSource.pageSize();

            //var grid = $("#grid").data("kendoGrid");


            //if (s_posisiId == "PC0001") {

            //    grid.hideColumn(16);
            //    grid.hideColumn(17);
            //    grid.hideColumn(18);
            //    grid.hideColumn(19);
            //    grid.hideColumn(20);
            //    grid.hideColumn(21);
            //    grid.hideColumn(22);
            //    grid.hideColumn(23);
            //    grid.hideColumn(24);
            //    grid.hideColumn(25);

            //} else {
            //    grid.hideColumn(6);
            //    grid.hideColumn(7);
            //    grid.hideColumn(8);
            //    grid.hideColumn(9);
            //    grid.hideColumn(10);
            //    grid.hideColumn(11);
            //    grid.hideColumn(12);
            //    grid.hideColumn(13);
            //    grid.hideColumn(14);
            //    grid.hideColumn(15);

            //}

        }
    });
}

function PositionDropdownEditor(container, options) {
    var model = options.model;
    $('<input required data-text-field="POSITION_DESC" data-value-field="POSITION_CODE" data-bind="value:' + options.field + '" />').appendTo(container).kendoDropDownList({
        autoBind: false,
        dataSource: sourcePosition,
        dataTextField: "POSITION_DESC",
        dataValueField: "POSITION_CODE",
        optionLabel: "Pilih"
    }).data("kendoDropDownList");
}


// ---------------------------------------------------------------------------------

var sourceJenisUjian = new kendo.data.DataSource({
    transport: {
        read: {
            url: $("#urlPath").val() + "/WaktuSoal/dropdownJenisUjian",
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
            url: $("#urlPath").val() + "/WaktuSoal/dropdownPosition",
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