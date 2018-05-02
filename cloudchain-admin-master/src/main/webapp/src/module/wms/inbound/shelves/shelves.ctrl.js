/**
 * 上架控制器
 */
angular.module('MetronicApp').controller('ShelfControl', ['$rootScope', '$scope','$http','uiGridConstants', 'settings','BillManage','commonUtil','Table', function($rootScope, $scope,$http,uiGridConstants, settings, BillManage,commonUtil,Table) {
    $scope.$on('$viewContentLoaded', function() {
        App.initAjax(); // initialize core components
    });
    $rootScope.settings.layout.pageContentWhite = true;
    $rootScope.settings.layout.pageBodySolid = false;
    $rootScope.settings.layout.pageSidebarClosed = false;
    var vm = this;
    //定义单据数组
    vm.billLst = [];
    initiBill();

    vm.menuLen = 4;
    vm.pageParams = {
        bean:'wmsShelvedoc',
        method:'page',
        page:1,
        rows:10
    }
    vm.column = [ {  field: "id",
        displayName: 'id',
        width:'5%',
        visible:false,
        enableColumnMenu: false,// 是否显示列头部菜单按钮
    },
        { field: 'owner.id',
            displayName: '货主id',
            width: '10%',
            visible:false,
        },
        {  field: "warehouse.id",
            displayName: '仓库id',
            width: '10%',
            visible:false,
        },
        {  field: "code",
            displayName: '上架单号',
            suppressRemoveSort: true,
            enableColumnMenu: false,// 是否显示列头部菜单按钮
            width: '25%',
            enableCellEdit: true,
            enableCellEditOnFocus:true,
        },
        {  field: "owner.name",
            displayName: '货主',
            width: '10%'

        },
        {  field: "billType.id",
            displayName: '单据类型',
            width: '10%',
            cellTemplate:'<div style="padding:5px">{{grid.appScope.$parent.matchBillType(row.entity.billType.id)}}</div>'

        },
        {  field: "createdTime",
            displayName: '上架单创建时间',
            width: '15%'

        },
        {  field: "status",
            displayName: '状态',
            width: '10%',
            cellTemplate:'<div style="padding:5px">{{row.entity.status=="OPEN"?"打开":(row.entity.status=="ACTIVE"?"生效":(row.entity.status=="ALLOCATED"?"分配完成":(row.entity.status=="PART_ALLOCATED"?"部分分配":(row.entity.status=="WORKING"?"工作中":(row.entity.status=="FINISHED"?"完成":(row.entity.status=="INVALID"?"失效":row.entity.status))))))}}</div>'
        },
        {  field: "expectedQuantityBU",
            displayName: '计划上架数量',
            width: '10%'
        },
        {  field: "allocatedQuantityBU",
            displayName: '分配数量',
            width: '10%'
        },
        {  field: "movedQuantityBU",
            displayName: '实际上架数量',
            width: '10%'
        },
        {  field: "originalBillCode",
            displayName: '入库单号',
            width: '20%'
        },
        {  field: "extendProp4",
            displayName: '责任人',
            width: '10%'
        },
        {  field: "lastOperator",
            displayName: '最后修改人员',
            width: '10%'
        },
        {  field: "lastOperatedTime",
            displayName: '最后修改时间',
            width: '15%'
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

   //手动分配
    vm.allot =function () {
        if(vm.entity.getSelectedRows().length == 0){
            msgAlert.info('请先选择一条上架单进行手工分配');
            return false;
        }else if(vm.entity.getSelectedRows().length > 1) {
            msgAlert.info('只能选择一条上架单进行手工分配');
        }else {
            window.location.href = "#/wms/inbound/shelves/allot?id="+vm.entity.getSelectedRows()[0].id;
        }
    }
    /*生效*/
    vm.operateEffect = function(){
        if(vm.entity.getSelectedRows().length == 0){
            msgAlert.info('请先选择要生效的上架单');
            return false;
        }else if(vm.entity.getSelectedRows().length > 1) {
            msgAlert.info('只能选择一条上架单生效');
            return false;
        }else if(!vm.entity.getSelectedRows()[0].status == "ALLOCATED"){
            msgAlert.info('未完成上架分配不能生效');
        }else{
            BillManage.activeShelve(vm).success(function(data) {

                if(data.additionalMsg.status=='成功' || data.additionalMsg.status == '00'){

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
    /*失效*/
    vm.invalid = function(){
        if(vm.entity.getSelectedRows().length == 0){
            msgAlert.info('请先选择要失效的运单');
            return false;
        }else if(vm.entity.getSelectedRows().length > 1) {
            msgAlert.info('只能选择一条上架单失效');
            return false;
        }else if(!vm.entity.getSelectedRows()[0].status == "ACTIVE"){
            msgAlert.info('未生效的上架单不能失效');
        }else{
            BillManage.disableShelve(vm).success(function(data) {

                if(data.additionalMsg.status=='成功' || data.additionalMsg.status == '00'){

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

    /*人员分配*/
    vm.allotEmploy = function(){
        if(vm.entity.getSelectedRows().length == 0){
            msgAlert.info('请选择一条要分配的上架单');
            return false;
        }else if(vm.entity.getSelectedRows().length > 1){
            msgAlert.info('只能选择一条上架单分配');
            return false;
        }else if(vm.entity.getSelectedRows()[0].status != "OPEN"){
           msgAlert.info('上架单非打开状态,不能进行分配');
            return false;
        }else{
            $('#allotEmployModel').modal('show');
            $('#shelveDocId').val(vm.entity.getSelectedRows()[0].id);
            $('#shelveDocCode').val(vm.entity.getSelectedRows()[0].code);

        }
    }

    vm.getPageByFilter = function(){
        var code = $('input[name="code"]').val();
        var original_bill_code = $('input[name="original_bill_code"]').val();
        var status = $('.status').val();
        if(status == " "){
            status ="";
        }
        vm.pageParams = {
            code:code,
            original_bill_code:original_bill_code,
            status:status,
            bean:'wmsShelvedoc',
            method:'page',
            page:1,
            rows:10
        }
        vm.getPage();
    }

    /*********** **************************************************获取员工信息************************************************************************************/
    vm.employColumn = [
        {
            field: 'empId',
            displayName: '员工ID',
            enableColumnMenu: false,// 是否显示列头部菜单按钮
            enableHiding: true,
            suppressRemoveSort: true,
            enableCellEdit: true, // 是否可编辑
        },
        {
            field: "realName",
            displayName: '员工名称',
            enableCellEdit: true,
            enableCellEditOnFocus: true
        }
    ]
    vm.placeholder_employName = '请输入员工';
    vm.icon_employ = 'plus';
    vm.employParams = {
        bean: 'umsEmployee',
        method: 'pageGetEmployees',
        page: 1,
        rows: 10
    }
    vm.employPage = function () {
        commonUtil.getList(vm.employParams).success(function (data) {
            if (data.additionalMsg.status == '00') {
                vm.employData = data;
            } else {
                msgAlert.text('系统繁忙 >﹏< [' + data.additionalMsg.message + ']');
            }
        });
    };
    vm.employPage();

    /*********** ********************************************提交人员分配信息********************************************************************************/
    vm.allotEmploySubmit = function(){
        if(vm.employEntity.getSelectedRows().length == 0){
            msgAlert.info('请输入员工信息');
            return false;
        }
        $.ajax({
            url:'/shelveDoc/shelveDocAllotEmply/'+$('#shelveDocId').val(),
            data:{taskExector:vm.employEntity.getSelectedRows()[0].empId,taskExeNmae:vm.employEntity.getSelectedRows()[0].realName},
            type:'post',
            datatype:'json',
            success:function(data){
                var bToObj=JSON.parse(data);  //返回内容转成json
                if(bToObj.additionalMsg.status == '00'){
                    $('#allotEmployModel').modal('hide');
                    msgAlert.info('人员分配成功');
                    vm.getPage();
                }else {
                    msgAlert.info(bToObj.additionalMsg.message);
                }
            },
            error:function(data){

            }
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
    function initiBill() {
        vm.dictTypeName ='入库单据类型';
        BillManage.getBillTypeList(vm).success(function(data) {
            vm.billTypeList = data.rows;
            vm.billLst = data.rows;
        });
    }

}])


