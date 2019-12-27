$(document).ready(function () {
    dropdown_module()
    $("#S_MODUL").select2();
    
    var Load_sys = parseFloat($('#LOAD_BY_SYS').text());
    var NoLoad_sys = parseFloat($('#QUESTION_COUNT').text()) - Load_sys;

    var True_a = parseInt($('#ACH_TRUE').text());
    var False_b = parseInt($('#ACH_FALSE').text());

    redner_b(True_a , False_b);
    render_a(Load_sys , NoLoad_sys);
    dropdown_examtype();
});

var color = ['#C0392B','#2C3E50'];

function redner_b(True_a , False_b ){
    var chartb = new CanvasJS.Chart("chart_b", {
        animationEnabled: true,
        title: {
            text: "Kualitas Soal",
            fontSize: 13
        },
        data: [{
            type: "pie",
            showInLegend: true,
            legendText: "{label}",
            indexLabel: "{label} {y}",
            dataPoints: [
                {y: True_a , label: "Dijawab Benar" , color : color[0]},
                {y: False_b , label: "Dijawab Salah", color : color[1]},
            ]
        }]
    });

    chartb.render();
}

function render_a(Load_sys , NoLoad_sys ){
    var chart = new CanvasJS.Chart("chart_a", {
        animationEnabled: true,
        title: {
            text: "Dimuat Oleh Sistem",
            fontSize: 13
        },
        data: [{
            type: "pie",
            click: explodePie,
            reversed: true,
            showInLegend: true,
            legendText: "{label}",
            indexLabel: "{label} {y}",
            dataPoints: [
                {y: Load_sys , label: "Dimuat Sistem", color : color[0]},
                {y: NoLoad_sys , label: "Belum Dimuat", color : color[1]},
            ]
        }]
    });

    chart.render();
}

$("#btn_view").click(function() {
    var mod_id = ($('#S_MODUL').select2('data')[0].id);
    var sub_mod_id = ($('#S_SUBMODUL').select2('data')[0].id);
    //var type = ($('#S_TYPEJAWABAN').select2('data')[0].id); // -> Object select untuk pilih
    //================================================================
    //-1 untuk semua jenis jawaban (BENAR / SALAH)                  =
    // 1 untuk jenis jawaban BENAR SAJA                              =   
    // 1 untuk jenis jawaban SALAH SAJA                              =
    //================================================================
    $.ajax({
        url: $("#urlPath").val() + "/ReportQuestionQuality/ReadAnalyze",
        type: "POST",
        data : {
            s_modulid :mod_id,
            s_type : 1,
            s_sub_module_id : sub_mod_id
        },
        success: function (respon) {
            if ( $.fn.DataTable.isDataTable('#tbl_yay') ) {
                $('#tbl_yay').DataTable().destroy();
                datatabel(respon.data);
            }else{
                datatabel(respon.data);
            }

            RenderChartCapaian(respon.data);

            if($('#d_result').is(":hidden")){
                $('#chart_capaian_soal , #d_result').removeAttr('hidden');
            }
        }
    });
});

$("#S_MODUL").change(function() {
    var MODL_ID = ($(this).val());

    $('#S_SUBMODUL option:not(:first)').remove();

    $.ajax({
        type: 'POST',
        url: $("#urlPath").val() + '/PilihanGanda/dropdownSubmodul',
        cache: false,
        data: {
            modul_ids: MODL_ID
        },
        success: function(data) {

            $.each(data.Data, function(key, value) {
                $("#S_SUBMODUL").append("<option value='" + value.MODULE_SUB_ID + "'>" + value.MODULE_SUB_NAME + "</option>");
            });

        }
    });
});

function explodePie(e) {
	for(var i = 0; i < e.dataSeries.dataPoints.length; i++) {
		if(i !== e.dataPointIndex)
			e.dataSeries.dataPoints[i].exploded = false;
	}
}

function dropdown_examtype() {
    $.ajax({
        type: 'POST',
        cache: false,
        url: $("#urlPath").val() + '/ReportQuestionQuality/GetExamType',
        success: function(data) {
            var sources = data.result;  
            $.each(sources, function(key, value) {
                $("#EXAM_TYPE").append("<option value='" + value.JENIS_UJIAN_CODE + "'>" + value.JENIS_UJIAN_DESC + "</option>");
            });

            $("#EXAM_TYPE").select2();
        }
    });
}

function dropdown_module() {
    $.ajax({
        type: 'POST',
        url: $("#urlPath").val() + '/ReportQuestionQuality/DropdownModul',
        success: function(data) {
            $.each(data.Data, function(key, value) {
                $("#S_MODUL").append("<option value='" + value.MODULE_ID + "'>" + value.MODULE_NAME + "</option>");
            });

            $("#S_MODUL , #S_SUBMODUL").select2();

        }
    });
}

function RenderChartCapaian(datasource){
    $('#chart_capaian_soal').empty();
    var Mydata = new Array();

    var type = ["Dimuat Sistem","Dijawab Benar"];
    var color = ['#E74C3C','#2ecc71'];

    for (var i = 0; i < type.length; i++) {
        Mydata[i] = new Array();
        if(i == 0){
            for (var h = 0; h < datasource.length; h++) {
                Mydata[i].push({
                    y: datasource[h].LOAD_BY_SYS,
                    label : h + 1,
                    soal : datasource[h].QUESTION_CONTENT,
                    color : color[i]
                });
            }
        }else if(i == 1){
            for (var h = 0; h < datasource.length; h++) {
                Mydata[i].push({
                    y: datasource[h].MUNCUL,
                    label : h + 1,
                    soal : datasource[h].QUESTION_CONTENT,
                    color : color[i]
                });
            }
        }
    }

    var ChartSeries = new Array();

    for (var l = 0; l < type.length; l++) {
        ChartSeries.push({
            type: "splineArea",
            name: type[l],
            color : color[l],
            showInLegend: true,
            yValueFormatString: "#,##0",
            legendText: type[l],
            dataPoints: Mydata[l]
        });
    }

    var chart = new CanvasJS.Chart("chart_capaian_soal", {
        animationEnabled: true,
        title:{
            text: "Analisa Soal"
        },
        width : 900,
        height: 230,
        axisY :{
            includeZero: true
        },
        toolTip: {
            shared: true
        },
        legend: {
            fontSize: 13
        },
        data: ChartSeries
    });
    chart.render();
}

var groupColumn = 2;
function datatabel(datasource){
    var tables = $("#tbl_yay").DataTable({
        data : datasource,
        columns: [
            {
                data : null,
                class : 'text-center',
                width: "8%"
            },
            {
                data: "QUESTION_CONTENT",
                width: "50%"
            },
            {
                data: "MODULE_SUB_NAME",
                width: "18%"
            },
            {
                data: "MUNCUL",
                class : 'text-center',
                width: "12%"
            },
            {
                data: "LOAD_BY_SYS" ,
                class : 'text-center',
                width: "13%"
            },
        ],
        columnDefs : [

        ],
        "order": [[ groupColumn, 'asc' ]],
        "displayLength": 25,
        "drawCallback": function ( settings ) {
            var api = this.api();
            var rows = api.rows( {page:'current'} ).nodes();
            var last=null;
 
            api.column(groupColumn, {page:'current'} ).data().each( function ( group, i ) {
                if ( last !== group ) {
                    $(rows).eq( i ).before(
                        '<tr class="group"><td colspan="5">'+group+'</td></tr>'
                    );
 
                    last = group;
                }
            } );
        },
        "rowCallback": function( row, data, index ) {
            if ( data.ISCORRECT == 1 ) {
                $("td:eq(3)", row).css('background-color','#BAF0BF').addClass('text-center');
            }else{
                $("td:eq(3)", row).css('background-color','#FF6347').addClass('text-center');
            }
          }
    });

    tables.on('order.dt search.dt', function () {
        tables.column(0, {search:'applied', order:'applied'}).nodes().each( function (cell, i) {
            cell.innerHTML = i+1;
        });
    }).draw();
}

