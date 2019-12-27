//---------------Load Grid------------
function loadGrid() {

    $("#gridPosition").kendoGrid({
        dataSource: {
            type: "json",
            transport: {
                read: {
                    url: $("#urlPath").val() + "/MasterPosition/readPosition",
                    contentType: "application/json",
                    type: "POST",
                    cache: false,
                },
                create: {
                    url: $("#urlPath").val() + "/MasterPosition/createPosition",
                    contentType: "application/json",
                    type: "POST",
                    dataType: "json",
                    complete: function (e) {
                        if (e.responseJSON.status == true) {
                            alert(e.responseJSON.remarks);
                        } else {
                            alert(e.responseJSON.remarks);
                        }
                        $("#gridPosition").data("kendoGrid").dataSource.read();
                    }
                },
                update: {
                    url: $("#urlPath").val() + "/MasterPosition/updatePosition",
                    contentType: "application/json",
                    type: "POST",
                    cache: false,
                    complete: function (e) {
                        if (e.responseJSON.status == false) {
                            alert(e.responseJSON.remark);
                        }
                        $("#gridPosition").data("kendoGrid").dataSource.read();
                        alert(e.responseJSON.remarks);
                    }
                },
                destroy: {
                    url: $("#urlPath").val() + "/MasterPosition/deletePosition",
                    contentType: "application/json",
                    type: "POST",
                    cache: false,
                    complete: function (e) {
                        if (e.responseJSON.status == false) {
                            alert(e.responseJSON.remarks);
                        }
                        $("#gridPosition").data("kendoGrid").dataSource.read();
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
                    id: "POSITION_CODE",
                    fields: { //semua field tabel/vw dari db
                        POSITION_CODE: { type: "string", filterable: true, sortable: true, editable: false },
                        POSITION_DESC: { type: "string", filterable: true, sortable: true },
                        IS_ACTIVE: { type: "boolean", filterable: true, sortable: true, validation: { required: true} },
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
                command: ["edit", "destroy"], title: "<center>Action</center>", width: "55px"
            },
            { field: "POSITION_CODE", title: "Kode Posisi", width: "35px", attributes: { style: "text-align: center" } },
            { field: "POSITION_DESC", title: "Deskripsi", width: "140px", attributes: { style: "text-align: left" } },
            {
                field: "IS_ACTIVE",
                title: "Status",
                width: "55px",
                attributes: { style: "text-align: center" },
                template: "<input id=\"check\" type=\"checkbox\" #= IS_ACTIVE == true ?\"checked\":\"\" #  />"
            },

        ],


        dataBinding: function () {
            window.RecNumerEq = (this.dataSource.page() - 1) * this.dataSource.pageSize();
        }
    });
}



$(document).ready(function () {

    loadGrid();
    
});