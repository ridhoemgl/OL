$( document ).ready(function() {
    dropdown_module();

    $("#btn_view").click(function() {
        var mod_id = ($('#S_MODUL').select2('data')[0].id);

        $.ajax({
            type: 'POST',
            url: $("#urlPath").val() + "/ReportQuestionQuality/GetAnalize",
            data : {
                module_id :mod_id
            },
            success: function (data) {
                if(mod_id === "0"){
                    RenderChart("Analisa Kualitas Soal Permodul Ujian" , data.data);
                }else{
                    RenderChart("Analisa Kualitas Soal Perkompetensi" , data.data);
                }
                
                if ( $.fn.DataTable.isDataTable('#tbl_analisa') ) {
                    $('#tbl_analisa').DataTable().destroy();
                    datatabel(data);
                }else{
                    datatabel(data);
                }
        
                $('#area_chart , #area_table').removeAttr('hidden');
            }
        });
    });
});

function dropdown_module() {
    $.ajax({
        type: 'POST',
        url: $("#urlPath").val() + '/ReportQuestionQuality/DropdownModul',
        success: function(data) {
            $.each(data.Data, function(key, value) {
                $("#S_MODUL").append("<option value='" + value.MODULE_ID + "'>" + value.MODULE_NAME + "</option>");
            });

            $("#S_MODUL").select2();

        }
    });
}

function RenderChart(title ,  sources){
    $('#area_chart').empty();
    var Mydata = new Array();

    var type = ["% ACH Salah" , "% ACH Benar"];
    var color = ['#C0392B','#2C3E50'];

    for (var i = 0; i < type.length; i++) {
        Mydata[i] = new Array();
        if(i == 0){
            for (var h = 0; h < sources.length; h++) {
                Mydata[i].push({
                    y: SortCalc(sources[h].FALSE_ANSWER , sources[h].LOAD_BY_SYS),
                    label : sources[h].MODULE,
                    color : color[i]
                });
            }
        }else if(i == 1){
            for (var h = 0; h < sources.length; h++) {
                Mydata[i].push({
                    y: SortCalc(sources[h].TRUE_ANSWER , sources[h].LOAD_BY_SYS),
                    label : sources[h].MODULE,
                    color : color[i]
                });
            }
        }
    }

    var ChartSeries = new Array();

    for (var l = 0; l < type.length; l++) {
        ChartSeries.push({
            type: "stackedColumn100",
            name: type[l],
            color : color[l],
            showInLegend: true,
            yValueFormatString: "#,##0'%'",
            indexLabel: "{y}",
            indexLabelFontColor : "#FFFFFF",
            legendText: type[l],
            dataPoints: Mydata[l]
        });
    }

    var chart = new CanvasJS.Chart("area_chart", {
        animationEnabled: true,
        title:{
            text: title,
            fontSize: 20
        },
        width : 900,
        height: 230,
        axisX: {
            interval: 1
        },
        axisY: {
            suffix: "%"
        },
        toolTip: {
            shared: true
        },
        legend: {
            reversed: true,
            verticalAlign: "center",
            horizontalAlign: "left"
        },
        data: ChartSeries
    });
    chart.render();
}

function SortCalc(a , b){
    var retn = 0;
    if(b != 0){
        retn = (a / b) * 100;
    }
    return retn;
}

function datatabel(dataset){
    var tables = $("#tbl_analisa").DataTable({
        data : dataset.data,
        columns: [
            {
                data : 'CODE_ITEM',
                class : 'text-center',
                width: "6%"
            },
            {
                data: "MODULE",
                width: "20%",
            },
            {
                data: "QTY_ON_BANK",
                width: "12%",
                class : 'text-center'
            },
            {
                data: "LOAD_BY_SYS" ,
                class : 'text-center',
                width: "12%"
            },
            {
                data: "TRUE_ANSWER",
                class : 'text-center',
                width: "10%"
            },
            {
                data: null,
                class : 'text-center',
                width: "13%",
                render : function(data , type , row){
                    if(data.LOAD_BY_SYS == 0){
                        return "0 %";
                    }else{
                        var calculate = (data.TRUE_ANSWER / data.LOAD_BY_SYS) * 100;
                         return calculate.toFixed(2) + "%";
                    }
                }
            },
            {
                data: "FALSE_ANSWER",
                class : 'text-center',
                width: "12%"
            },
            {
                data: null,
                class : 'text-center',
                width: "13%",
                render : function(data , type , row){
                    if(data.LOAD_BY_SYS == 0){
                        return "0 %";
                    }else{
                        var calculate = (data.FALSE_ANSWER / data.LOAD_BY_SYS) * 100;
                         return calculate.toFixed(2) + "%";
                    }
                }
            }
        ],
        "order": [[ 0, 'asc' ]],
        "displayLength": 20
    });
}