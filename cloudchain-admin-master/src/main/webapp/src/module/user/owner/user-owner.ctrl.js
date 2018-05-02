/**
 * Created by shaobinhua on 2017/3/16.
 */
/**
 * Created by shaobinhua on 2017/3/13.
 */
angular.module('MetronicApp').controller('userOwnerController', ['$rootScope', '$scope','$http','uiGridConstants', 'settings','User','commonUtil','Table', function($rootScope, $scope, $http, uiGridConstants,settings, User,commonUtil,Table) {

    $scope.$on('$viewContentLoaded', function() {
        App.initAjax(); // initialize core components
    });

    // set sidebar closed and body solid layout mode
    $rootScope.settings.layout.pageContentWhite = true;
    $rootScope.settings.layout.pageBodySolid = false;
    $rootScope.settings.layout.pageSidebarClosed = false;
    var vm = this;

    vm.ownerType = 1; //货主类型：0托运人，1托储人，2托销人

    $scope.pageParams = {
        bean:'user',
        method:'pageGetUserList',
        userType:4,
        ownerType:$('input[name="ownerType"]').val(),
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
            displayName: '货主姓名',
            enableCellEdit: true,
            enableCellEditOnFocus:true
        },
        {  field: "mobile",
            displayName: '联系电话',
            enableCellEdit: true,
            enableCellEditOnFocus:true
        },
        { name:'货主类型',
            cellTemplate:'<div class="ui-grid-cell-contents" ng-if="row.entity.ownerSubacctExt != null?row.entity.ownerSubacctExt.ownerType == 0:row.entity.ownerSubacctExt.ownerType == 0">托运人</div><div class="ui-grid-cell-contents" ng-if="row.entity.ownerSubacctExt != null?row.entity.ownerSubacctExt.ownerType == 1:row.entity.ownerSubacctExt.ownerType == 0">托储人</div><div class="ui-grid-cell-contents" ng-if="row.entity.ownerSubacctExt != null?row.entity.ownerSubacctExt.ownerType == 2:row.entity.ownerSubacctExt.ownerType == 0">托销人</div>'
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

    $scope.getPageByFilter = function(){

        var userName = $('input[name="userName"]').val();
        var nickName = $('input[name="nickName"]').val();
        var mobile = $('input[name="mobile"]').val();

        $scope.pageParams = {
            bean:'user',
            method:'pageGetUserList',
            userType:4,
            ownerType:$('input[name="ownerType"]').val(),
            page:1,
            rows:10,
            userName:userName,
            nickName:nickName,
            mobile:mobile
        }
        $scope.getPage();
    }

    $scope.editUser = function(){

        if($scope.entity.getSelectedRows().length == 0){
            msgAlert.text('请先选择要修改的记录');
            return false;
        }else if($scope.entity.getSelectedRows().length > 1){
            msgAlert.text('每次只能修改一条记录');

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
                    if(vm.ownerType == '0'){
                        window.location.href="#/transport/owner";
                    }else {
                        window.location.href="#/wms/owner";
                    }
                }else{
                    msgAlert.text('系统繁忙 >﹏< ['+ data.msg+']');
                }
            },
            error:function(){
                msgAlert.text('系统繁忙 >﹏<');
            }
        })

    }

    //托运人地址管理
    vm.editAddress = function () {
        if($scope.entity.getSelectedRows().length == 0){

            msgAlert.text('请先选择要一条托运人');
            return false;

        }else if($scope.entity.getSelectedRows().length > 1){

            msgAlert.text('每次只能选择一条托运人');
            return;
        }else{
            vm.userId=$scope.entity.getSelectedRows()[0].userId;
            window.location.href = "#/transport/setting/shipperaddress/"+  vm.userId;

        }

    }
    //地址库管理
    vm.Addr1Manage = function () {
        if($scope.entity.getSelectedRows().length == 0){

            msgAlert.text('请先选择要一条货主');
            return false;

        }else if($scope.entity.getSelectedRows().length > 1){

            msgAlert.text('每次只能选择一条货主');
            return;
        }else{
            vm.userId=$scope.entity.getSelectedRows()[0].userId;
            window.location.href = "#/wms/setting/owneraddress/"+  vm.userId;
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

    vm.showTabs = function(index){
        switch (index)
        {
            case 0:
                $('#myTab a[href="#tab_simple"]').tab('show');
                $scope.getPage();
                break;
            case 1:
                $('#myTab a[href="#tab_chaimi"]').tab('show');
                vm.getChaimi();
                break;
        }

    }

    //==================================================柴米货主===============================================================//
    vm.qryRole = $('#qry_cooperRole').val();

    vm.chaimiParams = {
        bean:'umsCooper',
        method:'page',
        qryType:'E',
        qryRole:vm.qryRole,
        page:1,
        rows:10
    }
    vm.chaimicolumn = [
        {   field: "id",
            displayName: 'ID',
            visible: false,
            enableColumnMenu: false,// 是否显示列头部菜单按钮
        },
        {   field: "entrust_acc",
            displayName: '账号',
            enableCellEdit: true,
            enableCellEditOnFocus:true
        },
        {   field: "nick_name",
            displayName: '名称',
            enableCellEdit: true,
            enableCellEditOnFocus:true
        },
        {   field: "entrust_nicknm",
            displayName: '昵称',
            enableCellEdit: true,
            enableCellEditOnFocus:true
        },
        {  field: "mobile",
            displayName: '手机',
            enableCellEdit: true,
            enableCellEditOnFocus:true
        },
        {  field: "email",
            displayName: '邮箱',
            enableCellEdit: true,
            enableCellEditOnFocus:true
        },
        {   field: "cooper_type",
            displayName: '货主类型',
            enableCellEdit: true,
            enableCellEditOnFocus:true,
            cellTemplate:'<div style="padding:5px">{{row.entity.cooper_type=="01"?"托储人":(row.entity.cooper_type=="02"?"托运人":row.entity.cooper_type)}}</div>'
        },
        {
            field: "status",
            displayName: '状态',
            width: '10%',
            cellTemplate:'<div style="padding:5px">{{row.entity.status=="01"?"有效":(row.entity.status=="02"?"无效":row.entity.status)}}</div>'
        },
        {
            name:'操作',
            width: '10%',
            visible: false,
            cellTemplate:'<button class ="btn yellow" ng-click="owner.updCooper()">查看</button>'
        }
    ]
    vm.getChaimi = function () {
        $http({
            url: "/process"/*'../js/services/dashBoard.json'*/, method: "get",
            params: vm.chaimiParams
        }).success(function (data) {
            vm.chaimidata = data;
        })
    };

    //添加
    vm.addCooper = function () {
        $('#add_cooper_model').modal('show');
        vm.clearAddCooperForm();  //清空表单数据
        $('#submitAddCooper').attr("disabled", true);
    }
    //提交合作商信息
    vm.submitAddCooper = function(){
        if($('#add_acc_name').val() == null || $('#add_acc_name').val()  == ''){
            msgAlert.info('请输入对方账号信息');
            return false;
        }
        vm.form = $('#UmsCooperInfo').serialize();
        vm.form = decodeURIComponent(vm.form,true);
        User.addCooper(vm).success(function(data) {
            if(data.status == 00){
                msgAlert.info('添加成功');
                $('#add_cooper_model').modal('hide');
                vm.getChaimi();
            }else{
                msgAlert.text(data.msg);
            }
        });
    }
    $('#add_acc_name').change(function(){
        $('input[name="cooperNicknm"]').val('');
        $('input[name="cooperPhone"]').val('');
        $('input[name="cooperEmail"]').val('');
        $('#submitAddCooper').attr("disabled", true);
        //查询A用户信息
        User.getUserByName($('#add_acc_name').val()).success(function(data) {
            if(data.status == '00'){
                //校验用户类型
                if(data.obj.userType == '0'){
                    $('input[name="cooperUserId"]').val(data.obj.userId);
                    $('input[name="cooperNicknm"]').val(data.obj.nickName);
                    $('input[name="cooperPhone"]').val(data.obj.mobile);
                    $('input[name="cooperEmail"]').val(data.obj.email);
                    $('#submitAddCooper').removeAttr("disabled");
                }else {
                    msgAlert.text('用户'+$('#add_acc_name').val()+'不存在');
                    return false;
                }
            }else if(data.status == '2001001'){
                msgAlert.text('用户'+$('#add_acc_name').val()+'不存在');
                return false;
            }else{
                msgAlert.text('系统处理错误 >﹏< ['+ data.msg+']');
                return false;
            }
        });
    });

    //清除新增model中表单信息
    vm.clearAddCooperForm = function(){
        $('input[name="cooperUserNm"]').val('');
        $('input[name="cooperNicknm"]').val('');
        $('input[name="cooperPhone"]').val('');
        $('input[name="cooperEmail"]').val('');
    }
   vm.nicknameFlag =  true;
    //修改
    vm.updCooper = function () {
        if (vm.chaimi_entity.getSelectedRows().length == 0) {
            msgAlert.info('请先选择要修改的记录');
            return false;
        }else if(vm.chaimi_entity.getSelectedRows().length != 1){
            msgAlert.info('每次只能修改一条记录');
            return false;
        }
        $('#upd_cooper_model').modal('show');

            vm.disFlag =  true;
        // $('#submitUpdCooper').attr("disabled", true);
        //判断货主类型
        if(vm.chaimi_entity.getSelectedRows()[0].cooper_type == '01'){
            $('#upd_cooperRole').val('托储人');
            $('#updCooperRole').val('1');
        }else {
            $('#upd_cooperRole').val('托运人');
            $('#updCooperRole').val('0');
        }
        $('#upd_acc_name').val(vm.chaimi_entity.getSelectedRows()[0].entrust_acc);
        $('#upd_nick_name').val(vm.chaimi_entity.getSelectedRows()[0].entrust_nicknm);
        $('#upd_phone').val(vm.chaimi_entity.getSelectedRows()[0].mobile);
        $('#upd_email').val(vm.chaimi_entity.getSelectedRows()[0].email);
    }
    vm.nickLinsener = function () {
        if($.trim($('#upd_nick_name').val())!= vm.chaimi_entity.getSelectedRows()[0].entrust_nicknm){
            vm.disFlag =  "";
        }else{
            vm.disFlag =  true;
        }
    }

    //提交修改信息
    vm.submitUpdCooper = function(){
        if($('#upd_nick_name').val() == vm.chaimi_entity.getSelectedRows()[0].entrust_nicknm){
            msgAlert.info('货主信息没有变动,无需提交修改');
            return false;
        }
        vm.cooperId = vm.chaimi_entity.getSelectedRows()[0].id;
        vm.updParams = {
            cooperRole:$('#updCooperRole').val(),
            cooperNicknm:$('#upd_nick_name').val()
        }
        User.updCooper(vm).success(function(data) {
            if(data.status == 00){
                msgAlert.info('修改成功');
                $('#upd_cooper_model').modal('hide');
                vm.getChaimi();
            }else{
                msgAlert.text(data.msg);
            }
        });
    }

    //删除
    vm.delCooper = function () {
        vm.selectListDelete = [];
        if (vm.chaimi_entity.getSelectedRows().length == 0) {
            msgAlert.info('请先选择要删除的记录');
            return false;
        }
        else{
            for(var i = 0 ;i < vm.chaimi_entity.getSelectedRows().length ; i++){
                vm.selectListDelete.push(vm.chaimi_entity.getSelectedRows()[i].id);
            }
            User.delCooper(vm).success(function(data) {
                if(data.status == '00'){
                    msgAlert.info('删除成功');
                    vm.getChaimi();
                    vm.chaimi_entity.clearSelectedRows();

                }else if(data.status=='01'){
                    msgAlert.text('系统处理错误 >﹏< ['+ data.msg+']');
                    vm.chaimi_entity.clearSelectedRows();
                }
            });
        }
    }

    //搜索
    vm.getChaimiByFilter = function(){
        var qryName = $('#qryName').val();
        if(qryName == " "){
            qryName ="";
        }
        var qryNick = $('#qryNick').val();
        if(qryNick == " "){
            qryNick ="";
        }
        var qryTel = $('#qryTel').val();
        if(qryTel == " "){
            qryTel ="";
        }
        var qryMail = $('#qryMail').val();
        if(qryMail == " "){
            qryMail ="";
        }
        var status = $('#id_status').val();
        if(status == " "){
            status ="";
        }
        vm.chaimiParams = {
            bean:'umsCooper',
            method:'page',
            qryType:'E',
            qryRole:vm.qryRole,
            qryName:qryName,
            qryNick:qryNick,
            qryTel:qryTel,
            qryMail:qryMail,
            status:status,
            page:1,
            rows:10
        }
        vm.getChaimi();
    }
    //==================================================柴米货主===============================================================//

}])
.controller('addOwnerController', ['$rootScope', '$scope','$http','uiGridConstants', 'settings','User','commonUtil','Table', function($rootScope, $scope, $http, uiGridConstants,settings, User,commonUtil,Table) {

        $scope.$on('$viewContentLoaded', function() {
            App.initAjax(); // initialize core components
        });

        // set sidebar closed and body solid layout mode
        $rootScope.settings.layout.pageContentWhite = true;
        $rootScope.settings.layout.pageBodySolid = false;
        $rootScope.settings.layout.pageSidebarClosed = false;

        $scope.form = {}
        $scope.form.ownerType = 1;

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
                msgAlert.text('请填写货主姓名');
                return false;
            }
            if($scope.form.mobile ==""){
                msgAlert.text('请填写货主联系方式');
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


            $scope.form.userType = 4;
            $scope.form.regSource = 0
            $scope.ownerType = $scope.form.ownerType;
            User.commitUser($scope.form).success(function(data) {
                if(data.status == 00){
                    msgAlert.text('添加成功');
                    if($scope.ownerType == '1'){
                        window.location.href="#/wms/owner";
                    }else {
                        window.location.href="#/transport/owner";
                    }
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
