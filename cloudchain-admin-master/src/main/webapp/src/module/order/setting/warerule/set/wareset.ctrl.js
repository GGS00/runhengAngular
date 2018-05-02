angular.module('MetronicApp').controller('waresetController', ['$rootScope','$scope','$http','$log','uiGridConstants','settings','order','commonUtil','System','citySelect','$location', function($rootScope,$scope,$http,$log,uiGridConstants,settings,order,commonUtil,System,citySelect,$location) {

    $scope.$on('$viewContentLoaded', function() {
        App.initAjax(); // initialize core components
    });
    $rootScope.settings.layout.pageContentWhite = true;
    $rootScope.settings.layout.pageBodySolid = false;
    $rootScope.settings.layout.pageSidebarClosed = false;
    var vm = this;
    vm.editId =  $location.search().id;
    vm.ruleId =  $location.search().ruleId;
    initial()
    function initial(){
        order.queryWarehousePriorityRule(vm).success(function(data) {
            if(data.status==00){
                $('.startTime span').html(data.obj.effectTime);
                $('.endTime span').html(data.obj.invalidTime);
                if(data.obj.effectForever==1){
                    vm.endTimeState = true;
                }else{
                    vm.endTimeState = false;
                }
                vm.detailData = data.obj;
                vm.ruleSortList = data.obj.warehousePriorityList;
                vm.wareSortList = data.obj.warehouseTypePriority.split(',')
            }else{

            }

        });
    }

    vm.searchByAddress = function(){

        vm.cityId=citySelect.getSelect().cityId;
        vm.districtId=citySelect.getSelect().areaId;
        vm.privinceId=citySelect.getSelect().proId;
        order.queryCoverAreaWarehouses(vm).success(function(data) {
            if(data.status==00){
                vm.ruleSortListT = data.obj.rows;
            }else{
                msgAlert.text('查询失败 '+data.msg);
            }

        });
    }

    vm.sortWareSetDown = function( index){
        var temp = vm.ruleSortListT[index];
        vm.ruleSortListT[index] = vm.ruleSortListT[index+1];
        vm.ruleSortListT[index+1] = temp;
        console.log(vm.ruleSortListT)
    }


    vm.sortWareSetUp = function(index){
        var temp = vm.ruleSortListT[index];
        vm.ruleSortListT[index] = vm.ruleSortListT[index-1];
        vm.ruleSortListT[index-1] = temp;
        console.log(vm.ruleSortListT)
    }

    vm.changeSort = function(index,num){
         vm.wareSortList[index+1] = vm.wareSortList[index];
         vm.wareSortList[index] = num;
         console.log(vm.wareSortList)
    }

    vm.sortWareDown = function(changeId,priorityId,index){
        vm.handleList = [] ;
        vm.handleList.push({
          id:changeId, priority:priorityId+1
        });
        vm.handleList.push({
            id:vm.ruleSortList[index+1].id, priority:vm.ruleSortList[index+1].priority-1
        });

        order.moveWarehousePriority(vm).success(function(data) {
            if(data.status==00){
                order.queryWarehousePriorityRule(vm).success(function(data) {
                    if(data.status==00){
                        vm.ruleSortList = data.obj.warehousePriorityList;
                    }
                });
            }else{
                msgAlert.text('下移失败'+data.msg);
            }

        });
    }


    vm.sortWareUp = function(changeId,priorityId,index){
        vm.handleList = [] ;
        vm.handleList.push({
            id:changeId, priority:priorityId-1
        });
        vm.handleList.push({
            id:vm.ruleSortList[index-1].id, priority:vm.ruleSortList[index-1].priority+1
        });
        console.log(JSON.stringify(vm.handleList))
        order.moveWarehousePriority(vm).success(function(data) {
            if(data.status==00){
                order.queryWarehousePriorityRule(vm).success(function(data) {
                    if(data.status==00){
                        vm.ruleSortList = data.obj.warehousePriorityList;
                    }
                });
            }else{
                msgAlert.text('上移失败'+data.msg);
            }

        });

    }


    vm.suitGood = 0;
    vm.pageParams = {
        bean:'goods',
        method:'pageSku',
        page:1,
        rows:10
    }

    vm.column = [
        {   field: "skuId",
            displayName: '商品编码',
            enableCellEdit: true,
            enableCellEditOnFocus:true
        },
        {  field: "title",
            displayName: '商品名称',
            enableCellEdit: true,
            enableCellEditOnFocus:true
        }
    ]

    vm.getPage = function () {
        commonUtil.getList(vm.pageParams).success(function(data) {
            vm.data = data;
        });
    };


    vm.goodsModalShow = function(){
        vm.getPage();
        $('#selectGoods').modal('show');
    }

    vm.addGoods = function(){

        if(vm.entity.getSelectedRows().length == 0){

            msgAlert.text('请先选择商品');
            return false;

        }else{
            for(var i = 0 ; i < vm.entity.getSelectedRows().length ; i++){
                vm.goodsList.push({
                    skuId:vm.entity.getSelectedRows()[i].skuId,
                    spuId:vm.entity.getSelectedRows()[i].spuId,
                    skuTitle:vm.entity.getSelectedRows()[i].title,
                    count:'1',
                    price:vm.entity.getSelectedRows()[i].price,
                    subTotal:''
                });
            }
            vm.entity.clearSelectedRows();
            $('#selectGoods').modal('hide');

        }

    }

    vm.addressSwitch = 0 ;

    vm.towarerule = function(){
        window.location.href="#/order/setting/warerule"
    }

    vm.editAddress = function(){
        vm.addressSwitch = 1 ;
    }

    vm.editBackAddress = function(){
        vm.addressSwitch = 0;
    }

    vm.submit = function(){
            var ruleName = $('input[name="ruleName"]').val();
            if(ruleName ==''){
                msgAlert.text('请填写规则名称');
                return false;
            }
            if(vm.endTimeState==true){
                vm.effectForever=1;
            }else{
                vm.effectForever=0;
            }
            if(vm.addressSwitch==1){
                vm.receiverCityId=citySelect.getSelect().cityId;
                vm.receiverCityName=$('.provideAddress').find('.selectCity :selected').html();
                vm.receiverDistrictId=citySelect.getSelect().areaId;
                vm.receiverDistrictName=$('.provideAddress').find('.selectArea :selected').html();
                vm.receiverProvinceId=citySelect.getSelect().proId;
                vm.receiverProvinceName=$('.provideAddress').find('.selectPro :selected').html();
            }else{
                vm.receiverCityId=vm.detailData.receiverCityId;
                vm.receiverCityName=vm.detailData.receiverCityName;
                vm.receiverDistrictId=vm.detailData.receiverDistrictId;
                vm.receiverDistrictName=vm.detailData.receiverDistrictName;
                vm.receiverProvinceId=vm.detailData.receiverProvinceId;
                vm.receiverProvinceName=vm.detailData.receiverProvinceName;
            }

            vm.effectTime= $('.startTime span').html();
            vm.invalidTime=$('.endTime span').html();
            vm.newWarehousePriority=$('input[name="sortGood"]:checked').val();
            vm.ruleName=ruleName;
            vm.rulePriority='';
            vm.shipAbleCount='';
            vm.state = vm.detailData.state;
            vm.usedSpu=$('input[name="suitGood"]:checked').val();
            vm.wRuleId= vm.detailData.wRuleId;
            vm.warehouseTypePriority=vm.wareSortList.join();
            vm.warehousePriorityList = '';

            if(vm.addressSwitch ==1 ){
                vm.warehousePriorityList = [];
                console.log(vm.ruleSortListT)
                for(var i = 0 ; i < vm.ruleSortListT.length ; i ++){
                    vm.warehousePriorityList.push({
                        warehouseType:1,
                        warehouseName:vm.ruleSortListT[i].wareHouseName,
                        warehouseId:vm.ruleSortListT[i].wareHouseId,
                        priority:i+1,
                    })
                }
            }else if(vm.addressSwitch ==0){
                vm.warehousePriorityList = vm.ruleSortList;
            }

            order.saveWarehousePriorityRule(vm).success(function(data) {
                if(data.status==00){
                    msgAlert.text('保存成功');
                }else{
                    msgAlert.text('保存失败'+data.msg);
                }

            });
    }


}])