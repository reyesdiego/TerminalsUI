/**
 * Created by leo on 16/05/14.
 */

myapp.filter('formatCurrency', function(){
	return function(text){
		if (text == 'DOL'){ return 'US$'; }
		else if (text == 'PES') { return 'AR$' }
		else return null;
	}
});

myapp.filter("maxLength", function(){
	return function(text,max){
		if(text != null){
			if(text.length > max){
				return text.substring(0,max);
			}
			else
				return text;
		}
		else
			return null;
	}
});

myapp.filter('startFrom', function() {
	return function(input, start) {
		start = +start; //parse to int
		return input.slice(start);
	}
});