// --- Load Dropdown  --------------------------------------------------------------------------

$("#id_module").kendoDropDownList({
    optionLabel: "Pilih",
    dataTextField: "MODULE_NAME",
    dataValueField: "MODULE_ID",
    dataSource: {
        type: "json",
        transport: {
            read: {
                url: $("#urlPath").val() + "/ModuleSetting/AjaxGetDDLModule",
                contentType: "application/json",
                type: "POST",
                cache: false
            }
        },
    },
    filter: "contains",
});

$("#id_questiontype").kendoDropDownList({
    optionLabel: "Pilih",
    dataTextField: "TYPE_DESC",
    dataValueField: "TYPE_CODE",
    dataSource: {
        type: "json",
        transport: {
            read: {
                url: $("#urlPath").val() + "/ModuleSetting/AjaxGetDDLQuestionType",
                contentType: "application/json",
                type: "POST",
                cache: false
            }
        },
    },
    filter: "contains",
});

// --- Etc  --------------------------------------------------------------------------

$("#btn_save").click(function () {
    var param = {
        T_PID: $('#id_pid').val(),
        MODULE_ID: $('#id_module').val(),
        QUESTION_TYPE: $('#id_questiontype').val(),
        PRIORITY: $('#id_priority').val(),
        QUESTION_EACH_COMPETENCY: $('#id_totalquestion').val(),
        PASSING_GRADE: $('#id_passing_grade').val(),
    }

    $.ajax({
        url: $("#urlPath").val() + "/ModuleSetting/AjaxInsertUpdate",
        dataType: "json",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify(param),
        success: function (response) {
            if (response.status) {
                alert(response.remarks)
                clearForm()
                $("#wnd_editor").data("kendoWindow").close();
            }
            else {
                alert(response.remarks)
            }
        }
    });

    $('#gridMS').data('kendoGrid').dataSource.read();
});

$("#btn_cancel").click(function () {
    clearForm()
    wnd_editor.close();
});

$("#id_module").change(function () {
    var module_ddl_val = $("#id_module").data("kendoDropDownList").value()
    console.log('trigger')
    if (module_ddl_val.length > 0) {
        DDLSubModuleReset(module_ddl_val)
    }
    else {
        let submodule_ddl = $("#id_submodule").data("kendoDropDownList");
        // destroy DDL data
        submodule_ddl.destroy();
        submodule_ddl.wrapper.remove();

        // re-create element
        $('<input>').attr({
            type: 'text',
            id: 'id_submodule',
            disabled: 'true'
        }).appendTo($('#wnd_editor').find('.submodule-flag'));
    }
})

$('#id_totalquestion').change(function () {
    let num = $('#id_totalquestion').val()
    if (num < 0) {
        $('#id_totalquestion').val(0)
    }
    else if (num > 15) {
        $('#id_totalquestion').val(100)
    }
    else {
        $('#id_totalquestion').val()
    }
})

$('#id_passing_grade').change(function () {
    let num = $('#id_passing_grade').val()
    if (num < 75) {
        $('#id_passing_grade').val(75)
    }
    else if (num > 100) {
        $('#id_passing_grade').val(100)
    }
    else {
        $('#id_passing_grade').val()
    }
})

function clearForm() {
    $("#id_module").data("kendoDropDownList").value(null);
    $("#id_module").data("kendoDropDownList").enable(true);
    if ($("#id_submodule").data("kendoDropDownList") != undefined) {
        let submodule_ddl = $("#id_submodule").data("kendoDropDownList");
        // destroy DDL data
        submodule_ddl.destroy();
        submodule_ddl.wrapper.remove();

        // re-create element
        $('<input>').attr({
            type: 'text',
            id: 'id_submodule',
            disabled: 'true'
        }).appendTo($('#wnd_editor').find('.submodule-flag'));
    }
    $("#id_questiontype").data("kendoDropDownList").value(null);
    $("#id_questiontype").data("kendoDropDownList").enable(true);

    $("#id_totalquestion").val(0);
    $("#id_passing_grade").val(75);
}

//------------------ Grid ------------------------------------

function loadGrid() {
    $("#gridMS").kendoGrid({
        dataSource: {
            type: "json",
            transport: {
                read: {
                    url: $("#urlPath").val() + "/ModuleSetting/AjaxGetAllModuleSetting",
                    contentType: "application/json",
                    type: "POST",
                    cache: false,
                },
                //destroy: {
                //    url: $("#urlPath").val() + "/MasterSubmodule/AjaxDelete",
                //    contentType: "application/json",
                //    type: "POST",
                //    cache: false,
                //    complete: function (e) {
                //        if (e.responseJSON.status == false) {
                //            alert(e.responseJSON.remarks);
                //        }
                //        $("#gridMS").data("kendoGrid").dataSource.read();
                //        alert(e.responseJSON.remarks);
                //    }
                //},

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
                    id: "T_PID",
                    fields: { //semua field tabel/vw dari db
                        T_PID: { type: "string", filterable: true, sortable: true, editable: false },
                        MODULE_ID: { type: "string", filterable: true, sortable: true, editable: false },
                        MODULE_NAME: { type: "string", filterable: true, sortable: true, editable: false },
                        QUESTION_TYPE: { type: "string", filterable: true, sortable: true, editable: false },
                        TYPE_DESC: { type: "string", filterable: true, sortable: true, editable: false },
                        PRIORITY: { type: "string", filterable: true, sortable: true, editable: false },
                        created_date: { type: "string", filterable: true, sortable: true, editable: false },
                        created_by: { type: "string", filterable: true, sortable: true, editable: false },
                        QUESTION_EACH_COMPETENCY: { type: "string", filterable: true, sortable: true, editable: false },
                        DURATION_MINUTE: { type: "string", filterable: true, sortable: true, editable: false },
                        PASSING_GRADE: { type: "string", filterable: true, sortable: true, editable: false }
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
            fileName: "Master_ModuleSetting.xlsx",
            allPages: true
        },
        columns: [
            {
                title: "No.",
                width: "50px",
                template: "#= ++RecNumerEq #",
                filterable: false,
                sortable: false,
                editable: false,
                attributes: { style: "text-align: center" },
                headerAttributes: { style: 'text-align: center' },
                //locked: true,
                //lockable: true
            },
            {
                command: [
                    {
                        text: "Edit",
                        click: editData,
                        class: 'glyphicon glyphicon-edit'
                    }
                ],
                title: "<center>Action</center>",
                width: "100px",
                attributes: { style: "text-align: center" },
                headerAttributes: { style: 'text-align: center' },
                //locked: true,
                //lockable: true
            },
            { field: "T_PID", hidden: true },
            { field: "MODULE_ID", hidden: true },
            { field: "MODULE_NAME", title: "Module", width: "150px", attributes: { style: "text-align: left" } },
            {
                field: "QUESTION_TYPE",
                hidden: true
            },
            {
                field: "TYPE_DESC",
                title: "Question Type",
                width: "150px",
                attributes: { style: "text-align: left" },
                headerAttributes: { style: 'text-align: left' },
            },

            {
                field: "PRIORITY",
                title: "Priority",
                width: "100px",
                attributes: { style: "text-align: center" },
                headerAttributes: { style: 'text-align: center' },
            },
            { field: "create_date", hidden: true },
            { field: "create_by", hidden: true },
            //{
            //    field: "create_date",
            //    template: "#= kendo.toString(kendo.parseDate(create_date, 'yyyy-MM-dd'), 'dd-MM-yyyy') #",
            //    format: '{0:dd/MM/yyyy}',
            //    title: "Created On",
            //    width: "120px",
            //    attributes: { style: "text-align: center" },
            //},
            //{ field: "create_by", title: "create by", width: "150px", attributes: { style: "text-align: left" } },
            {
                field: "QUESTION_EACH_COMPETENCY",
                title: "Total Question",
                width: "150px",
                attributes: { style: "text-align: center" },
                headerAttributes: { style: 'text-align: center' },
            },
            {
                field: "DURATION_MINUTE",
                title: "Duration",
                width: "100px",
                attributes: { style: "text-align: center" },
                headerAttributes: { style: 'text-align: center' },
            },
            {
                field: "PASSING_GRADE",
                title: "Passing Grade",
                width: "150px",
                attributes: { style: "text-align: center" },
                headerAttributes: { style: 'text-align: center' },
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
    var count_grid = $("#gridMS").data("kendoGrid").dataSource.data().length

    // set default value
    $('#id_priority').val(count_grid + 1)
    $('#id_passing_grade').val()


    wnd_editor.center().open();
    wnd_editor.title("Add New Record");
    clearForm();
}

function editData(e) {
    e.preventDefault();
    var dataItem = this.dataItem($(e.currentTarget).closest("tr"));

    wnd_editor.center().open();
    wnd_editor.title("Edit");

    $("#id_pid").val(dataItem.T_PID)
    $("#id_module").data("kendoDropDownList").text(dataItem.MODULE_NAME);
    $("#id_module").data("kendoDropDownList").enable(false);
    DDLSubModuleReset(dataItem.MODULE_ID)
    $("#id_questiontype").data("kendoDropDownList").text(dataItem.TYPE_DESC);
    $("#id_questiontype").data("kendoDropDownList").enable(false);
    $("#id_priority").val(dataItem.PRIORITY);
    $("#id_totalquestion").val(dataItem.QUESTION_EACH_COMPETENCY);
    $("#id_passing_grade").val(dataItem.PASSING_GRADE);
}

function DDLSubModuleReset(id) {
    $('#id_submodule').prop("disabled", false);
    $("#id_submodule").kendoDropDownList({
        optionLabel: "Daftar Kompetensi",
        dataTextField: "MODULE_SUB_NAME",
        dataValueField: "MODULE_SUB_ID",
        dataSource: {
            type: "json",
            transport: {
                read: {
                    url: $("#urlPath").val() + "/ModuleSetting/AjaxGetDDLSubModule?modul_id=" + id,
                    contentType: "application/json",
                    type: "POST",
                    cache: false,
                }
            },
        },
        filter: "contains",
    });
}

$(document).ready(function () {
    loadGrid();
});