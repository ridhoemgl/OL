var editor_flag;

$("#btn_cancel").click(function () {

    $("#txt_moduleExist").data("kendoDropDownList").enable(true);

    wnd_editor.close();
    clearEditor();
    editor_flag = null;
});

$("#btn_save").click(function (e) {

    if ($("#txt_moduleSub").val().trim() == "" && $("#txt_moduleExist").data("kendoDropDownList").text() == "Select Existing") {

        alert("Kompetensi belum di isi");

    } else if ($("#txt_moduleSub").val().trim() != "" && $("#txt_moduleExist").data("kendoDropDownList").text() != "Select Existing") {

        alert("Pilih salah satu, Kompetensie baru atau Existing!")

    } else if ($("#txt_moduleName").data("kendoDropDownList").text() == "Pilih") {

        alert("Modul belum dipilih");

    } else {
        saveData(editor_flag);
    }
});

$("#txt_moduleName").kendoDropDownList({
    optionLabel: "Pilih",
    dataTextField: "MODULE_NAME",
    dataValueField: "MODULE_ID",
    dataSource: {
        type: "json",
        transport: {
            read: {
                url: $("#urlPath").val() + "/MasterSubVersatility/AjaxReadModule",
                contentType: "application/json",
                type: "POST",
                cache: false
            }
        },
    },
    filter: "contains",
});

$("#txt_moduleExist").kendoDropDownList({
    optionLabel: "Select Existing",
    dataTextField: "MODULE_SUB_NAME",
    dataValueField: "MODULE_SUB_NAME",
    dataSource: {
        type: "json",
        transport: {
            read: {
                url: $("#urlPath").val() + "/MasterSubVersatility/AjaxreadSubModulDistinct",
                contentType: "application/json",
                type: "POST",
                cache: false
            }
        },
    },
    filter: "contains",
});

var wnd_editor = $("#wnd_editor").kendoWindow({
    modal: true,
    visible: false,
    draggable: true,
    scrollable: true,
    width: "500px",
    //actions: ["Close"]
}).data("kendoWindow");

function clearEditor() {
    $("#txt_pid").val("");
    $("#txt_moduleSub").val("");
    $("#txt_moduleName").data("kendoDropDownList").value(null);
    $("#txt_moduleExist").data("kendoDropDownList").value(null);
}

function saveData(editor_flag) {
    var i_cls_data = null;

    if ($("#txt_moduleSub").val().trim() != "" && $("#txt_moduleExist").data("kendoDropDownList").text() == "Select Existing") {
        
        i_cls_data = {
        PID: $("#txt_pid").val(),
        MODULE_SUB_NAME: $("#txt_moduleSub").val(),
        MODULE_ID: $("#txt_moduleName").data("kendoDropDownList").value()
        }

    } else if ($("#txt_moduleSub").val().trim() == "" && $("#txt_moduleExist").data("kendoDropDownList").text() != "Select Existing") {
        
        i_cls_data = {
            PID: $("#txt_pid").val(),
            MODULE_SUB_NAME: $("#txt_moduleExist").data("kendoDropDownList").value(),
            MODULE_ID: $("#txt_moduleName").data("kendoDropDownList").value()
        }

        console.log(i_cls_data);
    }

    if (editor_flag == 0) {
        var url_action = $("#urlPath").val() + "/MasterSubVersatility/AjaxInsert"
    } else if (editor_flag == 1) {
        var url_action = $("#urlPath").val() + "/MasterSubVersatility/AjaxUpdate"
    }

    $.ajax({
        url: url_action,
        dataType: "json",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify({ sTBL_R_MODULE_SUB: i_cls_data }),
        success: function (data) {
            alert(data.remarks);
            $("#wnd_editor").data("kendoWindow").close();
            $("#gridSubVersatility").data("kendoGrid").dataSource.read();
            $('#gridSubVersatility').data('kendoGrid').refresh();
            $("#txt_moduleExist").data("kendoDropDownList").refresh();
        }
    });
}

function loadGrid() {

    if ($("#gridSubVersatility").data().kendoGrid != null) {
        $("#gridSubVersatility").data().kendoGrid.destroy();
        $("#gridSubVersatility").empty();
    }


    $("#gridSubVersatility").kendoGrid({
        dataSource: {
            type: "json",
            transport: {
                read: {
                    url: $("#urlPath").val() + "/MasterSubVersatility/readSubVersatility",
                    contentType: "application/json",
                    type: "POST",
                    cache: false,
                },
                //create: {
                //    url: $("#urlPath").val() + "/MasterSubVersatility/createSubVersatility",
                //    contentType: "application/json",
                //    type: "post",
                //    dataType: "json",
                //    complete: function (e) {
                //        if (e.responseJSON.status == true) {
                //            alert(e.responseJSON.remarks);
                //        } else {
                //            alert(e.responseJSON.remarks);
                //        }
                //        $("#gridSubVersatility").data("kendoGrid").dataSource.read();
                //        $("#gridsubversatility").data("kendogrid").refresh();
                //    }
                //},
                //update: {
                //    url: $("#urlPath").val() + "/MasterSubVersatility/updateSubVersatility",
                //    contentType: "application/json",
                //    type: "POST",
                //    cache: false,
                //    complete: function (e) {
                //        if (e.responseJSON.status == false) {
                //            alert(e.responseJSON.remark);
                //        }
                //        $("#gridSubVersatility").data("kendoGrid").dataSource.read();
                //        alert(e.responseJSON.remarks);
                //    }
                //},
                destroy: {
                    url: $("#urlPath").val() + "/MasterSubVersatility/deleteSubVersatility",
                    contentType: "application/json",
                    type: "POST",
                    cache: false,
                    complete: function (e) {
                        if (e.responseJSON.status == false) {
                            alert(e.responseJSON.remarks);
                        }
                        $("#gridSubVersatility").data("kendoGrid").dataSource.read();
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
                    id: "PID",
                    fields: { //semua field tabel/vw dari db
                        PID: { type: "string", filterable: true, sortable: true, editable: false, hidden: true},
                        MODULE_SUB_ID: { type: "string", filterable: true, sortable: true },
                        MODULE_SUB_NAME: { type: "string", filterable: true, sortable: true },
                        MODULE_ID: { type: "string", filterable: true, sortable: true},
                        MODULE_NAME: { type: "string", filterable: true, sortable: true }
                   
                    }
                }
            }
        },
        editable: {
            //confirmation: "Anda yakin akan menghapus data ini ?",
            mode: "popup"
        },
        //height: 565,
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
        toolbar: [//"create"
            {
                template: "<input type='button' class='k-button' value='Add New Record' onclick='addNewRecord()' />",
                imageclass: "k-icon k-i-pencil"
            }
        , "excel"],
        excel: {
            fileName: "Master_SubVersatilitys.xlsx",
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
                attributes: { style: "text-align: center" }
            },
            {
                command: [{ text: "Edit", click: editData, class: 'glyphicon glyphicon-edit' }, "destroy"],
                title: "<center>Action</center>",
                width: "100px",
                attributes: { style: "text-align: center" },
            },
            {
                field: "MODULE_SUB_ID",
                title: "KD. Kompetensi",
                width: "150px",
                attributes: { style: "text-align: center" },
                headerAttributes: { style: 'text-align: center' }
            },
            {
                field: "MODULE_SUB_NAME",
                title: "Nama Kompetensi",
                width: "150px",
                attributes: { style: "text-align: center" },
                headerAttributes: { style: 'text-align: center' }
            },
            {
                field: "MODULE_NAME",
                title: "Module Name",
                width: "150px",
                attributes: { style: "text-align: center" },
                headerAttributes: { style: 'text-align: center' }
            },

        ],


        dataBinding: function () {
            window.RecNumerEq = (this.dataSource.page() - 1) * this.dataSource.pageSize();
        }
    });
}

function addNewRecord() {
    wnd_editor.center().open();
    wnd_editor.title("Add New Record");
    clearEditor();
    editor_flag = 0;
}

function editData(e) {
    e.preventDefault();

    var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
    //console.log(dataItem);

    wnd_editor.center().open();
    wnd_editor.title("Edit");
    editor_flag = 1;
    
    $("#txt_moduleExist").data("kendoDropDownList").enable(false);

    $("#txt_pid").val(dataItem.PID);
    $("#txt_moduleSub").val(dataItem.MODULE_SUB_NAME);
    $("#txt_moduleName").data("kendoDropDownList").text(dataItem.MODULE_NAME);

}

$(document).ready(function () {
    loadGrid();
});