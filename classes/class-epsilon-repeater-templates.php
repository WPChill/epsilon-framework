<?php
if ( ! defined( 'WPINC' ) ) {
	die;
}

class Epsilon_Repeater_Templates {
	/**
	 * Render JS Template
	 */
	public static function render_js_template() {
		//@formatter:off ?>
		<script type="text/html" class="customize-control-epsilon-repeater-content">
		<# var field; var index = data.index; #>
			<li class="repeater-row minimized" data-row="{{{ index }}}">
				<div class="repeater-row-header">
					<span class="repeater-row-label"></span>
					<i class="dashicons dashicons-arrow-down repeater-minimize"></i>
				</div>
				<div class="repeater-row-content">
					<# _.each( data, function( field, i ) { #>
						<# if ( 'text' === field.type || 'url' === field.type || 'link' === field.type || 'email' === field.type || 'tel' === field.type ) { #>
							<# var fieldExtras = ''; #>
							<# if ( 'link' === field.type ) { #>
								<# field.type = 'url' #>
							<# } #>

							<label>
								<# if ( field.label ) { #><span class="customize-control-title">{{ field.label }}</span><# } #>
								<# if ( field.description ) { #><span class="description customize-control-description">{{ field.description }}</span><# } #>
								<input type="{{field.type}}" name="" value="{{{ field.default }}}" data-field="{{{ field.id }}}" {{ fieldExtras }}>
							</label>
						<# } else if ( 'epsilon-toggle' === field.type ) { #>
							<div class="checkbox_switch">
								<span class="customize-control-title onoffswitch_label">
									{{{ field.label }}}
									<# if( field.description ){ #>
										<i class="dashicons dashicons-editor-help" style="vertical-align: text-bottom; position: relative;">
											<span class="mte-tooltip">
												{{{ field.description }}}
											</span>
										</i>
									<# } #>
								</span>
								<div class="onoffswitch">
									<input type="checkbox" id="{{ field.id }}-{{ index }}" data-field="{{{ field.id }}}" class="onoffswitch-checkbox" value="{{{ field.default }}}"  <# if( field.default ) { #> checked="checked" <# } #> >
									<label class="onoffswitch-label" for="{{ field.id }}-{{ index }}"></label>
								</div>
							</div>
						<# } else if ( 'epsilon-slider' === field.type ) { #>
							<# var fieldExtras = ''; #>
							<# if ( ! _.isUndefined( field.choices ) && ! _.isUndefined( field.choices.min ) ) { #>
								<# fieldExtras += ' data-attr-min="' + field.choices.min + '"'; #>
							<# } #>
							<# if ( ! _.isUndefined( field.choices ) && ! _.isUndefined( field.choices.max ) ) { #>
								<# fieldExtras += ' data-attr-max="' + field.choices.max + '"'; #>
							<# } #>
							<# if ( ! _.isUndefined( field.choices ) && ! _.isUndefined( field.choices.step ) ) { #>
								<# fieldExtras += ' data-attr-step="' + field.choices.step + '"'; #>
							<# } #>
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
						<# } #>
					<# } ); #>
					<button type="button" class="button-link repeater-row-remove"><?php esc_attr_e( 'Remove', 'epsilon-framework' ); ?></button>
				</div>
			</li>
		</script>
		<?php //@formatter:on
	}
}
