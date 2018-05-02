angular.module('MetronicApp').controller('manageCtrl', ['$rootScope', '$scope','$http','uiGridConstants', 'settings','User','commonUtil','Table', function($rootScope, $scope, $http, uiGridConstants,settings, User,commonUtil,Table) {

    $scope.$on('$viewContentLoaded', function() {
        App.initAjax(); // initialize core components
    });
    // set sidebar closed and body solid layout mode
    $rootScope.settings.layout.pageContentWhite = true;
    $rootScope.settings.layout.pageBodySolid = false;
    $rootScope.settings.layout.pageSidebarClosed = false;
    var vm = this;
    vm.initTime = "-";
    vm.time_switch =0;
    $scope.pageParams = {
        bean:'user',
        method:'pageGetUserList',
        userType:4,
        page:1,
        rows:10,
        ownerType:2
    }
    $scope.column = [
        {   field: "userId",
            displayName: '编号',
            enableCellEdit: true,
            enableCellEditOnFocus:true,
            width:100,
            cellTemplate: '<a ui-sref="supplier.look({Id:row.entity.userId})" style="display: block;margin: 5px;">{{row.entity.userId}}</a>'
            // cellTemplate: '<a ui-sref="supplier.look({Id:row.entity.userId})" style="display: block;margin: 5px;">{{row.entity.userId}}</a>'
       },
        {   field: "userName",
            displayName: '账号',
            visible: false,
            enableCellEdit: true,
            enableCellEditOnFocus:true,
            // cellTemplate: '<a ui-sref="supplier.look({Id:angular.toJson(row.entity)})" style="display: block;margin: 5px;">{{row.entity.userName}}</a>'
        },
        {   field: "ownerSubacctExt.company",
            displayName: '公司名称',
            enableCellEdit: true,
            width:250,
            enableCellEditOnFocus:true
        },
        {  field: "nickName",
            displayName: '简称',
            enableCellEdit: true,
            width:200,
            enableCellEditOnFocus:true
        }
        ,
        {  field: "ownerSubacctExt.ext9",
            displayName: '是否供货',
            enableCellEdit: true,
            enableCellEditOnFocus:true,
            width:100,
            cellTemplate:'<div style="padding:5px">{{row.entity.ownerSubacctExt.ext9==1?"是":(row.entity.ownerSubacctExt.ext9==0?"否":row.entity.ownerSubacctExt.ext9)}}</div>'

        }
        ,
        {  field: "ownerSubacctExt.ext10",
            displayName: '是否自采',
            enableCellEdit: true,
            enableCellEditOnFocus:true,
            width:100,
            cellTemplate:'<div style="padding:5px">{{row.entity.ownerSubacctExt.ext10==1?"是":(row.entity.ownerSubacctExt.ext10==0?"否":row.entity.ownerSubacctExt.ext10)}}</div>'

        }
        ,
        {  field: "ownerSubacctExt.ext11",
            displayName: '是否铺仓',
            enableCellEdit: true,
            enableCellEditOnFocus:true,
            width:100,
            cellTemplate:'<div style="padding:5px">{{row.entity.ownerSubacctExt.ext11==1?"是":(row.entity.ownerSubacctExt.ext11==0?"否":row.entity.ownerSubacctExt.ext11)}}</div>'
        }
        ,
        {  field: "ownerSubacctExt.ext12",
            displayName: '是否代发货',
            enableCellEdit: true,
            enableCellEditOnFocus:true,
            width:100,
            cellTemplate:'<div style="padding:5px">{{row.entity.ownerSubacctExt.ext12==1?"是":(row.entity.ownerSubacctExt.ext12==0?"否":row.entity.ownerSubacctExt.ext12)}}</div>'

        }
        ,
        {  field: "state",
            displayName: '状态',
            enableCellEdit: true,
            enableCellEditOnFocus:true,
            width:100,
            cellTemplate:'<div style="padding:5px">{{row.entity.state==0?"正常":(row.entity.state==1?"锁定":(row.entity.state==2?"注销":""))}}</div>'

        } ,
        {  field: "regDate",
            displayName: '添加时间',
            width:160,
            enableCellEdit: true,
            visible: false,
            enableCellEditOnFocus:true,
        } ,
        {  field: "ownerSubacctExt.addressDetail",
            displayName: '公司地址',
            enableCellEdit: true,
            width:240,
            visible: false,
            enableCellEditOnFocus:true,
            cellTemplate:'<div style="padding:5px">{{row.entity.ownerSubacctExt.province+row.entity.ownerSubacctExt.city+row.entity.ownerSubacctExt.area+row.entity.ownerSubacctExt.addressDetail}}</div>'
        }
        // ,
        // { name:'操作',
        //     width:100,
        //
        //     // cellTemplate:'<button class ="btn green"  ui-sref="supplier.look({Id:row.entity.userId})" >查看</button>'
        //     //  +'<button class ="btn warning" ng-click="grid.appScope.$parent.look.showAddImg(row.good_entity.img)" src="{{row.good_entity.img}}">编辑</button>' +
        //     // '<button class ="btn yellow" ui-sref="goods.supplier({Id:row.entity.spuId})">绑定供应商</button>'
        // }
    ]
    $scope.getPage = function () {
        commonUtil.getList($scope.pageParams).success(function(data) {
            $scope.data = data;
            vm.time_switch =1;
        });
    };
    $scope.getPage();
    vm.supplierFind = function () {
         var  seTime = $('.senderTime span').html();
        var qryRegBeginTime;
        var qryRegEndTime;
        if(seTime == undefined || seTime == "-"){
            qryRegBeginTime ="";
            qryRegEndTime ="";
        }else{
            qryRegBeginTime = $('.senderTime span').html().slice(0,10);
            qryRegEndTime = $('.senderTime span').html().slice(11,21);
        }

        $scope.pageParams = {
            bean:'user',
            method:'pageGetUserList',
            userType:4,
            page:1,
            rows:10,
            ownerType:2,
            company: $.trim($("#id_company").val()),
            nickName:$.trim( $("#id_nickName").val()),
            isSupply:  $.trim($("#id_isSupply").val()),
            isPurchase: $.trim( $("#id_isPurchase").val()),
            isPaveWare:$.trim( $("#id_isPaveWare").val()),
            isDeliver:$.trim( $("#id_isDeliver").val()),
            qryRegBeginTime:qryRegBeginTime,
            qryRegEndTime:qryRegEndTime,
            state: $("#id_state").val(),
        }
        $scope.getPage();
    }


     //修改供应商
    vm.updateSupplier = function () {
        if($scope.entity.getSelectedRows().length == 0){

            msgAlert.text('请先选择要查看的供应商');
            return false;

        }else if($scope.entity.getSelectedRows().length > 1){

            msgAlert.text('每次只能选择一条供应商信息');
            return;
        }else{

            vm.userid1 = $scope.entity.getSelectedRows()[0].userId;
            window.location.href = "#/supplier/update/"+  vm.userid1 ;
        }
    }
    //添加主账号
    vm.Identity = function () {
        if($scope.entity.getSelectedRows().length == 0){

            msgAlert.text('请先选择要查看的供应商');
            return false;

        }else if($scope.entity.getSelectedRows().length > 1){

            msgAlert.text('每次只能选择一条供应商信息');
            return;
        }else{
            vm.userid1 = $scope.entity.getSelectedRows()[0].userId;
            window.location.href = "#/supplier/identity/"+  vm.userid1 ;
        }
    }
    //管理供应商商品
    vm.supplierManage = function () {
        if($scope.entity.getSelectedRows().length == 0){
            msgAlert.text('请先选择要查看的供应商');
            return false;
        }else if($scope.entity.getSelectedRows().length > 1){
            msgAlert.text('每次只能选择一条供应商信息');
            return;
        }else{
            if($scope.entity.getSelectedRows()[0].ownerSubacctExt.ext9 ==1){
                vm.userid1 = $scope.entity.getSelectedRows()[0].userId;
                window.location.href = "#/supplier/addgood/"+  vm.userid1 ;
            }else {
                msgAlert.text('不供货，不能进入商品管理');
                return;
            }
        }
    }
    //地址库管理
    vm.AddrManage = function () {
        if($scope.entity.getSelectedRows().length == 0){

            msgAlert.text('请先选择要查看的供应商');
            return false;

        }else if($scope.entity.getSelectedRows().length > 1){

            msgAlert.text('每次只能选择一条供应商信息');
            return;
        }else{
            vm.userid1 = $scope.entity.getSelectedRows()[0].userId;
            window.location.href = "#/supplier/address/"+  vm.userid1;
        }

    }
    //设置发货区域
    vm.ShippSpace = function () {
        if($scope.entity.getSelectedRows().length == 0){
            msgAlert.text('请先选择要查看的供应商');
            return false;
        }else if($scope.entity.getSelectedRows().length > 1){
            msgAlert.text('每次只能选择一条供应商信息');
            return;
        }else{
            vm.userid1 = $scope.entity.getSelectedRows()[0].userId;
            window.location.href = "#/supplier/shiip/"+  vm.userid1 ;
        }
    }
    //添加联系人
    vm.AddContacts = function () {
        if($scope.entity.getSelectedRows().length == 0){
            msgAlert.text('请先选择要查看的供应商');
            return false;

        }else if($scope.entity.getSelectedRows().length > 1){

            msgAlert.text('每次只能选择一条供应商信息');
            return;
        }else{
            vm.userid1 = $scope.entity.getSelectedRows()[0].userId;
            window.location.href = "#/supplier/contacts/"+  vm.userid1 ;
        }
    }
}]);

