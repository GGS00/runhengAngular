angular.module('MetronicApp').controller('warenewsetController', ['$rootScope','$scope','$http','$log','uiGridConstants','settings','order','commonUtil','System','citySelect','$location', function($rootScope,$scope,$http,$log,uiGridConstants,settings,order,commonUtil,System,citySelect,$location) {

    $scope.$on('$viewContentLoaded', function() {
        App.initAjax(); // initialize core components
    });
    $rootScope.settings.layout.pageContentWhite = true;
    $rootScope.settings.layout.pageBodySolid = false;
    $rootScope.settings.layout.pageSidebarClosed = false;
    var vm = this;
    vm.ruleId =  $location.search().ruleId;
    vm.endTimeState = true;
    vm.wareSortList = [1,2,3]
    initial()
    function initial(){

    }

    vm.changeSort = function(index,num){
         vm.wareSortList[index+1] = vm.wareSortList[index];
         vm.wareSortList[index] = num;
         console.log(vm.wareSortList)
    }

    vm.sortWareDown = function( index){
        var temp = vm.ruleSortList[index];
        vm.ruleSortList[index] = vm.ruleSortList[index+1];
        vm.ruleSortList[index+1] = temp;
       console.log(vm.ruleSortList)
    }


    vm.sortWareUp = function(index){
        var temp = vm.ruleSortList[index];
        vm.ruleSortList[index] = vm.ruleSortList[index-1];
        vm.ruleSortList[index-1] = temp;
        console.log(vm.ruleSortList)
    }

    vm.endTimeState = true;
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

    vm.searchByAddress = function(){
        vm.cityId=citySelect.getSelect().cityId;
        vm.districtId=citySelect.getSelect().areaId;
        vm.privinceId=citySelect.getSelect().proId;
        order.queryCoverAreaWarehouses(vm).success(function(data) {
            if(data.status==00){
                vm.ruleSortList = data.obj.rows;
            }else{
                msgAlert.text('查询失败 '+data.msg);
            }

        });
    }

    vm.towarerule = function(){
        window.location.href="#/order/setting/warerule"
    }


    vm.submit = function(){
            var ruleName = $('input[name="ruleName"]').val();
            if(ruleName ==''){
                msgAlert.text('请填写规则名称');
                return false;
            }

            if(vm.ruleSortList==undefined){
                msgAlert.text('请先查询仓库并排序优先级');
                return false;
            }
            if(vm.endTimeState==true){
                vm.effectForever=1;
            }else{
                vm.effectForever=0;
            }

            vm.receiverCityId=citySelect.getSelect().cityId;
            vm.receiverCityName=$('.provideAddress').find('.selectCity :selected').html();
            vm.receiverDistrictId=citySelect.getSelect().areaId;
            vm.receiverDistrictName=$('.provideAddress').find('.selectArea :selected').html();
            vm.receiverProvinceId=citySelect.getSelect().proId;
            vm.receiverProvinceName=$('.provideAddress').find('.selectPro :selected').html();


            vm.effectTime= $('.startTime span').html();
            vm.invalidTime=$('.endTime span').html();
            vm.newWarehousePriority=$('input[name="sortGood"]:checked').val();
            vm.ruleName=ruleName;

            vm.rulePriority='';
            vm.shipAbleCount='';
            vm.state = 1;
            vm.usedSpu=$('input[name="suitGood"]:checked').val();
            vm.wRuleId= '';
            vm.warehouseTypePriority=vm.wareSortList.join();

            vm.warehousePriorityList = [];
            for(var i = 0 ; i < vm.ruleSortList.length ; i ++){
                vm.warehousePriorityList.push({
                    warehouseType:1,
                    warehouseName:vm.ruleSortList[i].wareHouseName,
                    warehouseId:vm.ruleSortList[i].wareHouseId,
                    priority:i+1,
                })
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