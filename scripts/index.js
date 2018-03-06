'use strict';

import api from './api.js';
import storage from './storage.js'

(function () {
	const app = {
		imageCon: document.getElementById('image-con'),
		googleMap: document.getElementById('map'),
		init() {
			api.init()
				.then(res => {
					console.log(res.results.bindings);

					// console.log(res.results.bindings[0].coordinate_location.value);
					// console.log(11, res.results.bindings[0]);
					// this.initMapGoogle(res);
					this.initMapLeaflet(res);
				});
		},
		initMapGoogle(data) {
			console.log('Google map init');

			const map = new google.maps.Map(document.getElementById('map'), {
				center: { lat: 52.3675, lng: 4.905278 },
				zoom: 8
			});

			data.results.bindings.forEach(item => {
				if (!item.coordinate_location) return;
				const lat = item.coordinate_location.value[1];
				const lng = item.coordinate_location.value[0];
				new google.maps.Marker({
					position: { lat, lng },
					map: map
				});
			})
		},
		initMapLeaflet(data) {
			var mymap = L.map('map')
				.setView([52.3675, 4.905278], 11);

			L.tileLayer('https://{s}.tile.thunderforest.com/pioneer/{z}/{x}/{y}.png', {
				// L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_nolabels/{z}/{x}/{y}.png', {
				maxZoom: 15,
				attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
				// id: 'CartoDB.DarkMatterNoLabels',
				id: 'Thunderforest.Pioneer',
				maxZoom: 15
			}).addTo(mymap);

			// Map the locations on the map
			data.results.bindings.forEach(item => {
				if (!item.coordinate_location) return;
				const lat = item.coordinate_location.value[1];
				const lng = item.coordinate_location.value[0];

				const marker = L.marker([lat, lng], { ...item })
					.addTo(mymap)
					.on('click', function (e) {
						const data = e.target.options;

						if (data.image) {
							app.imageCon.classList.toggle('show');

							console.log(data.image);
							var img = document.createElement('img');
							img.src = data.image.value;
							img.title = data.image.value;
							console.log(img);
							
							app.imageCon.appendChild(img);
							
						}
				})

				// marker.bindPopup(function(e) {
				// 	console.log(e.options);
				// 	const data = e.options;
				// 	// return e.target.churchLabel.value;

				// 	return `
				// 		<h3>${data.churchLabel.value}</h3>
				// 		<img src="${data.image.value}"/>
				// 	`
				// }, {
				// 	closeOnClick: function() {
				// 		console.log('closing');
						
				// 	}
				// });
				
			})

		}
	}

	app.init();
})()

