<?php
/**
 * Template Name: Learn
 */

$context = Timber::get_context();
$post = new TimberPost();
$context['post'] = $post;
$context['options'] = get_fields('option');
//$terms = get_terms(array(
//    'taxonomy'   => 'canncat',
//    'meta_key'  => 'order',
//    'orderby' => 'meta_value_num',
//    'order' => 'ASC',
//    'fields' => 'ids',
//    'include' => get_field('order_categories', $post)
//));
//$context['canncat_terms'] = $terms;
Timber::render( array( 'page-' . $post->post_name . '.twig', 'page.twig' ), $context );
