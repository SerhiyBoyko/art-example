var maps_data = [];

function loadMaps(){
	var functions_length = maps_data.length;

	for(var i=0;i<functions_length;i++){
		maps_data[i]();
	}
}

var map,
	map_data = {},
	marker_icon,
	latlngbounds;

/*  Google Maps  */
(function($){
	$.GoogleMaps = function(options){
		var options = jQuery.extend({
			map : false, //или DOM
			/* if map DOM */
			center : {lat:55.753395, lng:37.616844},
			locations : [], //{lat:0.00, lng:0.00, info:'', },...
			zoom : 11,
			styles:[],
			fitBounds:true,
			addPlaces:false,
			scrollwheel:true,
			disableDefaultUI: false,
			disableAutoPan: false,
			animation : false,
			update : false,
			icon : 0,
			setLocation : false //функция после установки маркера на карту
		}, options);

		marker_icon = options.icon;

		if(options.update){
			map.set('styles', options.styles);

			for(var i in map_data){
				map_data[i].info.close();
				map_data[i].marker.setMap(null);
			}
			map_data = {};
			latlngbounds = new google.maps.LatLngBounds();

			insertMarkers();

			return;
		}

		/*  массив маркеров  */
		map_data = {};
		latlngbounds = new google.maps.LatLngBounds();
		function insertMarkers(){
			var locations_length = options.locations.length,
				inserted_locations = 0,
				location,
				location2;


			for(var i=0; i<locations_length;i++){
				if(options.locations[i].lat.length>0 && options.locations[i].lng.length>0){
					var info = options.locations[i].info!==undefined ? options.locations[i].info : false;
					/*  если значение координат НЕ пустые - устанавливаем маркер на карту  */
					location = new google.maps.LatLng(options.locations[i].lat, options.locations[i].lng);
					//location2 = new google.maps.LatLng(options.locations[i].lat*1-0.04 , options.locations[i].lng*1-0.3);

					map_data[i] = addMarker(location, map, info);
					if(options.fitBounds){
						map.setZoom(options.zoom);
					}
					inserted_locations++;
				}
			}
			if(options.fitBounds){
				if(inserted_locations>1){
					map.fitBounds(latlngbounds);
				}else if(inserted_locations==1){
					//map.panTo(location);
				}
			}

			$(window).on('resize', function() {
				var center = map.getCenter();
				google.maps.event.trigger(map, "resize");
				//map.setCenter(center);
			});
		}

		/*  если нужно отобразить карту  */
		if(options.map!==false){
			var show_map = function(){
				/*  опции карты  */
				var mapOptions = {
					center: new google.maps.LatLng(options.center.lat, options.center.lng),
					scrollwheel:options.scrollwheel,
					disableDefaultUI:options.disableDefaultUI,
					zoom: options.fitBounds ? options.zoom : 4,
					mapTypeControl: false,
					styles: options.styles,
					mapTypeId: google.maps.MapTypeId.ROADMAP
				};
				map = new google.maps.Map(options.map[0], mapOptions);

				if(options.addPlaces){
					var placesControlDiv = document.createElement('div'),
						placesControl = new PlacesControl(options.addPlaces, placesControlDiv, map);

					placesControlDiv.index = 1;
					map.controls[google.maps.ControlPosition.TOP_CENTER].push(placesControlDiv);
				}


				/*google.maps.event.addListenerOnce(map, 'tilesloaded', function(){
				 if($('body.full_map').length>0){
				 options.map.find('.gm-style > div.gmnoprint').last().css({'margin-top':'30px', 'margin-left':'30px'});
				 }
				 });*/

				/*  если путем клика можно устанавливать координату и маркер на карту   */
				if(options.setLocation!==false){
					google.maps.event.addListener(map, 'click', function(event){
						clearMarkers();

						/*  добавляем маркер  */
						map_data[0] = addMarker(event.latLng, map, false);
						/*  устаналвиваем координаты в текстовые поля  */
						options.setLocation(event.latLng.lat(), event.latLng.lng());
					});
				}

				insertMarkers();
			};

			show_map();
		}


		function clearMarkers(){
			for(var i in map_data){
				map_data[i].marker.setMap(null);

				delete map_data[i];
			}

			latlngbounds = new google.maps.LatLngBounds();
		}

		function addMarker(location, map, info){
			var image = {
					url: "/images/map_marker_icon.png",
					size: new google.maps.Size(60, 60),
					origin: new google.maps.Point(0, 0),
					anchor: new google.maps.Point(30, 30)
				},
				marker = new google.maps.Marker({
					position: location,
					icon: image,
					map: map,
					animation: options.animation ? google.maps.Animation.DROP : null
				});

			//map.panTo(location);


			if(options.setLocation!==false){
				marker.setDraggable(true);

				google.maps.event.addListener(marker, 'position_changed', function(event){
					/*  устаналвиваем координаты в текстовые поля  */
					options.setLocation(marker.getPosition().lat(), marker.getPosition().lng() );
				});
			}else{
				var infoWindow = new google.maps.InfoWindow({disableAutoPan: options.disableAutoPan, maxWidth:340 });

				if(info!=false){
					infoWindow.setContent(info);

					google.maps.event.addListener(marker, 'click', function(){
						for(var i in map_data){
							map_data[i].info.close();
						}

						infoWindow.open(map, marker);
					});
					google.maps.event.addListener(map, 'click', function() {
						infoWindow.close();
					});
				}
			}

			latlngbounds.extend(new google.maps.LatLng(location.lat(), location.lng()));


			return {marker:marker, info:infoWindow};
		}
	}
})(jQuery);