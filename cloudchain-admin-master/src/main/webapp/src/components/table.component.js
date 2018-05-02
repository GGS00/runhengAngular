angular
    .module('MetronicApp')
    .component('tableExpandable', {
        templateUrl: '/dist/tpl/components/table.view.html',
        controller: 'TableExpandableCtrl',
        controllerAs: 'table',
        bindings: {
            tableColumn: '=',
            tablePage: '&',
            tableData:'<',
            searchSwitch: '=',
            tableConf:'=',
            selfPage:'=',
            entity:'=',
        }
    })
    .controller('TableExpandableCtrl', TableExpandableCtrl)
    .service('Table', Table)

TableExpandableCtrl.$inject = ['$timeout','$scope','uiGridConstants','$log','i18nService','Table'];


function TableExpandableCtrl($timeout,$scope,uiGridConstants,$log,i18nService,Table) {
    var vm = this;
    $scope.lang = 'zh-cn';
    vm.selfPage == undefined?vm.selfPage =false:vm.selfPage;
    $scope.pages = [10,20,30];
    $scope.searchSwitch = vm.searchSwitch;

    vm.$onChanges = function (changes) {
        vm.tableData = changes.tableData.currentValue;
        if(vm.tableData){
            if(vm.tableData.rows == null){
                vm.tableData.rows = [];
            }
            $scope.gridOptions.data= vm.tableData.rows;
            $scope.gridOptions.totalItems = vm.tableData.total;
            $scope.maxPage =  Math.ceil($scope.gridOptions.totalItems/vm.tableConf.rows);
        }

    };


    $scope.gridOptions = {
        columnDefs:vm.tableColumn,
        enableGridMenu:true,

        enableFullRowSelection:vm.selfPage,
        multiSelect: !vm.selfPage,

        useExternalPagination: true,
        enablePagination: vm.selfPage, //是否分页，默认为true
        enablePaginationControls: vm.selfPage, //使用默认的底部分页
        paginationPageSizes: $scope.pages, //每页显示个数可选项
        paginationCurrentPage:1, //当前页码
        paginationPageSize: 10 , //每页显示个数
        enableColumnResizing:true
};

    $scope.gridOptions.onRegisterApi = function(gridApi) {
         $scope.gridApi = gridApi;
         vm.entity = $scope.gridApi.selection;
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


    vm.gotoPageNum = 1;
    vm.toPage = function(){
        if(vm.gotoPageNum  > $scope.maxPage){
            msgAlert.text("大于最大页数")
        }else{
            vm.tableConf.page = vm.gotoPageNum;
            vm.tablePage();
        }
    }


}


function Table(){
    var rows = "";
    return {
        setSelect: function(value) {
            rows = value;
        },
        getSelect: function () {
            return rows
        },

    }

}
