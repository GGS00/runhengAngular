
angular.module('MetronicApp')
  .controller('outboundPickCtrl', ['$rootScope', '$scope','$http','uiGridConstants', 'settings','BillManage','commonUtil','Table',function($rootScope, $scope, $http,uiGridConstants,settings, BillManage,commonUtil,Table) {
    $scope.$on('$viewContentLoaded', function() {
        App.initAjax(); // initialize core components
    });
    $rootScope.settings.layout.pageContentWhite = true;
    $rootScope.settings.layout.pageBodySolid = false;
    $rootScope.settings.layout.pageSidebarClosed = false;
    var vm = this;
      //加载单据类型
      initBillType();
      vm.billLst = [];
    vm.menuLen = 4;
    vm.pageParams = {
        bean:'wmsPickDoc',
        method:'page',
        page:1,
        rows:10
    }
    vm.column = [ {  field: "ID",
        displayName: 'ID',
        width:'5%',
        visible:false,
        enableColumnMenu: false,// 是否显示列头部菜单按钮
    },
        { field: 'OWNER_ID',
            displayName: '货主id',
            width: '10%',
            visible:false,
        },
        {  field: "WAREHOUSE_ID",
            displayName: '仓库id',
            width: '10%',
            visible:false,
        },
        {  field: "CODE",
            displayName: '拣货单号',
            suppressRemoveSort: true,
            enableColumnMenu: false,// 是否显示列头部菜单按钮
            width: '22%',
            enableCellEdit: true,
            enableCellEditOnFocus:true,
        },
        {  field: "OUTBOUND_CODE",
            displayName: '出库单号',
            suppressRemoveSort: true,
            enableColumnMenu: false,// 是否显示列头部菜单按钮
            width: '22%',
            enableCellEdit: true,
            enableCellEditOnFocus:true,
        },
        {  field: "BILL_TYPE_ID",
            displayName: '单据类型',
            width: '10%',
            cellTemplate:'<div style="padding:5px">{{grid.appScope.$parent.matchBillType(row.entity.BILL_TYPE_ID)}}</div>'

        },
        {  field: "WAREHOUSE_NAME",
            displayName: '发货仓库',
            width: '10%'

        },
        {  field: "OWNER_NAME",
            displayName: '货主',
            width: '10%'

        },
        {  field: "URGENT",
            displayName: '是否加急',
            width: '10%',
            cellTemplate:'<div style="padding:5px">{{row.entity.URGENT==1?"加急":(row.entity.URGENT==0?"不加急":"")}}</div>'
        },
        {  field: "STATUS",
            displayName: '订单状态',
            width: '10%',
            cellTemplate:'<div style="padding:5px">{{row.entity.STATUS=="FINISHED"?"完成":(row.entity.STATUS=="DELETE"?"删除":(row.entity.STATUS=="ACTIVE"?"生效":(row.entity.STATUS=="OPEN"?"打开":(row.entity.STATUS=="WORKING"?"工作中":(row.entity.STATUS=="ALLOCATED"?"已分配":"")))))}}</div>'
        },

        {  field: "expectedQuantityBU",
            displayName: '订单数量',
            width: '10%'
        },
        {  field: "allocatedQuantityBU",
            displayName: '分配数量',
            width: '10%'
        },
        {  field: "movedQuantityBU",
            displayName: '已拣数量',
            width: '10%'
        },

        {  field: "CREATOR",
            displayName: '创建人',
            width: '10%',
            enableCellEdit: true,
            enableCellEditOnFocus:true
        },,
        {  field: "CREATED_TIME",
            displayName: '创建时间',
            width: '20%',
            enableCellEdit: true,
            enableCellEditOnFocus:true
        },,
        {  field: "LAST_OPERATOR",
            displayName: '修改人',
            width: '10%',
            enableCellEdit: true,
            enableCellEditOnFocus:true
        },
        {  field: "LAST_OPERATED_TIME",
            displayName: '修改时间',
            width: '22%',
            enableCellEdit: true,
            enableCellEditOnFocus:true
        }
    ]
    vm.getPage = function () {
        $http({url:"/process"/*'../js/services/dashBoard.json'*/,method: "get",
            params:vm.pageParams
        }).success(function(data) {
            vm.data = data;
        })
    };
    vm.getPage();
    
    
    vm.automatic = function () {
        if(vm.entity.getSelectedRows().length == 0){
            msgAlert.text('请先选择要分配的拣货单');
            return false;
        }else if(vm.entity.getSelectedRows().length > 1){
            msgAlert.text('每次只能分配一条拣货单');
        }else{
            vm.autoId = vm.entity.getSelectedRows()[0].ID;
            BillManage.autoAllocate(vm).success(function (data) {

                if ( data.additionalMsg.status == '00') {
                    msgAlert.text('分配成功');
                     vm.getPage();
                } else  {
                    msgAlert.text('系统繁忙 >﹏< [' + data.additionalMsg.message + ']');
                }
            })


        }
    }

    /*拣货生效*/
    vm.pickActive = function(){
        if(vm.entity.getSelectedRows().length == 0){
            msgAlert.text('请先选择要生效的拣货单');
            return false;
        }else if(vm.entity.getSelectedRows().length > 1){
            msgAlert.text('每次只能生效一条拣货单');
        }else{
            vm.pickId = vm.entity.getSelectedRows()[0].ID;
            BillManage.pickActive(vm).success(function (data) {

                if ( data.additionalMsg.status == '00') {
                    msgAlert.text('生效成功');
                    vm.getPage();
                } else  {
                    msgAlert.text('系统繁忙 >﹏< [' + data.additionalMsg.message + ']');
                }
            })
        }
    }

      /*拣货失效*/
      vm.pickInvalid = function(){
          if(vm.entity.getSelectedRows().length == 0){
              msgAlert.text('请先选择要失效的拣货单');
              return false;
          }else if(vm.entity.getSelectedRows().length > 1){
              msgAlert.text('每次只能失效一条拣货单');
          }else{
              vm.pickId = vm.entity.getSelectedRows()[0].ID;
              BillManage.pickInvalid(vm).success(function (data) {

                  if ( data.additionalMsg.status == '00') {
                      msgAlert.text('失效成功');
                      vm.getPage();
                  } else  {
                      msgAlert.text('系统繁忙 >﹏< [' + data.additionalMsg.message + ']');
                  }
              })
          }
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

      vm.pickFind = function () {
          vm.pageParams = {
              bean: 'wmsPickDoc',
              method: 'page',
              page: 1,
              rows: 10,
              code: $("#code").val(),
              warehouseId: $("#warehouseId").val(),
              outboundCode: $("#outboundCode").val(),
              ownerId: $("#ownerId").val(),
              status: $("#status").val(),
              shipStatus :$("#shipStatus").val(),
              urgent:$("#urgent").val()
          }
          vm.getPage();
      }

      /**********************************************************获取单据类型*************************************************************/
      function initBillType() {
          vm.dictTypeName ='出库单据类型';
          BillManage.getBillTypeList(vm).success(function(data) {
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
  }]);



