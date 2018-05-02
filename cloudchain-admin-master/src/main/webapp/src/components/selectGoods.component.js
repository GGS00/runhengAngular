angular
    .module('MetronicApp')
    .component('selectGoods', {
        templateUrl: '/dist/tpl/components/selectGoods.view.html',
        controller: 'selectGoodsCtrl',
        controllerAs: 'sg',
        bindings: {
            item: '=',
            overClick: '&',
            params:'=',
            column:'=',
            text:'<',
        }
    })
    .controller('selectGoodsCtrl', selectGoodsCtrl)

function selectGoodsCtrl($timeout,$scope,uiGridConstants,commonUtil,Goods) {
    var vm = this;
    function categoryTree() {
        $("#categoryTree").jstree({
            "core" : {
                "themes" : {
                    "responsive": false
                },
                // so that create works
                "check_callback" : true,
            },
            "types" : {
                "default" : {
                    "icon" : "fa fa-folder icon-state-warning icon-lg"
                },
                "file" : {
                    "icon" : "fa fa-file icon-state-warning icon-lg"
                }
            },
            "state" : { "key" : "demo2" },
            "plugins" : ["dnd", "state", "types"]
        })

    }

    Goods.getCategoryList().success(function (data) {
        console.log(data)
        var oldbox = data.data;
        var row =  new Array();

        row.push({"id":0,"parent":"#","text":"全部商品"})
        if(oldbox != null){
            for(var i=0;i<oldbox.length;i++){
                if(oldbox[i].parentCId == 0){
                    row.push({"id":oldbox[i].cId,"parent":"#","text":oldbox[i].name})
                }else{
                    row.push({"id":oldbox[i].cId,"parent":oldbox[i].parentCId,"text":oldbox[i].name})
                }
            }
        }
        categoryTree()
        $("#categoryTree").jstree(true).settings.core.data = row;
        $('#categoryTree').jstree(true).deselect_all();
        $("#categoryTree").jstree(true).refresh('true');
        $("#categoryTree").on('changed.jstree',function(e,data){
            $scope.cIds="";
            var i, j;
            for (i = 0, j = data.selected.length; i < j; i++) {
                var node = data.instance.get_node(data.selected[i]);
                if (data.instance.is_leaf(node)) {
                    if(node.id == 0){
                        node.id = ""
                    }
                    $scope.cIds = node.id;
                    vm.params.cId = $scope.cIds,
                    vm.getList()
                }
            }
        });
    })

    $scope.gridOptions = {
        columnDefs:vm.column,
        enableGridMenu:true,

        enableFullRowSelection:false,
        multiSelect: true,

        useExternalPagination: true,
        enablePagination:false, //是否分页，默认为true
        enablePaginationControls:false, //使用默认的底部分页
        paginationPageSizes: [10,20,30], //每页显示个数可选项
        paginationCurrentPage:1, //当前页码
        paginationPageSize: 10 , //每页显示个数
        enableColumnResizing:true
    };

    $scope.gridOptions.onRegisterApi = function(gridApi) {
        $scope.gridApi = gridApi;
        vm.item = $scope.gridApi.selection;
        /* $scope.gridApi.selection.on.rowSelectionChanged($scope,function(rows){
         if(rows){

         console.log(vm.entity);
         vm.entity =$scope.gridApi.selection.getSelectedRows();
         }
         });*/

        $scope.gridApi.pagination.on.paginationChanged($scope, function (newPage, pageSize) {
            vm.tableConf.page = newPage;
            vm.tableConf.rows = pageSize;
            vm.tablePage();
        });

    };

    vm.getList = function() {
        commonUtil.getList(vm.params).success(function (data) {
            $scope.gridOptions.data = data.rows
            $scope.total = data.total
        })
    }
    vm.getList()

    vm.serachGoods = function () {
        vm.params.skuName = $scope.skuName,
        vm.getList()
    }

}
