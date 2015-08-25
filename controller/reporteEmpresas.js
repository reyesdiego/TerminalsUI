/**
 * Created by artiom on 21/08/15.
 */
myapp.controller('facturacionPorEmpresaCtrl', ['$scope', 'controlPanelFactory',
	function($scope, controlPanelFactory){

		$scope.model = {
			mes: new Date(),
			razonSocial: ''
		};

		$scope.resultados =  [];

		$scope.cargarReporte = function(){
			controlPanelFactory.getFacturacionEmpresas($scope.model, function(data){
				console.log(data);
			})
		}
}]);