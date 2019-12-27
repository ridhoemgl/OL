

// --- Load Grid  --------------------------------------------------------------------------
function loadGrid() {

    $("#gridEGI").kendoGrid({
        dataSource: {
            type: "json",
            transport: {
                read: {
                    url: $("#urlPath").val() + "/ModuleEgi/readEGI",
                    contentType: "application/json",
                    type: "POST",
                    cache: false,
                },
                create: {
                    url: $("#urlPath").val() + "/ModuleEgi/createEGI",
                    contentType: "application/json",
                    type: "POST",
                    dataType: "json",
                    complete: function (e) {
                        if (e.responseJSON.status == true) {
                            alert(e.responseJSON.remarks);
                        } else {
                            alert(e.responseJSON.remarks);
                        }
                        $("#gridEGI").data("kendoGrid").dataSource.read();
                    }
                },
                update: {
                    url: $("#urlPath").val() + "/ModuleEgi/updateEGI",
                    contentType: "application/json",
                    type: "POST",
                    cache: false,
                    complete: function (e) {
                        if (e.responseJSON.status == false) {
                            alert(e.responseJSON.remark);
                        }
                        $("#gridEGI").data("kendoGrid").dataSource.read();
                        alert(e.responseJSON.remarks);
                    }
                },
                destroy: {
                    url: $("#urlPath").val() + "/ModuleEgi/deleteEGI",
                    contentType: "application/json",
                    type: "POST",
                    cache: false,
                    complete: function (e) {
                        if (e.responseJSON.status == false) {
                            alert(e.responseJSON.remarks);
                        }
                        $("#gridEGI").data("kendoGrid").dataSource.read();
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
                    id: "EGI_GENERAL",
                    fields: {
                            EGI_GENERAL: { type: "string", filterable: true, sortable: true, editable: true },
                            GROUP_EQUIP_CLASS: { type: "string", filterable: true, sortable: true, editable: true }
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
        toolbar: ["create"],
        //excel: {
        //    fileName: "Master_Certificators.xlsx",
        //    allPages: true
        //},
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
            { field: "EGI_GENERAL", title: "EGI", width: "200px", attributes: { style: "text-align: center" } },
            { field: "GROUP_EQUIP_CLASS", title: "Group Equip Class", width: "200px", attributes: { style: "text-align: center" } },
        ],


        dataBinding: function () {
            window.RecNumerEq = (this.dataSource.page() - 1) * this.dataSource.pageSize();
        },
        edit: function (e) {
            if (e.model.isNew() == false) {
                $('input[name=EGI_GENERAL]').parent().html(e.model.EGI_GENERAL);
            }
        }
    });
}

$(document).ready(function () {

    loadGrid();

});