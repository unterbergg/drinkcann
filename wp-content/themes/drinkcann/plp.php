<?php
/**
 * Template Name: PLP
 */

$context = Timber::get_context();
$terms = Timber::get_terms(array(
    'taxonomy'   => 'canncat',
    'meta_key'  => 'order',
    'orderby' => 'meta_value_num',
    'order' => 'ASC'
));
$context['canncat'] =  $terms;
$post = new TimberPost();
$context['post'] = $post;
$shop_id = get_posts( [
    'name'        => 'shop',
    'post_type'   => 'page',
    'post_status' => 'publish',
    'numberposts' => 1,
    'field'       => 'ids'
] );
$context['shop'] = $shop_id[0]->ID;
$context['options'] = get_fields('option');
Timber::render( array( 'page-plp.twig' ), $context );