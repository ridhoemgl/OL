$(document).ready(function () {
    get_bookexam();

    var menu = $("#menu"),
            original = menu.clone(true);
    var selectedRowData = null;

    $("#rootviews").on("contextmenu",function(e){
        return false;
      });
      
    original.find(".k-state-active").removeClass("k-state-active");

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
                    PDFObject.embed($("#urlPath").val() + "/question_image/document_examp/" + (selectedRowData.FILE_PATH) +"#toolbar=0&navpanes=0&scrollbar=0", "#pdf_review");
                    $('#md_pdf_preview').modal('show');
                }
            }
        });
    };

    initMenu();
});

function get_bookexam() {

    if ($("#grid_exampbook").data().kendoGrid != null) {
        $("#grid_exampbook").data().kendoGrid.destroy();
        $("#grid_exampbook").empty();
    }

    $("#grid_exampbook").kendoGrid({
        dataSource: {
            type: "json",
            transport: {
                read: { //tampil
                    url: $("#urlPath").val() + "/StudyForExam/readExamBook",
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
                        MODULE_ID: {
                            type: "string",
                            filterable: true,
                            sortable: true,
                            editable: false
                        },
                        MODULE_NAME: {
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
                        EGI: {
                            type: "string",
                            filterable: true,
                            sortable: true,
                            editable: false
                        },
                        IsActive: {
                            type: "boolean",
                            filterable: true,
                            sortable: true,
                            editable: false
                        },
                        CREATED_DATE: {
                            type: "date",
                            filterable: true,
                            sortable: true,
                            editable: false
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
        columns: [{
            command: [{
                name: "add-data",
                text: "<span class='k-icon k-add'></span>Add new record"
            }],
            hidden: true
        },
            {
                title: "No",
                width: "15px",
                template: "<center> #= ++rowNo # </center>",
                filterable: false,
                editable: false
            }, {
                field: "MODULE_ID",
                hidden: true
            }, {
                field: "MODULE_NAME",
                title: "Nama Modul",
                width: "60px",
                editable: false
            }, {
                field: "FILE_NAME",
                title: "Nama Materi",
                width: "80px",
                editable: false
            }, {
                field: "EGI",
                title: "EGI",
                width: "30px",
                editable: false
            }
        ],
        dataBinding: function () {
            window.rowNo = (this.dataSource.page() - 1) * this.dataSource.pageSize();
        }
    });
}

function is_chebox_active(id) {
    if ($(id).prop('checked')) {
        return true;
    } else {
        return false;
    }
}