angular.module('MetronicApp')
    .controller('expenseCtrl', ['$rootScope', '$scope', '$http', 'uiGridConstants', 'settings', 'BillManage', 'commonUtil', 'Table', 'citySelect', function ($rootScope, $scope, $http, uiGridConstants, settings, BillManage, commonUtil, Table, citySelect) {
        $scope.$on('$viewContentLoaded', function () {
            App.initAjax(); // initialize core components
        });
        $rootScope.settings.layout.pageContentWhite = true;
        $rootScope.settings.layout.pageBodySolid = false;
        $rootScope.settings.layout.pageSidebarClosed = false;
        var vm = this;
        /******************************************************************获取库区信息*********************************************************************************/
        vm.column = [{
            field: "fId",
            displayName: '编号',
            enableColumnMenu: false,// 是否显示列头部菜单按钮
        }, {
            field: "fName",
            displayName: '名称',
        },
            {
                field: "description",
                displayName: '描述',
            },
            {
                name: "单价",
                displayName: '单价',
                cellTemplate:"<div style=\"padding:5px\">￥{{grid.appScope.$parent.toFixed(row.entity.price)}}</div>"
            },
            {

                field: "mainUnit",
                displayName: '单位',
                cellTemplate:'<div style="padding:5px">{{row.entity.mainUnit=="0"?"吨":(row.entity.mainUnit=="1"?"件":"库位")}}</div>'
            }
        ]
        $scope.toFixed = function (index) {
            var num = new Number(index/100);
            return     num.toFixed(2);
        }
        vm.expense_params = {
            bean: 'wmsFeeType',
            method: 'page',
            page: 1,
            rows: 10
        }
        vm.getPage = function () {
            commonUtil.getList(vm.expense_params).success(function (data) {
                if (data.additionalMsg.status == '00') {
                    vm.data = data;
                } else {
                    msgAlert.text('系统繁忙 >﹏< [' + data.additionalMsg.message + ']');
                }
            });

        };
        vm.getPage();

        vm.expenseFind = function () {
            vm.expense_params = {
                bean: 'wmsFeeType',
                method: 'page',
                page: 1,
                rows: 10,
                fName: $.trim($("#id_fName").val()),
            }
            vm.getPage();
        }


        /**
         * 新建费用
         * @returns {boolean}
         */
        vm.newexpense = function () {
            window.location.href = "#/wms/setting/addexpense";
        }
        /**
         * 更新费用
         * @returns {boolean}
         */
        vm.updataexpense = function () {
            if (vm.entity.getSelectedRows().length == 0) {
                msgAlert.text('请先选择一条要修改的单子');
                return false;
            }
            if (vm.entity.getSelectedRows().length > 1) {
                msgAlert.text('只能选择一条单子');
                return false;
            }
            window.location.href = "#/wms/setting/updateexpense?fId="+vm.entity.getSelectedRows()[0].fId+"&fName="+vm.entity.getSelectedRows()[0].fName
                +"&description="+vm.entity.getSelectedRows()[0].description+"&price="+vm.entity.getSelectedRows()[0].price+"&mainUnit="+vm.entity.getSelectedRows()[0].mainUnit;

        }


        vm.delete = function () {
            if (vm.entity.getSelectedRows().length == 0) {
                msgAlert.text('请先选择一条要修改的单子');
                return false;
            }
            if (vm.entity.getSelectedRows().length > 1) {
                msgAlert.text('只能选择一条单子');
                return false;
            }
            BillManage.wmsFeeTypeDelete(vm.entity.getSelectedRows()[0].fId).success(function (data) {
                if (data.status == '00') {
                    msgAlert.text('删除成功');
                    vm.getPage();
                } else {
                    msgAlert.text(' >﹏< [' + data.message + ']');
                }
            })
        }




    }]);



