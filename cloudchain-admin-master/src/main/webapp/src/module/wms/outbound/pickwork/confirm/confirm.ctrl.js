
angular.module('MetronicApp')
 .controller('outboundPickConfirmCtrl', ['$rootScope', '$scope','$http','$location','uiGridConstants', 'settings','BillManage','commonUtil','Table',function($rootScope, $scope, $http,$location,uiGridConstants,settings, BillManage,commonUtil,Table) {
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
          docId:  vm.pickTaskId,
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

     vm.cartonParams = {
         bean: 'wmsTurnoverCarton',
         method: 'page',
         page: 1,
         rows: 10
     }
     vm.getCartonPage = function () {
         commonUtil.getList(vm.cartonParams).success(function (data) {

             if (data.additionalMsg.status == '00') {
                 vm.cartonList = data.rows;
                 vm.cartonSelectedOption=vm.cartonList[0].id;
             } else {
                 msgAlert.text('系统繁忙 >﹏< [' + data.additionalMsg.message + ']');
             }
         });

     };
     vm.getCartonPage();

     //取消按钮
     vm.onBack = function () {
         window.history.back(-1);
     }
  vm.sure =function () {
        if(vm.entity.getSelectedRows()[0].PICK_TYPE=="UNIQUE"){
            $('#Dialog2').modal('show');
            $('#quantity2').val(vm.entity.getSelectedRows()[0].PLAN_QUANTITY_BU - vm.entity.getSelectedRows()[0].MOVED_QUANTITY_BU);
        }else {
            $('#Dialog1').modal('show');
            $('#quantity').val(vm.entity.getSelectedRows()[0].PLAN_QUANTITY_BU - vm.entity.getSelectedRows()[0].MOVED_QUANTITY_BU);
        }
  }

  vm.add1 =function () {

      vm.num = vm.entity.getSelectedRows()[0].PLAN_QUANTITY_BU-vm.entity.getSelectedRows()[0].MOVED_QUANTITY_BU;
      if(vm.num<=0){
          msgAlert.info('可拣选确认数量小于0,不能录入继续操作');
          return false;
      }
      if($.trim($("#quantity").val())==""){
          msgAlert.info('数量不能为空');
          $("#quantity").val(0);
          return false;
      }else if($("#quantity").val()>vm.num){
          msgAlert.info('数量不能大于可拣选数量');
          return false;
      }
      vm.quantity = $("#quantity").val();
      vm.pickLengthparams={
          id:vm.entity.getSelectedRows()[0].ID,
          quantity:vm.quantity
      }
          BillManage.pickSureLength(vm).success(function(data) {
          if(data.additionalMsg.status=='00'){
              msgAlert.info('拣选确认成功');
              $('#Dialog1').modal('hide');
              $("#quantity").val("")
              vm.getPage();
              vm.entity.clearSelectedRows();
          }else {
              msgAlert.text('系统繁忙 >﹏< ['+ data.additionalMsg.message+']');
          }

      });
  }
  vm.add2 =function () {

      vm.num = vm.entity.getSelectedRows()[0].PLAN_QUANTITY_BU-vm.entity.getSelectedRows()[0].MOVED_QUANTITY_BU;
      if(vm.num<=0){
          msgAlert.info('可拣选确认数量小于0,不能录入继续操作');
          return false;
      }
      if($.trim($("#quantity2").val())==""){
          msgAlert.info('数量不能为空');
          $("#quantity2").val(0);
          return false;
      }else if($("#quantity2").val()>vm.num){
          msgAlert.info('数量不能大于可拣选数量');
          return false;
      }
      vm.quantity2 = $("#quantity2").val();
      vm.codeArray = [];
      vm.uniqueCodes = $('#uniqueCodes').val();
      vm.length = $('#length').val();
      if($.trim( vm.length)==""){
          msgAlert.info('长度不能为空');
          $("#length").val(0);
          return false;
      }
      vm.uniqueCode_Array = $.trim( vm.uniqueCodes).split("\n");
      for(var i = 0;i<vm.uniqueCode_Array.length;i++){
          vm.code = $.trim(vm.uniqueCode_Array[i]);//得到每行数据
          if(vm.code != ""){
              if(vm.code.length == vm.length){
                  vm.codeArray.push(vm.code);
              }else{//不通过
                  msgAlert.info('输入唯一码长度与填写长度不一致，请重新输入');
                  return false;
              }
          }
      }
      vm.uniqueCode = vm.codeArray.join(',');
      if($.trim(vm.uniqueCode)==""){
          msgAlert.info('唯一码不能为空');
          return false;
      }
      if($.trim($("#quantity2").val())!=vm.codeArray.length){
          msgAlert.info('数量与唯一码个数不一致，请补全');
          return false;
      }
      vm.pickScanParams={
          id:vm.entity.getSelectedRows()[0].ID,
          quantity:vm.quantity2,
          uniqueCodes:vm.uniqueCode,
          length: vm.length,
          productCode: vm.entity.getSelectedRows()[0].PRODUCTCODE
      }
      BillManage.pickSureScan(vm).success(function(data) {

          if(data.additionalMsg.status=='00'){
              msgAlert.info('拣选确认成功');
              $('#Dialog2').modal('hide');
              $('#length').val("");
              $('#uniqueCodes').val("")
              $("#quantity2").val("")
              vm.getPage();
              vm.entity.clearSelectedRows();
          }else {
              msgAlert.text('系统繁忙 >﹏< ['+ data.additionalMsg.message+']');
          }
      });
  }

}]);




