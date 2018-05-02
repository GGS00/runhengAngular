/* Setup TmsController page controller */
angular.module('MetronicApp').controller('settledController', ['$rootScope', '$scope','$http','$location','uiGridConstants', 'settings','commonUtil','Table', function($rootScope, $scope, $http, $location,uiGridConstants,settings, commonUtil,Table) {

    $scope.$on('$viewContentLoaded', function() {
        App.initAjax(); // initialize core components
    });

    var vm = this;
    $(".select2me").select2();
    vm.showTabs = function(index){
        switch (index)
        {
            case 0:
                $('#myTab a[href="#company"]').tab('show');
                vm.identityType=1;
                initial()
                break;
            case 1:
                $('#myTab a[href="#person"]').tab('show');
                vm.identityType=0;
                initial()
                break;
        }

    }

    vm.identityType=1;

    initial()

    function initial(){
        commonUtil.identity(vm).success(function(data) {
            if(data.additionalMsg.status == '00'){
                vm.companyTypeList = data.rows;
                vm.companyTypeSelect = vm.companyTypeList[0].id;
                console.log(vm.companyTypeList)
            }else{

            }
        });
        commonUtil.industry(vm).success(function(data) {
            if(data.additionalMsg.status == '00'){
                vm.industryList = data.rows;
                vm.industrySelect = vm.industryList[0].id;
                console.log(vm.industryList)
            }else{

            }
        });
    }

    $scope.companySettled = function(){
        vm.companyType= $('.companyType').val();
        vm.industry= $('.industry').val();
        vm.companyName = $("input[name='companyName']").val();
        vm.companyContactor = $("input[name='companyContactor']").val();
        vm.companyMobile = $("input[name='companyMobile']").val();
        vm.companyLoginName = $("input[name='companyLoginName']").val();
        vm.companyLoginPassword = $("input[name='companyLoginPassword']").val();
        vm.companyLoginPasswordconfirm = $("input[name='companyLoginPasswordconfirm']").val();
        if (vm.companyType == ""||vm.companyType == undefined) {
            $('.companytips').html('请选择企业类型')
            setTimeout(function(){$('.companytips').hide();},1000);
            return false;
        }
        if (vm.industry == ""||vm.industry == undefined) {
            $('.companytips').html('请选择所属行业')
            setTimeout(function(){$('.companytips').hide();},1000);
            return false;
        }
        if (vm.companyName == "") {
            $('.companytips').html('请输入企业名称')
            $('.companytips').show();
            setTimeout(function(){$('.companytips').hide();},1000);
            return false;
        }
        if (vm.companyContactor == "") {
            $('.companytips').html('请输入联系人')
            setTimeout(function(){$('.companytips').hide();},1000);
            return false;
        }
        var reg = /^1[0-9]{10}$/;
        if (vm.companyMobile == "") {
            $('.companytips').html('请输入手机号码')
            setTimeout(function(){$('.companytips').hide();},1000);
            return false;
        }
        if(reg.test(vm.companyMobile)==false){
            $('.companytips').html('手机号码格式错误')
            setTimeout(function(){$('.companytips').hide();},1000);
            return false;
        }
        if (vm.companyLoginName == "") {
            $('.companytips').html('请输入账号')
            setTimeout(function(){$('.companytips').hide();},1000);
            return false;
        }
        if (vm.companyLoginPassword == "") {
            $('.companytips').html('请输入密码');
            setTimeout(function(){$('.companytips').hide();},1000);
            return false;
        }
        if (vm.companyLoginPassword != vm.companyLoginPasswordconfirm) {
            $('.companytips').html('两次密码输入不一致，请重新输入');
            setTimeout(function(){$('.companytips').hide();},1000);
            return false;
        }


        bodyRSA();
        vm.result = encryptedString(key, encodeURIComponent(vm.companyLoginPassword));
        vm.params={
            userName:vm.companyLoginName,
            nickName:vm.companyContactor,
            mobile:vm.companyMobile,
            password:vm.result,
            company:vm.companyName,
            identityId :vm.companyType,
            industryIds:vm.industry,
            belongTo:0
        }
        commonUtil.userApply(vm.params).success(function(data) {
            if(data.status == '00'){
                $("#showAddImg").modal('show');
            }else{
                $('.companytips').html('入驻失败'+data.msg)
                setTimeout(function(){$('.companytips').hide();},1000);
            }
        });


    };

    $scope.personSettled = function(){
        vm.personType= $('.personType').val();
        vm.personIndustry= $('.personIndustry').val();
        vm.personContactor = $("input[name='personContactor']").val();
        vm.personMobile = $("input[name='personMobile']").val();
        vm.personLoginName = $("input[name='personLoginName']").val();
        vm.personLoginPassword = $("input[name='personLoginPassword']").val();
        vm.personLoginPasswordconfirm = $("input[name='personLoginPasswordconfirm']").val();
        if (vm.personType == ""||vm.personType == undefined) {
            $('.persontips').html('请先选择身份');
            setTimeout(function(){$('.persontips').hide();},1000);
            return false;
        }
        if (vm.personIndustry == ""||vm.personIndustry == undefined) {
            $('.persontips').html('请选择所属行业');
            setTimeout(function(){$('.persontips').hide();},1000);
            return false;
        }
        if (vm.personContactor == "") {
            $('.persontips').html('请输入联系人');
            setTimeout(function(){$('.persontips').hide();},1000);
            return false;
        }
        var reg = /^1[0-9]{10}$/;
        if (vm.personMobile == "") {
            $('.persontips').html('请输入手机号码');
            setTimeout(function(){$('.persontips').hide();},1000);
            return false;
        }
        if(reg.test(vm.personMobile)==false){
            $('.persontips').html('手机号码格式错误');
            setTimeout(function(){$('.persontips').hide();},1000);
            return false;
        }
        if (vm.personLoginName == "") {
            $('.persontips').html('请输入账号');
            setTimeout(function(){$('.persontips').hide();},1000);
            return false;
        }
        if (vm.personLoginPassword == "") {
            $('.persontips').html('请输入密码');
            setTimeout(function(){$('.persontips').hide();},1000);
            return false;
        }
        if (vm.personLoginPassword != vm.personLoginPasswordconfirm) {
            $('.persontips').html('两次密码输入不一致，请重新输入');
            setTimeout(function(){$('.persontips').hide();},1000);
            return false;
        }


        bodyRSA();
        vm.result = encryptedString(key, encodeURIComponent(vm.personLoginPassword));
        vm.params={
            userName:vm.personLoginName,
            nickName:vm.personContactor,
            mobile:vm.personMobile,
            password:vm.result,
            identityId :vm.personType,
            industryIds:vm.personIndustry,
            belongTo:0
        }
        commonUtil.userApply(vm.params).success(function(data) {
            if(data.status == '00'){
                $("#showAddImg").modal('show');
            }else{
                $('.persontips').html('入驻失败'+data.msg);
                setTimeout(function(){$('.persontips').hide();},1000);
            }
        });


    };

    $scope.toHome = function(){
        window.location.href="/chailogin";
    }


    var key;

    function bodyRSA(){
        setMaxDigits(130);
        key = new RSAKeyPair("10001","","f5e769a799b21ffb5eb358006f110e3653eaf7ade25e764fb722c912fa049156ea851a4929428059cddbc269cd868bc089df30fb22bcb89b79c965f4fee81c516a147b777c5361d63d11e8504b0a416f8cf69f7e810ced126137911010fb72e15ba2d700fcb8663a64e6bffcece7c45d7414a795281420f508387b6017b56037");
    }

}])



