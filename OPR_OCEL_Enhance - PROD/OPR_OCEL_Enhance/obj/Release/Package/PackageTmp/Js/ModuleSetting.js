var temp = 
// --- Load Dropdown  --------------------------------------------------------------------------

$("#id_submodule").kendoDropDownList({
    optionLabel: "Pilih",
    dataTextField: "MODULE_SUB_NAME",
    dataValueField: "MODULE_SUB_ID",
    dataSource: {
        type: "json",
        transport: {
            read: {
                url: $("#urlPath").val() + "/ModuleSetting/AjaxGetDDLSubModule",
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
        MODULE_SUB_ID: $('#id_modsubid').val(),
        MODULE_SUB_NAME: $('#id_modsubname').val(),
        MODULE_ID: $("#txt_moduleName").data("kendoDropDownList").value(),
    }

    $.ajax({
        url: $("#urlPath").val() + "/MasterSubmodule/AjaxInsertUpdate",
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

    $('#gridSubmodule').data('kendoGrid').dataSource.read();
});

$("#btn_cancel").click(function () {
    clearForm()
    wnd_editor.close();
});



$("#id_submodule").change(function () {
    var idx = $("#id_submodule").data("kendoDropDownList").selectedIndex
    var tmp_submodule_id = $("#id_submodule").data("kendoDropDownList").dataSource._pristineData[idx - 1].MODULE_ID

    $.ajax({
        type: "POST",
        url: "../ModuleSetting/AJaxGetDDLModule",
        data: {
            param: tmp_submodule_id
        },
        success: function (data) {
            console.log(data)
            //$('#idProfile').append('<option value="">[Pilih Hak Akses]</option>');

            //$.each(data.dataprofile, function (key, r) {
            //    $('#idProfile').append('<option value="' + r.GP + '">' + r.Deskripsi + '</option>');
            //});
        }
    });
})

function clearForm() {
    //$("#id_modsubid").val('');
    //$("#id_modsubname").val('');
    //$("#txt_moduleName").data("kendoDropDownList").value(null);
    //$("#txt_moduleName").data("kendoDropDownList").enable(true);
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
                        MODULE_SUB_NAME: { type: "string", filterable: true, sortable: true, editable: false },
                        MODULE_NAME: { type: "string", filterable: true, sortable: true, editable: false },
                        QUESTION_TYPE: { type: "string", filterable: true, sortable: true, editable: false },
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
                locked: true,
                lockable: true
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
                headerAttributes: { style: 'text-align: center' },
                locked: true,
                lockable: true
            },
            { field: "T_PID", hidden: true },
            { field: "MODULE_ID", hidden: true },
            { field: "MODULE_SUB_NAME", title: "Submodule", width: "150px", attributes: { style: "text-align: left" } },
            { field: "MODULE_NAME", hidden: true },
            //{ field: "MODULE_NAME", title: "Module", width: "150px", attributes: { style: "text-align: left" } },
            {
                field: "QUESTION_TYPE",
                title: "Question Type",
                width: "150px",
                attributes: { style: "text-align: center" },
                headerAttributes: { style: 'text-align: center' },
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
    wnd_editor.center().open();
    wnd_editor.title("Add New Record");
    clearForm();
}

function editData(e) {
    e.preventDefault();
    var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
    console.log(dataItem)

    //wnd_editor.center().open();
    //wnd_editor.title("Edit");

    //$("#id_modsubid").val(dataItem.MODULE_SUB_ID);
    //$("#id_modsubname").val(dataItem.MODULE_SUB_NAME);
    //$("#txt_moduleName").data("kendoDropDownList").text(dataItem.MODULE_NAME);
    //$("#txt_moduleName").data("kendoDropDownList").enable(false);
}

$(document).ready(function () {
    loadGrid();
});