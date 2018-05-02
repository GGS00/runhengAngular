//新建运单
angular.module('MetronicApp').controller('ordervaletController', ['$rootScope', '$scope','$http','uiGridConstants', 'settings','order','commonUtil','citySelect', 'd2w', function($rootScope, $scope, $http, uiGridConstants,settings, order,commonUtil,citySelect,d2w) {

    $scope.$on('$viewContentLoaded', function() {
        App.initAjax(); // initialize core components
    });

    // set sidebar closed and body solid layout mode
    $rootScope.settings.layout.pageContentWhite = true;
    $rootScope.settings.layout.pageBodySolid = false;
    $rootScope.settings.layout.pageSidebarClosed = false;

    var vm = this;
    vm.invoicex = 3;
    vm.sendWarehouse = 1;
    vm.goodsList = [];

    vm.pageWarehouseParams = {
        bean:'d2WWareHouse',
        method:'page',
        page:1,
        rows:10,
        status:0
    }

    vm.column = [
        {   field: "id",
            displayName: '仓源编码',
            enableCellEdit: true,
            enableCellEditOnFocus:true
        },
        {  field: "warehouseName",
            displayName: '仓源名称',
            enableCellEdit: true,
            enableCellEditOnFocus:true
        },
        {  field: "provinceName",
            displayName: '仓库所在区域',
            enableCellEdit: true,
            width:400,
            enableCellEditOnFocus:true,
            cellTemplate:'<div style="padding:5px">{{row.entity.provinceName}}{{row.entity.cityName}}{{row.entity.districtName}}{{row.entity.address}}</div>'
        },
        {  field: "warehouseAreaType",
            displayName: '库区类型',
            enableCellEdit: true,
            width:120,
            enableCellEditOnFocus:true,
            cellTemplate:'<div style="padding:5px">{{row.entity.warehouseAreaType==01?"普通":(row.entity.warehouseAreaType==02?"冷藏":(row.entity.warehouseAreaType==03?"恆溫":(row.entity.warehouseAreaType==04?"特种":(row.entity.warehouseAreaType==05?"气调":""))))}}</div>'
        }
    ]

    initial();
    function initial(){

    }

    vm.getWarehouse = function () {
        commonUtil.getList(vm.pageWarehouseParams).success(function(data) {
            vm.data = data;
        });
    };

    vm.addWarehouse = function(){
        vm.getWarehouse();
        $('#selectWarehouse').modal('show');
    }

    vm.confirmWarehouse = function(){
        if(vm.entity.getSelectedRows().length == 0){

            msgAlert.text('请先选择仓源');
            return false;

        }else if(vm.entity.getSelectedRows().length > 1){

            msgAlert.text('只能选择一个仓源');
            return false;

        }else{
            vm.houseInfo = vm.entity.getSelectedRows()[0];
            vm.entity.clearSelectedRows();
            $('#selectWarehouse').modal('hide');

            if(vm.houseInfo.require.split('')[0]==1){
                vm.serviceRequest = 0;
                vm.unit=vm.houseInfo.unit;
                vm.price=vm.houseInfo.rentPrice;
            }else{
                vm.serviceRequest = 1;
                vm.unit=vm.houseInfo.keepUnit;
                vm.price=vm.houseInfo.keepPrice;
            }

            $('#houseInfo').show();
            $('#orderInfo').show();
        }
    }

    /*********** **************************************************获取ums货主信息************************************************************************************/
    vm.ownerColumn = [
        {
            field: 'entrust_id',
            displayName: '货主id',
            enableColumnMenu: false,// 是否显示列头部菜单按钮
            enableHiding: true,
            suppressRemoveSort: true,
            enableCellEdit: true, // 是否可编辑
        },
        {
            field: "nick_name",
            displayName: '货主名称',
            enableCellEdit: true,
            enableCellEditOnFocus: true
        }
    ]
    vm.placeholder_ownerName = '请选择货主';
    vm.icon_owner = 'plus';
    vm.ownerParams = {
        bean: 'umsCooper',
        method: 'page',
        page: 1,
        rows: 10,
        qryRole:1,
        qryType:'E'
    }
    vm.ownerPage = function () {
        $http({
            url: "/process"/*'../js/services/dashBoard.json'*/, method: "get",
            params: vm.ownerParams
        }).success(function (data) {
            vm.ownerData = data;
        })};
    vm.ownerPage();

    vm.submit = function() {
        if (vm.ownerEntity.getSelectedRows().length == 0) {
            msgAlert.info('请先选择货主信息');
            return false;
        }

        vm.userId = vm.ownerEntity.getSelectedRows()[0].entrust_id;

        if(vm.houseInfo == undefined)
        {
            msgAlert.info('请先选择仓库');
            return false;
        }

        if(vm.serviceRequest == 0)
        {

            vm.wareCum = $('input[name="wareCum"]').val();
            if(vm.wareCum==''){
                msgAlert.info('请填写库容');
                return false;
            }

            vm.wareBeginTime=$('.wareBeginTime span').html();
            var start=new Date(vm.wareBeginTime.replace("-", "/").replace("-", "/"));
            vm.wareEndTime=$('.wareEndTime span').html();
            var end=new Date(vm.wareEndTime.replace("-", "/").replace("-", "/"));
            if(end<start){
                msgAlert.info('结束时间不能小于开始时间');
                return false;
            }
            var startTime = new Date(Date.parse(start)).getTime();
            var endTime = new Date(Date.parse(end)).getTime();
            vm.remark = $('.wareRemarks').val();

            vm.wareParams = {
                orderType:0,
                customerId:vm.userId,
                dwWarehouseId:vm.houseInfo.id,
                unit:vm.unit,
                price:vm.price,
                count:vm.wareCum,
                startTime:vm.wareBeginTime,
                endTime:vm.wareEndTime,
                warehouseAreaType:vm.houseInfo.warehouseAreaType,
                provinceId:vm.houseInfo.provinceId,
                provinceName:vm.houseInfo.provinceName,
                cityId:vm.houseInfo.cityId,
                cityName:vm.houseInfo.cityName,
                districtId:vm.houseInfo.districtId,
                districtName:vm.houseInfo.districtName,
                address:vm.houseInfo.address,
                remark:vm.remark,
                goodsModels:[],
                chargingRule:vm.houseInfo.chargingRule,
                cycle:1
            }

            d2w.valet(vm.wareParams).success(function(data) {
                if(data.status==00){
                    msgAlert.success('成功')
                    window.location.href = "#/d2w/ordermanage"
                }else{
                    msgAlert.info(data.msg);
                }
            });
        }
        else
        {

            vm.goodsBeginTime=$('.goodsBeginTime span').html();
            var start=new Date(vm.goodsBeginTime.replace("-", "/").replace("-", "/"));
            vm.goodsEndTime=$('.goodsEndTime span').html();
            var end=new Date(vm.goodsEndTime.replace("-", "/").replace("-", "/"));
            if(end<start){
                msgAlert.info('结束时间不能小于开始时间');
                return false;
            }
            var startTime = new Date(Date.parse(start)).getTime();
            var endTime = new Date(Date.parse(end)).getTime();

            vm.remark = $('.goodsRemarks').val();

            vm.wareParams = {
                orderType:1,
                customerId:vm.userId,
                dwWarehouseId:vm.houseInfo.id,
                count:vm.wareCum,
                unit:vm.unit,
                price:vm.price,
                totalPrice:0,
                startTime:vm.goodsBeginTime,
                endTime:vm.goodsEndTime,
                warehouseAreaType:vm.houseInfo.warehouseAreaType,
                provinceId:vm.houseInfo.provinceId,
                provinceName:vm.houseInfo.provinceName,
                cityId:vm.houseInfo.cityId,
                cityName:vm.houseInfo.cityName,
                districtId:vm.houseInfo.districtId,
                districtName:vm.houseInfo.districtName,
                address:vm.houseInfo.address,
                remark:vm.remark,
                goodsModels:[],
                chargingRule:vm.houseInfo.chargingRule,
                cycle:1
            }

            d2w.valet(vm.wareParams).success(function(data) {
                if(data.status==00){
                    msgAlert.success('成功')
                    window.location.href = "#/d2w/ordermanage"
                }else{
                    msgAlert.info(data.msg);
                }
            });
        }
    }

}])



