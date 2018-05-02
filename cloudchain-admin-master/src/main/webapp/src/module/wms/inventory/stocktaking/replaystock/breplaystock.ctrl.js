    /**
     * 盘点复盘
     */
    angular.module('MetronicApp').controller('breplaystockCtrl', ['$rootScope', '$scope', '$http', 'uiGridConstants', 'settings', 'BillManage', 'commonUtil', 'Table', 'linkageSelect', '$location', function ($rootScope, $scope, $http, uiGridConstants, settings, BillManage, commonUtil, Table, linkageSelect, $location) {
        $scope.$on('$viewContentLoaded', function () {
            App.initAjax(); // initialize core components
        });
        $rootScope.settings.layout.pageContentWhite = true;
        $rootScope.settings.layout.pageBodySolid = false;
        $rootScope.settings.layout.pageSidebarClosed = false;
        var vm = this;
        vm.stockCode = $location.search().code;
        vm.warehouseName = $location.search().warehouseName;
        vm.creator = $location.search().creator;
        vm.check_mode = $location.search().check_mode;

        vm.column = [
            {
                field: "line_no",
                displayName: '序号',
                width: '8%',
            },
            {
                field: "product_id",
                displayName: '商品sku编号',
                width: '15%',

            },
            {
                field: "product_name",
                displayName: '商品名称',
                width: '8%'
            },
            {
                field: "cateName",
                displayName: '分类',
                width: '8%',
            },
            {
                field: "spuUnit",
                displayName: '单位',
                width: '8%',
            },
            {
                field: "inventory_status",
                displayName: '是否良品',
                width: '8%',
                cellTemplate: '<div style="padding:5px">{{row.entity.inventory_status=="GOOD"?"良品":(row.entity.inventory_status=="BAD"?"不良品":row.entity.inventory_status)}}</div>'
            },
            {
                field: "owner_name",
                displayName: '货主',
                width: '8%',
            },
            {
                field: "supplier_name",
                displayName: '供应商',
                width: '8%',
            },
            {
                field: "locationName",
                displayName: '所在库位',
                width: '10%',
            },
            {
                field: "amount_quantity",
                displayName: '账存数量',
                width: '10%',

            },
            {
                field: "primary_quantity",
                displayName: '初盘数量',
                width: '10%',

            },
            {
                name: "差异数",
                displayName: '差异数',
                width: '10%',
                cellTemplate: '<div style="padding:5px;" ><span ng-if="grid.appScope.$parent.breplaystock.a[row.entity.index]>0" style="color:green">{{grid.appScope.$parent.breplaystock.a[row.entity.index]}}</span>' +
                '<span ng-if="grid.appScope.$parent.breplaystock.a[row.entity.index]<0" style="color:red">{{grid.appScope.$parent.breplaystock.a[row.entity.index]}}</span></div>' +
                '<span ng-if="grid.appScope.$parent.breplaystock.a[row.entity.index]==0" style="color:green">{{grid.appScope.$parent.breplaystock.a[row.entity.index]}}</span></div>'
            },
            {
                name: "复盘数量",
                displayName: '复盘数量',
                width: '10%',
                cellTemplate: '<div style="padding:5px"><input type="number"  ng-model="grid.appScope.$parent.breplaystock.addrType1[row.entity.index]"   ng-change="grid.appScope.$parent.breplaystock.aaa(row.entity.amount_quantity,row.entity.index,grid.appScope.$parent.breplaystock.addrType1[row.entity.index])"/></div>'
            }
        ]
        vm.aaa = function (preValue, index, value) {
            if (value == "") {
                value = 0;
            }
            vm.a[index] = value - preValue;
        }

        vm.pageParams = {
            bean: 'wmsStockTake',
            method: 'pageQryStockTakeItem',
            stocktakeCode: vm.stockCode,
            qryType:3,
            page: 1,
            rows: 10
        }

        vm.getPage = function () {
            $http({
                url: "/process"/*'../js/services/dashBoard.json'*/, method: "get",
                params: vm.pageParams
            }).success(function (data) {
                vm.addrType1 = new Array();
                if (data.additionalMsg.status == '00') {
                    vm.a = new Array();
                    for (var i = 0; i < data.rows.length; i++) {
                        data.rows[i].index = i;
                        vm.a[i] = 0;
                       if( data.rows[i].replay_quantity ==null|| data.rows[i].replay_quantity==undefined||data.rows[i].replay_quantity==""){
                           vm.addrType1[i] = data.rows[i].amount_quantity;
                       }else {
                           vm.addrType1[i] = data.rows[i]. replay_quantity;
                           vm.aaa(data.rows[i].amount_quantity,i,data.rows[i]. replay_quantity);
                       }
                    }
                    vm.data = data;

                } else {
                    msgAlert.text('系统繁忙 >﹏< [' + data.additionalMsg.message + ']');
                }
                if(    vm.check_mode=="01"){
                    vm.column[9].visible = true;
                    vm.column[10].visible = true;
                    vm.column[11].visible = true;
                }else  if(    vm.check_mode=="02"){
                    vm.column[9].visible = false;
                    vm.column[10].visible = true;
                    vm.column[11].visible = false;
                }
            })
        };
        vm.getPage();


        $("#id_code").val(  vm.stockCode);
        $("#id_warehouseName").val(   vm.warehouseName );
        $("#id_creater").val(  vm.creator);



        //复盘录入
        vm.initSure  =function () {
            if (vm.entity.getSelectedRows().length == 0) {
                msgAlert.info('请至少选择一条记录');
                return false;
            }
            vm.stockTakeCheckInfos = [];
            for(var i=0;i<vm.entity.getSelectedRows().length;i++){
                var  t =vm.entity.getSelectedRows()[i].index;
                vm.stockTakeCheckInfos.push({
                    stocktakeItemId:vm.entity.getSelectedRows()[i].stocktakeItemId,
                    stocktakeQuantity:vm.addrType1[t]
                });
            }
            vm.params = {
                stocktakeCode:vm.stockCode,
                dealType:"02",
                stockTakeCheckInfos: vm.stockTakeCheckInfos
            }
            BillManage.stockTakeBatchInput(vm).success(function(data) {
                if (data.additionalMsg.status == '00') {
                    msgAlert.info('复盘录入成功');
                    vm.getPage();
                } else {
                    msgAlert.text('系统繁忙 >﹏< [' + data.additionalMsg.message + ']');
                }

            });

        }

        vm.back = function () {
            window.location.href="#/wms/inventory/stocktaking";
        }

    }])




