var i_location, i_posisi;
var glob_position_code = null;
var glob_pos_title = null;

$(document).ready(function () {
    $.ajaxSetup({ cache: false });



    $("#btn_show_modal_upload").click(function () {
        document.getElementById("fl_dataready").value = null;
        $(".k-upload-files.k-reset").find("li").remove();
        $('#notification_div').attr("hidden", true);
        $('#modal_upload').modal('toggle');
    });

    $("#knd_drp_positionApp").kendoMultiSelect({
        dataTextField: "POSITION_DESC",
        dataValueField: "POSITION_CODE",
        placeholder: 'Pilih Posisi Jabatan',
        dataSource: {
            type: "json",
            transport: {
                read: {
                    url: $("#urlPath").val() + "/SoalEssay/AjaxReadPosisi",
                    contentType: "application/json",
                    type: "POST",
                    cache: false
                }
            },
            schema: {
                data: "Data",
                total: "Total"
            }
        }
    });

    $("#knd_drp_jenis_ujian").kendoDropDownList({
        dataTextField: "JENIS_UJIAN_DESC",
        dataValueField: "JENIS_UJIAN_CODE",
        optionLabel: "Pilih Jenis Ujian",
        dataSource: SourceExamType,
        change: function (e) {
            var SeletedPos = $("#knd_drp_positionApp").data("kendoMultiSelect").value();
            if (SeletedPos.length == 0) {
                $.alert({
                    title: 'Masih Ada Error',
                    content: 'Pilih dahulu posisi jabatan',
                    type: 'red',
                    animation: 'zoom',
                    draggable: true,
                });

            } else if ($.trim($("#txtLocation").data("kendoDropDownList").value()) !== "") {
                var DISTRIK = $("#txtLocation").data("kendoDropDownList").value().substr(4, 7);
                loadgrid(DISTRIK, SeletedPos.join(), 1);
                $.ajax({
                    type: 'POST',
                    url: $("#urlPath").val() + '/InputRegistrasi/GetEvents',
                    data: {
                        LOCATIONS: DISTRIK,
                        EXAM_TYPE: parseInt($("#knd_drp_jenis_ujian").data("kendoDropDownList").value())
                    },
                    success: function (data) {
                        $('#slc_sesiujian,#slc_poapp option:not(:first)').remove();

                        $.each(data.EVENTS, function (key, value) {
                            $("#slc_sesiujian").append("<option value='" + value.EVENT_ID + "'>" + value.DESCRIPTION + "</option>");
                        });

                        $.each(data.EGI, function (key, value) {
                            $("#slc_egi").append("<option value='" + value.EGI_GENERAL + "'>" + value.EGI_GENERAL + "</option>");
                        });

                        $.each(data.APP, function (key, value) {
                            $("#slc_poapp").append("<option value='" + value.POSITION_CODE + "'>" + value.POSITION_DESC + "</option>");
                        });

                        $('#slc_sesiujian , #slc_poapp, #slc_egi').selectpicker('refresh');
                    }
                });
            }
        }
    });

    $("#txtLocation").kendoDropDownList({
        dataTextField: "TEST_CENTER_NAME",
        dataValueField: "TEST_CENTER_ID",
        optionLabel: "Pilih Tempat Pelaksanaan Ujian",
        filter: "contains",
        dataSource: sourceLocation,
        change: function (e) {// kondisi saat dropdown dipilih
            var SeletedPos = $("#knd_drp_positionApp").data("kendoMultiSelect").value();
            if (!$("#knd_drp_jenis_ujian").data("kendoDropDownList").value()) {
                $.alert({
                    title: 'Parameter Error',
                    content: 'Harap pilih dahulu jenis ujian, data tidak ditampilkan',
                    theme: 'material',
                    type: 'red'
                });
            } else if (SeletedPos.length == 0) {
                $.alert({
                    title: 'Masih Ada Error',
                    content: 'Pilih dahulu posisi jabatan',
                    type: 'red',
                    animation: 'zoom',
                    draggable: true,
                });
            }
            else {
                var dataItem = this.dataItem(e.item);//variabel untuk membaca isi dropdown yang dipilih
                i_location = dataItem.LOCATION; // Mereferensikan isi nilai DIV_CODE dari dropdown ke variabel Div_Code
                //console.log(i_location);
                $.ajax({
                    type: 'POST',
                    url: $("#urlPath").val() + '/InputRegistrasi/GetEvents',
                    data: {
                        LOCATIONS: dataItem.LOCATION,
                        EXAM_TYPE: parseInt($("#knd_drp_jenis_ujian").data("kendoDropDownList").value())
                    },
                    success: function (data) {
                        $('#slc_sesiujian option:not(:first)').remove();

                        $.each(data.EVENTS, function (key, value) {
                            $("#slc_sesiujian").append("<option value='" + value.EVENT_ID + "'>" + value.DESCRIPTION + "</option>");
                        });

                        $.each(data.EGI, function (key, value) {
                            $("#slc_egi").append("<option value='" + value.EGI_GENERAL + "'>" + value.EGI_GENERAL + "</option>");
                        });

                        $.each(data.APP, function (key, value) {
                            $("#slc_poapp").append("<option value='" + value.POSITION_CODE + "'>" + value.POSITION_DESC + "</option>");
                        });

                        $('#slc_sesiujian , #slc_poapp, #slc_egi').selectpicker('refresh');
                    }
                });
                loadgrid(i_location, SeletedPos.join(), 1);
                getposisi(i_location);
            }

        }
    });

    $("#btn_regiter_exam").click(function () {

        var radioValue = $("input[name='rb_selftassesment']:checked").val();
        var message = null;
        $('#modal_registration').modal('toggle');

        if (radioValue == 1 && $('#slc_materibaca').val()) {
            message = "Study For Exam";
            post_registration(message);
            randomString(3, "PAMSJCL")
        } else if (radioValue == 0 && $('#slc_sesiujian').val()) {
            message = "Training / Assesment";
            post_registration(message);
            randomString(5, "PAMAPSD")
        } else {
            $.alert({
                title: 'Masih Ada Error',
                content: 'Periksa kembali apakah anda sudah mengisi data yang sebelumnya tampil',
                type: 'red',
                animation: 'zoom',
                draggable: true,
            });
        }
    });

    $("#btn_refresh1").click(function () {
        var SeletedPos = $("#knd_drp_positionApp").data("kendoMultiSelect").value();
        var DISTRIK = $("#txtLocation").data("kendoDropDownList").value().substr(4, 7);
        if (SeletedPos.length > 0 && DISTRIK) {
            loadgrid(DISTRIK, SeletedPos.join(), 1);
        } else {
            $.alert({
                title: 'Parameter Kurang',
                content: 'Periksa kembali apakah Anda sudah memilih ketiga parameter yang disediakan sistem',
                type: 'red',
                theme: 'material',
                closeIcon: true,
                animation: 'RotateXR',
                closeAnimation: 'bottom',
                draggable: false,
            });
        }
    });

    $("#btn_refresh0").click(function () {
        var DISTRIK = $("#txtLocation").data("kendoDropDownList").value().substr(4, 7);
        if (DISTRIK) {
            loadgrid(DISTRIK, "ERROR", 0);
        } else {
            $.alert({
                title: 'Parameter Kurang',
                content: 'Periksa kembali apakah Anda sudah memilih distrik yang disediakan sistem',
                type: 'red',
                theme: 'material',
                closeIcon: true,
                animation: 'RotateXR',
                closeAnimation: 'bottom',
                draggable: false,
            });
        }
    });

    $('#slc_poapp').on('changed.bs.select', function (e, clickedIndex, newValue, oldValue) {
        var selected = $(e.currentTarget).val();
        $.ajax({
            url: $("#urlPath").val() + "/InputRegistrasi/pbb_MateriAvalaible",
            type: "POST",
            data: {
                POSITION_CODE: selected
            },
            success: function (data) {
                $('#slc_materibaca option:not(:first)').remove();

                $.each(data.BOOK, function (key, value) {
                    $("#slc_materibaca").append("<option value='" + value.HANDBOOK_PID + "'>" + value.FILE_NAME + "</option>");
                });

                $('#slc_materibaca').selectpicker('refresh');
            }
        })
    });

    $('#slc_sesiujian').on('changed.bs.select', function (e, clickedIndex, newValue, oldValue) {
        var QuestionType = $("#knd_drp_jenis_ujian").data("kendoDropDownList").value();
        var selected = $(e.currentTarget).val();

        if (parseInt(QuestionType) == 1) {
            $('#slc_submodul option:not(:first)').remove();
            $('#slc_submodul').val(null);
            if ($(this).val()) {
                $.ajax({
                    url: $("#urlPath").val() + "/InputRegistrasi/GetEGI_byEVENTS",
                    type: "POST",
                    data: {
                        EVENTSID: selected
                    },
                    success: function (response) {
                        console.log(response);
                        $('#slc_egi option:not(:first)').remove();

                        $.each(response.egi_data, function (key, value) {
                            $("#slc_egi").append("<option value='" + value.EGI + "'>" + value.EGI + "</option>");
                        });

                        $('#slc_egi').selectpicker('refresh');
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        console.log("Error Value : " + textStatus, errorThrown);
                    }
                });
            }
        } else {

            $.ajax({
                url: $("#urlPath").val() + "/InputRegistrasi/GetSubMOdul_byEVENTS",
                type: "POST",
                data: {
                    EVENTSID: selected
                },
                success: function (response) {
                    $('#slc_submodul option:not(:first)').remove();
                    $('#slc_egi option:not(:first)').remove();

                    $.each(response.submodul, function (key, value) {
                        $("#slc_submodul").append("<option value='" + value.MODULE_SUB_ID + "'>" + value.MODULE_SUB_NAME + "</option>");
                    });

                    $.each(response.egi_data, function (key, value) {
                        $("#slc_egi").append("<option value='" + value.EGI + "'>" + value.EGI + "</option>");
                    });

                    $('#slc_submodul , #slc_egi').selectpicker('refresh');
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    console.log("Error Value : " + textStatus, errorThrown);
                }
            });
            $('#div_submodul').show(0);
        }
    });

    $('input[type=radio][name=rb_selftassesment]').change(function () {
        if (this.value == 1) {
            $('.div_sesiujian').hide(0);
            $('#div_materibaca').show(50);
            $("#slc_sesiujian , #slc_materibaca , #slc_submodul").removeProp("selected");
            $.ajax({
                url: $("#urlPath").val() + "/InputRegistrasi/pbb_MateriAvalaible",
                type: "POST",
                data: {
                    POSITION_CODE: $('#slc_poapp').val()
                },
                success: function (data) {
                    $('#slc_materibaca option:not(:first)').remove();

                    $.each(data.BOOK, function (key, value) {
                        $("#slc_materibaca").append("<option value='" + value.HANDBOOK_PID + "'>" + value.FILE_NAME + "</option>");
                    });

                    $('#slc_materibaca').selectpicker('refresh');
                }
            });
        }
        else if (this.value == 0) {
            $('#div_materibaca').hide(50);
            $('.div_sesiujian').show(0);
            $('#slc_materibaca').val(null).change();
        }
    });

});

$("#fl_dataready").kendoUpload({
    allowmultiple: false,
    batch: false,
    async: {
        saveUrl: "save",
        autoUpload: false
    },
    upload: uploadFile,
    success: onSuccessUpload,
    error: onErrorUpload
});

var sourceLocation = new kendo.data.DataSource({
    transport: {
        read: {
            url: $("#urlPath").val() + "/InputRegistrasi/dropdownLocation",
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

var SourceExamType = new kendo.data.DataSource({
    transport: {
        read: {
            url: $("#urlPath").val() + "/InputRegistrasi/dropdownExamType",
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

function post_registration(message) {
    $.confirm({
        title: 'Konfirmasi Registrasi',
        content: 'Anda akan meregistrasikan karyawan tersebut untuk ' + message,
        escapeKey: 'cancelAction',
        animation: 'RotateYR',
        theme: 'material',
        buttons: {
            confirm: {
                btnClass: 'btn-blue',
                text: 'Oke',
                action: function () {
                    var links = null;

                    if ($('#slc_materibaca').val()) {
                        links = $('#slc_materibaca').val();
                    }

                    var radioValue = $("input[name='rb_selftassesment']:checked").val();
                    if (radioValue == 1 && $('#slc_materibaca').val()) {
                        ExctExamRegistration(links);
                    } else if (radioValue == 0 && $('#slc_sesiujian').val()) {
                        ExctExamRegistration(links);
                    } else {
                        $.alert({
                            title: 'Masih Ada Error',
                            content: 'Periksa kembali apakah anda sudah mengisi data yang sebelumnya tampil',
                            type: 'red',
                            theme: 'modern',
                            closeIcon: true,
                            animation: 'zoom',
                            closeAnimation: 'bottom',
                            draggable: true,
                        });
                    }
                }
            },
            cancelAction: {
                text: 'Batal',
                action: function () {
                }
            }
        }
    });
}

function clickDownload() {
    window.location.href = $("#urlPath").val() + "/FileUpload/Template/Template Data Siap Diregistrasikan.xlsx";
}

function onSuccessUpload(e) {
    var respon = jQuery.parseJSON(e.XMLHttpRequest.responseText);
    $('#notification_div').attr("hidden", false);
    $("#notification_div").attr('class', 'alert alert-success');
    $('#lbl_status_upload').html(respon.remarks);
}

function onErrorUpload(e) {
    var respon = jQuery.parseJSON(e.XMLHttpRequest.responseText);
    $('#notification_div').attr("hidden", false);
    $("#notification_div").attr('class', 'alert alert-danger');
    $('#lbl_status_upload').html(respon.remarks);
}


function ExctExamRegistration(links) {

    // var submodul = $('#slc_submodul').val();
    // var Distrik = $('#txt_distrik').val();
    // var EGI = $('#slc_egi').val();
    // var Events = $('#slc_sesiujian').val();
    // var Golongan = $('#txt_golongan').val();
    // var PosAPP = $('#slc_poapp').val();
    // var MediaUjian = $("input[name='rb_mediaujian']:checked").val();
    //console.log(MediaUjian)
    //console.log("submodul = "+submodul);
    //console.log("distrik = "+Distrik);
    //console.log("EVents = "+Events);
    //console.log("GOlongan = "+Golongan);
    //console.log("Pos APP = "+PosAPP);

    $('body').loadingModal({
        position: 'auto',
        text: '',
        color: '#fff',
        opacity: '0.7',
        backgroundColor: 'rgb(0,0,0)',
        animation: 'rotatingPlane' // Pilihan : rotatingPlane , wave , wanderingCubes, spinner, chasingDots, threeBounce, circle, cubeGrid, fadingCircle, foldingCube
    });

    $.ajax({
        url: $("#urlPath").val() + "/InputRegistrasi/pb_RegistrationPeople",
        type: "POST",
        data: {
            vREGISTRATION_ID: $('#txt_registrationid').val(),
            vSTUDENT_ID: $('#txt_nrp').val(),
            vDSTRCT_CODE: $('#txt_distrik').val(),
            vDEPARTMENT: $('#txt_departement').val(),
            vPOSITION_CODE: glob_position_code,
            vPOSITION_DESC: glob_pos_title,
            vIS_SELF_ASSESMENT: !!parseInt($("input[name='rb_selftassesment']:checked").val()),
            vHANDBOOK_PID: links,
            vEVENT_ID: $('#slc_sesiujian').val(),
            vPOSITION_APP: $('#slc_poapp').val(),
            vREGISTRATION_ID: $('#txt_registrationid').val(),
            vGOLONGAN: $('#txt_golongan').val(),
            vEGI: $('#slc_egi').val(),
            vSUB_MODULE_ID: $('#slc_submodul').val(),
            vMEDIA: parseInt($("input[name='rb_mediaujian']:checked").val())
        },
        success: function (response) {
            $('body').loadingModal('hide');
            $('body').loadingModal('destroy');
            $.alert({
                title: response.header,
                content: response.body + "<br> " + response.Err,
                type: response.type,
                animation: 'zoom',
                draggable: true,
            });
        },
        error: function (jqXHR, textStatus, errorThrown) {
            $('body').loadingModal('hide');
            $('body').loadingModal('destroy');
            $.alert({
                title: "Koneksi Error",
                content: "Perikasa Koneksi Anda !!<br>" + errorThrown + "<br>" + textStatus,
                type: "red",
                animation: 'zoom',
                draggable: false,
            });
        }
    });
}

function getposisi(s_location) {
    $.ajax({
        url: $("#urlPath").val() + "/InputRegistrasi/readPosisi?s_location=" + s_location,
        dataType: "json",
        type: "POST",
        contentType: "application/JSON",
        success: function (data) {
            i_posisi = null;
            if (data.posisi) {
                i_posisi = data.posisi.DSTRCT_CODE;
                getModule(data.posisi.POSITION_CODE);
            } else {
                $("#grid").data("kendoGrid").destroy();
                $.alert({
                    title: 'Mapping Error',
                    content: 'Posisi app belum di mapping di DISTRIK : ' + s_location,
                    theme: 'material',
                    type: 'red'
                });
            }
        }
    });
}

function getModule(s_posisi) {

    $('#id_module').removeAttr('disabled');

    $("#id_module").kendoDropDownList({
        dataTextField: "MODULE_NAME",
        dataValueField: "MODULE_PID",
        optionLabel: "Pilih",
        dataSource: {
            type: "json",
            transport: {
                read: {
                    url: $("#urlPath").val() + "/InputRegistrasi/dropDownModule?s_posisi=" + s_posisi,
                    dataType: "json",
                    type: "POST",
                    cache: false
                }
            },
            schema: {
                data: "Data",
                total: "Total"
            }
        },
        change: function (e) {

            var dataItem = this.dataItem(e.item);
            document.getElementById("id_egi").readOnly = false;
            getEgi(dataItem.MODULE_PID);

        }
    });

}

function getEgi(s_module_id) {

    $('#id_egi').removeAttr('disabled');

    $("#id_egi").kendoDropDownList({
        dataTextField: "EGI_GENERAL",
        dataValueField: "EGI_GENERAL",
        optionLabel: "Pilih",
        dataSource: {
            type: "json",
            transport: {
                read: {
                    url: $("#urlPath").val() + "/InputRegistrasi/dropDownEgi?s_module_id=" + s_module_id,
                    dataType: "json",
                    type: "POST",
                    cache: false
                }
            },
            schema: {
                data: "Data",
                total: "Total"
            }
        },
        change: function (e) {

        }
    });
}

function loadgrid(i_location, i_position, i_type) {
    var url_get = null;
    if ($("#grid").data().kendoGrid != null) {
        $("#grid").data().kendoGrid.destroy();
        $("#grid").empty();
    }

    $("#grid").kendoGrid({
        dataSource: {
            type: "json",
            transport: {
                read: {
                    url: $("#urlPath").val() + "/InputRegistrasi/readRegistration",
                    contentType: "application/json",
                    data: {
                        i_location: i_location,
                        i_positionApp: i_position,
                        i_type: parseInt(i_type)
                    },
                    dataType: "json",
                    type: "POST",
                    cache: false,
                },
                parameterMap: function (data, operation) {
                    return kendo.stringify(data);
                }
            },
            pageSize: 25,
            serverPaging: true,
            serverFiltering: true,
            serverSorting: true,
            schema: {
                data: "Data",
                total: "Total",
                model: {
                    id: "STUDENT_ID",
                    fields: {
                        STUDENT_ID: { type: "string", filterable: true, sortable: true, editable: false },
                        STUDENT_NAME: { type: "string", filterable: true, sortable: true, editable: false },
                        DSTRCT_CODE: { type: "string", filterable: true, sortable: true, editable: false },
                        DEPARTMENT: { type: "string", filterable: true, sortable: true, editable: false },
                        PERIOD: { type: "string", filterable: true, sortable: true, editable: false },
                        GOLONGAN: { type: "string", filterable: true, sortable: true, editable: false },
                        PLAN_DATE: { type: "string", filterable: true, sortable: true, editable: false },
                        REGISTRATION_ID: { type: "string", filterable: true, sortable: true, editable: false },
                        IS_ENABLE: { type: "bool", filterable: true, sortable: true, editable: false },
                        BIRTH_DATE: { type: "string", filterable: true, sortable: true, editable: false },
                        RELEASE_BY: { type: "string", filterable: true, sortable: true, editable: false },
                        RELEASE_DATE: { type: "string", filterable: true, sortable: true, editable: false },
                        STATUS_READY_EXAM: { type: "string", filterable: true, sortable: true, editable: false },
                        POS_TITLE: { type: "string", filterable: true, sortable: true, editable: false },
                        POSITION_ID: { type: "string", filterable: true, sortable: true, editable: false },
                        POSITION_CODE: { type: "string", filterable: true, sortable: true, editable: false }
                    }
                }
            },

        },
        editable: {
            //mode: "popup"
        },
        resizable: true,
        sortable: true,
        filterable: true,
        pageable: {
            refresh: true,
            buttonCount: 15,
            input: true,
            pageSizes: [10, 50, 100],
            info: true
        },
        //toolbar: ["create"],
        columns: [
            {
                title: "No",
                width: "30px",
                template: "#= ++RecnumberEq #",

                filterable: false,
                sortable: false,
                editable: false,
                attributes: { style: "text-align:center" }
            },
            {
                command: [{
                    text: "Register",
                    click: click_register
                },
                { name: "release-data", text: $("#lbl_release").html(), click: click_release }
                //{
                //    text: "Release",
                //    name: "Release",
                //    //template: '<button id="btn_release" name="btn_release" class="k-button"  style="width:20px" onClick="click_release()" >Release</button>'
                //    click: click_release
                //}
                ],
                title: "Aksi",
                width: "100px",
                headerAttributes: { style: "text-align: center" },
                attributes: { style: "text-align: center" }
            },
            {
                field: "STUDENT_ID",
                title: "NRP",
                width: "90px",
                locked: true,
                lockable: false,
                headerAttributes: { style: "text-align: center" },
                attributes: { style: "text-align: center" }
            },
            {
                field: "STUDENT_NAME",
                title: "Nama",
                width: "170px",
                headerAttributes: { style: "text-align: center" },
                //attributes: { style: "text-align: center" }
            },
            {
                field: "DSTRCT_CODE",
                title: "Distrik",
                width: "100px",
                headerAttributes: { style: "text-align: center" },
                attributes: { style: "text-align: center" }
            },
            {
                field: "DEPARTMENT",
                title: "Departemen",
                width: "170px",
                headerAttributes: { style: "text-align: center" }
            },
            {
                field: "POS_TITLE",
                title: "Jabatan",
                width: "140px",
                attributes: { style: "text-align: left" }
            },
            {
                field: "PERIOD",
                title: "Periode",
                width: "100px",
                headerAttributes: { style: "text-align: center" },
                attributes: { style: "text-align: center" }
            },
            {
                field: "GOLONGAN",
                title: "GOL",
                width: "80px",
                headerAttributes: { style: "text-align: center" },
                attributes: { style: "text-align: center" }
            },
            {
                field: "PLAN_DATE",
                title: "Planing",
                width: "100px",
                format: "{0:MM-dd-yyyy}",
                headerAttributes: { style: "text-align: center" },
                attributes: { style: "text-align: center" }
            }
        ],
        dataBinding: function () {
            window.RecnumberEq = (this.dataSource.page() - 1) * this.dataSource.pageSize();
        },
        dataBound: function (e) {

            var grid = $('#grid');
            var ds = e.sender._data;

            for (var i = 0; i < ds.length; i++) {

                var currentRegist = ds[i].REGISTRATION_ID;
                var releaseFlag = ds[i].RELEASE_BY;

                var currentUid = ds[i].uid;
                var currentRow = grid.find("tr[data-uid='" + currentUid + "']");

                if (releaseFlag != null) {
                    $(currentRow).find('.k-grid-release-data').attr('style', 'background-color:rgba(0,0,0,0.3)');
                    $(currentRow).find('.k-grid-release-data').prop('disabled', true);
                } else if (currentRegist == null) {
                    //$(currentRow).find('.k-grid-destroy-data').hide();
                    $(currentRow).find('.k-grid-release-data').hide();
                } else {
                    //$(currentRow).find('.k-grid-destroy-data').show();
                    $(currentRow).find('.k-grid-release-data').show();
                }
            }
        }
    });
}

function uploadFile(e) {
    var files = e.files;
    $.each(files, function () {
        $("#fl_dataready").data("kendoUpload").options.async.saveUrl = $("#urlPath").val() + '/InputRegistrasi/Upload';
    });
}

function click_release(e) {

    e.preventDefault();
    var dataItem = this.dataItem($(e.currentTarget).closest("tr"));

    if (confirm("Data akan direlease. Anda Yakin?")) {
        $.ajax({
            url: $("#urlPath").val() + "/InputRegistrasi/releaseRegistrasi?s_studentId=" + dataItem.STUDENT_ID + "&s_plandate=" + dataItem.PLAN_DATE,
            dataType: "json",
            type: "POST",
            contentType: "application/json",
            success: function (data) {
                $.alert({
                    title: 'INFORMASI',
                    content: data.remarks,
                    type: 'blue',
                    animation: 'zoom',
                    draggable: true,
                });
            }
        });
        //$("#grid").data("kendoGrid").dataSource.read();
        $('#grid').data('kendoGrid').refresh();
    }
}

function click_register(e) {

    $('#modal_registration').modal('toggle');
    //==========================DATE========================
    var d = new Date();
    var curr_date = d.getDate();
    var curr_month = d.getMonth();
    var curr_year = d.getFullYear();
    //========================================================
    $('#slc_sesiujian').selectpicker('val', null);

    e.preventDefault();
    dataItem = this.dataItem($(e.currentTarget).closest("tr"))
    ////console.log(dataItem);
    glob_position_code = dataItem.POSITION_ID;
    glob_pos_title = dataItem.POS_TITLE;

    var QuestionType = $("#knd_drp_jenis_ujian").data("kendoDropDownList").value();
    var date_format = curr_date.toString() + curr_month.toString(); //+ curr_year.toString();

    if (parseInt(QuestionType) == 1) {
        $("#txt_registrationid").val((dataItem.STUDENT_ID).replace(/\s/g, '').slice(-4) + date_format + randomString(3, "PAMSOCL").toString());
        $('#div_submodul').hide(0);
        $('#slc_submodul option:not(:first)').remove();
        $('#slc_submodul').val(null);
    } else {
        $('#div_submodul').show(0);
        $("#txt_registrationid").val((dataItem.STUDENT_ID).replace(/\s/g, '') + date_format + randomString(5, "PAMSOCL").toString());
    }

    $("#txt_nrp").val(dataItem.STUDENT_ID);
    $("#txt_name").val(dataItem.STUDENT_NAME);
    $("#txt_distrik").val(dataItem.DSTRCT_CODE);
    $("#txt_departement").val(dataItem.DEPARTMENT);
    $("#txt_golongan").val(dataItem.GOLONGAN);
    $("#txt_plandate").val(convert(dataItem.PLAN_DATE));
    $("#txt_postitle").val(dataItem.POS_TITLE);
    $('#slc_poapp').val(dataItem.POSITION_CODE).change();
    $("#id_posisi").val(i_posisi);
    $("#id_module").val();
    $("#id_egi").val();

    $("#txt_birtday").val(dataItem.BIRTH_DATE);
}

function convert(str) {
    var date = new Date(str),
        mnth = ("0" + (date.getMonth() + 1)).slice(-2),
        day = ("0" + date.getDate()).slice(-2);
    return [day, mnth, date.getFullYear()].join("-");
}

function clear_wnd_register() {

    $("#id_studentId").val('');
    $("#id_studentName").val('');
    $("#id_distrik").val('');
    $("#id_departemen").val('');
    $("#id_golongan").val('');
    $("#id_planDate").val('');

    $("#id_posisi").val('');
    $("#id_module").val('');
    $("#id_egi").val('');

    $("#id_certificator").val('');
    $("#id_registId").val('');
    $("#id_birthDate").val('');
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