angular.module('MetronicApp').controller('contactsCtrl', ['$rootScope', '$scope','$http','uiGridConstants', 'settings','suppServer','$stateParams','commonUtil','Table', function($rootScope, $scope, $http, uiGridConstants,settings, suppServer,$stateParams,commonUtil,Table) {

    $scope.$on('$viewContentLoaded', function() {
        App.initAjax(); // initialize core components
    });
    // set sidebar closed and body solid layout mode
    $rootScope.settings.layout.pageContentWhite = true;
    $rootScope.settings.layout.pageBodySolid = false;
    $rootScope.settings.layout.pageSidebarClosed = false;
    var vm = this;
    var userid = $stateParams.Id;
    /**************************************************添加联系人************************************************************************************************/
    vm.column_contacts = [{
        field: "ID",
        displayName: 'ID',
        width: '10%',
        visible: false,
        enableColumnMenu: false,// 是否显示列头部菜单按钮
    },
        {
            field: 'OWNER_ID',
            displayName: '联系人',
        },
        {
            field: "WAREHOUSE_ID",
            displayName: '联系电话',
        },
        {
            field: "WAREHOUSE_NAME",
            displayName: '联系邮箱',

        },
        {
            field: "OWNER_NAME",
            displayName: '操作',
        }
    ]
    vm.contacts_params = {}
    vm.getContactsPage = function () {
        vm.qryUserId = userid;
        vm.userType = 6;
        suppServer.getContacts(vm).success(function (data) {
            debugger
            if (data.status == '00') {
                vm.contactsdata = data.data;
            } else {
                msgAlert.text('系统繁忙 >﹏< [' + data.message + ']');
            }
        });
    };
    vm.getContactsPage();

    //添加联系人弹框
    vm.addContacts = function () {
        $('#addContacts').modal('show');
    }

    //确认添加联系人
    var emailreg = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/;
    var mobilereg = /^((13[0-9])|(15[0-9])|(18[0-9])|(14[0-9])|(17[0-9]))\d{8}$/;
    vm.btaddContacts = function () {
        vm.nickName = $.trim($("#id_nickname").val());
        vm.mobile = $.trim($("#id_mobile").val());
        vm.email = $.trim($("#id_email").val());
        vm.id = userid;
        if (vm.nickName == "" && vm.nickName !== undefined) {
            msgAlert.text('联系人不能为空');
            return;
        }
        if (vm.mobile != "" && vm.mobile != undefined) {
            if (vm.mobile.match(mobilereg) == null) {
                msgAlert.text('请输入正确格式的手机号码');
                return;
            }
        } else {
            msgAlert.text('手机号码不能为空');
            return;
        }
        if (vm.email != "" && vm.email != undefined) {
            if (vm.email.match(emailreg) == null) {
                msgAlert.text('请输入正确格式的邮箱地址');
                return;
            }
        } else {
            msgAlert.text('邮箱地址不能为空');
            return;
        }
        suppServer.addContacts(vm).success(function (data) {
            debugger
            if (data.status == '00') {
                $('#addContacts').modal('hide');
                msgAlert.text('添加成功');
                vm.getContactsPage();

            } else {
                msgAlert.text('系统繁忙 >﹏< [' + data.message + ']');
            }
        });
    }
}]);

