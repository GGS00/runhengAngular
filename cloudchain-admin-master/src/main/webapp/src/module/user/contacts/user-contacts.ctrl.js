angular.module('MetronicApp').controller('userContactsController', ['$rootScope', '$scope','$http','uiGridConstants', 'settings','User','commonUtil','citySelect', function($rootScope, $scope, $http, uiGridConstants,settings, User,commonUtil,citySelect) {

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
        page:1,
        rows:10,
        userType:6
    }

    vm.column = [
        {   field: "nickName",
            displayName: '联系人',
            enableCellEdit: true,
            width:'50%',
            enableCellEditOnFocus:true
        },
       /* {   field: "cneeMobile",
            displayName: '联系方式',
            enableCellEdit: true,
            width:'15%',
            enableCellEditOnFocus:true
        },*/
        {   field: "subacctExt.company",
            displayName: '公司',
            width:'50%',
            enableCellEdit: true,
            enableCellEditOnFocus:true
        }/*,
        {  field: "province",
            displayName: '地址',
            enableCellEdit: true,
            width:'40%',
            enableCellEditOnFocus:true,
            cellTemplate:'<div style="padding:5px">{{row.entity.province}}{{row.entity.city}}{{row.entity.county}}{{row.entity.address}}</div>'

        }*/
    ]




    vm.getPage = function () {

        commonUtil.getList(vm.pageParams).success(function(data) {
            console.log(data)
            vm.data = data;
        });
    };
    vm.getPage();

    vm.addContacts = function(){

        window.location.href="#/user/addcontacts"
    }

    vm.editContacts = function(){
        $.fn.modal.Constructor.prototype.enforceFocus = function () { }
        if(vm.entity.getSelectedRows().length == 0){

            msgAlert.text('请先选择要查看的联系人');
            return false;

        }else if(vm.entity.getSelectedRows().length > 1){

            msgAlert.text('每次只能选择一条联系人信息');

        }else{
            $('input[name="newAddress"]').val('');
            $('input[name="newMobile"]').val('');
            vm.userId=vm.entity.getSelectedRows()[0].userId;
            User.getAddressInfo(vm).success(function(data) {
                vm.addressData = data.data;
            });
            $('#modifyModal').modal('show');
        }
    }

    vm.removeAddress= function(cId) {
        console.log(cId);
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


    vm.confirmModify =function(){
        vm.province = $('.newAddAddress').find('.selectPro :selected').html();
        vm.city = $('.newAddAddress').find('.selectCity :selected').html();
        vm.county = $('.newAddAddress').find('.selectArea :selected').html();
        vm.newAddress = $('input[name="newAddress"]').val();
        vm.newMobile = $('input[name="newMobile"]').val();
        var mobilereg =/^((13[0-9])|(15[0-9])|(18[0-9])|(14[0-9])|(17[0-9]))\d{8}$/;
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
            userId:vm.addressData[0].userId,
            cneeName:vm.addressData[0].cneeName,
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
                User.getAddressInfo(vm).success(function(data) {
                    vm.addressData = data.data;
                });
            }else{
                msgAlert.text(data.msg);
                $('#modifyModal').modal('hide');
            }
        });


    }


}])

    .controller('addContactsController', ['$rootScope', '$scope','$http','uiGridConstants', 'settings','User','commonUtil','citySelect', function($rootScope, $scope, $http, uiGridConstants,settings, User,commonUtil,citySelect) {

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



        vm.submitContacts = function(){


            vm.company = $('input[name="company"]').val();
            vm.cneeName = $('input[name="cneeName"]').val();
            vm.cneeMobile = $('input[name="cneeMobile"]').val();
            vm.province = $('.address').find('.selectPro :selected').html();
            vm.city = $('.address').find('.selectCity :selected').html();
            vm.county = $('.address').find('.selectArea :selected').html();
            vm.address = $('input[name="address"]').val();


            var mobilereg =/^((13[0-9])|(15[0-9])|(18[0-9])|(14[0-9])|(17[0-9]))\d{8}$/;

            if(vm.company == ""){
                msgAlert.text('请填写公司名');
                return false;
            }
            if(vm.cneeName ==""){
                msgAlert.text('请填写联系人姓名');
                return false;
            }
            if(vm.cneeMobile ==""){
                msgAlert.text('请填写联系方式');
                return false;
            }
            if(vm.address ==""){
                msgAlert.text('请填写详细地址');
                return false;
            }
            if(vm.cneeMobile.match(mobilereg) == null){
                msgAlert.text('请输入正确格式的手机号码');
                return false;
            }

            vm.vparams = {
                nickName:vm.cneeName,
                company:vm.company
            }
            User.addTopContacts(vm.vparams).success(function(data) {
                if(data.status == 00){
                    vm.xparams = {
                        userId:data.obj,
                        cneeName:vm.cneeName,
                        cneeMobile:vm.cneeMobile,
                        province:vm.province,
                        city:vm.city,
                        county:vm.county,
                        address:vm.address,
                        isDefault:1
                    }
                    User.addAddress(vm.xparams).success(function(data) {
                        if(data.status == 00){

                            msgAlert.text('添加成功');
                            window.location.href="#/user/contacts";

                        }else{
                            msgAlert.text(data.msg);

                        }
                    });

                }else{
                    msgAlert.text(data.msg);

                }
            });

        }



        vm.toContacts = function(){
            window.location.href="#/user/contacts"
        }



    }])
