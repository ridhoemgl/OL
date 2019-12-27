// --- Load Dropdown  --------------------------------------------------------------------------

// --- Etc --------------------------------------------------------------------------

$("#btn_save").click(function () {
    var param = {
        MODULE_ID: $('#id_modid').val(),
        MODULE_NAME: $('#id_modname').val(),
    }

    $.ajax({
        url: $("#urlPath").val() + "/MasterModule/AjaxInsertUpdate",
        dataType: "json",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify(param),
        success: function (data) {
            alert(data.remarks);
            clearForm()
            $("#wnd_editor").data("kendoWindow").close();
        }
    });

    $('#gridModule').data('kendoGrid').dataSource.read();
});

$("#btn_cancel").click(function () {
    clearForm()
    wnd_editor.close();
});

function clearForm() {
    $("#id_modid").val('');
    $("#id_modname").val('');
}
// --- Load Grid  --------------------------------------------------------------------------

function loadGrid() {
    $("#gridModule").kendoGrid({
        dataSource: {
            type: "json",
            transport: {
                read: {
                    url: $("#urlPath").val() + "/MasterModule/AjaxGetAllModules",
                    contentType: "application/json",
                    type: "POST",
                    cache: false,
                },
                destroy: {
                    url: $("#urlPath").val() + "/MasterModule/AjaxDelete",
                    contentType: "application/json",
                    type: "POST",
                    cache: false,
                    complete: function (e) {
                        if (e.responseJSON.status == false) {
                            alert(e.responseJSON.remarks);
                        }
                        $("#gridModule").data("kendoGrid").dataSource.read();
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
                    id: "MODULE_ID",
                    fields: {
                        MODUL_ID: { type: "string", filterable: true, sortable: true, editable: false },
                        MODULE_NAME: { type: "string", filterable: true, sortable: true, editable: false },
                        IS_ACTIVE: { type: "boolean", filterable: true, sortable: true },
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
        //columnMenu: true,
        pageable: {
            refresh: true,
            buttonCount: 10,
            input: true,
            pageSizes: [10, 50, 100],
            info: true
        },
        toolbar: [{ template: '<button id="btn_add" type="button" class="k-button" onclick= addData() >Add New</button>' },
                    "excel"],
        excel: {
            fileName: "Master_Modules.xlsx",
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
                attributes: { style: "text-align: center" },
                headerAttributes: { style: 'text-align: center' },
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
            {
                field: "MODULE_ID",
                hidden: true
            },
            {
                field: "MODULE_NAME",
                title: "Module",
                width: "150px",
                attributes: { style: "text-align: left" }
            },
            {
                field: "IS_ACTIVE",
                title: "Status",
                width: "70px",
                attributes: { style: "text-align: center" },
                headerAttributes: { style: 'text-align: center' },
                template: "\#= IS_ACTIVE ? 'active' : 'inactive' \#"
            },
        ],

        dataBinding: function () {
            window.RecNumerEq = (this.dataSource.page() - 1) * this.dataSource.pageSize();
        }
    });
}

//------------------ Grid ------------------------------------

var wnd_editor = $("#wnd_editor").kendoWindow({
    modal: true,
    visible: false,
    draggable: true,
    scrollable: true,
    width: "500px",
}).data("kendoWindow");

function addData(e) {
    wnd_editor.center().open();
    wnd_editor.title("Add New Record");
    clearForm();
}

function editData(e) {
    e.preventDefault();
    var dataItem = this.dataItem($(e.currentTarget).closest("tr"));

    wnd_editor.center().open();
    wnd_editor.title("Edit");

    $("#id_modid").val(dataItem.MODULE_ID);
    $("#id_modname").val(dataItem.MODULE_NAME);
}

$(document).ready(function () {
    loadGrid();
});