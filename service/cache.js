/**
 * Created by leo on 11/03/15.
 */
myapp.service('generalCache', ['CacheFactory', function (CacheFactory) {
	return CacheFactory.createCache('generalCache', { storageMode: 'localStorage' });
}]);

myapp.service('estadosArrayCache', ['CacheFactory', function (CacheFactory) {
	return CacheFactory.createCache('estadosArrayCache', { storageMode: 'localStorage' })
}]);

myapp.service('unitTypesArrayCache', ['CacheFactory', function (CacheFactory) {
	return CacheFactory.createCache('unitTypeArrayCache', { storageMode: 'localStorage' });
}]);

myapp.service('vouchersArrayCache', ['CacheFactory', function (CacheFactory) {
	return CacheFactory.createCache('vouchersArrayCache', { storageMode: 'localStorage' });
}]);

myapp.service('contenedoresCache', ['CacheFactory', function (CacheFactory) {
	return CacheFactory.createCache('contenedoresCache');
}]);

myapp.service('colorTerminalesCache', ['CacheFactory', function (CacheFactory) {
	var serv = CacheFactory.createCache('colorTerminalesCache', { storageMode: 'localStorage' });

	var styles=document.styleSheets;
	for(var i=0,l=styles.length; i<l; ++i){
		var sheet=styles[i];
		var rules, rule, j, l2;
		if(sheet.title === "BACTSSA"){
			rules=sheet.cssRules;
			for(j=0, l2=rules.length; j<l2; j++){
				rule=rules[j];
				if('.navbar-default' === rule.selectorText){
					serv.put('Bactssa', rule.style['backgroundColor']);
				}
			}
		}
		if(sheet.title === "TRP"){
			rules=sheet.cssRules;
			for(j=0, l2=rules.length; j<l2; j++){
				rule=rules[j];
				if('.navbar-default' === rule.selectorText){
					serv.put('Trp', rule.style['backgroundColor']);
				}
			}
		}
		if(sheet.title === "TERMINAL4"){
			rules=sheet.cssRules;
			for(j=0, l2=rules.length; j<l2; j++){
				rule=rules[j];
				if('.navbar-default' === rule.selectorText){
					serv.put('Terminal4', rule.style['backgroundColor']);
				}
			}
		}
	}

	return serv;
}]);