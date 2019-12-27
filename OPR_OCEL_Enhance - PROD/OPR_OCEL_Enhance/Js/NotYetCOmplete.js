// --- Load Grid  --------------------------------------------------------------------------

function loadGrid() {

    if ($("#gridResultNotComplete").data().kendoGrid != null) {
        $("#gridResultNotComplete").data().kendoGrid.destroy();
        $("#gridResultNotComplete").empty();
    }

    $("#gridResultNotComplete").kendoGrid({
        dataSource: {
            type: "json",
            transport: {
                read: {
                    url: $("#urlPath").val() + "/ResultsExam/readHasilUjianNotYet",
                    contentType: "application/json",
                    type: "POST",
                    cache: false,
                    success: function (data) {
                        hideLoading();
                    },
                    error: function (xhr, error) {
                        hideLoading();
                        console.debug(xhr); console.debug(error);
                    }
                },
                parameterMap: function(data, operation) {
                    return kendo.stringify(data);
                }
            },
            pageSize: 40,
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
                        JENISSOAL: {
                            type: "string",
                            filterable: true,
                            sortable: true,
                            editable: false
                        },
                        NAMA_UJIAN: {
                            type: "string",
                            filterable: true,
                            sortable: true,
                            editable: false
                        },
                        TGL_REGISTRASI: {
                            type: "string",
                            filterable: true,
                            sortable: true,
                            editable: false
                        },
                        DSTRCT_CODE: {
                            type: "string",
                            filterable: true,
                            sortable: true,
                            editable: false
                        },
                        GOLONGAN: {
                            type: "string",
                            filterable: true,
                            sortable: true,
                            editable: false
                        },
                        REGISTRATION_ID: {
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
                        UNIT_KOMPETENSI: {
                            type: "string",
                            filterable: true,
                            sortable: true,
                            editable: false
                        },
                        EXAM_SCORE: {
                            type: "number",
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
                        TEST_CENTER: {
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
                        CERTIFICATOR_ID: {
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
                        STARTS_DATE: {
                            type: "date",
                            filterable: true,
                            sortable: true,
                            editable: false
                        },
                        FINISH_DATE: {
                            type: "string",
                            filterable: true,
                            sortable: true,
                            editable: false
                        },
                        EXAM_STATUS: {
                            type: "number",
                            filterable: true,
                            sortable: true,
                            editable: false
                        },
                        CERTIFIKATOR_PENGGANTI: {
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
            pageSizes: [10, 50, 100 , 1000 , 2000 , 10000],
            info: true
        },
        reorderable: true,
        columns: [
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
                width: "100px"
            },
            {
                field: "JENISSOAL",
                title: "Jenis Soal",
                width: "140px"
            },
            {
                field: "NAMA_UJIAN",
                title: "Nama Ujian",
                width: "240px"
            },
            {
                field: "NAME",
                title: "Nama",
                locked: true,
                lockable: true,
                width: "100px"
            },
            {
                field: "STARTS_DATE",
                template: "#= kendo.toString(kendo.parseDate(STARTS_DATE, 'yyyy-MM-dd'), 'dd-MM-yyyy') #",
                format: '{0:dd/MM/yyyy}',
                title: "Tanggal Ujian",
                width: "115px",
                locked: true,
                lockable: true
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
                width: "100px"
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
                width: "120px"
            },
            {
                field: "EGI",
                title: "Egi",
                width: "100px"
            },
            {
                field: "EXAM_TARGET_MIN",
                title: "Target",
                width: "100px"
            },
            {
                field: "EXAM_STATUS",
                title: "Status",
                width: "100px"
            },
            {
                field: "CERTIFICATOR_ID",
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
                width: "85px"
            },

        ],
        dataBinding: function() {
            window.RecNumerEq = (this.dataSource.page() - 1) * this.dataSource.pageSize();
        },
        toolbar: [{
            template: kendo.template($("#drefresh_btn").html())
        },{
            template: kendo.template($("#download_btn").html())
        }]
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
    //console.clear();
});

function refreshdata(){
    showToast();
    $.ajax({
        url: $('#urlPath').val() + "/ResultsExam/Running_cusp_repl_dump_VW_NOT_COMPLETE_EXAM",
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

function loadsearch(exam_type , pos_id){
    if ($("#gridResultNotComplete").data().kendoGrid != null) {
        $("#gridResultNotComplete").data().kendoGrid.destroy();
        $("#gridResultNotComplete").empty();
    }
    $("#gridResultNotComplete").kendoGrid({
        dataSource: {
            type: "json",
            transport: {
                read: {
                    url: $("#urlPath").val() + "/ResultsExam/readBelumSelesaiSearch",
                    contentType: "application/json",
                    cache: false,
                    data: {
                        position: pos_id,
                        type: exam_type
                    },
                    type: "POST",
                    cache: false
                },
                parameterMap: function(data, operation) {
                    return kendo.stringify(data);
                }
            },
            pageSize: 40,
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
                        JENISSOAL: {
                            type: "string",
                            filterable: true,
                            sortable: true,
                            editable: false
                        },
                        NAMA_UJIAN: {
                            type: "string",
                            filterable: true,
                            sortable: true,
                            editable: false
                        },
                        TGL_REGISTRASI: {
                            type: "string",
                            filterable: true,
                            sortable: true,
                            editable: false
                        },
                        DSTRCT_CODE: {
                            type: "string",
                            filterable: true,
                            sortable: true,
                            editable: false
                        },
                        GOLONGAN: {
                            type: "string",
                            filterable: true,
                            sortable: true,
                            editable: false
                        },
                        REGISTRATION_ID: {
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
                        UNIT_KOMPETENSI: {
                            type: "string",
                            filterable: true,
                            sortable: true,
                            editable: false
                        },
                        EXAM_SCORE: {
                            type: "number",
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
                        TEST_CENTER: {
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
                        CERTIFICATOR_ID: {
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
                        STARTS_DATE: {
                            type: "date",
                            filterable: true,
                            sortable: true,
                            editable: false
                        },
                        FINISH_DATE: {
                            type: "string",
                            filterable: true,
                            sortable: true,
                            editable: false
                        },
                        EXAM_STATUS: {
                            type: "number",
                            filterable: true,
                            sortable: true,
                            editable: false
                        },
                        CERTIFIKATOR_PENGGANTI: {
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
            pageSizes: [10, 50, 100 , 1000 , 2000 , 10000],
            info: true
        },
        columns: [
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
            width: "100px"
        },
        {
            field: "NAME",
            title: "Nama",
            width: "100px"
        },
        {
            field: "REGISTRATION_ID",
            title: "KD. Registrasi",
            width: "140px"
        },
        {
            field: "JENISSOAL",
            title: "Jenis Soal",
            width: "140px"
        },
        {
            field: "NAMA_UJIAN",
            title: "Nama Ujian",
            width: "240px"
        },
        {
            field: "STARTS_DATE",
            format: '{0:dd/MM/yyyy}',
            title: "Tanggal Ujian",
            template: "#= kendo.toString(kendo.parseDate(STARTS_DATE, 'yyyy-MM-dd'), 'dd-MM-yyyy') #",
            width: "115px"
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
            width: "100px"
        },
        {
            field: "JENIS_UJIAN_DESC",
            title: "Jn. Ujian",
            width: "110px"
        },
        {
            field: "MODULE_NAME",
            title: "Modul Ujian",
            width: "120px"
        },
        {
            field: "EGI",
            title: "Egi",
            width: "100px"
        },
        {
            field: "EXAM_TARGET_MIN",
            title: "Target",
            width: "100px"
        },
        {
            field: "EXAM_STATUS",
            title: "Status",
            width: "100px"
        },
        {
            field: "CERTIFICATOR_ID",
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
            width: "135px"
        },

    ],
        dataBinding: function() {
            window.RecNumerEq = (this.dataSource.page() - 1) * this.dataSource.pageSize();
        },
        reorderable: true,
        toolbar: [{
            template: kendo.template($("#download_btn").html())
        }, {
            template: kendo.template($("#download_selected").html())
        }]
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

function isoDateReviver(value) {
    if (typeof value === 'string') {
      var a = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)(?:([\+-])(\d{2})\:(\d{2}))?Z?$/.exec(value);
        if (a) {
          var utcMilliseconds = Date.UTC(+a[1], +a[2] - 1, +a[3], +a[4], +a[5], +a[6]);
          return new Date(utcMilliseconds);
        }
    }
    return value;
  }

function showToast(){
    var title = "Loading Data";
    var icon = "Please Wait...";
    var duration = 1300000;
    $.Toast.showToast({title: title,duration: duration, icon:icon,image: ''});
  }

function hideLoading(){
    $.Toast.hideToast();
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
        window.location.href = 'ExportToExcelYet?app_code='+app_position+'&jenis_ujian='+ujian_type+'&is_download_all='+false;
    }
}

function downloadexcelAll() {
    window.location.href = 'ExportToExcelYet?app_code=false&jenis_ujian=false&is_download_all='+true;
}