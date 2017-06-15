/**
 * Created by kolesnikov-a on 15/06/2017.
 */
myapp.controller('reporteContenedorCtrl', ['$scope', 'reportsFactory', function($scope, reportsFactory){

	$scope.ranking = true;

	$scope.model = {
		fechaInicio: new Date(),
		fechaFin: new Date(new Date().getTime() + 24 * 60 * 60 * 1000),
		clients: [],
		terminal: '',
		top: '20',
		campo: 'total',
		order: '-1',
		normalOrder: true
	};

	$scope.ocultarFiltros = ['campo'];

	$scope.mensajeResultado = {
		titulo: 'Reporte contenedores',
		mensaje: 'Selecciones los parámetros deseados y presione "Buscar" para generar el reporte.',
		tipo: 'panel-info'
	};

	$scope.cargando = false;

	$scope.resultados = [];

	function cargarReporte(){
		$scope.cargando = true;
		reportsFactory.getReporteContainers($scope.model).then(data => {
			console.log(data);
			$scope.resultados = data;
			console.log($scope.resultados);
		}).catch(error => {
			console.log('error');
			console.log(error);
		}).finally(() => {
			$scope.cargando = false;
		});
	}

	$scope.$on('iniciarBusqueda', () => {
		cargarReporte();
	});

}]);