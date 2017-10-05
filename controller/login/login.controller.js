    /**
    * Created by Diego Reyes on 1/23/14.
    */
class LoginCtrl {

    constructor($state, loginService, authFactory, dialogs, $uibModal, generalFunctions){
        this._$state = $state;
        this._loginService = loginService;
        this._authFactory = authFactory;
        this._dialogs = dialogs;
        this._$uibModal = $uibModal;
        this._generalFunctions = generalFunctions;

        this.entrando = false;

        this.email = '';
        this.password = '';
        this.sesion = true;

        if (loginService.isLoggedIn){
            if (generalFunctions.in_array('tarifario', loginService.acceso)){
                $state.transitionTo('tarifario');
            } else {
                $state.transitionTo(loginService.acceso[0])
            }
        }
    }

    cerrarSesion(){
        this._authFactory.logout();
        this.entrando = false;
    }

    errorHandler(error) {
        let errdlg;
        if (error.code == 'ACC-0010'){
            errdlg = this._dialogs.error("Error de acceso", "Su usuario ha sido aprobado, pero aún no se le han asignado permisos a las diferentes partes de la aplicación. Por favor, vuelva a intentarlo más tarde.");
            errdlg.result.then(() => this.cerrarSesion());
        } else if (error.code == 'ACC-0003') {
            this._$state.transitionTo('validar');
        } else if (error.code == 'ACC-0001' || error.code == 'ACC-0002' || error.code == 'ACC-0004') {
            errdlg = this._dialogs.error("Error de acceso", error.message);
            errdlg.result.then(() => this.cerrarSesion());
        } else {
            errdlg = this._dialogs.error("Error en servidor", error.message);
            errdlg.result.then(() => this.cerrarSesion());
        }
    }

    login(){
        this.entrando = true;
        this._authFactory.userEnter(this.email, this.password, this.sesion).then(result => {
            if (this._generalFunctions.in_array('tarifario', this._loginService.acceso)) {
                this._$state.transitionTo('tarifario');
            } else {
                this._$state.transitionTo(this._loginService.acceso[0])
            }
        }).catch(error => this.errorHandler(error));
    }

    resetPassword(){
        const modalInstance = this._$uibModal.open({
            templateUrl: 'view/login/reset.password.modal.html',
            controller: 'resetPasswordDialogCtrl',
            backdrop: 'static'
        });
        modalInstance.result.then((email) => {
            this._authFactory.resetPassword(email, (data) => {
                if (data.status == 'OK'){
                    this._dialogs.notify('Recuperación de contraseña', 'Solicitud enviada correctamente. En breve recibirá un correo en la dirección indicada con su nueva contraseña.');
                } else {
                    //console.log(data);
                    this._dialogs.error('Error', 'No se ha encontrado una cuenta asociada a la dirección enviada.')
                }
            })
        });
    }
}

LoginCtrl.$inject = ['$state', 'loginService', 'authFactory', 'dialogs', '$uibModal', 'generalFunctions'];

myapp.controller('loginCtrl', LoginCtrl);