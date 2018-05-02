/**
 * Created by shaobinhua on 2017/3/16.
 */
/**
 * Created by shaobinhua on 2017/3/13.
 */
angular.module('MetronicApp').controller('userPartnerController', ['$rootScope', '$scope','$http','uiGridConstants', 'settings','User','commonUtil','Table', function($rootScope, $scope, $http, uiGridConstants,settings, User,commonUtil,Table) {

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
        userType:5,
        page:1,
        rows:10
    }



    $scope.column = [
        {   field: "userName",
            displayName: '账号',
            enableCellEdit: true,
            enableCellEditOnFocus:true
        },
        {   field: "nickName",
            displayName: '伙伴姓名',
            enableCellEdit: true,
            enableCellEditOnFocus:true
        },
        {  field: "mobile",
            displayName: '联系电话',
            enableCellEdit: true,
            enableCellEditOnFocus:true
        },
        {  field: "email",
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

            msgAlert.text('请先选择要修改的伙伴');
            return false;
        }else if($scope.entity.getSelectedRows().length > 1){
            msgAlert.text('每次只能修改一条伙伴信息');

        }else{
            $scope.userId=$scope.entity.getSelectedRows()[0].userId;
            User.getUserInfo($scope.userId).success(function(data) {
                $scope.dataInfo = data.resultMap.user;
                $scope.extData = data.resultMap.user.helperSubacctExt;
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
            url:"/user/updateHelperSubacctExtInfo",
            data:vm.form,
            type:"post",
            dataType:"json",
            success:function(data){
                if(data.status == 00){
                    $('#modifyModal').modal('hide');
                    msgAlert.text('修改成功');
                    window.location.href="#/user/partner";

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

            msgAlert.text('请先选择要查看的伙伴');
            return false;

        }else if($scope.entity.getSelectedRows().length > 1){

            msgAlert.text('每次只能选择一条伙伴信息');

        }else{
            $('input[name="newContact"]').val('');
            $('input[name="newMobile"]').val('');
            $('input[name="newAddress"]').val('');
            vm.userId=$scope.entity.getSelectedRows()[0].userId;
            vm.partnerName = $scope.entity.getSelectedRows()[0].nickName;
            vm.partnerMobile = $scope.entity.getSelectedRows()[0].mobile;
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
.controller('addPartnerController', ['$rootScope', '$scope','$http','uiGridConstants', 'settings','User','commonUtil','Table', function($rootScope, $scope, $http, uiGridConstants,settings, User,commonUtil,Table) {

        $scope.$on('$viewContentLoaded', function() {
            App.initAjax(); // initialize core components
        });

        // set sidebar closed and body solid layout mode
        $rootScope.settings.layout.pageContentWhite = true;
        $rootScope.settings.layout.pageBodySolid = false;
        $rootScope.settings.layout.pageSidebarClosed = false;

        $scope.form = {}
        $scope.form.hType = 0

        $scope.submitUser = function(){
            var namereg = /^(?![0-9]*$)[a-zA-Z0-9]{6,20}$/;
            var emailreg = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/;
            var mobilereg =/^((13[0-9])|(15[0-9])|(18[0-9])|(14[0-9])|(17[0-9]))\d{8}$/;
            if($scope.form.userName == ""){
                msgAlert.text('请填写登入名');
                return false;
            }
            if($scope.form.password ==undefined){
                msgAlert.text('请填写登入密码');
                return false;
            }
            if($scope.form.nickName ==""){
                msgAlert.text('请填写伙伴姓名');
                return false;
            }
            if($scope.form.mobile ==""){
                msgAlert.text('请填写伙伴联系方式');
                return false;
            }
            if($scope.form.userName.match(namereg) == null){
                msgAlert.text('登入名必须为字母+数字/纯字母/大于6个字');
                return false;
            }
            if($scope.form.mobile !="" && $scope.form.mobile != undefined) {
                if ($scope.form.mobile.match(mobilereg) == null) {
                    msgAlert.text('请输入正确格式的手机号码');
                    return false;
                }
            }

            if($scope.form.email !="" && $scope.form.email != undefined){
                if($scope.form.email.match(emailreg) == null){
                    msgAlert.text('请输入正确格式的邮箱地址');
                    return false;
                }
            }

            bodyRSA();
            /* encodeURIComponent*/
            $scope.form.password = encryptedString(key, encodeURIComponent($scope.form.password));


            $scope.form.userType = 5;
            $scope.form.regSource = 0
            User.commitUser($scope.form).success(function(data) {
                if(data.status == 00){
                    msgAlert.text('添加成功');
                    window.location.href="#/user/partner";
                }else{
                    $scope.form.password = {}
                    msgAlert.text('系统繁忙 >﹏< ['+ data.msg+']');
                }
            });

        }

        var key;

        function bodyRSA(){
            setMaxDigits(130);
            key = new RSAKeyPair("10001","","f5e769a799b21ffb5eb358006f110e3653eaf7ade25e764fb722c912fa049156ea851a4929428059cddbc269cd868bc089df30fb22bcb89b79c965f4fee81c516a147b777c5361d63d11e8504b0a416f8cf69f7e810ced126137911010fb72e15ba2d700fcb8663a64e6bffcece7c45d7414a795281420f508387b6017b56037");
        }
}])
