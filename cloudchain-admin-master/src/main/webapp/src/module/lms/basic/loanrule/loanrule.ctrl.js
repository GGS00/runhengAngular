/**
 * 贷款规则控制器
 */
angular.module('MetronicApp').controller('loanRuleController',
    ['$rootScope', '$scope','$http','uiGridConstants', 'settings','loanRule','commonUtil','Table', function ($rootScope, $scope, $http, uiGridConstants, settings, loanRule, commonUtil, Table) {
        $scope.$on('$viewContentLoaded', function () {
            App.initAjax(); // initialize core components
        });
        $rootScope.settings.layout.pageContentWhite = true;
        $rootScope.settings.layout.pageBodySolid = false;
        $rootScope.settings.layout.pageSidebarClosed = false;
        var vm = this;
        vm.menuLen = 4;
        vm.pageParams = {
            bean: 'lmsLoanRule',
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
                field: 'code',
                displayName: '编码',
                width: '10%'
            },
            {
                field: "name",
                displayName: '名称',
                width: '13%'
            },
            {
                field: "status",
                displayName: '状态',
                width: '10%',
                cellTemplate:'<div style="padding:5px">{{row.entity.status=="ACTIVE"?"生效":(row.entity.status=="INVALID"?"失效":"")}}</div>'
            },
            {
                field: "year_interest",
                displayName: '月利率',
                width: '10%'
            },
            {
                field: "discount_rate",
                displayName: '折扣率',
                width: '10%'
            },
            {
                field: "notice_mail",
                displayName: '通知邮箱',
                width: '20%'

            },
            {
                field: "days_of_year",
                displayName: '一年天数',
                width: '10%',
            },
            {
                field: "apply_deadline",
                displayName: '申请截止时间',
                width: '12%'
            },
            {
                field: "cutoff_date",
                displayName: '截单时间',
                width: '12%'
            },
            {
                field: "mon_payment_days",
                displayName: '周一放贷期限(天)',
                width: '10%'
            },
            {
                field: "tues_payment_days",
                displayName: '周二放贷期限(天)',
                width: '10%'
            },
            {
                field: "wed_payment_days",
                displayName: '周三放贷期限(天)',
                width: '10%'
            },
            {
                field: "thu_payment_days",
                displayName: '周四放贷期限(天)',
                width: '10%'
            },
            {
                field: "fri_payment_days",
                displayName: '周五放贷期限(天)',
                width: '10%'
            },
            {
                field: "sat_payment_days",
                displayName: '周六放贷期限(天)',
                width: '10%'
            },
            {
                field: "sun_payment_days",
                displayName: '周日放贷期限(天)',
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
                width: '22%'
            },
            {
                field: "last_operator",
                displayName: '最后修改人',
                width: '10%'
            },
            {
                field: "last_operated_time",
                displayName: '最后修改时间',
                width: '18%'
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



        //新建贷款规则
        vm.newLoanRule =function () {
            window.location.href = "#/lms/basic/loanrule/add";
        }

        /*生效*/
        vm.operateEffect = function () {
            vm.selectListActive = [];
            if (vm.entity.getSelectedRows().length == 0) {
                msgAlert.info('请先选择要生效的贷款规则');
                return false;
            } else {
                for(var i = 0 ; i < vm.entity.getSelectedRows().length ; i++){
                    if(vm.entity.getSelectedRows()[i].status =='ACTIVE'){

                        msgAlert.info('选中的数据包含已经生效的贷款规则，请小心勾选');
                        return false;

                    }

                }

                for(var i = 0 ;i < vm.entity.getSelectedRows().length ; i++){
                    vm.selectListActive.push(vm.entity.getSelectedRows()[i].id);
                }
                loanRule.activeBatch(vm).success(function(data) {

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
                msgAlert.info('请先选择要失效的贷款规则');
                return false;
            }
            else{
                for(var i = 0 ; i < vm.entity.getSelectedRows().length ; i++){
                    if(vm.entity.getSelectedRows()[i].status =='INVALID'){
                        msgAlert.info('选中的数据包含已经失效的贷款规则，请小心勾选');
                        return false;

                    }

                }

                for(var i = 0 ;i < vm.entity.getSelectedRows().length ; i++){
                    vm.selectListActive.push(vm.entity.getSelectedRows()[i].id);
                }
                loanRule.batchInvalid(vm).success(function(data) {

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
        vm.updateLoanRule = function () {
            if(vm.entity.getSelectedRows().length == 0){

                msgAlert.text('请先选择要修改的贷款规则');
                return false;

            }else if(vm.entity.getSelectedRows().length > 1){

                msgAlert.text('每次只能修改一条贷款规则');

            }else{

                window.location.href = "#/lms/basic/loanrule/update?id="+vm.entity.getSelectedRows()[0].id;
            }
        };



        vm.getPageByFilter = function(){
            var code = $('input[name="code"]').val();
            var status = $('#id_status').val();
            if(status == " "){
                status ="";
            }
            var name =  $('input[name="name"]').val();
            if(name == " "){
                name ="";
            }

            if(code == "" && name == "" && status == ""){
                msgAlert.info('搜索条件不能为空');
                return false;
            }
            vm.pageParams = {
                code:code,
                status:status,
                name:name,
                bean:'lmsLoanRule',
                method:'page',
                page:1,
                rows:10
            }
            vm.getPage();
        }

    }])



