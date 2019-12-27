
function loadGrid() {

    $("#gridModuleEGI").kendoGrid({
        dataSource: {
            type: "json",
            transport: {
                read: {
                    url: $("#urlPath").val() + "/ModuleEgi/readModuleEgi",
                    contentType: "application/json",
                    type: "POST",
                    cache: false,
                },
                create: {
                    url: $("#urlPath").val() + "/ModuleEgi/createModuleEgi",
                    contentType: "application/json",
                    type: "POST",
                    dataType: "json",
                    complete: function (e) {
                        if (e.responseJSON.status == true) {
                            alert(e.responseJSON.remarks);
                        } else {
                            alert(e.responseJSON.remarks);
                        }
                        $("#gridModuleEGI").data("kendoGrid").dataSource.read();
                    }
                },
                update: {
                    url: $("#urlPath").val() + "/ModuleEgi/updateModuleEgi",
                    contentType: "application/json",
                    type: "POST",
                    cache: false,
                    complete: function (e) {
                        if (e.responseJSON.status == false) {
                            alert(e.responseJSON.remark);
                        }
                        $("#gridModuleEGI").data("kendoGrid").dataSource.read();
                        alert(e.responseJSON.remarks);
                    }
                },
                destroy: {
                    url: $("#urlPath").val() + "/ModuleEgi/deleteModuleEgi",
                    contentType: "application/json",
                    type: "POST",
                    cache: false,
                    complete: function (e) {
                        if (e.responseJSON.status == false) {
                            alert(e.responseJSON.remarks);
                        }
                        $("#gridModuleEGI").data("kendoGrid").dataSource.read();
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
                    id: "PID_EM",
                    fields: { //semua field tabel/vw dari db
                        PID_EM: { type: "string", filterable: true, sortable: true, editable: false },
                        MODULE_ID: { type: "string", filterable: true, sortable: true },
                        MODULE_NAME: { type: "string", filterable: true, sortable: true },
                        EGI_GENERAL: { type: "string", filterable: true, sortable: true },
                        ISACTIVE: { type: "boolean", filterable: true, sortable: true },
                    }
                }
            }
        },

        editable: {
            mode: "popup"
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
        toolbar: [{ name: "create" }
        ],
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
                command: ["edit", "destroy"], title: "<center>Action</center>", width: "100px"
            },
            //{ field: "PID_EM", hidden: true },
            {
                field: "MODULE_ID",
                title: "Module Name",
                editor: ModuleDropdownEditor,
                template: "#=MODULE_NAME#",
                width: "200px",
                attributes: { style: "text-align: left" }
            },
            {
                field: "EGI_GENERAL",
                title: "EGI",
                editor: EGIDropdownEditor,
                template: "#=EGI_GENERAL#",
                width: "200px",
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

var EGIDataSource = new kendo.data.DataSource({
    transport: {
        read: {
            url: $("#urlPath").val() + "/ModuleEgi/dropdownEGI",
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

var ModulDataSource = new kendo.data.DataSource({
    transport: {
        read: {
            url: $("#urlPath").val() + "/ModuleEgi/dropdownModul",
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


function EGIDropdownEditor(container, options) {
    var model = options.model;
    $('<input required data-text-field="EGI_GENERAL" data-value-field="EGI_GENERAL" data-bind="value:' + options.field + '" />').appendTo(container).kendoDropDownList({
        autoBind: false,
        dataSource: EGIDataSource,
        dataTextField: "EGI_GENERAL",
        dataValueField: "EGI_GENERAL",
        optionLabel: "Pilih",
        autoWidth: true
    }).data("kendoDropDownList").list.width("auto");;
}

function ModuleDropdownEditor(container, options) {
    var model = options.model;
    $('<input required data-text-field="MODULE_NAME" data-value-field="MODULE_ID" data-bind="value:' + options.field + '" />').appendTo(container).kendoDropDownList({
        autoBind: false,
        dataSource: ModulDataSource,
        dataTextField: "MODULE_NAME",
        dataValueField: "MODULE_ID",
        optionLabel: "Pilih",
        autoWidth: true
    }).data("kendoDropDownList").list.width("auto");;
}

$(document).ready(function () {
    $("#primaryTextButton").kendoButton();
    loadGrid();
});