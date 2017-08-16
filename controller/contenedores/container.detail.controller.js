/**
 * Created by kolesnikov-a on 16/08/2017.
 */

class ContainerDetail {

	constructor(Container, $stateParams){
		if ($stateParams.container){
			//$scope.model.contenedor = $stateParams.container;
			this.container = new Container({contenedor: $stateParams.container});
			this.cargarDatos();
		}
	}

	cargarDatos(){

	}

}

ContainerDetail.$inject = ['Container', '$stateParams'];


myapp.controller('containerDetailCtrl', ContainerDetail);