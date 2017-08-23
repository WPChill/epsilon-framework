<?php
if ( ! defined( 'WPINC' ) ) {
	die;
}

class Epsilon_Control_Typography extends WP_Customize_Control {
	/**
	 * The type of customize control being rendered.
	 *
	 * @since  1.0.0
	 * @access public
	 * @var    string
	 */
	public $type = 'epsilon-typography';

	/**
	 * @since  1.0.0
	 * @access public
	 * @var string
	 */
	public $selectors;

	/**
	 * @since  1.0.3
	 * @access public
	 * @var array
	 */
	public $font_defaults;

	/**
	 * @since  1.2.0
	 * @access public
	 * @var
	 */
	public $default;

	/**
	 * @since  1.2.0
	 * @access public
	 * @var array
	 */
	public $choices = array();

	/**
	 * @since  1.2.0
	 * @access public
	 * @var string
	 */
	public $stylesheet = 'epsilon-typography-css';

	/**
	 * Epsilon_Control_Typography constructor.
	 *
	 * @param WP_Customize_Manager $manager
	 * @param string               $id
	 * @param array                $args
	 */
	public function __construct( WP_Customize_Manager $manager, $id, array $args = array() ) {
		parent::__construct( $manager, $id, $args );
		$manager->register_control_type( 'Epsilon_Control_Typography' );
	}

	/**
	 * Add custom parameters to pass to the JS via JSON.
	 *
	 * @since  1.2.0
	 * @access public
	 */
	public function json() {
		$json                 = parent::json();
		$json['id']           = $this->id;
		$json['link']         = $this->get_link();
		$json['value']        = $this->value();
		$json['choices']      = $this->choices;
		$json['default']      = $this->default;
		$json['fontDefaults'] = $this->set_font_defaults();
		$json['inputs']       = $this->get_values( $this->id );
		$json['fonts']        = $this->google_fonts();
		$json['selectors']    = $this->set_selectors();
		$json['stylesheet']   = $this->stylesheet;

		return $json;
	}

	/**
	 * Sets the typography defaults
	 */
	public function set_font_defaults() {
		$arr = array();
		if ( empty( $this->font_defaults ) ) {
			$arr[ $this->id ] = array();
		}

		if ( ! empty( $this->font_defaults ) ) {
			$arr[ $this->id ] = $this->font_defaults;
		}

		return $arr;
	}

	/**
	 * Enqueues selectize js
	 *
	 * @since  1.0.0
	 * @access public
	 * @return void
	 */
	public function enqueue() {
		wp_enqueue_script( 'jquery-ui' );
		wp_enqueue_script( 'jquery-ui-slider' );
		wp_enqueue_style( 'selectize', EPSILON_URI . '/assets/vendors/selectize/selectize.css' );
		wp_enqueue_script( 'selectize', EPSILON_URI . '/assets/vendors/selectize/selectize.min.js', array( 'jquery' ), '1.0.0', true );
	}

	/**
	 * Grabs the value from the json and creates a k/v array
	 *
	 * @since 1.0.0
	 *
	 * @param $values
	 *
	 * @return array
	 */
	public function get_values( $values ) {
		$defaults = $this->set_font_defaults();
		$defaults = $defaults[ $this->id ];

		if ( empty( $defaults ) ) {
			$defaults = array(
				'font-family'    => 'Select font',
				'font-weight'    => '',
				'font-style'     => '',
				'letter-spacing' => '0',
				'font-size'      => '16',
				'line-height'    => '18',
			);
		}

		$arr = array();
		foreach ( $this->choices as $choice ) {
			if ( array_key_exists( $choice, $defaults ) ) {
				$arr[ $choice ] = $defaults[ $choice ];
			}
		}

		if ( empty( $values ) ) {
			return $arr;
		}

		$json = get_theme_mod( $values, '' );

		if ( '' === $json ) {
			return $arr;
		}

		$json    = str_replace( '&quot;', '"', $json );
		$json    = (array) json_decode( $json );
		$options = (array) $json['json'];

		/**
		 * Changed these options (font-style and weight) in toggles
		 */
		if ( ! empty( $options['font-style'] ) ) {
			$options['font-style'] = 'on';
		}
		if ( ! empty( $options['font-weight'] ) ) {
			$options['font-weight'] = 'on';
		}

		$return = array_merge( $arr, $options );

		foreach ( $return as $k => $v ) {
			$return[ $k ] = esc_attr( $v );
		}

		return $return;
	}

	/**
	 * Access the GFonts Json and parse its content.
	 *
	 * @since  1.0.0
	 * @access public
	 * @return array|mixed|object
	 */
	public function google_fonts() {
		global $wp_filesystem;
		if ( empty( $wp_filesystem ) ) {
			require_once( ABSPATH . '/wp-admin/includes/file.php' );
			WP_Filesystem();
		}

		$path   = EPSILON_PATH . '/assets/data/gfonts.json';
		$gfonts = $wp_filesystem->get_contents( $path );

		return json_decode( $gfonts );
	}

	/**
	 * @return string
	 */
	public function set_selectors() {
		return implode( ',', $this->selectors );
	}

	/**
	 * Display the control's content
	 *
	 * @since  1.2.0
	 * @access public
	 */
	public function content_template() {
		//@formatter:off ?>
		<label>
			<span class="customize-control-title">
				{{{ data.label }}}
				<# if( data.description ){ #>
					<i class="dashicons dashicons-editor-help" style="vertical-align: text-bottom; position: relative;">
						<span class="mte-tooltip">
							{{{ data.description }}}
						</span>
					</i>
				<# } #>
			</span>
		</label>
		
		
		<div class="customize-control-content">
			<input disabled type="hidden" class="epsilon-typography-input" id="hidden_input_{{{ data.id }}}" <# if ( data.value ) { value="{{{ data.value }}}"  } #> {{{ data.link }}}/>
		</div>

		<div class="epsilon-typography-container" data-unique-id="{{{ data.id }}}">
			<# if( _.contains( data.choices, 'font-family' ) ) { #>
				<div class="epsilon-typography-font-family">
					<select id="{{{ data.id }}}-font-family" class="epsilon-typography-input">
						<option value="default_font"><?php echo esc_html__( 'Theme default', 'epsilon-framework' ); ?></option>
						<# for ( font in data.fonts ) { #>
							<option value="{{ font }}" <# if( font === data.inputs['font-family'] ) { #> selected="selected" <# } #> > {{ font }} </option>
						<# } #>
					</select>
				</div>
			<# } #>

			<# if( _.contains( data.choices, 'font-weight' ) ) { #>
			<div class="epsilon-typography-font-weight">
				<div class="epsilon-font-weight-switch">
					<input type="checkbox" id="{{{ data.id }}}-font-weight" class="epsilon-typography-input epsilon-font-weight-switch-checkbox" value="on" <# if( 'on' === data.inputs['font-weight'] ) { #> checked="checked" <# } #>>
					<label class="epsilon-font-weight-switch-label" for="{{{ data.id }}}-font-weight"></label>
				</div>
			</div>
			<# } #>

			<# if( _.contains( data.choices, 'font-style' ) ) { #>
			<div class="epsilon-typography-font-style">
				<div class="epsilon-font-style-switch">
					<input type="checkbox" id="{{{ data.id }}}-font-style" class="epsilon-typography-input epsilon-font-style-switch-checkbox" value="on" <# if( 'on' === data.inputs['font-style'] ) { #> checked="checked" <# } #>>
					<label class="epsilon-font-style-switch-label" for="{{{ data.id }}}-font-style"></label>
				</div>
			</div>
			<# } #>

			<# if( _.contains( data.choices, 'font-size' ) || _.contains( data.choices, 'line-height' ) || _.contains( data.choices, 'letter-spacing' ) ) { #>
				<div class="epsilon-typography-advanced">
					<a href="#" data-toggle="{{{ data.id }}}-toggle" class="epsilon-typography-advanced-options-toggler"><span class="dashicons dashicons-admin-generic"></span></a>
				</div>
				<div class="epsilon-typography-advanced-options" id="{{{ data.id }}}-toggle">
					<# if( _.contains( data.choices, 'font-size' ) ) { #>
						<label for="{{{ data.id }}}-font-size">
							<?php echo esc_html__( 'Font Size', 'epsilon-framework' ); ?>
						</label>
						<div class="slider-container">
							<input data-default-font-size="{{{ data.fontDefaults[data.id]['font-size'] }}}" type="text" class="epsilon-typography-input rl-slider" id="{{{ data.id }}}-font-size" value="{{{ data.inputs['font-size'] }}}"/>
							<div id="slider_{{{ data.id }}}-font-size" data-attr-min="0" data-attr-max="40" data-attr-step="1" class="ss-slider"></div>
						</div>
					<# } #>
					<# if( _.contains( data.choices, 'line-height' ) ) { #>
						<label for="{{{ data.id }}}-line-height">
							<?php echo esc_html__( 'Line Height', 'epsilon-framework' ); ?>
						</label>
						<div class="slider-container">
							<input data-default-line-height="{{{ data.fontDefaults[data.id]['line-height'] }}}" type="text" class="epsilon-typography-input rl-slider" id="{{{ data.id }}}-line-height" value="{{{ data.inputs['line-height'] }}}"/>
							<div id="slider_{{{ data.id }}}-line-height" data-attr-min="0" data-attr-max="40" data-attr-step="1" class="ss-slider"></div>
						</div>
					<# } #>
					<# if( _.contains( data.choices, 'letter-spacing' ) ) { #>
						<label for="{{{ data.id }}}-letter-spacing">
							<?php echo esc_html__( 'Letter Spacing', 'epsilon-framework' ); ?>
						</label>
						<div class="slider-container">
							<input data-default-letter-spacing="{{{ data.fontDefaults[data.id]['letter-spacing'] }}}" type="text" class="epsilon-typography-input rl-slider" id="{{{ data.id }}}-letter-spacing" value="{{{ data.inputs['letter-spacing'] }}}"/>
							<div id="slider_{{{ data.id }}}-letter-spacing" data-attr-min="0" data-attr-max="5" data-attr-step="0.1" class="ss-slider"></div>
						</div>
					<# } #>
				</div>
			<# } #>
		</div>
		
		<style>
		
			
			/* debug blocks */
			.epsilon-control-container  						{ background:#CCE6FF; }
			.epsilon-control-set-advanced 						{ background:#8F9CB2; }
			.epsilon-control-set-dropdown 						{ background:#B8A1C9; }
			.epsilon-control-container label 					{ background:#E0CB99; }
			
			.epsilon-control-container,
			.epsilon-control-set-advanced,
			.epsilon-control-set-dropdown,
			.epsilon-control-container label {
					background:transparent;
					/*  */
			}
			
			
			 
			
			
			.epsilon-control-container  						{ padding:15px 0 5px 0; }
			.epsilon-control-container label 					{ 
				line-height:20px;
				display:block;
				margin-bottom:5px;
			}
						
			.epsilon-control-dropdown,
			.epsilon-control-advanced {
				background-color: #fefefe;
				border: solid 1px rgba(219,219,219,.9);				
				width:33px;
				height:33px;
				text-align:center;
				position:absolute;
				right:0;
				top:0;
				cursor:pointer;
			}
			
			.epsilon-control-advanced i,
			.epsilon-control-dropdown i {
				display:block;
				margin:7px auto 0 auto;
			}
			
			.epsilon-control-advanced {
				-webkit-box-shadow: 0 0 4px rgba(0,0,0,.06);
				-moz-box-shadow: 0 0 4px rgba(0,0,0,.06);
				box-shadow: 0 0 4px rgba(0,0,0,.06);				
				border-radius:3px;
			}
			
			.epsilon-control-dropdown {
				border-left:none;
				width:34px;
				border-radius:0 3px 3px 0;
			}
					
			.epsilon-control-field {
				padding-left:10px;
				background:#FEFEFE;
				height:35px;
				position:relative;
				overflow:hidden;
				border-radius:3px 0 0 3px;
				border: solid 1px rgba(219,219,219,.9);
				line-height:35px;
				box-sizing: border-box;
			}
			
			.epsilon-control-set-advanced .epsilon-control-field {
				border-radius:3px;
				-webkit-box-shadow: 0 0 4px rgba(0,0,0,.06);
				-moz-box-shadow: 0 0 4px rgba(0,0,0,.06);
				box-shadow: 0 0 4px rgba(0,0,0,.06);
				border-radius:3px;
			}
			
			.epsilon-control-field a {
				text-decoration:none;
				color:#555555;
			}
					
			.epsilon-control-styles {
				height:35px;
				position:relative;
				overflow:hidden;
				border-radius:3px 0 0 3px;
			}
			
			.epsilon-control-styles:before,
			.epsilon-control-styles:after {
				position:absolute;
				content:" ";
				opacity:.2;
				background:#000;
				width:100%;
				height:1px;
				left:0;
				z-index:2;
			}
			
			.epsilon-control-styles:before 						{ top:0; }
			.epsilon-control-styles:after 						{ bottom:0; }

			.epsilon-control-styles a:first-child 				{ border-radius:3px 0 0 3px; }			
			.epsilon-control-styles a {
				display:block;
				height:35px;
				float:left;
				width:20%;
				position:relative;
			}
			
			.epsilon-control-styles a:first-child:before,
			.epsilon-control-styles a:last-child:before {
				position:absolute;
				content:" ";
				background:#000;
				opacity:.2;
				width:1px;
				height:35px;
				top:0;
			}
			
			.epsilon-control-styles a:first-child:before 		{ left:0; }
			.epsilon-control-styles a:last-child:before 		{ right:0; }

			.epsilon-control-set,
			.epsilon-control-set-advanced,
			.epsilon-control-set-dropdown {
				height:35px;
				width:100%;
				position:relative;
				box-sizing: border-box;
			}
			
			.epsilon-control-set-advanced.epsilon-group-two 						{ padding-right:111px; }
			.epsilon-control-set-advanced.epsilon-group-two .epsilon-control-group 	{
				position:absolute;
				top:0;
				right:38px;
				width:70px;
				height:35px;
			}
			
			.epsilon-control-set-advanced 						{ padding-right:38px; }
			.epsilon-control-set-dropdown 						{ 
				padding-right:35px; 
				-webkit-box-shadow: 0 0 4px rgba(0,0,0,.06);
				-moz-box-shadow: 0 0 4px rgba(0,0,0,.06);
				box-shadow: 0 0 4px rgba(0,0,0,.06);
			}
			
			.epsilon-control-group {
				width:100%;
				height:33px;
				background:#FEFEFE;
				border-radius:3px;
				line-height:35px;
				cursor:pointer;			
				box-sizing: border-box;
				border: solid 1px rgba(219,219,219,.9);
				-webkit-box-shadow: 0 0 4px rgba(0,0,0,.06);
				-moz-box-shadow: 0 0 4px rgba(0,0,0,.06);
				box-shadow: 0 0 4px rgba(0,0,0,.06);
				height:35px;
			}
			
			.epsilon-control-group a 							{ float:left;height:33px;background:rgba(150,180,150,0);text-align:center;text-decoration:none; }
			.epsilon-control-group a.active 					{ 
				background-color: rgba(47,33,54,0);
				-webkit-box-shadow: inset 0 2px 5px rgba(0,0,0,.08);
				-moz-box-shadow: inset 0 2px 5px rgba(0,0,0,.08);
				box-shadow: inset 0 2px 5px rgba(0,0,0,.08);
			}
			.epsilon-control-group i							{ margin-top:5px;display:block;margin-left:auto;margin-right:auto; }
			.epsilon-control-group a:nth-child(odd)				{ background:rgba(150,180,150,0);}
			.epsilon-control-group.epsilon-group-four a			{ width:25%; }
			.epsilon-control-group.epsilon-group-three a 		{ width:33.333333%; }
			.epsilon-control-group.epsilon-group-two a 			{ width:50%; }
			

		
		</style>
		
		
		
		<div class="epsilon-control-container">
			<label>Epsilon Controls Set > Group 4 + Advanced</label>
			
			<div class="epsilon-control-set-advanced">
				<div class="epsilon-control-group epsilon-group-four">
					<a href="#"><i class="dashicons dashicons-editor-alignleft"/></a>
					<a href="#"><i class="dashicons dashicons-editor-aligncenter"/></a>
					<a href="#" class="active"><i class="dashicons dashicons-editor-alignright"/></a>
					<a href="#"><i class="dashicons dashicons-editor-alignleft"/></a>
				</div>
				
				<div class="epsilon-control-advanced">
					<i class="dashicons dashicons-admin-generic"/>
				</div>
			</div>
		</div>
			
			
		<div class="epsilon-control-container">
			<label>Epsilon Controls Set > Group 3 + Advanced</label>
			
			<div class="epsilon-control-set-advanced">
				<div class="epsilon-control-group epsilon-group-three">
					<a href="#"><i class="dashicons dashicons-editor-alignleft"/></a>
					<a href="#"><i class="dashicons dashicons-editor-aligncenter"/></a>
					<a href="#" class="active"><i class="dashicons dashicons-editor-alignright"/></a>
				</div>
				
				<div class="epsilon-control-advanced">
					<i class="dashicons dashicons-admin-generic"/>
				</div>
			</div>
		</div>
			
		<div class="epsilon-control-container">
			<label>Epsilon Controls Set > Group 2 + Advanced</label>
			
			<div class="epsilon-control-set-advanced">
				<div class="epsilon-control-group epsilon-group-two">
					<a href="#"><i class="dashicons dashicons-editor-alignleft"/></a>
					<a href="#" class="active"><i class="dashicons dashicons-editor-alignright"/></a>
				</div>
				
				<div class="epsilon-control-advanced">
					<i class="dashicons dashicons-admin-generic"/>
				</div>
			</div>
		</div>
			
		<div class="epsilon-control-container">
			<label>Epsilon Controls Set > Group 4</label>
			
			<div class="epsilon-control-set">
				<div class="epsilon-control-group epsilon-group-four">
					<a href="#"><i class="dashicons dashicons-arrow-up-alt"/></a>
					<a href="#"><i class="dashicons dashicons-arrow-down-alt"/></a>
					<a href="#" class="active"><i class="dashicons dashicons-arrow-left-alt"/></a>
					<a href="#"><i class="dashicons dashicons-arrow-right-alt"/></a>
				</div>
			</div>
		</div>
		
		<div class="epsilon-control-container">
			<label>Epsilon Controls Set > Group 3</label>
			
			<div class="epsilon-control-set">
				<div class="epsilon-control-group epsilon-group-three">
					<a href="#"><i class="dashicons dashicons-editor-alignleft"/></a>
					<a href="#" class="active"><i class="dashicons dashicons-editor-aligncenter"/></a>
					<a href="#"><i class="dashicons dashicons-editor-alignright"/></a>
				</div>
			</div>
		</div>
			
		<div class="epsilon-control-container">
			<label>Epsilon Controls Set > Group 2</label>
			
			<div class="epsilon-control-set">
				<div class="epsilon-control-group epsilon-group-two">
					<a href="#" class="active"><i class="dashicons dashicons-align-right"/></a>
					<a href="#"><i class="dashicons dashicons-align-left"/></a>
				</div>
			</div>
		</div>
		
		<div class="epsilon-control-container">
			<label>ECS > Dropdown Field + Group 4 + Advanced</label>

			<div class="epsilon-control-set-advanced epsilon-group-two">
				<div class="epsilon-control-advanced">
					<i class="dashicons dashicons-admin-generic"/>
				</div>
				
				<div class="epsilon-control-group epsilon-group-two">
					<a href="#" class="active"><i class="dashicons dashicons-editor-bold"/></a>
					<a href="#"><i class="dashicons dashicons-editor-italic"/></a>
				</div>
				
				<div class="epsilon-control-field">
					<a href="#">Times New Roman</a>
				</div>
			</div>
		</div>
		
		<div class="epsilon-control-container">
			<label>ECS > Dropdown Field + Advanced</label>
			
			<div class="epsilon-control-set-advanced">
				<div class="epsilon-control-advanced">
					<i class="dashicons dashicons-admin-generic"/>
				</div>
				
				<div class="epsilon-control-field">
					<a href="#">Times New Roman</a>
				</div>
			</div>
		</div>
		
		<div class="epsilon-control-container">
			<label>ECS > Field + Dropdown</label>
			
			<div class="epsilon-control-set-dropdown">
				<div class="epsilon-control-dropdown">
					<i class="dashicons dashicons-arrow-down"/>
				</div>
				
				<div class="epsilon-control-field">
					<a href="#">Times New Roman</a>
				</div>
			</div>	
		</div>	
			
		<div class="epsilon-control-container">
			<label>ECS > Styles + Dropdown</label>
			
			<div class="epsilon-control-set-dropdown">
				<div class="epsilon-control-dropdown">
					<i class="dashicons dashicons-arrow-down"/>
				</div>
				
				<div class="epsilon-control-styles">
					<a href="#" style="background:#FF3D2E;"></a>
					<a href="#" style="background:#C42519;"></a>
					<a href="#" style="background:orange;"></a>
					<a href="#" style="background:#165F7F;"></a>
					<a href="#" style="background:#58A9CD;"></a>
				</div>
			</div>
			
			
		</div>
		
		
		<?php //@formatter:on
	}

	/**
	 * Displays the control content. ( should be empty )
	 *
	 * @since  1.0.0
	 * @access public
	 * @return void
	 */
	public function render_content() {
	}
}
