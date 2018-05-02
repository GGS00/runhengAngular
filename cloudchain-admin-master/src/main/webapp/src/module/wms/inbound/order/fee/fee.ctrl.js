angular.module('MetronicApp')
 .controller('feeCtrl', ['$rootScope', '$scope','$http','$location','uiGridConstants', 'settings','BillManage','commonUtil','Table','Goods', function($rootScope, $scope, $http,$location, uiGridConstants,settings, BillManage,commonUtil,Table,Goods) {

    $scope.$on('$viewContentLoaded', function() {
        App.initAjax(); // initialize core components
    });
    // set sidebar closed and body solid layout mode
    $rootScope.settings.layout.pageContentWhite = true;
    $rootScope.settings.layout.pageBodySolid = false;
    $rootScope.settings.layout.pageSidebarClosed = false;
    var vm = this;
     vm.objData="";
     vm.inboundId = $location.search().id;
     vm.id = $location.search().id

     /*********************************************************加载单据类型***********************************************************/
     initiBill();
     function initiBill() {
         vm.dictTypeName ='入库单据类型';
         BillManage.getBillTypeList(vm).success(function(data) {
             vm.billTypeList = data.rows;
         });
     }

     /*********************************************************初始化页面状态***********************************************************/
    initial();
    function initial(){
        BillManage.getInboundDetail(vm).success(function(data) {
            //vm.getPage();
            vm.objData = data;

            //初始化添加入库单明细中的入库单id和code
            $('input[name="inboundId"]').val(data.id);
            $('input[name="inboundCode"]').val(data.code);
            $('#inboundUpdateButton').attr("disabled", true);
            vm.billType = data.billType.id;
        });
    }

     /*********************************************************查询明细列表***********************************************************/
     vm.pageParams = {
         bean: 'wmsOperationFee',
         releaseId:vm.inboundId,
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
         },
         {
             field: "feeUnit",
             displayName: '单位',
         },
         {
             field: "feeNumber",
             displayName: '数量',
         }, {
             field: "feeMoney",
             displayName: '总价',
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


     /*********************************************************修改入库单***********************************************************/
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

/*         vm.ids = [];
         if(vm.entity.getSelectedRows().length == 0) {
             msgAlert.info('请先选择至少一条要删除的明细记录');
             return false;
         }else {
             for(var i = 0 ;i < vm.entity.getSelectedRows().length ; i++){
                 vm.ids.push(vm.entity.getSelectedRows()[i].id);
             }
             vm.delItemsParam={
                 inboundId:vm.inboundId,
                 inboundItemId:vm.ids.toString()
             }
             BillManage.delInboundDetail(vm).success(function (data) {
                 if (data.additionalMsg.status == '00') {
                     msgAlert.info('删除明细成功,删除记录数:'+vm.entity.getSelectedRows().length);   //优化点，后台返回删除成功数
                     $('input[name="totalBU"]').val(data.totalBU);
                     //重新初始化页面
                     initial();
                     vm.getPage();
                 } else {
                     msgAlert.text('系统繁忙 >﹏< [' + data.additionalMsg.message + ']');
                 }
             })
         }*/
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
        $('#upd_quantity').val(vm.entity.getSelectedRows()[0].feeNumber);
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
             inboundId:vm.inboundId,
             ofId:vm.entity.getSelectedRows()[0].ofId,
             optType:0,
             releaseId:vm.inboundId,
             feeNumber:  $("#upd_quantity").val()
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
             optType:0,
             feeNumber:$('#id_quantity').val(),
             releaseId:vm.inboundId
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
