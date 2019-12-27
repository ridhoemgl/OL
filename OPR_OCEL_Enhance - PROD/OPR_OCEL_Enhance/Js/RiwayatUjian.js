$( document ).ready(function() {
    loadGrid();
});

function loadGrid(){
    //console.log(s_position_code+" "+ s_module+" "+ s_Egi+" "+ s_type_soal+" "+ s_ujian_code);
    //REFRESH GRID SEBELUM DI LOAD
    if ($("#gridHistory").data().kendoGrid != null) {
        $("#gridHistory").data().kendoGrid.destroy();
        $("#gridHistory").empty();
    }

    $("#gridHistory").kendoGrid({
        toolbar: ["excel","pdf"],
        excel: {
            fileName: "Data Karyawan Telah Ujian.xlsx",
            filterable: true
        },
        pdf: {
            allPages: true,
            avoidLinks: true,
            paperSize: "A4",
            margin: { top: "2cm", left: "1cm", right: "1cm", bottom: "1cm" },
            landscape: true,
            repeatHeaders: true,
            template: $("#page-template").html(),
            scale: 0.8
        },
        dataSource: {
            type: "json",
            group: [{ field: "STUDENT_ID", aggregates: [{ field: "REGISTRATION_ID", aggregate: "count" }] }, { field: "REGISTRATION_ID" }],
            transport: {
                read: {
                    url: $("#urlPath").val() + "/HistoricalExamDetails/AjaxGetHistory",
                    contentType: "application/json",
                    type: "POST",
                    cache: false,
                },
                parameterMap: function (data, operation) {
                    return kendo.stringify(data);
                }
            },
            scrollable:true,
            pageSize: 30,
            groupable: true,
            serverPaging: true,
            serverFiltering: true,
            serverSorting: true,
            dataBound: function (e) {
                var grid = this;
                $(".k-grouping-row").each(function (e) {
                    grid.collapseGroup(this);
                });
            },
            schema: {
                data: "Data",
                total: "Total",
                model: {
                    id: "RECORD_ID",
                    fields: {
                        RECORD_ID: { type: "string", filterable: true, sortable: true, editable: false },
                        TYPE_DESC: { type: "string", filterable: true, sortable: true, editable: false },
                        STUDENT_ID: { type: "string", filterable: true, sortable: true, editable: false },
                        PARTICIPANT_NAME: { type: "string", filterable: true, sortable: true, editable: false },
                        CERTIFICATOR_ID: { type: "string", filterable: true, sortable: true, editable: false },
                        CERTIFICATOR_NAME: { type: "string", filterable: true, sortable: true, editable: false },
                        REGISTRATION_ID: { type: "string", filterable: true, sortable: true, editable: false },
                        DSTRCT_CODE: { type: "string", filterable: true, sortable: true, editable: false },
                        EGI: { type: "string", filterable: true, sortable: true, editable: false },
                        DEPARTMENT: { type: "string", filterable: true, sortable: true, editable: false },
                        PERIOD: { type: "number", filterable: true, sortable: true, editable: false },
                        POSITION_CODE: { type: "string", filterable: true, sortable: true, editable: false },
                        NUMBER_OF_QUESTION: { type: "number", filterable: true, sortable: true, editable: false },
                        DURATION_MINUTE: { type: "number", filterable: true, sortable: true, editable: false },
                        PASSING_GRADE_PERCENT: { type: "number", filterable: true, sortable: true, editable: false },
                        RANDOMIZED_ANSWER: { type: "boolean", filterable: true, sortable: true, editable: false },
                        IS_SELF_ASSESMENT: { type: "boolean", filterable: true, sortable: true, editable: false },
                        REGISTRATION_DATE: { type: "date", filterable: true, sortable: true, editable: false },
                        EXAM_FINISH_TIME: { type: "datetime", filterable: true, sortable: true, editable: false },
                        EXAM_COMP_ID: { type: "string", filterable: true, sortable: true, editable: false },
                        EXAM_STATUS: { type: "number", filterable: true, sortable: true, editable: false },
                        EXAM_SCORE: { type: "number", filterable: true, sortable: true, editable: false },
                        EVENT_ID: { type: "string", filterable: true, sortable: true, editable: false },
                        EVENT_DESC: { type: "string", filterable: true, sortable: true, editable: false },
                        PERCENT_COMPLETE: { type: "number", filterable: true, sortable: true, editable: false },
                        REMINDING_TIME: { type: "number", filterable: true, sortable: true, editable: false },
                        UPDATE_REMINDING_TIME: { type: "datetime", filterable: true, sortable: true, editable: false },
                        EXAM_START_DATE: { type: "date", filterable: true, sortable: true, editable: false },
                        QUESTION_TYPE: { type: "number", filterable: true, sortable: true, editable: false },
                        SUB_MODULE_ID: { type: "number", filterable: true, sortable: true, editable: false },
                        EXAM_TYPE: { type: "number", filterable: true, sortable: true, editable: false },
                        EXAM_LOCATIONS: { type: "string", filterable: true, sortable: true, editable: false },
                        TEST_CENTER_ID: { type: "string", filterable: true, sortable: true, editable: false },
                        MODULE_NAME: { type: "string", filterable: true, sortable: true, editable: false },
                        JENIS_UJIAN_DESC: { type: "string", filterable: true, sortable: true, editable: false },
                        MODULE_ID: { type: "string", filterable: true, sortable: true, editable: false }
                    }
                }
            }
        },
        reorderable: true,
        resizable: true,
        filterable: true,
        columnMenu: true,
        pageable: {
            refresh: true,
            buttonCount: 10,
            input: true,
            pageSizes: [10, 50, 100, 200, 300, 400, 500,1000,2000],
            info: true
        },
        //toolbar: ["create"],
        columns: [
            {
                command: [{
                    name: "render-data",
                    text: "<span class='k-icon k-i-close'></span>Lihat",
                    click: grid_Render
                }],
                title: "Render",
                width: "90px"
            },
            {
                title: "No.",
                width: "50px",
                template: "#= ++rowNo #",
                filterable: false,
                sortable: false,
                editable: false,
                attributes: { style: "text-align: center" },
                locked: true,
                lockable: false,
            },
            {
                field: "STUDENT_ID",
                title: "NRP Peserta",
                template: "#=STUDENT_ID#",
                width: "100px",
                attributes: { style: "text-align: left" },
                locked: true,
                lockable: false
            },
            {
                field: "TYPE_DESC",
                title: "Jenis Soal",
                template: "#=TYPE_DESC#",
                width: "110px",
                attributes: { style: "text-align: left" },
                locked: true,
                lockable: false,
            },{
                field: "PARTICIPANT_NAME",
                title: "Nama Peserta",
                template: "#=PARTICIPANT_NAME#",
                width: "100px",
                attributes: { style: "text-align: left" },
                locked: true,
                lockable: false,
            },
            {
                field: "POSITION_DESC",
                title: "Posisi Jabatan",
                template: "#=POSITION_DESC#",
                width: "120px",
                attributes: { style: "text-align: left" }
            },
            {
                field: "CERTIFICATOR_ID",
                title: "NRP Sertifikator",
                template: "#=CERTIFICATOR_ID#",
                width: "100px",
                attributes: { style: "text-align: left" }
            },
            {
                field: "CERTIFICATOR_NAME",
                title: "Nama Sertifikator",
                width: "120px",
                attributes: { style: "text-align: left" }
            },
            {
                field: "REGISTRATION_ID",
                title: "Kode Registrasi",
                template: "#=REGISTRATION_ID#",
                width: "100px",
                attributes: { style: "text-align: left" }
            },
            {
                field: "JENIS_UJIAN_DESC",
                title: "Jenis Ujian",
                width: "100px",
                attributes: { style: "text-align: left" }
            },
            {
                field: "NUMBER_OF_QUESTION",
                title: "Jumlah Soal",
                template: "#=NUMBER_OF_QUESTION#",
                width: "90px",
                attributes: { style: "text-align: center" }
            },
            {
                field: "PASSING_GRADE_PERCENT",
                title: "Nilai Minimal",
                template: "#=PASSING_GRADE_PERCENT#",
                width: "100px",
                attributes: { style: "text-align: center" }
            },
            {
                field: "MODULE_NAME",
                title: "Nama Modul",
                template: "#=MODULE_NAME#",
                width: "170px",
                attributes: { style: "text-align: left" }
            },
            {
                field: "REGISTRATION_DATE",
                title: "Tanggal Registrasi",
                filterable: {
                    ui: "datetimepicker"
                },
                template: "#=  (REGISTRATION_DATE == null)? '' : kendo.toString(kendo.parseDate(REGISTRATION_DATE, 'yyyy-MM-dd'), 'dd/MM/yyyy') #",
                width: "130px",
                attributes: { style: "text-align: center" }
            },
            {
                field: "EXAM_ACTUAL_DATE",
                title: "Pengerjaan Aktual",
                template: "#=EXAM_ACTUAL_DATE#",
                width: "140px",
                attributes: { style: "text-align: center" }
            },
            {
                field: "EXAM_FINISH_TIME",
                title: "Tanggal Selesai",
                filterable: {
                    ui: "datetimepicker"
                },
                template: "#=  (EXAM_FINISH_TIME == null)? '' : kendo.toString(kendo.parseDate(EXAM_FINISH_TIME, 'yyyy-MM-dd  h:mm:ss'), 'dd/MM/yyyy  h:mm:ss') #",
                width: "130px",
                attributes: { style: "text-align: left" }
            },
            {
                field: "EVENT_DESC",
                title: "Sesi Ujian",
                template: "#=EVENT_DESC#",
                width: "220px",
                attributes: { style: "text-align: left" }
            },
            {
                field: "TEST_CENTER_ID",
                title: "Lokasi Ujian",
                width: "90px",
                attributes: { style: "text-align: center" }
            },
            {
                field: "EXAM_SCORE",
                title: "Nilai",
                width: "90px",
                attributes: { style: "text-align: center" }
            }

            
        ],
        dataBinding: function () {
            window.rowNo = (this.dataSource.page() - 1) * this.dataSource.pageSize();
        }
    });
}

function grid_Render(e){
    e.preventDefault();
    var data = this.dataItem($(e.currentTarget).closest("tr"));
    var nrp = data.STUDENT_ID;

    $("#gridHistory").hide(500 , function(){
        $('#row_h').show(400,function(){
            $.ajax({
                type: "POST",
                url: $("#urlPath").val() + "/HistoricalExamDetails/GetAnalizeOn_Participan",
                data: {
                    Q_TYPE : data.QUESTION_TYPE,
                    NRP : data.STUDENT_ID,
                    MODULE_id : data.MODULE_ID,
                    SESI : data.EVENT_ID,
                    REG_ID : data.REGISTRATION_ID
                },
                cache: false,
                success: function(response){
                    if(data.error){
                        $.alert({
                            title: data.hearder,
                            content: data.remarks+"<br>"+data.error_message,
                            icon: 'fa fa-exclamation-triangle',
                            theme: 'modern',
                            type: data.type
                        });
                    }else{
                        if(response.MULTIPLECHOISE == true){
                            ChartRender(response.data , nrp , data.TYPE_DESC);
                            PushToTableBody(response.data , data.NUMBER_OF_QUESTION , response.Val_be_onAfter , response.Val_be_onBefore);
                        }else{
                            ChartRenderEssay(response.data , nrp , data.TYPE_DESC , response.MaxMultiply);
                            PushToTableBodyEssay(response.data , response.Jumlah_Soal , response.Val_be_onAfter , response.Should_be_onBefore , response.MaxMultiply);
                        }   

                        $('#lbl_name').text(data.PARTICIPANT_NAME);
                        $('#lbl_distrik_asal').text(data.DSTRCT_CODE);
                        $('#lbl_registration_number').text(data.REGISTRATION_ID);
                        $('#lbl_jabatan').text(data.POSITION_DESC);
                        $('#lbl_departemen').text(data.DEPARTMENT);
                        $('#lbl_Examval').text(data.EXAM_SCORE);
                        $('#lbl_egi').text(data.EGI);
                        $('#lbl_percent').text(data.PERCENT_COMPLETE);
                        $('#lbl_jQuest').text(data.NUMBER_OF_QUESTION);
                        $('#lbl_ModuleName').text(data.MODULE_NAME);
                        $('#lbl_registered').text(kendo.parseDate(data.REGISTRATION_DATE), "yyyy/MM/dd", "id-ID");
                        $('#lbl_actualdate').text(data.EXAM_ACTUAL_DATE);
                        $('#lbl_finish').text(kendo.parseDate((data.EXAM_FINISH_TIME), "yyyy/MM/dd", "id-ID"));
                    }
                }
              });
        });
    });
}

function PushToTableBody(param_data , NUMBER_OF_QUESTION , Val_be_onAfter , Val_be_onBefore){
    var Temp_body = "";
    var Jumlah_data = param_data.length / 2;
    var Jumlah_Benar = 0;
    $("#tbd_analize").empty();

    var Before_Weigh = 0;
    var After_Weigh = 0;

    $('#lbl_bobotNilai').html("<b>"+param_data[0].WEIGHT+"</b>");
    $('#text_ubah').text('Jml. Soal Didapat');
    
    for(var i = 0; i < Jumlah_data; i++){
        if(param_data[i].IS_COUNT_BY_SYS == 0){
            Temp_body += "<tr>";
            Temp_body += "<td>"+ param_data[i].MODULE_SUB_NAME +"</td>";

            //------------------------------------------------------------------------------------------------
            var k = i + Jumlah_data;

            var Value_BeforeWeighting = ((param_data[i].TOT_VALUE/param_data[k].TOT_VALUE) * 100);
            var Value_AfterWeighting = ((param_data[i].AFTER_WEIGHTING/param_data[k].AFTER_WEIGHTING) * 100) * (param_data[0].WEIGHT / 100);

            Before_Weigh += Value_BeforeWeighting;
            After_Weigh += Value_AfterWeighting;
            Jumlah_Benar += param_data[i].COUNT_QUESTION;
            Temp_body += "<td class='text-center' bgcolor='ecffe6'>"+ param_data[k].COUNT_QUESTION +"</td>";
            Temp_body += "<td class='text-center'>"+ param_data[i].COUNT_QUESTION +"</td>";
            Temp_body += "<td bgcolor='#ffeecc' class='text-center'>"+ Value_BeforeWeighting.toFixed(2) +"</td>";
            Temp_body += "</tr>"; 
        }else{
            break;
        }
    }

    var Final_Before = ((Jumlah_Benar/NUMBER_OF_QUESTION) *100).toFixed(2); //(Before_Weigh / Jumlah_data);
    var Final_After= (After_Weigh / Jumlah_data);

    Temp_body += "<tr>";
    Temp_body += "<td bgcolor='#ffff80'><b>TOTAL NILAI :</b> </td>";
    Temp_body += "<td class='text-center'>"+ NUMBER_OF_QUESTION +"</td>"; 
    Temp_body += "<td class='text-center'>"+ Jumlah_Benar +"</td>"; 
        Temp_body += "<td class='text-center'>"+ Final_Before +"</td>";
    Temp_body += "</tr>";

    $('#lbl_beforeWeight').text(Final_Before);
    //$('#lbl_afterWeight').text(Final_After.toFixed(2));
    $('#lbl_afterWeight').text(Final_Before);
    $("#tb_analyze_info tbody").append(Temp_body);
}

function PushToTableBodyEssay(param_data , Jumlah_Soal , Val_be_onAfter , Should_be_onBefore , MaxMultiply){
    var Temp_body = "";

    $("#tbd_analize").empty();

    var Before_Weigh = 0;
    var After_Weigh = 0;

    var Jumlah_data = param_data.length;

    $('#lbl_bobotNilai').html("<b>"+param_data[0].WEIGHT+"</b>");
    $('#text_ubah').text('Skor Maksimal');
    for(var i = 0; i < Jumlah_data; i++){
        if(param_data[i].IS_COUNT_BY_SYS == 0){
            Temp_body += "<tr>";
            Temp_body += "<td>"+ param_data[i].MODULE_SUB_NAME +"</td>";

            //------------------------------------------------------------------------------------------------

            var Value_BeforeWeighting = param_data[i].TOT_VALUE;

            var Value_AfterWeighting = param_data[i].AFTER_WEIGHTING / (Jumlah_Soal * MaxMultiply) * 100;

            Before_Weigh += Value_BeforeWeighting;
            After_Weigh += Value_AfterWeighting;

            Temp_body += "<td class='text-center' bgcolor='ecffe6'>"+ (param_data[i].COUNT_QUESTION * MaxMultiply)  +"</td>";
            Temp_body += "<td class='text-center'>"+ param_data[i].COUNT_QUESTION +"</td>";
            Temp_body += "<td bgcolor='#ffeecc' class='text-center'>"+ Value_BeforeWeighting.toFixed(2) +"</td>";
            Temp_body += "</tr>"; 
        }else{
            break;
        }
    }

    Temp_body += "<tr>";
    Temp_body += "<td colspan='2' bgcolor='#ffff80'><b>TOTAL NILAI :</b> </td>";
    Temp_body += "<td class='text-center'>"+ Jumlah_Soal +"</td>";
    Temp_body += "<td class='text-center'>"+ Before_Weigh.toFixed(2) +"</td>";
    Temp_body += "</tr>";

    $('#lbl_beforeWeight').text(Before_Weigh.toFixed(2));
    $('#lbl_afterWeight').text(After_Weigh.toFixed(2));
    $("#tb_analyze_info tbody").append(Temp_body);
}

$('#btn_PrintPage').on('click',function(){
    $('#mobile-collapse').click();
    $('#inline_breadcumb , #btn_BackAgain , #btn_PrintPage , #bread_path').hide();
    window.onafterprint = function(e){
        $(window).off('mousemove', window.onafterprint);
    };
    
    window.print();
    
    setTimeout(function(){
        $(window).one('mousemove', window.onafterprint);
        $('#mobile-collapse').click();
        $('#inline_breadcumb , #btn_BackAgain , #btn_PrintPage , #bread_path').show();
    }, 1);
});



$( "#btn_BackAgain" ).click(function() {
    $('#chartContainer').empty();
    $('#tb_analyze_info tbody').empty();
    $("#tbd_analize").empty();

    $('#row_h').hide(500, function() {
        $('#gridHistory').show();
    });
});

function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
}

function ChartRender(dt_ , nrp , jenis_soal){
    var Mydata = [
        []
    ];

    var Row;
    var ISCORRECT_TYPE = 2;
    if((dt_.length % 2) == 0){
        Row = dt_.length / 2;

        var z = 0;
        for (var i = 1; i <= ISCORRECT_TYPE; i++) {
            //console.log("Nilai i = "+ i);
            for (var h = z; h < (i * Row); h++) {
                Mydata[i-1].push({
                    y: dt_[h].COUNT_QUESTION,
                    label : dt_[h].MODULE_SUB_NAME
                });
                z++;
            }
            Mydata.push(new Array());
        }
    }else{
        Row = dt_.length;
        ISCORRECT_TYPE = 0;
    }
    
    Mydata.splice(-1,1);

    var ChartSeries = [];
    var TypeAnswer = ["Jml. Soal Benar","Jml. Soal Yang Diujikan"];
    var colos = ["#00e600","#ff5c33"];

    for (var l = 1; l >= 0; l--) {
        ChartSeries.push({
            type: "bar",
            name: TypeAnswer[l],
            showInLegend: true,
            color: colos[l],
            dataPoints: Mydata[l]
        });
    }

    $('#chartContainer').empty();
    var chart = new CanvasJS.Chart("chartContainer", {
        animationEnabled: true,
        zoomEnabled: true,
        exportEnabled: true,
        theme: "light",
        fillOpacity: .3,
        exportFileName: "Analisa Jawaban NRP " + nrp,
        title:{
            text: "Hasil Uji Kopentensi Soal Jenis " + jenis_soal,
            fontSize: 20
        },
        axisY: {
            title: "Jumlah"
        },
        legend: {
            cursor:"pointer",
            itemclick : toggleDataSeries
        },
        toolTip: {
            shared: true,
            content: toolTipFormatter
        },
        data: ChartSeries
    });

    chart.render();
}

function ChartRenderEssay(dt_ , nrp , jenis_soal , MaxMultiply){

    var Mydata = [
        []
    ];

    for (var i = 1; i <= 1; i++) {
        for (var h = 0; h < dt_.length; h++) {
            Mydata[i-1].push({
                y: (dt_[h].TOT_VALUE / (dt_[h].COUNT_QUESTION * MaxMultiply)) * 100,
                label : dt_[h].MODULE_SUB_NAME
            });
        }
        Mydata.push(new Array());
    }
    
    Mydata.splice(-1,1);

    var ChartSeries = [];

    for (var l = 0; l < 1; l++) {
        ChartSeries.push({
            type: "bar",
            name : "Data",
            showInLegend: true,
            dataPoints: Mydata[l]
        });
    }
    
    $('#chartContainer').empty();
    var chart = new CanvasJS.Chart("chartContainer", {
        animationEnabled: true,
        zoomEnabled: true,
        exportEnabled: true,
        theme: "light",
        fillOpacity: .3,
        exportFileName: "Analisa Jawaban NRP " + nrp,
        title:{
            text: "Hasil Uji Kompetensi Jenis Soal "+ jenis_soal,
            fontSize: 20
        },
        axisY: {
            title: "Jumlah"
        },
        legend: {
            cursor:"pointer",
            itemclick : toggleDataSeries
        },
        toolTip: {
            shared: true,
            content: toolTipFormatter
        },
        data: ChartSeries
    });

    chart.render();
}

function printData() {
    var divToPrint = document.getElementById('container_content');
    var htmlToPrint = '' +
        '<style type="text/css">' +
        'table th, table td {' +
        'border:1px solid #000;' +
        'padding;0.5em;' +
        '}' +
        '</style>';
    htmlToPrint += divToPrint.outerHTML;
    newWin = window.open("");
    newWin.document.write("<h3 align='center'>Print Page</h3>");
    newWin.document.write(htmlToPrint);
    newWin.print();
    newWin.close();
    }

function toolTipFormatter(e) {
	var str = "";
	var total = 0 ;
	var str3;
	var str2 ;
	for (var i = 0; i < e.entries.length; i++){
		var str1 = "<br><span style= 'color:"+e.entries[i].dataSeries.color + "'>" + e.entries[i].dataSeries.name + "</span>: <strong>"+  e.entries[i].dataPoint.y + "</strong> <br/>" ;
		total = e.entries[i].dataPoint.y + total;
		str = str.concat(str1);
	}
	str2 = "<strong>" + e.entries[0].dataPoint.label + "</strong>";
	return (str2.concat(str));
}

function toggleDataSeries(e) {
	if (typeof (e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
		e.dataSeries.visible = false;
	}
	else {
		e.dataSeries.visible = true;
	}
	chart.render();
}