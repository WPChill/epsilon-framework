<?php
if ( ! defined( 'WPINC' ) ) {
	die;
}

//@formatter:off
class Epsilon_Repeater_Templates {

	/**
	 * Render JS Template
	 */
	public static function field_repeater_js_template() { ?>
		<script type="text/html" class="customize-control-epsilon-repeater-content-field">
			<# var field; var index = data.index; #>
			<li class="repeater-row minimized" data-row="{{{ index }}}">
				<div class="repeater-row-header">
					<span class="repeater-row-label"></span>
					<i class="dashicons dashicons-arrow-down-alt2 repeater-minimize"></i>
					<i class="dashicons dashicons-trash repeater-row-remove"></i>
				</div>
				<div class="repeater-row-content">
					<# _.each( data, function( field, i ) { #>
					<div class="repeater-field repeater-field-{{{ field.type }}}">
						<# if ( 'text' === field.type || 'url' === field.type || 'link' === field.type || 'email' === field.type || 'tel' === field.type || 'hidden' === field.type ) { #>
						<?php self::text_field(); ?>
						<# } else if ( 'epsilon-section-class' === field.type ) { #>
						<?php self::section_class(); ?>
						<# } else if ( 'epsilon-toggle' === field.type ) { #>
						<?php self::epsilon_toggle(); ?>
						<# } else if ( 'epsilon-slider' === field.type ) { #>
						<?php self::epsilon_slider(); ?>
						<# } else if ( 'epsilon-color-picker' === field.type ) { #>
						<?php self::epsilon_picker(); ?>
						<# } else if ( 'select' === field.type ) { #>
						<?php self::select_field(); ?>
						<# } else if ( 'selectize' === field.type ) { #>
						<?php self::selectize_field(); ?>
						<# } else if ( 'checkbox' === field.type ) { #>
						<?php self::checkbox_field(); ?>
						<# } else if ( 'radio' === field.type ) { #>
						<?php self::radio_field(); ?>
						<# } else if ( 'epsilon-video' === field.type ) { #>
						<?php self::epsilon_video(); ?>
						<# } else if ( 'textarea' === field.type ) { #>
						<?php self::textarea_field(); ?>
						<# } else if ( 'epsilon-text-editor' === field.type ) { #>
						<?php self::epsilon_text_editor(); ?>
						<# } else if ( 'epsilon-code-editor' === field.type ) { #>
						<?php self::epsilon_code_editor(); ?>
						<# } else if ( 'epsilon-icon-picker' === field.type ) { #>
						<?php self::epsilon_icon_picker(); ?>
						<# } else if ( 'epsilon-image' === field.type ) { #>
						<?php self::epsilon_image(); ?>
						<# } else if ( 'epsilon-button-group' === field.type ) { #>
						<?php self::epsilon_button_group(); ?>
						<# } else if ( 'epsilon-customizer-navigation' === field.type ) { #>
						<?php self::epsilon_navigation(); ?>
						<# } else if ( 'epsilon-upsell' === field.type ) { #>
						<?php self::epsilon_upsell(); ?>
						<# } #>
					</div>
					<# } ); #>
					<div class="repeater-row-footer">
						<button type="button" class="button-link repeater-row-remove"><?php esc_attr_e( 'Remove', 'epsilon-framework' ); ?></button>
						|
						<button type="button" class="button-link repeater-row-minimize"><?php esc_attr_e( 'Close', 'epsilon-framework' ); ?></button>
					</div>
				</div>
			</li>
		</script>
		<?php
	}

	/**
	 * Render JS Template
	 */
	public static function section_repeater_js_template() { ?>
		<script type="text/html" class="customize-control-epsilon-repeater-content-section">
			<# var field; var index = data.index; #>
			<li class="repeater-row minimized" data-row="{{{ index }}}">
				<div class="repeater-row-header">
					<span class="repeater-row-label"></span>
					<i class="dashicons dashicons-arrow-down-alt2 repeater-minimize"></i>
					<i class="dashicons dashicons-trash repeater-row-remove"></i>
					<i class="dashicons dashicons-hidden repeater-row-hide"></i>
				</div>
				<div class="repeater-row-content">
					<# if ( ! _.isUndefined( data.groups ) ) { #>
						<nav>
							<# _.each( data.groups, function( group, id ) { #>
								<a href="#" data-item="{{{ id }}}" <# if( id === 'regular' ) { #> class="active" <# } #> >
									<span class="{{{ group.icon }}}"></span>
									<span class="label">{{{ group.label }}}</span>
								</a>
							<# }) #>
						</nav>
					<# } #>

					<# _.each( data, function( field, i ) { #>
					<div class="repeater-field repeater-field-{{{ field.type }}}" data-group="<# if(field.group){ #>{{{ field.group }}}<# } else { #>regular<# } #>">
						<# if ( 'text' === field.type || 'url' === field.type || 'link' === field.type || 'email' === field.type || 'tel' === field.type || 'hidden' === field.type ) { #>
						<?php self::text_field(); ?>
						<# } else if ( 'epsilon-section-class' === field.type ) { #>
						<?php self::section_class(); ?>
						<# } else if ( 'epsilon-toggle' === field.type ) { #>
						<?php self::epsilon_toggle(); ?>
						<# } else if ( 'epsilon-slider' === field.type ) { #>
						<?php self::epsilon_slider(); ?>
						<# } else if ( 'epsilon-color-picker' === field.type ) { #>
						<?php self::epsilon_picker(); ?>
						<# } else if ( 'select' === field.type ) { #>
						<?php self::select_field(); ?>
						<# } else if ( 'selectize' === field.type ) { #>
						<?php self::selectize_field(); ?>
						<# } else if ( 'checkbox' === field.type ) { #>
						<?php self::checkbox_field(); ?>
						<# } else if ( 'radio' === field.type ) { #>
						<?php self::radio_field(); ?>
						<# } else if ( 'textarea' === field.type ) { #>
						<?php self::textarea_field(); ?>
						<# } else if ( 'epsilon-text-editor' === field.type ) { #>
						<?php self::epsilon_text_editor(); ?>
						<# } else if ( 'epsilon-code-editor' === field.type ) { #>
						<?php self::epsilon_code_editor(); ?>
						<# } else if ( 'epsilon-icon-picker' === field.type ) { #>
						<?php self::epsilon_icon_picker(); ?>
						<# } else if ( 'epsilon-image' === field.type ) { #>
						<?php self::epsilon_image(); ?>
						<# } else if ( 'epsilon-video' === field.type ) { #>
						<?php self::epsilon_video(); ?>
						<# } else if ( 'epsilon-button-group' === field.type ) { #>
						<?php self::epsilon_button_group(); ?>
						<# } else if ( 'epsilon-customizer-navigation' === field.type ) { #>
						<?php self::epsilon_navigation(); ?>
						<# } else if ( 'epsilon-upsell' === field.type ) { #>
						<?php self::epsilon_upsell(); ?>
						<# } else if ( 'epsilon-template-select' === field.type ) { #>
						<?php self::epsilon_template_selector(); ?>
						<# } else if ( 'epsilon-margins-paddings' === field.type ) { #>
						<?php self::epsilon_margins_paddings(); ?>
						<# } #>
					</div>
					<# } ); #>
				</div>
			</li>
		</script>
		<?php
	}

	/**
	 * Margins and paddings
	 */
	public static function epsilon_margins_paddings() { ?>
		<label>
			<# if ( field.label ) { #>
			<span class="customize-control-title">{{ field.label }}</span>
			<# } #>
			<# if( field.description ){ #>
			<i class="dashicons dashicons-editor-help" style="vertical-align: text-bottom; position: relative;">
				<span class="mte-tooltip">
					{{{ field.description }}}
				</span>
			</i>
			<# } #>
			<input type="hidden" name="" value="{{ field.default }}" data-field="{{{ field.id }}}">
		</label>
		<div class="epsilon-control-set epsilon-margin-paddings">
			<div class="epsilon-additional-controls">
				<a href="#" data-additional="px">PX</a>
				<a href="#" data-additional="em">EM</a>
				<a href="#" data-additional="rem">REM</a>
				<a href="#" data-additional="percent">%</a>
			</div>
			<div class="epsilon-control-group epsilon-group-five">
				<div class="epsilon-spacing-section">
					<input type="number" class="epsilon-delegates" data-target="top"/ >
					<span class="description">Top</span>
				</div>

				<div class="epsilon-spacing-section">
					<input type="number" class="epsilon-delegates" data-target="right" />
					<span class="description">Right</span>
				</div>

				<div class="epsilon-spacing-section">
					<input type="number" class="epsilon-delegates" data-target="bottom" />
					<span class="description">Bottom</span>
				</div>

				<div class="epsilon-spacing-section">
					<input type="number" class="epsilon-delegates" data-target="left" />
					<span class="description">Left</span>
				</div>

				<div class="epsilon-spacing-section epsilon-link-spacing-section">
					<a href="#" class="epsilon-equalizer">
						<span class="dashicons dashicons-editor-unlink"></span>
					</a><!--/.epsilon-equalizer-->
				</div>
			</div>
		</div>
		<?php
	}

	/**
	 * Section class
	 */
	public static function section_class() { ?>
		<label> <# if ( field.label ) { #>
			<span class="customize-control-title">{{ field.label }} - {{{ field.default }}}</span>
			<# } #>

			<# if( field.description ){ #>
			<i class="dashicons dashicons-editor-help" style="vertical-align: text-bottom; position: relative;">
				<span class="mte-tooltip">
					{{{ field.description }}}
				</span> </i> <# } #>
			<input type="hidden" name="" value="{{{ field.default }}}" data-field="{{{ field.id }}}" {{ fieldExtras }}>
		</label>
		<?php
	}

	/**
	 * Text field
	 */
	public static function text_field() { ?>
		<#
		var fieldExtras = '';
		if ( 'link' === field.type ) {
		field.type = 'url'
		} #>

		<label>
			<# if ( field.label ) { #>
				<span class="customize-control-title">{{ field.label }}</span>
			<# } #>
			<# if( field.description && 'standard' !== field.description_type ){ #>
				<i class="dashicons dashicons-editor-help" style="vertical-align: text-bottom; position: relative;">
					<span class="mte-tooltip">
						{{{ field.description }}}
					</span>
				</i>
			<# } #>

			<# if( field.description && 'standard' === field.description_type ){ #>
				<div style="margin-bottom:5px;">
					{{{ field.description }}}
				</div>
			<# } #>
			<input type="{{field.type}}" name="" value="{{{ field.default }}}" data-field="{{{ field.id }}}" {{ fieldExtras }}>
		</label>
		<?php
	}

	/**
	 * Select field
	 */
	public static function select_field() { ?>
		<label>
			<# if ( field.label ) { #>
			<span class="customize-control-title">
				{{ field.label }}

				<# if( field.description ){ #>
				<i class="dashicons dashicons-editor-help" style="vertical-align: text-bottom; position: relative;">
						<span class="mte-tooltip">
							{{{ field.description }}}
						</span>
				</i>
				<# } #>
			</span>
			<# } #>

			<select data-field="{{{ field.id }}}"<# if ( ! _.isUndefined( field.multiple ) && false !== field.multiple ) { #> multiple="multiple" data-multiple="{{ field.multiple }}"<# } #>>
			<# _.each( field.choices, function( choice, i ) { #>
			<# if( field.multiple ) { #>
			<option value="{{{ i }}}"
			<# if ( _.contains( field.default , i) ) { #> selected="selected" <# } #>>{{ choice }}</option>
			<# } else { #>
			<option value="{{{ i }}}"
			<# if ( field.default == i ) { #> selected="selected" <# } #>>{{ choice }}</option>
			<# } #>
			<# }); #>
			</select>
		</label>
		<?php
	}

	/**
	 * Radio field
	 */
	public static function radio_field() { ?>
		<label> <# if ( field.label ) { #><span class="customize-control-title">{{ field.label }}</span><# } #> <# if(
			field.description ){ #>
			<i class="dashicons dashicons-editor-help" style="vertical-align: text-bottom; position: relative;">
				<span class="mte-tooltip">
					{{{ field.description }}}
				</span> </i> <# } #>

			<# _.each( field.choices, function( choice, i ) { #>
			<label><input type="radio" name="{{{ field.id }}}{{ index }}" data-field="{{{ field.id }}}" value="{{{ i }}}"
				<# if ( field.default == i ) { #> checked="checked" <# } #>> {{ choice }} <br /></label> <# }); #>
		</label>
		<?php
	}

	/**
	 * Textarea field
	 */
	public static function textarea_field() { ?>
		<# if ( field.label ) { #>
		<span class="customize-control-title">{{ field.label }}</span><# } #>        <# if( field.description ){ #>
		<i class="dashicons dashicons-editor-help" style="vertical-align: text-bottom; position: relative;">
						<span class="mte-tooltip">
							{{{ field.description }}}
						</span> </i>        <# } #>
		<textarea rows="3" data-field="{{{ field.id }}}">{{ field.default }}</textarea>
		<?php
	}

	/**
	 * Checkbox field
	 */
	public static function checkbox_field() { ?>
		<label> <input type="checkbox" value="true" data-field="{{{ field.id }}}" <# if ( field.default ) { #>
			checked="checked" <# } #> /> {{ field.label }} <# if ( field.description ) { #>{{ field.description }}<# }
			#> </label>
		<?php
	}

	/**
	 * Epsilon Toggle
	 */
	public static function epsilon_toggle() { ?>
		<div class="epsilon-toggle-control">
			<span class="customize-control-title epsilon-toggle-control__title">
				{{{ field.label }}}
				<# if( field.description ){ #>
					<i class="dashicons dashicons-editor-help" style="vertical-align: text-bottom; position: relative;">
						<span class="mte-tooltip">
							{{{ field.description }}}
						</span>
					</i>
				<# } #>
			</span>

			<div class="epsilon-toggle">
				<input type="checkbox" id="{{ field.id }}-{{ index }}" data-field="{{{ field.id }}}" class="epsilon-toggle__input" value="{{{ field.default }}}" <# if( field.default ) { #> checked="checked" <# } #> >
				<div class="epsilon-toggle__items">
					<span class="epsilon-toggle__track"></span>
					<span class="epsilon-toggle__thumb"></span>
					<svg class="epsilon-toggle__off" width="6" height="6" aria-hidden="true" role="img" focusable="false" viewBox="0 0 6 6"><path d="M3 1.5c.8 0 1.5.7 1.5 1.5S3.8 4.5 3 4.5 1.5 3.8 1.5 3 2.2 1.5 3 1.5M3 0C1.3 0 0 1.3 0 3s1.3 3 3 3 3-1.3 3-3-1.3-3-3-3z"></path></svg>
					<svg class="epsilon-toggle__on" width="2" height="6" aria-hidden="true" role="img" focusable="false" viewBox="0 0 2 6"><path d="M0 0h2v6H0z"></path></svg>
				</div>
			</div>

		</div>
		<?php
	}

	/**
	 * Epsilon Customizer Navigation
	 */
	public static function epsilon_navigation() { ?>
		<div class="epsilon-customizer-navigation-container">
			{{{ field.label }}} <# if( field.description ){ #>
			<i class="dashicons dashicons-editor-help" style="vertical-align: text-bottom; position: relative;">
				<span class="mte-tooltip">
					{{{ field.description }}}
				</span> </i> <# } #>
			<a href="#" data-doubled="{{ field.opensDoubled }}" class="epsilon-customizer-navigation button button-primary button-hero" data-field="{{ field.id }}" data-customizer-section="{{{ field.navigateToId }}}">{{{
				field.navigateToLabel }}}</a>
		</div>
		<?php
	}

	/**
	 * Epsilon Image
	 */
	public static function epsilon_image() { ?>
		<label>
			<span class="customize-control-title">
				{{{ field.label }}}
				<# if( field.description ){ #>
					<i class="dashicons dashicons-editor-help" style="vertical-align: text-bottom; position: relative;">
						<span class="mte-tooltip">
							{{{ field.description }}}
						</span>
					</i>
				<# } #>
			</span> </label>
		<div class="epsilon-controller-image-container image-upload">
			<input type="hidden" data-field="{{ field.id }}" data-size="{{ field.size }}" data-save-mode="{{ field.mode }}" />
			<# if ( field.default ) { #>
			<div class="epsilon-image">
				<img src="{{{ field.default }}}" />
			</div>
			<# } else { #>
			<div class="placeholder">
				<?php echo esc_html__( 'Upload image', 'epsilon-framework' ); ?>
				<# if ( ! _.isUndefined( field.sizeArray[field.size] ) ) { #>
				<span class="recommended-size"><?php echo esc_html__( 'Recommended resolution:', 'epsilon-framework' ); ?>
					{{{ field.sizeArray[field.size].width }}} x {{{ field.sizeArray[field.size].height }}}</span> <# }
				#>
			</div>
			<# } #>
			<div class="actions">
				<button class="button-secondary image-replace-button" <# if( '' === field.default ) { #> style="display:none;" <# } #>>
					<?php echo esc_html__( 'Replace Image', 'epsilon-framework' ); ?>
				</button>

				<button class="button-secondary image-remove-button" <# if( '' === field.default ) { #> style="display:none;" <# } #>>
					<?php echo esc_html__( 'Remove Image', 'epsilon-framework' ); ?>
				</button>
			</div>
		</div>
		<?php
	}

	/**
	 * Epsilon Video
	 */
	public static function epsilon_video() { ?>
		<label>
			<span class="customize-control-title">
				{{{ field.label }}}
				<# if( field.description ){ #>
					<i class="dashicons dashicons-editor-help" style="vertical-align: text-bottom; position: relative;">
						<span class="mte-tooltip">
							{{{ field.description }}}
						</span>
					</i>
				<# } #>
			</span> </label>
		<div class="epsilon-controller-video-container video-upload">
			<input type="hidden" data-field="{{ field.id }}" data-size="{{ field.size }}" data-save-mode="{{ field.mode }}" />
			<# if ( field.default ) { #>
			<div class="epsilon-video">
				<# var temp = JSON.parse( field.default ); #>
				{{ temp.label }}
			</div>
			<# } else { #>
			<div class="placeholder">
				<?php echo esc_html__( 'Upload video', 'epsilon-framework' ); ?>
			</div>
			<# } #>
			<div class="actions">
				<button class="button video-upload-remove-button"
				<# if( '' === field.default ) { #> style="display:none;" <# } #>>
				<i class="dashicons dashicons-trash"></i>
				</button>

				<button type="button" class="button-primary video-upload-button">
					<?php echo esc_html__( 'Select File', 'epsilon-framework' ); ?>
				</button>
			</div>
		</div>
		<?php
	}

	/**
	 * Epsilon Upsell
	 */
	public static function epsilon_upsell() { ?>
		<div class="epsilon-upsell-label">
			{{{ field.label }}}
		</div>
		<div class="epsilon-upsell-container">
			<# if ( field.options ) { #>
			<ul class="epsilon-upsell-options">
				<# _.each(field.features, function( option, index) { #>
				<li><i class="dashicons dashicons-editor-help"> <span class="mte-tooltip">{{{ option.help }}}</span>
					</i> {{ option.option }}
				</li>
				<# }) #>
			</ul>
			<# } #>

			<div class="epsilon-button-group">
				<# if ( field.button_text && field.button_url ) { #>
				<a href="{{ field.button_url }}" class="button" target="_blank">{{ field.button_text }}</a> <# } #>

				<# if ( field.separator ) { #> <span class="button-separator">{{ field.separator }}</span> <# } #>

				<# if ( field.second_button_text && field.second_button_url ) { #>
				<a href="{{ field.second_button_url }}" class="button button-primary" target="_blank">
					{{field.second_button_text }}</a> <# } #>
			</div>
		</div>
		<?php
	}

	/**
	 * Epsilon Slider
	 */
	public static function epsilon_slider() { ?>
		<#
		var fieldExtras = '';
		if ( ! _.isUndefined( field.choices ) && ! _.isUndefined( field.choices.min ) ) {
		fieldExtras += ' data-attr-min="' + field.choices.min + '"';
		}
		if ( ! _.isUndefined( field.choices ) && ! _.isUndefined( field.choices.max ) ) {
		fieldExtras += ' data-attr-max="' + field.choices.max + '"';
		}
		if ( ! _.isUndefined( field.choices ) && ! _.isUndefined( field.choices.step ) ) {
		fieldExtras += ' data-attr-step="' + field.choices.step + '"';
		} #>
		<div class="epsilon-slider">
			<span class="customize-control-title">
				{{{ field.label }}}
				<# if( field.description ){ #>
					<i class="dashicons dashicons-editor-help" style="vertical-align: text-bottom; position: relative;">
						<span class="mte-tooltip">
							{{{ field.description }}}
						</span>
					</i>
				<# } #>
			</span>
			<div class="slider-container">
				<input disabled type="text" class="rl-slider" id="input_{{ field.id }}-{{ index }}" data-field="{{{ field.id }}}" value="{{ field.default }}" />
				<div id="slider_{{ field.id }}-{{ index }}" class="ss-slider" {{{ fieldExtras }}}></div>
			</div>
		</div>
		<?php
	}

	/**
	 * Epsilon Color Picker
	 */
	public static function epsilon_picker() { ?>
		<label>
			<input class="epsilon-color-picker" data-attr-mode={{ field.mode }} data-field={{ field.id }} type="text" placeholder="{{ field.default }}" value="{{ field.default }}" />
			<span class="customize-control-title epsilon-color-picker-title">
				{{{ field.label }}}
				<a href="#" data-default="{{ field.defaultVal }}" class="epsilon-color-picker-default"><?php echo esc_html__( '(clear)', 'epsilon-framework' ); ?></a>
				<# if( field.description ){ #>
					<span class="epsilon-color-picker-description">{{{ field.description }}}</span>
				<# } #>
			</span>
		</label>
		<?php
	}

	/**
	 * Epsilon Icon Picker
	 */
	public static function epsilon_icon_picker() { ?>
		<label>
			<# if ( field.label ) { #>
			<span class="customize-control-title">{{ field.label }}</span>
			<# } #>
			<# if( field.description ){ #>
			<i class="dashicons dashicons-editor-help" style="vertical-align: text-bottom; position: relative;">
				<span class="mte-tooltip">
					{{{ field.description }}}
				</span>
			</i>
			<# } #>
			<input type="text" name="" value="{{{ field.default }}}" data-field="{{{ field.id }}}">
		</label>
		<?php
	}

	/**
	 * Epsilon Text Editor
	 */
	public static function epsilon_text_editor() { ?>
		<label>
			<span class="customize-control-title">
				<# if( field.label ){ #>
					{{ field.label }}
				<# } #>

				<# if( field.description ){ #>
					<span class="description customize-control-description">{{ field.description }}</span>
				<# } #>
			</span>
			<textarea id="{{{ field.id }}}-{{ index }}<# if( '' !== field.metaId ){ #>-{{ field.metaId }}<# } #>" data-field="{{{ field.id }}}" class="widefat text wp-editor-area">{{{ field.default }}}</textarea>
		</label>
		<?php
	}

	/**
	 * Epsilon Code Editor
	 */
	public static function epsilon_code_editor() {
		?>
		<label>
			<span class="customize-control-title">
				<# if( field.label ){ #>
					{{ field.label }}
				<# } #>

				<# if( field.description ){ #>
					<span class="description customize-control-description">{{ field.description }}</span>
				<# } #>
			</span>
			<textarea id="{{{ field.id }}}-{{ index }}<# if( '' !== field.metaId ){ #>-{{ field.metaId }}<# } #>" data-field="{{{ field.id }}}" data-mode="{{{ field.mode }}}" class="code">{{{ field.default }}}</textarea>
		</label>
		<?php
	}

	/**
	 * Selectize field
	 */
	public static function selectize_field() { ?>
		<label>
			<# if ( field.label ) { #>
			<span class="customize-control-title">{{ field.label }}</span>
			<# } #>
			<# if( field.description ){ #>
			<i class="dashicons dashicons-editor-help" style="vertical-align: text-bottom; position: relative;">
				<span class="mte-tooltip">
					{{{ field.description }}}
				</span>
			</i>
			<# } #>
			<select class="epsilon-selectize" data-field="{{{ field.id }}}"<# if ( ! _.isUndefined( field.multiple ) && false !== field.multiple ) { #> multiple="multiple" data-multiple="{{ field.multiple }}"<# } #>>
			<# _.each( field.choices, function( choice, i ) { #> <# if( field.multiple ) { #>
			<option value="{{{ i }}}"
			<# if ( _.contains( field.default , i) ) { #> selected="selected" <# } #>>
			{{ choice }}
			</option>
			<# } else { #>
			<option value="{{{ i }}}"
			<# if ( field.default == i ) { #> selected="selected" <# } #>>
			{{ choice }}
			</option>
			<# } #> <#
			}); #>
			</select>
		</label>
		<?php
	}

	/**
	 * Button group
	 */
	public static function epsilon_button_group() { ?>
		<div class="epsilon-control-container">
			<label>
				<span class="customize-control-title">
					{{{ field.label }}}
					<# if( field.description ){ #>
						<i class="dashicons dashicons-editor-help" style="vertical-align: text-bottom; position: relative;">
							<span class="mte-tooltip">
								{{{ field.description }}}
							</span>
						</i>
					<# } #>
				</span>
			</label>
			<div class="epsilon-control-set">
				<div class="epsilon-control-group epsilon-group-{{ field.groupType }}">
					<input type="hidden" data-field={{{ field.id }}} value="{{{ field.default }}}">
					<# for( var i in field.choices ) { #>
					<a href="#" data-value="{{ field.choices[i].value }}" <# if( field.default == field.choices[i].value ) { #> class="active" <# } #> >
					<# if( ! _.isUndefined( field.choices[i].icon) ) { #>
					<i class="dashicons {{ field.choices[i].icon }}" />
					<# } #>
					<# if( ! _.isUndefined( field.choices[i].png ) ) { #>
					<img src="{{ field.choices[i].png }}" />
					<# } #>
					</a>
					<# } #>
				</div>
			</div>
		</div>
		<?php
	}

	/**
	 * Layout selector
	 */
	public static function epsilon_template_selector() { ?>
		<div class="epsilon-control-container">
			<label>
				<span class="customize-control-title">
					{{{ field.label }}}
					<# if( field.description ){ #>
						<i class="dashicons dashicons-editor-help" style="vertical-align: text-bottom; position: relative;">
							<span class="mte-tooltip">
								{{{ field.description }}}
							</span>
						</i>
					<# } #>
				</span>
			</label>

			<div class="epsilon-layout-select-set">
				<input type="hidden" data-field="{{{ field.id }}}" value="{{{ field.default }}}">
				<# for( var i in field.choices ) { #>
				<a href="#" data-value="{{ field.choices[i].value }}" <# if( field.default == field.choices[i].value ) { #> class="active" <# } #> >
				<# if( ! _.isUndefined( field.choices[i].png ) ) { #>
				<img src="{{ field.choices[i].png }}" />
				<# } #>
				</a>
				<# } #>
			</div>
		</div>
		<?php
	}
}
//@formatter:on
