<?php

// If the Timber plugin isn't activated, print a notice in the admin.
if ( ! class_exists( 'Timber' ) ) {
	add_action( 'admin_notices', function() {
			echo '<div class="error"><p>Timber not activated. Make sure you activate the plugin in <a href="' . esc_url( admin_url( 'plugins.php#timber' ) ) . '">' . esc_url( admin_url( 'plugins.php' ) ) . '</a></p></div>';
		} );
	return;
}


// Create our version of the TimberSite object
class StarterSite extends TimberSite {

	// This function applies some fundamental WordPress setup, as well as our functions to include custom post types and taxonomies.
	function __construct() {
//		add_theme_support( 'post-formats' );
		add_theme_support( 'post-thumbnails' );
		add_theme_support( 'menus' );
		add_filter( 'timber_context', array( $this, 'add_to_context' ) );
		add_filter( 'get_twig', array( $this, 'add_to_twig' ) );
		add_action( 'init', array( $this, 'register_post_types' ) );
		add_action( 'init', array( $this, 'register_taxonomies' ) );
		add_action( 'init', array( $this, 'register_menus' ) );
		add_action( 'init', array( $this, 'register_widgets' ) );
        add_action( 'init', array( $this, 'register_ajax' ) );
        parent::__construct();
	}


	// Abstracting long chunks of code.

	// The following included files only need to contain the arguments and register_whatever functions. They are applied to WordPress in these functions that are hooked to init above.

	// The point of having separate files is solely to save space in this file. Think of them as a standard PHP include or require.

	function register_post_types(){
		require('lib/custom-types.php');
	}

	function register_taxonomies(){
		require('lib/taxonomies.php');
	}

	function register_menus(){
		require('lib/menus.php');
	}

	function register_widgets(){
		require('lib/widgets.php');
	}

    function register_ajax(){
        require('lib/ajax.php');
    }


	// Access data site-wide.

	// This function adds data to the global context of your site. In less-jargon-y terms, any values in this function are available on any view of your website. Anything that occurs on every page should be added here.

	function add_to_context( $context ) {

		// Our menu occurs on every page, so we add it to the global context.
		$context['menu'] = new TimberMenu();

		// This 'site' context below allows you to access main site information like the site title or description.
		$context['site'] = $this;
		return $context;
	}

	// Here you can add your own fuctions to Twig. Don't worry about this section if you don't come across a need for it.
	// See more here: http://twig.sensiolabs.org/doc/advanced.html
	function add_to_twig( $twig ) {
		$twig->addExtension( new Twig_Extension_StringLoader() );
		$twig->addFilter( 'myfoo', new Twig_Filter_Function( 'myfoo' ) );
		return $twig;
	}

}

new StarterSite();


/*
 *
 * My Functions (not from Timber)
 *
 */

// Enqueue scripts
function my_scripts() {

	// Use jQuery from a CDN
//	wp_deregister_script('jquery');
//	wp_register_script('jquery', '//ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js', array(), null, true);

	//Use GD plugin
	wp_enqueue_script( 'gd-plugin','https://cartwidget.grassdoor.com/grassdoorPlugin.js', array('jquery'), time(), true);

	// Enqueue our stylesheet and JS file with a jQuery dependency.
	// Note that we aren't using WordPress' default style.css, and instead enqueueing the file of compiled Sass.
	wp_enqueue_style( 'my-fonts', get_template_directory_uri() . '/assets/css/fonts.css', 1.0);
	wp_enqueue_style( 'my-styles', get_template_directory_uri() . '/assets/build/stylesheet.css', array(), time());
	wp_enqueue_script( 'my-js', get_template_directory_uri() . '/assets/build/main.js', array('jquery'), time(), true);
    wp_add_inline_script('my-js', 'var templateUrl = "' . get_bloginfo("template_url").' ";', 'before');

    global $post;
    if($post->slug == 'find-a-cann' || $post->slug == 'find-a-cann-ca') {
        wp_enqueue_script( 'find-a-cann-js',get_template_directory_uri() . '/assets/build/findcann.js', array('jquery'), time(), true);
        wp_localize_script('find-a-cann-js', 'coord', [
            'lat' => $post->slug == 'find-a-cann-ca' ? '43.825681' : '40.749933',
            'lng' => $post->slug == 'find-a-cann-ca' ? '-79.395' : '-73.98633',
        ] );
        wp_enqueue_script( 'google-map','https://maps.googleapis.com/maps/api/js?key=AIzaSyBDSdx0rkLPY9I_WOGJHszQXlEnI2gJers&libraries=places&v=weekly', array('find-a-cann-js'), time(), true);
        //todo: recheck if it needed
        wp_enqueue_script( 'hoodie-map','//www.askhoodie.com/assets/askhoodie.host.js', array(), time(), false);
    }
}

add_action( 'wp_enqueue_scripts', 'my_scripts' );

//function add_async_attribute($tag, $handle) {
//    // add script handles to the array below
//    $scripts_to_async = array('google-map');
//    foreach($scripts_to_async as $async_script) {
//        if ($async_script === $handle) {
//            return str_replace(' src', ' async="async" src', $tag);
//        }
//    }
//    return $tag;
//}
//add_filter('script_loader_tag', 'add_async_attribute', 10, 2);


if( function_exists('acf_add_options_page') ) {
	acf_add_options_page();	
}

add_image_size( 'big', 2560, 999999, true );

// Our custom post type function
function create_posttype() {
    register_taxonomy( 'canncat', [ 'products' ], [
        'label'                 => '',
        'labels'                => [
            'name'              => 'Cann Categories',
            'singular_name'     => 'Cann Category',
            'search_items'      => 'Search Categories',
            'all_items'         => 'All Categories',
            'view_item '        => 'View Category',
            'parent_item'       => 'Parent Category',
            'parent_item_colon' => 'Parent Category:',
            'edit_item'         => 'Edit Category',
            'update_item'       => 'Update Category',
            'add_new_item'      => 'Add New Category',
            'new_item_name'     => 'New Category Name',
            'menu_name'         => 'Category',
            'back_to_items'     => '← Back to Category',
        ],
        'description'           => '',
        'public'                => true,
        'hierarchical'          => true,

        'rewrite'               => [
            'slug' => 'products'
        ],
        //'query_var'             => $taxonomy, // название параметра запроса
        'capabilities'          => array(),
        'meta_box_cb'           => null, // html метабокса. callback: `post_categories_meta_box` или `post_tags_meta_box`. false — метабокс отключен.
        'show_admin_column'     => false, // авто-создание колонки таксы в таблице ассоциированного типа записи. (с версии 3.5)
        'show_in_rest'          => null, // добавить в REST API
        'rest_base'             => null, // $taxonomy,
        'show_on_quick_edit'    => true
    ] );
    register_post_type( 'products',
    // CPT Options
        array(
            'labels' => array(
                'name' => __( 'Products' ),
                'singular_name' => __( 'Product' )
            ),
            'public' => true,
            'has_archive' => false,
            'rewrite' => array('slug' => 'product'),
            'show_in_rest' => true,
 
        )
    );

}
// Hooking up our function to theme setup
add_action( 'init', 'create_posttype' );


function klaviyo_sms_signup( $data ) {

	$id = $data['id'];
	$num = "+1" . $data['num'];
	$email = $data['email'];

	$url = "https://a.klaviyo.com/api/v2/list/" . $id . "/subscribe";

	$private_api_key = KLAVIYO_PRIVATE_API_KEY;

	$consent = '$consent';

	if ($email !== NULL) {
		$email_decoded = urldecode($email);

		$data = [
			"api_key" => $private_api_key,
			'profiles' => [
				[
					$consent => ["sms"],
					"phone_number" => $num,
					"sms_consent" => true,
					"email" => $email_decoded
				]
			]
		];
	} else {
		$data = [
			"api_key" => $private_api_key,
			'profiles' => [
				[
					$consent => ["sms"],
					"phone_number" => $num,
					"sms_consent" => true
				]
			]
		];
	}

	$data = json_encode($data);

	$headers = array(
		"Content-Type: application/json",
		"Cache-Control: no-cache"
	);

	$ch = curl_init($url);                                                                      
	curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");                                                                     
	curl_setopt($ch, CURLOPT_POSTFIELDS, $data);                                                                  
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);                                                                      
	curl_setopt($ch, CURLOPT_HTTPHEADER, $headers); 

	$server_output = curl_exec($ch);

	return $server_output;   
}



add_action( 'rest_api_init', function () {
	register_rest_route( 'klaviyo/v1', '/list/(?P<id>[^/]+)/(?P<num>\d+)/(?P<email>[^/]+)', array(
	  'methods' => 'POST',
	  'callback' => 'klaviyo_sms_signup',
	) );
} );

add_action( 'rest_api_init', function () {
	register_rest_route( 'klaviyo/v1', '/list/(?P<id>[^/]+)/(?P<num>\d+)', array(
	  'methods' => 'POST',
	  'callback' => 'klaviyo_sms_signup',
	) );
} );

// redirect from wp-login.php to /login/
/*
function redirect_login_page() {  
    $login_page  = home_url( '/login/' );  
    $page_viewed = basename($_SERVER['REQUEST_URI']);  
  
    if( $page_viewed == "wp-login.php" && $_SERVER['REQUEST_METHOD'] == 'GET') {  
        wp_redirect($login_page);  
        exit;  
    }  
}
add_action('init','redirect_login_page');
*/

// DISABLE caching in a localstorage cookie so that subsequent visits by the same visit will not issue a new AJAX request
add_filter('geoip_detect2_ajax_localize_script_data', function($data) {
    $data['cookie_name'] = ''; // Disable cookies completely
    // or $data['cookie_duration_in_days'] = 14 // How long the cookie is valid, default is 1 (day)
    return $data;
});

/*
function login_failed() {  
    $login_page  = home_url( '/login/' );  
    wp_redirect( $login_page . '?login=failed' );  
    exit;  
}  
add_action( 'wp_login_failed', 'login_failed' );  
  
function verify_username_password( $user, $username, $password ) {  
    $login_page  = home_url( '/login/' );  
    if( $username == "" || $password == "" ) {  
        wp_redirect( $login_page . "?login=empty" );  
        exit;  
    }  
}  
add_filter( 'authenticate', 'verify_username_password', 1, 3);
*/

// logout page
/*
function logout_page() {  
    $login_page  = home_url( '/login/' );  
    wp_redirect( $login_page . "?login=false" );  
    exit;  
}  
add_action('wp_logout','logout_page');
*/

//field_62f36760e02f4
function drinkcann_get_taxonomy_list( $field ) {

    $field['choices'] = array();

    $terms = get_terms( array(
        'taxonomy' => 'canncat',
        'hide_empty' => false,
    ));

    if ( $terms ) {
        foreach ( $terms as $term ) {
            $choices[$term->term_id] = $term->name;
        }
    }

    $field['choices'] = $choices;

    wp_reset_postdata();

    return $field;

}

add_filter('acf/load_field/key=field_62f36760e02f4', 'drinkcann_get_taxonomy_list');

// Allow SVG
add_filter( 'wp_check_filetype_and_ext', function($data, $file, $filename, $mimes) {

    $filetype = wp_check_filetype( $filename, $mimes );

    return [
        'ext'             => $filetype['ext'],
        'type'            => $filetype['type'],
        'proper_filename' => $data['proper_filename']
    ];

}, 10, 4 );

function cc_mime_types( $mimes ){
    $mimes['svg'] = 'image/svg+xml';
    return $mimes;
}
add_filter( 'upload_mimes', 'cc_mime_types' );

function fix_svg() {
    echo '<style type="text/css">
        .attachment-266x266, .thumbnail img {
             width: 100% !important;
             height: auto !important;
        }
        </style>';
}
add_action( 'admin_head', 'fix_svg' );

function drinkcann_columns( $column_array ) {

    $column_array[ 'gd_id' ] = 'Grassdoor Product ID';
    $column_array[ 'size' ] = 'Size';
    $column_array[ 'price' ] = 'Price';
    $column_array[ 'weight_oz' ] = 'Weight (oz)';
    $column_array[ 'weight_ml' ] = 'Weight (mL)';

    return $column_array;
}
add_filter( 'manage_products_posts_columns', 'drinkcann_columns' );

function drinkcann_populate_columns( $column_name, $post_id ) {

    // if you have to populate more that one columns, use switch()
    switch( $column_name ) {
        case 'gd_id': {
            $gd_id = get_field( 'grassdoor_product_id', $post_id);
            echo $gd_id;
            break;
        }
        case 'size': {
            echo get_field( 'size', $post_id);
            break;
        }
        case 'price': {
            echo get_field( 'price', $post_id);
            break;
        }
        case 'weight_oz': {
            echo get_field( 'weight_oz', $post_id);
            break;
        }
        case 'weight_ml': {
            echo get_field( 'weight_ml', $post_id);
            break;
        }
    }

}
add_action( 'manage_posts_custom_column', 'drinkcann_populate_columns', 10, 2 );

function drinkcann_quick_edit_fields( $column_name, $post_type ) {
    switch( $column_name ) {
        case 'gd_id': {
            ?>
            <fieldset class="inline-edit-col-left">
            <div class="inline-edit-col">
                <span class="title inline-edit-categories-label">
                    Product fields
                </span>
            </div>
            <div class="inline-edit-col">
                <label>
                    <span class="title">GD id</span>
                    <input type="text" name="gd_id">
                </label>
            </div>

            <?php
            break;
        }
        case 'size': {
            ?>
            <div class="inline-edit-col">
                <label>
                    <span class="title">Size</span>
                    <input type="text" name="size">
                </label>
            </div>
            <?php
            break;
        }
        case 'price': {
            ?>
            <div class="inline-edit-col">
                <label>
                    <span class="title">Price</span>
                    <input type="text" name="price">
                </label>
            </div>
            <?php
            break;
        }
        case 'weight_oz': {
            ?>
            <div class="inline-edit-col">
                <label>
                    <span class="title">Weight oz</span>
                    <input type="text" name="weight_oz">
                </label>
            </div>
            <?php
            break;
        }
        case 'weight_ml': {
            ?>
            <div class="inline-edit-col">
                <label>
                    <span class="title">Weight ml</span>
                    <input type="text" name="weight_ml">
                </label>
            </div>
            </fieldset>
            <?php
            break;
        }
    }
}
add_action('quick_edit_custom_box',  'drinkcann_quick_edit_fields', 10, 2);

function drinkcann_quick_edit_save( $post_id ){

    if (!wp_verify_nonce( $_POST[ '_inline_edit' ], 'inlineeditnonce')) {
        return;
    }

    update_field('grassdoor_product_id', $_POST['gd_id'], $post_id);
    update_field('price', $_POST['price'], $post_id);
    update_field('size', $_POST['size'], $post_id);
    update_field('weight_oz', $_POST['weight_oz'], $post_id);
    update_field('weight_ml', $_POST['weight_ml'], $post_id);

}
add_action('save_post', 'drinkcann_quick_edit_save');

function custom_admin_js() {

    wp_enqueue_script( 'custom_wp_admin_js', get_template_directory_uri() . '/assets/build/admin.js', false, '1.0.0' );
}

add_action('admin_enqueue_scripts', 'custom_admin_js');