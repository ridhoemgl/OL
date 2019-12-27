$(document).ready(function () {
    SetDropdown();
});

$("#btn_view").click(function () {

    var exam_type_ = ($('#S_TIPE').select2('data')[0].id)
    var jenis_soal_ = ($('#S_QTYPE').select2('data')[0].id)
    var posisi_app = ($('#S_POS').select2('data')[0].id)

    if (!exam_type_) {
        ShowAlert('red', 'Filter Salah', 'Harap pilih dahulu jenis ujiannya');
    } else if (!jenis_soal_) {
        ShowAlert('red', 'Filter Salah', 'Harap pilih dahulu tipe soalnya');
    } else if (!posisi_app) {
        ShowAlert('red', 'Filter Salah', 'Harap pilih dahulu posisinya');
    } else {
        Loadgrid_finishedExam(exam_type_, jenis_soal_, posisi_app);
    }
});

function ShowAlert(type, title, konten) {
    $.alert({
        title: title,
        content: konten,
        theme: 'modern',
        type: type
    });
}

function showToast() {
    var title = "Loading..";
    var icon = "Please Wait...";
    var duration = 1300000;
    $.Toast.showToast({ title: title, duration: duration, icon: icon, image: '' });
}

function hideLoading() {
    $.Toast.hideToast();
}

function SetDropdown() {
    $.ajax({
        type: 'POST',
        url: $("#urlPath").val() + '/RecordJawaban/Getdata',
        success: function (data) {
            $.each(data.DJ, function (key, value) {
                $("#S_TIPE").append("<option value='" + value.JENIS_UJIAN_CODE + "'>" + value.JENIS_UJIAN_DESC + "</option>");
            });

            $.each(data.JS, function (a, b) {
                $("#S_QTYPE").append("<option value='" + b.TYPE_CODE + "'>" + b.TYPE_DESC + "</option>");
            });

            $.each(data.PS, function (a, b) {
                $("#S_POS").append("<option value='" + b.POSITION_CODE + "'>" + b.POSITION_DESC + "</option>");
            });

            $("#S_TIPE , #S_QTYPE , #S_POS").select2();

        }
    });
}

function Loadgrid_finishedExam(jenis_ujian, jenis_soal, posisi) {
    //REFRESH GRID SEBELUM DI LOAD
    if ($("#grid_student").data().kendoGrid != null) {
        $("#grid_student").data().kendoGrid.destroy();
        $("#grid_student").empty();
    }
    //showToast();
    $("#grid_student").kendoGrid({
        dataSource: {
            type: "json",
            transport: {
                read: {
                    url: $("#urlPath").val() + "/RecordJawaban/FinishedExamStudent",
                    contentType: "application/json",
                    data: {
                        question_type: jenis_soal,
                        exam_type: jenis_ujian,
                        pos_code: posisi
                    },
                    type: "POST",
                    cache: false,
                },
                parameterMap: function (data, operation) {
                    return kendo.stringify(data);
                }
            },
            pageSize: 50,
            serverPaging: true,
            serverFiltering: true,
            serverSorting: true,
            schema: {
                data: "Data",
                total: "Total",
                model: {
                    id: "RECORD_ID",
                    fields: { //semua field tabel/vw dari db
                        RECORD_ID: {
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
                        NRP: {
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
                        EXAM_SCORE: {
                            type: "number",
                            filterable: true,
                            sortable: true,
                            editable: false
                        },
                        NUMBER_OF_QUESTION: {
                            type: "number",
                            filterable: true,
                            sortable: true,
                            editable: false
                        },
                        EXAM_FINISH_TIME: {
                            type: "date",
                            filterable: true,
                            sortable: true,
                            editable: false
                        },
                        QUESTION_TYPE: {
                            type: "number",
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
                name: "show-data",
                text: "<i class='fa fa-book' aria-hidden='true'></i> Show",
                click: trackingdata
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
                field: "RECORD_ID",
                hidden: true
            },
            {
                field: "REGISTRATION_ID",
                title: "Registrasi",
                width: "120px"
            },
            {
                field: "NRP",
                title: "NRP",
                width: "80px"
            },
            {
                field: "NAME",
                title: "Nama Karyawan",
                width: "150px"
            },
            {
                field: "NUMBER_OF_QUESTION",
                title: "Σ",
                width: "70px",
                attributes: { style: "text-align: center" }
            }
        ],
        dataBinding: function () {
            window.RecNumerEq = (this.dataSource.page() - 1) * this.dataSource.pageSize();
        },
        toolbar: ["excel"]
    });

    hideLoading();
}

function trackingdata(e) {
    $('#tampilkan_hirtory').empty();
    var data_kendo = this.dataItem($(e.currentTarget).closest("tr"));
    $.ajax({
        type: "POST",
        url: $("#urlPath").val() + "/RecordJawaban/GetHistoryJawab",
        data: {
            register_id: data_kendo.REGISTRATION_ID,
            jenissoal: parseInt(data_kendo.QUESTION_TYPE),
            nrp_karyawan: data_kendo.NRP
        },
        cache: false,
        success: function (data) {
            if (data.err) {
                $.alert({
                    title: 'Error Request',
                    content: 'Maaf terjadi kesalahan ketika penarikan data soal',
                    icon: 'fa fa-exclamation-triangle',
                    theme: 'modern',
                    type: 'red'
                });
            } else {
                var Mydata = data.datax;
                if (Mydata.length == 0) {
                    $.alert({
                        title: 'Data Kosong',
                        content: 'Maaf sepertinya data tersebut belum masuk ke database koreksi asesor<br> Atau orang tersebut dikoreksi sebelum fitur ini ada',
                        icon: 'fa fa-exclamation-triangle',
                        theme: 'material',
                        type: 'red'
                    });
                } else {
                    if (data.QT == "PG") {
                        render_pg(Mydata);
                    } else if (data.QT == "ES") {
                        render_es(Mydata);
                    }
                }
            }
        }
    });
}

//  Answer Paging

var list = new Array();
var pageList = new Array();
var currentPage = 1;
var numberPerPage = 10;
var numberOfPages = 1;
var renderType = '';

function render_pg(data) {
    resetPaging()
    renderType = 'PG'
    for (x = 0; x < data.length; x++)
        list.push(data[x]);
    
    numberOfPages = getNumberOfPages();
    loadList()
}

function render_es(data) {
    resetPaging()
    renderType = 'ESSAY'
    for (x = 0; x < data.length; x++)
        list.push(data[x]);

    numberOfPages = getNumberOfPages();
    loadList()
}

function loadList() {
    $('#tampilkan_hirtory').empty();

    var begin = ((currentPage - 1) * numberPerPage);
    var end = begin + numberPerPage;
    var stringdiv = "";
    var inisiasi = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];

    pageList = list.slice(begin, end);
    console.log(renderType)

    if (renderType == 'PG') {

        $.each(pageList, function (w, y) {
            stringdiv += "<h5>Pertanyaan No " + y._NO + "</h5>";
            stringdiv += "<b><font size='2'>Pertanyaan : </font></b><br><font size='1'>" + y.PERTANYAAN + "</font>";
            stringdiv += "<br><b><font size='2'>Jawaban Peserta : </font></b><br><font size='1'>" + inisiasi[(y.JAWABAN_USER - 1)] + "</font>";
            if (y.STATUS == 1) {
                stringdiv += "<font color='green'> (BENAR)</font>";
            } else {
                stringdiv += "<font color='red'> (SALAH)</font>";
            }
            stringdiv += "<br><b><font size='2'>Jawaban Seharusnya : " + inisiasi[(y.JAWABAN - 1)] + "</font></b>";
            stringdiv += "<hr>";
        });
    }
    else if (renderType == "ESSAY") {
        $.each(pageList, function (w, y) {
            stringdiv += "<h5>Pertanyaan No " + y._NO + "</h5>";
            stringdiv += "<b><font size='2'>Pertanyaan : </font></b><br><font size='1'>" + y.SOAL + "</font>";
            stringdiv += "<br><b><font size='2'>Jawaban Peserta : </font></b><br><font size='1'>" + y.ANSWER_USER + "</font>";
            stringdiv += "<br><b><font size='2'>Penilaian : " + y.NILAI + "</font></b>";
            stringdiv += "<hr>";
        });

    }

    stringdiv +=    '<input id="bt_previus" type="button" class="btn btn-primary btn-sm" value="Previus" onclick="previousPage()" style="float:left;display:none"></button>' +
                    '<input id="bt_next" type="button" class="btn btn-primary btn-sm" value="Next" onclick="nextPage()" style="float:right"></button>'

    $('#tampilkan_hirtory').append(stringdiv);
    check()
}

function getNumberOfPages() {
    return Math.ceil(list.length / numberPerPage);
}

function nextPage() {
    currentPage += 1;
    loadList();
}

function previousPage() {
    currentPage -= 1;
    loadList();
}

function check() {
    var total = getNumberOfPages()
    console.log(currentPage)
    if (currentPage <= 1) {
        //  Hide Previus Button
        $("#bt_previus").hide()
    }
    else {
        //  Show Previus Button
        $("#bt_previus").show()
    }

    if (currentPage >= total) {
        //  Hide Next Button
        $("#bt_next").hide()
    }
    else {
        //  Show Previus Button
        $("#bt_next").show()
    }
}

function resetPaging() {
    list = new Array();
    pageList = new Array();
    currentPage = 1;
    numberPerPage = 10;
    numberOfPages = 1; 
}

//  Answer Paging