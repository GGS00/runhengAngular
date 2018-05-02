
angular.module('MetronicApp')
 .controller('TaskConfirmCtrl', ['$rootScope', '$scope','$http','$location','uiGridConstants', 'settings','BillManage','commonUtil','Table',function($rootScope, $scope, $http,$location,uiGridConstants,settings, BillManage,commonUtil,Table) {
    $scope.$on('$viewContentLoaded', function() {
        App.initAjax(); // initialize core components
    });
    $rootScope.settings.layout.pageContentWhite = true;
    $rootScope.settings.layout.pageBodySolid = false;
    $rootScope.settings.layout.pageSidebarClosed = false;
    var vm = this;
    vm.pickTaskId =  $location.search().id;
    vm.menuLen = 4;

      vm.pageParams = {
          bean:'wmsPickTask',
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
          { field: 'ORGNAME',
              displayName: '货主',
              width: '10%'
          },
          {  field: "WAREHOUSEID",
              displayName: '仓库id',
              width: '10%',
              visible:false,
          },
          {  field: "WAREHOUSENAME",
              displayName: '仓库',
              width: '10%'
          },

          {  field: "PRODUCTNAME",
              displayName: '货品',
              width: '10%'
          },
          {  field: "PLAN_QUANTITY_BU",
              displayName: '计划数量',
              width: '10%'

          },
          {  field: "MOVED_QUANTITY_BU",
              displayName: '移位数量',
              width: '10%'

          },
          {  field: "PICK_TYPE",
              displayName: '任务类型',
              width: '10%',
              cellTemplate:'<div style="padding:5px">{{row.entity.PICK_TYPE=="NON_UNIQUE"?"非唯一码":"唯一码"}}</div>'
          },
          {  field: "WORKER_NAME",
              displayName: '任务责任人',
              width: '10%'
          }
          ,
          {  field: "SRC_LOCATION_CODE",
              displayName: '源库位',
              width: '10%'
          },
          {  field: "DEST_LOCATION_CODE",
              displayName: '目标库位',
              width: '10%'
          },
          {  field: "STATUS",
              displayName: '状态',
              width: '10%',
              cellTemplate:'<div style="padding:5px">{{row.entity.STATUS=="NON_WORK_DOC"?"未作业":(row.entity.STATUS=="WORKING"?"作业中":(row.entity.STATUS=="FINISHED"?"作业完成":(row.entity.STATUS=="OPEN"?"打开":"")))}}</div>'
          },
          {  field: "INVENTORY_STATUS",
              displayName: '库存状态',
              width: '10%',
              cellTemplate:'<div style="padding:5px">{{row.entity.INVENTORY_STATUS=="GOOD"?"良品":"不良品"}}</div>'
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

     //取消按钮
     vm.onBack = function () {
         window.history.back(-1);
     }
      vm.sure =function () {
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
          vm.taskId=vm.entity.getSelectedRows()[0].ID;
          vm.taskExecutor = vm.userEntity.getSelectedRows()[0].empId;
          vm.workerName = vm.userEntity.getSelectedRows()[0].realName;
          BillManage.TaskAllocate(vm).success(function(data) {
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


}]);




