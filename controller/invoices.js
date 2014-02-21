/**
 * Created by Diego Reyes on 2/3/14.
 */

function invoicesCtrl ($scope, $dialogs, $templateCache, invoiceFactory) {
	'use strict';

	invoiceFactory.getInvoice(function(data){
		$scope.invoices = data;
	})

	$scope.open = function (factura){
		var dlg = $dialogs.create('view/invoices.detail.html','invoicesModalCtrl',{factura: factura},{key: false, back: 'static'});
		/*dlg.result.then(function(match, method){
			console.log(match);
		},function(){
			console.log("Se eligio cancelar");
		})*/
	}

}
