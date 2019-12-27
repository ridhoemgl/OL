
function loadGrid() {

    $("#gridVersatility").kendoGrid({
        dataSource: {
            type: "json",
            transport: {
                read: {
                    url: $("#urlPath").val() + "/MasterVersatility/readVersatility",
                    contentType: "application/json",
                    type: "POST",
                    cache: false,
                },
                create: {
                    url: $("#urlPath").val() + "/MasterVersatility/createVersatility",
                    contentType: "application/json",
                    type: "POST",
                    dataType: "json",
                    complete: function (e) {
                        if (e.responseJSON.status == true) {
                            alert(e.responseJSON.remarks);
                        } else {
                            alert(e.responseJSON.remarks);
                        }
                        $("#gridVersatility").data("kendoGrid").dataSource.read();
                    }
                },
                update: {
                    url: $("#urlPath").val() + "/MasterVersatility/updateVersatility",
                    contentType: "application/json",
                    type: "POST",
                    cache: false,
                    complete: function (e) {
                        if (e.responseJSON.status == false) {
                            alert(e.responseJSON.remarks);
                        }
                        $("#gridVersatility").data("kendoGrid").dataSource.read();
                        alert(e.responseJSON.remarks);
                    }
                },
                destroy: {
                    url: $("#urlPath").val() + "/MasterVersatility/deleteVersatility",
                    contentType: "application/json",
                    type: "POST",
                    cache: false,
                    complete: function (e) {
                        if (e.responseJSON.status == false) {
                            alert(e.responseJSON.remarks);
                        }
                        $("#gridVersatility").data("kendoGrid").dataSource.read();
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
                    fields: { //semua field tabel/vw dari db
                        MODULE_ID: { type: "string", filterable: true, sortable: true, editable: false },
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
        toolbar: ["create", "excel"],
        excel: {
            fileName: "Master_Versatility.xlsx",
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
                command: ["edit","destroy"],
                title: "<center>Action</center>",
                width: "100px",
                attributes: { style: "text-align: center" },
            },
            { field: "MODULE_ID", title: "Module ID", width: "200px", attributes: { style: "text-align: center" } },
            { field: "MODULE_NAME", title: "Module Name", width: "200px", attributes: { style: "text-align: center" } }
        ],


        dataBinding: function () {
            window.RecNumerEq = (this.dataSource.page() - 1) * this.dataSource.pageSize();
        }
    });
}


$(document).ready(function () {

    loadGrid();
 
});