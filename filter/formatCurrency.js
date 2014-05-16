/**
 * Created by leo on 16/05/14.
 */

myapp.filter('formatCurrency', function(){
	return function(text){
		if (text == 'DOL'){ return 'U$s'; }
		else if (text == 'PES') { return '$ARG' }
		else return null;
	}
});