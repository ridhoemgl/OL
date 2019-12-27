
function editorProfile(container, options) {
    $('<input required data-text-field="Deskripsi" data-value-field="GP_ID" data-bind="value:' + options.field + '" />')
    .appendTo(container).kendoDropDownList({
        optionLabel: "Pilih",
        filter: "contains",
        dataTextField: "Deskripsi",
        dataValueField: "GP_ID",
        PrimitiveValue: true,
        dataSource: {
            type: "json",
            transport: {
                read: {
                    url: $("#urlPath").val() + "/MappingUser/AjaxReadProfiles",
                    contentType: "application/json",
                    type: "POST",
                    cache: false,
                }
            },
            schema: {
                data: "Data",
                total: "Total"
            }
        },
    });
}

function editorDistrik(container, options) {
    $('<input required data-text-field="DSTRCT_CODE1" data-value-field="DSTRCT_CODE" data-bind="value:' + options.field + '" />')
    .appendTo(container).kendoDropDownList({
        optionLabel: "Pilih",
        filter: "contains",
        dataTextField: "DSTRCT_CODE1",
        dataValueField: "DSTRCT_CODE",
        PrimitiveValue: true,
        dataSource: {
            type: "json",
            transport: {
                read: {
                    url: $("#urlPath").val() + "/MappingUser/AjaxReadDistrik",
                    contentType: "application/json",
                    type: "POST",
                    cache: false,
                }
            },
            schema: {
                data: "Data",
                total: "Total"
            }
        },
    });
}

$(document).ready(function () {
    var grid = $("#grid").kendoGrid({
        dataSource: {
            type: "json",
            transport: {
                read: {
                    url: $("#urlPath").val() + "/MappingUser/AjaxRead",
                    contentType: "application/json",
                    type: "POST",
                    cache: false
                },
                destroy: {
                    url: $("#urlPath").val() + "/MappingUser/AjaxDelete",
                    contentType: "application/json",
                    type: "POST",
                    complete: function (data) {
                        if (e.responseJSON.status == false) {
                            alert(e.responseJSON.remarks);
                        } else {
                            $("#grid").data("kendoGrid").dataSource.read();
                            alert(e.responseJSON.remarks);
                        }
                    }
                },

                update: {
                    url: $("#urlPath").val() + "/MappingUser/AjaxUpdate",
                    contentType: "application/json",
                    type: "POST",
                    cache: false,
                    complete: function (e) {
                        if (e.responseJSON.status == false) {
                            alert(e.responseJSON.remarks);
                        } else {
                            $("#grid").data("kendoGrid").dataSource.read();
                            alert(e.responseJSON.remarks);
                        }

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
                    id: "ID",
                    fields: {
                        GP: { editable: true },
                        NRP: { editable: false },
                        Deskripsi: { editable: true },
                        //Deskripsi_ID: { editable: true },
                        ID: { editable: true },
                        DISTRIK: { editable: true },
                        KARY_NAMA: { editable: false },
                        KARY_POS: { editable: false }
                    }
                }
            }
        },
        height: 450,
        sortable: true,
        reorderable: true,
        groupable: true,
        resizable: true,
        filterable: true,
        columnMenu: true,
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
        columns: [
            {
                command: ["edit", "destroy"], title: "", width: "110px"
            },
            { field: "NRP", title: "NRP", width: "70px" },
            { field: "KARY_NAMA", title: "NAMA", width: "115px" },
            { field: "GP", title: "Deskripsi", width: "100px", editor: editorProfile, template: "#=Deskripsi#" },
            { field: "DISTRIK", title: "DISTRIK", width: "80px", editor: editorDistrik },
            { field: "KARY_POS", title: "POSISI", width: "150px" }
        ],
        dataBinding: function () {
            window.rowNo = (this.dataSource.page() - 1) * this.dataSource.pageSize();
        }
    });
});

