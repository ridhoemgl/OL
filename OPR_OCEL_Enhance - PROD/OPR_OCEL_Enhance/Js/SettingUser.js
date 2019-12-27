
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
                    url: $("#urlPath").val() + "/SettingUser/AjaxReadProfiles",
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
                    url: $("#urlPath").val() + "/SettingUser/AjaxReadDistrik",
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
                    url: $("#urlPath").val() + "/SettingUser/AjaxRead",
                    contentType: "application/json",
                    type: "POST",
                    cache: false
                },
                destroy: {
                    url: $("#urlPath").val() + "/SettingUser/AjaxDelete",
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
                    url: $("#urlPath").val() + "/SettingUser/AjaxUpdate",
                    contentType: "application/json",
                    type: "POST",
                    cache: false,
                    complete: function (e) {
                        if (e.responseJSON.status == false) {
                            alert(e.responseJSON.message);
                        } else {
                            $("#grid").data("kendoGrid").dataSource.read();
                            alert(e.responseJSON.message);
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
                    id: "GP_ID",
                    fields: {
                        Deskripsi: { editable: true },
                        Is_active: { type: "boolean", filterable: true, sortable: true },
                        Accept_by: { editable: false },
                        Create_OnDistrict: { filterable: true, sortable: true, editable: false },
                        Create_date: { filterable: true, sortable: true, editable: false },
                        Update_date: { filterable: true, sortable: true, editable: false },
                        Update_OnDistrict: { filterable: true, sortable: true, editable: false },
                    }
                }
            }
        },
        height: 450,
        filterable: true,
        sortable: true,
        pageable: true,
        editable: "inline",
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
                command: [{ name: "edit", text: "Ubah" }, { name: "destroy", text: "Hapus" }], title: "", width: "50px"
            },
            {
                title: "No",
                width: "20px",
                template: "<center> #= ++rowNo # </center>",
                filterable: false,
                sortable: false,
                editable: false,
            },
            { field: "Deskripsi", title: "Posisi", width: "70px"},
            {
                field: "Is_active",
                title: "Aktif",
                width: "130px",
                attributes: { style: "text-align: center" },
                template: "<input id=\"check\" type=\"checkbox\" #= Is_active == true ?\"checked\":\"\" #  />"
            },
            { field: "Accept_by", title: "Dibuat Oleh", width: "100px" },
            //{ field: "Create_OnDistrict", title: "Dibuat Oleh Distrik", width: "80px", editor: editorDistrik },
        ],
        dataBinding: function () {
            window.rowNo = (this.dataSource.page() - 1) * this.dataSource.pageSize();
        }
    });
});
