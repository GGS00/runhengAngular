
angular.module('MetronicApp').controller('settingCtrl', function($rootScope, $scope, $stateParams,suppServer,commonUtil) {
    $scope.$on('$viewContentLoaded', function () {
        // initialize core components
        App.initAjax();

        // set default layout mode
        $rootScope.settings.layout.pageContentWhite = true;
        $rootScope.settings.layout.pageBodySolid = false;
        $rootScope.settings.layout.pageSidebarClosed = false;





        $scope.column = [{ field: 'skuName',
            displayName: '商品标题',
            enableCellEdit: true,
            enableCellEditOnFocus:false
        },
            {  field: "spec",
                displayName: '商品信息',
                enableCellEdit: true,
                enableCellEditOnFocus:true
            },
            {  field: "supplierName",
                displayName: '供应商',
                enableCellEdit: true,
                enableCellEditOnFocus:true
            },
            {
                displayName: '成本价',
                cellTemplate:'<input type="text" class="form-control" ng-model="{{row.entity.price}}" placeholder="请填写供应商提供的成本价">'
            },
            {
                displayName: '库存',
                cellTemplate:'<input type="text" class="form-control" ng-model="{{row.entity.qty}}" placeholder="请填写供应商提供的库存">'
            },
            {
                displayName: '操作',
                cellTemplate: '  <a ng-click="showDel({{row.entity.relId}})">删除</a>">绑定供应商</button>'
            }
        ];

        // $scope.initTable = function () {
        //     var table = $('#table');
        //     var oTable =  table.dataTable({
        //         "language": {
        //             "aria": {
        //                 "sortAscending": ": activate to sort column ascending",
        //                 "sortDescending": ": activate to sort column descending"
        //             },
        //             "emptyTable": "没有获取到数据",
        //             "info": "展示 _START_ 到 _END_ 共 _TOTAL_ 行",
        //             "infoEmpty": "找不到对应行",
        //             "infoFiltered": "(filtered1 from _MAX_ total entries)",
        //             "lengthMenu": "_MENU_ 行",
        //             "search": "搜索:",
        //             "zeroRecords": "暂不支持搜索"
        //         },
        //         buttons: [
        //
        //             // { extend: 'print', className: 'btn dark btn-outline',text: '打印' },
        //             // { extend: 'copy', className: 'btn red btn-outline',text: '拷贝' },
        //             // { extend: 'pdf', className: 'btn green btn-outline',text: 'pdf' },
        //             // { extend: 'excel', className: 'btn yellow btn-outline ',text: 'excel下载' },
        //             // { extend: 'csv', className: 'btn purple btn-outline ',text: 'csv下载' },
        //             { extend: 'colvis', className: 'btn dark btn-outline', text: '隐藏列'}
        //         ],
        //         "order": [
        //             [1, 'asc']
        //         ],
        //         "columnDefs": [
        //             {  // set default column settings
        //                 'orderable': false,
        //                 'targets': [0]
        //             },
        //             {
        //                 "searchable": false,
        //                 "targets": [0]
        //             },
        //             {
        //                 "className": "dt-right",
        //                 //"targets": [2]
        //             }
        //         ],
        //         "lengthMenu": [
        //             [5, 10, 15, 20, -1],
        //             [5, 10, 15, 20, "All"] // change per page values here
        //         ],
        //         // set the initial value
        //         "pageLength": 10,
        //         "dom": "<'row' <'col-md-12'B>><'row'<'col-md-6 col-sm-12'l><'col-md-6 col-sm-12'f>r><'table-scrollable't><'row'<'col-md-5 col-sm-12'i><'col-md-7 col-sm-12'p>>", // horizobtal scrollable datatable
        //     });
        //
        //     table.find('.group-checkable').change(function () {
        //         var set = jQuery(this).attr("data-set");
        //         var checked = jQuery(this).is(":checked");
        //         jQuery(set).each(function () {
        //             if (checked) {
        //                 $(this).prop("checked", true);
        //                 $(this).parents('tr').addClass("active");
        //             } else {
        //                 $(this).prop("checked", false);
        //                 $(this).parents('tr').removeClass("active");
        //             }
        //         });
        //
        //     });
        //     table.on('change', 'tbody tr .checkboxes', function () {
        //         $(this).parents('tr').toggleClass("active");
        //     });
        //
        // }


        $scope.initSupplier= function () {
            var table = $('#supplier');
            var oTable =  table.dataTable({
                "language": {
                    "aria": {
                        "sortAscending": ": activate to sort column ascending",
                        "sortDescending": ": activate to sort column descending"
                    },
                    "emptyTable": "没有获取到数据",
                    "info": "展示 _START_ 到 _END_ 共 _TOTAL_ 行",
                    "infoEmpty": "找不到对应行",
                    "infoFiltered": "(filtered1 from _MAX_ total entries)",
                    "lengthMenu": "_MENU_ 行",
                    "search": "搜索:",
                    "zeroRecords": "暂不支持搜索"
                },
                buttons: [],

                "order": [
                    [1, 'asc']
                ],
                "columnDefs": [
                    {  // set default column settings
                        'orderable': false,
                        'targets': [0]
                    },
                    {
                        "searchable": false,
                        "targets": [0]
                    },
                    {
                        "className": "dt-right",
                        //"targets": [2]
                    }
                ],
                "pageLength": 10,
                "dom": "<'row' <'col-md-12'B>><'row'<'col-md-6 col-sm-12'l><'col-md-6 col-sm-12'f>r><'table-scrollable't><'row'<'col-md-5 col-sm-12'i><'col-md-7 col-sm-12'p>>", // horizobtal scrollable datatable
            });

            table.find('.group-checkable').change(function () {
                var set = jQuery(this).attr("data-set");
                var checked = jQuery(this).is(":checked");
                jQuery(set).each(function () {
                    if (checked) {
                        $(this).prop("checked", true);
                        $(this).parents('tr').addClass("active");
                    } else {
                        $(this).prop("checked", false);
                        $(this).parents('tr').removeClass("active");
                    }
                });
                for(key in $scope.data){
                    if($scope.data[key].select != true){
                        $scope.data[key].select = true
                    }else{
                        $scope.data[key].select = false
                    }

                }
            });
            table.on('change', 'tbody tr .checkboxes', function () {
                $(this).parents('tr').toggleClass("active");
            });
        }

        supplier()

    });

    var spuId = $stateParams.Id
    var pageParams = {
        bean:'user',
        method:'pageGetUserList',
        userType:4,
        page:1,
        rows:10,
        ownerType:2
    }

    function supplier() {
        suppServer.supplier(spuId).success(function (data) {
            $scope.list = data.rows
        })
    }

      function getPage() {
        commonUtil.getList(pageParams).success(function(data) {
            $scope.data = data.rows;
        });
    }
    getPage();

    $scope.addSupplier = function () {
        var supplierIds = [];
        for(key in $scope.data){
            if($scope.data[key].select == true){
                supplierIds[key] = $scope.data[key].userId
            }
        }
        if(supplierIds.length <1){
            alert("请先选择一个供应商")
            return
        }
        suppServer.setSupplier(spuId,supplierIds).success(function (data) {
            if(data.status == 00){
                supplier()
                $("#show").modal('hide')
            }else{
                $("#show").modal('hide')
                msgAlert.text(data.msg);
            }
        })
        console.log(angular.toJson(supplierIds))
    }

    $scope.batchSupplier = function () {
        var info = [];
        for(key in $scope.list){
            info[key] ={
                id:$scope.list[key].relId,
                price:$scope.list[key].price,
                skuId:$scope.list[key].skuId,
                supplierId:$scope.list[key].supplierId,
                qty:$scope.list[key].qty,
            }
        }
        suppServer.batchSupplier(angular.toJson(info)).success(function (data) {
            if(data.status == 00){
                supplier()
                msgAlert.text("保存成功");
            }else{
                $("#show").modal('hide')
                msgAlert.text(data.msg);
            }
        })
    }
    
    $scope.showDel = function (id) {
        $("#showDel").modal("show");
        $scope.delSupplier = function () {
            suppServer.delSupplier(id).success(function (data) {
                if(data.status == 00){
                    supplier()
                    $("#showDel").modal('hide')
                }else{
                    $("#showDel").modal('hide')
                    msgAlert.text(data.msg);
                }
            })
        }
    }

})

/**
 * Created by sq on 2017/4/24.
 */
