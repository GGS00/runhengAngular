angular.module('MetronicApp').controller('userSupplierController', ['$rootScope', '$scope','$http','uiGridConstants', 'settings','User','commonUtil','Table', function($rootScope, $scope, $http, uiGridConstants,settings, User,commonUtil,Table) {

    $scope.$on('$viewContentLoaded', function() {
        App.initAjax(); // initialize core components
    });

    // set sidebar closed and body solid layout mode
    $rootScope.settings.layout.pageContentWhite = true;
    $rootScope.settings.layout.pageBodySolid = false;
    $rootScope.settings.layout.pageSidebarClosed = false;
    var vm = this;

    $scope.pageParams = {
        bean:'user',
        method:'pageGetUserList',
        userType:4,
        page:1,
        rows:10,
        ownerType:2
    }



    $scope.column = [
        {   field: "userName",
            displayName: '账号',
            enableCellEdit: true,
            enableCellEditOnFocus:true
        },
        {   field: "nickName",
            displayName: '供应商姓名',
            enableCellEdit: true,
            enableCellEditOnFocus:true
        },
        {  field: "ownerSubacctExt.ext3",
            displayName: '联系人',
            enableCellEdit: true,
            enableCellEditOnFocus:true
        },
        {  field: "ownerSubacctExt.ext4",
            displayName: '联系电话',
            enableCellEdit: true,
            enableCellEditOnFocus:true
        },
        {  field: "ownerSubacctExt.ext5",
            displayName: '邮箱',
            enableCellEdit: true,
            enableCellEditOnFocus:true
        }
    ]




    $scope.getPage = function () {
        commonUtil.getList($scope.pageParams).success(function(data) {
            $scope.data = data;
        });
    };
    $scope.getPage();

    $scope.editUser = function(){

        if($scope.entity.getSelectedRows().length == 0){
            msgAlert.text('请先选择要修改的供应商');
            return false;
        }else if($scope.entity.getSelectedRows().length > 1){
            msgAlert.text('每次只能修改一条供应商信息');

        }else{
            $scope.userId=$scope.entity.getSelectedRows()[0].userId;
            User.getUserInfo($scope.userId).success(function(data) {
                $scope.dataInfo = data.resultMap.user;
                $scope.extData = data.resultMap.user.ownerSubacctExt;
            });

            $('#modifyModal').modal('show');
        }
    }

    $scope.confirmModify =function(){
        if($('input[name="sex"]:checked').val() == undefined){
            $('input[name="sex"]:checked').val() == ""
        }
        $('#userSex').val($('input[name="sex"]:checked').val());

        vm.form = $("#editDriversInfo").serialize();
        vm.form = decodeURIComponent(vm.form,true)
        console.log(vm.form)
        $.ajax({
            url:"/user/updateOwnerSubacctExtInfo",
            data:vm.form,
            type:"post",
            dataType:"json",
            success:function(data){
                if(data.status == 00){
                    $('#modifyModal').modal('hide');
                    msgAlert.text('修改成功');
                    window.location.href="#/user/owner";

                }else{
                    msgAlert.text('系统繁忙 >﹏< ['+ data.msg+']');
                }
            },
            error:function(){
                msgAlert.text('系统繁忙 >﹏<');
            }
        })

    }

    vm.editAddress = function(){
        $.fn.modal.Constructor.prototype.enforceFocus = function () { }
        if($scope.entity.getSelectedRows().length == 0){

            msgAlert.text('请先选择要查看的供应商');
            return false;

        }else if($scope.entity.getSelectedRows().length > 1){

            msgAlert.text('每次只能选择一条供应商信息');

        }else{
            $('input[name="newContact"]').val('');
            $('input[name="newMobile"]').val('');
            $('input[name="newAddress"]').val('');
            vm.userId=$scope.entity.getSelectedRows()[0].userId;
            vm.ownerName = $scope.entity.getSelectedRows()[0].nickName;
            vm.ownerMobile = $scope.entity.getSelectedRows()[0].mobile;
            User.getAddressInfo(vm).success(function(data) {
                vm.addressData = data.data;
            });
            $('#smodifyModal').modal('show');
        }
    }

    vm.confirmAddAddress =function(){
        vm.province = $('.newAddAddress').find('.selectPro :selected').html();
        vm.city = $('.newAddAddress').find('.selectCity :selected').html();
        vm.county = $('.newAddAddress').find('.selectArea :selected').html();
        vm.cneeName = $('input[name="newContact"]').val();
        vm.newAddress = $('input[name="newAddress"]').val();
        vm.newMobile = $('input[name="newMobile"]').val();
        var mobilereg =/^((13[0-9])|(15[0-9])|(18[0-9])|(14[0-9])|(17[0-9]))\d{8}$/;
        if(vm.cneeName == ""){
            msgAlert.text('请填写联系人姓名');
            return false;
        }
        if(vm.newAddress == ""){
            msgAlert.text('请填写详细地址');
            return false;
        }
        if(vm.newMobile ==""){
            msgAlert.text('请填写联系方式');
            return false;
        }
        if(vm.newMobile.match(mobilereg) == null){
            msgAlert.text('请输入正确格式的手机号码');
            return false;
        }
        vm.xparams = {
            userId:vm.userId,
            cneeName:vm.cneeName,
            cneeMobile:vm.newMobile,
            province:vm.province,
            city:vm.city,
            county:vm.county,
            address:vm.newAddress,
            isDefault:1
        }
        User.addAddress(vm.xparams).success(function(data) {
            if(data.status == 00){
                msgAlert.text('添加成功');
                $('input[name="newAddress"]').val('');
                $('input[name="newMobile"]').val('');
                $('input[name="newContact"]').val('');
                User.getAddressInfo(vm).success(function(data) {
                    vm.addressData = data.data;
                });
            }else{
                msgAlert.text(data.msg);
                $('#smodifyModal').modal('hide');
            }
        });


    }


    vm.removeAddress= function(cId) {
        vm.selectListRemove = cId;
        $('#confirmDelete').modal('show');
    }

    vm.confirmDelete=function(){
        User.removeContacts(vm).success(function(data) {
            if(data.status==00){
                $('#confirmDelete').modal('hide');
                msgAlert.text('删除成功');
                User.getAddressInfo(vm).success(function(data) {
                    vm.addressData = data.data;
                });

            }else if(data.status==01){
                $('#confirmDelete').modal('hide');
                msgAlert.text('失败 >﹏< ['+ data.msg+']');

            }else{
                $('#confirmDelete').modal('hide');
                msgAlert.text('失败 >﹏< ['+ data.msg+']');
            }

        });
    }


}])
.controller('addSupplierController', ['$rootScope', '$scope','$http','uiGridConstants', 'settings','User','commonUtil','citySelect','multicitySelect', function($rootScope, $scope, $http, uiGridConstants,settings, User,commonUtil,citySelect,multicitySelect) {

        $scope.$on('$viewContentLoaded', function() {
            App.initAjax(); // initialize core components
        });

        // set sidebar closed and body solid layout mode
        $rootScope.settings.layout.pageContentWhite = true;
        $rootScope.settings.layout.pageBodySolid = false;
        $rootScope.settings.layout.pageSidebarClosed = false;
        var vm = this;
        $scope.provideForm = {};

        vm.roleSelect ='';
        vm.nameSelect ='';

        $(".select2me").select2();
        $(".select2").css('width','auto');
        initialRole();
        function initialRole(){
            $http({url:"/sys/roleauth/role",method: "get",
                params:{
                }
            }).success(function(data) {
                vm.roleList = data.rows;
            })
        }

        function initialName(id){
            vm.roleId = id;
            $http({url:"/process",method: "get",
                params:{
                    bean:'umsEmployee',
                    method:'pageGetEmployees',
                    roleId:vm.roleId,
                    page:1,
                    rows:10,
                }
            }).success(function(data) {
                vm.nameList = data.rows;
            })
        }

        vm.selectRoleChange = function(){
            initialName(vm.roleSelect)
        }

        vm.selectNameChange = function(){

        }

        vm.sendAddressList = [{id:''}];

        vm.addNewSend = function(){
            vm.sendAddressList.push({id:''});
        };

        vm.removeSend = function(index){
            vm.sendAddressList.splice(index,1);
        };


        $scope.submitUser = function(){
            console.log($scope.provideForm.ext5);
            $scope.provideForm.province = $('.provideAddress').find('.selectPro :selected').html();
            $scope.provideForm.city = $('.provideAddress').find('.selectCity :selected').html();
            $scope.provideForm.area = $('.provideAddress').find('.selectArea :selected').html();

            var namereg = /^(?![0-9]*$)[a-zA-Z0-9]{6,20}$/;
            var emailreg = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/;
            var mobilereg =/^((13[0-9])|(15[0-9])|(18[0-9])|(14[0-9])|(17[0-9]))\d{8}$/;

            if($scope.provideForm.ext1 == undefined){
                $scope.provideForm.ext1 = '';
            }
            if($scope.provideForm.ext5 == undefined){
                $scope.provideForm.ext5 = '';
            }
            if($scope.provideForm.userName == ""||$scope.provideForm.userName == undefined){
                msgAlert.text('请填写登入账号');
                return false;
            }
            if($scope.provideForm.nickName == ""||$scope.provideForm.nickName == undefined){
                msgAlert.text('请填写昵称');
                return false;
            }
            if($scope.provideForm.password ==undefined ||$scope.provideForm.password ==''){
                msgAlert.text('请填写登入密码');
                return false;
            }
            if($scope.provideForm.company == ""||$scope.provideForm.company == undefined){
                msgAlert.text('请填写公司');
                return false;
            }
            if($scope.provideForm.addressDetail == ""||$scope.provideForm.addressDetail ==undefined){
                msgAlert.text('请填写详细地址');
                return false;
            }

            if($scope.provideForm.ext3 ==""||$scope.provideForm.ext3 ==undefined){
                msgAlert.text('请填写联系人姓名');
                return false;
            }
            if($scope.provideForm.ext4 ==""||$scope.provideForm.ext4 ==undefined){
                msgAlert.text('请填写联系人电话');
                return false;
            }
            if($scope.provideForm.ext7 ==""||$scope.provideForm.ext7 ==undefined){
                msgAlert.text('请选择供应商等级');
                return false;
            }
            if($scope.provideForm.ext8 ==""||$scope.provideForm.ext8 ==undefined){
                msgAlert.text('请填写到货周期');
                return false;
            }

            if($scope.provideForm.userName.match(namereg) == null){
                msgAlert.text('登入账号必须为字母+数字/纯字母/大于6个字');
                return false;
            }
            if($scope.provideForm.mobile !="" && $scope.provideForm.mobile != undefined) {
                if ($scope.provideForm.mobile.match(mobilereg) == null) {
                    msgAlert.text('请输入正确格式的手机号码');
                    return false;
                }
            }

            if($scope.provideForm.ext5 !="" && $scope.provideForm.ext5 != undefined){
                if($scope.provideForm.ext5.match(emailreg) == null){
                    msgAlert.text('请输入正确格式的邮箱地址');
                    return false;
                }
            }


             if(vm.roleSelect==""&&vm.nameSelect!=""){
                    msgAlert.text('采购角色不能为空');
                    return false;
            }
            if(vm.roleSelect!=""&&vm.nameSelect==""){
                    msgAlert.text('采购专员姓名不能为空');
                    return false;
            }

            $scope.provideForm.ext2 = vm.nameSelect;
            var addressList= [];
            for (var i = 0; i < vm.sendAddressList.length; i++) {
                if($('.sendAddress_'+i).find('.selectCity :selected').val()!=''){
                    if($('.sendAddress_'+i).find('.selectArea :selected').val()!=''){
                        addressList.push($('.sendAddress_'+i).find('.selectArea :selected').val());
                    }else{
                        addressList.push($('.sendAddress_'+i).find('.selectCity :selected').val());
                    }
                }else{
                    addressList.push($('.sendAddress_'+i).find('.selectPro :selected').val().substr(7));
                }
            }

            $scope.provideForm.ext10 = addressList.join();

            bodyRSA();
            /* encodeURIComponent*/
            $scope.provideForm.password = encryptedString(key, encodeURIComponent($scope.provideForm.password));

            $scope.provideForm.regSource = 1;
            console.log($scope.provideForm)
            User.commitSupplier($scope.provideForm).success(function(data) {
                if(data.status == 00){
                    msgAlert.text('添加成功');
                    window.location.href="#/user/supplier";
                }else{
                    $scope.provideForm.password = {}
                    msgAlert.text('系统繁忙 >﹏< ['+ data.msg+']');
                    return false;
                }
            });

        }

        var key;

        function bodyRSA(){
            setMaxDigits(130);
            key = new RSAKeyPair("10001","","f5e769a799b21ffb5eb358006f110e3653eaf7ade25e764fb722c912fa049156ea851a4929428059cddbc269cd868bc089df30fb22bcb89b79c965f4fee81c516a147b777c5361d63d11e8504b0a416f8cf69f7e810ced126137911010fb72e15ba2d700fcb8663a64e6bffcece7c45d7414a795281420f508387b6017b56037");
        }
}])
