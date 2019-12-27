// --- Load Grid  --------------------------------------------------------------------------
function loadGrid() {

    $("#gridLokasi").kendoGrid({
        dataSource: {
            type: "json",
            transport: {
                read: {
                    url: $("#urlPath").val() + "/MasterLokasi/readLokasi",
                    contentType: "application/json",
                    type: "POST",
                    cache: false,
                },
                create: {
                    url: $("#urlPath").val() + "/MasterLokasi/createLokasi",
                    contentType: "application/json",
                    type: "POST",
                    dataType: "json",
                    complete: function (e) {
                        if (e.responseJSON.status == true) {
                            alert(e.responseJSON.remarks);
                        } else {
                            alert(e.responseJSON.remarks);
                        }
                        $("#gridLokasi").data("kendoGrid").dataSource.read();
                    }
                },
                update: {
                    url: $("#urlPath").val() + "/MasterLokasi/updateLokasi",
                    contentType: "application/json",
                    type: "POST",
                    cache: false,
                    complete: function (e) {
                        if (e.responseJSON.status == false) {
                            alert(e.responseJSON.remark);
                        }
                        $("#gridLokasi").data("kendoGrid").dataSource.read();
                        alert(e.responseJSON.remarks);
                    }
                },
                destroy: {
                    url: $("#urlPath").val() + "/MasterLokasi/deleteLokasi",
                    contentType: "application/json",
                    type: "POST",
                    cache: false,
                    complete: function (e) {
                        if (e.responseJSON.status == false) {
                            alert(e.responseJSON.remarks);
                        }
                        $("#gridLokasi").data("kendoGrid").dataSource.read();
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
                        PID: { type: "string", filterable: true, sortable: true, editable: false },
                        TEST_CENTER_ID: { type: "string", filterable: true, sortable: true, editable: false },
                        TEST_CENTER_NAME: { type: "string", filterable: true, sortable: true },
                        LOCATION: { type: "string", filterable: true, sortable: true },
                        FACILITY_DESC: { type: "string", filterable: true, sortable: true },
                        CAPACITY: { type: "int", filterable: true, sortable: true },
                        CHECK_CAPACITY: { type: "boolean", filterable: true, sortable: true },
                        DIV_APP_ID: { type: "string", filterable: true, sortable: true },
                        //DSTCT_CODE: { type: "string", filterable: true, sortable: true },

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
                width: "20px",
                template: "#= ++RecNumerEq #",
                filterable: false,
                sortable: false,
                editable: false,
                attributes: { style: "text-align: center" }
            },
            {
                command: ["edit", "destroy"], title: "<center>Action</center>", width: "80px", attributes: { style: "text-align: center" }
            },
            //{ field: "TEST_CENTER_ID", title: "Test Center ID", width: "100px", attributes: { style: "text-align: center" } },
            { field: "TEST_CENTER_NAME", title: "Test Center Name", width: "100px", attributes: { style: "text-align: left" } },
            { field: "LOCATION", title: "Location", width: "70px", attributes: { style: "text-align: center" }, template: "#=LOCATION#", editor: dd_loc },
            { field: "FACILITY_DESC", title: "Facility Description", width: "190px", attributes: { style: "text-align: left" } },
            { field: "CAPACITY", title: "Capacity", width: "60px", attributes: { style: "text-align: center" } },
            {
                field: "CHECK_CAPACITY",
                title: "Check Capacity",
                width: "70px",
                attributes: { style: "text-align: center" },
                template: "<input id=\"check\" type=\"checkbox\" #= CHECK_CAPACITY == true ?\"checked\":\"\" #  />"
            },

        ],


        dataBinding: function () {
            window.RecNumerEq = (this.dataSource.page() - 1) * this.dataSource.pageSize();
        }
    });
}


function dd_loc(container, options) {
    $('<input required data-text-field="DSTRCT_CODE" data-value-field="DSTRCT_CODE" data-bind="value:LOCATION"/>')
        .appendTo(container).kendoDropDownList({
            optionLabel: "Pilih",
            dataTextField: "DSTRCT_CODE",
            dataValueField: "DSTRCT_CODE",
            PrimitiveValue: true,
            dataSource: {
                type: "json",
                serverFiltering: true,
                transport: {
                    read: {
                        url: $("#urlPath").val() + "/MasterLokasi/AjaxGetListLoc",
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

    loadGrid();

});