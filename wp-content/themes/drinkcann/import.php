<?php
require_once('../../../wp-config.php');
$row = 1;

exit();
if (($handle = fopen("caraw.csv", "r")) !== FALSE) {
    while (($data = fgetcsv($handle, 1000, ",")) !== FALSE) {
        $num = count($data);


        $location = array(
            'post_title'    => wp_strip_all_tags( $data[0] ),
            'post_content'  => '',
            'post_status'   => 'publish',
            'post_type'   => 'location'
        );

      $id = wp_insert_post( $location );




        echo 'name';
        echo $data[0];
        echo '<br/>';



        echo 'address';
        echo $data[1];
        echo '<br/>';
        update_post_meta( $id, 'address', $data[1] );

        echo 'city';
        echo $data[3];
        echo '<br/>';
        update_post_meta( $id, 'city', $data[2] );

        echo 'state';
        echo $data[4];
        echo '<br/>';
        update_post_meta( $id, 'state', $data[3] );


        echo 'country';
        echo $data[5];
        echo '<br/>';
        update_post_meta( $id, 'country','Canada' );



        echo 'zipcode';
        echo $data[4];
        echo '<br/>';
        update_post_meta( $id, 'zip', $data[4] );


        echo 'phone';
        echo $data[5];
        echo '<br/>';
        update_post_meta( $id, 'phone', $data[5] );


        echo 'website';
        echo $data[7];
        echo '<br/>';
        update_post_meta( $id, 'website', $data[7] );


        echo 'latitude';
        echo $data[17];
        echo '<br/>';
        update_post_meta( $id, 'latitude', $data[17] );


        echo 'longitude';
        echo $data[18];
        echo '<br/>';
        update_post_meta( $id, 'longitude', $data[18] );



        echo '<br/>';
        update_post_meta( $id, 'type', 'pickup' );


        $row++;

    }
    fclose($handle);
}


?>