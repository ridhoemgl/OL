var file_name_path = "";
var ListAttachment = [];
$(document).ready(function () {
    loadkendoupload();
    loadgrid();
    $(".k-widget").removeClass("k-upload-empty");


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
                                                        url: $("#urlPath").val() + "/CisStudyForExam/deleteExam?HANDBOOK_PID=" + selectedRowData.HANDBOOK_PID + "&FILE_NAME=" + selectedRowData.FILE_NAME + "&FILE_PATH=" + selectedRowData.FILE_PATH,
                                                        cache: false,
                                                        success: function (result) {
                                                            //console.log(result);
                                                            Swal('Berhasil', 'Berhasil menghapus', 'success');
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
                    PDFObject.embed($("#urlPath").val() + "/question_image/cis_doc/" + (selectedRowData.FILE_PATH), "#pdf_review");
                    $('#md_pdf_preview').modal('show');
                } else if (type === "Update") {
                    console.log(selectedRowData);
                    $('#md_edit').modal('show');
                    $("#drp-mkategori").val(selectedRowData.PID_CATEGORY).change();
                    $('#txt_mmateri').val(selectedRowData.FILE_NAME);
                    $('#PID_modaledit').val(selectedRowData.GROUP_FLG);
                }
            }
        });
    };
    dd_kategori();
    initMenu();
});

function dd_kategori() {
    $.ajax({
        url: $("#urlPath").val() + "/CisStudyForExam/ListKategori",
        type: "GET",
        dataType: "JSON",
        cache: false,
        success: function (e) {
            if (e.status == true) {
                $.each(e.data, function (w, y) {
                    $("#drp-kategori, #drp-mkategori").append("<option value='" + y.PID_CATEGORY + "' >" + y.NAMA_CATEGORY + "</option>");
                });
                $('#drp-kategori, #drp-mkategori').selectpicker('refresh');
               
            } else {
                alert(e.remarks);
            }
        }

    });
}

function loadkendoupload() {

    var version = detectIE();

    var is_old_browser;
    if (version === false) {
        is_old_browser = false;
    } else if (version >= 12) {
        is_old_browser = true;
        //document.getElementById('result').innerHTML = 'Edge ' + version;
    } else {
        is_old_browser = true;
        //document.getElementById('result').innerHTML = 'IE ' + version;
    }

    $("#file_upload").kendoUpload({
        async: {
            saveUrl: $("#urlPath").val() + "/CisStudyForExam/UploadKendo?is_old_browser=" + is_old_browser,
            autoUpload: true,
            removeUrl: $("#urlPath").val() + "/CisStudyForExam/DeleteKendo"
        },
        multiple: true,
        success: onSuccessUpload,
        error: onErrorUpload,
        remove: function (event){
            var nama = event.files[0].name;

            var objIndex = -1;

            ListAttachment.some(function (el, i) {
                if (el.fname == nama) {
                    objIndex = i;
                    return true;
                }
            });

            ListAttachment.splice(objIndex, 1);
        },
        select: function (event) {

            //console.log(event);
            //console.log(event.files[0].extension);
            var notAllowed = false;

            if (event.files[0].extension != ".pdf") {
                Swal('Oops', 'File hanya bisa PDF', 'error');
                notAllowed = true;
            }

            var breakpoint = 0;
            if (notAllowed == true) {
                event.preventDefault();
            }
        }
    });
}

function onRemove(e) {
   
}

function onSuccessUpload(e) {
    debugger;
    if (e.response.message != 3) {
        for (var i = 0; i < e.response.LAttachment.length; i++) {
            ListAttachment.push({ fname: e.response.LAttachment[i].fname });
        }
    }
    
    //console.log(e);
}

function onRemove() {

}

function onErrorUpload() {

}

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
                    url: $("#urlPath").val() + "/CisStudyForExam/readExamBook",
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
            group: [{ field: "NAMA_CATEGORY" }, { field: "FILE_NAME", aggregates: [{ field: "FILE_PATH", aggregate: "count" }] }],
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
        columns: [{
                field: "IsActive",
                title: "Active",
                width: "25px",
                attributes: { style: "text-align: center" },
                headerAttributes: { style: "text-align: center" },
                template: "<input id=\"check\" type=\"checkbox\" #= IsActive == true ?\"checked\":\"\" # attrPid=\"#=HANDBOOK_PID#\" onChange=\"test(this)\" />",
                filterable : false
            },
            {
                title: "No",
                width: "15px",
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
                width: "80px",
                editable: false
            }
            //, {
            //    command: [
            //        {name: "Download", click : download },
            //        {name: "Lihat", click : lihat }
            //    ],
            //    width: "40px"
            //}
        ],
        dataBinding: function () {
            window.rowNo = (this.dataSource.page() - 1) * this.dataSource.pageSize();
        }
    });
}

function test(e) {
    var stat = $(e).prop("checked");
    //alert($(e).attr("attrPid"));
    var pid = $(e).attr("attrPid");
    var ket = (stat == true) ? "mengaktifkan" : "menonaktifkan";
    $.confirm({
        icon: 'fa fa-question',
        title: 'KONFIRMASI',
        content: 'Anda akan ' + ket + ' dokumen ini ?',
        theme: 'material',
        closeIcon: true,
        animation: 'scale',
        type: 'red',
        buttons: {
            'confirm': {
                text: 'Proceed',
                btnClass: 'btn-blue',
                action: function () {
                    $.ajax({
                        url: $("#urlPath").val() + "/CisStudyForExam/EditStat?HANDBOOK_PID=" + pid + "&IsActive=" + stat,
                        type: "POST",
                        dataType: "JSON",
                        cache: false,
                        //data: { req: iCls },
                        success: function (e) {
                            if (e.status == true) {
                                clear();
                                $('#grid_exampbook').data('kendoGrid').dataSource.read();
                                Swal('Berhasil', 'Berhasil ' + ket + '', 'success');
                            } else {
                                alert(e.remarks);
                            }
                        }

                    });
                }
            },
            cancel: function () {
                if (stat == false) {
                    $(e).prop("checked", true);
                } else {
                    $(e).prop("checked", false);
                }
            }
        }
    });
}

//function download(e) {
//    e.preventDefault();
//    var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
//    window.location.href = $("#urlPath").val() + "/CisStudyForExam/DownloadFile?filename=" + dataItem.FILE_PATH;
//}

//function lihat(e) {
//    e.preventDefault();
//    var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
//}

$("#btn_submitstudy").click(function () {
    //alert(file_name_path);
    if ($("#txt_materi").val() != "" || file_name_path != "" || $("#drp-kategori").val() != "") {

        var iCls = {
            FILE_NAME: $("#txt_materi").val(),
            IsActive: $("#cbx_active").prop("checked") == true ? true : false,
            pid_category :  $("#drp-kategori").val()
        }
        //console.log(iCls);
        //return false;
        var aktif = $("#cbx_active").prop("checked") == true ? true : false;
        $.ajax({
            //url: $("#urlPath").val() + "/CisStudyForExam/SimpanDocument?FILE_NAME=" + $("#txt_materi").val() + "&IsActive=" + aktif + "&pid_category=" + $("#drp-kategori").val() + "&req=" + ListAttachment,
            url : $("#urlPath").val() + "/CisStudyForExam/SimpanDocument",
            dataType: 'json',
            type: "POST",
            contentType: "application/json",
            cache: false,
            data: JSON.stringify({ iCls: iCls, req: ListAttachment }),
            success: function (e) {
                if (e.status == true) {
                    clear();
                    $('#grid_exampbook').data('kendoGrid').dataSource.read();
                    Swal('Berhasil', 'Berhasil menyimpan' , 'success');
                } else {
                    alert(e.remarks);
                }
            }

        });
    }
});


function detectIE() {
    var ua = window.navigator.userAgent;
    var msie = ua.indexOf('MSIE ');
    if (msie > 0) {
        // IE 10 or older => return version number
        return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
    }

    var trident = ua.indexOf('Trident/');
    if (trident > 0) {
        // IE 11 => return version number
        var rv = ua.indexOf('rv:');
        return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
    }

    var edge = ua.indexOf('Edge/');
    if (edge > 0) {
        // Edge (IE 12+) => return version number
        return parseInt(ua.substring(edge + 5, ua.indexOf('.', edge)), 10);
    }

    // other browser
    return false;
}

function clear() {
    $(".k-widget.k-upload").find("ul").remove();
    $(".k-upload-status").remove();
    file_name_path = "";
    $("#drp-kategori").val("").change();
    $("#txt_materi").val("");
}

$("#btn_modalEdit").click(function () {
    //alert("Sdsd");
    $.ajax({
        url: $("#urlPath").val() + "/CisStudyForExam/Edit?HANDBOOK_PID=" + $("#PID_modaledit").val() + "&FILE_NAME=" + $("#txt_mmateri").val() + "&pid_category=" + $("#drp-mkategori").val(),
        type: "POST",
        dataType: "JSON",
        cache: false,
        //data: { req: iCls },
        success: function (e) {
            if (e.status == true) {
                $("#PID_modaledit").val("");
                $("#drp-mkategori").val("");
                $("#txt_mmateri").val("");
                $('#md_edit').modal('toggle');
                $("#grid_exampbook").data("kendoGrid").dataSource.read();
                Swal('Berhasil', 'Berhasil mengedit', 'success');
            } else {
                alert(e.remarks);
            }
        }

    });
});
