$(document).ready(function () {
    window.moveTo(0, 0);
    window.resizeTo(screen.availWidth, screen.availHeight);
    var module_id = $('#en_modul_id').val();
    var registration_id = $('#en_reg').val();

    //console.log("NRP : "+nrp+" REG : "+registration_id);
    //load_data(nrp , registration_id);
    $.ajax({
        url: $('#url').val() + "/ResultsExam/GetDataUjian",
        type: "POST",
        data: {
            REG : registration_id
        },
        success: function(my_response) {
            if(my_response.size == 0){
                $("#detail_rport").append("<h3>Maaf Kode Url Salah, data tidak bisa kami informasikan</h3>");
            }else{
                var data_source = my_response.RegistrationData;
                //console.log(data_source);
                $.each(data_source, function (index, value_data) {
                    $.ajax({
                        type: "POST",
                        url: $('#url').val() + "/HistoricalExamDetails/GetAnalizeOn_Participan",
                        data: {
                            Q_TYPE : value_data.QUESTION_TYPE,
                            NRP : value_data.STUDENT_ID,
                            MODULE_id : module_id,
                            SESI : value_data.EVENT_ID,
                            REG_ID : value_data.REGISTRATION_ID
                        },
                        cache: false,
                        success: function(response){
                            if(response.MULTIPLECHOISE == true){
                                PushToTableBody(response.data , data_source.NUMBER_OF_QUESTION , response.Val_be_onAfter , response.Val_be_onBefore, value_data.TYPE_DESC);
                            }else{
                                console.log(response);
                                PushToTableBodyEssay(response.data , response.Jumlah_Soal , response.Val_be_onAfter , response.Should_be_onBefore , response.MaxMultiply , value_data.TYPE_DESC, response.MaxMultiply);
                            }
                        }
                    });
                });
            }
        }
    });

    $("#btn_pdf").click(function() {
        $(this).hide();
        window.print();
    });
    
});

function PushToTableBody(param_data , NUMBER_OF_QUESTION , Val_be_onAfter , Val_be_onBefore , jenis_soal){
    var Temp_body = "<label style='font-size:0.8em;'> Jenis soal : "+ jenis_soal +" (BOBOT "+param_data[0].WEIGHT+" %)</label><br><br>";
    Temp_body += "<table style='font-size:0.7em; width:100%' border='1'>";
    Temp_body += "<thead>";
    Temp_body += "<tr>";
    Temp_body += "<td>Kompetensi</td>";
    Temp_body += "<td class='text-center'>Jumlah Soal Didapatkan</td>";
    Temp_body += "<td class='text-center'>Jumlah Soal Benar</td>";
    Temp_body += "<td bgcolor='#ffcc66' class='text-center'>Skor Aktual</td>";
    Temp_body += "</tr>";
    Temp_body += "</thead>";

    var Jumlah_data = param_data.length / 2;

    var Before_Weigh = 0;
    var After_Weigh = 0;
    var jumlahdidapatkan = 0;
    var jum_soal = 0;
    for(var i = 0; i < Jumlah_data; i++){
        if(param_data[i].IS_COUNT_BY_SYS == 0){
            Temp_body += '<tbody>';
            Temp_body += "<tr>";
            Temp_body += "<td>"+ param_data[i].MODULE_SUB_NAME +"</td>";

            //------------------------------------------------------------------------------------------------
            var k = i + Jumlah_data;

            if(param_data[k]){
                var Value_BeforeWeighting = ((param_data[i].TOT_VALUE/param_data[k].TOT_VALUE) * 100);
                var Value_AfterWeighting = ((param_data[i].AFTER_WEIGHTING/param_data[k].AFTER_WEIGHTING) * 100) * (param_data[0].WEIGHT / 100);

                Before_Weigh += Value_BeforeWeighting;
                After_Weigh += Value_AfterWeighting;
                jum_soal += param_data[k].COUNT_QUESTION;
                jumlahdidapatkan += param_data[i].COUNT_QUESTION;
                Temp_body += "<td class='text-center' bgcolor='ecffe6'>"+ param_data[k].COUNT_QUESTION +"</td>";
                Temp_body += "<td class='text-center'>"+ param_data[i].COUNT_QUESTION +"</td>";
                Temp_body += "<td bgcolor='#ffeecc' class='text-center'>"+ Value_BeforeWeighting.toFixed(2) +"</td>";
                Temp_body += "<td bgcolor='#ffeecc' class='text-center'>"+Value_AfterWeighting.toFixed(2)+"</td>";
                Temp_body += "</tr>"; 
            }
        }else{
            break;
        }
    }

    var Final_Before = ((jumlahdidapatkan/jum_soal) *100).toFixed(2);// (Before_Weigh / Jumlah_data);
    var Final_After= (After_Weigh / Jumlah_data);

    Temp_body += "<tr>";
    Temp_body += "<td bgcolor='#ffff80'><b>TOTAL NILAI :</b> </td>";
    Temp_body += "<td class='text-center'>"+ jum_soal +"</td>";
    Temp_body += "<td class='text-center'>"+ jumlahdidapatkan +"</td>";
    Temp_body += "<td class='text-center'>"+ Final_Before+"</td>";
    Temp_body += "<td class='text-center'>"+ Final_After+"</td>";
    Temp_body += "</tr>";
    Temp_body += "</tbody>";
    Temp_body += "</table>";
    Temp_body += "<br>";

    $("#detail_rport").append(Temp_body);
}

function PushToTableBodyEssay(param_data , Jumlah_Soal , Val_be_onAfter , Should_be_onBefore , MaxMultiply , jenis_soal, MaxMultiply){
    
    var Temp_body = "<label style='font-size:0.8em;'> Jenis soal : "+ jenis_soal +" (BOBOT "+param_data[0].WEIGHT+" %)</label><br><br>";
    Temp_body += "<table style='font-size:0.7em; width:100%' border='1'>";
    Temp_body += "<thead>";
    Temp_body += "<tr>";
    Temp_body += "<td>Kompetensi</td>";
    Temp_body += "<td class='text-center'>Skor Maksimal</td>";
    Temp_body += "<td class='text-center'>Jumlah Soal Benar</td>";
    Temp_body += "<td bgcolor='#ffcc66' class='text-center'>Skor Aktual</td>";
    Temp_body += "<td bgcolor='#ffcc66'>Skor Pembobotan</td>";
    Temp_body += "</tr>";
    Temp_body += "</thead>";

    var Before_Weigh = 0;
    var After_Weigh = 0;

    var Jumlah_data = param_data.length;
    var jumlah_skor_maksimal = 0;

    for(var i = 0; i < Jumlah_data; i++){
        if(param_data[i].IS_COUNT_BY_SYS == 0){
            Temp_body += "<tr>";
            Temp_body += "<td>"+ param_data[i].MODULE_SUB_NAME +"</td>";
            jumlah_skor_maksimal += (param_data[i].COUNT_QUESTION * MaxMultiply);
            //------------------------------------------------------------------------------------------------

            var Value_BeforeWeighting = param_data[i].TOT_VALUE;

            var Value_AfterWeighting = param_data[i].AFTER_WEIGHTING / (Jumlah_Soal * MaxMultiply) * 100;

            Before_Weigh += Value_BeforeWeighting;
            After_Weigh += Value_AfterWeighting;

            Temp_body += "<td class='text-center' bgcolor='ecffe6'>"+ (param_data[i].COUNT_QUESTION * MaxMultiply)  +"</td>";
            Temp_body += "<td class='text-center'>"+ param_data[i].COUNT_QUESTION +"</td>";
            Temp_body += "<td bgcolor='#ffeecc' class='text-center'>"+ Value_BeforeWeighting.toFixed(2) +"</td>";
            Temp_body += "<td bgcolor='#ffeecc' class='text-center'>"+ Value_AfterWeighting.toFixed(2) +"</td>";
            Temp_body += "</tr>"; 
        }else{
            break;
        }
    }

    Temp_body += "<tr>";
    Temp_body += "<td bgcolor='#ffff80'><b>TOTAL NILAI :</b> </td>";
    Temp_body += "<td class='text-center'>"+ jumlah_skor_maksimal +"</td>";
    Temp_body += "<td class='text-center'>"+ Jumlah_Soal +"</td>";
    Temp_body += "<td class='text-center'>"+ Before_Weigh.toFixed(2) +"</td>";
    Temp_body += "<td class='text-center'>"+After_Weigh.toFixed(2)+"</td>";
    Temp_body += "</tr>";
    Temp_body += "</tbody>";
    Temp_body += "</table>";
    Temp_body += "<br>";

    $("#detail_rport").append(Temp_body);
}