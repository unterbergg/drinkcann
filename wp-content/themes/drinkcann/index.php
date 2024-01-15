<?php
/**
 * The main template file
 * This is the most generic template file in a WordPress theme
 * and one of the two required files for a theme (the other being style.css).
 * It is used to display a page when nothing more specific matches a query.
 * E.g., it puts together the home page when no home.php file exists
 *
 * Methods for TimberHelper can be found in the /lib sub-directory
 *
 * @package  WordPress
 * @subpackage  Timber
 * @since   Timber 0.1
 */

if ( ! class_exists( 'Timber' ) ) {
	echo 'Timber not activated. Make sure you activate the plugin in <a href="/wp-admin/plugins.php#timber">/wp-admin/plugins.php</a>';
	return;
}
$context = Timber::get_context();

// $post = Timber::query_post();
// $context['post'] = $post;

$context['post'] = get_page(get_option( 'page_for_posts' ));

$context['options'] = get_fields('option');

global $paged;

if ( ! isset( $paged ) || ! $paged ) {
    $paged = 1;
}

$context['posts'] = Timber::get_posts([
    'posts_per_page' => 9,
    'paged'          => $paged
]);

$context['pagination'] = Timber::get_pagination();

// We can access the loop of WordPress posts with the 'posts' variable.
// $context['posts'] = Timber::get_posts();


// cats
$cats = get_categories();
$arr = [];

foreach($cats as $cat) {
    $obj = [
        "url" => get_category_link($cat->cat_ID),
        "name" => $cat->name,
        "slug" => $cat->slug,
    ];
    array_push($arr, $obj);
}

$context['categories'] = $arr;

// If we are on the home page, add a few other templates to our hierarchy.
$templates = array( 'index.twig' );
if ( is_home() ) {
	array_unshift( $templates, 'front-page.twig', 'home.twig' );
}
Timber::render( $templates, $context );
