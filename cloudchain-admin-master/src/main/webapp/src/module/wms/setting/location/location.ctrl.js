angular.module('MetronicApp')
    .controller('locationCtrl', ['$rootScope', '$scope', '$http', 'uiGridConstants', 'settings', 'BillManage', 'commonUtil', function ($rootScope, $scope, $http, uiGridConstants, settings, BillManage, commonUtil) {
        $scope.$on('$viewContentLoaded', function () {
            App.initAjax(); // initialize core components
        });
        $rootScope.settings.layout.pageContentWhite = true;
        $rootScope.settings.layout.pageBodySolid = false;
        $rootScope.settings.layout.pageSidebarClosed = false;
        var vm = this;
        vm.menuLen = 4;
        /******************************************************************获取库位表*********************************************************************************/
        vm.column = [{
            field: "id",
            displayName: 'ID',
            visible: false,
            enableColumnMenu: false,// 是否显示列头部菜单按钮
        }, {
                field: "wareHouseName",
                displayName: '仓库名称',
                width: '12%',
            },
            {
                field: "name",
                displayName: '库位名称',
                width: '12%',
            },
            {
                field: "status",
                displayName: '状态',
                width: '10%',
                cellTemplate: '<div style="padding:5px">{{row.entity.status=="ACTIVE"?"生效":(row.entity.status=="INVALID"?"失效":"")}}</div>'
            },
            {
                field: "type",
                displayName: '类型',
                enableColumnMenu: false,// 是否显示列头部菜单按钮
                width: '15%',
                cellTemplate: '<div style="padding:5px">{{row.entity.type=="STOREAGE"?"存货库位":(row.entity.type=="SHIP"?"发货库位":(row.entity.type=="RECEIVE"?"收货库位":""))}}</div>'
            },
            {
                field: "areaName",
                displayName: '库区名称',
                width: '12%',
            },
            {
                field: "mark",
                displayName: '库存类型',
                width: '8%',
            },
            {
                name: "所在区域",
                cellTemplate:'<div style="padding:5px">{{row.entity.provinceName+"/"+row.entity.cityName+"/"+row.entity.countyName}}</div>',
            } ,
            {
                field: "address",
                displayName: '详细地址',
                width: '10%',
            }

        ]
        vm.location_params = {
            bean: 'wmsWarehouseLocation',
            method: 'page',
            page: 1,
            rows: 10
        }
        vm.getPage = function () {
            commonUtil.getList(vm.location_params).success(function (data) {

                if (data.additionalMsg.status == '00') {
                    vm.data = data;
                } else {
                    msgAlert.text('系统繁忙 >﹏< [' + data.additionalMsg.message + ']');
                }
            });

        };
        vm.getPage();
        vm.locationFind = function () {
            vm.location_params = {
                bean: 'wmsWarehouseLocation',
                method: 'page',
                page: 1,
                rows: 10,
                name :$.trim($("#id_Name").val()),
                wareHouseName :$.trim($("#id_wareName").val()),
                areaName :$.trim($("#id_areaName").val()),
                status:$.trim($("#id_Status").val())
            }
            vm.getPage();
        }
        /**
         * 新建仓库
         * @returns {boolean}
         */
        vm.newlocation = function () {
            window.location.href = "#/wms/setting/addlocation"
        }
        //更新仓库
        vm.updatalocation = function () {
            window.location.href= "#/wms/setting/updatelocation"+"?Id="+vm.entity.getSelectedRows()[0].id+"&areaName="+vm.entity.getSelectedRows()[0].areaName+"&wareHouseName="+vm.entity.getSelectedRows()[0].wareHouseName;
        }

        //更新库位请求操作
        vm.update = function () {
            vm.updateParam = {
                id: vm.entity.getSelectedRows()[0].id,
                description: $('#id_updateDescript').val(),
            }
            BillManage.wmsWarehouseLocationUpdate(vm).success(function (data) {
                if (data.additionalMsg.status == '00') {
                    msgAlert.text('修改成功');
                    $('#updatelocation').modal('hide');
                    vm.getPage();
                } else {
                    msgAlert.text(' >﹏< [' + data.additionalMsg.message + ']');
                }
            })
        }
        $(function () {
            $('#updateregion').on('hide.bs.modal', function () {
                $('#updatelocation').val("");
            })
        });
        //失效库位操作
        vm.invalidlocation = function () {
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
            BillManage.wmsWarehouseLocationInvalid(vm).success(function (data) {
                if (data.additionalMsg.status == '00') {
                    msgAlert.text('失效成功');
                    vm.getPage();
                } else {
                    msgAlert.text(' >﹏< [' + data.additionalMsg.message + ']');
                }
            })
        }
        //生效库位操作
        vm.activelocation = function () {
            debugger
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
            BillManage.wmsWarehouseLocationActive(vm).success(function (data) {
                if (data.additionalMsg.status == '00') {
                    msgAlert.text('生效成功');
                    vm.getPage();
                } else {
                    msgAlert.text(' >﹏< [' + data.additionalMsg.message + ']');
                }
            })
        }

    }
    ]);



