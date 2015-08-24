/**
 * Created by artiom on 21/08/15.
 */
myapp.controller('facturacionPorEmpresaCtrl', ['$scope', 'controlPanelFactory',
	function($scope, controlPanelFactory){

		$scope.model = {
			mes: '',
			razonSocial: ''
		};

		$scope.resultados =  [];

		$scope.cargarReporte = function(){
			controlPanelFactory.getFacturacionEmpresas($scope.model, function(data){
				console.log(data);
			})
		}
}]);