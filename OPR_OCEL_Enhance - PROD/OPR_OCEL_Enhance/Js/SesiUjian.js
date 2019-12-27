var add_event = 1;
var evnt_id = null;
var gp_status;

var datacertArray = [];
//PopUp Dialog
var popup_dlg_dua = $("#popup_dlg_dua").kendoWindow({
    modal: true,
    title: "Edit Waktu",
    width: 800,
    height: 300,
    visible: false,
    draggable: true,
    scrollable: true,
    close: function () {

    },
    open: function (e) {
        //loadGridWaktu();
    }
}).data("kendoWindow").center();

$(document).ready(function () {
    
    loadGrid();
    
    function startChange() {
        var startDate = start.value(),
        endDate = end.value();

        if (startDate) {
            startDate = new Date(startDate);
            startDate.setDate(startDate.getDate());
            end.min(startDate);
        } else if (endDate) {
            start.max(new Date(endDate));
        } else {
            endDate = new Date();
            start.max(endDate);
            end.min(endDate);
        }
    }

    $('#txt_target').keyup(function(e)
    {
        if (/\D/g.test(this.value))
        {
            this.value = this.value.replace(/\D/g, '');
        }
    });

    $('#drp-exam-loc').on('change', function () {
        console.log(datacertArray);
        $.ajax({
            url: $("#urlPath").val() + "/SesiUjian/GetCertificatorByDstric",
            type: "POST",
            data: {
                DISTRICT: $(this).val().substring(0, 4)
            },
            success: function (response) {
                if (response.status == true) {
                    $('#drp-certificator option:not(:first)').remove();
                    //console.log(response.Certificators);
                    $.each(response.Certificators, function (w, y) {
                        if ($.inArray(y.NRP, datacertArray) > -1){
                            $("#drp-certificator").append("<option value='" + y.NRP + "' selected>" + y.NAME + "</option>");
                        }else{
                            $("#drp-certificator").append("<option value='" + y.NRP + "' >" + y.NAME + "</option>");
                        }
                    });
    
                    $('#drp-certificator').selectpicker('refresh');
    
                } else if (response.status == false) {
                    alert(response.error);
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log(textStatus, errorThrown);
            }
        });
    });

    function endChange() {
        var endDate = end.value(),
        startDate = start.value();

        if (endDate) {
            endDate = new Date(endDate);
            endDate.setDate(endDate.getDate());
            start.max(endDate);
        } else if (startDate) {
            end.min(new Date(startDate));
        } else {
            endDate = new Date();
            start.max(endDate);
            end.min(endDate);
        }
    }

    var start = $("#starting").kendoDatePicker({
        change: startChange
    }).data("kendoDatePicker");

    var end = $("#end").kendoDatePicker({
        change: endChange
    }).data("kendoDatePicker");

    end.min(start.value());
    //console.clear();
});

function grid_add() {
    $('#header_modal').text('Tambah data sesi ujian');
    $('#modal_add_new').modal('show');
    add_event = 1;
    $('#drp-certificator , #drp-exam-loc , #drp-modul option').prop("selected", false);
}

$("#BM_save_sesi").click(function () {
    
    var err_status = false;
    $("#message_error").empty();
    var error  = "";
    if ($('#sort-desc').val() === "") {
        err_status = true;
        $("#message_error").append("<label id ='err_sortdesc'>Maaf Keterangan singkat harus anda isi</label> , ");
    }

    if( !$('#drp-exam-loc').val() ) {
        err_status = true;
        $("#message_error").append("<label id ='err_location'>Data lokasi ujian harus di pilih</label> , ");
    }

    if( !$('#drp-modul').val() ) {
        err_status = true;
        $("#message_error").append("<label id ='err_location'>Data sertifikator harus di pilih</label><br>");
    }

    if( !$('#starting').val() ) {
        err_status = true;
        $("#message_error").append("<label id ='err_location'>Data tanggal mulai ujian harus di isi</label><br>");
    }

    if( !$('#txt_target').val() ) {
        err_status = true;
        $("#message_error").append("<label id ='err_location'>Mohon isi data skor minimal yang harus terpenuhi</label><br>");
    }

    if( !$('#end').val() ) {
        err_status = true;
        $("#message_error").append("<label id ='err_location'>Data tanggal berakhir ujian harus di isi</label><br>");
    }

    if ($('#drp-certificator').val() == '' || $('#drp-certificator').val() == 'undefined' || $('#drp-certificator').val() == null) {
        err_status = false;
        $("#message_error").append("<label id ='err_certificator'>Data sertifikator harus di pilih</label> , ");
    }
    
    if(parseInt($('#drp-certificator').val().length) > 1){
        err_status = true;
        $("#message_error").append("<label id ='err_location'>Maaf Anda hanya boleh memilih maksimal 1 Sertifikator saja</label><br>");
        console.clear();
    }

    if (err_status == false) {
        $("#div_error").hide(50);
        var type_s = set_urltype();

        if (add_event == 1) {
            evnt_id = 1;
        }

        $.ajax({
            type: "POST",
            url: $("#urlPath").val() + "/SesiUjian/SesiUjianAction",
            data: {
                TYPE: type_s,
                TEST_CENTER_ID: $('#drp-exam-loc').find("option:selected").val(),
                CERTIFICATOR_ID: $('#drp-certificator').val().join(),
                DESCRIPTION: $('#sort-desc').val(),
                LONG_DESCRIPTION: $('#long_desc').val(),
                MODULE_ID: $('#drp-modul').find("option:selected").val(),
                MODULE_NAME: $('#drp-modul').find("option:selected").text(),
                EXAM_START: $('#starting').val(),
                EXAM_END: $('#end').val(),
                QUESTION_TYPE: $('#drp-qutype').val().join(),
                EVENT_ID : evnt_id,
                JENIS_UJIAN_CODE : $('#drp-ujian_type').val(),
                EXAM_TARGET_MIN : $('#txt_target').val()
            },
            cache: false,
            success: function (data) {
                //console.log(data);
                $('#modal_add_new').modal('hide');
                Swal(
                  data.MESSAGE_HEADER,
                  data.MESSAGE_BODY,
                  data.TYPE
                ).then(function () {
                    if (parseInt(data.STATUSCODE) == 1) {
                        $("#gridsesiujian").data("kendoGrid").dataSource.read();
                    }
                });

            }
        });
    }else{
        $("#div_error").show(50);
    }
});

function set_urltype(){
    var url_type = null;

    if(add_event == 1){
        url_type = 'POST'
    }else if (add_event == 2) {
        url_type = 'PUT'
    }

    return url_type;
}

function loadGrid() {

    var MyButton = null


    if($('#gp_id').val() == 5){
        MyButton = [{
            name: "update-data",
            text: "<i class='fa fa-pencil-square-o' aria-hidden='true'></i> Edit",
            click: grid_update
        }, {
            name: "delete-data",
            text: "<i class='fa fa-times' aria-hidden='true'></i> Off",
            click: grid_delete
        },{
            name: "waktu-data",
            text: "<i class='fa fa-clock-o' aria-hidden='true'></i> T&W",
            click: grid_time
        }];
    }else if($('#gp_id').val() == 6 || $('#gp_id').val() == 3){
        MyButton = [{
            name: "waktu-data",
            text: "<i class='fa fa-clock-o' aria-hidden='true'></i> T&W",
            click: grid_time
        }];
    }else if($('#gp_id').val() == 1){
        MyButton = [{
            name: "update-data",
            text: "<i class='fa fa-pencil-square-o' aria-hidden='true'></i> Edit",
            click: grid_update
        }, {
            name: "delete-data",
            text: "<i class='fa fa-times' aria-hidden='true'></i> Off",
            click: grid_delete
        },{
            name: "waktu-data",
            text: "<i class='fa fa-clock-o' aria-hidden='true'></i> T&W",
            click: grid_time
        },{
            name: "delpermanen-data",
            text: "<i class='fa fa-eraser' aria-hidden='true'></i> Delete",
            click: grid_delete
        }];
    }

    //REFRESH GRID SEBELUM DI LOAD
    if ($("#gridsesiujian").data().kendoGrid != null) {
        $("#gridsesiujian").data().kendoGrid.destroy();
        $("#gridsesiujian").empty();
    }
   
    $("#gridsesiujian").kendoGrid({
        dataSource: {
            type: "json",
            transport: {
                read: { //tampil
                    url: $("#urlPath").val() + "/SesiUjian/readSesiUjian",
                    contentType: "application/json",
                    type: "POST",
                    cache: false
                },
                parameterMap: function (data, operation)
                {
                    return kendo.stringify(data);
                }
            },
            scrollable:true,
            group: [{ field: "TEST_CENTER_NAME", aggregates: [{ field: "DSTRCT_CODE", aggregate: "count" }]}, { field: "MODULE_NAME" }],
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
                    id: "EVENT_ID",
                    fields: {
                        EVENT_ID: {
                            type: "string",
                            filterable: true,
                            sortable: true,
                            editable: false
                        },
                        TEST_CENTER_ID: {
                            type: "string",
                            filterable: true,
                            sortable: true,
                            editable: false
                        },
                        TEST_CENTER_NAME: {
                            type: "string",
                            filterable: true,
                            sortable: true,
                            editable: false
                        },
                        LOCATION: {
                            type: "string",
                            filterable: true,
                            sortable: true,
                            editable: false
                        },
                        CERTIFICATOR_ID: {
                            type: "string",
                            filterable: true,
                            sortable: true,
                            editable: false
                        },
                        NAME: {
                            type: "string",
                            filterable: true,
                            sortable: true,
                            editable: false
                        },
                        DESCRIPTION: {
                            type: "string",
                            filterable: true,
                            sortable: false,
                            editable: false
                        },
                        LONG_DESCRIPTION: {
                            type: "string",
                            filterable: true,
                            sortable: false,
                            editable: false
                        },
                        EXAM_END: {
                            type: "date",
                            filterable: true,
                            sortable: true,
                            editable: false
                        },
                        EXAM_START: {
                            type: "date",
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
                        MODULE_ID: {
                            type: "string",
                            filterable: true,
                            sortable: true
                        },
                        QUESTION_TYPE: {
                            type: "string",
                            filterable: true,
                            sortable: true
                        },
                        JENIS_UJIAN_CODE: {
                            type: "number",
                            filterable: true,
                            sortable: false
                        },
                        EXAM_TARGET_MIN : {
                            type: "number",
                            filterable: true,
                            sortable: false
                        },
                        IS_ACTIVE : {
                            type: "boolean",
                            filterable: true,
                            sortable: false
                        }
                    }
                }

            }

        },
        filterable: true,
        sortable: true,
        editable: true,
        pageable: true,
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
                width: "30px",
                template: "<center> #= ++rowNo # </center>",
                filterable: false,
                attributes: {
                    style: "# if(IS_ACTIVE == false) { #background-color:rgb(230, 126, 34);color:white;#}#"
                }
            }, {
                field: "EVENT_ID",
                hidden: true
            }, {
                field: "TEST_CENTER_NAME",
                title: "Lokasi",
                width: "90px",
                attributes: {
                    style: "# if(IS_ACTIVE == false) { #background-color:rgb(230, 126, 34);color:white;#}#"
                }
            }, {
                field: "MODULE_NAME",
                title: "Modul",
                width: "120px",
                attributes: {
                    style: "# if(IS_ACTIVE == false) { #background-color:rgb(230, 126, 34);color:white;#}#"
                }
            }, {
                field: "CERTIFICATOR_ID",
                title: "Sertifikator",
                template : function(dataItem) {
                        ArrayNRP = (dataItem.CERTIFICATOR_ID).split(",")
                        var template = "<ol>";
                        for (var i = 0; i < ArrayNRP.length; i++) {
                            template = template + "<li>" + ArrayNRP[i] + "</li>";
                        }
                    
                        return template + "</ol>";
                  },
                width: "100px",
                attributes: { style: "text-align: left;# if(IS_ACTIVE == false) { #background-color:rgb(230, 126, 34);color:white;#}#" }
            }, {
                field: "EXAM_START",
                title: "Mulai",
                format      : "{0:dd-MMM-yyyy}",
                parseFormats: ["MM/dd/yyyy"],
                filterable: {
                    ui: "datetimepicker"
                },
                width: "90px",
                attributes: {
                    style: "# if(IS_ACTIVE == false) { #background-color:rgb(230, 126, 34);color:white;#}#"
                }
            },{
                field: "EXAM_END",
                title: "Akhir",
                format      : "{0:dd-MMM-yyyy}",
                parseFormats: ["MM/dd/yyyy"],
                filterable: {
                    ui: "datetimepicker"
                },
                width: "90px",
                attributes: {
                    style: "# if(IS_ACTIVE == false) { #background-color:rgb(230, 126, 34);color:white;#}#"
                }
            }, {
                field: "DESCRIPTION",
                title: "Keterangan",
                width: "150px"
            }, {
                command: MyButton,
                title: "Action",
                width: "180px"
            }
        ],
        dataBinding: function () {
            window.rowNo = (this.dataSource.page() - 1) * this.dataSource.pageSize();

            // if(gp_status){
            //      grid.hideColumn(9);
            // }
        },
        toolbar: [{ template: kendo.template($("#add_btn_kendo").html()) }]
    });

    $.ajax({
        type: 'GET',
        url: $("#urlPath").val() + '/SesiUjian/populatedropdown',
        success: function (data) {
            //console.log(data);
            var certificator = data.Data;
            var location = data.Datacenter;

            $.each(certificator, function (w, y) {
                $("#drp-certificator").append("<option value='" + y.NRP + "' >" + y.NAME + "</option>");
            });

            $.each(location, function (k, v) {
                $("#drp-exam-loc").append("<option value='" + v.PID + "'>" + v.TEST_CENTER_NAME + "</option>");
            });

            $.each(data.Datamodul, function (r, h) {
                //console.log("ID " + h.MODULE_ID + " NAME : " + h.MODULE_NAME);
                $("#drp-modul").append("<option value='" + h.MODULE_ID + "'>" + h.MODULE_NAME + "</option>");
            });

            $.each(data.Datasoal, function (a, b) {
                $("#drp-qutype").append("<option value='" + b.TYPE_CODE + "'>" + b.TYPE_DESC + "</option>");
            });

            $.each(data.jenis_ujn, function (a, b) {
                $("#drp-ujian_type").append("<option value='" + b.JENIS_UJIAN_CODE + "'>" + b.JENIS_UJIAN_DESC + "</option>");
            });
            
            $('#drp-certificator , #drp-exam-loc , #drp-modul , #drp-qutype , #drp-ujian_type').selectpicker('refresh');
        }
    });
}

function grid_time(e) {
    e.preventDefault();
    var tr_data = this.dataItem($(e.currentTarget).closest("tr"));
    //console.log(tr_data);
    $("#event_id").val(tr_data.EVENT_ID);
    //$("#question_type").val(tr_data.QUESTION_TYPE);
    popup_dlg_dua.center().open();
    loadGridWaktu(tr_data.EVENT_ID)
}

$("#btn_cancel").click(function () {
    popup_dlg_dua.center().close();
    //popup_grid.center().close();
});

function grid_update(e) {
    e.preventDefault();
    $('#header_modal').text(' Perbarui data sesi ujian');

    if(datacertArray.length > 0){
        datacertArray.splice(0,datacertArray.length);
    }
    
    add_event = 2;
    var tr_data = this.dataItem($(e.currentTarget).closest("tr"));
    $("#drp-modul").val(tr_data.MODULE_ID).change();
    $("#drp-exam-loc").val(tr_data.TEST_CENTER_ID).change();
    $("#drp-ujian_type").val(tr_data.JENIS_UJIAN_CODE).change();
    evnt_id = tr_data.EVENT_ID;
    var data=tr_data.QUESTION_TYPE;
    var Certificators = tr_data.CERTIFICATOR_ID;

    datacertArray = Certificators.split(",");

    var dataarray=data.split(",");
    $("#drp-qutype").val(dataarray);

    
    $('#sort-desc').val(tr_data.DESCRIPTION);
    $('#long_desc').data("kendoEditor").value(tr_data.LONG_DESCRIPTION);

    $("#starting").data("kendoDatePicker").value(tr_data.EXAM_START);
    $("#end").data("kendoDatePicker").value(tr_data.EXAM_END);
    $("#txt_target").val(tr_data.EXAM_TARGET_MIN);
    $('#drp-certificator').selectpicker('val', datacertArray);

    $('#drp-certificator , #drp-exam-loc , #drp-modul , #drp-qutype ').selectpicker('refresh');

    $('#modal_add_new').modal('show');
}

function grid_delete(e) {
    var text_action = e.target.innerText;

    var tr_data = this.dataItem($(e.currentTarget).closest("tr"));
    //console.log(tr_data);
    Swal({
        title: 'Konfirmasi',
        text: "Anda akan "+ text_action +" sesi ujian ini ?",
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#6ab04c',
        cancelButtonColor: '#eb4d4b',
        confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
        if (result.value) {

            $.ajax({
                type: "POST",
                url: $("#urlPath").val() + "/SesiUjian/SesiUjianAction",
                data: {
                    TYPE: $.trim(text_action),
                    TEST_CENTER_ID: tr_data.TEST_CENTER_ID,
                    CERTIFICATOR_ID: tr_data.CERTIFICATOR_ID,
                    DESCRIPTION: tr_data.DESCRIPTION,
                    LONG_DESCRIPTION: tr_data.LONG_DESCRIPTION,
                    MODULE_ID: tr_data.MODULE_ID,
                    MODULE_NAME: tr_data.MODULE_NAME,
                    EXAM_START: tr_data.EXAM_START,
                    EXAM_END: tr_data.EXAM_END,
                    QUESTION_TYPE: tr_data.QUESTION_TYPE,
                    EVENT_ID : tr_data.EVENT_ID,
                    JENIS_UJIAN_CODE : parseInt(tr_data.JENIS_UJIAN_CODE),
                    EXAM_TARGET_MIN : parseInt(tr_data.EXAM_TARGET_MIN)
                },
                cache: false,
                success: function (data) {
                    Swal(
                        data.MESSAGE_HEADER,
                        data.MESSAGE_BODY,
                        data.TYPE
                    ).then(function () {
                        if (parseInt(data.STATUSCODE) == 1) {
                            $("#gridsesiujian").data("kendoGrid").dataSource.read();
                        }
                    });

                }
            });
        }
    })
}

//Modul GRID Soal Essay
function loadGridWaktu(EVENT_ID) {
    //REFRESH GRID SEBELUM DI LOAD
    if ($("#gridTempt").data().kendoGrid != null) {
        $("#gridTempt").data().kendoGrid.destroy();
        $("#gridTempt").empty();
    }
    //console.log(EVENT_ID)
    //OBJEK GRID
    $("#gridTempt").kendoGrid({
        dataSource: {
            type: "json",
            error: function (e) {
                if (e.errors == true) {
                    var grid_error = $("#gridTempt").data("kendoGrid");
                    grid_error.one("dataBinding", function (e) {
                        e.preventDefault();
                    })
                }
            },
            requestEnd: function (e) {
                if (e.type == "destroy" && e.response.status == false) {
                    this.cancelChanges();
                    var grid = $("#gridTempt").data("kendoGrid");
                }
                if ((e.type == "create" || e.type == "update") && e.response.status == true) {
                    $("#gridTempt").data("kendoGrid").dataSource.read();
                    var grid = $("#gridTempt").data("kendoGrid");
                }
            },

            //FUNGSI LOAD JSON SCRIPT
            transport: {
                //UNTUK MEMANGGIL DATA
                read: {
                    url: $("#urlPath").val() + "/SesiUjian/TemptEditWaktu",
                    contentType: "application/json",
                    data: {
                        EVENT_ID: EVENT_ID
                    },
                    type: "POST",
                    cache: false,
                    success: function (e) {
                        //console.log(e);
                    }
                },
                update: {
                    url: $("#urlPath").val() + "/SesiUjian/EditWaktu",
                    contentType: "application/json",
                    type: "POST",
                    cache: false,
                    complete: function (e) {
                        if (e.responseJSON.status == false) {
                            $.alert({
                                title: 'Update Failed',
                                content: e.responseJSON.message,
                                icon: 'fa fa-exclamation-triangle',
                                theme: 'modern',
                                type: 'red'
                            });
                        }else{
                            $.alert({
                                title: 'Update Success',
                                content: e.responseJSON.message,
                                icon: 'fa fa-check-square',
                                theme: 'modern',
                                type: 'green'
                            });
                        }
                        $("#gridTempt").data("kendoGrid").dataSource.read();
                    }
                },
                //UNTUK MENGIRIMKAN DATA JSON
                parameterMap: function (data, operation) {
                    return kendo.stringify(data);
                }
            },

            pageSize: 15, //JUMLAH BARIS PER-HALAMAN
            serverPaging: true,
            serverFiltering: true,
            serverSorting: true,
            schema: {
                //errors: function (response) {
                //    if (response.status == false) {
                //        alert("Error1: " + response.message);
                //        return true;
                //    } else if (response.status == true) {
                //        alert(response.message);
                //    }
                //    return false;
                //},
                data: "Data",
                total: "Total",
                model: {
                    id: "EVENT_ID",
                    fields: {
                        QUESTION_TYPE: { type: "number", filterable: true, sortable: true, editable: false },
                        TYPE_DESC: { type: "string", filterable: true, sortable: false, editable: false },
                        TIME_EXAM: { type: "number", filterable: true, sortable: true, editable: true },
                        WEIGHT: { type: "number", filterable: true, sortable: true, editable: true }
                    }
                }
            }
        },
        editable: true,
        editable: {
            confirmation: "Anda yakin akan menghapus data ini?",
            mode: "inline"
        },
        resizable: true,
        sortable: true,
        filterable: true,
        pageable: {
            refresh: true,
            buttonCount: 10,
            input: true,
            pageSizes: [10, 100, 1000], //OPSI MENAMPILKAN BARIS PER-HALAMAN
            info: true
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
                    command: ["edit"],
                    title: "<center>Action</center>", width: "60px",
                    attributes: { style: "text-align: center" }
                },
                {
                    field: "TYPE_DESC",
                    title: "Question Type",
                    //template: "#=POSITION_ELLIPSE_DESC#",
                    width: "100px",
                    attributes: { style: "text-align: left" }
                },
                {
                    field: "TIME_EXAM",
                    title: "Time Exam",
                    width: "80px",
                    attributes: { style: "text-align: center" }
                },
                {
                    field: "WEIGHT",
                    title: "Bobot Nilai",
                    width: "80px",
                    attributes: { style: "text-align: center" }
                }

        ],
        dataBinding: function () {
            window.RecNumerEq = (this.dataSource.page() - 1) * this.dataSource.pageSize();
        }
    });
}
