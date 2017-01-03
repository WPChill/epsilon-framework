<?php

function epsilon_customize_register_custom_controls( $wp_customize ) {
	require_once get_template_directory() . '/epsilon-framework/customizer/controls/epsilon_control_tab.php';
	require_once get_template_directory() . '/epsilon-framework/customizer/controls/epsilon_control_heading.php';
	require_once get_template_directory() . '/epsilon-framework/customizer/controls/epsilon_custom_section.php';

	$wp_customize->register_section_type( 'Epsilon_Custom_Section' );
	$wp_customize->register_control_type( 'Epsilon_Control_Tab' );
	$wp_customize->register_control_type( 'Epsilon_Control_Heading' );
}

add_action( 'customize_register', 'epsilon_customize_register_custom_controls', 9 );

function epsilon_framework_sample_controls( $wp_customize ){

	$prefix = 'epsilon_framework';

	// Pro Section
	$wp_customize->add_section(
		new Epsilon_Custom_Section(
			$wp_customize,
			'epsilon-custom-section',
			array(
				'title'    => esc_html__( 'Theme Name', 'illdy' ),
				'pro_text' => esc_html__( 'Go Pro', 'illdy' ),
				'pro_url'  => 'https://epsilon.com',
				'priority' => 0
			)
		)
	);

	$wp_customize->add_section( $prefix . '_contact_us' ,
	    array(
	        'title'         => __( 'Contact us Section', 'illdy' ),
	        'description'   => __( 'Control various options for contact us section from front page.', 'illdy' ),
	        'priority'      => 109,
	    )
	);

	$wp_customize->add_setting( $prefix . '_contact_heading', array(
	        'transport'         => 'postMessage'
	    )
	);

	$wp_customize->add_control(  new Epsilon_Control_Heading( $wp_customize,
	    $prefix . '_contact_heading',
	    array(
	        'type'      => 'epsilon-heading',
	        'section'   => $prefix . '_contact_us',
	        'priority'  => 1,
	        'label'		=> 'Hello',
	        'description' => "Aloha",
	    ) )
	);

	$wp_customize->add_setting( $prefix . '_contact_tab', array(
	        'transport'         => 'postMessage'
	    )
	);
	$wp_customize->add_control(  new Epsilon_Control_Tab( $wp_customize,
	    $prefix . '_contact_tab',
	    array(
	        'type'      => 'epsilon-tab',
	        'section'   => $prefix . '_contact_us',
	        'priority'  => 1,
	        'buttons'   => array(
	            array(
	                'name' => __( 'General', 'illdy' ),
	                'fields'    => array(
	                    $prefix . '_contact_us_show',
	                    $prefix . '_contact_us_title',
	                    $prefix . '_contact_us_entry',
	                    // $prefix . '_contact_us_text',
	                    $prefix . '_contact_us_address_title',
	                    $prefix . '_contact_us_customer_support_title',
	                    $prefix . '_contact_us_contact_form_7',
	                    // $prefix . '_contact_us_install_contact_form_7',
	                    ),
	                'active' => true
	                ),
	            array(
	                'name' => __( 'Details', 'illdy' ),
	                'fields'    => array(
	                    $prefix . 'illdy_contact_bar_facebook_url',
	                    $prefix . '_contact_bar_twitter_url',
	                    $prefix . '_contact_bar_linkedin_url',
	                    $prefix . '_contact_bar_googlep_url',
	                    $prefix . '_contact_bar_pinterest_url',
	                    $prefix . '_contact_bar_instagram_url',
	                    $prefix . '_contact_bar_youtube_url',
	                    $prefix . '_contact_bar_vimeo_url',
	                    $prefix . '_email',
	                    $prefix . '_phone',
	                    $prefix . '_address1',
	                    $prefix . '_address2',
	                    ),
	                ),
	            ),
	    ) )
	);
}

add_action( 'customize_register', 'epsilon_framework_sample_controls' );

if ( ! function_exists( 'epsilon_framework_customizer_css_load' ) ) {
	function epsilon_framework_customizer_css_load() {
		wp_enqueue_style( 'epsilon-framework-customizer-css', get_template_directory_uri() . '/epsilon-framework/assets/css/customizer.css' );
	}

	add_action( 'customize_controls_print_styles', 'epsilon_framework_customizer_css_load' );
}

if ( ! function_exists( 'epsilon_framework_customizer_js_load' ) ) {
	function epsilon_framework_customizer_js_load() {
		wp_enqueue_script( 'epsilon-framework-customizer-js', get_template_directory_uri() . '/epsilon-framework/assets/js/customizer.js', array( 'customize-controls' ), '1.0', true );
	}

	add_action( 'customize_controls_enqueue_scripts', 'epsilon_framework_customizer_js_load' );
}