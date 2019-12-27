
var i_moduleId, i_posisiId, i_egiID;

var wnd_editor = $("#wnd_editor").kendoWindow({
    modal: true,
    visible: false,
    draggable: true,
    scrollable: true,
    width: "800px",
    actions: ["Close"],
    //close: clearEditor(),
}).data("kendoWindow");

var PositionDataSource = new kendo.data.DataSource({
    transport: {
        read: {
            url: $("#urlPath").val() + "/MasterDistribusiSoal/dropdownPosition",
            dataType: "json",
            type: "POST",
            ache: false
        }
    },
    schema: {
        data: "Data",
        total: "Total",
    }

});

var ModulDataSource = new kendo.data.DataSource({
    transport: {
        read: {
            url: $("#urlPath").val() + "/MasterDistribusiSoal/dropdownModul",
            dataType: "json",
            type: "POST",
            ache: false
        }
    },
    schema: {
        data: "Data",
        total: "Total",
    }

});

var EGIDataSource = new kendo.data.DataSource({
    transport: {
        read: {
            url: $("#urlPath").val() + "/MasterDistribusiSoal/dropdownEGI",
            dataType: "json",
            type: "POST",
            ache: false
        }
    },
    schema: {
        data: "Data",
        total: "Total",
    }

});

var SubModuleSource = new kendo.data.DataSource({
    transport: {
        read: {
            url: $("#urlPath").val() + "/MasterDistribusiSoal/dropdownSubModule",
            dataType: "json",
            type: "POST",
            ache: false
        }
    },
    schema: {
        data: "Data",
        total: "Total",
    }

});

$("#btn_save").click(function () {

    var status = null;

    if ($('#id_status').is(':checked')) {
        status = "true";
    } else {
        status = "false";
    }

    var i_cls_data = {
        PID_CM: $("#txt_pid").val()
        , _P0: $("#txt_p0").val()
        , _P1: $("#txt_p1").val()
        , _P2: $("#txt_p2").val()
        , _P3: $("#txt_p3").val()
        , _P4: $("#txt_p4").val()
        , _P5: $("#txt_p5").val()
        , _P6: $("#txt_p6").val()
        , _P7: $("#txt_p7").val()
        , _P8: $("#txt_p8").val()
        , _P9: $("#txt_p9").val()
        , _3C: $("#txt_3c").val()
        , _3D: $("#txt_3d").val()
        , _3E: $("#txt_3e").val()
        , _3F: $("#txt_3f").val()
        , _4A: $("#txt_4a").val()
        , _4B: $("#txt_4b").val()
        , _4C: $("#txt_4c").val()
        , _4D: $("#txt_4d").val()
        , _4E: $("#txt_4e").val()
        , _4F: $("#txt_4f").val()
        , ISACTIVE: status
    }

    $.ajax({
        url: $("#urlPath").val() + "/MasterDistribusiSoal/AjaxUpdate",
        dataType: "json",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify({ S_TBL_T_COMPETENCY_MATRIX: i_cls_data }),
        success: function (data) {
            alert(data.remarks);
            $("#wnd_editor").data("kendoWindow").close();
            $("#gridDistribusiSoal").data("kendoGrid").dataSource.read();
            $('#gridDistribusiSoal').data('kendoGrid').refresh();
        }
    });

});

$("#btn_cancel").click(function () {
    clearEditor();
    wnd_editor.close();
});

$("#id_status").on('change', function () {
    if ($(this).is(':checked')) {
        $(this).attr('value',true);
    } else {
        $(this).attr('value',false);
    }
});


function loadGrid(s_moduleId, s_posisiId, s_egiID) {

    //REFRESH GRID SEBELUM DI LOAD
    if ($("#gridDistribusiSoal").data().kendoGrid != null) {
        $("#gridDistribusiSoal").data().kendoGrid.destroy();
        $("#gridDistribusiSoal").empty();
    }

    get_dropdownsub($("#txtModule").data("kendoDropDownList").value());

    $("#gridDistribusiSoal").kendoGrid({
        dataSource: {
            type: "json",
            transport: {
                read: {
                    url: $("#urlPath").val() + "/MasterDistribusiSoal/readDistribusiSoal",
                    contentType: "application/json",
                    data: { "s_moduleId": s_moduleId, "s_posisiId": s_posisiId, "s_egiID": s_egiID },
                    type: "POST",
                    cache: false,
                },
                create: {
                    url: $("#urlPath").val() + "/MasterDistribusiSoal/createcreateDistribusiSoal",
                    contentType: "application/json",
                    type: "POST",
                    dataType: "json",
                    complete: function (e) {
                        if (e.responseJSON.status == true) {
                            alert(e.responseJSON.remarks);
                        } else {
                            alert(e.responseJSON.remarks);
                        }
                        $("#gridDistribusiSoal").data("kendoGrid").dataSource.read();
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
                    id: "PID_CM",
                    fields: { //semua field tabel/vw dari db
                        PID_CM: { type: "string", filterable: true, sortable: true, editable: false },
                        POSITION_CODE: { type: "string", filterable: true, sortable: true, editable: false },
                        POSITION_DESC: { type: "string", filterable: true, sortable: true, editable: false },
                        MODULE_ID: { type: "string", filterable: true, sortable: true, editable: false },
                        MODULE_NAME: { type: "string", filterable: true, sortable: true, editable: false },
                        EGI_CODE: { type: "string", filterable: true, sortable: true, editable: false },
                        GROUP_EQUIP_CLASS: { type: "string", filterable: true, sortable: true, editable: false },
                        MODULE_SUB_ID: { type: "string", filterable: true, sortable: false },
                        MODULE_SUB_NAME: { type: "string", filterable: true, sortable: false },
                        POSISI: { type: "string", filterable: true, sortable: false },
                        MODUL: { type: "string", filterable: true, sortable: false },
                        EGI: { type: "string", filterable: true, sortable: false },
                        _P0: { type: "number", filterable: true, sortable: true },
                        _P1: { type: "number", filterable: true, sortable: true },
                        _P2: { type: "number", filterable: true, sortable: true },
                        _P3: { type: "number", filterable: true, sortable: true },
                        _P4: { type: "number", filterable: true, sortable: true },
                        _P5: { type: "number", filterable: true, sortable: true },
                        _P6: { type: "number", filterable: true, sortable: true },
                        _P7: { type: "number", filterable: true, sortable: true },
                        _P8: { type: "number", filterable: true, sortable: true },
                        _P9: { type: "number", filterable: true, sortable: true },
                        _3C: { type: "number", filterable: true, sortable: true },
                        _3D: { type: "number", filterable: true, sortable: true },
                        _3E: { type: "number", filterable: true, sortable: true },
                        _3F: { type: "number", filterable: true, sortable: true },
                        _4A: { type: "number", filterable: true, sortable: true },
                        _4B: { type: "number", filterable: true, sortable: true },
                        _4C: { type: "number", filterable: true, sortable: true },
                        _4D: { type: "number", filterable: true, sortable: true },
                        _4E: { type: "number", filterable: true, sortable: true },
                        _4F: { type: "number", filterable: true, sortable: true },
                        ISACTIVE: { type: "boolean", filterable: true, sortable: true },
                        CREATE_DATE: { type: "date", filterable: true, sortable: true },
                        CREATE_BY: { type: "string", filterable: true, sortable: true },
                        MODIF_DATE: { type: "date", filterable: true, sortable: true },
                        MODIF_BY: { type: "string", filterable: true, sortable: true },
                        IS_STATUS_ENABLE_OPR: { type: "boolean", filterable: true, sortable: true, editable: false },
                        IS_STATUS_ENABLE_STAFF: { type: "boolean", filterable: true, sortable: true, hidden: true },


                    }
                }
            }
        },
        editable: {
            //confirmation: "Anda yakin akan menghapus data ini ?",
            mode: "popup"
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
        //toolbar: [{ template: kendo.template($("#add_distribusi").html())}],
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
             //{
             //    command: [{ text: "Edit", click: editData, class: 'glyphicon glyphicon-edit' }],
             //    title: "Action",
             //    width: "130px",
             //    headerAttributes: { style: 'text-align: center' },
             //    attributes: { style: "text-align: center" }
             //},
            {
                field: "POSISI",
                title: "Position",
                //template: "#=POSITION_DESC#",
                editor: PositionDropdownEditor,
                width: "150px",
                attributes: { style: "text-align: center" }
            },
            {
                field: "MODUL",
                title: "Nama Modul",
                editor: ModuleDropdownEditor,
                //template: "#=MODULE_NAME#",
                width: "150px",
                attributes: { style: "text-align: left" }
            },
            {
                field: "EGI",
                title: "EGI",
                editor: EGIDropdownEditor,
                //template: "#=EGI_CODE#",
                width: "150px",
                attributes: { style: "text-align: center" }
            },
            {
                field: "MODULE_SUB_ID",
                title: "Kompetensi",
                template: "#=MODULE_SUB_NAME#",
                editor: SubModuleDropdownEditor,
                width: "150px",
                attributes: { style: "text-align: left" }
            },
            { field: "_P0", title: "P0", width: "75px", attributes: { style: "text-align: center" } },
            { field: "_P1", title: "P1", width: "75px", attributes: { style: "text-align: center" } },
            { field: "_P2", title: "P2", width: "75px", attributes: { style: "text-align: center" } },
            { field: "_P3", title: "P3", width: "75px", attributes: { style: "text-align: center" } },
            { field: "_P4", title: "P4", width: "75px", attributes: { style: "text-align: center" } },
            { field: "_P5", title: "P5", width: "75px", attributes: { style: "text-align: center" } },
            { field: "_P6", title: "P6", width: "75px", attributes: { style: "text-align: center" } },
            { field: "_P7", title: "P7", width: "75px", attributes: { style: "text-align: center" } },
            { field: "_P8", title: "P8", width: "75px", attributes: { style: "text-align: center" } },
            { field: "_P9", title: "P9", width: "75px", attributes: { style: "text-align: center" } },
            { field: "_2C", title: "2C", width: "75px", attributes: { style: "text-align: center" } },
            { field: "_2D", title: "2D", width: "75px", attributes: { style: "text-align: center" } },
            { field: "_2E", title: "2E", width: "75px", attributes: { style: "text-align: center" } },
            { field: "_2F", title: "2F", width: "75px", attributes: { style: "text-align: center" } },
            { field: "_3A", title: "3A", width: "75px", attributes: { style: "text-align: center" } },
            { field: "_3B", title: "3B", width: "75px", attributes: { style: "text-align: center" } },
            { field: "_3C", title: "3C", width: "75px", attributes: { style: "text-align: center" } },
            { field: "_3D", title: "3D", width: "75px", attributes: { style: "text-align: center" } },
            { field: "_3E", title: "3E", width: "75px", attributes: { style: "text-align: center" } },
            { field: "_3F", title: "3F", width: "75px", attributes: { style: "text-align: center" } },
            { field: "_4A", title: "4A", width: "75px", attributes: { style: "text-align: center" } },
            { field: "_4B", title: "4B", width: "75px", attributes: { style: "text-align: center" } },
            { field: "_4C", title: "4C", width: "75px", attributes: { style: "text-align: center" } },
            { field: "_4D", title: "4D", width: "75px", attributes: { style: "text-align: center" } },
            { field: "_4E", title: "4E", width: "75px", attributes: { style: "text-align: center" } },
            { field: "_4F", title: "4F", width: "75px", attributes: { style: "text-align: center" } },
            //{
            //    field: "ISACTIVE",
            //    title: "Is Active",
            //    width: "130px",
            //    attributes: { style: "text-align: center" },
            //    template: "<input id=\"check\" type=\"checkbox\" #= ISACTIVE == true ?\"checked\":\"\" #  />"
            //},
            
        ],

        dataBinding: function () {
            window.RecNumerEq = (this.dataSource.page() - 1) * this.dataSource.pageSize();

            var grid = $("#gridDistribusiSoal").data("kendoGrid");


            if (s_posisiId == "PC0001") {

                grid.hideColumn(15);
                grid.hideColumn(16);
                grid.hideColumn(17);
                grid.hideColumn(18);
                grid.hideColumn(19);
                grid.hideColumn(20);
                grid.hideColumn(21);
                grid.hideColumn(22);
                grid.hideColumn(23);
                grid.hideColumn(24);
                grid.hideColumn(25);
                grid.hideColumn(26);
                grid.hideColumn(27);
                grid.hideColumn(28);
                grid.hideColumn(29);
                grid.hideColumn(30);
               
                

            } else {
                grid.hideColumn(5); 
                grid.hideColumn(6);
                grid.hideColumn(7);
                grid.hideColumn(8);
                grid.hideColumn(9);
                grid.hideColumn(10);
                grid.hideColumn(11);
                grid.hideColumn(12);
                grid.hideColumn(13);
                grid.hideColumn(14);
                

            }

        }
    });
}

function editData(e) {

    $(".soal").show();
    $(".soal_b").show();

    e.preventDefault();

    var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
    wnd_editor.center().open();
    wnd_editor.title("Edit");

    //Jika operator
    if (dataItem.POSITION_CODE == "PC0001") {
        $(".soal").hide(); //hide 3C S.D 4F

        $("#txt_pid").val(dataItem.PID_CM);
        $("#txt_position").val(dataItem.POSITION_DESC);
        $("#txt_module").val(dataItem.MODULE_NAME);
        $("#txt_egi").val(dataItem.EGI_CODE);
        $("#txt_subModule").val(dataItem.MODULE_SUB_NAME);

        $("#txt_p0").kendoNumericTextBox({ value: dataItem._P0 });
        $("#txt_p1").kendoNumericTextBox({ value: dataItem._P1 });
        $("#txt_p2").kendoNumericTextBox({ value: dataItem._P2 });
        $("#txt_p3").kendoNumericTextBox({ value: dataItem._P3 });
        $("#txt_p4").kendoNumericTextBox({ value: dataItem._P4 });
        $("#txt_p5").kendoNumericTextBox({ value: dataItem._P5 });
        $("#txt_p6").kendoNumericTextBox({ value: dataItem._P6 });
        $("#txt_p7").kendoNumericTextBox({ value: dataItem._P7 });
        $("#txt_p8").kendoNumericTextBox({ value: dataItem._P8 });
        $("#txt_p9").kendoNumericTextBox({ value: dataItem._P9 });

     

    }else{
        $(".soal_b").hide();//hide P0 S.D P9

        $("#txt_pid").val(dataItem.PID_CM);
        $("#txt_position").val(dataItem.POSITION_DESC);
        $("#txt_module").val(dataItem.MODULE_NAME);
        $("#txt_egi").val(dataItem.EGI_CODE);
        $("#txt_subModule").val(dataItem.MODULE_SUB_NAME);

        $("#txt_3c").kendoNumericTextBox({ value: dataItem._3C });
        $("#txt_3d").kendoNumericTextBox({ value: dataItem._3D });
        $("#txt_3e").kendoNumericTextBox({ value: dataItem._3E });
        $("#txt_3f").kendoNumericTextBox({ value: dataItem._3F });
        $("#txt_4a").kendoNumericTextBox({ value: dataItem._4A });
        $("#txt_4b").kendoNumericTextBox({ value: dataItem._4B });
        $("#txt_4c").kendoNumericTextBox({ value: dataItem._4C });
        $("#txt_4d").kendoNumericTextBox({ value: dataItem._4D });
        $("#txt_4e").kendoNumericTextBox({ value: dataItem._4E });
        $("#txt_4f").kendoNumericTextBox({ value: dataItem._4F });
    }

    if (dataItem.ISACTIVE == true) {
        $("#id_status").prop("checked", true);
    } else {
        $("#id_status").prop("checked", false);
    }
}


function get_submodule(module_id) {
    $.ajax({
        type: 'GET',
        url: $("#urlPath").val() + '/PilihanGanda/DropdownModul',
        success: function (data) {
            $.each(data.Data, function (key, value) {
                $("#S_MODUL").append("<option value='" + value.MODULE_ID + "'>" + value.MODULE_NAME + "</option>");
            });

            $.each(data.Data_cert, function (a, b) {
                $("#S_MCERT").append("<option value='" + b.CERT_ALIAS + "'>" + b.CERT_NAME + "</option>");
            });

            $.each(data.Data_manposition, function (a, b) {
                $("#S_MPOSITION").append("<option value='" + b.POSITION_CODE + "'>" + b.POSITION_DESC + "</option>");
            });

            $('#S_MCERT').selectpicker();
            $('#S_MPOSITION').selectpicker();
            $("#S_SUBMODUL , #S_MODUL , #S_TYPE").select2();

        }
    });
}

function SubModuleDropdownEditor(container, options) {
    var model = options.model;
    $('<input required data-text-field="MODULE_SUB_NAME" data-value-field="MODULE_SUB_ID" data-bind="value:' + options.field + '" />').appendTo(container).kendoDropDownList({
        autoBind: false,
        dataSource: SubModuleSource,
        dataTextField: "MODULE_SUB_NAME",
        dataValueField: "MODULE_SUB_ID",
        optionLabel: "Pilih"
    }).data("kendoDropDownList");
}

function EGIDropdownEditor(container, options) {
    var model = options.model;
    $('<input required data-text-field="EGI_GENERAL" data-value-field="EGI_GENERAL" data-bind="value:' + options.field + '" />').appendTo(container).kendoDropDownList({
        autoBind: false,
        dataSource: EGIDataSource,
        dataTextField: "EGI_GENERAL",
        dataValueField: "EGI_GENERAL",
        optionLabel: "Pilih"
    }).data("kendoDropDownList");
}

function ModuleDropdownEditor(container, options) {
    var model = options.model;
    $('<input required data-text-field="MODULE_NAME" data-value-field="MODULE_ID" data-bind="value:' + options.field + '" />').appendTo(container).kendoDropDownList({
        autoBind: false,
        dataSource: ModulDataSource,
        dataTextField: "MODULE_NAME",
        dataValueField: "MODULE_ID",
        optionLabel: "Pilih"
    }).data("kendoDropDownList");
}

function PositionDropdownEditor(container, options) {
    var model = options.model;
    $('<input required data-text-field="POSITION_DESC" data-value-field="POSITION_CODE" data-bind="value:' + options.field + '" />').appendTo(container).kendoDropDownList({
        autoBind: false,
        dataSource: PositionDataSource,
        dataTextField: "POSITION_DESC",
        dataValueField: "POSITION_CODE",
        optionLabel: "Pilih"
    }).data("kendoDropDownList");
}

function getmodulle(position_code) {
    //console.log(position_code);

    $("#txtModule").kendoDropDownList({
        dataTextField: "MODULE_NAME",
        dataValueField: "MODULE_PID",
        optionLabel: "Pilih", 
        dataSource: {
            type: "json",
            transport: {
                read: {
                    url: $("#urlPath").val() + "/MasterDistribusiSoal/dropdownModulbyId?position_code=" + position_code,
                    contentType: "application/json",
                    type: "POST",
                    cache: false,
                    complete: function (e) {
                    }
                }
            },
            schema: {
                data: "Data",
                total: "Total"
            }
        },
        change: function (e) {
            var dataItem = this.dataItem(e.item);
            modul_id = dataItem.MODULE_PID;
            //console.log(modul_id);

            document.getElementById("txtEgi").readOnly = false;
            getegi(modul_id);

            i_moduleId = modul_id;
        }
    });

}

function getegi(modul_id) {

    $("#txtEgi").kendoDropDownList({
        dataTextField: "EGI_GENERAL",
        dataValueField: "EGI_GENERAL",
        optionLabel: "Pilih",
        dataSource: {
            type: "json",
            transport: {
                read: {
                    url: $("#urlPath").val() + "/MasterDistribusiSoal/dropdownEGIbyId?modul_id=" + modul_id,
                    contentType: "application/json",
                    type: "POST",
                    cache: false,
                    complete: function (e) {
                    }
                }
            },
            schema: {
                data: "Data",
                total: "Total"
            }
        },
        change: function (e) {
            document.getElementById("idBtnView").disabled = false;
            var dataItem = this.dataItem(e.item);

            i_egiID = dataItem.EGI_GENERAL;

           // console.log(i_moduleId + " " + i_posisiId + " " + i_egiID);
        }
    });
}

function viewData() {
    //alert(i_moduleId + " " + i_posisiId + " " + i_egiID);
    loadGrid(i_moduleId, i_posisiId, i_egiID);
}

function clearEditor() {
    $("#txt_p0").kendoNumericTextBox({value:0});
    $("#txt_p1").kendoNumericTextBox({value:0});
    $("#txt_p2").kendoNumericTextBox({value:0});
    $("#txt_p3").kendoNumericTextBox({value:0});
    $("#txt_p4").kendoNumericTextBox({value:0});
    $("#txt_p5").kendoNumericTextBox({value:0});
    $("#txt_p6").kendoNumericTextBox({value:0});
    $("#txt_p7").kendoNumericTextBox({value:0});
    $("#txt_p8").kendoNumericTextBox({value:0});
    $("#txt_p9").kendoNumericTextBox({value:0});
    $("#txt_3c").kendoNumericTextBox({value:0});
    $("#txt_3d").kendoNumericTextBox({value:0});
    $("#txt_3e").kendoNumericTextBox({value:0});
    $("#txt_3f").kendoNumericTextBox({value:0});
    $("#txt_4a").kendoNumericTextBox({value:0});
    $("#txt_4b").kendoNumericTextBox({value:0});
    $("#txt_4c").kendoNumericTextBox({value:0});
    $("#txt_4d").kendoNumericTextBox({value:0});
    $("#txt_4e").kendoNumericTextBox({value:0});
    $("#txt_4f").kendoNumericTextBox({value:0});
}

$(document).ready(function () {

    document.getElementById("txtModule").readOnly = true;
    document.getElementById("txtEgi").readOnly = true;

    clearEditor();

    var sourcePosition = new kendo.data.DataSource({
        transport: {
            read: {
                url: $("#urlPath").val() + "/MasterDistribusiSoal/dropdownPosition",
                dataType: "json",
                type: "POST",
                ache: false
            }
        },
        schema: {
            data: "Data",
            total: "Total",
        }

    });

    $("#txtPosisi").kendoDropDownList({
        dataTextField: "POSITION_DESC", //Field ditampilkan pada view
        dataValueField: "POSITION_CODE", //Field yang diambil valuenya untuk manipulasi
        optionLabel: "Pilih", //Nilai dropdown sebelum dipilih
        dataSource: sourcePosition,
        change: function (e) {// kondisi saat dropdown dipilih
            var dataItem = this.dataItem(e.item);//variabel untuk membaca isi dropdown yang dipilih
            position_code = dataItem.POSITION_CODE; // Mereferensikan isi nilai DIV_CODE dari dropdown ke variabel Div_Code

            document.getElementById("txtModule").readOnly = false;
            getmodulle(position_code);
      
            i_posisiId = position_code;
        }
    });
});

function grid_add_distribusi(){
    $('#modal_masterdistribusi').modal('toggle');
}

function get_dropdownsub(module_id) {
    $("#drp-msubmodule").find('option').not(':first').remove();
    $.ajax({
        type: "POST",
        url: $("#urlPath").val() + '/PilihanGanda/dropdownSubmodul',
        data: {modul_ids : module_id},
        cache: false,
        success: function(data){
            $.each(data.Data, function (key, value) {
                $("#drp-msubmodule").append("<option value='" + value.MODULE_SUB_ID + "'>" + value.MODULE_SUB_NAME + "</option>");
            });

            $('#drp-msubmodule').selectpicker('refresh');
        }
    });
}