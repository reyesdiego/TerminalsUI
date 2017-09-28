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

    $scope.reverse = false;

    $scope.ocultarFiltros = ['campo'];

    $scope.mensajeResultado = {
        titulo: 'Reporte contenedores',
        mensaje: 'Selecciones los parámetros deseados y presione "Buscar" para generar el reporte.',
        tipo: 'panel-info'
    };

    $scope.cargando = false;

    $scope.resultados = [];

    function cargarReporte(){
        $scope.reverse = ($scope.model.order == -1);
        $scope.cargando = true;
        reportsFactory.getReporteContainers($scope.model).then(data => {
            $scope.resultados = data;
        }).catch(error => {
            $scope.resultados = [];
            $scope.mensajeResultado = {
                titulo: 'Error',
                mensaje: `Se produjo un error al cargar los datos del reporte.\n${error.message}`,
                tipo: 'panel-danger'
            };
        }).finally(() => {
            $scope.cargando = false;
        });
    }

    $scope.$on('iniciarBusqueda', () => {
        cargarReporte();
    });

}]);