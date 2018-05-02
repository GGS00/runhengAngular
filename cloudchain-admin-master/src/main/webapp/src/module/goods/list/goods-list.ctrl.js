/* Setup blank page controller */
angular.module('MetronicApp').controller('GoodsListController', function($rootScope, $scope,$state, settings,commonUtil,Goods,$mdSidenav,$log) {
    $scope.$on('$viewContentLoaded', function() {
        // initialize core components
        App.initAjax();

        // set default layout mode
        $rootScope.settings.layout.pageContentWhite = true;
        $rootScope.settings.layout.pageBodySolid = false;
        $rootScope.settings.layout.pageSidebarClosed = false;
    });

    var vm = this
    $scope.checkbox=0;
    $scope.checkbox1= 0;
    $scope.checkbox2= 0;
    $scope.checkbox3= 0;
    $scope.toggleRight = buildToggler('right');
    $scope.isOpenRight = function(){
        return $mdSidenav('right').isOpen();
    };

    function buildToggler(navID) {
        return function() {
            $mdSidenav(navID)
                .toggle()
                .then(function () {
                    $log.debug("toggle " + navID + " is done");
                });
        };
    }

    $scope.close = function () {
        $mdSidenav('right').close()
            .then(function () {
                vm.getPageByFilter();
            });

    };

    $scope.clear = function () {
        vm.spuId = ""
        vm.spuName = ""
        vm.cId1 = ""
        vm.cId2 = ""
        vm.cId3 = ""
        vm.cList1 = null
        vm.cList2 = null
        vm.cList3 = null
        vm.bId = ""
        vm.cId = ""
        commonUtil.getList(vm.brand).success(function(data) {
            vm.brandList = data.rows;
        });
        Goods.getCate(0).success(function (data) {
            vm.cList1 = data.data
        })
    }

    vm.params ={
        bean:'goods',
        method:'page',
        page:1,
        rows:10
    }

    vm.column = [
        {  field: "spuId",
            displayName: '商品编码',
            enableCellEdit: true,
            enableCellEditOnFocus:true,
            width:250,
        },
        { field: 'spuName',
            displayName: '商品名称',
            enableCellEdit: true,
            enableCellEditOnFocus:false,
            width:250,
        },
        {  field: "cName",
            displayName: '商品分类',
            enableCellEdit: true,
            enableCellEditOnFocus:true,
            width:150,
        },
        {  field: "bName",
            displayName: '品牌',
            enableCellEdit: true,
            enableCellEditOnFocus:true,
            width:150,
        },

        {  field: "invNum",
            displayName: '销售库存',
            enableCellEdit: true,
            enableCellEditOnFocus:true,
            width:150,
        },
        { name:'销售渠道',
            width:150,
            cellTemplate:"<div class=\"ui-grid-cell-contents\" ng-init=\"cList = ['批发','零售','门店','联盟']\"><span ng-if=\"row.entity.channel != '0000'\" ng-repeat=\"list in row.entity.channel.split('') track by $index\">{{list == 1?cList[$index]+'/':''}}</span><span ng-if=\"row.entity.channel == '0000'\">未设置销售渠道</span></div>"
        },
        // {  field: "price",
        //     displayName: '库存',
        //     enableCellEdit: true,
        //     enableCellEditOnFocus:true
        // },
        // {  field: "price",
        //     displayName: '销售渠道',
        //     enableCellEdit: true,
        //     enableCellEditOnFocus:true
        // },
        { name:'供应商',
            width:150,
            cellTemplate:"<div class='ui-grid-cell-contents'><a ui-sref='goods.supplier({Id:row.entity.spuId})'>设置</a></div>"
        },
        { name:'操作',
            width:250,
            cellTemplate:"<div class='ui-grid-cell-contents'><a ui-sref='goods.stock({Id:row.entity.spuId})'>查看库存</a>&nbsp;" +
            "<a style='color: red' ng-click='grid.appScope.$parent.list.del(row.entity.spuId)'>删除</a></div>"
                        // '<button class ="btn warning" ui-sref="goods.edit({Id:row.entity.spuId})">修改信息</button>'
        }
    ];

    vm.getList = function() {
        commonUtil.getList(vm.params).success(function (data) {
            vm.data = data
        })
    }
    vm.getList()

    vm.getPageByFilter = function(){
        vm.params = {
            bId:vm.bId,
            cId:vm.cId,
            spuId:vm.spuId,
            spuName:vm.spuName,
            bean:'goods',
            method:'page',
            page:1,
            rows:10
        }
        vm.getList();
    }
    
    Goods.getCate(0).success(function (data) {
        vm.cList1 = data.data
    })


    vm.oneChange = function(){
        if(vm.cId1 != " ") {
            Goods.getCate(vm.cId1).success(function (data) {
                vm.cList2 = data.data
            })
        }else{
            vm.cList2 = null
            vm.cList3 = null
        }
        vm.cId = vm.cId1
    }

    vm.twoChange = function(){
        if(vm.cId2 != " "){
            Goods.getCate(vm.cId2).success(function (data) {
                vm.cList3 = data.data
            })
        }else{
            vm.cList3 = null
        }
        vm.cId = vm.cId2
    }

    vm.threeChange = function () {
            vm.cId = vm.cId3
    }


    vm.brand = {
        bean:'brand',
        method:'page',
        page:1,
        rows:10
    }

    commonUtil.getList(vm.brand).success(function(data) {
        vm.brandList = data.rows;
    });


    vm.updateInfo = function () {
        if(vm.entity.getSelectedRows().length == 0){
            msgAlert.text('请先选择要修改基本信息的商品');
            return false;
        }else if(vm.entity.getSelectedRows().length > 1){
            msgAlert.text('每次只能修改一条商品的基本信息');
        }else{
            var id = vm.entity.getSelectedRows()[0].spuId;
            $state.go('goods.edit1', {Id: id});
        }
    }

    vm.updateSpec = function () {
        if(vm.entity.getSelectedRows().length == 0){
            msgAlert.text('请先选择要修改销售信息的商品');
            return false;
        }else if(vm.entity.getSelectedRows().length > 1){
            msgAlert.text('每次只能修改一条商品的销售信息');
        }else{
            var id = vm.entity.getSelectedRows()[0].spuId;
            $state.go('goods.edit2', {Id: id});
        }
    }

    vm.updateProp = function () {
        if(vm.entity.getSelectedRows().length == 0){
            msgAlert.text('请先选择要修改属性信息的商品');
            return false;
        }else if(vm.entity.getSelectedRows().length > 1){
            msgAlert.text('每次只能修改一条商品的属性信息');
        }else{
            var id = vm.entity.getSelectedRows()[0].spuId;
            $state.go('goods.edit4', {Id: id});
        }
    }


    vm.updateHtml = function () {
        if(vm.entity.getSelectedRows().length == 0){
            msgAlert.text('请先选择要修改描述的商品');
            return false;
        }else if(vm.entity.getSelectedRows().length > 1){
            msgAlert.text('每次只能修改一条商品描述');
        }else{
            var id = vm.entity.getSelectedRows()[0].spuId;
            $state.go('goods.edit3', {Id: id},{ reload: true });
        }
    }

    vm.sale = function () {
        if(vm.entity.getSelectedRows().length == 0){
            msgAlert.text('请先选择要修改销售库存的商品');
            return false;
        }else if(vm.entity.getSelectedRows().length > 1){
            msgAlert.text('每次只能修改一个商品的销售库存');
            return false;
        }else if(vm.entity.getSelectedRows()[0].isRelate ==1){
            msgAlert.text('商品已绑定仓库库存，不可修改');
            return false;
        }else{
            var id = vm.entity.getSelectedRows()[0].spuId;
            $state.go('goods.sale', {Id: id});
        }
    }
    
    vm.stock = function () {
        if(vm.entity.getSelectedRows().length == 0){
            msgAlert.text('请先选择要查看库存的商品');
            return false;
        }else if(vm.entity.getSelectedRows().length > 1){
            msgAlert.text('每次只能查看一个商品的库存');
        }else{
            var id = vm.entity.getSelectedRows()[0].spuId;
            $state.go('goods.stock', {Id: id},{ reload: true });
        }
    }

    vm.supplier = function () {
        if(vm.entity.getSelectedRows().length == 0){
            msgAlert.text('请先选择要绑定供应商的商品');
            return false;
        }else if(vm.entity.getSelectedRows().length > 1){
            msgAlert.text('每次只能修改一个商品的绑定供应商');
        }else{
            var id = vm.entity.getSelectedRows()[0].spuId;
            $state.go('goods.supplier', {Id: id},{ reload: true });
        }
    }

    vm.channelEdit = function () {
        if(vm.entity.getSelectedRows().length == 0){
            msgAlert.text('请先选择商品');
            return false;
        }
        $("#channelEdit").modal('show')
    }

    vm.saveChannel = function () {
        $scope.channel = ""+ $scope.checkbox +""+ $scope.checkbox1 +""+ $scope.checkbox2 +""+ $scope.checkbox3 +""
        var id = []
        for(var a in vm.entity.getSelectedRows()){
            id.push(vm.entity.getSelectedRows()[a].spuId)
        }
        Goods.updateChannel(id,$scope.channel).success(function(data) {
                if(data.status == "00"){
                    vm.getList()
                }else{
                    msgAlert.text(data.msg);
                }
        });
    }


    vm.getUserFunc = function (type,name,num) {
        if(type == 1){
            Goods.getUserFunc(name).success(function (data) {
                if(data.obj == null||data.obj.funcValue == 0){
                    msgAlert.text(data.msg);
                    switch(num)
                    {
                        case 0:
                            $scope.checkbox = 0
                            break;
                        case 1:
                            $scope.checkbox1 = 0
                            break;
                        case 2:
                            $scope.checkbox2 = 0
                            break;
                        case 3:
                            $scope.checkbox3 = 0
                            break;
                    }
                }
            })
        }

    }


    vm.del = function (id) {
        vm.delGoods(id)
    }

    vm.delGoods = function (i) {
        Goods.delGoods(i).success(function (data) {
            if(data.status == "00"){
                msgAlert.text('删除成功');
                vm.getList();
                vm.entity.clearSelectedRows();
            }else{
                msgAlert.text('系统繁忙 >﹏< ['+ data.msg+']');
                vm.entity.clearSelectedRows();

            }
        })
    }

    vm.deleteBrand = function(){

        vm.deleteList = [];

        if(vm.entity.getSelectedRows().length == 0){

            msgAlert.text('请先选择要删除的商品');
            return false;

        }else{

            for(var i = 0 ;i < vm.entity.getSelectedRows().length ; i++){
                vm.deleteList.push(vm.entity.getSelectedRows()[i].spuId);
            }

            vm.delGoods(vm.deleteList)
        }

    }


}).controller('RightCtrl', function ($scope, $timeout, $mdSidenav, $log) {


});
/**
 * Created by sq on 2017/3/17.
 */
