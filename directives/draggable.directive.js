/**
 * Created by kolesnikov-a on 02/08/2017.
 */
myapp.directive('dragMe', function(){
	return (scope, element) => {
		const el = element[0];

		el.addEventListener('dragstart', (e) => {
			scope.$apply(() => {
				scope.$emit('dragstart');
			});

			console.log('empieza el drag');
			e.dataTransfer.effectAllowed = 'copy';
			e.dataTransfer.setData('Text', el.id);
			console.log(this);
			el.classList.add('drag');
			return false;
		}, false);

		el.addEventListener('dragend', (e) => {
			el.classList.remove('drag');
			return false;
		}, false);

	}
});