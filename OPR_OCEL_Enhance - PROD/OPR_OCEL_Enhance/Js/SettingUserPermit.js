$(document).ready(function () {
    load_main_grid();

    $('#keterangan').tooltip({
        trigger: 'click',
        placement: 'right'
    });

    $('#keterangan').on('click', function () {
        $(this).stackbox({
            closeButton: true,
            position: 'bottom',
            animOpen: 'tada slow',
            content: '#my-content'
        });
    });

    var datasource = null;
    $.ajax({
        type: 'GET',
        url: $("#urlPath").val() + '/SettingUser/getPM',
        success: function (data) {
            datasource = data;

            if (data.status == true) {
                $.each(datasource.result, function (key, value) {
                    $("#drp_posisi").append("<option value='" + value.GP_ID + "'>" + value.Deskripsi + "</option>");
                });

                $.each(datasource.result2, function (key, value) {
                    if (parseInt(value.Id) == 0) {
                        $("#drp_item").append("<option value='" + value.Menu_link + "'>(" + value.Primer + ") " + value.Menu + "</option>");

                        $('#tbl_keterangan tbody').append("<tr>");
                        $('#tbl_keterangan tbody').append("<td class='text-center'>" + value.Menu_link + "</td>");
                            $('#tbl_keterangan tbody').append("<td>" + value.Menu + "</td>");
                        $('#tbl_keterangan tbody').append("</tr>");

                    } else {
                        return false;
                    }
                });

                $('#drp_posisi , #drp_item').selectpicker("refresh");
            } else {
                Swal(
                  'Network Error',
                  'Tidak dapat mendapatkan data posisi dan menu aplikasi',
                  'error'
                )
            }
        }
    });

    $('#btn_act_save').on('click', function () {
        if ($('#drp_posisi').val() && $('#drp_item').val() && $('#drp_subitem').val()) {
            $.confirm({
                title: "Konfirmasi",
                content: 'Anda akan menambahkan pengaturan akses baru ?',
                icon: 'fa fa-info',
                theme: 'material',
                closeIcon: true,
                animation: 'zoom',
                type: 'blue',
                buttons: {
                    yes: {
                        keys: ['y'],
                        action: function () {
                            var datas = $('#drp_subitem').val().join();
                            var primaer = $('#drp_item option:selected').text().replace(/[^\d.]/g, '');

                            $.ajax({
                                type: 'POST',
                                url: $("#urlPath").val() + '/SettingUser/AddActionUser',
                                cache: false,
                                data: {
                                    Primer: (primaer+','+datas),
                                    gp_id: ($('#drp_posisi').val())
                                },
                                success: function (req) {
                                    Swal({
                                        type: req.type,
                                        title: req.hearder,
                                        text: req.remarks
                                    });

                                    $("#griduser_permit").data("kendoGrid").dataSource.read();
                                }
                            });
                        }
                    },
                    no: {
                        keys: ['N'],
                        action: function () {
                            $.alert('You clicked No.');
                        }
                    },
                }
            });
        } else {
            Swal(
              'Kesalahan',
              'Harap Periksa Pemilihan 3 Parameter',
              'error'
            );
        }
        
    });

    $('#drp_item').on('changed.bs.select', function (e, clickedIndex, newValue, oldValue) {
        var selected = $(e.currentTarget).val();
        $('#drp_subitem option:not(:first)').remove();
        var result = datasource.result2;
        var resgp = datasource.gp;

        for (var i = 0; i < result.length; i++) {
            if (result[i].Id == (selected)) {
                $("#drp_subitem").append("<option value='" + result[i].Primer + "'>(Sub Item) " + result[i].Menu + "</option>");
            }
        }
        $('#drp_subitem').selectpicker('refresh')
    });

    $("#btn_act_cancel").click(function () {
         $("#drp_item , #drp_subitem , #drp_posisir").val('default');
        $("#drp_item , #drp_subitem , #drp_posisi").selectpicker("refresh");
    });
});

function setTooltip(message) {
    $('#keterangan').tooltip('hide')
      .attr('data-original-title', message)
      .tooltip('show');
}

function hideTooltip() {
    setTimeout(function () {
        $('#keterangan').tooltip('hide');
    }, 1000);
}

function load_main_grid() {
    $("#griduser_permit").kendoGrid({
        dataSource: {
            type: "json",
            group: [{ field: "LEVEL", aggregates: [{ field: "LEVEL", aggregate: "count" }] }, { field: "Id" }],
            transport: {
                read: {
                    url: $("#urlPath").val() + "/SettingUser/ALlPermissionList",
                    contentType: "application/json",
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
            scrollable: true,
            schema: {
                data: "Data",
                total: "Total",
                model: {
                    id: "Primer",
                    fields: { //semua field tabel/vw dari db
                        Primer: { type: "number", filterable: true, sortable: true, editable: false },
                        Menu: { type: "string", filterable: true, sortable: true, editable: true },
                        GP_ID: { type: "number", filterable: true, sortable: true, editable: true },
                        LEVEL: { type: "string", filterable: true, sortable: true, editable: false },
                        Id: { type: "number", filterable: true, sortable: true, editable: true },
                        Menu_link: { type: "number", filterable: true, sortable: true, editable: true },
                        Link: { type: "string", filterable: true, sortable: true, editable: true },
                        Permission: { type: "string", filterable: true, sortable: true, editable: true },
                        A: { type: "boolean", filterable: true, sortable: true, editable: false },
                        D: { type: "boolean", filterable: true, sortable: true, editable: false },
                        E: { type: "boolean", filterable: true, sortable: true, editable: false },
                        R: { type: "boolean", filterable: true, sortable: true, editable: false }
                    }
                }
            }
        },
        editable: {
            mode: "inline"
        },
        resizable: true,
        sortable: true,
        groupable: true,
        dataBound: function (e) {
            var grid = this;
            $(".k-grouping-row").each(function (e) {
                grid.collapseGroup(this);
            });
        },
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
                title: "No.",
                width: "30px",
                template: "#= ++RecNumerEq #",
                filterable: false,
                sortable: false,
                editable: false,
                attributes: { style: "text-align: center" }
            },
            {
                command: [{
                    name: "remove-data",
                    text: "<span class='k-icon k-i-close'></span>Hapus",
                    click: grid_delete
                }], title: "<center>Action</center>", width: "70px", attributes: { style: "text-align: center" }
            },
             {
                 field: "Menu",
                 title: "Nama Modul Aplikasi",
                 template: "#=Menu#",
                 width: "160px"
             },
            {
                field: "LEVEL",
                title: "Level",
                template: "#=LEVEL#",
                width: "80px",
                attributes: { style: "text-align: left" }
            },
            {
                field: "Link",
                title: "Link Menu Aplikasi",
                template: "#=Link#",
                width: "250px",
                attributes: { style: "text-align: left" }
            }

        ],

        dataBinding: function () {
            window.RecNumerEq = (this.dataSource.page() - 1) * this.dataSource.pageSize();
        }
    });
}

function grid_delete(e) {
    var data = this.dataItem($(e.currentTarget).closest("tr"));
    console.log(data)
    $.confirm({
        title: "Konfirmasi",
        content: 'Anda akan hak akses user untuk menu ini ?',
        icon: 'fa fa-exclamation-triangle',
        theme: 'material',
        closeIcon: true,
        animation: 'zoom',
        type: 'red',
        buttons: {
            yes: {
                keys: ['y'],
                action: function () {
                    $.ajax({
                        type: 'POST',
                        url: $("#urlPath").val() + '/SettingUser/DeleteUserAction',
                        cache: false,
                        data: {
                            Primer: data.Primer,
                            gp_id: data.GP_ID
                        },
                        success: function (req) {
                            Swal({
                                type: req.type,
                                title: req.hearder,
                                text: req.remarks
                            });

                            $("#griduser_permit").data("kendoGrid").dataSource.read();
                        }
                    });
                }
            },
            no: {
                keys: ['N'],
                action: function () {
                    $.alert('You clicked No.');
                }
            },
        }
    });
}