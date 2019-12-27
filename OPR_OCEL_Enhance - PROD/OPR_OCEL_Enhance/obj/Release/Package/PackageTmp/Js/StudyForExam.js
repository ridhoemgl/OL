$(document).ready(function () {
    get_bookexam();

    var menu = $("#menu"),
            original = menu.clone(true);
    var selectedRowData = null;

    original.find(".k-state-active").removeClass("k-state-active");

    $.ajax(
       {
           type: 'GET',
           cache: false,
           headers: {
               'Cache-Control': 'no-cache, no-store, must-revalidate',
               'Pragma': 'no-cache',
               'Expires': '0'
           },
           url: $("#urlPath").val() + "/StudyForExam/dropdownEGI",
           success: function (data) {
               $.each(data.Data, function (w, y) {
                   $("#drp-egi , #drp-megi").append("<option value='" + y.EGI_GENERAL + "' >" + y.EGI_GENERAL + "</option>");
               });
               $('#drp-egi , #drp-megi').selectpicker('refresh');
           }
       }
    );

    $("#grid_exampbook").on("mousedown", "tr[role='row']", function (e) {
        if (e.which === 3) {
            //$(this).addClass("k-state-selected");
             var gview= $('#grid_exampbook').data("kendoGrid");
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
                if (type === "Remove") {
                    $.confirm({
                        icon: 'fa fa-question',
                        title: 'KONFIRMASI',
                        content: 'Anda akan menghapus dokumen exam ini ?',
                        theme: 'material',
                        closeIcon: true,
                        animation: 'scale',
                        type: 'red',
                        buttons: {
                            'confirm': {
                                text: 'Proceed',
                                btnClass: 'btn-blue',
                                action: function () {
                                    $.confirm({
                                        title: 'Dokumen tidak diperlukan ?',
                                        content: 'Dokumen pdf akan turut dihapus dari server',
                                        icon: 'fa fa-warning',
                                        animation: 'scale',
                                        closeAnimation: 'zoom',
                                        buttons: {
                                            confirm: {
                                                text: 'Hapus',
                                                btnClass: 'btn-orange',
                                                action: function () {
                                                    $.ajax({
                                                        type: "POST",
                                                        url: $("#urlPath").val() + "/StudyForExam//deleteExam",
                                                        data: { kode: selectedRowData.HANDBOOK_PID, path: selectedRowData.FILE_PATH },
                                                        cache: false,
                                                        success: function (result) {
                                                            //console.log(result);
                                                            Swal(
                                                              result.hearder,
                                                              result.remarks,
                                                              result.type
                                                            )
                                                            if (result.status == true) {
                                                                $('#grid_exampbook').data('kendoGrid').dataSource.read();
                                                            }
                                                        }
                                                    });
                                                }
                                            },
                                            cancel: function () {
                                            }
                                        }
                                    });
                                }
                            },
                            cancel: function () { }
                        }
                    });
                } else if (type === "Read") {
                    PDFObject.embed($("#urlPath").val() + "/question_image/document_examp/" + (selectedRowData.FILE_PATH), "#pdf_review");
                    $('#md_pdf_preview').modal('show');
                } else if (type === "Update") {
                    $('#md_edit').modal('show');
                    $('#drp-megi').val(selectedRowData.EGI).change();
                    $('#txt_mmateri').val(selectedRowData.FILE_NAME);
                    $('#PID_modaledit').val(selectedRowData.HANDBOOK_PID);
                }
            }
        });
    };

    initMenu();
});

$("#btn_modalEdit").click(function () {
    $.ajax({
        type: "POST",
        url: $("#urlPath").val() + "/StudyForExam/updatePosition",
        data: {
            EGI: $('#drp-megi').val(),
            HANDBOOK_PID: $('#PID_modaledit').val(),
            FILE_NAME: $('#txt_mmateri').val()
        },
        cache: false,
        success: function (r) {
            $('#md_edit').modal('hide');
            Swal(
                r.messageheader,
                r.remarks,
                r.type
            );
            $('#grid_exampbook').data('kendoGrid').dataSource.read();
        }
    });
});

$("#btn_submitstudy").click(function () {
    $.confirm({
        icon: 'fa fa-exclamation-triangle',
        theme: 'material',
        closeIcon: true,
        animation: 'scale',
        type: 'blue',
        title: 'KONFIRMASI',
        content: 'Anda akan menambahkan materi baru ?',
        buttons: {
            'confirm': {
                text: 'Proceed',
                btnClass: 'btn-blue',
                action: function () {
                    executeupload();
                }
            },
            cancel: function () {
                $.alert('you clicked on <strong>cancel</strong>');
            }
        }
    });
});

function get_bookexam() {
    //REFRESH GRID SEBELUM DI LOAD

    $.ajax({
        type: 'GET',
        url: $("#urlPath").val() + '/PilihanGanda/DropdownModul',
        success: function (data) {
            $.each(data.Data, function (r, h) {
                $("#drp-module").append("<option value='" + h.MODULE_ID + "'>" + h.MODULE_NAME + "</option>");
            });

            $('#drp-module').selectpicker('refresh');
        }
    });

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
                                editable: true
                            },
                            MODULE_NAME: {
                                type: "string",
                                filterable: true,
                                sortable: true,
                                editable: true
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
                    editable : false    
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
                }, {
                    field: "IsActive",
                    title: "Active",
                    width: "25px",
                    attributes: { style: "text-align: center" },
                    template: "<input id=\"check\" type=\"checkbox\" #= IsActive == true ?\"checked\":\"\" #  />"
                }
            ],
            dataBinding: function () {
                window.rowNo = (this.dataSource.page() - 1) * this.dataSource.pageSize();
            }
        });
}



function executeupload() {
    $('body').loadingModal({
        position: 'auto',
        text: '',
        color: '#fff',
        opacity: '0.7',
        backgroundColor: 'rgb(0,0,0)',
        animation: 'rotatingPlane' // Pilihan : rotatingPlane , wave , wanderingCubes, spinner, chasingDots, threeBounce, circle, cubeGrid, fadingCircle, foldingCube
      });
    var files = $("#fileUpload").get(0).files;
    var data = new FormData();

    if (files.length > 0) {
        data.append("UploadedImage", files[0]);

        var ajaxRequest = $.ajax({
            type: "POST",
            url: $("#urlPath").val() + "/StudyForExam/upload_documentExam?name=" + ($('#txt_materi').val()).replace(/\s/g, "-"),
            contentType: false,
            processData: false,
            data: data,
            success: function (response) {
                if (parseInt(response.message) == 1) {
                    $.ajax({
                        type: "POST",
                        url: $("#urlPath").val() + "/StudyForExam/createMateriData",
                        data: {
                            MODULE_ID: $('#drp-module').val(),
                            FILE_NAME: $('#txt_materi').val(),
                            IsActive: is_chebox_active('#cbx_active'),
                            PATH: response.name_file,
                            EGI: $('#drp-egi').val()
                        },
                        cache: false,
                        success: function (r) {
                            Swal(
                              r.messageheader,
                              r.remarks,
                              r.type
                            )

                            if (r.status == true) {
                                document.getElementById("fileUpload").value = null;
                                document.getElementById("txt_materi").value = null;
                            }
                            $('#grid_exampbook').data('kendoGrid').dataSource.read();
                        }
                    });
                }
            }
        });

        ajaxRequest.done(function (xhr, textStatus) {
            // Do other operation
        });

        $('body').loadingModal('hide');
        $('body').loadingModal('destroy');
    }
}

function is_chebox_active(id) {
    if ($(id).prop('checked')) {
        return true;
    } else {
        return false;
    }
}