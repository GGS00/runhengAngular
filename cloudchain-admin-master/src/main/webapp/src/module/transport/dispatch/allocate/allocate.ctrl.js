angular.module('MetronicApp').controller('dispatchController', ['$rootScope', '$scope','$http','uiGridConstants', 'settings','dispatch','commonUtil', function($rootScope, $scope, $http, uiGridConstants,settings, dispatch,commonUtil) {

    $scope.$on('$viewContentLoaded', function() {
        App.initAjax(); // initialize core components
    });

    // set sidebar closed and body solid layout mode
    $rootScope.settings.layout.pageContentWhite = true;
    $rootScope.settings.layout.pageBodySolid = false;
    $rootScope.settings.layout.pageSidebarClosed = false;

    var vm = this;
    vm.pageParams = {
        bean:'tmsDispatchBill',
        method:'page',
        sort: 'created_time',
        order: 'desc',
        page:1,
        rows:10
    }


    vm.column = [
        {   field: "status",
            displayName: '状态',
            enableCellEdit: true,
            enableCellEditOnFocus:true,
            width:'10%',
            cellTemplate:"<span class='label label-{{row.entity.status==\"OPEN\"?\"warning\":(row.entity.status==\"ACTIVE\"?\"danger\":(row.entity.status==\"CANCEL\"?\"default\":(row.entity.status==\"ARRIVED\"?\"danger\":(row.entity.status==\"ON_ROAD\"?\"info\":(row.entity.status==\"PART_ARRIVED\"?\"default\":\"\")))))}}' style='display:block;margin: 5px'>{{row.entity.status=='OPEN'?'打开':(row.entity.status=='ACTIVE'?'生效':(row.entity.status=='ON_ROAD'?'在途':(row.entity.status=='ARRIVED'?'已运抵':(row.entity.status=='CANCEL'?'取消':(row.entity.status=='PART_ARRIVED'?'部分签收':'')))))}}</span>"
        },
        {   field: "code",
            displayName: '调度单号',
            enableCellEdit: true,
            width:'15%',
            enableCellEditOnFocus:true
        },
        {  field: "createdTime",
            displayName: '建单时间',
            enableCellEdit: true,
            width:'25%',
            enableCellEditOnFocus:true
        },
        {  field: "planDepartureTime",
            displayName: '计划发车时间',
            enableCellEdit: true,
            width:'25%',
            enableCellEditOnFocus:true
        },
        {  field: "planArrivalTime",
            displayName: '计划到达时间',
            enableCellEdit: true,
            width:'25%',
            enableCellEditOnFocus:true
        }
    ]




    vm.getPage = function () {

        commonUtil.getList(vm.pageParams).success(function(data) {
            vm.data = data;
        });
    };
    vm.getPage();

    vm.getPageByFilter = function(){
        var code = $('input[name="code"]').val();
        if(code == ""){
            msgAlert.text('搜索条件不能为空');
            return false;
        }
        vm.pageParams = {
            bean:'tmsDispatchBill',
            method:'page',
            sort: 'created_time',
            order: 'desc',
            code: code,
            page:1,
            rows:10
        }
        vm.getPage();
    }


    vm.toCreateNewDispatch  = function(){
        window.location.href = "#/transport/dispatch/allocate/addstepone"
    }

    /*生效*/
    vm.operateEffect = function(){
        console.log(vm.entity.getSelectedRows())
        vm.selectListActive = [];
        if(vm.entity.getSelectedRows().length == 0){

            msgAlert.text('请先选择要生效的调度单');
            return false;

        }else{


            for(var i = 0 ; i < vm.entity.getSelectedRows().length ; i++){
                if(vm.entity.getSelectedRows()[i].status !='OPEN'){

                    msgAlert.text('请选择状态为打开的调度单进行生效操作');
                    return false;

                }

            }

            for(var i = 0 ;i < vm.entity.getSelectedRows().length ; i++){
                vm.selectListActive.push(vm.entity.getSelectedRows()[i].id);
            }
            console.log( vm.selectListActive.join())
            dispatch.activeBatch(vm).success(function(data) {

                if(data.additionalMsg.status==00){

                    msgAlert.text('生效成功');
                    vm.getPage();
                    vm.entity.clearSelectedRows();

                }else if(data.additionalMsg.status==01){

                    msgAlert.text('系统繁忙 >﹏< ['+ data.additionalMsg.message+']');
                    vm.entity.clearSelectedRows();

                }

            });



        }

    }

    /*失效*/
    vm.invalid = function(){
        console.log(vm.entity.getSelectedRows())
        vm.openBatchList = [];

        if(vm.entity.getSelectedRows().length == 0){

            msgAlert.text('请先选择要失效的调度单');
            return false;

        }else{

            for(var i = 0 ; i < vm.entity.getSelectedRows().length ; i++){
                if(vm.entity.getSelectedRows()[i].status !='ACTIVE'){

                    msgAlert.text('请选择状态为生效的调度单进行失效操作');
                    return false;

                }

            }

            for(var i = 0 ;i < vm.entity.getSelectedRows().length ; i++){
                vm.openBatchList.push(vm.entity.getSelectedRows()[i].id);
            }
            console.log( vm.openBatchList.join())
            dispatch.openBatch(vm).success(function(data) {

                if(data.additionalMsg.status==00){

                    msgAlert.text('失效成功');
                    vm.getPage();
                    vm.entity.clearSelectedRows();

                }else if(data.additionalMsg.status==01){

                    msgAlert.text('系统繁忙 >﹏< ['+ data.additionalMsg.message+']');
                    vm.entity.clearSelectedRows();

                }

            });



        }

    }

    //删除
    vm.delete = function(){
        console.log(vm.entity.getSelectedRows())
        vm.deleteList = [];

        if(vm.entity.getSelectedRows().length == 0){

            msgAlert.text('请先选择要删除的调度单');
            return false;

        }else{

            for(var i = 0 ; i < vm.entity.getSelectedRows().length ; i++){
                if(vm.entity.getSelectedRows()[i].status !='OPEN'){

                    msgAlert.text('请选择状态为打开的调度单进行失效操作');
                    return false;

                }

            }

            for(var i = 0 ;i < vm.entity.getSelectedRows().length ; i++){
                vm.deleteList.push(vm.entity.getSelectedRows()[i].id);
            }
            console.log( vm.deleteList.join())
            dispatch.deleteDispatch(vm).success(function(data) {

                if(data.additionalMsg.status==00){

                    msgAlert.text('删除成功');
                    vm.getPage();
                    vm.entity.clearSelectedRows();

                }else if(data.additionalMsg.status==01){

                    msgAlert.text('系统繁忙 >﹏< ['+ data.additionalMsg.message+']');
                    vm.entity.clearSelectedRows();

                }

            });



        }

    }

}])