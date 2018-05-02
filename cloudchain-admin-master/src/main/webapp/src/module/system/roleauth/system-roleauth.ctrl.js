angular.module('MetronicApp').controller('OrgRoleController', function($rootScope, $scope, $http, $timeout, $state,$stateParams,System) {
    $scope.$on('$viewContentLoaded', function() {
        App.initAjax(); // initialize core components
        //Layout.setAngularJsSidebarMenuActiveLink('set', $('#sidebar_menu_link_profile'), $state); // set profile link active in sidebar menu
    });

    // set sidebar closed and body solid layout mode
    // $rootScope.settings.layout.pageBodySolid = true;
    // $rootScope.settings.layout.pageSidebarClosed = true;

    var vm = this;
    $scope.form = {}
    $scope.formEdit = {}

    getList()
    function getList() {
        System.getRole().success(function (data) {
            $scope.info = data.rows
        })
    }

    $scope.showAdd = function () {
        // System.sysId().success(function (data) {
        //     $scope.sysIdList = data.data
        //     $scope.form.sysId = data.data[0].sysId
        // })
        $('#showAdd').modal('show')
    }
    $scope.showEdit = function (row) {
        // System.sysId().success(function (data) {
        //     $scope.sysIdList = data.data
        // })
        $scope.formEdit = angular.copy(row)
        $('#showEdit').modal('show')
    }
    $scope.showDel = function (id) {
        $('#showDel').modal('show')
        $scope.delRole = function () {
            System.delRole(id).success(function (data) {
                if(data.status == 00){
                    getList();
                    $('#showDel').modal('hide')
                }else{
                    msgAlert.text(data.msg);
                    $('#showDel').modal('hide')
                }
            })
        }
    }


    $scope.addRole = function () {
        $scope.form.sysId = 1;
        System.addRole($scope.form).success(function (data) {
            if(data.status == 00){
                getList();
                $('#showAdd').modal('hide')
            }else{
                msgAlert.text(data.msg);
                $('#showAdd').modal('hide')
            }
        })
    }

    $scope.editRole = function () {
        $scope.formEdit.sysId = 1;
        System.editRole($scope.formEdit).success(function (data) {
            if(data.status == 00){
                getList();
                $('#showEdit').modal('hide')
            }else{
                msgAlert.text(data.msg);
                $('#showEdit').modal('hide')
            }
        })
    }


    var oldbox

    $scope.showReso = function (row) {

        $scope.treeData = []
        $scope.params = {}
        $scope.params.roleId = row.roleId
        System.getResoList(row.roleId).success(function (data) {
            oldbox = data.rows;
            var row =  new Array();
            $scope.checked = []
            row.push({"id":0,"parent":"#","text":"根节点"})
            for(var i=0;i<oldbox.length;i++){
                row.push({"id":oldbox[i].resoId,"parent":oldbox[i].resoPId,"text":oldbox[i].resoName,state:{checked:oldbox[i].isGet == 1?true:false}})
            }
            $scope.treeData = row;
            $scope.treeInstance.jstree().refresh($scope.treeData)
            $scope.reCreateTree()
            // $scope.treeInstance.jstree().select_node($scope.checked)
        })
        $('#showReso').modal('show')
    }


    $scope.reCreateTree = function() {
        $scope.treeConfig.version++;
    }

    $scope.treeConfig = {
        core: {
            multiple: true,
            animation: true,
            error: function (error) {
                $log.error('treeCtrl: error from js tree - ' + angular.toJson(error));
            },
            check_callback: true,
            worker: true,
        },
        types: {
            default: {
                icon: 'fa fa-flash'
            },
            star: {
                icon: 'fa fa-star'
            },
            cloud: {
                icon: 'fa fa-cloud'
            }
        },
        version: 1,
        plugins: [ "search",
            "state", "types", "wholerow","checkbox"],
        checkbox:{
            tie_selection:false
        }
        // checkbox: {
        //     //"keep_selected_style": true,//是否默认选中
        //     // "three_state": false,//父子级别级联选择
        //     "tie_selection": false
        // },
    }

    $scope.treeObject ={
        'check_node':select_node,
        // 'check_node':function () {
        //     $scope.treeInstance.jstree().check_node($scope.checked)
        // }
    }

    function select_node() {
        $scope.clickedNode =  $scope.treeInstance.jstree().get_checked(true)
    }

    $scope.setRoles = function () {
        var nodes = [];
        for(key in $scope.clickedNode){
            nodes.push($scope.clickedNode[key].id)
        }
        $scope.params.resoIds = nodes
        System.updtRoleResoRel($scope.params).success(function (data) {
            if(data.status == 00){
                $scope.reCreateTree()
                $('#showReso').modal('hide')
            }else{
                msgAlert.text(data.msg);
                $scope.reCreateTree()
                $('#showReso').modal('hide')
            }
        })
    }
    
});

/**
 * Created by sq on 2017/3/16.
 */

