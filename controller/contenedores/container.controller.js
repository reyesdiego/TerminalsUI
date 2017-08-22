/**
 * Created by kolesnikov-a on 17/08/2017.
 */
class ContainerCtrl {
	constructor($state){
		this.search = '';
		this.container = null;
		this.router = $state;
	}

	cargarContenedor(){
		this.router.go("container.detail", {containerId: this.search});
	}

}

ContainerCtrl.$inject = ['$state'];

myapp.controller('containerCtrl', ContainerCtrl);