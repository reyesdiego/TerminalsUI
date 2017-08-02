/**
 * Created by kolesnikov-a on 02/08/2017.
 */
myapp.directive('dropHere', function(){
	return {
		scope: {
			drop: '&' //Handler definido por el padre
		},
		link: (scope, element) => {

			const el = element[0];

			el.addEventListener('dragover', (e) => {
				e.dataTransfer.dropEffect = 'copy';
				if (e.preventDefault) e.preventDefault();
				el.classList.add('over');
				return false;
			}, false);

			el.addEventListener('dragenter', (e) => {
				el.classList.add('over');
				return false;
			}, false);

			el.addEventListener('dragleave', (e) => {
				el.classList.remove('over');
				return false;
			}, false);

			el.addEventListener('drop', (e) => {
				const priceId = e.dataTransfer.getData('Text');
				if (e.stopPropagation) e.stopPropagation();

				el.classList.remove('over');

				scope.$apply(() => {
					scope.drop({priceId: priceId});
				});

				return false;
			}, false);
		}
	}
})