angular.module('MetronicApp')
 .controller('requisitionDetailCtrl', ['$rootScope', '$scope','$http','$location','uiGridConstants', 'settings','BillManage','commonUtil','Table','Goods', function($rootScope, $scope, $http,$location, uiGridConstants,settings, BillManage,commonUtil,Table,Goods) {

    $scope.$on('$viewContentLoaded', function() {
        App.initAjax(); // initialize core components
    });
    // set sidebar closed and body solid layout mode
    $rootScope.settings.layout.pageContentWhite = true;
    $rootScope.settings.layout.pageBodySolid = false;
    $rootScope.settings.layout.pageSidebarClosed = false;
    var vm = this;
     vm.showSwitch= 0;
    vm.requisitionId =  $location.search().id;
    initial();
     vm.ownerId;
     function initial(){
        BillManage.wmsRequisitionLoad( vm.requisitionId ).success(function(data) {
            vm.receverName =data.name;
            if(data.status==00){
                vm.getPage();
                vm.objData = data.obj;
                vm.ownerId = data.obj.ownerId;
            }else{
                msgAlert.text('系统繁忙 >﹏< ['+ data.additionalMsg.message+']');
            }
        });
    }
     vm.pageParams = {
         bean: 'wmsRequisitionItem',
         method: 'page',
         page: 1,
         rows: 10,
         requisitionId:vm.requisitionId
     }
    vm.column = [ {  field: "ID",
        displayName: 'ID',
        enableColumnMenu: false,// 是否显示列头部菜单按钮
    },
        {  field: "lineNo",
            displayName: '行号',
            enableColumnMenu: false,// 是否显示列头部菜单按钮
        },
        { field: 'PRODUCT_ID',
            displayName: '货品代码',
        },
        {  field: "PRODUCT_NAME",
            displayName: '货品名称',
        },

        {  field: "expectedQuantityBU",
            displayName: '数量',
        },
        {  field: "SUPPLIER_NAME",
            displayName: '供应商',
        },
        {  field: "inventoryStatus",
            displayName: '库存状态',
            cellTemplate:'<div style="padding:5px">{{row.entity.inventoryStatus=="GOOD"?"良品":(row.entity.inventoryStatus=="BAD"?"不良品":"")}}</div>'
        }
    ]
    vm.getPage = function () {
          
        commonUtil.getList(vm.pageParams).success(function (data) {
              
            if ( data.additionalMsg.status == '00') {
                vm.data = data;
            } else {
                msgAlert.text('系统繁忙 >﹏< [' + data.additionalMsg.message + ']');
            }
        });
    };
    //修改调拨单
    vm.UpdateOutboundSure = function () {
        vm.params={
            id:vm.requisitionId,
            description:  $("#id_description").val(),
        }
          
        BillManage.wmsRequisitionUpdate(vm).success(function (data) {
            if (data.status == '00') {
                msgAlert.text('修改调拨单成功');
                initial();
            } else {
                msgAlert.text('系统繁忙 >﹏< [' + data.message + ']');
            }
        })

    }
     //返回上一页按钮
     vm.onBack = function () {
         window.history.back(-1);
     }

     getBillTypeList();
     function getBillTypeList() {
         vm.dictTypeName ='出库单据类型';
         BillManage.getBillTypeList(vm).success(function(data) {
             vm.billTypeList = data.rows;
         });

     }
     vm.goodscolumn=[
         {
             field: 'skuId',
             displayName: '商品id',

         },{
             field: "title",
             displayName: '商品名称',
         }
     ]
     /*******************************************************************新增出库单明细***********************************************************************/
     vm.qryGoods = function () {

         //更新商品列表
         if(vm.dealEntity.getSelectedRows().length == 0){
             msgAlert.info('请先选择供应商信息');
             return false;
         }else if(vm.ownerId != vm.dealEntity.getSelectedRows()[0].userId){
             vm.goodsParams = {
                 bean: 'gmsSupplier',
                 method: 'pageGetSupplierSkuList',
                 qryType:'03',
                 supplierId:vm.dealEntity.getSelectedRows()[0].userId,
                 page: 1,
                 rows: 10
             }
             vm.goodsParams.cId = $scope.cIds
             vm.goodsParams.title = $scope.skuName
         }else {
             vm.goodsParams = {
                 bean: 'goods',
                 method: 'pageQryUserSkuLst',
                 qryUserId:vm.ownerId,
                 page: 1,
                 rows: 10
             }
             vm.goodsParams.cId = $scope.cIds
             vm.goodsParams.title = $scope.skuName
         }

         vm.getGoodsPage();
     }



     // 新增明细
     vm.addOutboundDetail = function () {

         if( vm.objData.status != '0'){
             msgAlert.text('调拨单非打开状态，不能进行添加明细操作');
         }else {
             vm.showSwitch = 1;
             vm.httpName = 'wmsOutboundItem/getInv';

             vm.dealcolumn = [
                 {
                     field: 'nickName',
                     displayName: '供应商名',
                     enableColumnMenu: false,// 是否显示列头部菜单按钮
                     enableHiding: true,
                     suppressRemoveSort: true,
                     enableCellEdit: true, // 是否可编辑
                 }
             ]
             vm.placeholder_dealer = '请输入供应商';
             vm.icon_dealer = 'plus';

             vm.dealParams = {
                 bean:'user',
                 method:'pageOUsersByUserId',
                 qryUserId:vm.ownerId,
                 userType:4,
                 ownerType:2,
                 isSupply:'1',
                 page:1,
                 rows:10
             }
             vm.placeholder_goodsName = '请输入商品名';
             vm.icon_goodsName = 'plus';

             vm.getdealPage();

             $('#selectCommonContacts2').modal('show');
         }

     }

     /*********************************************************************获取商品表**********************************************************************/

     vm.getGoodsPage = function () {
         if(vm.dealEntity.getSelectedRows().length == 0){
             msgAlert.info('请先选择供应商信息');
             return false;
         }else if(vm.ownerId != vm.dealEntity.getSelectedRows()[0].userId){
             vm.goodsParams = {
                 bean: 'gmsSupplier',
                 method: 'pageGetSupplierSkuList',
                 qryType:'03',
                 supplierId:vm.dealEntity.getSelectedRows()[0].userId,
                 page: 1,
                 rows: 10
             }
             vm.goodsParams.cId = $scope.cIds
             vm.goodsParams.title = $scope.skuName
         }else {
             vm.goodsParams = {
                 bean: 'goods',
                 method: 'pageQryUserSkuLst',
                 qryUserId:vm.ownerId,
                 page: 1,
                 rows: 10
             }
             vm.goodsParams.cId = $scope.cIds
             vm.goodsParams.title = $scope.skuName
         }
         commonUtil.getList(vm.goodsParams).success(function (data) {
             if (data.additionalMsg.status == '00') {
                 vm.goods_data = data;
             } else{
                 msgAlert.text('系统繁忙 >﹏< [' + data.additionalMsg.message + ']');
             }
         });

     };
     /*********************************************************选择商品对话框***********************************************************/
     vm.aaaa =function () {
         $('#lar11ge').modal('show');
     }

     vm.getdealPage = function () {
         $http({
             url: "/process"/*'../js/services/dashBoard.json'*/, method: "get",
             params: vm.dealParams
         }).success(function (data) {

             if (data.additionalMsg.status == '00' ) {
                 vm.deal_data = data;
             } else  {
                 msgAlert.text('系统繁忙 >﹏< [' + data.additionalMsg.message + ']');
             }
         });
     };
     vm.OutboundDetailSure = function () {
         if($("#id_deal").val()==""){
             msgAlert.info('请先选择供应商');
             return false;
         }
         if ($('#goods1').val() == "请选择商品") {
             msgAlert.info('请选择商品');
             return false;
         }
         if ($('#id_quantity2').val() == "") {
             msgAlert.text('请输入数量');
             return false;
         }
         if ($('#id_intensify').val() == "") {
             msgAlert.text('请选择库存状态');
             return false;
         }
         vm.params = {
             requisitionId:vm.requisitionId,
             productId: vm.goodsEntity.getSelectedRows()[0].skuId,
             expectedQuantityBu:$('#id_quantity2').val(),
             inventoryStatus: $('#id_intensify').val(),
             supplierId: vm.dealEntity.getSelectedRows()[0].userId,
             extendProp1:vm.goodsEntity.getSelectedRows()[0].title
         }
         BillManage.wmsRequisitionItemAdd(vm).success(function (data) {
             if (data.status == '00') {
                 msgAlert.info('添加调拨单明细成功');
                 $('#selectCommonContacts2').modal('hide');
                 vm.getPage();
                 $('#id_quantity').val("");
                 $('#id_intensify').val("GOOD");
                 $('#goods1').val("请选择商品");
             } else {
                 msgAlert.text('系统繁忙 >﹏< [' + data.message + ']');
             }
         })

     }
     $(function () {
         $('#selectCommonContacts').on('hide.bs.modal', function () {
             // if ($('#id_goods').val() != "") {
             //     vm.goodsEntity.getSelectedRows()[0].title = "";
             // }
             $('#id_goods').val("");
             $('#id_quantity').val("");
             $('#id_intensify').val("");
             // if ($('#id_deal').val() != "") {
             //     vm.dealEntity.getSelectedRows()[0].nickName = ""
             // }
             $('#id_deal').val("");
         })
     });

    //更新出库单明细
     vm.updateGoodDetal = function () {
               
             if( $("#id_quantity").val()==""){
                 msgAlert.text('修改数量不能为空');
                 $("#id_quantity").val(0);
                 return false;
             }
             vm.params={
                 id:vm.entity.getSelectedRows()[0].ID,
                 requisitionId:vm.requisitionId,
                 expectedQuantityBu:  $("#id_quantity").val() ,
             }
             BillManage.wmsRequisitionItemUpdate(vm).success(function (data) {
                 if (data.status == '00') {
                     msgAlert.text('修改明细成功');
                     vm.getPage();
                     $("#selectCommonContacts").modal('hide');
                 } else {
                     msgAlert.text('系统繁忙 >﹏< [' + data.additionalMsg.message + ']');
                 }
             })

     }
     //删除出库单明细
     vm.delGoodDetail = function () {

         if (vm.entity.getSelectedRows().length == 0) {
             msgAlert.text('请先选择要删除的一条明细');
             return false;
         } else if (vm.entity.getSelectedRows().length > 1) {
             msgAlert.text('每次只能删除一条明细');
         }else {
             BillManage.wmsRequisitionItemDelete(vm.entity.getSelectedRows()[0].ID).success(function (data) {
                 if (data.status == '00') {
                     msgAlert.text('删除明细成功');
                     vm.getPage();
                 } else {
                     msgAlert.text('系统繁忙 >﹏< [' + data.message + ']');
                 }
             })
         }


     }
    vm.UpdateDetailSure = function(){
        if (vm.entity.getSelectedRows().length == 0) {
            msgAlert.text('请先选择要更新的一条明细');
            return false;
        } else if (vm.entity.getSelectedRows().length > 1) {
            msgAlert.text('每次只能修改一条明细');
            return false;
        }
        $('#selectCommonContacts').modal('show');
    }


     function categoryTree() {
         $("#categoryTree").jstree({
             "core" : {
                 "themes" : {
                     "responsive": false
                 },
                 // so that create works
                 "check_callback" : true,
             },
             "types" : {
                 "default" : {
                     "icon" : "fa fa-folder icon-state-warning icon-lg"
                 },
                 "file" : {
                     "icon" : "fa fa-file icon-state-warning icon-lg"
                 }
             },
             "state" : { "key" : "demo2" },
             "plugins" : ["dnd", "state", "types"]
         })

     }

     Goods.getCategoryList().success(function (data) {
         console.log(data)
         var oldbox = data.data;
         var row =  new Array();

         row.push({"id":0,"parent":"#","text":"全部商品"})
         if(oldbox != null){
             for(var i=0;i<oldbox.length;i++){
                 if(oldbox[i].parentCId == 0){
                     row.push({"id":oldbox[i].cId,"parent":"#","text":oldbox[i].name})
                 }else{
                     row.push({"id":oldbox[i].cId,"parent":oldbox[i].parentCId,"text":oldbox[i].name})
                 }
             }
         }
         categoryTree()
         $("#categoryTree").jstree(true).settings.core.data = row;
         $('#categoryTree').jstree(true).deselect_all();
         $("#categoryTree").jstree(true).refresh('true');
         $("#categoryTree").on('changed.jstree',function(e,data){
             $scope.cIds="";
             var i, j;
             for (i = 0, j = data.selected.length; i < j; i++) {
                 var node = data.instance.get_node(data.selected[i]);
                 if (data.instance.is_leaf(node)) {
                     if(node.id == 0){
                         node.id = ""
                     }
                     $scope.cIds = node.id;
                     vm.goodsParams.cId = $scope.cIds,
                         vm.getGoodsPage()
                 }
             }
         });
     })
     vm.serachGoods = function () {
         vm.getGoodsPage()
     }
     vm.overClick = function () {
         if(vm.goodsEntity.getSelectedRows().length == 0) {
             msgAlert.info('请先选择至少一条商品');
             return false;
         }else  if(vm.goodsEntity.getSelectedRows().length > 1) {
             msgAlert.info('不能选择多条商品');
             return false;
         }else {
             $("#goods1").val(vm.goodsEntity.getSelectedRows()[0].title);
             $('#lar11ge').modal('hide');
         }
     }
}]);
