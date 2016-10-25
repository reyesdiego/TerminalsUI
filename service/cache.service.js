/**
 * Created by leo on 11/03/15.
 */
myapp.service('generalCache', ['CacheFactory', function (CacheFactory) {
	if (!CacheFactory.get('generalCache')){
		return CacheFactory.createCache('generalCache', { storageMode: 'localStorage' });
	} else {
		return CacheFactory.get('generalCache');
	}
}]);

myapp.service('estadosArrayCache', ['CacheFactory', function (CacheFactory) {
	if (!CacheFactory.get('estadosArrayCache')){
		return CacheFactory.createCache('estadosArrayCache', { storageMode: 'localStorage' })
	} else {
		return CacheFactory.get('estadosArrayCache');
	}
}]);

myapp.service('unitTypesArrayCache', ['CacheFactory', function (CacheFactory) {
	if (!CacheFactory.get('unitTypeArrayCache')){
		return CacheFactory.createCache('unitTypeArrayCache', { storageMode: 'localStorage' });
	} else {
		return CacheFactory.get('unitTypeArrayCache');
	}

}]);

myapp.service('vouchersArrayCache', ['CacheFactory', function (CacheFactory) {
	if (!CacheFactory.get('vouchersArrayCache')){
		return CacheFactory.createCache('vouchersArrayCache', { storageMode: 'localStorage' });
	} else {
		return CacheFactory.get('vouchersArrayCache');
	}

}]);

myapp.service('contenedoresCache', ['CacheFactory', function (CacheFactory) {
	if (!CacheFactory.get('contenedoresCache')){
		return CacheFactory.createCache('contenedoresCache');
	} else {
		return CacheFactory.get('contenedoresCache');
	}
}]);

myapp.service('afipCache', ['CacheFactory', function(CacheFactory){
	if (!CacheFactory.get('afipCache')){
		return CacheFactory.createCache('afipCache', { storageMode: 'localStorage' });
	} else {
		return CacheFactory.get('afipCache');
	}
}]);

myapp.service('colorTerminalesCache', ['CacheFactory', function (CacheFactory) {

	var serv;

	if (!CacheFactory.get('colorTerminalesCache')){
		serv = CacheFactory.createCache('colorTerminalesCache', { storageMode: 'localStorage' });
	} else {
		serv = CacheFactory.get('colorTerminalesCache')
	}

	var styles=document.styleSheets;
	for(var i=0,l=styles.length; i<l; ++i){
		var sheet=styles[i];
		var rules, rule, j, l2;
		if(sheet.title === "TERMINALES"){
			rules=sheet.cssRules;
			for(j=0, l2=rules.length; j<l2; j++){
				rule=rules[j];
				if('.BACTSSA' === rule.selectorText){
					serv.put('Bactssa', rule.style['color']);
				}
				if('.TERMINAL4' === rule.selectorText){
					serv.put('Terminal4', rule.style['color']);
				}
				if('.TRP' === rule.selectorText){
					serv.put('Trp', rule.style['color']);
				}
			}
		}
	}

	return serv;
}]);