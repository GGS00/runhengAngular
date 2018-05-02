angular.module('MetronicApp')
    .controller('outboundPickWorkCtrl', ['$rootScope', '$scope', '$http', 'uiGridConstants', 'settings', 'BillManage', 'commonUtil', 'Table', function ($rootScope, $scope, $http, uiGridConstants, settings, BillManage, commonUtil, Table) {
        $scope.$on('$viewContentLoaded', function () {
            App.initAjax(); // initialize core components
        });
        $rootScope.settings.layout.pageContentWhite = true;
        $rootScope.settings.layout.pageBodySolid = false;
        $rootScope.settings.layout.pageSidebarClosed = false;
        var vm = this;
        vm.menuLen = 4;
        vm.pageParams = {
            bean: 'wmsPickWork',
            method: 'page',
            page: 1,
            rows: 10
        }
        vm.column = [{
            field: "ID",
            displayName: 'ID',
            width: '5%',
            visible: false,
            enableColumnMenu: false,// 是否显示列头部菜单按钮
        },
            {
                field: 'CODE',
                displayName: '作业单号',
                width: '22%',
            },
            {
                field: "move_doc_code",
                displayName: '拣货单号',
                width: '22%'

            },
            // {
            //     field: "TYPE",
            //     displayName: '类型',
            //     width: '20%',
            //     cellTemplate:'<div style="padding:5px">{{row.entity.TYPE=="MV_OUTBOUND_PICKING"?"拣货":""}}</div>'
            //
            // },
            {
                field: "HNAME",
                displayName: '仓库',
                width: '10%',
            },
            {
                field: "STATUS",
                displayName: '状态',
                width: '10%',
                cellTemplate:'<div style="padding:5px">{{row.entity.STATUS=="FINISHED"?"完成":(row.entity.STATUS=="DELETE"?"删除":(row.entity.STATUS=="ACTIVE"?"生效":(row.entity.STATUS=="OPEN"?"打开":(row.entity.STATUS=="WORKING"?"工作中":""))))}}</div>'
            },
            {
                field: "PLAN_QUANTITY_BU",
                displayName: '计划数量',
                width: '10%'

            },
            {
                field: "MOVED_QUANTITY_BU",
                displayName: '操作数量',
                width: '10%'

            },
            {
                field: "ORGNAME",
                displayName: '货主',
                width: '10%'

            },
            {
                field: "WORKER_NAME",
                displayName: '责任人',
                width: '10%'
            },
            {
                field: "UNAME",
                displayName: '创建人',
                width: '10%'
            },
            {
                field: "CREATED_TIME",
                displayName: '创建时间',
                width: '20%'
            }
        ]

        vm.getPage = function () {
            $http({
                url: "/process"/*'../js/services/dashBoard.json'*/, method: "get",
                params: vm.pageParams
            }).success(function (data) {
                vm.data = data;
            })
        };
        vm.getPage();

        /**********************************************************获取所有用户*************************************************************/
        vm.userColumn = [
            {   field: 'empId',
                displayName: '员工id',
                enableColumnMenu: false,// 是否显示列头部菜单按钮
                enableHiding: true,
                suppressRemoveSort: true,
                enableCellEdit: true, // 是否可编辑
            },
            {
                field: "realName",
                displayName: '用户名',
                enableCellEdit: true,
                enableCellEditOnFocus: true
            },
            {
                field: "orgName",
                displayName: '部门',
                enableCellEdit: true,
                enableCellEditOnFocus: true
            }
        ]
        vm.placeholder_userName = '请选择员工';
        vm.icon_user = 'plus';
        vm.userParams = {
            bean:'umsEmployee',
            method:'pageGetEmployees',
            page:1,
            rows:10
        }
        vm.userPage = function () {
            commonUtil.getList(vm.userParams).success(function (data) {
                if (data.additionalMsg.status == '00') {
                    vm.userData = data;
                } else  {
                    msgAlert.text('系统繁忙 >﹏< [' + data.additionalMsg.message + ']');
                }
            });

        };
        vm.userPage();

        /**
         * 作业确认跳转
         */
        vm.tasksure = function () {
            if (vm.entity.getSelectedRows().length == 0) {
                msgAlert.text('请先选择一条作业单');
                return false;
            } else if (vm.entity.getSelectedRows().length > 1) {
                msgAlert.text('每次只能选中一条作业单');
            } else {
                window.location.href = "#/wms/outbound/pickwork/confirm?id=" + vm.entity.getSelectedRows()[0].ID;
            }
        }


        vm.taskAssign =function () {
            if (vm.entity.getSelectedRows().length == 0) {
                msgAlert.text('请选择一条作业单');
                return false;
            } else if (vm.entity.getSelectedRows().length > 1) {
                msgAlert.text('每次只能选中一条作业单');
            } else {
                $('#Dialog1').modal('show');
            }
        }

        vm.add1 =function () {
            vm.docId=vm.entity.getSelectedRows()[0].ID;
            vm.taskExecutor = vm.userEntity.getSelectedRows()[0].empId;
            vm.workerName = vm.userEntity.getSelectedRows()[0].realName;
            BillManage.pickWorkAllocate(vm).success(function(data) {
                debugger
                if(data.additionalMsg.status=='00'){
                    msgAlert.text('任务分配成功');
                    $('#Dialog1').modal('hide');
                    vm.getPage();
                    vm.entity.clearSelectedRows();
                }else {
                    msgAlert.text('系统繁忙 >﹏< ['+ data.additionalMsg.message+']');
                }

            });
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
        /*************************************************************获取货主信息************************************************************************************/
        vm.ownerColumn = [
            {
                field: 'userId',
                displayName: '货主id',
                enableColumnMenu: false,// 是否显示列头部菜单按钮
                enableHiding: true,
                suppressRemoveSort: true,
                enableCellEdit: true, // 是否可编辑
            },
            {
                field: "nickName",
                displayName: '货主名称',
                enableCellEdit: true,
                enableCellEditOnFocus: true
            }
        ]

        vm.placeholder_ownerName = '请输入货主';
        vm.icon_owner = 'plus';
        vm.ownerParams = {
            userType: 4,
            ownerType: 1
        }
        vm.ownerPage = function () {
            $http({
                url: "/user/getUserList", method: "post",
                params: vm.ownerParams
            }).success(function (data) {
                vm.ownerData = data;
            })
        };
        vm.ownerPage();

        vm.picktaskFind = function () {
            vm.pageParams = {
                bean: 'wmsPickWork',
                method: 'page',
                page: 1,
                rows: 10,
                code: $("#code").val(),
                warehouseId: $("#warehouseId").val(),
                ownerId: $("#ownerId").val(),
                status: $("#status").val(),
            }
            vm.getPage();
        }


    }]);




