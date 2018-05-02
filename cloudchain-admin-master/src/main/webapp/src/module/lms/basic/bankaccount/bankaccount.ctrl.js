/**
 * 贷款规则控制器
 */
angular.module('MetronicApp').controller('bankAccountController', ['$rootScope', '$scope','$http','uiGridConstants', 'settings','bankAccount','commonUtil','Table', function ($rootScope, $scope, $http, uiGridConstants, settings, bankAccount, commonUtil, Table) {
    $scope.$on('$viewContentLoaded', function () {
        App.initAjax(); // initialize core components
    });
    $rootScope.settings.layout.pageContentWhite = true;
    $rootScope.settings.layout.pageBodySolid = false;
    $rootScope.settings.layout.pageSidebarClosed = false;
    var vm = this;
    vm.menuLen = 4;
    vm.pageParams = {
        bean: 'lmsBankAccount',
        method: 'page',
        page: 1,
        rows: 10
    }
    vm.column = [{
        field: "id",
        displayName: 'ID',
        width: '5%',
        visible: false,
        enableColumnMenu: false,// 是否显示列头部菜单按钮
    },
        {
            field: "account_name",
            displayName: '账号名',
            width: '10%'
        },
        {
            field: "bank_account",
            displayName: '银行账号',
            width: '10%'
        },
        {
            field: 'bank_name',
            displayName: '开户行',
            width: '10%'
        },
        {
            field: "type",
            displayName: '类型',
            width: '10%'
        },
        {
            field: "owner_type",
            displayName: '持卡人类型',
            width: '10%'
        },
        {
            field: "status",
            displayName: '状态',
            width: '10%',
            cellTemplate:'<div style="padding:5px">{{row.entity.status=="ACTIVE"?"生效":(row.entity.status=="INVALID"?"失效":"")}}</div>'
        },
        {
            field: "description",
            displayName: '备注',
            width: '10%'

        },
        {
            field: "creator",
            displayName: '创建人',
            width: '10%'
        },
        {
            field: "created_time",
            displayName: '创建时间',
            width: '10%'
        },
        {
            field: "last_operator",
            displayName: '最后修改人',
            width: '10%'
        },
        {
            field: "last_operated_time",
            displayName: '最后修改时间',
            width: '10%'
        }



    ]
    vm.getPage = function () {
        $http({
            url: "/process", method: "get",
            params: vm.pageParams
        }).success(function (data) {
            vm.data = data;
        })
    };
    vm.getPage();



    //新建客户
    vm.newCustomer =function () {
        window.location.href = "#/lms/basic/bankaccount/add";
    }

    /*生效*/
    vm.operateEffect = function () {
        vm.selectListActive = [];
        if (vm.entity.getSelectedRows().length == 0) {
            msgAlert.info('请先选择要生效的银行账号');
            return false;
        } else {
            for(var i = 0 ; i < vm.entity.getSelectedRows().length ; i++){
                if(vm.entity.getSelectedRows()[i].status =='ACTIVE'){

                    msgAlert.info('选中的数据包含已经生效的银行账号，请小心勾选');
                    return false;

                }

            }

            for(var i = 0 ;i < vm.entity.getSelectedRows().length ; i++){
                vm.selectListActive.push(vm.entity.getSelectedRows()[i].id);
            }
            bankAccount.activeBatch(vm).success(function(data) {

                if(data.additionalMsg.status=='成功'|| data.additionalMsg.status == '00'){

                    msgAlert.info('生效成功');
                    vm.getPage();
                    vm.entity.clearSelectedRows();

                }else if(data.additionalMsg.status=='01'){

                    msgAlert.text('系统繁忙 >﹏< ['+ data.additionalMsg.message+']');
                    vm.entity.clearSelectedRows();

                }

            });
        }
    }

    /*失效*/
    vm.invalid = function () {
        vm.selectListActive = [];
        if (vm.entity.getSelectedRows().length == 0) {
            msgAlert.info('请先选择要失效的银行账号');
            return false;
        }
        else{
            for(var i = 0 ; i < vm.entity.getSelectedRows().length ; i++){
                if(vm.entity.getSelectedRows()[i].status =='INVALID'){
                    msgAlert.info('选中的数据包含已经失效的银行账号，请小心勾选');
                    return false;

                }

            }

            for(var i = 0 ;i < vm.entity.getSelectedRows().length ; i++){
                vm.selectListActive.push(vm.entity.getSelectedRows()[i].id);
            }
            bankAccount.batchInvalid(vm).success(function(data) {

                if(data.additionalMsg.status=='成功'|| data.additionalMsg.status == '00'){

                    msgAlert.info('失效成功');
                    vm.getPage();
                    vm.entity.clearSelectedRows();

                }else if(data.additionalMsg.status=='01'){

                    msgAlert.text('系统繁忙 >﹏< ['+ data.additionalMsg.message+']');
                    vm.entity.clearSelectedRows();

                }

            });
        }
    }
    //修改
    vm.updateCustomer = function () {
        if(vm.entity.getSelectedRows().length == 0){

            msgAlert.text('请先选择要修改的银行账号');
            return false;

        }else if(vm.entity.getSelectedRows().length > 1){

            msgAlert.text('每次只能修改一条银行账号');

        }else{

            window.location.href = "#/lms/basic/bankaccount/update?id="+vm.entity.getSelectedRows()[0].id;
        }
    };



    vm.getPageByFilter = function(){
        var bankName = $('input[name="bankName"]').val();
        if(bankName == " "){
            bankName ="";
        }
        var accountName = $('input[name="accountName"]').val();
        if(accountName == " "){
            accountName ="";
        }
        var bankAccount = $('input[name="bankAccount"]').val();
        if(bankAccount == " "){
            bankAccount ="";
        }
        var status = $('#id_status').val();
        if(status == " "){
            status ="";
        }
        if(accountName == "" && bankAccount == "" && status == "" && bankName == ""){
            msgAlert.info('搜索条件不能为空');
            return false;
        }
        vm.pageParams = {
            accountName:accountName,
            bankAccount:bankAccount,
            status:status,
            bankName:bankName,
            bean:'lmsBankAccount',
            method:'page',
            page:1,
            rows:10
        }
        vm.getPage();
    }

}])



