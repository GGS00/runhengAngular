/**
 * 贷款规则控制器
 */
angular.module('MetronicApp').controller('customerController', ['$rootScope', '$scope','$http','uiGridConstants', 'settings','customer','commonUtil','Table', function ($rootScope, $scope, $http, uiGridConstants, settings, customer, commonUtil, Table) {
    $scope.$on('$viewContentLoaded', function () {
        App.initAjax(); // initialize core components
    });
    $rootScope.settings.layout.pageContentWhite = true;
    $rootScope.settings.layout.pageBodySolid = false;
    $rootScope.settings.layout.pageSidebarClosed = false;
    var vm = this;
    vm.menuLen = 4;
    vm.pageParams = {
        bean: 'lmsCustomer',
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
            field: "code",
            displayName: '编码',
            width: '10%'
        },
        {
            field: "name",
            displayName: '名称',
            width: '10%'
        },
        {
            field: 'loan_rule_code',
            displayName: '贷款规则编码',
            width: '10%'
        },
        {
            field: "excess_rule_id",
            displayName: '超额规则',
            width: '10%'
        },
        {
            field: "basic_amount",
            displayName: '基础额度',
            width: '10%'
        },
        {
            field: "status",
            displayName: '状态',
            width: '10%',
            cellTemplate:'<div style="padding:5px">{{row.entity.status=="ACTIVE"?"生效":(row.entity.status=="INVALID"?"失效":"")}}</div>'
        },
        {
            field: "loan_type",
            displayName: '贷款品种',
            width: '10%',
            cellTemplate:'<div style="padding:5px">{{row.entity.loan_type=="INVENTORY_FINANCE"?"货好贷":(row.entity.loan_type=="ORDER_FINANCE"?"单好贷":row.entity.loan_type)}}</div>'

        },
        {
            field: "type",
            displayName: '客户类型',
            width: '10%',
            cellTemplate:'<div style="padding:5px">{{row.entity.type=="PERSON"?"个人":(row.entity.type=="LEGAL"?"法人":(row.entity.type=="COMPANY"?"公司":(row.entity.type=="GROUP"?"集团":row.entity.type)))}}</div>'
        },
        {
            field: "is_credit",
            displayName: '授信标识',
            width: '10%',
            cellTemplate:'<div style="padding:5px">{{row.entity.is_credit=="1"?"是":(row.entity.is_credit=="0"?"否":row.entity.is_credit)}}</div>'
        },
        {
            field: "is_blacklist",
            displayName: '是否列入黑名单',
            width: '10%',
            cellTemplate:'<div style="padding:5px">{{row.entity.is_blacklist==true?"是":(row.entity.is_blacklist==false?"否":row.entity.is_blacklist)}}</div>'
        },
        {
            field: "cert_type",
            displayName: '证件类型',
            width: '10%',
            cellTemplate:'<div style="padding:5px">{{row.entity.cert_type=="ID"?"身份证":(row.entity.cert_type=="BUSINESS"?"营业执照":(row.entity.cert_type=="PASSPORT"?"护照":(row.entity.cert_type=="OFFICERS"?"军官证":row.entity.cert_type)))}}</div>'
        },
        {
            field: "cert_no",
            displayName: '证件号',
            width: '10%'
        },
        {
            field: "sex",
            displayName: '性别',
            width: '10%',
            cellTemplate:'<div style="padding:5px">{{row.entity.sex=="1"?"男":(row.entity.sex=="0"?"女":row.entity.sex)}}</div>'
        },
        {
            field: "age",
            displayName: '年龄',
            width: '10%'
        },
        {
            field: "marital_status",
            displayName: '婚姻状况',
            width: '10%',
            cellTemplate:'<div style="padding:5px">{{row.entity.marital_status=="MARRIED"?"已婚":(row.entity.marital_status=="UNMARRIED"?"未婚":(row.entity.marital_status=="DIVORCE"?"离异":row.entity.marital_status))}}</div>'
        },
        {
            field: "native_place",
            displayName: '籍贯',
            width: '10%'
        },
        {
            field: "resident_city",
            displayName: '户口所在地',
            width: '10%'
        },
        {
            field: "postcode",
            displayName: '邮编',
            width: '10%'
        },
        {
            field: "phone",
            displayName: '联系电话',
            width: '10%'
        },
        {
            field: "address",
            displayName: '地址',
            width: '10%'
        },
        {
            field: "email",
            displayName: '邮箱',
            width: '10%'
        },
        {
            field: "bank_account",
            displayName: '银行账号',
            width: '10%'
        },
        {
            field: "bank_name",
            displayName: '开户行',
            width: '10%'
        },
        {
            field: "account_name",
            displayName: '账号名',
            width: '10%'
        },
        {
            field: "business_license_no",
            displayName: '营业执照号',
            width: '10%'
        },{
            field: "org_code",
            displayName: '工作单位代码',
            width: '10%'
        },
        {
            field: "org_name",
            displayName: '工作单位名称',
            width: '10%'
        },
        {
            field: "org_postcode",
            displayName: '工作单位邮编',
            width: '10%'
        },
        {
            field: "org_tel",
            displayName: '工作单位联系电话',
            width: '10%'
        },
        {
            field: "org_address",
            displayName: '工作单位地址',
            width: '10%'
        },
        {
            field: "legel_person_id_no",
            displayName: '法人身份证号',
            width: '10%'
        },
        {
            field: "org_bank_account",
            displayName: '工作单位银行账号',
            width: '10%'
        },
        {
            field: "org_bank_name",
            displayName: '工作单位开户行',
            width: '10%'
        },
        {
            field: "org_account_name",
            displayName: '工作单位账号名',
            width: '10%'
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
        window.location.href = "#/lms/basic/customer/add";
    }

    /*生效*/
    vm.operateEffect = function () {
        vm.selectListActive = [];
        if (vm.entity.getSelectedRows().length == 0) {
            msgAlert.info('请先选择要生效的客户');
            return false;
        } else {
            for(var i = 0 ; i < vm.entity.getSelectedRows().length ; i++){
                if(vm.entity.getSelectedRows()[i].status =='ACTIVE'){

                    msgAlert.info('选中的数据包含已经生效的客户，请小心勾选');
                    return false;

                }

            }

            for(var i = 0 ;i < vm.entity.getSelectedRows().length ; i++){
                vm.selectListActive.push(vm.entity.getSelectedRows()[i].id);
            }
            customer.activeBatch(vm).success(function(data) {

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
            msgAlert.info('请先选择要失效的客户');
            return false;
        }
        else{
            for(var i = 0 ; i < vm.entity.getSelectedRows().length ; i++){
                if(vm.entity.getSelectedRows()[i].status =='INVALID'){
                    msgAlert.info('选中的数据包含已经失效的客户，请小心勾选');
                    return false;

                }

            }

            for(var i = 0 ;i < vm.entity.getSelectedRows().length ; i++){
                vm.selectListActive.push(vm.entity.getSelectedRows()[i].id);
            }
            customer.batchInvalid(vm).success(function(data) {

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

            msgAlert.text('请先选择要修改的客户');
            return false;

        }else if(vm.entity.getSelectedRows().length > 1){

            msgAlert.text('每次只能修改一条客户');

        }else{

            window.location.href = "#/lms/basic/customer/update?id="+vm.entity.getSelectedRows()[0].id;
        }
    };



    vm.getPageByFilter = function(){
        var code = $('input[name="code"]').val();

        var status = $('#id_status').val();
        if(status == " "){
            status ="";
        }

        if(code == "" && status == ""){
            msgAlert.info('搜索条件不能为空');
            return false;
        }
        vm.pageParams = {
            code:code,
            status:status,
            bean:'lmsCustomer',
            method:'page',
            page:1,
            rows:10
        }
        vm.getPage();
    }

}])



