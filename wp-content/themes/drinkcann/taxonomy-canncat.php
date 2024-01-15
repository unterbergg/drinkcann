<?php
$context = Timber::get_context();
$terms = Timber::get_terms(array(
    'taxonomy'   => 'canncat',
    'meta_key'  => 'order',
    'orderby' => 'meta_value_num',
    'order' => 'ASC'
));
$context['canncat'] =  $terms;

$post = new TimberTerm();
$context['post'] = $post;
$context['options'] = get_fields('option');

if (!get_field('cat_multuple', $post)) {
    $context['posts'] = get_field('order_products', $post);
    $context['shop'] = '384';/*$shop_id[0]->ID;*/
} else {
    $terms = get_terms(array(
        'taxonomy'   => 'canncat',
        'meta_key'  => 'order',
        'orderby' => 'meta_value_num',
        'order' => 'ASC',
        'fields' => 'ids',
        'include' => get_field('order_categories', $post)
    ));
    $context['multiple_terms'] = $terms;
}

Timber::render(array('taxonomy-cann.twig'), $context);