<?php
add_action( 'wp_ajax_nopriv_get_redirect_urls', 'get_redirect_urls' );
add_action( 'wp_ajax_nopriv_get_location_cards', 'get_location_cards' );
add_action( 'wp_ajax_nopriv_get_location_markers', 'get_location_markers' );
add_action( 'wp_ajax_get_redirect_urls', 'get_redirect_urls' );
add_action( 'wp_ajax_get_location_cards', 'get_location_cards' );
add_action( 'wp_ajax_get_location_markers', 'get_location_markers' );

function get_redirect_urls() {
    $url = '';
    $country = '';
    $subdivision = '';
    try {
        if (array_key_exists('country', $_POST)) {
            $country = $_POST['country'];
        }
        if (array_key_exists('subdivision', $_POST)) {
            $subdivision = $_POST['subdivision'];
        }

        $options = get_fields('option');

        // redirect_locations
        if ($options && (array_key_exists('redirect_locations', $options))) {
            foreach ($options['redirect_locations'] as $location) {
                // incorrect url
                if (!(array_key_exists('url', $location['url'])) ) {
                    $url = $url + "error - incorrect url, country "+ $country + ", subdivision " + subdivision + ". ";
                    continue;
                }
                //incorrect country
                if (!(array_key_exists('country', $location)) ) {
                    $url = $url + "error - incorrect country, country "+ $country + ", subdivision " + subdivision + ". ";
                    continue;
                }
                //incorrect subdivision
                if (!(array_key_exists('subdivision', $location)) ) {
                    continue;
                }
                // if country only exists
                if (!trim($location['subdivision'])) {
                    if (strtoupper(trim($location['country'])) == strtoupper($country)) {
                        $url = $location['url']['url'];
                    }
                // country and subdivison exists
                } elseif ((strtoupper(trim($location['country'])) == strtoupper($country)) && (strtoupper(trim($location['subdivision'])) == strtoupper($subdivision))) {
                    $url = $location['url']['url'];
                }
            }
        }
    } catch (Exception $e) {
        $url = "error - exception";
    }
    echo $url;
    wp_die(); // this is required to terminate immediately and return a proper response
}

function get_location_cards() {

    global $wpdb; // this is how you get access to the database

    $locations = get_nearby_locations($_POST['lat'], $_POST['lng'], 50);
    $return = '';


    foreach($locations as $location) {


        if($_POST['type'] == 1) {
            $context['type']  = 'delivery';
        }

        if($_POST['type'] == 2) {
            $context['type'] = 'pickup';
            if (strtolower(trim(get_field('type', $location->ID))) == 'delivery') continue;
        }
        
        $context['location_type'] = strtolower(trim(get_field('type', $location->ID)));
        $context['location_title'] = $location->post_title;
        $context['location_distance'] = number_format($location->distance, 2);
        $context['location_address'] = get_field('address', $location->ID);
        $context['location_address'] .=  '<br/>'.get_field('city', $location->ID);
        $context['location_address'] .=  ', '.get_field('state', $location->ID);
        $context['location_address'] .=  ' '.get_field('zip', $location->ID);
        $context['location_phone'] = get_field('phone', $location->ID);
        $context['location_website'] = get_field('website', $location->ID);




        Timber::render( array( 'snippets/location_card.twig' ), $context );


    }

    echo $return;
    wp_die(); // this is required to terminate immediately and return a proper response
}


function get_location_markers() {
    global $wpdb; // this is how you get access to the database

    $locations = get_nearby_locations($_POST['lat'], $_POST['lng'], 50);


    $return = array();
    foreach($locations as $location) {

        $setup = array();

        if (strtolower(trim(get_field('type', $location->ID))) == 'delivery') {
            continue;
        } else {
            $setup['location_address'] = get_field('address', $location->ID);
            $setup['location_address'] .=  '<br/>'.get_field('city', $location->ID);
            $setup['location_address'] .=  ', '.get_field('state', $location->ID);
            $setup['location_address'] .=  ' '.get_field('zip', $location->ID);
        }
        $setup['location_phone'] = get_field('phone', $location->ID);
        $setup['location_website'] = get_field('website', $location->ID);


        $build = array(
            'title' =>$location->post_title,
            'distance' => number_format($location->distance, 2),
            'lat' => get_field('latitude', $location->ID),
            'lng' => get_field('longitude', $location->ID),
            'location_address' => $setup['location_address'],
            'location_phone' => $setup['location_phone'],
            'location_website' => $setup['location_website']

        );




        $return[] = $build;





    }

    if(count($return) > 0) {
        echo json_encode($return);
    } else {
        echo 0;
    }

    wp_die(); // this is required to terminate immediately and return a proper response
}


function get_nearby_locations( $lat, $lng, $distance ) {
    global $wpdb;

    // Radius of the earth 3959 miles or 6371 kilometers.
    $earth_radius = 3959;

    $sql = $wpdb->prepare( "
        SELECT DISTINCT
            p.ID,
            p.post_title,
            map_lat.meta_value as locLat,
            map_lng.meta_value as locLong,
            ( %d * acos(
            cos( radians( %s ) )
            * cos( radians( map_lat.meta_value ) )
            * cos( radians( map_lng.meta_value ) - radians( %s ) )
            + sin( radians( %s ) )
            * sin( radians( map_lat.meta_value ) )
            ) )
            AS distance
        
        FROM $wpdb->posts p        INNER JOIN $wpdb->postmeta map_lat ON p.ID = map_lat.post_id
        INNER JOIN $wpdb->postmeta map_lng ON p.ID = map_lng.post_id
        WHERE 1 = 1
        AND p.post_type = 'location'
        AND map_lat.meta_key = 'latitude'
        AND map_lng.meta_key = 'longitude'
        HAVING distance < %s
        ORDER BY distance ASC LIMIT 20",
        $earth_radius,
        $lat,
        $lng,
        $lat,
        $distance
    );

    // Uncomment and paste into phpMyAdmin to debug.
    // echo $sql;

    $nearbyLocations = $wpdb->get_results( $sql );

    if ( $nearbyLocations ) {
        return $nearbyLocations;
    }
}

?>