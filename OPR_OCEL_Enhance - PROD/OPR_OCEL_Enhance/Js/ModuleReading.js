// --- Load Grid  --------------------------------------------------------------------------

function loadGrid() {
    $("#gridRR").kendoGrid({
        dataSource: {
            type: "json",
            transport: {
                read: {
                    url: $("#urlPath").val() + "/ModuleReading/AjaxGetAllReadings",
                    contentType: "application/json",
                    type: "POST",
                    cache: false,
                },
                destroy: {
                    //url: $("#urlPath").val() + "/ModuleReading/AjaxDelete",
                    //contentType: "application/json",
                    //type: "POST",
                    //cache: false,
                    //complete: function (e) {
                    //    if (e.responseJSON.status == false) {
                    //        alert(e.responseJSON.remarks);
                    //    }
                    //    $("#gridRR").data("kendoGrid").dataSource.read();
                    //    alert(e.responseJSON.remarks);
                    //}
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
                    id: "TASK_ID",
                    fields: {
                        TASK_ID: { type: "string", filterable: true, sortable: true, editable: false },
                        MODULE_ID: { type: "string", filterable: true, sortable: true, editable: false },
                        MODULE_NAME: { type: "string", filterable: true, sortable: true, editable: false },
                        NRP: { type: "string", filterable: true, sortable: true, editable: false },
                        NAME: { type: "string", filterable: true, sortable: true, editable: false },
                        DSTRCT_CODE: { type: "string", filterable: true, sortable: true, editable: false },
                        DEPARTEMENT: { type: "string", filterable: true, sortable: true, editable: false },
                        DIVISION: { type: "string", filterable: true, sortable: true, editable: false },
                        POS_TITLE: { type: "string", filterable: true, sortable: true, editable: false },
                        EXAM_FINISH_TIME: { type: "string", filterable: true, sortable: true, editable: false },
                    }
                }
            }
        },
        editable: {
            //confirmation: "Anda yakin akan menghapus data ini ?",
            mode: "popup"
        },
        sortable: true,
        reorderable: true,
        groupable: true,
        resizable: true,
        filterable: true,
        pageable: {
            refresh: true,
            buttonCount: 10,
            input: true,
            pageSizes: [10, 50, 100],
            info: true
        },
        //toolbar: [{ template: '<button id="btn_add" type="button" class="k-button" onclick= addData() >Add New</button>' },
        toolbar: ["excel"],
        excel: {
            fileName: "Reading_Reports.xlsx",
            allPages: true
        },
        columns: [
            {
                title: "<center>No.</center>",
                width: "50px",
                template: "#= ++RecNumerEq #",
                filterable: false,
                sortable: false,
                editable: false,
                attributes: { style: "text-align: center" },
                locked: true,
                lockable: true
            },
            //{
            //    command: [
            //        {
            //            text: "View",
            //            click: viewData,
            //            class: 'glyphicon glyphicon-eye-open'
            //        }],
            //    title: "<center>Action</center>",
            //    width: "100px",
            //    attributes: { style: "text-align: center" },
            //    headerAttributes: { style: 'text-align: center' },
            //    locked: true,
            //    lockable: true
            //},
            {
                field: "TASK_ID",
                hidden: true
            },
            {
                field: "MODULE_ID",
                hidden: true
            },
            {
                field: "MODULE_NAME",
                title: "Module Name",
                width: "150px",
                attributes: { style: "text-align: left" },
            },
            {
                field: "NRP",
                title: "NRP",
                width: "100px",
                attributes: { style: "text-align: left" },
                locked: true,
                lockable: true
            },
            {
                field: "NAME",
                title: "Name",
                width: "150px",
                attributes: { style: "text-align: left" },
                locked: true,
                lockable: true
            },
            {
                field: "DSTRCT_CODE",
                title: "District Code",
                width: "150px",
                attributes: { style: "text-align: left" }
            },
            {
                field: "DEPARTEMENT",
                title: "Department",
                width: "200px",
                attributes: { style: "text-align: left" }
            },
            {
                field: "DIVISION",
                title: "Division",
                width: "150px",
                attributes: { style: "text-align: left" }
            },
            {
                field: "POS_TITLE",
                title: "Pos Title",
                width: "200px",
                attributes: { style: "text-align: left" }
            },
            {
                field: "EXAM_FINISH_TIME",
                template: "#= kendo.toString(kendo.parseDate(EXAM_FINISH_TIME, 'yyyy-MM-dd'), 'dd-MM-yyyy') #",
                format: '{0:dd/MM/yyyy}',
                title: "Exam Finish",
                width: "120px",
                attributes: { style: "text-align: center" },
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

$(document).ready(function () {
    loadGrid();
    $(".k-grid .k-grouping-header").hide();
});