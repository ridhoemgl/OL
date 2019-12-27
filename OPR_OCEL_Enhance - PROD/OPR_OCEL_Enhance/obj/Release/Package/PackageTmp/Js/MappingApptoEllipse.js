$.ajaxSetup({ cache: false });
var session_tempt;

$.ajax({
    type: 'GET',
    url: $("#urlPath").val() +'/PosisiApptoEllipse/dropdownAppTmp',
    cache: false,
    success: function (data) {
        $.each(data.APP, function (key, value) {
            $("#slct_posapp").append("<option value='" + value.POSITION_CODE + "'>" + value.POSITION_DESC + "</option>");
        });


        $('#slct_posapp').selectpicker('refresh');
    }
});

$('#slct_poselipse').on('changed.bs.select', function (e, clickedIndex, newValue, oldValue){
    //var selected = $(e.currentTarget).text();
    $('#slct_poselipse :selected').each(function(i, sel){ 
        if ($(sel).val() === "ALL") {
            $('#slct_poselipse option').not(':first').prop('selected', true);
            $('#slct_poselipse option').eq(1).prop('selected', false);
            $('#slct_poselipse').selectpicker('refresh');
        }
    });
});

$('#S_DISTRIK').on('changed.bs.select', function (e, clickedIndex, newValue, oldValue) {
    var selected = $(e.currentTarget).val();
    $('#slct_poselipse').children('option:not(:first)').remove();

    $.ajax({
        type: 'POST',
        data : {ID_POSITION : selected},
        url: $("#urlPath").val() +'/PosisiApptoEllipse/PosisitionDropdown',
        success: function(data) {
            var data_olah = data.ELIP;

            if (data_olah.length == 0) {
                $("#slct_poselipse").append("<option disabled selected>Tidak ditemukan</option>");
                $('#btn_save_tempt').attr("disabled", true);
            }else{
                $("#slct_poselipse").append("<option value='ALL'>ALL</option>");
                for (var i = 0; i < data_olah.length; i++) {
                    $("#slct_poselipse").append("<option value='" + data_olah[i].GROUP_OCCUP_TYPE + "'>" + data_olah[i].POS_TITLE + "</option>");
                }
                $('#btn_save_tempt').removeAttr("disabled");
            }
            
            $('#slct_poselipse').selectpicker('refresh');
        }
    });

    
});

$( "#btn_save_tempt" ).click(function() {

    if ($('#S_DISTRIK').val()) {
        var district = $('#S_DISTRIK').val();
        var pelip = $('#slct_poselipse').val().join();
        var pelipdes = $('#slct_poselipse option:selected').toArray().map(item => item.text).join();
        var sapp = $('#slct_posapp').val();

        $.ajax({
            type: 'POST',
            url: $("#urlPath").val()+'/PosisiApptoEllipse/insertToTMPdata',
            cache: false,
            data: {
                DSTRCT_CODE: district,
                SESS_CODE : session_tempt,
                POSITION_ELLIPSE : pelip,
                POSITION_ELLIPSE_DESC : pelipdes,
                POSITION_CODE : sapp
            },
            success: function(data) {
                $("#gridTempt").data("kendoGrid").dataSource.read();
                $('#modal_add_pos').modal('hide');
            }
        });

    }else{
        $('#modal_add_pos').modal('hide');
        Swal({
            type: 'error',
            title: 'Ada Kesalahan',
            text: 'Pilih Distrik Dahulu'
        });
    }
});

function add_new_mapp() {
    $('#div-card').show();
    $('#gridApptoEllipse').hide()
    $.ajax({
        type: 'GET',
        url: $("#urlPath").val() +'/PosisiApptoEllipse/cusdropdownDistrik',
        success: function (data) {
            $.each(data.Data, function (key, value) {
                $("#S_DISTRIK").append("<option value='" + value.DSTRCT_CODE + "'>" + value.DSTRCT_CODE + "</option>");
            });
            $('.selectpicker').selectpicker('refresh');
        }
    });

    session_tempt = randomString(10, 'OCELENHANCEPAMA');

    if ($("#gridTempt").data().kendoGrid != null) {
        $("#gridTempt").data().kendoGrid.destroy();
        $("#gridTempt").empty();
    }

    $("#gridTempt").show();
    $("#gridTempt").kendoGrid({
        dataSource: {
            type: "json",
            transport: {
                read: {
                    url: $("#urlPath").val() + "/PosisiApptoEllipse/TemptreadApptoEllipse",
                    contentType: "application/json",
                    data: {
                        s_session: session_tempt,
                    },
                    type: "POST",
                    cache: false,
                },

                parameterMap: function (data, operation) {
                    return kendo.stringify(data);
                }
            },
            pageSize: 15,
            serverPaging: true,
            serverFiltering: true,
            serverSorting: true,
            schema: {
                data: "Data",
                total: "Total",
                model: {
                    id: "PID_PE",
                    fields: { //semua field tabel/vw dari db
                        SESS_CODE: { type: "string", filterable: true, sortable: true, editable: true },
                        POSITION_ELLIPSE: { type: "string", filterable: true, sortable: true, editable: true },
                        POSITION_CODE: { type: "string", filterable: true, sortable: true, editable: true },
                        POSITION_DESC: { type: "string", filterable: true, sortable: true, editable: true },
                        POSITION_ELLIPSE_DESC: { type: "string", filterable: true, sortable: true, editable: true }

                    }
                }
            }
        },
        editable: {
            mode: "inline"
        },
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
        toolbar: [{ template: kendo.template($("#tmb_posisi").html()) }],
        //excel: {
        //    fileName: "Master_ApptoEllipses.xlsx",
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
                command: [{
                    name: "delete-data",
                    text: "Hapus",
                    click: delete_tempt_data
                }],
                title: "<center>Action</center>", width: "40px",
                attributes: { style: "text-align: center" }
            },
            {
                field: "POSITION_ELLIPSE",
                title: "Posisi di data Ellipse",
                template: "#=POSITION_ELLIPSE_DESC#",
                width: "150px",
                attributes: { style: "text-align: left" }
            },
            {
                field: "POSITION_CODE",
                title: "Posisi di Aplikasi ini",
                template: "#=POSITION_DESC#",
                width: "150px",
                attributes: { style: "text-align: left" }
            },

        ],

        dataBinding: function () {
            window.RecNumerEq = (this.dataSource.page() - 1) * this.dataSource.pageSize();
        }
    });
}

$("#btn-finally-sumit").click(function () {
    Swal({
        title: 'KONFIRMASI',
        text: "Anda akan menambahkan data mapping baru ?",
        type: 'info',
        showCancelButton: true,
        confirmButtonColor: '#3498db',
        cancelButtonColor: '#e74c3c',
        confirmButtonText: 'Ya'
    }).then((result) => {
        if (result.value) {
            $.ajax({
        url: $("#urlPath").val() +"/PosisiApptoEllipse/insertAllTempt",
            method:"POST",
            data: {SESS_CODE : session_tempt},
            success:function(response) {
                if (response === "True"){
                    $('#gridApptoEllipse').show(10 ,function () {
                        
                        $("#gridApptoEllipse").data("kendoGrid").dataSource.read();

                        $('#div-card').hide();
                        $('#gridTempt').hide();
                    });
                }else if(respone === 'False'){
                    Swal({
                        type: 'error',
                        title: 'Oops...',
                        text: 'Proses simpan gagal karena masalah database!!'
                    })
                }
            },
            error:function(e){
                console.log(e);
            }

        });
        }
    })
});



$("#btn-finally-cancel").click(function () {
    Swal({
        title: 'Are you sure?',
        text: "Anda akan kembali ke menu sebelumnya",
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Ok'
    }).then((result) => {
        if (result.value) {

        var request = $.ajax({
            url: $("#urlPath").val() + "/PosisiApptoEllipse/cancelSubmit",
            type: "POST",
            data: {SESS_CODE : session_tempt}
        });

request.done(function(msg) {
            if (msg == 'True'){
                $("#gridTempt").data("kendoGrid").dataSource.read();
                $('#gridApptoEllipse').show(10 ,function () {
                    $('#div-card').hide();
                    $('#gridTempt').hide();
                });
            }
        });

        request.fail(function(jqXHR, textStatus) {
            console.log( "Request failed: " + textStatus );
        });
    }
    });
});


function delete_tempt_data(e){
    e.preventDefault();

    var data = this.dataItem($(e.currentTarget).closest("tr"));
    
    $.ajax({
        type: 'POST',
        url: $("#urlPath").val() +'/PosisiApptoEllipse/deletetempt',
        cache: false,
        data: {
            SESS_CODE: data.SESS_CODE,
            POSITION_ELLIPSE_DESC : data.POSITION_ELLIPSE_DESC
        },
        success: function(data) {
            $("#gridTempt").data("kendoGrid").dataSource.read();
        }
    });
}

function randomString(len, charSet) {
    charSet = charSet || 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var randomString = '';
    for (var i = 0; i < len; i++) {
        var randomPoz = Math.floor(Math.random() * charSet.length);
        randomString += charSet.substring(randomPoz, randomPoz + 1);
    }
    return randomString;
}

// --- Load Grid  --------------------------------------------------------------------------
function loadGrid() {

    $("#gridApptoEllipse").kendoGrid({
        dataSource: {
            type: "json",
            transport: {
                read: {
                    url: $("#urlPath").val() + "/PosisiApptoEllipse/readApptoEllipse",
                    contentType: "application/json",
                    type: "POST",
                    cache: false,
                },
                create: {
                    url: $("#urlPath").val() + "/PosisiApptoEllipse/createApptoEllipse",
                    contentType: "application/json",
                    type: "POST",
                    dataType: "json",
                    complete: function (e) {
                        if (e.responseJSON.status == true) {
                            alert(e.responseJSON.remarks);
                        } else {
                            alert(e.responseJSON.remarks);
                        }
                        $("#gridApptoEllipse").data("kendoGrid").dataSource.read();
                    }
                },
                update: {
                    url: $("#urlPath").val() + "/PosisiApptoEllipse/updateApptoEllipse",
                    contentType: "application/json",
                    type: "POST",
                    cache: false,
                    complete: function (e) {
                        if (e.responseJSON.status == false) {
                            alert(e.responseJSON.remark);
                        }
                        $("#gridApptoEllipse").data("kendoGrid").dataSource.read();
                        alert(e.responseJSON.remarks);
                    }
                },
                destroy: {
                    url: $("#urlPath").val() + "/PosisiApptoEllipse/deleteApptoEllipse",
                    contentType: "application/json",
                    type: "POST",
                    cache: false,
                    complete: function (e) {
                        if (e.responseJSON.status == false) {
                            Swal(
                              'FAILED',
                              e.responseJSON.remarks,
                              'error'
                            )
                        }else{
                            Swal(
                              'SUKSES',
                              e.responseJSON.remarks,
                              'success'
                            )
                        }
                        $("#gridApptoEllipse").data("kendoGrid").dataSource.read();
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
                    id: "PID_PE",
                    fields: { //semua field tabel/vw dari db
                        PID_PE: { type: "string", filterable: true, sortable: true, editable: false },
                        POSITION_ELLIPSE: { type: "string", filterable: true, sortable: true, editable: false },
                        POS_TITLE: { type: "string", filterable: true, sortable: true, editable: true },
                        DSTRCT_CODE: { type: "string", filterable: true, sortable: true, editable: true },
                        POSITION_DESC: { type: "string", filterable: true, sortable: true, editable: false },
                        POSITION_CODE: { type: "string", filterable: true, sortable: true, editable: true },
                        CREATE_DATE: { type: "date", filterable: true, sortable: true, editable: true },
                        CREATE_BY: { type: "string", filterable: true, sortable: true, editable: true },
                        MODIF_DATE: { type: "date", filterable: true, sortable: true, editable: true },
                        MODIF_BY: { type: "string", filterable: true, sortable: true, editable: true },

                    }
                }
            }
        },
        editable: {
            mode: "inline"
        },
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
        toolbar: [{ template: kendo.template($("#template").html()) }],
        //excel: {
        //    fileName: "Master_ApptoEllipses.xlsx",
        //    allPages: true
        //},
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
                command: ["edit", "destroy"], title: "<center>Action</center>", width: "90px"
            },
            {
                field: "DSTRCT_CODE",
                title: "Distrik",
                width: "100px",
                editor: DistrikDropdownEditor,
                template: "#=DSTRCT_CODE#",
                attributes: { style: "text-align: center" }
            },
            {
                field: "POSITION_ELLIPSE",
                title: "Posisi jabatan di Ellipse",
                template: "#=POSITION_ELLIPSE_DESC#",
                width: "200px",
                attributes: { style: "text-align: left" }
            },
            {
                field: "POSITION_CODE",
                title: "Posisi di Aplikasi ini",
                template: "#=POSITION_DESC#",
                editor: PositionAppDropdownEditor,
                width: "100px",
                attributes: { style: "text-align: left" }
            },

        ],

        dataBinding: function () {
            window.RecNumerEq = (this.dataSource.page() - 1) * this.dataSource.pageSize();
        }
    });
}
var dstrik = null;
var DistrikDataSource = new kendo.data.DataSource({
    transport: {
        read: {
            url: $("#urlPath").val() + "/PosisiApptoEllipse/dropdownDistrik",
            dataType: "json",
            type: "POST",
            cache: false,
            //complete: function (data) {
            //    PositionEllipsDataSource.filter({ field: "DSTRCT_CODE", oprator: "eq", value: data.responseJSON.Data[0].DSTRCT_CODE });
            //}
        }
    },
    schema: {
        data: "Data",
        total: "Total",
    }
    

});

var PositionAppDataSource = new kendo.data.DataSource({
    transport: {
        read: {
            url: $("#urlPath").val() + "/PosisiApptoEllipse/dropdownPositionApp",
            dataType: "json",
            type: "POST",
            cache: false
        }
    },
    schema: {
        data: "Data",
        total: "Total",
    }

});

var PositionEllipsDataSource = new kendo.data.DataSource({
    transport: {
        read: {
            url: $("#urlPath").val() + "/PosisiApptoEllipse/dropdownPositionEllipse",
            dataType: "json",
            type: "POST",
            cache: false
        }
    },
    schema: {
        data: "Data",
        total: "Total",
    }

});


function add_new_posisi() {


    if (!$('#S_DISTRIK').val()) {
        Swal(
            'Kesalahan',
            'silahkan pilih distrik dahulu',
            'error'
        );
    }else{
        $('#modal_add_pos').modal({
            show: true
        });
    }
}

function DistrikDropdownEditor(container, options) {
    var model = options.model;
    $('<input required data-text-field="DSTRCT_CODE" data-value-field="DSTRCT_CODE" data-bind="value:' + options.field + '" />').appendTo(container).kendoDropDownList({
        autoBind: false,
        filter: "contains",
        dataSource: DistrikDataSource,
        dataTextField: "DSTRCT_CODE",
        dataValueField: "DSTRCT_CODE",
        optionLabel: "Pilih",
        select: function (e) {
            var dataItem = this.dataItem(e.item.index());
            PositionEllipsDataSource.filter({ field: "DSTRCT_CODE", oprator: "eq", value: dataItem.DSTRCT_CODE });
        }
    }).data("kendoDropDownList");
} 

function PositionAppDropdownEditor(container, options) {
    var model = options.model;
    $('<input required data-text-field="POSITION_DESC" data-value-field="POSITION_CODE" data-bind="value:' + options.field + '" />').appendTo(container).kendoDropDownList({
        autoBind: false,
        dataSource: PositionAppDataSource,
        dataTextField: "POSITION_DESC",
        dataValueField: "POSITION_CODE",
        optionLabel: "Pilih"
    }).data("kendoDropDownList");
}

$(document).ready(function () {
    loadGrid();
});