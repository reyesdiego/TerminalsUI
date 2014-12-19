/**
 * Created by artiom on 19/12/14.
 */
(function(){

	myapp.controller('afipCtrl', function afectacion1Ctrl($scope, afipFactory){

		$scope.datosRegistro = [];
		$scope.currentPage = 1;
		$scope.totalItems = 0;
		$scope.itemsPerPage = 15;
		$scope.page = {
			skip: 0,
			limit: $scope.itemsPerPage
		};

		$scope.$on('cambioPagina', function(event, data){
			$scope.currentPage = data;
			$scope.cargaDatos();
		});

		$scope.cargaDatos = function(registro){
			$scope.cargando = true;
			$scope.page.skip = (($scope.currentPage - 1) * $scope.model.itemsPerPage);
			$scope.page.limit = $scope.model.itemsPerPage;
			$scope.invoices = [];
			afipFactory.getAfip(registro, $scope.page, function(data){
				if(data.status === 'OK'){
					$scope.datosRegistro = data.data;
					$scope.totalItems = data.totalCount;
					$scope.cargando = false;
				}
			});
		}

	})

})();
