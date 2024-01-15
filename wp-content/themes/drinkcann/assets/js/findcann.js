document.addEventListener('DOMContentLoaded', function () {
    console.log('find-a-cann script loaded');

    // window._klOnsite = window._klOnsite || [];
    // window._klOnsite.push(['openForm', 'UR8MaH']);

    const getdelivery = document.getElementById("getdelivery")
    const getpickup = document.getElementById("getpickup")
    const map = document.getElementById("map");
    const resultsarea = document.getElementById("resultsarea");
    const resultscount = document.getElementById("resultscount");
    const clear = document.getElementById("clear");

    clear.addEventListener("click", clearScreen);

    getpickup.addEventListener("click", () => {
        document.getElementById("type").value = 2;

        map.classList.remove("inactivemap");
        getpickup.classList.add("opacity-100");
        getdelivery.classList.remove("opacity-100");
        getdelivery.classList.add("opacity-50");
        document.getElementById("pac-input").value = '';
        document.getElementById("dataresults").innerHTML = '';
        document.getElementById('resultsarea').classList.add("hidden");
        document.getElementById('resultscount').innerHTML = 0;
        return false;
    });

    getdelivery.addEventListener("click", () => {
        document.getElementById("type").value = 1;
        document.getElementById("pac-input").value = '';
        document.getElementById("dataresults").innerHTML = '';
        document.getElementById('resultsarea').classList.add("hidden");
        document.getElementById('resultscount').innerHTML = 0;

        map.classList.add("inactivemap");
        getpickup.classList.add("opacity-50");
        getpickup.classList.remove("opacity-100");
        getdelivery.classList.add("opacity-100");

        return false;
    });

    function clearScreen() {
        document.getElementById("dataresults").innerHTML = '';
        document.getElementById('resultsarea').classList.add("hidden");
        document.getElementById('resultscount').innerHTML = 0;
        document.getElementById("pac-input").value = '';
    }

    function clickOutsideElement(element, callback) {
        const stopPropagation = (event) => {
            event.stopPropagation()
        }

        const handleClickOutside = () => {
            document.removeEventListener("click", handleClickOutside)
            element.removeEventListener("click", stopPropagation)
            callback()
        }

        document.addEventListener("click", handleClickOutside)
        element.addEventListener("click", stopPropagation)
    }

    function initMap() {
        console.log(coord);
        const map = new google.maps.Map(document.getElementById("map"), {
        center: {lat: 40.749933, lng: -73.98633},
        zoom: 4,
            mapTypeControl: false,
            styles: [
            {
                "elementType": "geometry",
                "stylers": [
                    {
                        "color": "#f5f5f5"
                    }
                ]
            },
            {
                "elementType": "labels.icon",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "elementType": "labels.text.fill",
                "stylers": [
                    {
                        "color": "#616161"
                    }
                ]
            },
            {
                "elementType": "labels.text.stroke",
                "stylers": [
                    {
                        "color": "#f5f5f5"
                    }
                ]
            },
            {
                "featureType": "administrative.land_parcel",
                "elementType": "labels",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "administrative.land_parcel",
                "elementType": "labels.text.fill",
                "stylers": [
                    {
                        "color": "#bdbdbd"
                    }
                ]
            },
            {
                "featureType": "poi",
                "elementType": "geometry",
                "stylers": [
                    {
                        "color": "#eeeeee"
                    }
                ]
            },
            {
                "featureType": "poi",
                "elementType": "labels.text",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "poi",
                "elementType": "labels.text.fill",
                "stylers": [
                    {
                        "color": "#757575"
                    }
                ]
            },
            {
                "featureType": "poi.business",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "poi.park",
                "elementType": "geometry",
                "stylers": [
                    {
                        "color": "#e5e5e5"
                    }
                ]
            },
            {
                "featureType": "poi.park",
                "elementType": "labels.text.fill",
                "stylers": [
                    {
                        "color": "#9e9e9e"
                    }
                ]
            },
            {
                "featureType": "road",
                "elementType": "geometry",
                "stylers": [
                    {
                        "color": "#ffffff"
                    }
                ]
            },
            {
                "featureType": "road",
                "elementType": "labels.icon",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "road.arterial",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "road.arterial",
                "elementType": "labels.text.fill",
                "stylers": [
                    {
                        "color": "#757575"
                    }
                ]
            },
            {
                "featureType": "road.highway",
                "elementType": "geometry",
                "stylers": [
                    {
                        "color": "#dadada"
                    }
                ]
            },
            {
                "featureType": "road.highway",
                "elementType": "labels",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "road.highway",
                "elementType": "labels.text.fill",
                "stylers": [
                    {
                        "color": "#616161"
                    }
                ]
            },
            {
                "featureType": "road.local",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "road.local",
                "elementType": "labels",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "road.local",
                "elementType": "labels.text.fill",
                "stylers": [
                    {
                        "color": "#9e9e9e"
                    }
                ]
            },
            {
                "featureType": "transit",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "transit.line",
                "elementType": "geometry",
                "stylers": [
                    {
                        "color": "#e5e5e5"
                    }
                ]
            },
            {
                "featureType": "transit.station",
                "elementType": "geometry",
                "stylers": [
                    {
                        "color": "#eeeeee"
                    }
                ]
            },
            {
                "featureType": "water",
                "elementType": "geometry",
                "stylers": [
                    {
                        "color": "#c9c9c9"
                    }
                ]
            },
            {
                "featureType": "water",
                "elementType": "labels.text.fill",
                "stylers": [
                    {
                        "color": "#9e9e9e"
                    }
                ]
            }
        ],

        });
        const input = document.getElementById("pac-input");
        const options = {
            fields: ["formatted_address", "geometry", "name"],
            strictBounds: false,
            types: ["address"],
        };

        const autocomplete = new google.maps.places.Autocomplete(input, options);
        autocomplete.bindTo("bounds", map);

        const infowindow = new google.maps.InfoWindow();
        const infowindowContent = document.getElementById("infowindow-content");
        infowindow.setContent(infowindowContent);

        const marker = new google.maps.Marker({
            map,
            anchorPoint: new google.maps.Point(0, -29),
        });

        autocomplete.addListener("place_changed", () => {

            infowindow.close();
            marker.setVisible(false);

            const place = autocomplete.getPlace();

            if (!place.geometry || !place.geometry.location) {
                //   window.alert("No details available for input: '" + place.name + "'");
                return;
            }

            if (place.geometry.viewport) {
                map.fitBounds(place.geometry.viewport, 240);
                var lat = place.geometry.location.lat();
                var lng = place.geometry.location.lng();


                var xhttp = new XMLHttpRequest();

                xhttp.onreadystatechange = function () {
                    if (this.readyState == 4 && this.status == 200) {
                        document.getElementById('dataresults').innerHTML = this.responseText;
                    }
                };
                var type =   document.getElementById("type").value;
                xhttp.open("POST", "/wp-admin/admin-ajax.php", true);
                xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
                xhttp.send("action=get_location_cards&lat=" + lat + "&lng=" + lng+"&type="+type);

                var xhttplocations = new XMLHttpRequest();

                var pinColor = "#5E609D";
                var pinLabel = "A";
                var pinSVGHole = "M12,11.5A2.5,2.5 0 0,1 9.5,9A2.5,2.5 0 0,1 12,6.5A2.5,2.5 0 0,1 14.5,9A2.5,2.5 0 0,1 12,11.5M12,2A7,7 0 0,0 5,9C5,14.25 12,22 12,22C12,22 19,14.25 19,9A7,7 0 0,0 12,2Z";
                var labelOriginHole = new google.maps.Point(12,15);
                var pinSVGFilled = "M 12,2 C 8.1340068,2 5,5.1340068 5,9 c 0,5.25 7,13 7,13 0,0 7,-7.75 7,-13 0,-3.8659932 -3.134007,-7 -7,-7 z";
                var labelOriginFilled =  new google.maps.Point(12,9);


                var markerImage = {
                    path: pinSVGFilled,
                    anchor: new google.maps.Point(12,17),
                    fillOpacity: 1,
                    fillColor: pinColor,
                    strokeWeight: 2,
                    strokeColor: "#5E609D",
                    scale: 2,
                    labelOrigin: labelOriginFilled
                };

                xhttplocations.onreadystatechange = function () {

                    if (this.readyState == 4 && this.status == 200) {

                        if(this.responseText =='0') {

                            /*document.body.classList.add('gate--open');
                            const modal = document.querySelector("[data-js-unavailable-modal]");
                            const modalZipCode = document.querySelector("[data-js-zip-code-modal]");
                            if (modal) {
                                modal.classList.add('is-open');
                                if (modalZipCode) {
                                    const gateModal = document.querySelector("[data-js-gate-modal]")
                                    if (gateModal) {
                                        gateModal.style.backgroundColor = null
                                    }
                                    modalZipCode.classList.remove('is-open');
                                }
                                clickOutsideElement(modal, () => {
                                    document.body.classList.remove('gate--open');
                                    const unavailbleModal = document.querySelector("[data-js-unavailable-modal]");
                                    if (modal) modal.classList.remove('is-open');
                                })
                            }*/

                        }

                        const res = JSON.parse(this.responseText);

                        document.getElementById('resultsarea').classList.remove("hidden");
                        document.getElementById('resultscount').innerHTML = res.length;

                        const submarker = [];

                        var count = 0;
                        for (i = 0; i < res.length; i++) {

                            var count = i+1;


                            var myLatlng = new google.maps.LatLng(res[i].lat,res[i].lng);



                            var contentString = ' <div class=" content pt-4 text-center font-inherit"><small class="mt-2 text-xs inline border p-3 border-purple center w-auto border-1 rounded-xl">'+res[i].distance+' MILES</small>';
                            contentString = contentString+ '<h2 class="text-center mt-4  h5 text-purple">'+res[i].title+'</h2>';
                            contentString = contentString+ '<p class="mt-2 mb-2 text-purple text-sm">'+res[i].location_address+'</div>';


                            contentString = contentString+ '</div>';


                            const infowindow = new google.maps.InfoWindow({
                                content: contentString,
                            });

                            const submarker = new google.maps.Marker({
                                position: myLatlng,
                                title: res[i].title,
                                label: {text: ''+count+'', color: "white"},
                                icon: markerImage
                            });
                            submarker.setMap(map);

                            submarker.addListener("click", () => {
                                //alert(i);
                                infowindow.open({
                                    anchor: submarker,
                                    map,
                                    shouldFocus: false,
                                });
                            });

                            console.log(i);
                        }





                    }
                };
                xhttplocations.open("POST", "/wp-admin/admin-ajax.php", true);
                xhttplocations.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
                xhttplocations.send("action=get_location_markers&lat=" + lat + "&lng=" + lng+"&type="+type);








            } else {

                map.setCenter(place.geometry.location);
                map.setZoom(13);
            }

            //marker.setPosition(place.geometry.location);
            // marker.setVisible(true);
            infowindowContent.children["place-name"].textContent = place.name;
            infowindowContent.children["place-address"].textContent =
                place.formatted_address;
            infowindow.open(map, marker);
        });

    }

    initMap();
})