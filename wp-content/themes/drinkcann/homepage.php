<?php
/**
 * Template Name: Homepage
 */

$context = Timber::get_context();
$post = new TimberPost();
$context['post'] = $post;
$context['options'] = get_fields('option');
Timber::render( array( 'page-' . $post->post_name . '.twig', 'page.twig' ), $context );