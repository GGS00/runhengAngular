/**
 * Created by shaobinhua on 2017/3/16.
 */
/**
 * Created by shaobinhua on 2017/3/13.
 */
angular.module('MetronicApp').controller('driverShowController', ['$rootScope', '$scope','$http','uiGridConstants', 'settings','User','commonUtil','Table', function($rootScope, $scope, $http, uiGridConstants,settings, User,commonUtil,Table) {

    $scope.$on('$viewContentLoaded', function() {
        App.initAjax(); // initialize core components
    });

    // set sidebar closed and body solid layout mode
    $rootScope.settings.layout.pageContentWhite = true;
    $rootScope.settings.layout.pageBodySolid = false;
    $rootScope.settings.layout.pageSidebarClosed = false;
    var vm = this;
    vm.pageParams = {
        bean:'user',
        method:'pageGetDriverList',
        userType:3,
        page:1,
        rows:10
    }



    vm.column = [
        {   field: "userName",
            displayName: '账号',
            enableCellEdit: true,
            enableCellEditOnFocus:true
        },
        {   field: "nickName",
            displayName: '司机姓名',
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




    vm.getPage = function () {

        commonUtil.getList(vm.pageParams).success(function(data) {
            console.log(data)
            vm.data = data;
        });
    };
    vm.getPage();

    vm.getPageByFilter = function(){

        var userName = $('input[name="userName"]').val();
        var nickName = $('input[name="nickName"]').val();
        var mobile = $('input[name="mobile"]').val();

        vm.pageParams = {
            bean:'user',
            method:'pageGetDriverList',
            userType:3,
            page:1,
            rows:10,
            userName:userName,
            nickName:nickName,
            mobile:mobile
        }
        vm.getPage();
    }

    vm.addDrivers = function(){

        window.location.href="#/user/addNewDrivers"
    }

    vm.editDrivers = function(){

        if(vm.entity.getSelectedRows().length == 0){

            msgAlert.text('请先选择要修改的司机');
            return false;

        }else if(vm.entity.getSelectedRows().length > 1){

            msgAlert.text('每次只能修改一条司机信息');

        }else{
            vm.userId=vm.entity.getSelectedRows()[0].userId;
            User.getUserInfo(vm.userId).success(function(data) {
                console.log(data)
                vm.dataInfo = data.resultMap.user;
                vm.extData = data.resultMap.user.driverSubacctExt;
            });

            $('#modifyModal').modal('show');
        }
    }

    vm.confirmModify =function(){
        if($('input[name="sex"]:checked').val() == undefined){
            $('input[name="sex"]:checked').val() == ""
        }
        $('#userSex').val($('input[name="sex"]:checked').val());
        vm.form = $("#editDriversInfo").serialize();
        vm.form = decodeURIComponent(vm.form,true)
        console.log(vm.form)
        $.ajax({
            url:"/user/updateDriverSubacctExtInfo",
            data:vm.form,
            type:"post",
            dataType:"json",
            success:function(data){
                if(data.status == 00){
                    $('#modifyModal').modal('hide');
                    msgAlert.text('修改成功');
                    window.location.href="#/user/drivers";

                }else{
                    msgAlert.text('系统繁忙 >﹏< ['+ data.msg+']');
                }


            },
            error:function(){
                msgAlert.text('系统繁忙 >﹏<');
            }
        })


    }


}])

    .controller('addNewDriverController', ['$rootScope', '$scope','$http','uiGridConstants', 'settings','User','commonUtil','Table', function($rootScope, $scope, $http, uiGridConstants,settings, User,commonUtil,Table) {

        $scope.$on('$viewContentLoaded', function() {
            App.initAjax(); // initialize core components
        });

        // set sidebar closed and body solid layout mode
        $rootScope.settings.layout.pageContentWhite = true;
        $rootScope.settings.layout.pageBodySolid = false;
        $rootScope.settings.layout.pageSidebarClosed = false;
        var vm = this;

        vm.pageParams = {
            bean:'user',
            method:'pageGetUserList',
            userType:3,
            page:1,
            rows:10
        }



        vm.column = [
            {   field: "nickName",
                displayName: '司机姓名',
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



        vm.submitDrivers = function(){


            vm.userName = $('input[name="userName"]').val();
            vm.nickName = $('input[name="nickName"]').val();
            vm.mobile = $('input[name="mobile"]').val();
            vm.email = $('input[name="email"]').val();
            var namereg = /^(?![0-9]*$)[a-zA-Z0-9]{6,20}$/;
            var emailreg = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/;
            var mobilereg =/^((13[0-9])|(15[0-9])|(18[0-9])|(14[0-9])|(17[0-9]))\d{8}$/;
            console.log(vm.email.match(emailreg))
            if(vm.userName == ""){
                msgAlert.text('请填写登入名');
                return false;
            }
            if(vm.password ==undefined){
                msgAlert.text('请填写登入密码');
                return false;
            }
            if(vm.nickName ==""){
                msgAlert.text('请填写司机姓名');
                return false;
            }
            if(vm.mobile ==""){
                msgAlert.text('请填写司机联系方式');
                return false;
            }
            if(vm.userName.match(namereg) == null){
                msgAlert.text('登入名必须为字母+数字/纯字母/大于6个字');
                return false;
            }

            if(vm.mobile.match(mobilereg) == null){
                msgAlert.text('请输入正确格式的手机号码');
                return false;
            }

            if(vm.email !=""){
                if(vm.email.match(emailreg) == null){
                    msgAlert.text('请输入正确格式的邮箱地址');
                    return false;
                }
            }


            bodyRSA();
            /* encodeURIComponent*/
            vm.password = encryptedString(key, encodeURIComponent(vm.password));

            User.commitDrivers(vm).success(function(data) {
                if(data.status == 00){

                    msgAlert.text('添加成功');
                    window.location.href="#/user/drivers";

                }else{
                    msgAlert.text('系统繁忙 >﹏< ['+ data.msg+']');

                }
            });

        }



        vm.toDrivers = function(){
            window.location.href="#/user/drivers"
        }

        var key;

        function bodyRSA(){
            setMaxDigits(130);
            key = new RSAKeyPair("10001","","f5e769a799b21ffb5eb358006f110e3653eaf7ade25e764fb722c912fa049156ea851a4929428059cddbc269cd868bc089df30fb22bcb89b79c965f4fee81c516a147b777c5361d63d11e8504b0a416f8cf69f7e810ced126137911010fb72e15ba2d700fcb8663a64e6bffcece7c45d7414a795281420f508387b6017b56037");
        }


    }])
