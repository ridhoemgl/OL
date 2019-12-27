$(document).ready(function () {
    loadgrid();


    $("#grid_exampbook").on("mousedown", "tr[role='row']", function (e) {
        if (e.which === 3) {
            //$(this).addClass("k-state-selected");
            var gview = $('#grid_exampbook').data("kendoGrid");
            selectedRowData = gview.dataItem($(this));
        }
    });

    var initMenu = function () {


        menu = $("#menu").kendoContextMenu({
            orientation: "vertical",
            target: "#grid_exampbook",
            animation: {
                open: { effects: "fadeIn" },
                duration: 500
            },
            select: function (e) {
                e.preventDefault();
                //var item = e.item.id;
                //console.log(selectedRowData);
                var type = $.trim(e.item.textContent);
                 if (type === "Read") {
                     PDFObject.embed($("#urlPath").val() + "/question_image/cis_doc/" + (selectedRowData.FILE_PATH) + "#toolbar=0&navpanes=0&scrollbar=0", "#pdf_review");
                    $('#md_pdf_preview').modal('show');
                } 
            }
        });
    };

    initMenu();
});

function loadgrid() {
    if ($("#grid_exampbook").data().kendoGrid != null) {
        $("#grid_exampbook").data().kendoGrid.destroy();
        $("#grid_exampbook").empty();
    }

    $("#grid_exampbook").kendoGrid({
        dataSource: {
            type: "json",
            transport: {
                read: { //tampil
                    url: $("#urlPath").val() + "/CisStudyForExam/readExamBookList",
                    contentType: "application/json",
                    type: "POST",
                    cache: false
                },
                parameterMap: function (data, operation) {
                    return kendo.stringify(data);
                }
            },
            serverPaging: true,
            serverFiltering: true,
            serverSorting: true,
            height: 570,
             group: [{ field: "NAMA_CATEGORY" }, { field: "FILE_NAME", aggregates: [{ field: "FILE_PATH", aggregate: "count" }] }],
            pageable: true,
            pageSize: 15,
            schema: {
                data: "Data", //jmlh data
                total: "Total", //berapa rows
                model: {
                    id: "HANDBOOK_PID",
                    fields: {
                        HANDBOOK_PID: {
                            type: "string",
                            filterable: true,
                            sortable: true,
                            editable: false
                        },
                        PID_CATEGORY: {
                            type: "string",
                            filterable: true,
                            sortable: true,
                            editable: false
                        },
                        NAMA_CATEGORY: {
                            type: "string",
                            filterable: true,
                            sortable: true,
                            editable: false
                        },
                        HANDBOOK_PID: {
                            type: "string",
                            filterable: true,
                            sortable: true,
                            editable: false
                        },
                        FILE_PATH: {
                            type: "string",
                            filterable: true,
                            sortable: true,
                            editable: false
                        },
                        FILE_NAME: {
                            type: "string",
                            filterable: true,
                            sortable: true,
                            editable: false
                        },
                        IsActive: {
                            type: "boolean",
                            filterable: true,
                            sortable: true,
                            editable: true
                        },
                        CREATED_DATE: {
                            type: "date",
                            filterable: true,
                            sortable: true,
                            editable: true
                        },
                        CREATED_BY: {
                            type: "string",
                            filterable: true,
                            sortable: false,
                            editable: false
                        },
                        MODIF_DATE: {
                            type: "date",
                            filterable: true,
                            sortable: true,
                            editable: true
                        },
                        MODIF_BY: {
                            type: "string",
                            filterable: true,
                            sortable: true,
                            editable: false
                        },
                        GROUP_FLG: {
                            type: "string",
                            filterable: true,
                            sortable: true,
                            editable: false
                        }
                    }
                }

            }

        },
        filterable: true,
        sortable: true,
        editable: true,
        pageable: true,
        scrollable: true,
        pageable: {
            refresh: true,
            buttonCount: 10,
            input: true,
            pageSizes: [10, 20, 50, 100, 1000, 100000],
            info: true,
            messages: {}
        },
        columns: [

        //    {
        //    field: "IsActive",
        //    title: "Active",
        //    width: "15px",
        //    attributes: { style: "text-align: center" },
        //    headerAttributes: { style: "text-align: center" },
        //    template: "<input id=\"check\" type=\"checkbox\" #= IsActive == true ?\"checked\":\"\" #  />",
        //    filterable: false
        //},
            {
                title: "No",
                width: "20px",
                headerAttributes: { style: "text-align: center" },
                template: "<center> #= ++rowNo # </center>",
                filterable: false,
                editable: false
            },
            
           
            {
                field: "NAMA_CATEGORY",
                title: "Kategori",
                width: "80px",
                editable: false,
                hidden: true
            },

            {
                field: "FILE_NAME",
                title: "Nama Materi",
                width: "80px",
                editable: false,
                hidden: true
            },
             {
                 field: "FILE_PATH",
                 title: "Nama File",
                 width: "120px",
                 editable: false
             }
            , {
                command: [
                    {name: "Download", click : download },
                    {name: "Read", click : lihat }
                ],
                width: "40px", attributes : { style: "text-align: center" }
            }
        ],
        dataBinding: function () {
            window.rowNo = (this.dataSource.page() - 1) * this.dataSource.pageSize();
        }
    });
}

function download(e) {
    e.preventDefault();
    var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
    window.location.href = $("#urlPath").val() + "/CisStudyForExam/DownloadFile?filename=" + dataItem.FILE_PATH;
}
function lihat(e) {
    e.preventDefault();
    var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
    PDFObject.embed($("#urlPath").val() + "/question_image/cis_doc/" + (dataItem.FILE_PATH) + "#toolbar=0&navpanes=0&scrollbar=0", "#pdf_review");
    $('#md_pdf_preview').modal('show');
}

