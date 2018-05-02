angular.module('MetronicApp')
    .controller('checkallocatCtrl', ['$rootScope', '$scope', '$http', 'uiGridConstants', 'settings', 'BillManage', 'commonUtil', 'Table', 'citySelect', 'd2p', 'System', '$location', function ($rootScope, $scope, $http, uiGridConstants, settings, BillManage, commonUtil, Table, citySelect, d2p, System, $location) {
        $scope.$on('$viewContentLoaded', function () {
            App.initAjax(); // initialize core components
        });
        // set sidebar closed and body solid layout mode
        $rootScope.settings.layout.pageContentWhite = true;
        $rootScope.settings.layout.pageBodySolid = false;
        $rootScope.settings.layout.pageSidebarClosed = false;
        var vm = this;
        vm.stocktakeCode = $location.search().code;
        vm.ItemId = $location.search().ItemId;
        vm.wareHouseId = $location.search().wareHouseId;
        vm.alloctType = $location.search().alloctType;

        vm.radioFlag = 0;//分配标志位
        vm.rdo_good_number = 0;//根据商品进行分配
        vm.rdo_line_number = 0;//根据行数进行分配
        vm.rdo_region_number = 0;//根据库区库位进行分配
        vm.number1 = 1;//按商品分配
        vm.number2 = 1;//按行数进行分配
        vm.number3 = 1;//按库区进行分配
        vm.rdo_people_number1 = 0;//商品需要盘点的人数
        vm.rdo_people_number2 = 0;//行数需要盘点的人数
        vm.rdo_people_number3 = 0;//库区需要盘点的人数

        //分配监听
        vm.allocatlinsener = function (index) {
            if (index == 0) {//根据商品进行分配
                vm.params = {
                    statType: vm.radioFlag,
                    stockTakeItemIds: vm.ItemId,
                }

            } else if (index == 1) {//根据行数进行分配
                vm.params = {
                    statType: vm.radioFlag,
                    stockTakeItemIds: vm.ItemId,
                }
            } else if (index == 2) {//根据库区库位进行分配
                vm.params = {
                    statType: vm.radioFlag,
                    stockTakeItemIds: vm.ItemId,
                }
            }
            BillManage.statNumForStockTakeItem(vm).success(function (data) {
                // if (data.additionalMsg.status == '00') {
                if (index == 0) {
                    vm.rdo_good_number = data;
                } else if (index == 1) {
                    vm.rdo_line_number = data;
                } else if (index == 2) {
                    vm.rdo_region_number = data;
                }
                vm.radioLinsener();
                // } else {
                //     msgAlert.text('系统繁忙 >﹏< [' + data.additionalMsg.message + ']');
                // }
            });
        }
        vm.allocatlinsener(vm.radioFlag);

        vm.radioLinsener = function () {
            if (vm.radioFlag == 0) {
                if (vm.number1 > vm.rdo_good_number) {
                    msgAlert.info('每员工sku数量不能大于商品sku数量');
                    vm.number1 = 1;
                    return false;
                }
                var a = parseInt(vm.rdo_good_number / vm.number1);
                var b = vm.rdo_good_number % vm.number1;
                if (b == 0) {
                    vm.rdo_people_number1 = a;
                } else {
                    vm.rdo_people_number1 = ++a;
                }
            } else if (vm.radioFlag == 1) {
                if (vm.number2 > vm.rdo_line_number) {
                    msgAlert.info('每员工分配行数不能大于总行数');
                    vm.number2 = 1;
                    return false;
                }
                var a = parseInt(vm.rdo_line_number / vm.number2);
                var b = vm.rdo_line_number % vm.number2;
                if (b == 0) {
                    vm.rdo_people_number2 = a;
                } else {
                    vm.rdo_people_number2 = ++a;
                }
            } else if (vm.radioFlag == 2) {
                if (vm.number3 > vm.rdo_region_number) {
                    msgAlert.info('每员工分配库位数不能大于总库位');
                    vm.number3 = 1;
                    return false;
                }
                var a = parseInt(vm.rdo_region_number / vm.number3);
                var b = vm.rdo_region_number % vm.number3;
                if (b == 0) {
                    vm.rdo_people_number3 = a;
                } else {
                    vm.rdo_people_number3 = ++a;
                }
            }
        }
        /***********************************************************获取员工******************************************************************************************/
        //弹出选择员工模态框
        vm.aaaa = function () {
            $('#lar11ge').modal('show');
            vm.skuPage();
        }
        vm.skuColumn = [
            {
                field: 'userName',
                displayName: '账号',

            }, {
                field: 'realName',
                displayName: '姓名',
            }
        ]
        vm.placeholder_skuName = '请选择盘点员工';
        vm.icon_sku = 'plus';



        //请求获取员工信息接口
        vm.skuPage = function () {

            vm.skuParams = {
                bean: 'wmsWarehouse',
                method: 'pageQryEmpIdsByHouseId',
                wareHouseId: vm.wareHouseId,
                page: 1,
                rows: 10,
            }

            commonUtil.getList(vm.skuParams).success(function (data) {
                if (data.additionalMsg.status == '成功' || data.additionalMsg.status == '00') {
                    vm.skuData = data;
                } else if (data.additionalMsg.status == '01') {
                    msgAlert.text('获取商品列表失败 >﹏< [' + data.additionalMsg.message + ']');
                }
            });
        };
        //确认选择员工
        vm.overClick = function () {
            if (vm.skuEntity.getSelectedRows().length == 0) {
                msgAlert.info('请至少选择一个员工');
                return false;
            } else {
                if (vm.skuEntity.getSelectedRows().length == 1) {
                    for (var i = 0; i < vm.userList.length; i++) {
                        if (vm.skuEntity.getSelectedRows()[0].empId == vm.userList[i].empId) {
                            vm.userList.splice(i, 1);
                        }
                    }
                    vm.userList.push({
                        empId: vm.skuEntity.getSelectedRows()[0].empId,
                        accounts: vm.skuEntity.getSelectedRows()[0].userName,
                        realName: vm.skuEntity.getSelectedRows()[0].realName,
                        department: vm.skuEntity.getSelectedRows()[0].orgName,
                        role: vm.skuEntity.getSelectedRows()[0].roleName,
                        phone: vm.skuEntity.getSelectedRows()[0].mobile,
                        email: vm.skuEntity.getSelectedRows()[0].email
                    });
                } else {
                    for (var i = 0; i < vm.userList.length; i++) {
                        for (var j = 0; j < vm.skuEntity.getSelectedRows().length; j++) {
                            if (vm.userList[i].empId == vm.skuEntity.getSelectedRows()[j].empId) {
                                vm.userList.splice(i, 1);
                            }
                        }
                    }
                    for (var i = 0; i < vm.skuEntity.getSelectedRows().length; i++) {
                        vm.userList.push({
                            empId: vm.skuEntity.getSelectedRows()[i].empId,
                            accounts: vm.skuEntity.getSelectedRows()[i].userName,
                            realName: vm.skuEntity.getSelectedRows()[i].realName,
                            department: vm.skuEntity.getSelectedRows()[i].orgName,
                            role: vm.skuEntity.getSelectedRows()[i].roleName,
                            phone: vm.skuEntity.getSelectedRows()[i].mobile,
                            email: vm.skuEntity.getSelectedRows()[i].email
                        });
                    }
                }
                $('#lar11ge').modal('hide');
            }
        }
        vm.userList = []
        //搜索员工
        vm.serachGoods = function () {
            $scope.orgId = "";
            vm.skuPage()
        }
        //移除员工
        vm.removeGoods = function (empId) {
            for (var j = 0; j < vm.userList.length; j++) {
                if (empId == vm.userList[j].empId) {
                    vm.userList.splice(j, 1);
                }
            }
        }
        vm.cancel= function () {
            window.history.back();
        }
        /**************************************提交盘点计划**************************************/
        vm.sure = function () {
            var empIds = [];
            for (var i = 0; i < vm.userList.length; i++) {
                empIds.push({
                    empId:vm.userList[i].empId,
                    empName:vm.userList[i].realName
                })
            }
            if(vm.userList ==undefined){
                msgAlert.info('请选择盘点员工');
                return;
            }
            if( vm.userList.length!=vm.rdo_people_number1){
                msgAlert.info('盘点员工与选择的员工人数不一致，请选择一致后在进行操作');
                return;
            }

            vm.stocktakeItemIds =   vm.ItemId.split(",");
            if(  vm.stocktakeItemIds.length==1&& vm.stocktakeItemIds[0]==""){
                vm.stocktakeItemIds =null;
            }

            if (vm.radioFlag == 0) {
                vm.params = {
                    stocktakeCode: vm.stocktakeCode,
                    stocktakeItemIds:   vm.stocktakeItemIds ,
                    alloctType:  vm.alloctType,
                    alloctMode: vm.radioFlag,
                    emplyTaskNum: vm.number1,
                    stockTakeEmployInfos:empIds
                }
            } else if (vm.radioFlag == 1) {
                vm.params = {
                    stocktakeCode: vm.stocktakeCode,
                    stocktakeItemIds:   vm.stocktakeItemIds ,
                    alloctType:   vm.alloctType,
                    alloctMode: vm.radioFlag,
                    emplyTaskNum: vm.number2,
                    stockTakeEmployInfos:empIds
                }
            } else if (vm.radioFlag == 2) {
                vm.params = {
                    stocktakeCode: vm.stocktakeCode,
                    stocktakeItemIds:  vm.stocktakeItemIds ,
                    alloctType:  vm.alloctType,
                    alloctMode: vm.radioFlag,
                    emplyTaskNum: vm.number3,
                    stockTakeEmployInfos:empIds
                }
            }
            BillManage.stockTakeItemAlloct(vm).success(function (data) {
                if (data.additionalMsg.status == '00') {
                    msgAlert.info("盘点分配成功");
                    window.history.back(-1);
                } else {
                    msgAlert.text('系统繁忙 >﹏< [' + data.additionalMsg.message + ']');
                }
            });

        }

    }
    ]);

