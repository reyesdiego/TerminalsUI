/**
 * Created by kolesnikov-a on 17/03/2017.
 */
myapp.service('chartLoader', ['$q', function($q){

	const deferred = $q.defer();

	class Chart {

		constructor(chartType, element, selectFn, readyFn){
			this.type = chartType;

			if (chartType == 'PIE'){
				this.chart = new google.visualization.PieChart(element);
			} else {
				this.chart = new google.visualization.ColumnChart(element);
			}

			google.visualization.events.addListener(this.chart, 'select', selectFn);
			google.visualization.events.addListener(this.chart, 'ready', readyFn);
		}

		drawChart(data, options) {
			let prefijo = '';
			let chartData = new google.visualization.arrayToDataTable(data);

			if (options.currency){
				switch (options.money){
					case 'PES':
						prefijo = 'AR$ ';
						break;
					case 'DOL':
						prefijo = 'US$ ';
						break;
				}

				options.vAxis= {format:prefijo + '###,###,###.##'};
				const formatter = new google.visualization.NumberFormat({
					prefix: prefijo,
					negativeColor: 'red',
					negativeParens: true});
				formatter.format(chartData, 1);
				if (!options.stacked){
					for (let i=2; i<=options.columns; i++)
						formatter.format(chartData, i);
				}
			}

			this.chart.draw(chartData, options);
		}

		get pngImg(){
			const deferred = $q.defer();
			let img = new Image();
			img.onload = () => {
				let canvas = document.createElement('CANVAS'),
					ctx = canvas.getContext('2d'), dataURL;
				canvas.height = img.height;
				canvas.width = img.width;
				ctx.fillStyle = 'white';
				ctx.fillRect(0, 0, canvas.width, canvas.height);
				ctx.drawImage(img, 0, 0);
				dataURL = canvas.toDataURL('image/jpeg');
				deferred.resolve(dataURL);
				canvas = null;
			};
			img.src = this.chart.getImageURI();
			return deferred.promise;
		}

	}

	// Load the Visualization API and the corechart package.
	google.charts.load('current', {'packages':['corechart'], 'language': 'es'});
	// Set a callback to run when the Google Visualization API is loaded.
	google.charts.setOnLoadCallback(() => {
		deferred.resolve(Chart)
	});

	return deferred.promise;

}]);