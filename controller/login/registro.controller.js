/**
 * Created by artiom on 29/01/15.
 */


class RegisterCtrl {

	constructor($scope, dialogs, authfactory, $state){
		this._dialogs = dialogs;
		this._authFactory = authfactory;
		this._$state = $state;

		this.nombre = '';
		this.apellido = '';
		this.email = '';
		this.password = '';
		this.usuario = '';
		this.confirmPassword = '';
		this.confirmEmail = '';

		this.entidad = '';
		this.role = '';
		this.terminal = '';

		this.validEmail = false;
		this.disableForm = true;

		$scope.$watch(() => ([this.nombre, this.apellido]), () => {
			if (this.nombre != '' && this.apellido != ''){
				this.usuario = (this.apellido + '-' + this.nombre.substr(0, 1)).toLowerCase();
			}
		}, true);

		$scope.$watch(() => ([this.email,this.entidad]), () => {
			if (this.entidad != ''){
				this.disableForm = false;
			}
			const expr = new RegExp(`^([a-zA-Z0-9_\\.\\-])+\\@(${this.entidad})\\.([a-zA-Z0-9]{2,4})+(\\.[a-zA-Z]{2})?$`);
			//var expr = /^([a-zA-Z0-9_\.\-])+\@(bactssa|trp|apmterminals|puertobuenosaires)\.([a-zA-Z0-9]{2,4})+(\.[a-zA-Z]{2})?$/;
			this.validEmail = expr.test(this.email);
			if (this.entidad == 'puertobuenosaires'){
				this.role = 'agp';
				this.terminal = 'AGP'
			} else {
				this.role = 'terminal';
				this.terminal = this.entidad.toUpperCase();
			}
			if (this.entidad == 'apmterminals'){
				this.terminal = 'TERMINAL4';
			}
		}, true);

	}

	register(){
		if (!this.validEmail){
			this._dialogs.error('Error', 'La dirección de correo electrónico ingresada no es válida o no corresponde con la entidad elegida');
			return;
		}
		if (this.email != this.confirmEmail){
			this._dialogs.error('Error', 'Las direccciones de correo electrónico no coinciden');
			return;
		}
		if (this.password != this.confirmPassword){
			this._dialogs.error('Error', 'Las contraseñas ingresadas no coinciden');
			return;
		}
		const formData = {
			lastname: this.apellido,
			firstname: this.nombre,
			full_name: `${this.nombre} ${this.apellido}`,
			email: this.email,
			password: this.password,
			user: this.usuario,
			role: this.role,
			terminal: this.terminal
		};
		this._authFactory.newUser(formData, (data) => {
			if (data.status == 'OK'){
				let dl;
				if (data.emailDeliver){
					dl = this._dialogs.notify('Registro', `El usuario ${this.usuario} ha sido registrado exitosamente. En breve recibirá un mail en la cuenta ${this.email} para poder habilitarlo.`);
					dl.result.then(() => {
						this._$state.transitionTo('login');
					})
				} else {
					dl = this._dialogs.notify('Registro', `El usuario ${$scope.usuario} ha sido registrado exitosamente. Inicie sesión en el sistema para solicitar la validación del mismo.`);
					dl.result.then(() => {
						this._$state.transitionTo('login');
					})
				}
			} else {
				this._dialogs.error('Registro', data.data);
			}
		})
	}
}

RegisterCtrl.$inject = ['$scope', 'dialogs', 'authFactory', '$state'];

myapp.controller('registerCtrl', RegisterCtrl);