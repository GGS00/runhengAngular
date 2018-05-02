
/* Setup blank page controller */
angular.module('MetronicApp').controller('OrgnizationController', ['$rootScope','$http', '$scope', '$log','System','CONSTANT','commonUtil', function($rootScope,$http,$scope,$log,System,CONSTANT,commonUtil) {
    $scope.$on('$viewContentLoaded', function() {
        // initialize core components
        App.initAjax();

        // set default layout mode
        $rootScope.settings.layout.pageContentWhite = true;
        $rootScope.settings.layout.pageBodySolid = false;
        $rootScope.settings.layout.pageSidebarClosed = false;


    });
    var oldbox;
    $scope.orgform = {}
    $scope.orgEditform = {}
    $scope.form = {}
    $scope.editForm = {};
    $scope.bisType = CONSTANT.BIS_TYPE
    $scope.form.type = $scope.bisType[0].type
    $scope.sexType = CONSTANT.SEX_TYPE
    $scope.treeData = []


    createTree()
    function createTree() {
        System.getOrg().success(function (data) {
            oldbox = data.data;
            var row =  new Array();
            row.push({"id":0,"parent":"#","text":"根节点"})
            if(oldbox != null){
                for(var i=0;i<oldbox.length;i++){
                    row.push({"id":oldbox[i].orgId,"parent":oldbox[i].orgParentId,"text":oldbox[i].orgName})
                }
            }

            $scope.treeData = row;
            $scope.reCreateTree()
        })
    }




    //树配置
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
        plugins: ["contextmenu", "search",
            "state", "types", "wholerow"],
        contextmenu: {
            "items": {
                "create": {
                    "label": "新建部门",
                    "action": showAdd
                },
                "edit": {
                    "label": "修改部门",
                    "action": showEdit
                },
                "addUser": {
                    "label": "添加用户",
                    "action": showUserAdd
                },
                "del": {
                    "label": "删除",
                    "action": showDel
                },
            }
        }
    }

    $scope.treeObject ={
        'select_node':select_node,
    }

    //选择节点发生的操作
    function select_node() {
        $scope.clickedNode =  $scope.treeInstance.jstree().get_selected(true)[0]
        $scope.params ={
            bean:'umsEmployee',
            method:'pageGetEmployees',
            page:1,
            rows:10,
            orgId:$scope.clickedNode.id
        }
        $scope.getList()
        console.log(123)
        $scope.orgform.orgParentId =  $scope.clickedNode.id
        $scope.form.orgId =  $scope.clickedNode.id

        for(var key in $scope.treeData){
            // if($scope.clickedNode.parent !=0){
                if ($scope.treeData[key].id == $scope.clickedNode.parent) {
                    $scope.clickedParent = $scope.treeData[key]
                    console.log($scope.clickedParent)
                }
            // }
        }

    }

    //获取用户列表
    $scope.getList = function() {
        commonUtil.getList($scope.params).success(function (data) {
            $scope.data = data
        })
    }

    //树增删改
    function showAdd() {
        $("#showAdd").modal('show')
    }

    function showDel() {
        $("#showDel").modal('show')
    }
    function showEdit() {
        // System.funcGroup().success(function (data) {
        //     $scope.func = data.data
        // })
        // System.sysId().success(function (data) {
        //     $scope.sysId = data.data
        // })

        for(var key in oldbox){
            if (oldbox[key].orgId == $scope.clickedNode.id) {
                $scope.orgEditform = oldbox[key]
            }
        }
        $("#showEdit").modal('show')
    }



    $scope.reCreateTree = function() {
        $scope.treeConfig.version++;
    }

    $scope.addNode = function(){
        System.addOrg($scope.orgform).success(function (data) {
            if(data.status == 00){
                createTree();
                $("#showAdd").modal('hide')
            }else{
                $("#showAdd").modal('hide')
                msgAlert.text(data.msg);
            }
        })

    }
    $scope.editNode = function () {
        System.editOrg($scope.orgEditform).success(function (data) {
            if(data.status == 00){
                createTree();
                $("#showEdit").modal('hide')
            }else{
                $("#showEdit").modal('hide')
                msgAlert.text(data.msg);
            }
        })
    }
    $scope.delNode = function () {
        System.delOrg($scope.clickedNode.id).success(function (data) {
            if(data.status == 00){
                createTree();
                $("#showDel").modal('hide')
            }else{
                $("#showDel").modal('hide')
                msgAlert.text(data.msg);
            }
        })
    }





    //表格配置
    $scope.column = [{ field: 'empId',
        displayName: 'id',
        visible: false,
        enableCellEdit: true,
        enableCellEditOnFocus:false
    },
        {  field: "userName",
            displayName: '账号',
            width:150,
            enableCellEdit: true,
            enableCellEditOnFocus:true
        },
        {  field: "realName",
            displayName: '真实姓名',
            width:150,
            enableCellEdit: true,
            enableCellEditOnFocus:true,
            width:150
        },
        {  field: "orgName",
            displayName: '所属部门',
            width:150,
            enableCellEdit: true,
            enableCellEditOnFocus:true,
        },
        {  field: "roleName",
            displayName: '角色',
            width:150,
            enableCellEdit: true,
            enableCellEditOnFocus:true
        },
        {  field: "mobile",
            displayName: '手机',
            width:150,
            enableCellEdit: true,
            enableCellEditOnFocus:true
        },
        {  field: "email",
            displayName: '邮箱',
            width:150,
            enableCellEdit: true,
            enableCellEditOnFocus:true
        },
        { name:'操作',
            width:150,
            cellTemplate:'<button class ="btn green" ng-click ="grid.appScope.$parent.showUserEdit(row.entity)">编辑</button><button class ="btn red" ng-click ="grid.appScope.$parent.showUserDel(row.entity.empId)">删除</button>'
        }
    ];


    //用户增删改
    function showUserAdd () {
        $scope.form.userType = 0;
        $scope.form.belongTo = 0;
        System.getRole().success(function (data) {
            if(data.rows.length >0){
                $scope.roleList = data.rows
                $scope.form.roleId =  $scope.roleList[0].roleId
            }

        })
        $('#showUserAdd').modal('show')
    }
    $scope.showUserEdit = function (row) {
        System.getRole().success(function (data) {
            if(data.rows.length >0){
                $scope.roleList = data.rows
                $scope.form.roleId =  $scope.roleList[0].roleId
            }

        })
        $scope.formEdit = angular.copy(row)
        $('#showUserEdit').modal('show')
    }
    $scope.showUserDel = function (id) {
        $('#showUserDel').modal('show')
        $scope.delEmylee = function () {
            System.delEmylee(id).success(function (data) {
                if(data.status == 00){
                    $scope.getList();
                    $('#showUserDel').modal('hide')
                }else{
                    msgAlert.text(data.msg);
                    $('#showUserDel').modal('hide')
                }
            })
        }
    }

    $scope.addEmylee = function () {
        var namereg = /^(?![0-9]*$)[a-zA-Z0-9]{4,20}$/;
        if ($scope.form.userName == null)
        {
            msgAlert.text("请填写用户名")
            return;
        }
        if($scope.form.userName.match(namereg) == null){
            msgAlert.text('登入名必须为字母+数字/纯字母/大于4个字');
            return;
        }
        if ($scope.form.password == null)
        {
            msgAlert.text("请填写用户密码")
            return;
        }
        if ($scope.form.realName == null)
        {
            msgAlert.text("请填写用户真实姓名")
            return;
        }
        $scope.form.password = encryptedString(bodyRSA(), encodeURIComponent($scope.form.password));
        System.addEmylee($scope.form).success(function (data) {
            if(data.status == 00){
                $scope.getList();
                $('#showUserAdd').modal('hide')
            }else{
                msgAlert.text(data.msg);
                $('#showUserAdd').modal('hide')
                $scope.form.password =""
            }
        })
    }

    $scope.editEmylee = function () {
        delete $scope.formEdit.addTime;
        delete $scope.formEdit.lastLoginTime;
        delete $scope.formEdit.errLoginDate;
        System.editEmylee($scope.formEdit).success(function (data) {
            if(data.status == 00){
                $scope.getList();
                $('#showUserEdit').modal('hide')
            }else{
                msgAlert.text(data.msg);
                $('#showUserEdit').modal('hide')
            }
        })
    }


    function bodyRSA(){
        setMaxDigits(130);
        var key = new RSAKeyPair("10001","","f5e769a799b21ffb5eb358006f110e3653eaf7ade25e764fb722c912fa049156ea851a4929428059cddbc269cd868bc089df30fb22bcb89b79c965f4fee81c516a147b777c5361d63d11e8504b0a416f8cf69f7e810ced126137911010fb72e15ba2d700fcb8663a64e6bffcece7c45d7414a795281420f508387b6017b56037");
        return key
    }




}]);
/**
 * Created by sq on 2017/3/23.
 */
