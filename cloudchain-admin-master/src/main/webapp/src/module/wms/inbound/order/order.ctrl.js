/**
 * 入库单控制器
 */
angular.module('MetronicApp').controller('BillInboundContro', ['$rootScope', '$scope', '$http', 'uiGridConstants', 'settings', 'BillManage', 'commonUtil', 'Table', function ($rootScope, $scope, $http, uiGridConstants, settings, BillManage, commonUtil, Table) {
    $scope.$on('$viewContentLoaded', function () {
        App.initAjax(); // initialize core components
    });
    $rootScope.settings.layout.pageContentWhite = true;
    $rootScope.settings.layout.pageBodySolid = false;
    $rootScope.settings.layout.pageSidebarClosed = false;
    var vm = this;
    vm.billLst = [];
    //加载单据类型
    initial();
    vm.menuLen = 4;
    vm.pageParams = {
        bean: 'wmsInbound',
        //status:'UNFINISHED',  20170407删除，显示全部数据
        method: 'page',
        page: 1,
        rows: 10
    }
    vm.column = [
        {
            field: "code",
            displayName: '入库单号',
            width: '20%',
            cellTemplate: '<a ui-sref="wms.inbound.details({id:row.entity.id})" style="display: block;margin: 5px;">{{row.entity.code}}</a>'
        },
        {field: "id",
        displayName: 'ID',
        width: '5%',
        visible: false,
        enableColumnMenu: false,// 是否显示列头部菜单按钮
    },
        {
            field: 'owner.userId',
            displayName: '货主id',
            width: '10%',
            visible: false,
        },
        {
            field: "warehouse.id",
            displayName: '仓库id',
            width: '10%',
            visible: false,
        },
        {
            field: "owner.nickName",
            displayName: '货主',
            suppressRemoveSort: true,
            enableColumnMenu: false,// 是否显示列头部菜单按钮
            width: '10%',
            enableCellEdit: true,
            enableCellEditOnFocus: true,
        },
        {
            field: "billType.id",
            displayName: '单据类型',
            width: '10%',
            cellTemplate:'<div style="padding:5px">{{grid.appScope.$parent.matchBillType(row.entity.billType.id)}}</div>'
        },
        {
            field: "status",
            displayName: '状态',
            width: '10%',
            cellTemplate:'<div style="padding:5px">{{row.entity.status=="OPEN"?"打开":(row.entity.status=="WORKING"?"工作中":(row.entity.status=="ACTIVE"?"生效":(row.entity.status=="FINISHED"?"完成":(row.entity.status=="DELETE"?"删除":row.entity.status))))}}</div>'
        },
        {
            field: "receiveStatus",
            displayName: '收货状态',
            width: '10%',
            cellTemplate:'<div style="padding:5px">{{row.entity.receiveStatus=="UN_RECEIVE"?"未收货":(row.entity.receiveStatus=="RECEIVED"?"收货完成":(row.entity.receiveStatus=="RECEIVING"?(row.entity.status=="OPEN"?"收货中":"部分收货"):row.entity.receiveStatus))}}</div>'
        },
        {
            field: "shelveStatus",
            displayName: '上架状态',
            width: '10%',
            cellTemplate:'<div style="padding:5px">{{row.entity.shelveStatus=="UN_SHELVE"?"未上架":(row.entity.shelveStatus=="SHELVED"?"上架完成":(row.entity.shelveStatus=="SHELVING"?"上架中":"部分上架"))}}</div>'
        },
        {
            field: "supplier.nickName",
            displayName: '供应商',
            width: '10%'
        },
        {
            field: "expectedQuantityBU",
            displayName: '总期待数量',
            width: '10%'
        },
        {
            field: "expectedSnQuantity",
            displayName: '唯一码期待数量',
            width: '10%'
        },
        {
            field: "receivedQuantityBU",
            displayName: '实际收货数量',
            width: '10%'
        },
        {
            field: "realSnQuantity",
            displayName: '唯一码录入数量',
            width: '10%'
        },
        {
            field: "moveDocQuantityBU",
            displayName: '上架数量',
            width: '10%'
        },
        {
            field: "dataFrom",
            displayName: '入库单来源方式',
            width: '12%',
            cellTemplate:'<div style="padding:5px">{{row.entity.dataFrom=="MANUAL"?"手工创建":(row.entity.dataFrom=="INTERFACE"?"接口":(row.entity.dataFrom=="DATA_FROM_WMS_CREATED"?"仓储创建":(row.entity.dataFrom=="IMPORT"?"手工导入":row.entity.dataFrom)))}}</div>'
        },
        {
            field: "activeTime",
            displayName: '入库单生效时间',
            width: '15%'
        },
        {
            field: "endReceiveTime",
            displayName: '结束收货时间',
            width: '15%',
            enableCellEdit: true,
            enableCellEditOnFocus: true
        }, ,
        {
            field: "endShelveTime",
            displayName: '结束上架时间',
            width: '15%',
            enableCellEdit: true,
            enableCellEditOnFocus: true
        }, ,
        {
            field: "finishTime",
            displayName: '入库单完成时间',
            width: '15%',
            enableCellEdit: true,
            enableCellEditOnFocus: true
        },
        {
            field: "description",
            displayName: '描述',
            width: '10%',
            enableCellEdit: true,
            enableCellEditOnFocus: true
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

    //单据类型匹配
    $scope.matchBillType = function(billType){
        for(var i=0;i<vm.billLst.length;i++){
            if(vm.billLst[i].dataValue == billType){
                return vm.billLst[i].dataName;
            }
        }
        return billType;
    }

    /**
     * 单一明细收货操作
     */
    vm.singleRreceipt = function () {

        if(vm.entity.getSelectedRows().length == 0){
            msgAlert.info('请先选择要收货的入库单');
            return false;
        }else if(vm.entity.getSelectedRows().length > 1){
            msgAlert.info('每次只能选择一条入库单收货');
            return false;
        }else if(vm.entity.getSelectedRows()[0].status !='OPEN' && vm.entity.getSelectedRows()[0].status !='WORKING' ){
            msgAlert.info('已收货完成，无法再次收货');
            return false;
        }else{
            vm.billTypeName = $scope.matchBillType(vm.entity.getSelectedRows()[0].billType.id);
            window.location.href="#/wms/inbound/order/single?id="+vm.entity.getSelectedRows()[0].id+"&code="+vm.entity.getSelectedRows()[0].code+"&nickName="+vm.entity.getSelectedRows()[0].owner.nickName+"&billType="+vm.billTypeName;
        }
    }

    /**
     * 查看收货记录
     */
    vm.receiptRecords = function () {
        if (vm.entity.getSelectedRows().length == 0) {
            msgAlert.info('请先选择要查看收货记录的入库单');
            return false;
        }else if(vm.entity.getSelectedRows().length >1){
            msgAlert.info('只能选择一条入库单记录');
            return false;
        }
        window.location.href = "#/wms/inbound/receiptrecord?inboundCode="+vm.entity.getSelectedRows()[0].code+"&billType="+vm.entity.getSelectedRows()[0].billType.id;
    }
    vm.inputSerial =function () {
        if (vm.entity.getSelectedRows().length == 0) {
            msgAlert.info('请先选择要录入串码的入库单');
            return false;
        }else if(vm.entity.getSelectedRows().length >1){
            msgAlert.info('只能选择一条入库单录入串码');
            return false;
        }else if(vm.entity.getSelectedRows()[0].receiveStatus !='RECEIVED'){
            msgAlert.info('未完成收货不能进行录码操作');
            return false;
        }else if(vm.entity.getSelectedRows()[0].status !='WORKING'){
            msgAlert.info('未完成收货或者生效后不能进行录码操作');
            return false;
        }else if(vm.entity.getSelectedRows()[0].expectedSnQuantity == 0){
            msgAlert.info('期待唯一码数量为零，无需进行录码操作');
            return false;
        }else if((vm.entity.getSelectedRows()[0].expectedSnQuantity - vm.entity.getSelectedRows()[0].realSnQuantity)  == 0){
            msgAlert.info('唯一码数量已录完，无需再次进行录码操作');
            return false;
        }else
         {
            window.location.href="#/wms/inbound/order/inputsn?id="+vm.entity.getSelectedRows()[0].id;
        }
    }

    /*生效*/
    vm.operateEffect = function () {
        vm.selectListActive = [];
        if (vm.entity.getSelectedRows().length == 0) {
            msgAlert.info('请先选择要生效的入库单');
            return false;
        } else {
            var arr=[];
            for(var i = 0 ; i < vm.entity.getSelectedRows().length ; i++){
                if(vm.entity.getSelectedRows()[i].receiveStatus =='UN_RECEIVE'){
                    msgAlert.info('入库单未收货不能进行生效操作');
                    return false;
                }else if(vm.entity.getSelectedRows()[i].receiveStatus =='RECEIVING'){
                    arr.push(vm.entity.getSelectedRows()[i]);
                }else if(vm.entity.getSelectedRows().expectedSnQuantity != vm.entity.getSelectedRows().realSnQuantity){
                    msgAlert.info('请先完成唯一码录入,再进行生效操作');
                    return false;
                }
            }
            if (arr.length > 0){
                msgAlert.confirm('未完全收货，确定生效？','确定',change);
                return false;
            }
            change();
            function change() {
                for(var i = 0 ;i < vm.entity.getSelectedRows().length ; i++){
                    vm.selectListActive.push(vm.entity.getSelectedRows()[i].id);
                }
                BillManage.activeBatch(vm).success(function(data) {

                    if(data.additionalMsg.status=='成功'|| data.additionalMsg.status == '00'){

                        msgAlert.info('生效成功');
                        vm.getPage();
                        vm.entity.clearSelectedRows();

                    }else if(data.additionalMsg.status=='01'){

                        msgAlert.text('系统繁忙 >﹏< ['+ data.additionalMsg.message+']');
                        vm.entity.clearSelectedRows();

                    }
                });
            }
    }
    }

    /*失效*/
    vm.invalid = function () {
        vm.selectListActive = [];
        if (vm.entity.getSelectedRows().length == 0) {
            msgAlert.info('请先选择要失效的入库单');
            return false;
        }
        else{
            for(var i = 0 ; i < vm.entity.getSelectedRows().length ; i++){
                if(vm.entity.getSelectedRows()[i].status !='ACTIVE'){
                    msgAlert.info('未生效或已完成的入库单不可进行失效操作');
                    return false;

                }

            }

            for(var i = 0 ;i < vm.entity.getSelectedRows().length ; i++){
                vm.selectListActive.push(vm.entity.getSelectedRows()[i].id);
            }
            BillManage.batchInvalid(vm).success(function(data) {

                if(data.additionalMsg.status=='成功'|| data.additionalMsg.status == '00'){

                    msgAlert.info('失效成功');
                    vm.getPage();
                    vm.entity.clearSelectedRows();

                }else if(data.additionalMsg.status=='01'){

                    msgAlert.text('系统繁忙 >﹏< ['+ data.additionalMsg.message+']');
                    vm.entity.clearSelectedRows();

                }

            });
        }
    }

    vm.delete= function () {
        vm.selectListDelete = [];
        if (vm.entity.getSelectedRows().length == 0) {
            msgAlert.info('请先选择要删除的入库单');
            return false;
        }
        else{

            for(var i = 0 ;i < vm.entity.getSelectedRows().length ; i++){
                vm.selectListDelete.push(vm.entity.getSelectedRows()[i].id);
            }
            BillManage.batchDelete(vm).success(function(data) {

                if(data.additionalMsg.status=='成功'|| data.additionalMsg.status == '00'){

                    msgAlert.info('删除成功');
                    vm.getPage();
                    vm.entity.clearSelectedRows();

                }else if(data.additionalMsg.status=='01'){

                    msgAlert.text('系统繁忙 >﹏< ['+ data.additionalMsg.message+']');
                    vm.entity.clearSelectedRows();

                }

            });
        }
    }




    /**
     * 创建上架单
     * @returns {boolean}
     */
    vm.createShelveDoc = function(){
        if(vm.entity.getSelectedRows().length == 0){
            msgAlert.info('请先选择要创建上架单的入库单');
            return false;
        }else if(vm.entity.getSelectedRows().length > 1){
            msgAlert.info('只能选择一条入库单创建上架单');
            return false;
        } else if(vm.entity.getSelectedRows()[0].status!='ACTIVE'){
            msgAlert.info('未生效不能创建上架单');
            return false;
        } else{
            BillManage.createShelve(vm).success(function(data) {
                if(data.additionalMsg.status=='成功' || data.additionalMsg.status == '00'){
                    msgAlert.info('上架成功');
                    vm.getPage();
                    vm.entity.clearSelectedRows();
                }else if(data.additionalMsg.status=='01'){
                    msgAlert.text('系统繁忙 >﹏< ['+ data.additionalMsg.message+']');
                    vm.entity.clearSelectedRows();

                }

            });
        }
    }

    //一键入库
    vm.quickShelf = function () {
        if(vm.entity.getSelectedRows().length == 0){
            msgAlert.info('请先选择要入库的入库单');
            return false;
        }else if(vm.entity.getSelectedRows().length > 1){
            msgAlert.info('只能选择一条入库单入库');
            return false;
        }else if(vm.entity.getSelectedRows()[0].status!='ACTIVE'){
            msgAlert.info('非生效状态不能进行入库操作');
            return false;
        }else {
            $('#quickShelf_id').attr("disabled", true);
            vm.inboundId = vm.entity.getSelectedRows()[0].id;
            BillManage.quickShelf(vm).success(function(data) {
                if(data.additionalMsg.status == '00'){
                    msgAlert.info('上架成功');
                    vm.getPage();
                    vm.entity.clearSelectedRows();
                    $('#quickShelf_id').removeAttr("disabled");
                }else if(data.additionalMsg.status=='01'){
                    msgAlert.text('系统繁忙 >﹏< ['+ data.additionalMsg.message+']');
                    vm.entity.clearSelectedRows();
                    $('#quickShelf_id').removeAttr("disabled");
                }
            });
        }
    }

    //新建入库单
    vm.newInbound =function () {
        window.location.href = "#/wms/inbound/order/add";
    }

    //添加杂费用
    vm.addOperationFee =function () {
        if(vm.entity.getSelectedRows().length == 0){
            msgAlert.info('请先选择要入库的入库单');
            return false;
        }else if(vm.entity.getSelectedRows().length > 1){
            msgAlert.info('只能选择一条入库单入库');
            return false;
        }
        window.location.href = "#/wms/inbound/order/fee?id="+vm.entity.getSelectedRows()[0].id;
    }

    vm.importInbound =function () {
        window.location.href = "#/wms/inbound/order/import";
    }


    /**********************************************************获取单据类型*************************************************************/
    function initial() {
        vm.dictTypeName ='入库单据类型';
        BillManage.getBillTypeList(vm).success(function(data) {
            vm.billTypeList = data.rows;
            vm.billLst = data.rows;
        });
    }

    vm.getPageByFilter = function(){
        var code = $('input[name="code"]').val();
        var id_billType = $('#id_billType').val();
        if(id_billType == " "){
            id_billType ="";
        }
        var status = $('#id_status').val();
        if(status == " "){
            status ="";
        }
        var receiveStatus = $('#id_receiveStatus').val();
        if(receiveStatus == " "){
            receiveStatus ="";
        }
        var shelveStatus = $('#id_shelveStatus').val();
        if(shelveStatus == " "){
            shelveStatus ="";
        }
        var description = $('input[name="description"]').val();
        if(code == "" && id_billType == "" && status == "" && receiveStatus == "" && shelveStatus == "" && description == ""){
            msgAlert.info('搜索条件不能为空');
            return false;
        }
        vm.pageParams = {
            code:code,
            billType:id_billType,
            status:status,
            receiveStatus:receiveStatus,
            shelveStatus:shelveStatus,
            status:status,
            description:description,
            bean:'wmsInbound',
            method:'page',
            page:1,
            rows:10
        }
        vm.getPage();
    }


    vm.print = function () {

        if(vm.entity.getSelectedRows().length == 0){
            msgAlert.info('请先选择要入库的入库单');
            return false;
        }else if(vm.entity.getSelectedRows().length > 1){
            msgAlert.info('只能选择一条入库单入库');
            return false;
        }

        BillManage.printInbound(vm.entity.getSelectedRows()[0].id).success(function (data) {
            $scope.printList = data.resultMap.printList
            $scope.expectSum = 0;
            $scope.realSum = 0;
            $scope.printList.forEach(function (item) {
                $scope.expectSum += item.PRONUMBER
                $scope.realSum += item.REALNUMBER
            })
            setTimeout(function () {
                LODOP.PRINT_INIT("");
                LODOP.SET_PRINT_PAGESIZE(1, 0, 0, "A4");
                LODOP.ADD_PRINT_TEXT(20,254,400,70,"柴米云仓入库单");
                LODOP.SET_PRINT_STYLEA(0,"FontName","黑体");
                LODOP.SET_PRINT_STYLEA(0,"FontSize",23);
                LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
                LODOP.ADD_PRINT_BARCODE("4.05mm","145.84mm","50.59mm","18.84mm","128A",data.resultMap.code);
                LODOP.SET_PRINT_STYLEA(0,"ShowBarText",0);
                LODOP.ADD_PRINT_TEXT(97,27,350,28,"货主："+  data.resultMap.ownerName);
                LODOP.SET_PRINT_STYLEA(0,"FontSize",11);
                LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
                LODOP.ADD_PRINT_TEXT(125,27,400,28,"供应商：" + data.resultMap.supplier);
                LODOP.SET_PRINT_STYLEA(0,"FontSize",11);
                LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
                LODOP.ADD_PRINT_TEXT(97,370,370,28,"订单号："+ data.resultMap.code);
                LODOP.SET_PRINT_STYLEA(0,"FontSize",11);
                LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
                LODOP.ADD_PRINT_TEXT(125,370,370,28,"仓库："+  data.resultMap.warehouseName);
                LODOP.SET_PRINT_STYLEA(0,"FontSize",11);
                LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
                var tableStyle="<style>"+document.getElementById("printStyle").innerHTML+"</style>";
                tableInfo=tableStyle+document.getElementById("wmsInboundTable").innerHTML;
                LODOP.ADD_PRINT_TABLE(150,27,664,880,tableInfo);

                LODOP.SET_PRINT_MODE("CATCH_PRINT_STATU",true)
                LODOP.On_Return=function(TaskID,Value){
                    if(Value == 0){
                        alert('关闭预览')
                    }else{
                        alert('打印成功')
                    }
                    console.log(Value)
                };

                LODOP.PREVIEW();
                // LODOP.SET_PRINT_MODE("AUTO_CLOSE_PREWINDOW",true)
                // var TaskID1,TaskID2
                // var JOBID = LODOP.GET_VALUE("PRINT_STATUS_JOBID",1)
                // LODOP.On_Return_Remain=true;
                // TaskID1 = LODOP.GET_VALUE("PRINT_STATUS_OK",JOBID);
                // if (LODOP.CVERSION)CLODOP.On_Return=function(TaskID,Value){document.getElementById('S1').value=Value;};
                // document.getElementById('S1').value="打印预览返回结果："+LODOP.PREVIEW();
                // document.getElementById('id01').disabled = true;




            },500)

        })
    }
    
    

}])



