angular.module('MetronicApp')
    .controller('cartonCtrl', ['$rootScope', '$scope', '$http', 'uiGridConstants', 'settings', 'BillManage', 'commonUtil', function ($rootScope, $scope, $http, uiGridConstants, settings, BillManage, commonUtil) {
        $scope.$on('$viewContentLoaded', function () {
            App.initAjax(); // initialize core components
        });
        $rootScope.settings.layout.pageContentWhite = true;
        $rootScope.settings.layout.pageBodySolid = false;
        $rootScope.settings.layout.pageSidebarClosed = false;
        var vm = this;
        vm.menuLen = 4;
        /******************************************************************获取周转箱表*********************************************************************************/
        vm.column = [{
            field: "id",
            displayName: 'ID',
            visible: false,
            enableColumnMenu: false,// 是否显示列头部菜单按钮
        }, {
                field: "warehouseName",
                displayName: '仓库名称',
                width: '15%',
            },
            {
                field: "code",
                displayName: '周转箱号',
                width: '20%',
            },
            {
                field: "status",
                displayName: '状态',
                width: '10%',
                cellTemplate: '<div style="padding:5px">{{row.entity.status=="ACTIVE"?"生效":(row.entity.status=="INVALID"?"失效":"")}}</div>'
            },
            {
                field: "length",
                displayName: '长度(cm)',
                width: '10%',
            },
            {
                field: "width",
                displayName: '宽度(cm)',
                width: '10%',
            },
            {
                field: "height",
                displayName: '高度(cm)',
                width: '10%',
            },
            {
                field: "description",
                displayName: '描述',
                width: '25%',
            }

        ]
        vm.carton_params = {
            bean: 'wmsTurnoverCarton',
            method: 'page',
            page: 1,
            rows: 10
        }
        vm.getPage = function () {
            commonUtil.getList(vm.carton_params).success(function (data) {

                if (data.additionalMsg.status == '00') {
                    vm.data = data;
                } else {
                    msgAlert.text('系统繁忙 >﹏< [' + data.additionalMsg.message + ']');
                }
            });

        };
        vm.getPage();
        vm.cartonFind = function () {
            vm.carton_params = {
                bean: 'wmsTurnoverCarton',
                method: 'page',
                page: 1,
                rows: 10,
                code :$.trim($("#id_code").val()),
                warehouseId :$.trim($("#search_warehouseId").val()),
                status:$.trim($("#id_Status").val())
            }
            vm.getPage();
        }

        /**********************************************************获取发货仓库*************************************************************/
        vm.warehouseColumn = [
            {
                field: 'ID',
                displayName: '编号',
                enableColumnMenu: false,// 是否显示列头部菜单按钮
                enableHiding: true,
                suppressRemoveSort: true,
                enableCellEdit: true, // 是否可编辑
            },
            {
                field: "NAME",
                displayName: '仓库名',
                enableCellEdit: true,
                enableCellEditOnFocus: true
            }
        ]
        vm.placeholder_warehouseName = '请输入供发货仓库';
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

        /**************************************************************增加周转箱*******************************************************************/
        vm.newcarton = function () {
            $('#addCarton').modal('show');
        }

        //更新
        vm.updatecarton = function () {
            if(vm.entity.getSelectedRows().length == 0){

                msgAlert.text('请先选择要修改的周转箱');
                return false;

            }else if(vm.entity.getSelectedRows().length > 1){

                msgAlert.text('每次只能修改一条周转箱信息');

            }else{
                vm.id=vm.entity.getSelectedRows()[0].id;
                vm.warehouseName=vm.entity.getSelectedRows()[0].warehouseName;
                vm.code=vm.entity.getSelectedRows()[0].code;
                vm.status=vm.entity.getSelectedRows()[0].status;
                vm.length=vm.entity.getSelectedRows()[0].length;
                vm.width=vm.entity.getSelectedRows()[0].width;
                vm.height=vm.entity.getSelectedRows()[0].height;
                vm.volume=vm.entity.getSelectedRows()[0].volume;
                vm.weight=vm.entity.getSelectedRows()[0].weight;
                vm.description=vm.entity.getSelectedRows()[0].description;
                $('#updateCarton').modal('show');
            }
        }

        //新增周转箱
        vm.addCarton = function () {
            vm.addParam = {
                warehouseId: $('#id_warehouse').val(),
                number: $('#id_quantity').val(),
            }
            BillManage.addCarton(vm).success(function (data) {
                if (data.status == '00') {
                    msgAlert.text('新增成功');
                    $('#addCarton').modal('hide');
                    vm.getPage();
                } else {
                    msgAlert.text(' >﹏< [' + data.msg + ']');
                }
            })
        }

        //修改周转箱
        vm.confirmModify = function () {
            vm.updateParam = {
                id: vm.entity.getSelectedRows()[0].id,
                status:$('#status').val(),
                length:$('#length').val(),
                width:$('#width').val(),
                height:$('#height').val(),
                volume:$('#volume').val(),
                weight:$('#weight').val(),
                description: $('#description').val()
            }
            BillManage.updateCarton(vm).success(function (data) {
                if (data.status == '00') {
                    msgAlert.text('修改成功');
                    $('#updateCarton').modal('hide');
                    vm.getPage();
                } else {
                    msgAlert.text(' >﹏< [' + data.msg + ']');
                }
            })

        }

        //删除周转箱
        vm.deleteCarton = function () {

            vm.deleteList = [];

            if(vm.entity.getSelectedRows().length == 0){

                msgAlert.text('请先选择要删除的周转箱');
                return false;

            }else{
                for(var i = 0 ;i < vm.entity.getSelectedRows().length ; i++){
                    vm.deleteList.push(vm.entity.getSelectedRows()[i].id);
                }
                BillManage.deleteCarton(vm).success(function (data) {
                    if (data.status == '00') {
                        msgAlert.text('删除成功');
                        vm.getPage();
                    } else {
                        msgAlert.text(' >﹏< [' + data.msg + ']');
                    }
                })
            }


        }

    }
    ]);



