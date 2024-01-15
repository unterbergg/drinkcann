<?php
/**
 * The template for displaying Archive pages.
 *
 * Used to display archive-type pages if nothing more specific matches a query.
 * For example, puts together date-based pages if no date.php file exists.
 *
 * Learn more: http://codex.wordpress.org/Template_Hierarchy
 *
 * Methods for TimberHelper can be found in the /lib sub-directory
 *
 * @package  WordPress
 * @subpackage  Timber
 * @since   Timber 0.2
 */

$templates = array( 'archive.twig', 'index.twig' );

$data = Timber::get_context();

$data['post'] = get_page(get_option( 'page_for_posts' ));

$data['options'] = get_fields('option');
$data['title'] = single_cat_title( '', false );

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

$data['categories'] = $arr;
$data['cat_active'] = get_the_category()[0]->slug;

array_unshift( $templates, 'category.twig' );

global $paged;

if ( ! isset( $paged ) || ! $paged ) {
    $paged = 1;
}

$data['posts'] = Timber::get_posts([
    'posts_per_page' => 9,
    'paged'          => $paged,
    'cat'            => get_query_var('cat')
]);

$context['pagination'] = Timber::get_pagination();

Timber::render( $templates, $data );
