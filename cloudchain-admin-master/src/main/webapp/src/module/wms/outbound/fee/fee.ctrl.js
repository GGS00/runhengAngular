angular.module('MetronicApp')
 .controller('outFeeCtrl', ['$rootScope', '$scope','$http','$location','uiGridConstants', 'settings','BillManage','commonUtil','Table','Goods', function($rootScope, $scope, $http,$location, uiGridConstants,settings, BillManage,commonUtil,Table,Goods) {

    $scope.$on('$viewContentLoaded', function() {
        App.initAjax(); // initialize core components
    });
    // set sidebar closed and body solid layout mode
    $rootScope.settings.layout.pageContentWhite = true;
    $rootScope.settings.layout.pageBodySolid = false;
    $rootScope.settings.layout.pageSidebarClosed = false;
     $scope.toFixed2 = function (index) {
         if(typeof(index)=="undefined"){
             return '0.00';
         }
         var num = new Number(index/100);
         return     num.toFixed(2);
     }
    var vm = this;
     vm.objData="";
     vm.outboundId = $location.search().id;
     vm.id = $location.search().id;

     /*********************************************************加载单据类型***********************************************************/
     initiBill();
     function initiBill() {
         vm.dictTypeName ='出库单据类型';
         BillManage.getBillTypeList(vm).success(function(data) {
             vm.billTypeList = data.rows;
         });
     }

     /*********************************************************初始化页面状态***********************************************************/
    initial();
    function initial(){
        BillManage.getOutboundDetail(vm).success(function(data) {
            //vm.getPage();
            vm.objData = data.obj;
            vm.resultMap = data.resultMap;
            vm.ownerId = data.obj.ownerId;
            //初始化添加入库单明细中的入库单id和code
            $('input[name="outboundId"]').val(data.id);
            $('input[name="outboundCode"]').val(data.code);
            $('#inboundUpdateButton').attr("disabled", true);
            vm.billType = data.obj.billTypeId;
        });
    }

     /*********************************************************查询明细列表***********************************************************/
     vm.pageParams = {
         bean: 'wmsOperationFee',
         releaseId:vm.outboundId,
         method: 'page',
         page: 1,
         rows: 10
     }
     vm.column = [
         {
         field: "ofId",
         displayName: 'ID',
         visible: false,
         enableColumnMenu: false,// 是否显示列头部菜单按钮
     },
         {
             field: 'feeTypeName',
             displayName: '费用类型',
         },
         {
             field: "feePrice",
             displayName: '单价',
             cellTemplate:"<div style=\"padding:5px\">￥{{grid.appScope.$parent.toFixed2(row.entity.feePrice)}}</div>"
         },
         {
             field: "feeUnit",
             displayName: '单位',
             cellTemplate:'<div style="padding:5px">{{row.entity.feeUnit==1?"件":(row.entity.feeUnit==0?"吨":"库位")}}</div>'
         },
         {
             field: "feeNumber",
             displayName: '数量',
         }, {
             field: "feeMoney",
             displayName: '总价',
             cellTemplate:"<div style=\"padding:5px\">￥{{grid.appScope.$parent.toFixed2(row.entity.feeMoney)}}</div>"
         },{
             field: "status",
             displayName: '状态',
         },

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

     /*********************************************************校验修改按钮是否可操作  选择所有的name属性以'upd'开头的input元素***********************************************************/
/*     $('input[name^="upd"]').change(function(){
         if($('#inboundStatus').val() == 'OPEN'){
             $('#inboundUpdateButton').removeAttr("disabled");
         }
     });*/


     /*********** **************************************************获取费用类型信息************************************************************************************/
     vm.warehouseColumn = [
         {
             field: 'fId',
             displayName: '编号',
             enableColumnMenu: false,// 是否显示列头部菜单按钮
             enableHiding: true,
             suppressRemoveSort: true,
             enableCellEdit: true, // 是否可编辑
         },
         {
             field: "fName",
             displayName: '费用类型',
             enableCellEdit: true,
             enableCellEditOnFocus: true
         },
         {
             field: "price",
             displayName: '费用',
             enableColumnMenu: false,// 是否显示列头部菜单按钮
             enableCellEdit: true,
             enableCellEditOnFocus: true,
             enableCellEdit: true, // 是否可编辑
         },
         {
             field: "mainUnit",
             displayName: '单位',
             enableColumnMenu: false,// 是否显示列头部菜单按钮
             enableCellEdit: true,
             enableCellEditOnFocus: true,
             enableCellEdit: true, // 是否可编辑
         }
     ]
     vm.placeholder_warehouseName = '请输入费用类型';
     vm.icon_warehouse = 'plus';
     vm.warehouseParams = {
         bean: 'wmsFeeType',
         method: 'page',
         page: 1,
         rows: 10
     }
     vm.warehousePage = function () {
         commonUtil.getList(vm.warehouseParams).success(function (data) {
             if (data.additionalMsg.status == '00') {
                 vm.warehouseData = data;
                 vm.warehouseInData = data;
             } else  {
                 msgAlert.text('系统繁忙 >﹏< [' + data.additionalMsg.message + ']');
             }
         });
     };
     vm.warehousePage();


     /*********************************************************修改出库单***********************************************************/
     /*********************************************************添加费用***********************************************************/
     vm.addItemDetail = function () {
         $('#add_model').modal('show');
     }

     vm.feeTye =function () {
         $('#lar11ge').modal('show');
     }

     /*********************************************************返回按钮***********************************************************/
     vm.returnButton = function () {
         window.history.back(-1);
     }

     /*********************************************************删除费用***********************************************************/
     vm.delItemDetail = function () {

         if (vm.entity.getSelectedRows().length == 0) {
             msgAlert.text('请先选择要删除的一条费用');
             return false;
         } else if (vm.entity.getSelectedRows().length > 1) {
             msgAlert.text('每次只能删除一条费用');
         }else {
             vm.id
             BillManage.wmsOptFeeDelete(vm.entity.getSelectedRows()[0].ofId).success(function (data) {
                 if (data.status == '00') {
                     msgAlert.text('删除费用成功');
                     vm.getPage();
                 } else {
                     msgAlert.text('系统繁忙 >﹏< [' + data.msg + ']');
                 }
             })
         }
     }

     /*********************************************************修改费用**********************************************************/
    vm.updItemDetail = function(){
        if (vm.entity.getSelectedRows().length == 0) {
            msgAlert.info('请先选择要更新的一条明细');
            return false;
        }else if (vm.entity.getSelectedRows().length > 1) {
            msgAlert.info('每次只能修改一条明细');
            return false;
        }
        $('#upd_model').modal('show');
        //修改model页面栏位值初始化

        $('#upd_quantity').val(vm.entity.getSelectedRows()[0].expectedQuantityBU);
    }

     /*********************************************************修改页面中数值校验***********************************************************/
    $("#upd_quantity").change(function(){
        if (/^(\+|-)?\d+$/.test($("#upd_quantity").val())) {
        }else {
            msgAlert.info('数量请输入整数');
        }
    });

     /*********************************************************修改明细确定按钮***********************************************************/
     vm.sumbitUpdDeatil = function () {
         if($("#upd_quantity").val()==""){
             msgAlert.info('修改数量不能为空');
             return false;
         }else {
             if (/^(\+|-)?\d+$/.test($("#upd_quantity").val())) {
             }else {
                 msgAlert.info('数量必须为整数');
                 return false;
             }
         }
         vm.optFee_update={
             releaseId:vm.outboundId,
             ofId:vm.entity.getSelectedRows()[0].ofId,
             feeNumber:  $("#upd_quantity").val(),
             optType:1
         }
         BillManage.wmsOptFeeUpdate(vm).success(function (data) {
             if (data.status == '00') {
                 msgAlert.info('修改明细成功');
                 vm.getPage();
                 $("#upd_model").modal('hide');
             } else {
                 msgAlert.text('系统繁忙 >﹏< [' + data.message + ']');
             }
         })

     }

     /*************************************************************提交添加明细方法************************************************************************************/
     vm.sumbitAddDeatil = function () {


         vm.optFee_save = {
             ofId: vm.warehouseEntity.getSelectedRows()[0].fId,
             feePrice: vm.warehouseEntity.getSelectedRows()[0].price,
             feeTypeName:vm.warehouseEntity.getSelectedRows()[0].fName,
             feeUnit: vm.warehouseEntity.getSelectedRows()[0].mainUnit,
             optType:1,
             feeNumber:$('#id_quantity').val(),
             releaseId:vm.outboundId
         }
         BillManage.wmsOptFeeAdd(vm).success(function (data) {

             if (data.status == '00') {
                 msgAlert.info('添加杂费明细成功');
                 $('#selectCommonContacts').modal('hide');
                 vm.pageParams = {
                     bean: 'wmsWhOperationFee',
                     method: 'page',
                     page: 1,
                     rows: 10,
                     releaseId:vm.inboundId
                 }
                 vm.getPage();
             } else {
                 msgAlert.text('系统繁忙 >﹏< [' + data.message + ']');
             }
         })

     }

}]);
