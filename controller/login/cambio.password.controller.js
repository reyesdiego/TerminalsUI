/**
 * Created by Artiom on 11/03/14.
 */

class ChangePassCtrl {

	constructor(authFactory, dialogs, $state){
		this._authFactory = authFactory;
		this._dialogs = dialogs;
		this._$state = $state;

		this.email = '';
		this.password = '';

		this.newPass = '';
		this.confirmPass = '';

	}

	changePass(){
		if (this.newPass != this.confirmPass){
			this._dialogs.notify('Cambiar contraseña', 'Las contraseñas no coinciden');
			return;
		}

		const formData = {
			"email": this.email,
			"password": this.password,
			"newPass": this.newPass,
			"confirmPass": this.confirmPass
		};

		this._authFactory.cambiarContraseña(formData).then((response) => {
			this.codStatus = response.data.data;
			const dl = this._dialogs.notify('Cambio de contraseña', this.codStatus);
			dl.result.then(() => {
				this._$state.transitionTo('login');
			})
		}).catch((error) => {
			this._dialogs.error('Cambio de contraseña', error.data.message);
		});
	}
}

ChangePassCtrl.$inject = ['authFactory', 'dialogs', '$state'];

myapp.controller('changePassCtrl', ChangePassCtrl);