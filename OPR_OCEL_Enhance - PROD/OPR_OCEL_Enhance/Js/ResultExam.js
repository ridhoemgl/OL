// --- Load Grid  --------------------------------------------------------------------------

function loadGrid() {

    if ($("#gridResultExam").data().kendoGrid != null) {
        $("#gridResultExam").data().kendoGrid.destroy();
        $("#gridResultExam").empty();
    }

    $("#gridResultExam").kendoGrid({
        dataSource: {
            type: "json",
            transport: {
                read: {
                    url: $("#urlPath").val() + "/ResultsExam/readHasilUjian",
                    contentType: "application/json",
                    type: "POST",
                    cache: false,
                },
                parameterMap: function(data, operation) {
                    return kendo.stringify(data);
                }
            },
            pageSize: 20,
            serverPaging: true,
            serverFiltering: true,
            serverSorting: true,
            schema: {
                data: "Data",
                total: "Total",
                model: {
                    id: "STUDENT_ID",
                    fields: { //semua field tabel/vw dari db
                        STUDENT_ID: {
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
                        STARTS_DATE: {
                            type: "date",
                            filterable: true,
                            sortable: true,
                            editable: false
                        },
                        // FINISH_DATE: {
                        //     type: "date",
                        //     filterable: true,
                        //     sortable: true,
                        //     editable: false
                        // },
                        REGISTRATION_ID: {
                            type: "string",
                            filterable: true,
                            sortable: true,
                            editable: false
                        },
                        TEST_CENTER: {
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
                        RESULT_EXAM: {
                            type: "string",
                            filterable: true,
                            sortable: true,
                            editable: false
                        },
                        JENIS_UJIAN_DESC: {
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
                        EVENT_ID: {
                            type: "string",
                            filterable: true,
                            sortable: true,
                            editable: false
                        },
                        EXAM_TARGET_MIN: {
                            type: "number",
                            filterable: true,
                            sortable: true,
                            editable: false
                        },
                        EXAM_STATUS: {
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
                        CERTIFICATOR_NAME: {
                            type: "string",
                            filterable: true,
                            sortable: true,
                            editable: false
                        },
                        UJIAN_NAME: {
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
                        }
                    }
                }
            }
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
        columns: [{
                command: [{
                    name: "render-data",
                    text: "<i class='fa fa-print' aria-hidden='true'></i> Print",
                    click: grid_Render
                }],
                title: "Render",
                width: "90px"
            },
            {
                title: "No.",
                width: "35px",
                locked: true,
                lockable: true,
                template: "#= ++RecNumerEq #",
                filterable: false,
                sortable: false,
                editable: false,
                attributes: {
                    style: "text-align: center"
                }
            },
            {
                field: "STUDENT_ID",
                title: "NRP",
                locked: true,
                lockable: true,
                width: "100px",
                attributes: {
                    style: "# if(EXAM_STATUS === 'GAGAL') { #background-color:rgb(250, 177, 160);color:white;#}#"
                }
            },
            {
                field: "NAME",
                title: "Nama",
                locked: true,
                lockable: true,
                width: "100px",
                attributes: {
                    style: "# if(EXAM_STATUS === 'GAGAL') { #background-color:rgb(250, 177, 160);color:white;#}#"
                }
            },
            {
                field: "REGISTRATION_ID",
                title: "KD. Registrasi",
                width: "140px",
                attributes: {
                    style: "# if(EXAM_STATUS === 'GAGAL') { #background-color:rgb(250, 177, 160);color:white;#}#"
                }
            },
            {
                field: "STARTS_DATE",
                format: '{0:dd/MM/yyyy}',
                title: "Tanggal Ujian",
                width: "115px",
                locked: true,
                lockable: true,
                attributes: {
                    style: "text-align: center;# if(EXAM_STATUS === 'GAGAL') { #background-color:rgb(250, 177, 160);color:white;#}#"
                }
            },
            // {
            //     field: "FINISH_DATE",
            //     format: '{0:dd/MM/yyyy}',
            //     title: "End Date",
            //     width: "110px",
            //     locked: true,
            //     lockable: true,
            //     attributes: {
            //         style: "text-align: center;# if(EXAM_STATUS === 'GAGAL') { #background-color:rgb(250, 177, 160);color:white;#}#"
            //     }
            // },
            {
                field: "TEST_CENTER",
                title: "Lokasi",
                width: "100px",
                attributes: {
                    style: "# if(EXAM_STATUS === 'GAGAL') { #background-color:rgb(250, 177, 160);color:white;#}#"
                }
            },
            {
                field: "UJIAN_NAME",
                title: "Nama Ujian",
                width: "130px",
                attributes: {
                    style: "# if(EXAM_STATUS === 'GAGAL') { #background-color:rgb(250, 177, 160);color:white;#}#"
                }
            },
            {
                field: "JENIS_UJIAN_DESC",
                title: "Jn. Ujian",
                width: "110px",
                attributes: {
                    style: "# if(EXAM_STATUS === 'GAGAL') { #background-color:rgb(250, 177, 160);color:white;#}#"
                }
            },
            {
                field: "MODULE_NAME",
                title: "Modul Ujian",
                width: "120px",
                attributes: {
                    style: "# if(EXAM_STATUS === 'GAGAL') { #background-color:rgb(250, 177, 160);color:white;#}#"
                }
            },
            {
                field: "RESULT_EXAM",
                title: "Nilai",
                width: "100px",
                attributes: {
                    style: "# if(EXAM_STATUS === 'GAGAL') { #background-color:rgb(250, 177, 160);color:white;#}#"
                }
            },
            {
                field: "EGI",
                title: "Egi",
                width: "100px",
                attributes: {
                    style: "# if(EXAM_STATUS === 'GAGAL') { #background-color:rgb(250, 177, 160);color:white;#}#;"
                }
            },
            {
                field: "EXAM_TARGET_MIN",
                title: "Target",
                width: "100px",
                attributes: {
                    style: "text-align: center;# if(EXAM_STATUS === 'GAGAL') { #background-color:rgb(250, 177, 160);color:white;#}#"
                }
            },
            {
                field: "EXAM_STATUS",
                title: "Status",
                width: "100px",
                attributes: {
                    style: "# if(EXAM_STATUS === 'GAGAL') { #background-color:rgb(250, 177, 160);color:white;#}#"
                }
            },
            {
                field: "CERTIFICATOR_NAME",
                title: "Sertifikator"
                    //     ,
                    //     template : function(dataItem) {
                    //         var template = "";
                    //         var s = dataItem.CERTIFICATOR_ID;

                    //         if(s.indexOf(',') !=-1){
                    //             ArrayNRP = (dataItem.CERTIFICATOR_ID).split(",")
                    //             template = "<ol>";
                    //             for (var i = 0; i < ArrayNRP.length; i++) {
                    //                 template = template + "<li>" + ArrayNRP[i] + "</li>";
                    //             }
                    //         }else{
                    //             template = dataItem.CERTIFICATOR_ID;
                    //         }

                    //         return template + "</ol>";
                    // }
                    ,
                width: "155px",
                attributes: {
                    style: "# if(EXAM_STATUS === 'GAGAL') { #background-color:rgb(250, 177, 160);color:white;#}#"
                }
            },

        ],
        dataBinding: function() {
            window.RecNumerEq = (this.dataSource.page() - 1) * this.dataSource.pageSize();
        },
        toolbar: [{
            template: kendo.template($("#refreshdata").html())
        }, {
            template: kendo.template($("#download_btn").html())
        }
        ]
    });
}

$(document).ready(function() {

    loadGrid();
    $("#txtPosisi").kendoDropDownList({
        dataTextField: "POSITION_DESC",
        dataValueField: "POSITION_CODE",
        optionLabel: "Pilih",
        filter: "contains",
        dataSource: sourcePosition,
        change: function (e) {
            var dataItem = this.dataItem(e.item);
            i_position_code = dataItem.POSITION_CODE;
            if(i_position_code !== ''){
                $("#txtJenisUjian").data("kendoDropDownList").enable(true);
            }else{
                $("#txtJenisUjian").data("kendoDropDownList").enable(false);
            }
        }
    });



    $("#txtJenisUjian").kendoDropDownList({
        dataTextField: "JENIS_UJIAN_DESC",
        dataValueField: "JENIS_UJIAN_DESC",
        optionLabel: "Pilih",
        dataSource: sourceJenisUjian
    });

    $("#txtJenisUjian").data("kendoDropDownList").enable(false);

    $( "#btn_cari" ).click(function() {
        var pos_id = $("#txtPosisi").data("kendoDropDownList").value();
        var exam_type = $("#txtJenisUjian").data("kendoDropDownList").value();
        loadsearch(exam_type , pos_id);
    });
    console.clear();
});



function loadsearch(exam_type , pos_id){
    if ($("#gridResultExam").data().kendoGrid != null) {
        $("#gridResultExam").data().kendoGrid.destroy();
        $("#gridResultExam").empty();
    }
    showToast();
    $("#gridResultExam").kendoGrid({
        dataSource: {
            type: "json",
            transport: {
                read: {
                    url: $("#urlPath").val() + "/ResultsExam/readHasilUjianSearch",
                    contentType: "application/json",
                    cache: false,
                    data: {
                        position: pos_id,
                        type: exam_type
                    },
                    type: "POST",
                },
                parameterMap: function(data, operation) {
                    return kendo.stringify(data);
                }
            },
            pageSize: 20,
            serverPaging: true,
            serverFiltering: true,
            serverSorting: true,
            schema: {
                data: "Data",
                total: "Total",
                model: {
                    id: "STUDENT_ID",
                    fields: { //semua field tabel/vw dari db
                        STUDENT_ID: {
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
                        STARTS_DATE: {
                            type: "date",
                            filterable: true,
                            sortable: true,
                            editable: false
                        },
                        // FINISH_DATE: {
                        //     type: "date",
                        //     filterable: true,
                        //     sortable: true,
                        //     editable: false
                        // },
                        REGISTRATION_ID: {
                            type: "string",
                            filterable: true,
                            sortable: true,
                            editable: false
                        },
                        TEST_CENTER: {
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
                        RESULT_EXAM: {
                            type: "string",
                            filterable: true,
                            sortable: true,
                            editable: false
                        },
                        JENIS_UJIAN_DESC: {
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
                        EVENT_ID: {
                            type: "string",
                            filterable: true,
                            sortable: true,
                            editable: false
                        },
                        EXAM_TARGET_MIN: {
                            type: "number",
                            filterable: true,
                            sortable: true,
                            editable: false
                        },
                        EXAM_STATUS: {
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
                        CERTIFICATOR_NAME: {
                            type: "string",
                            filterable: true,
                            sortable: true,
                            editable: false
                        },
                        UJIAN_NAME: {
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
                        }
                    }
                }
            }
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
        columns: [{
                command: [{
                    name: "render-data",
                    text: "<i class='fa fa-print' aria-hidden='true'></i> Print",
                    click: grid_Render
                }],
                title: "Render",
                width: "90px"
            },
            {
                title: "No.",
                width: "35px",
                locked: true,
                lockable: true,
                template: "#= ++RecNumerEq #",
                filterable: false,
                sortable: false,
                editable: false,
                attributes: {
                    style: "text-align: center"
                }
            },
            {
                field: "STUDENT_ID",
                title: "NRP",
                locked: true,
                lockable: true,
                width: "100px",
                attributes: {
                    style: "# if(EXAM_STATUS === 'GAGAL') { #background-color:rgb(250, 177, 160);color:white;#}#"
                }
            },
            {
                field: "NAME",
                title: "Nama",
                locked: true,
                lockable: true,
                width: "100px",
                attributes: {
                    style: "# if(EXAM_STATUS === 'GAGAL') { #background-color:rgb(250, 177, 160);color:white;#}#"
                }
            },
            {
                field: "REGISTRATION_ID",
                title: "KD. Registrasi",
                width: "140px",
                attributes: {
                    style: "# if(EXAM_STATUS === 'GAGAL') { #background-color:rgb(250, 177, 160);color:white;#}#"
                }
            },
            {
                field: "STARTS_DATE",
                format: '{0:dd/MM/yyyy}',
                title: "Tanggal Ujian",
                width: "115px",
                locked: true,
                lockable: true,
                attributes: {
                    style: "text-align: center;# if(EXAM_STATUS === 'GAGAL') { #background-color:rgb(250, 177, 160);color:white;#}#"
                }
            },
            // {
            //     field: "FINISH_DATE",
            //     format: '{0:dd/MM/yyyy}',
            //     title: "End Date",
            //     width: "110px",
            //     locked: true,
            //     lockable: true,
            //     attributes: {
            //         style: "text-align: center;# if(EXAM_STATUS === 'GAGAL') { #background-color:rgb(250, 177, 160);color:white;#}#"
            //     }
            // },
            {
                field: "TEST_CENTER",
                title: "Lokasi",
                width: "100px",
                attributes: {
                    style: "# if(EXAM_STATUS === 'GAGAL') { #background-color:rgb(250, 177, 160);color:white;#}#"
                }
            },
            {
                field: "UJIAN_NAME",
                title: "Nama Ujian",
                width: "130px",
                attributes: {
                    style: "# if(EXAM_STATUS === 'GAGAL') { #background-color:rgb(250, 177, 160);color:white;#}#"
                }
            },
            {
                field: "JENIS_UJIAN_DESC",
                title: "Jn. Ujian",
                width: "110px",
                attributes: {
                    style: "# if(EXAM_STATUS === 'GAGAL') { #background-color:rgb(250, 177, 160);color:white;#}#"
                }
            },
            {
                field: "MODULE_NAME",
                title: "Modul Ujian",
                width: "120px",
                attributes: {
                    style: "# if(EXAM_STATUS === 'GAGAL') { #background-color:rgb(250, 177, 160);color:white;#}#"
                }
            },
            {
                field: "RESULT_EXAM",
                title: "Nilai",
                width: "100px",
                attributes: {
                    style: "# if(EXAM_STATUS === 'GAGAL') { #background-color:rgb(250, 177, 160);color:white;#}#"
                }
            },
            {
                field: "EGI",
                title: "Egi",
                width: "100px",
                attributes: {
                    style: "# if(EXAM_STATUS === 'GAGAL') { #background-color:rgb(250, 177, 160);color:white;#}#;"
                }
            },
            {
                field: "EXAM_TARGET_MIN",
                title: "Target",
                width: "100px",
                attributes: {
                    style: "text-align: center;# if(EXAM_STATUS === 'GAGAL') { #background-color:rgb(250, 177, 160);color:white;#}#"
                }
            },
            {
                field: "EXAM_STATUS",
                title: "Status",
                width: "100px",
                attributes: {
                    style: "# if(EXAM_STATUS === 'GAGAL') { #background-color:rgb(250, 177, 160);color:white;#}#"
                }
            },
            {
                field: "CERTIFICATOR_NAME",
                title: "Sertifikator"
                    //     ,
                    //     template : function(dataItem) {
                    //         var template = "";
                    //         var s = dataItem.CERTIFICATOR_ID;

                    //         if(s.indexOf(',') !=-1){
                    //             ArrayNRP = (dataItem.CERTIFICATOR_ID).split(",")
                    //             template = "<ol>";
                    //             for (var i = 0; i < ArrayNRP.length; i++) {
                    //                 template = template + "<li>" + ArrayNRP[i] + "</li>";
                    //             }
                    //         }else{
                    //             template = dataItem.CERTIFICATOR_ID;
                    //         }

                    //         return template + "</ol>";
                    // }
                    ,
                width: "155px",
                attributes: {
                    style: "# if(EXAM_STATUS === 'GAGAL') { #background-color:rgb(250, 177, 160);color:white;#}#"
                }
            },

        ],
        dataBinding: function() {
            window.RecNumerEq = (this.dataSource.page() - 1) * this.dataSource.pageSize();
        },
        toolbar: [{
            template: kendo.template($("#refreshdata").html())
        }, {
            template: kendo.template($("#download_btn").html())
        }, {
            template: kendo.template($("#download_selected").html())
        }]
    });
    hideLoading();
}

function grid_Render(e) {
    e.preventDefault();
    var data = this.dataItem($(e.currentTarget).closest("tr"));
    console.log(data);
    Full_W_P($('#urlPath').val() + "/ResultsExam/Report_printer?MOD=" + data.MODULE_ID + "&REG=" + data.REGISTRATION_ID);
}

function refreshdata(){
    showToast();
    $.ajax({
        url: $('#urlPath').val() + "/ResultsExam/Running_cusp_repl_dump_VW_RESULT_HASIL_UJIAN",
        type: "POST",
        success: function (response) {
            hideLoading();
            loadGrid();
        },
        error: function(jqXHR, textStatus, errorThrown) {
           console.log(textStatus, errorThrown);
           hideLoading();
        }
    });
}


var sourceJenisUjian = new kendo.data.DataSource({
    transport: {
        read: {
            url: $("#urlPath").val() + "/KelompokSoal/dropdownJenisUjian",
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

var sourcePosition = new kendo.data.DataSource({
    transport: {
        read: {
            url: $("#urlPath").val() + "/KelompokSoal/dropdownPosition",
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

function Full_W_P(url) {
    params = 'width=' + screen.width;
    params += ', height=' + screen.height;
    params += ', top=0, left=0'
    params += ', fullscreen=yes';


    newwin = window.open(url, 'FullWindowAll', params);
    if (window.focus) {
        newwin.focus()
    }
    return false;
}

function showToast(){
    var title = "Executing Service";
    var icon = "Please Wait...";
    var duration = 1300000;
    $.Toast.showToast({title: title,duration: duration, icon:icon,image: ''});
  }
function downloadexcel() {
    var app_position = $("#txtPosisi").data("kendoDropDownList").value();
    var ujian_type = $("#txtJenisUjian").data("kendoDropDownList").text();

    if(app_position === ""){
        $.alert({
            title: 'Error Parameter',
            content: 'parameter belum anda pilih, pilih posisi dengan benar sebelum anda klik tombol download',
            icon: 'fa fa-exclamation-triangle',
            theme: 'material',
            type: 'red'
        });
    }else{
        window.location.href = 'ResultsExam/ExportToExcel?app_code='+app_position+'&jenis_ujian='+ujian_type+'&is_download_all='+false;
    }
}

function downloadexcelAll() {
    window.location.href = 'ResultsExam/ExportToExcel?app_code=false&jenis_ujian=false&is_download_all='+true;
}
function hideLoading(){
    $.Toast.hideToast();
}