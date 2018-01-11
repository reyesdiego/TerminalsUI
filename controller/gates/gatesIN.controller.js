/**
 * Created by leo on 31/03/14.
 */

myapp.controller('gatesINCtrl', ['$scope', 'gatesFactory', 'turnosFactory', 'loginService', 'TERMINAL_COLORS', function ($scope, gatesFactory, turnosFactory, loginService, TERMINAL_COLORS) {

    $scope.totalItems = 0;
    $scope.tiempoConsulta = 0;
    $scope.turnosGates = true;
    //$scope.currentPage = 1;
    $scope.configPanel = {
        tipo: 'panel-info',
        titulo: 'Gates',
        mensaje: 'No se han encontrado gates para los filtros seleccionados.'
    };

    const barColors = {
        "bactssa": TERMINAL_COLORS.BACTSSA,
        "terminal4": TERMINAL_COLORS.TERMINAL4,
        "trp": TERMINAL_COLORS.TRP
    };

    $scope.graphByType = {
        loading: false,
        error: false,
        mensaje: ''
    };
    $scope.gatesTurnos = {
        loading: false,
        error: false,
        mensaje: ''
    };


    // Fecha (dia y hora)
    $scope.fechaInicio = new Date();
    $scope.fechaFin = new Date();
    $scope.fechaInicio.setHours(0, 0);
    $scope.fechaFin.setHours($scope.fechaFin.getHours() + 1, 0);

    // Variable para almacenar la info principal que trae del factory
    $scope.gates = [];
    $scope.detallesGates = false;

    $scope.filtrosGates = ['codTipoComprob', 'nroComprobante', 'razonSocial', 'fechaInicio', 'nroPtoVentaOrden', 'codTipoComprobOrden', 'nroComprobOrden', 'razonOrden', 'fechaOrden', 'importeOrden'];

    $scope.filtrosComprobantes = ['codTipoComprob', 'nroComprobante', 'fechaInicio', 'codigo', 'razonSocial', 'contenedor', 'nroPtoVentaOrden', 'codTipoComprobOrden', 'nroComprobOrden', 'razonOrden', 'fechaOrden', 'importeOrden'];

    $scope.model = {
        'nroPtoVenta': '',
        'codTipoComprob': 0,
        'nroComprobante': '',
        'razonSocial': '',
        'documentoCliente': '',
        'fechaInicio': $scope.fechaInicio,
        'fechaFin': $scope.fechaFin,
        'contenedor': '',
        'buqueNombre': '',
        'viaje': '',
        'estado': 'N',
        'code': '',
        'mov': '',
        'patenteCamion': '',
        'filtroOrden': 'gateTimestamp',
        'filtroOrdenAnterior': 'gateTimestamp',
        'filtroOrdenReverse': true,
        'order': '"gateTimestamp": -1',
        'fechaConGMT': true,
        'carga': '',
        'ontime': '',
        'onlyTrains': false,
        'size': ''
    };

    $scope.page = {
        limit: 10,
        skip:0
    };

    $scope.itemsPerPage = 10;
    $scope.cargando = true;

    $scope.chartGatesByType = {
        options: {
            //title: "Gates por Movimiento",
            width: '100%',
            height: 400,
            //witdh: 600,
            currency: false,
            stacked: false,
            is3D: true,
            colors: [barColors.bactssa, barColors.terminal4, barColors.trp],
            //money: 'PES',
            //id: 2,
            image: null
        },
        data: [
            ['Gate', 'Cantidad']
        ]
    };

    $scope.chartDiaGatesTurnos = {
        options: {
            width: '100%',
            height: '100%',
            series: {3: {type: "line"}},
            currency: false,
            isStacked: true,
            is3D: true,
            colors: [barColors.bactssa, barColors.terminal4, barColors.trp, 'green'],
            id: 5,
            image: null,
            vAxis: {
                title: 'Cantidad de Gates',
                 format: '###'
            }
        },
        data: [
            ['Terminales', 'BACTSSA', 'Terminal 4', 'TRP', 'Promedio', { role: 'annotation'} ]
        ]

    };


    $scope.$on('cambioPagina', function(event, data){
        $scope.currentPage = data;
        $scope.cargaGates();
    });

    $scope.$on('iniciarBusqueda', function (event, data) {
        console.log("vino aca gates.controller");
        $scope.currentPage = 1;
        $scope.cargaGates();
        // $scope.cargaGates(() => { //le pongo un callback por el maldito render
        //     $scope.cargaGatesByTypeGraph();
        //     $scope.traerDatosGatesTurnosDia();
        // });
    });

    $scope.$on('errorInesperado', function(e, mensaje){
        $scope.cargando = false;
        $scope.gates = [];
        $scope.configPanel = mensaje;
    });

    $scope.cargaGates = callback => {
        $scope.cargando = true;
        $scope.page.skip = (($scope.currentPage - 1) * $scope.itemsPerPage);
        $scope.configPanel = {
            tipo: 'panel-info',
            titulo: 'Gates',
            mensaje: 'No se han encontrado gates para los filtros seleccionados.'
        };
        gatesFactory.getGateIN($scope.model, $scope.page).then((data) => {
            $scope.gates = data.data;
            $scope.totalItems = data.totalCount;
            $scope.tiempoConsulta = (data.time / 1000).toFixed(2); //La paso a segundos
        }).catch(() => {
            $scope.gates = [];
            $scope.totalItems = 0;
            $scope.configPanel = {
                tipo: 'panel-danger',
                titulo: 'Gates',
                mensaje: 'Se ha producido un error al cargar los gates.'
            };
        }).finally(() => {
            $scope.cargando = false;
            if (callback) {
                callback();
            }
        });
    };

    // $scope.cargaGatesByTypeGraph = () => {

    //     var base = [
    //         ['Gate', 'Cantidad']
    //     ];
    //     $scope.total = 0;

    //     $scope.graphByType.loading = true;
    //     $scope.chartGatesByType.data = base;

    //     gatesFactory.getGatesByType($scope.model)
    //         .then( data => {
    //             if (data.status === "OK") {
    //                 if (data.data.length > 0) {
    //                     data.data.map(item => {
    //                         base.push([item.mov, item.cnt]);
    //                     });
    //                     $scope.chartGatesByType.data = base;
    //                 }
    //             } else {
    //                $scope.graphByType.error = true;
    //                $scope.graphByType.mensaje = 'Se ha producido un error al cargar los datos de los Gates.';
    //             }
    //             $scope.graphByType.loading = false;
    //         })
    //         .catch(err => {
    //             $scope.graphByType.error = true;
    //             $scope.graphByType.mensaje = 'Se ha producido un error al cargar los datos de los Gates.';
    //             $scope.graphByType.loading = false;
    //         });
    // };

    $scope.getGatesCountByDay = () => {
        gatesFactory.getGatesCountByDay($scope.model)
            .then(data => {
                if (data.status == 'OK'){
                    //console.log(data.data);
                    //$scope.chartDiaGatesTurnos.data = $scope.prepararDatosGatesTurnosDia(graf.data);
                } else {
                    //$scope.gatesTurnos.error = true;
                }
            }).catch(error => {
                console.log(error);
                //$scope.gatesTurnos.error = true;
                //if (error.status != -5){
                //    $scope.gatesTurnos.mensaje = error.data.data.msg;
                //} else {
                //    $scope.gatesTurnos.mensaje = error.data.message;
                //}
            }).finally(() => {
                //$scope.gatesTurnos.loading = false;
            });
    };

    $scope.getTurnosCountByDay = () => {
        turnosFactory.getTurnosByDay($scope.model)
            .then(data => {
                if (data.status == 'OK'){
                    //console.log("TurnosByDay %s", JSON.stringify(data.data));
                    //$scope.chartDiaGatesTurnos.data = $scope.prepararDatosGatesTurnosDia(graf.data);
                } else {
                    //$scope.gatesTurnos.error = true;
                }
            }).catch(error => {
                console.log(error);
                //$scope.gatesTurnos.error = true;
                //if (error.status != -5){
                //    $scope.gatesTurnos.mensaje = error.data.data.msg;
                //} else {
                //    $scope.gatesTurnos.mensaje = error.data.message;
                //}
            }).finally(() => {
                //$scope.gatesTurnos.loading = false;
            });
    };

    $scope.traerDatosGatesTurnosDia = () => {

        $scope.gatesTurnos.error = false;
        $scope.gatesTurnos.loading = true;

        gatesFactory.getGatesByHourMov($scope.model)
            .then((graf) => {
                if (graf.status == 'OK'){
                    $scope.chartDiaGatesTurnos.data = $scope.prepararDatosGatesTurnosDia(graf.data);
                } else {
                    $scope.gatesTurnos.error = true;
                }
            }).catch(error => {
                $scope.gatesTurnos.error = true;
                if (error.status != -5){
                    $scope.gatesTurnos.mensaje = error.data.data.msg;
                } else {
                    $scope.gatesTurnos.mensaje = error.data.message;
                }
            }).finally(() => {
                $scope.gatesTurnos.loading = false;
            });
    };

    $scope.prepararDatosGatesTurnosDia = datosGrafico => {
        let matAux = [];
        matAux[0] = ['Terminales', 'EXPO', 'IMPO', { role: 'annotation'} ];
        let hora;
        for (let i = 0; i <= 23; i++){
            hora = ('0' + i);
            matAux[i+1] = [hora.substr(hora.length-2,2), 0, 0, ''];
        }
        datosGrafico.forEach(datosDia => {
            switch (datosDia.mov){
                case "IMPO":
                    matAux[datosDia.hour+1][2] = datosDia.cnt;
                    break;
                case "EXPO":
                    matAux[datosDia.hour+1][1] = datosDia.cnt;
                    break;
            }
        });
        return matAux;
    };

    $scope.selectRow = (index, id) => {

    };

    if (loginService.isLoggedIn) {
        $scope.cargaGates();
        // $scope.cargaGatesByTypeGraph();
        // $scope.traerDatosGatesTurnosDia();
        // $scope.getGatesCountByDay();
        // $scope.getTurnosCountByDay();
    }

}]);
