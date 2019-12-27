$(document).ready(function () {
    loadGrid();
});

function loadGrid() {

    //REFRESH GRID SEBELUM DI LOAD
    if ($("#grid_opr").data().kendoGrid != null) {
        $("#grid_opr").data().kendoGrid.destroy();
        $("#grid_opr").empty();
    }

    $("#grid_opr").kendoGrid({
        dataSource: {
            type: "json", //tipe formating
            transport: {
                read: { //tampil
                    url: $("#urlPath").val() + "/AddUser/AjaxReadUserNoDomain",
                    contentType: "application/json",
                    type: "POST",
                    cache: false
                },
                parameterMap: function(data, operation) //parsing biar ke grid
                {
                    return kendo.stringify(data);
                }
            },
            serverPaging: true,
            serverFiltering: true,
            serverSorting: true,
            pageable: true,
            pageSize: 10,
            schema: {
                data: "Data", //jmlh data
                total: "Total", //berapa rows
                model: {
                    id: "EMPLOYEE_ID",
                    fields: {
                        EMPLOYEE_ID: {
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
                        DEPT_CODE_DESC: {
                            type: "string",
                            filterable: true,
                            sortable: true,
                            editable: false
                        },
                        DIV_CODE_DESC: {
                            type: "string",
                            filterable: true,
                            sortable: true,
                            editable: false
                        },
                        EMPLOYEE_NAME: {
                            type: "string",
                            filterable: true,
                            sortable: true,
                            editable: false
                        },
                        POSITION_DESC: {
                            type: "string",
                            filterable: true,
                            sortable: true,
                            editable: false
                        }
                    }
                }

            }

        },
        filterable: true,
        sortable: true,
        editable: true,
        pageable: true,
        scrollable: true,
        pageable: {
            refresh: true,
            buttonCount: 10,
            input: true,
            pageSizes: [10, 20, 50, 100, 1000, 100000],
            info: true,
            messages: {}
        },
        columns: [
            {
                title: "No",
                width: "30px",
                template: "<center> #= ++rowNo # </center>",
                filterable: false
            }, {
                field: "QUESTION_ID",
                hidden: true
            }, {
                field: "EMPLOYEE_ID",
                title: "NRP",
                width: "70px"

            }, {
                field: "DSTRCT_CODE",
                title: "Distrik",
                width: "75px",
                attributes: { style: "text-align: center" }
            }, {
                field: "EMPLOYEE_NAME",
                title: "Nama Karyawan",
                width: "160px"
            }, {
                field: "POSITION_DESC",
                title: "Posisi Jabatan",
                width: "120px"
            }, {
                field: "DEPT_CODE_DESC",
                title: "Departemen",
                width: "110px"
            }, {
                field: "DIV_CODE_DESC",
                title: "Divisi",
                width: "110px"
            }, {
                command: [{
                    name: "register-data",
                    text: "<span class='k-icon k-edit'></span>Register",
                    click: grid_update,
                    attributes: { style: "text-align: center" }
                }],
                title: "Action",
                width: "75px"
            }
        ],
        dataBinding: function() {
            window.rowNo = (this.dataSource.page() - 1) * this.dataSource.pageSize();
        }
    });
}

function grid_update(e){
    e.preventDefault();
    var tr = $(e.target).closest("tr");
    var data = this.dataItem(tr);

    $.ajax({
        type: "POST",
        url: $("#urlPath").val() + "/AddUser/RegisterUserNonDomain",
        data: {
            nrpid : data.EMPLOYEE_ID
        },
        cache: false,
        success: function(data){
            $.alert({
                title: data.header,
                content: data.body,
                animation: 'rotateX',
                type: data.type,
                theme: 'bootstrap',
                closeAnimation: 'rotateXR',
                backgroundDismiss: true,
                buttons: {
                    okay: {
                        text: 'Tutup',
                        btnClass: 'btn-blue',
                        action: function(){
                            $("#grid_opr").data("kendoGrid").dataSource.read();
                        }
                    }
                }
            });

        }
      });
}