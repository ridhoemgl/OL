
$( document ).ready(function() {
    // $.ajax({
    //     type: "POST",
    //     url: $("#urlPath").val() + "/Weighting/GetNlaiBobot",
    //     success: function(rs){
    //         var data_loop = rs.data;
    //         console.log(data_loop);
    //         var Tempt = "";
    //         $.each(data_loop, function (k, v) {
    //             Tempt += "<div class='form-group row'>";
    //             Tempt += "<label for=D"+ v.TYPE_CODE +" class='col-sm-8 col-form-label'>"+ v.TYPE_DESC +"</label>";
    //             Tempt += "<div class='col-sm-4'>";
    //             Tempt += "<input type='text' class='form-control' id='D"+ v.TYPE_CODE +"' value='"+v.WEIGHT+"'>";
    //             Tempt += "</div></div>";
    //         });

    //         $("#d_Container").append(Tempt);
    //     }
    //   });

    $( "#btn_ok" ).click(function() {
        $.confirm({
            icon: 'fa fa-question',
            title: 'KONFIRMASI',
            content: 'Anda akan mengubah data pembobotan ini ?',
            theme: 'material',
            closeIcon: true,
            animation: 'scale',
            type: 'blue',
            backgroundDismissAnimation: 'glow',
            buttons: {
                yes: {
                    isHidden: false,
                    keys: ['y'],
                    action: function(){
                        var Hasils = 0;
                        $('.bobots').each(function(i, obj) {
                            Hasils += parseInt($(this).val());
                        });

                        if(Hasils != 100){
                            $.alert({
                                title: 'Pembobotan Gagal',
                                content: 'Nilai yang Anda masukkan yaitu : '+ Hasils + "<br>"+" Jumlah pembobotan harus berjumlah 100",
                                type: 'red',
                                animation: 'zoom',
                                draggable: true,
                            });
                        }else{
                            var MyJsonData = createJSON();


                            $.ajax({
                                url: $("#urlPath").val() + "/Weighting/InsertBobot",
                                type: "POST",
                                contentType: "application/json; charset=utf-8",
                                dataType: "json",
                                data : JSON.stringify(MyJsonData),
                                success: function(result){
                                    $.alert({
                                        title: result.header,
                                        content: result.body,
                                        theme: 'material',
                                        type: result.type,
                                        animation: 'rotateX',
                                        closeAnimation: 'rotateYR'
                                    });
                                },
                                error: function (error) {
                                    alert("failed in opening Trade Contribs file !!!");
                                }
                            });
                        }
                    }
                },
                no: {
                    keys: ['N'],
                    action: function(){
                        $.alert('You clicked No.');
                    }
                },
            }
        });
    });
});


function createJSON() {
    jsonObj = [];
    $(".bobots").each(function() {

        var TYPE_CODE = parseInt($(this).prop('id'));
        var WEIGHT =  parseInt($(this).val());

        item = {}
        item ["TYPE_CODE"] = TYPE_CODE;
        item ["WEIGHT"] = WEIGHT;

        jsonObj.push(item);
    });

    return jsonObj;
}
