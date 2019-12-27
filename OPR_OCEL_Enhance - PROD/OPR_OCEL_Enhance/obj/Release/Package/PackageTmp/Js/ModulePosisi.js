
function loadGrid() {

    $("#gridModulePosisi").kendoGrid({
        dataSource: {
            type: "json",
            transport: {
                read: {
                    url: $("#urlPath").val() + "/ModulePosisi/readModulePosisi",
                    contentType: "application/json",
                    type: "POST",
                    cache: false,
                },
                create: {
                    url: $("#urlPath").val() + "/ModulePosisi/createModulePosisi",
                    contentType: "application/json",
                    type: "POST",
                    dataType: "json",
                    complete: function (e) {
                        if (e.responseJSON.status == true) {
                            alert(e.responseJSON.remarks);
                        } else {
                            alert(e.responseJSON.remarks);
                        }
                        $("#gridModulePosisi").data("kendoGrid").dataSource.read();
                    }
                },
                update: {
                    url: $("#urlPath").val() + "/ModulePosisi/updateModulePosisi",
                    contentType: "application/json",
                    type: "POST",
                    cache: false,
                    complete: function (e) {
                        if (e.responseJSON.status == false) {
                            alert(e.responseJSON.remark);
                        }
                        $("#gridModulePosisi").data("kendoGrid").dataSource.read();
                        alert(e.responseJSON.remarks);
                    }
                },
                destroy: {
                    url: $("#urlPath").val() + "/ModulePosisi/deleteModulePosisi",
                    contentType: "application/json",
                    type: "POST",
                    cache: false,
                    complete: function (e) {
                        if (e.responseJSON.status == false) {
                            alert(e.responseJSON.remarks);
                        }
                        $("#gridModulePosisi").data("kendoGrid").dataSource.read();
                        alert(e.responseJSON.remarks);
                    }
                },

                parameterMap: function (data, operation) {
                    return kendo.stringify(data);
                }
            },
            pageSize: 30,
            serverPaging: true,
            serverSorting: true,
            schema: {
                data: "Data",
                total: "Total",
                model: {
                    id: "PID_PM",
                    fields: { //semua field tabel/vw dari db
                        PID_PM: { type: "string", sortable: true, editable: false },
                        MODULE_PID: { type: "string", sortable: true, editable: true },
                        MODULE_NAME: { type: "string", sortable: true, editable: true },
                        POSITION_CODE: { type: "string",sortable: true, editable: true },
                        POSITION_DESC: { type: "string", sortable: true, editable: true },
                        //POSITION_CODE: { type: "string", filterable: true, sortable: true, editable: true },
                        ISACTIVE: { type: "boolean", sortable: true, editable: true },
                        
                    }
                }
            }
        },
        editable: {
            mode: "popup"
        },
        sortable: true,
        reorderable: true,
        groupable: true,
        resizable: true,
        filterable: true,
        columnMenu: true,
        pageable: {
            refresh: true,
            buttonCount: 20,
            input: true,
            pageSizes: [10, 50, 100],
            info: true
        },
        toolbar: ["create"],
        //excel: {
        //    fileName: "Master_ModulePosisis.xlsx",
        //    allPages: true
        //},
        columns: [

            {
                title: "No.",
                width: "20px",
                template: "#= ++RecNumerEq #",
                filterable: false,
                sortable: false,
                editable: false,
                attributes: { style: "text-align: center" }
            },
            {
                command: ["edit", "destroy"], title: "<center>Action</center>", width: "100px", attributes: { style: "text-align: center" }
            },
             {
                 field: "MODULE_PID",
                 title: "Nama Modul",
                 filterable: true,
                 editor: ModuleDropdownEditor,
                 template: "#=MODULE_NAME#",
                 width: "200px",
                 attributes: { style: "text-align: left" }
             },
            {
                field: "POSITION_CODE",
                title: "Posisi di Aplikasi",
                template: "#=POSITION_DESC#",
                editor: PositionAppDropdownEditor,
                width: "150px",
                attributes: { style: "text-align: left" }
            },
            {
                field: "ISACTIVE",
                title: "Status",
                width: "70px",
                attributes: { style: "text-align: center" },
                template: "<input id=\"check\" type=\"checkbox\" #= ISACTIVE == true ?\"checked\":\"\" #  />"
            },

        ],

        dataBinding: function () {
            window.RecNumerEq = (this.dataSource.page() - 1) * this.dataSource.pageSize();
        }
    });
}

function ModuleDropdownEditor(container, options) {
    var model = options.model;
    $('<input required data-text-field="MODULE_NAME"  data-value-field="MODULE_ID" data-bind="value:' + options.field + '" />').appendTo(container).kendoDropDownList({
        autoBind: false,
        dataSource: ModulDataSource,
        dataTextField: "MODULE_NAME",
        dataValueField: "MODULE_ID",
        optionLabel: "Pilih",
        width: "80px"
    }).data("kendoDropDownList");
}

function PositionAppDropdownEditor(container, options) {
    var model = options.model;
    $('<input required data-text-field="POSITION_DESC" style="width: 100%" data-value-field="POSITION_CODE" data-bind="value:' + options.field + '" />').appendTo(container).kendoDropDownList({
        autoBind: false,
        dataSource: PositionAppDataSource,
        dataTextField: "POSITION_DESC",
        dataValueField: "POSITION_CODE",
        optionLabel: "Pilih",
        width: "80px"
    }).data("kendoDropDownList");
}

var PositionAppDataSource = new kendo.data.DataSource({
    transport: {
        read: {
            url: $("#urlPath").val() + "/ModulePosisi/dropdownPositionApp",
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

var ModulDataSource = new kendo.data.DataSource({
    transport: {
        read: {
            url: $("#urlPath").val() + "/ModulePosisi/dropdownModul",
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

$(document).ready(function () {

    loadGrid();
});