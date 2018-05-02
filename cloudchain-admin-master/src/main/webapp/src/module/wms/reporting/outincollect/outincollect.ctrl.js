angular.module('MetronicApp')
    .controller('outincollectCtrl', ['$rootScope', '$scope', '$http', 'uiGridConstants', 'settings', 'BillManage', 'commonUtil', 'Table', 'citySelect', function ($rootScope, $scope, $http, uiGridConstants, settings, BillManage, commonUtil, Table, citySelect) {
        $scope.$on('$viewContentLoaded', function () {
            App.initAjax(); // initialize core components
        });
        $rootScope.settings.layout.pageContentWhite = true;
        $rootScope.settings.layout.pageBodySolid = false;
        $rootScope.settings.layout.pageSidebarClosed = false;
        var vm = this;
        vm.menuLen = 4;
        /******************************************************************获取库区信息*********************************************************************************/
        vm.column = [{
            field: "id",
            displayName: '编号',
            enableColumnMenu: false,// 是否显示列头部菜单按钮
        }, {
            field: "warehouseId",
            displayName: '仓库ID',
            visible: false,
        },
            {
                field: "name",
                displayName: '库区名称',
            },
            {
                name: "库区类型",
                displayName: '库区类型',
                // width: '15%',
                cellTemplate:'<div style="padding:5px" ng-model="outincollect.areaType[row.entity.index]">{{grid.appScope.$parent.outincollect.areaType[row.entity.index]}}</div>',

            }
            ,
            // {
            //     name: "存放商品",
            //     displayName: '存放商品',
            // },
            {
                field: "wareHouseName",
                displayName: '仓库名称',
            },
            {
                field: "address",
                displayName: '仓库地址',
                cellTemplate:'<div style="padding:5px">{{row.entity.provinceName+"/"+row.entity.cityName+"/"+row.entity.districtName}}</div>',

            },
            {

                field: "status",
                displayName: '当前状态',
                cellTemplate:'<div style="padding:5px">{{row.entity.status=="ACTIVE"?"有效":"无效"}}</div>'


            }
        ]
        vm.outincollect_params = {
            bean: 'wmsWarehouseArea',
            method: 'page',
            page: 1,
            rows: 10
        }
        vm.areaType = new Array();
        vm.getPage = function () {
            commonUtil.getList(vm.outincollect_params).success(function (data) {

                if (data.additionalMsg.status == '00') {
                    vm.data = data;
                    var strs= new Array(); //定义一数组
                    for(var i =0;i < data.rows.length;i++) {
                        data.rows[i].index = i;
                    }
                    for(var i =0;i < data.rows.length;i++){
                        vm.areaType[i] = "";
                        strs=  data.rows[i].areaType.split(","); //字符分割
                        for (var j=0;j<strs.length ;j++ )
                        {
                            if(strs[j]=="01"){ //收货地址
                                vm.areaType[i] =vm.areaType[i]+"普通/";
                            } else if (strs[j]=="02"){ //发货地址
                                vm.areaType[i]=vm.areaType[i]+"冷藏/";
                            }else if (strs[j]=="03"){//退货地址
                                vm.areaType[i] =vm.areaType[i]+"恒温/";
                            }else if (strs[j]=="04"){//自提地址
                                vm.areaType[i] =vm.areaType[i]+"特种/";
                            }else if (strs[j]=="05"){//自提地址
                                vm.areaType[i] =vm.areaType[i]+"气调";
                            }
                        }
                        if (  vm.areaType[i].charAt( vm.areaType[i].length-1)== "/") {
                            vm.areaType[i]= vm.areaType[i].substring(0, vm.areaType[i].length-1);
                        }
                    }
                } else {
                    msgAlert.text('系统繁忙 >﹏< [' + data.additionalMsg.message + ']');
                }
            });

        };
        vm.getPage();

        vm.outincollectFind = function () {
            vm.outincollect_params = {
                bean: 'wmsWarehouseArea',
                method: 'page',
                page: 1,
                rows: 10,
                areaName :$.trim($("#id_areaName").val()),
                wareHouseName :$.trim($("#id_wareName").val()),
               areaType :$.trim($("#id_areaType").val()),
               status:$.trim($("#id_Status").val())
            }
            vm.getPage();
        }

        /**********************************************************仓库*************************************************************/
        vm.warehouseColumn = [
            {
                field: 'ID',
                displayName: 'ID',
                visible: false,
            }, {
                field: 'CODE',
                displayName: '仓库编码',
            },
            {
                field: "NAME",
                displayName: '仓库名',
            }
        ]
        vm.placeholder_warehouseName = '请选择仓库';
        vm.icon_warehouse = 'plus';
        vm.warehouseParams = {
            bean: 'wmsWarehouse',
            method: 'page',
            page: 1,
            rows: 10
        }
        vm.warehousePage = function () {

            commonUtil.getList(vm.warehouseParams).success(function (data) {

                if (data.additionalMsg.status == '00') {
                    vm.warehouseData = data;
                } else {
                    msgAlert.text('系统繁忙 >﹏< [' + data.additionalMsg.message + ']');
                }
            });

        };
        vm.warehousePage();


        /**
         * 新建仓库
         * @returns {boolean}
         */
        vm.newoutincollect = function () {
            window.location.href ="#/wms/setting/addoutincollect";
        }

        vm.updataoutincollect = function () {
            if (vm.entity.getSelectedRows().length == 0) {
                msgAlert.text('请先选择一条要修改的单子');
                return false;
            }
            if (vm.entity.getSelectedRows().length > 1) {
                msgAlert.text('只能选择一条单子');
                return false;
            }
            // $('#updateoutincollect').modal('show');
            window.location.href = "#/wms/setting/updateoutincollect/"+vm.entity.getSelectedRows()[0].id;

        }






        vm.update = function () {
            vm.updateParam = {
                id: vm.entity.getSelectedRows()[0].id,
                description: $('#id_updateDescript').val(),
            }
            BillManage.wmsWarehouseAreaUpdate(vm).success(function (data) {
                if (data.additionalMsg.status == '00') {
                    msgAlert.text('修改成功');
                    $('#updateoutincollect').modal('hide');
                    vm.getPage();
                } else {
                    msgAlert.text(' >﹏< [' + data.additionalMsg.message + ']');
                }
            })
        }
        $(function () {
            $('#updateoutincollect').on('hide.bs.modal', function () {
                $('#id_updateDescript').val("");
            })
        });


        vm.invalidoutincollect = function () {
            if (vm.entity.getSelectedRows().length == 0) {
                msgAlert.text('请先选择一条要失效的单子');
                return false;
            }
            if (vm.entity.getSelectedRows().length > 1) {
                msgAlert.text('只能选择一条单子');
                return false;
            }
            vm.invalidParam = {
                id: vm.entity.getSelectedRows()[0].id,
            }
            BillManage.wmsWarehouseAreaInvalid(vm).success(function (data) {
                if (data.additionalMsg.status == '00') {
                    msgAlert.text('失效成功');
                    vm.getPage();
                } else {
                    msgAlert.text(' >﹏< [' + data.additionalMsg.message + ']');
                }
            })
        }
        vm.activeoutincollect = function () {
             
            if (vm.entity.getSelectedRows().length == 0) {
                msgAlert.text('请先选择一条要生效的单子');
                return false;
            }
            if (vm.entity.getSelectedRows().length > 1) {
                msgAlert.text('只能选择一条单子');
                return false;
            }
            vm.activeParam = {
                id: vm.entity.getSelectedRows()[0].id,
            }
            BillManage.wmsWarehouseAreaActive(vm).success(function (data) {
                if (data.additionalMsg.status == '00') {
                    msgAlert.text('生效成功');
                    vm.getPage();
                } else {
                    msgAlert.text(' >﹏< [' + data.additionalMsg.message + ']');
                }
            })
        }

    }]);



