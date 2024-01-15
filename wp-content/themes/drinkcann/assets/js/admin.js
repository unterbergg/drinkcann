jQuery(function( $ ){
    const wp_inline_edit_function = inlineEditPost.edit;

    inlineEditPost.edit = function(post_id) {

        wp_inline_edit_function.apply( this, arguments );

        if ( typeof( post_id ) == 'object' ) {
            post_id = parseInt( this.getId( post_id ) );
        }

        const edit_row = $('#edit-' + post_id);
        const post_row = $('#post-' + post_id);

        const price = $('.column-price', post_row).text();
        const gd_id = $('.column-gd_id', post_row).text();
        const size = $('.column-size', post_row).text();
        const weight_oz = $('.column-weight_oz', post_row).text();
        const weight_ml = $('.column-weight_ml', post_row).text();

        $(':input[name="price"]', edit_row).val(price);
        $(':input[name="gd_id"]', edit_row).val(gd_id);
        $(':input[name="size"]', edit_row).val(size);
        $(':input[name="weight_oz"]', edit_row).val(weight_oz);
        $(':input[name="weight_ml"]', edit_row).val(weight_ml);

    }
});