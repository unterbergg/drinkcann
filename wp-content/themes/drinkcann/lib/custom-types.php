<?php

/*
 *
 * Custom Post Types
 *
 */

// Note that you only need the arguments and register_post_type function here. They are hooked into WordPress in functions.php.

register_post_type('location',
    array(
        'labels'      => array(
            'name'          => __('Locations', 'textdomain'),
            'singular_name' => __('Location', 'textdomain'),
        ),
        'public'      => true,
        'has_archive' => true,
    )
);