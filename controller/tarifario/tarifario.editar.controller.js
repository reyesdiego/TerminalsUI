    /**
    * Created by Diego Reyes on 1/29/14.
    */

myapp.controller('matchPricesCtrl', ['$scope', 'priceFactory', '$timeout', 'dialogs', 'loginService', '$filter', 'cacheService', '$state', 'Price', 'generalFunctions', '$uibModal',
    function($scope, priceFactory, $timeout, dialogs, loginService, $filter, cacheService, $state, Price, generalFunctions, $uibModal) {
        'use strict';

        $scope.dataTerminal = loginService;

        //Array con los tipos de tarifas para establecer filtros
        $scope.tiposTarifas = [
            {nombre: 'AGP', active: true},
            {nombre: 'Servicios', active: false},
            {nombre: 'Propios', active: false},
            {nombre: 'Con match', active: false}
        ];

        $scope.medidas = [
            { value: 20, description: '20 pies' },
            { value: 40, description: '40 pies' }
        ];
        $scope.normas = [
            { value: 'FN', description: 'Fuera de Norma' },
            { value: 'RF', description: 'Reefer' }
        ];

        $scope.newPrice = new Price();

        $scope.filteredPrices = [];
        $scope.listaSeleccionada = [];
        let pricelist = [];

        let pricelistAgp = [];
        let servicios = [];
        let propiosTerminal = [];
        let codigosConMatch = [];

        let matchesTerminal = [];

        $scope.search = "";

        $scope.flagEditando = false;
        $scope.tasas = false;
        $scope.medida = false;
        $scope.norma = false;

        let tipoFiltro = 'AGP';

        $scope.puedeEditar = function(){
            if ($scope.dataTerminal.type == 'agp'){
                return generalFunctions.in_array('modificarTarifario', $scope.dataTerminal.acceso);
            }
        };

        $scope.itemsPerPage = 10;

        $scope.newFrom = new Date();
        $scope.newCurrency = 'DOL';

        $scope.unidadesTarifas = cacheService.cache.get('unitTypes');

        $scope.openFechaTarifa = false;
        $scope.openDate = function($event) {
            $event.preventDefault();
            $event.stopPropagation();
        };

        $scope.$on('cambioPagina', function(event, data){
            $scope.currentPage = data;
            //$scope.pageChanged();
        });

        $scope.$on('errorInesperado', function(e, mensaje){
            $scope.hayError = true;
            $scope.mensajeResultado = mensaje;
            $scope.totalItems = 0;
            pricelist = [];
        });

        $scope.prepararDatos = function(){
            priceFactory.getMatchPrices($scope.tasas, $scope.medida, $scope.norma).then((data) => {
                pricelist = data.data;
                pricelistAgp = [];
                servicios = [];
                codigosConMatch = [];
                propiosTerminal = [];
                matchesTerminal = [];
                //Cargo todos los códigos ya asociados de la terminal para control
                pricelist.forEach((price) => {
                    matchesTerminal.push(price.code);
                    if (price.tarifaAgp) pricelistAgp.push(price);
                    if (price.tarifaTerminal) propiosTerminal.push(price);
                    if (price.servicio) servicios.push(price);
                    if (price.tieneMatch()){
                        codigosConMatch.push(price);
                        matchesTerminal = matchesTerminal.concat(price.getMatches());
                    }
                });
                switch (tipoFiltro){
                    case 'AGP':
                        $scope.listaSeleccionada = pricelistAgp;
                        break;
                    case 'Servicios':
                        $scope.listaSeleccionada = servicios;
                        break;
                    case 'Propios':
                        $scope.listaSeleccionada = propiosTerminal;
                        break;
                    case 'Con match':
                        $scope.listaSeleccionada = codigosConMatch;
                        break;
                }
                $scope.totalItems = $scope.listaSeleccionada.length;
            }).catch((error) => {
                this.hayError = true;
                this.mensajeResultado = {
                    titulo: 'Edición de Tarifario',
                    mensaje: 'Se ha producido un error al cargar los datos del Editor de Tarifario.',
                    tipo: 'panel-danger'
                };
                //dialogs.error('Asociar', 'Se ha producido un error al cargar los datos de códigos asociados. ' + error.data);
                pricelist = [];
                $scope.totalItems = 0;
            });
        };

        $scope.cambiarTarifas = function(tipoTarifa){
            tipoFiltro = tipoTarifa.nombre;
            $scope.tiposTarifas.forEach((unaTarifa) => {
                unaTarifa.active = (unaTarifa.nombre == tipoTarifa.nombre);
            });
            if (tipoTarifa.nombre == 'AGP'){
                $scope.listaSeleccionada = angular.copy(pricelistAgp);
            } else if (tipoTarifa.nombre == 'Servicios'){
                $scope.listaSeleccionada = angular.copy(servicios);
            } else if (tipoTarifa.nombre == 'Propios') {
                $scope.listaSeleccionada = angular.copy(propiosTerminal);
            } else {
                $scope.listaSeleccionada = angular.copy(codigosConMatch);
            }
            $scope.totalItems = $scope.listaSeleccionada.length
        };

        //Verifica que un codigo no se encuentre ya asociado antes de agregarlo
        $scope.checkMatch = function(matchCode){
            //TODO chequear si es posible que asignen a una tarifa, su mismo código como asociado
            matchCode.code = matchCode.code.toUpperCase();
            //return (!$scope.matchesTerminal.contains(matchCode.text))
            return !generalFunctions.in_array(matchCode.code, matchesTerminal);
        };

        $scope.matchAdded = function(matchCode){
            matchesTerminal.push(matchCode.code);
            $scope.newPrice.matchAdded(matchCode);
        };

        $scope.matchRemoved = function(matchCode){
            const index = matchesTerminal.indexOf(matchCode.code);
            matchesTerminal.splice(index, 1);
            $scope.newPrice.matchRemoved(matchCode);
        };

        $scope.abrirNuevoConcepto = function(tipo){
            if (!(tipo == 'editar')){
                $scope.newPrice = new Price();
                if (loginService.type == 'terminal') $scope.newPrice.tarifaTerminal = true;
            }
            $scope.flagEditando = (tipo == 'editar');
            $state.transitionTo('modificarTarifario');
        };

        //Guarda los cambios realizados sobre una tarifa
        $scope.savePrice = function(){
            if (verificarEditado()){
                const dlg = dialogs.confirm('Guardar', 'Se guardarán todos los cambios realizados sobre la tarifa, ¿confirma la operación?');
                dlg.result.then(() => {
                    $scope.newPrice.unit = String($scope.newPrice.idUnit);
                    $scope.newPrice.saveChanges().then(() => {
                        cacheService.actualizarMatchesArray(loginService.filterTerminal);
                        dialogs.notify("Asociar","Los cambios se han guardado exitosamente.");
                        $scope.prepararDatos();
                        $state.transitionTo('matches');
                    }).catch(() => {
                        dialogs.error('Asociar', 'Se ha producido un error al intentar guardar los cambios.');
                    });
                }).catch();
            }
        };

        $scope.enableEdition = function(){
            if ($scope.flagEditando){
                if ($scope.dataTerminal.type == 'terminal'){
                    return $scope.newPrice.terminal == loginService.filterTerminal;
                } else {
                    return $scope.newPrice.tipoTarifa == 'A' || $scope.newPrice.tipoTarifa == 'S';
                }
            } else {
                return true;
            }
        };

        //Carga la tarifa completa antes de poder editarla
        $scope.editarTarifa = function(tarifa){
            let indice = 0;
            pricelist.forEach((price) => {
                if (price.code == tarifa.code) $scope.posicionTarifa = indice;
                indice++;
            });

            tarifa.getTopPrices().then(() => {
                $scope.newPrice = tarifa;
                $scope.abrirNuevoConcepto('editar');
            }).catch((error) => {
                dialogs.error('Error', 'Se ha producido un error al cargar los datos de la tarifa.');
            });

        };

        $scope.detalleTarifa = function(price, codigo){
            price.getDetailMatch(codigo).then(data => {
                $scope.detalleMatch = data;
                $uibModal.open({
                    templateUrl: 'view/tarifario/detalle.codigo.modal.html',
                    scope: $scope
                });
            }).catch()
        };

        //Verifica que al modificar un código no coincida con otro ya existente
        function verificarEditado(){
            let flagCodigo = false;

            //Comparo que con los cambios hechos, no coincida el código con otra tarifa de la lista
            let listaSinCodigo = pricelist.slice();
            if ($scope.flagEditando) listaSinCodigo.splice($scope.posicionTarifa, 1);
            listaSinCodigo.forEach((tarifa) => {
                if ($scope.newPrice.code == tarifa.code){
                    flagCodigo = true;
                }
                if (tarifa.matches != null){
                    tarifa.matches.match.forEach((codigo) => {
                        if (codigo.code == $scope.newPrice.code){
                            flagCodigo = true;
                        }
                    })
                }
            });

            //Si hubo coincidencia muestro mensaje de error
            if (flagCodigo){
                dialogs.error('Error', 'El código de la tarifa no puede coincidir con el de una tarifa existente.');
                return false;
            } else {
                return true;
            }
        };

        //Elimina una tarifa
        $scope.eliminarTarifa = function(){
            const dlg = dialogs.confirm('Eliminar', 'Se eliminará la tarifa, ¿confirma la operación?');
            dlg.result.then(() => {
                $scope.newPrice.removePrice().then((response) => {
                    if (response.status == 'OK'){
                        dialogs.notify("Eliminar","La tarifa ha sido eliminada");
                        $scope.volver();
                    } else {
                        dialogs.error('Asociar', 'Se ha producido un error al intentar eliminar la tarifa. ' + response.data);
                    }
                }).catch((response) => {
                    dialogs.error('Asociar', 'Se ha producido un error al intentar eliminar la tarifa. ' + response.data);
                });
            }).catch();
        };

        //Borra el valor de un campo de la nueva tarifa
        $scope.eraseField = function(field){
            $scope.newPrice[field] = ''
        };

        $scope.volver = function(){
            $scope.prepararDatos();
            $state.transitionTo('matches');
        };

        //Descarga CSV
        $scope.descargarCSV = function(){
            const alterModel = {
                onlyRates: $scope.tasas,
                output: 'csv'
            };

            priceFactory.getMatchPricesCSV(alterModel, (status) => {
                if (status != 'OK'){
                    dialogs.error('Asociar', 'Se ha producido un error al descargar los datos.');
                }
            })
        };

        if (loginService.isLoggedIn) $scope.prepararDatos();

}]);