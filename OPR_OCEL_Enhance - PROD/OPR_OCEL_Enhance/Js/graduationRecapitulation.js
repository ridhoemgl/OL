$(document).ready(function () {
    $.ajax({
        url: $("#urlPath").val() + "/ResultsExam/getYear",
        type : "POST",
        dataType : "JSON",
        success: function (e) {
            if (e.status === true) {
                $.each(e.data, function (a, b) {
                    $("#tahun").append("<option value='" + b.YEAR_EXAM + "'>" + b.YEAR_EXAM + "</option>");
                });
            }
        }
    });
});
function Cari() {
    if ($("#bulan").val() == "" || $("#tahun").val() == "") {
        swal('Oops', 'Silahkan pilih bulan dan tahun', 'error');
        $("#grid").data("kendoGrid").dataSource.data([]);
    } else {
        loadGrid();
    }
}
function loadGrid() {

    if ($("#grid").data().kendoGrid != null) {
        $("#grid").data().kendoGrid.destroy();
        $("#grid").empty();
    }

    $("#grid").kendoGrid({
        dataSource: {
            type: "json",
            transport: {
                read: {
                    url: $("#urlPath").val() + "/ReportQuestionQuality/getDataRecapitulation?bulan=" + $("#bulan").val() + "&tahun=" + $("#tahun").val(),
                    contentType: "application/json",
                    type: "POST",
                    cache: false,
                    complete: function () {
                        templateavg();
                        console.log($("#averagePercent").val());
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
                    id: "dstrct_code",
                    fields: { //semua field tabel/vw dari db
                        DSTRCT_CODE: { type: "string" },
                        JUMLAH_BERHASIL: { type: "int" },
                        JUMLAH_GAGAL: { type: "int" }
                    }
                },
            },
            aggregate: [
                        { field: "JUMLAH_BERHASIL", aggregate: "sum" },
                        { field: "JUMLAH_GAGAL", aggregate: "sum" }
            ]
        },

        editable: false,
        height: 400,
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
        columns: [
              {
                  field: "DSTRCT_CODE", title: " ", width: "90px", attributes: { style: "text-align: left" }, headerAttributes: { style: "text-align: center;font-weight: bold;color:black;" }, footerTemplate: "Total", footerAttributes: { style: "text-align: center;font-weight: bold;color:black;" }
              },
              {
                  title: $('#bulan option:selected').text(), headerAttributes: { style: "text-align: center;font-weight: bold;color:black;" },
                columns: [
                  
                    { field: "JUMLAH_BERHASIL", title: "Lulus", width: "90px", attributes: { style: "text-align: center" }, filterable: false, headerAttributes: { style: "text-align: center;font-weight: bold;color:black;" }, footerTemplate: "#=sum#", footerAttributes: { style: "text-align: center;font-weight: bold;color:black;" } },

                    { field: "JUMLAH_GAGAL", title: "Rem-1", width: "90px", attributes: { style: "text-align: center" }, filterable: false, headerAttributes: { style: "text-align: center;font-weight: bold;color:black;" }, footerTemplate: "#=sum#", footerAttributes: { style: "text-align: center;font-weight: bold;color:black;" } },

                    { template: template, field: "Ach_Lulus", field: "aaaa", title: "Ach_Lulus", width: "90px", attributes: { style: "text-align: center" }, headerAttributes: { style: "text-align: center;font-weight: bold;color:black;" }, footerTemplate: $("#averagePercent").html() + "%", footerAttributes: { style: "text-align: center;font-weight: bold;color:black;" } }
                ]
              }
        ],

        dataBinding: function () {
            window.RecNumerEq = (this.dataSource.page() - 1) * this.dataSource.pageSize();
        }
    });
}
var Tempdata = [];
var jumlahpercent = 0;
var averagepercent = 0;
function templateavg(){

    var jlulus = $("#grid").data().kendoGrid.dataSource.aggregates().JUMLAH_BERHASIL.sum;
    var jgagal = $("#grid").data().kendoGrid.dataSource.aggregates().JUMLAH_GAGAL.sum;

    var average_j = (jlulus / (jlulus + jgagal)) * 100;
    $("#average").text(Math.round(average_j));

}
function template(data) {
    return ((data.JUMLAH_BERHASIL / (+data.JUMLAH_BERHASIL + data.JUMLAH_GAGAL)) * 100).toFixed(2) + '%'
}