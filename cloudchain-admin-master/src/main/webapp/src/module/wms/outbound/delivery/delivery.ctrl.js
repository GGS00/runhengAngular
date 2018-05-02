/**
 * 发运控制器
 */
angular.module('MetronicApp')
    .controller('outboundDeliveryCtrl', function ($rootScope, $scope, $http, $location, uiGridConstants, settings, BillManage, commonUtil, $state) {
        $scope.$on('$viewContentLoaded', function () {
            App.initAjax(); // initialize core components
        });
        // set sidebar closed and body solid layout mode
        $rootScope.settings.layout.pageContentWhite = true;
        $rootScope.settings.layout.pageBodySolid = false;
        $rootScope.settings.layout.pageSidebarClosed = false;
        var vm = this;
        //加载单据类型
        initBillType();
        vm.billLst = [];
        vm.logis = 0;

        vm.menuSize = 6;
        vm.pageParams = {
            bean: 'wmsShip',
            method: 'page',
            docId: vm.pickTaskId,
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
                field: "OUTBOUNDCODE",
                displayName: '发货单号',
                width: '22%'
            },
            {
                field: "BILL_TYPE_ID",
                displayName: '单据类型',
                width: '10%',
                cellTemplate:'<div style="padding:5px">{{grid.appScope.$parent.matchBillType(row.entity.BILL_TYPE_ID)}}</div>'
            },
            {
                field: "CODE",
                displayName: '包装任务号',
                width: '25  %'
            },
            {
                field: "TYPE",
                displayName: '包装类型',
                width: '10%',
                cellTemplate:'<div style="padding:5px">{{row.entity.TYPE=="SKIP"?"无需包装":(row.entity.TYPE=="NORMAL"?"正常包装":"")}}</div>'
            },
            {
                field: "STATUS",
                displayName: '状态',
                width: '10%',
                cellTemplate:'<div style="padding:5px">{{row.entity.STATUS=="FINISHED"?"完成":(row.entity.STATUS=="OPEN"?"打开":(row.entity.STATUS=="WORKING"?"工作中":""))}}</div>'
            },
            {
                field: "SHIPSTATUS",
                displayName: '发运状态',
                width: '10%',
                cellTemplate:'<div style="padding:5px">{{row.entity.SHIPSTATUS=="UN_SHIP"?"待发运":(row.entity.SHIPSTATUS=="PART_SHIPPED"?"部分发运":(row.entity.SHIPSTATUS=="SHIPPED"?"已发运":""))}}</div>'
            },
            {
                field: "SHIPQUANTITYBU",
                displayName: '发运数量',
                width: '10%'
            },
            {
                field: "EXPECTEDQUANTITYBU",
                displayName: '计划数量',
                width: '10%'
            },
            {
                field: "ALLOCATEDQUANTITYBU",
                displayName: '分配数量',
                width: '10%'
            },
            {
                field: "PICKEDQUANTITYBU",
                displayName: '拣货数量',
                width: '10%'
            },
            {
                field: "CREATOR",
                displayName: '创建人员',
                width: '10%'
            },
            {
                field: "CREATED_TIME",
                displayName: '创建时间',
                width: '18%'
            },
            {
                field: "LAST_OPERATOR",
                displayName: '最后修改人员',
                width: '10%'
            },
            {
                field: "LAST_OPERATED_TIME",
                displayName: '最后修改时间',
                width: '18%'
            },
            {
                field: "OVER_PACKAGE_TIME",
                displayName: '结束包装时间',
                width: '18%'
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
        vm.toShip = function () {
            if (vm.entity.getSelectedRows().length == 0) {
                msgAlert.text('请选中一条要发运的单子');
                return false;
            } else if (vm.entity.getSelectedRows().length > 1) {
                msgAlert.text('每次只能发运一条单子');
            } else {
                $('#Dialog1').modal('show');
            }
        }
        vm.toPack = function () {
            if (vm.entity.getSelectedRows().length == 0) {
                msgAlert.text('请选中一条要复合的单子');
                return false;
            } else if (vm.entity.getSelectedRows().length > 1) {
                msgAlert.text('每次只能复合一条单子');
            } else {
                $state.go("wms.outbound.pack",{ID:vm.entity.getSelectedRows()[0].ID});
            }
        }


        vm.sure = function () {
            //vm.parceId = vm.entity.getSelectedRows()[0].ID;
            vm.shipParam = {
                id:vm.entity.getSelectedRows()[0].ID,
                transType:vm.logis,
                carrierId:$("#id_trans").val(),
                carrierName: vm.logis==0?'':vm.transEntity.getSelectedRows()[0].taker_nicknm
            }
            BillManage.parceSure(vm).success(function (data) {

                if (data.additionalMsg.status == '00') {
                    msgAlert.text('发运成功');
                    vm.getPage();
                    vm.entity.clearSelectedRows();
                    $('#Dialog1').modal('hide');
                } else {
                    msgAlert.text('系统繁忙 >﹏< [' + data.additionalMsg.message + ']');
                }
            });
        }

        /*********** **************************************************获取承运商信息************************************************************************************/
        vm.transColumn = [
            {
                field: 'taker_id',
                displayName: '承运商id',
                enableColumnMenu: false,// 是否显示列头部菜单按钮
                enableHiding: true,
                suppressRemoveSort: true,
                enableCellEdit: true, // 是否可编辑
            },
            {
                field: "taker_nicknm",
                displayName: '承运商名称',
                enableCellEdit: true,
                enableCellEditOnFocus: true
            }
        ]
        vm.placeholder_transName = '请选择承运商';
        vm.icon_owner = 'plus';
        vm.transParams = {
            bean:'umsCooper',
            method:'page',
            qryType:'T',
            qryRole:'3',  //3-承运人
            page:1,
            rows:10
        }
        vm.transPage = function () {
            $http({
                url: "/process"/*'../js/services/dashBoard.json'*/, method: "get",
                params: vm.transParams
            }).success(function (data) {
                if (data.additionalMsg.status == '00') {
                    vm.transData = data;
                } else{
                    msgAlert.text('系统繁忙 >﹏< [' + data.additionalMsg.message + ']');
                }
            });
        };
        vm.transPage();

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
            bean: 'user',
            method: 'pageOUsersByUserId',
            page: 1,
            rows: 10,
            userType:4,
            ownerType:1
        }
        vm.ownerPage = function () {
            $http({
                url: "/process"/*'../js/services/dashBoard.json'*/, method: "get",
                params: vm.ownerParams
            }).success(function (data) {
                vm.ownerData = data;
            })
        };
        vm.ownerPage();



        vm.parceFind = function () {

            vm.pageParams = {
                bean: 'wmsShip',
                method: 'page',
                docId: vm.pickTaskId,
                page: 1,
                rows: 10,
                code: $("#code").val(),
                warehouseId: $("#warehouseId").val(),
                outboundCode: $("#outboundCode").val(),
                ownerId: $("#ownerId").val(),
                status: $("#status").val(),
                shipStatus :$("#shipStatus").val(),
            }
            vm.getPage();
        }

        /**********************************************************获取单据类型*************************************************************/
        function initBillType() {
            vm.dictTypeName ='出库单据类型';
            BillManage.getBillTypeList(vm).success(function(data) {
                vm.billTypeList = data.rows;
                vm.billLst = data.rows;
            });
        }
        //单据类型匹配
        $scope.matchBillType = function(billType){
            for(var i=0;i<vm.billLst.length;i++){
                if(vm.billLst[i].dataValue == billType){
                    return vm.billLst[i].dataName;
                }
            }
            return billType;
        }

    });


