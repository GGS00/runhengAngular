angular.module('MetronicApp')
 .controller('inboundDetailCtrl', ['$rootScope', '$scope','$http','$location','uiGridConstants', 'settings','BillManage','commonUtil','Table','Goods', function($rootScope, $scope, $http,$location, uiGridConstants,settings, BillManage,commonUtil,Table,Goods) {

    $scope.$on('$viewContentLoaded', function() {
        App.initAjax(); // initialize core components
    });
    // set sidebar closed and body solid layout mode
    $rootScope.settings.layout.pageContentWhite = true;
    $rootScope.settings.layout.pageBodySolid = false;
    $rootScope.settings.layout.pageSidebarClosed = false;
    var vm = this;
     vm.objData="";
     vm.inboundId =  $location.search().id;
     initFeeUnit();
     vm.fineOrder_switch = 0;

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

            //判断是否存在优仓单
            if(data.wmsWhLeaseConfig != null){
                vm.fineOrder_switch = 1;
                vm.selectFeeUnit = data.wmsWhLeaseConfig.feeType + '';
                vm.selectFeeType = data.wmsWhLeaseConfig.feeModel + '';
                vm.fineOrderPrice = data.wmsWhLeaseConfig.feePrice/100;
                if(data.wmsWhLeaseConfig.leaseType == 0){
                    vm.fineOrderType = '包仓';
                }else {
                    vm.fineOrderType = '零仓';
                }
                setTimeout(function () {
                    $('#id_fine_order_unit').attr("disabled", true);
                    $('#id_fine_order_feetype').attr("disabled", true);
                },10);
            }

            //判断页面中按钮是否可操作
            if(data.status == '' || data.status != 'OPEN'){
                $('#addItemDetail').attr("disabled", true);
                $('#updItemDetail').attr("disabled", true);
                $('#delItemDetail').attr("disabled", true);
            }
            vm.skuPage();
        });
    }

     /*********************************************************查询入库单明细列表***********************************************************/
     vm.pageParams = {
         bean: 'wmsInboundItem',
         inboundId:vm.inboundId,
         method: 'page',
         page: 1,
         rows: 10
     }
     vm.column = [
         {
         field: "id",
         displayName: 'ID',
         visible: false,
         enableColumnMenu: false,// 是否显示列头部菜单按钮
     },
         {
             field: 'supplier.id',
             displayName: '货主ID',
             visible: false,
         },
         {
             field: "inbound.warehouseId",
             visible: false,
             displayName: '仓库ID',
         },
         {
             field: "product.id",
             displayName: '货品编码',
         },
         {
             field: "product.name",
             displayName: '货品名称',
         }, {
             field: "expectedQuantityBU",
             displayName: '期待数量',
         },{
             field: "receivedQuantityBU",
             displayName: '收货数量',
         },{
             field: "shelvedQuantityBU",
             displayName: '上架数量',
         },
         {
             field: "expectedSnQuantity",
             displayName: '期待唯一码数量',
         },
         {
             field: "realSnQuantity",
             displayName: '已录唯一码数量',
         },
         {
             field: "inventoryStatus",
             displayName: '库存状态',
             cellTemplate:'<div style="padding:5px">{{row.entity.inventoryStatus=="GOOD"?"良品":(row.entity.inventoryStatus=="BAD"?"不良品":row.entity.inventoryStatus)}}</div>'
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

     /*********************************************************校验修改按钮是否可操作  选择所有的name属性以'upd'开头的input元素***********************************************************/
     $('input[name^="upd"]').change(function(){
         if($('#inboundStatus').val() == 'OPEN'){
             $('#inboundUpdateButton').removeAttr("disabled");
         }
     });

     /*********************************************************修改入库单***********************************************************/
    vm.updInbound = function () {
        //校验是否可修改
        if($('#inboundStatus').val() != 'OPEN'){
            msgAlert.info('入库单非打开状态，不能进行修改操作');
            return false;
        }
        vm.updateParams={
            id:vm.inboundId,
            description:  $('input[name="upddesc"]').val(),
            relatedBillNo1:$('input[name="updrelatedBillNo1"]').val(),
            relatedBillNo2:$('input[name="updrelatedBillNo2"]').val(),
            relatedBillNo3:$('input[name="updrelatedBillNo3"]').val()
        }
          
        BillManage.updInbound(vm).success(function (data) {
            if (data.additionalMsg.status == '00') {
                msgAlert.info('修改入库单成功');
                //重新初始化页面
                //initial();
            } else {
                msgAlert.text('系统繁忙 >﹏< [' + data.additionalMsg.message + ']');
            }
        })

    }

     /*********************************************************添加明细***********************************************************/
     vm.addItemDetail = function () {
         //校验是否可修改
         if($('#inboundStatus').val() != 'OPEN'){
             msgAlert.info('入库单非打开状态，不能进行添加明细操作');
             return false;
         }
         $('#add_model').modal('show');
     }

     /*********************************************************返回按钮***********************************************************/
     vm.returnButton = function () {
         window.history.back(-1);
     }

     /*********************************************************删除入库单明细***********************************************************/
     vm.delItemDetail = function () {
         //校验是否可删除
         if($('#inboundStatus').val() != 'OPEN'){
             msgAlert.info('入库单非打开状态，不能进行删除明细操作');
             $('#delItemDetail').attr('disabled',true);
             return false;
         }

         vm.ids = [];
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
         }
     }

     /*********************************************************修改明细按钮***********************************************************/
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
        $('#upd_skuName').val(vm.entity.getSelectedRows()[0].product.name);
        $('#upd_quantity').val(vm.entity.getSelectedRows()[0].expectedQuantityBU);
        $('#upd_inventStatus').val(vm.entity.getSelectedRows()[0].inventoryStatus=='GOOD'?'良品':(vm.entity.getSelectedRows()[0].inventoryStatus=='BAD'?'不良品':vm.entity.getSelectedRows()[0].inventoryStatus));
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
         vm.updateItemParam={
             inboundId:vm.inboundId,
             inboundItemId:vm.entity.getSelectedRows()[0].id,
             quantity:  $("#upd_quantity").val()
         }
         BillManage.updItemDetailSure(vm).success(function (data) {
             if (data.additionalMsg.status == '00') {
                 msgAlert.info('修改明细成功');
                 $('input[name="totalBU"]').val(data.totalBU);
                 vm.getPage();
                 $("#upd_model").modal('hide');
             } else {
                 msgAlert.text('系统繁忙 >﹏< [' + data.additionalMsg.message + ']');
             }
         })

     }

     /*********** **************************************************获取GMS商品信息************************************************************************************/
     vm.skuColumn=[
         {
             field: 'skuId',
             displayName: '商品id',
             enableColumnMenu: false,// 是否显示列头部菜单按钮
             enableHiding: true,
             suppressRemoveSort: true,
             enableCellEdit: true, // 是否可编辑
         },{
             field: "title",
             displayName: '商品名称',
             enableCellEdit: true,
             enableCellEditOnFocus: true
         }
     ]
     vm.placeholder_skuName = '请输入货品';
     vm.icon_sku = 'plus';

     vm.skuPage = function () {
         if(vm.objData.supplier.userId != '' && vm.objData.owner.userId != vm.objData.supplier.userId){
             //查询供应商绑定商品列表
             vm.skuParams = {
                 bean: 'gmsSupplier',
                 method: 'pageGetSupplierSkuList',
                 qryType:'03',
                 supplierId:vm.objData.supplier.userId,
                 page: 1,
                 rows: 10
             }
             vm.skuParams.cId = $scope.cIds
             vm.skuParams.title = $scope.skuName
         }else {
             //按货主查询商品列表;
             vm.skuParams = {
                 bean: 'goods',
                 method: 'pageQryUserSkuLst',
                 qryUserId:vm.objData.owner.userId,
                 page: 1,
                 rows: 10
             }
             vm.skuParams.cId = $scope.cIds
             vm.skuParams.title = $scope.skuName
         }
         commonUtil.getList(vm.skuParams).success(function(data) {
             if(data.additionalMsg.status=='成功' || data.additionalMsg.status == '00'){
                 vm.skuData = data;
             }else if(data.additionalMsg.status=='01'){
                 msgAlert.text('获取商品列表失败 >﹏< ['+ data.additionalMsg.message+']');
             }
         });
     };
     /*********************************************************选择商品对话框***********************************************************/
    vm.aaaa =function () {
        $('#lar11ge').modal('show');
    }

     /*************************************************************提交添加明细方法************************************************************************************/
     vm.sumbitAddDeatil = function () {
         if( $('input[name="productId"]').val()==""){
             msgAlert.info('请先选择先选择商品');
             return;
         }
         vm.form = $("#WmsInboundItem").serialize();
         vm.form = decodeURIComponent(vm.form,true);
         console.log(vm.form)
         $.ajax({
             url:"/wmsInboundItem/addInboundItem",
             data:vm.form,
             type:"post",
             dataType:"json",
             success:function(data){
                 if(data.additionalMsg.status=='成功' || data.additionalMsg.status == '00'){
                     $('#add_model').modal('hide');
                     msgAlert.info('新增成功');
                     vm.pageParams = {
                         bean: 'wmsInboundItem',
                         method: 'page',
                         page: 1,
                         rows: 10,
                         inboundId:$('input[name="inboundId"]').val()
                     }
                     vm.getPage();
                     $('input[name="totalBU"]').val(data.totalBU);
                     $('input[name="productId"]').val(""); //货品id
                     $("#goods1").val("请选择商品");
                 }else if(data.additionalMsg.status=='01'){
                     msgAlert.text('系统繁忙 >﹏< ['+ data.additionalMsg.message+']');
                 }
             },
             error:function(){
                 // msgAlert.text('系统繁忙 >﹏<');
             }
         })
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
                     vm.skuParams.cId = $scope.cIds,
                         vm.skuPage()
                 }
             }
         });
     })
     vm.serachGoods = function () {
             vm.skuPage()
     }
     vm.overClick = function () {
         if(vm.skuEntity.getSelectedRows().length == 0) {
             msgAlert.info('请先选择至少一条商品');
             return false;
         }else  if(vm.skuEntity.getSelectedRows().length > 1) {
             msgAlert.info('不能选择多条商品');
             return false;
         }else {
              $("#goods1").val(vm.skuEntity.getSelectedRows()[0].title);
             $('input[name="productId"]').val(vm.skuEntity.getSelectedRows()[0].skuId); //货品id
             $('#lar11ge').modal('hide');
         }
     }
     /**********************************************************计费单位处理*************************************************************/
     function initFeeUnit() {
         vm.dictTypeName ='优仓计费单位';
         BillManage.getBillTypeList(vm).success(function(data) {
             vm.feeUnitList = data.rows;
         });
     }
}]);
