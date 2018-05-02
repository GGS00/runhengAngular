angular.module('MetronicApp')
    .controller('addgoodCtrl', ['$rootScope', '$scope', '$http', '$location', 'uiGridConstants', 'settings', 'suppServer', 'commonUtil', 'Table','$stateParams', function ($rootScope, $scope, $http, $location, uiGridConstants, settings, suppServer, commonUtil, Table,$stateParams) {
        $scope.$on('$viewContentLoaded', function () {
            App.initAjax(); // initialize core components
        });
        $rootScope.settings.layout.pageContentWhite = true;
        $rootScope.settings.layout.pageBodySolid = false;
        $rootScope.settings.layout.pageSidebarClosed = false;
        var vm = this;
        vm.supplierID= $stateParams.Id;
        if(vm.supplierID =="gm"){
            vm.goodFlag = 1;
        }else {
            vm.goodFlag=0;
        }
        vm.pageParams = {
            bean: 'user',
            method: 'pageGetUserList',
            userType: 4,
            page: 1,
            rows: 10,
            ownerType: 2
        }
        vm.column = [{
            field: "relId",
            displayName: 'id',
            visible: false,
            enableColumnMenu: false,// 是否显示列头部菜单按钮
        }, {
            field: "skuId",
            displayName: '编号',
            enableColumnMenu: false,// 是否显示列头部菜单按钮
        },
            {
                field: "skuName",
                displayName: '商品名称',
                enableColumnMenu: false,// 是否显示列头部菜单按钮
            },
            {
                field: 'cName',
                displayName: '商品分类',
            },
            {
                field: "spec",
                displayName: '规格',
            },

            {
                field: "priceStr ",
                displayName: '成本价格',
            },
            {
                field: "qty",
                displayName: '库存',
                // cellTemplate:'<div style="padding:5px">{{row.entity.inventoryStatus=="GOOD"?"良品":(row.entity.inventoryStatus=="BAD"?"不良品":"")}}</div>'
            },
            {
                name: '操作',
                cellTemplate: '<button class ="btn yellow" ng-click="grid.appScope.$parent.addgood.addgoodDetele(row.entity.relId)">删除</button>'
            }
        ]
        vm.getPage = function () {
            commonUtil.getList(vm.pageParams).success(function (data) {
                if (data.additionalMsg.status == '00') {
                    vm.data = data;
                } else {
                    msgAlert.text('系统繁忙 >﹏< [' + data.additionalMsg.message + ']');
                }
            });
        };
        if(vm.supplierID =="gm"){
            vm.updata = function () {
                vm.pageParams = {
                    supplierId:$("#id_trans").val(),
                    bean: 'gmsSupplier',
                    method: 'pageGetSupplierSkuList',
                    page: 1,
                    rows: 10,
                    qryType: '03'
                }
                vm.getPage();
                if($("#id_trans").val()!= ""){
                    vm.showSG = true;
                    vm.selectGoodsParams = {
                        supplierId: $("#id_trans").val(),
                        bean: 'gmsSupplier',
                        method: 'pageGetSupplierSkuList',
                        page: 1,
                        rows: 10,
                        qryType: '04'
                    }
                }else{
                    vm.showSG = false;
                }
            }
        }else {
            vm.pageParams = {
                supplierId: vm.supplierID,
                bean: 'gmsSupplier',
                method: 'pageGetSupplierSkuList',
                page: 1,
                rows: 10,
                qryType: '03'
            }
            vm.getPage();
        }


        vm.addgoodDetele = function (id) {
            suppServer.removeSupplierGoodRel(id).success(function (data) {
                if (data.status == '00') {
                    msgAlert.info('删除成功');
                    vm.getPage();
                } else {
                    msgAlert.text('系统繁忙 >﹏< [' + data.message + ']');
                }
            })
        }
        //取消按钮
        vm.toTmsOrder = function () {
            window.history.back(-1);
        }

        //返回按钮
        vm.returnButton = function () {


            if(  vm.goodFlag == 1){
                window.history.back(-1);
            }else {
                window.location.href  ="#/supplier/manage";
            }
        }

        vm.addgoods = function () {
            console.log(vm.supplierID,$("#id_trans").val())
            if(vm.supplierID =="gm"){
                if($("#id_trans").val()==""){
                    msgAlert.info('请先选择供应商');
                    return;
                }
            }
            $('#selectCommonContacts').modal('show');
            vm.selectGoodsPage();
            vm.getAddSupplierGoodPage();
        }

        /*********** **************************************************获取供应商信息************************************************************************************/
        vm.supplierColumn = [
            {
                field: 'userId',
                displayName: '供应商id',
                enableColumnMenu: false,// 是否显示列头部菜单按钮
                enableHiding: true,
                suppressRemoveSort: true,
                enableCellEdit: true, // 是否可编辑
            },
            {
                field: "nickName",
                displayName: '供应商名称',
                enableCellEdit: true,
                enableCellEditOnFocus: true
            }
        ]
        vm.placeholder_supplier = '请选择供应商';
        vm.icon_supplier = 'plus';
        vm.supplierParams = {
            userType: 4,
            bean: 'user',
            method: 'pageGetUserList',
            isSupply:'1',
            page: 1,
            rows: 10,
            ownerType: 2
        }
        vm.supplierPage = function () {

            commonUtil.getList(vm.supplierParams).success(function (data) {

                if (data.additionalMsg.status == '00') {
                    vm.supplierData = data;
                } else {
                    msgAlert.text('系统繁忙 >﹏< [' + data.additionalMsg.message + ']');
                }
            });
        };
        vm.supplierPage();


        vm.selectGoodsColumn = [{
            field: "sku_id",
            displayName: '编号',
            enableColumnMenu: false,// 是否显示列头部菜单按钮
        },
            {
                field: "title",
                displayName: '商品名',
                enableColumnMenu: false,// 是否显示列头部菜单按钮
            },
            {
                field: 'c_name',
                displayName: '分类',
            }
        ]

        vm.selectGoodsPage = function () {
            vm.selectGoodsParams = {
                supplierId: $("#id_trans").val(),
                bean: 'gmsSupplier',
                method: 'pageGetSupplierSkuList',
                page: 1,
                rows: 10,
                qryType: '04'
            }
        };
        vm.getAddSupplierGoodPage = function () {
            commonUtil.getList(vm.selectGoodsParams).success(function (data) {

                if (data.additionalMsg.status == '00') {
                    vm.selectGoodsdata = data;
                } else {
                    msgAlert.text('系统繁忙 >﹏< [' + data.additionalMsg.message + ']');
                }
            });
        }

        vm.selectGoodsAdd = function () {
            var skuidList= [];
            if(vm.selectGoodsentity.getSelectedRows().length < 1){
                msgAlert.info("请先勾选一个")
                return

            }
            for (var i = 0; i <vm.selectGoodsentity.getSelectedRows().length; i++) {
                skuidList[i] = vm.selectGoodsentity.getSelectedRows()[i].sku_id;
            }

            vm.selectGoodsParams = {
                supplierId: $("#id_trans").val(),
                skuIds: skuidList.toString(),
            }
            suppServer.supplierAddSkusRel(vm.selectGoodsParams).success(function (data) {
                if (data.status == '00') {
                    msgAlert.info('添加成功' );
                    $('#selectCommonContacts').modal('hide');
                    vm.getPage();
                } else {
                    msgAlert.text('[' + data.msg + ']');
                }
            })
        }
        /**
         * 搜索供应商品
         */
        vm.selectSupplierGoodFind =function(){
            vm.selectGoodsParams = {
                supplierId: vm.supplierID,
                bean: 'gmsSupplier',
                method: 'pageGetSupplierSkuList',
                page: 1,
                rows: 10,
                qryType: '04',
                skuId:$("#id_skuId").val(),
                title:$("#id_title").val()
            }
            vm.getAddSupplierGoodPage();
        }
    }]);
