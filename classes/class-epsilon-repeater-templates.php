<?php
if ( ! defined( 'WPINC' ) ) {
	die;
}

class Epsilon_Repeater_Templates {
	/**
	 * Render JS Template
	 */
	public static function field_repeater_js_template() {
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
						<# if ( 'text' === field.type || 'url' === field.type || 'link' === field.type || 'email' === field.type || 'tel' === field.type || 'hidden' === field.type ) { #>
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
						<# } else if ( 'epsilon-color-picker' === field.type ) { #>
							<label>
								<input class="epsilon-color-picker" data-attr-mode={{ field.mode }} data-field={{ field.id }} type="text" maxlength="7" placeholder="{{ field.default }}"  value="{{ field.value }}" />
								<span class="customize-control-title epsilon-color-picker-title">
									{{{ field.label }}}
									<# if( field.description ){ #>
										<span class="epsilon-color-picker-description">{{{ field.description }}}</span>
									<# } #>
								</span>
							</label>
						<# } else if ( 'select' === field.type ) { #>
							<label>
								<# if ( field.label ) { #><span class="customize-control-title">{{ field.label }}</span><# } #>
								<# if ( field.description ) { #><span class="description customize-control-description">{{ field.description }}</span><# } #>
								<select data-field="{{{ field.id }}}"<# if ( ! _.isUndefined( field.multiple ) && false !== field.multiple ) { #> multiple="multiple" data-multiple="{{ field.multiple }}"<# } #>>
									<# _.each( field.choices, function( choice, i ) { #>
										<option value="{{{ i }}}" <# if ( field.default == i ) { #> selected="selected" <# } #>>{{ choice }}</option>
									<# }); #>
								</select>
							</label>
						<# } else if ( 'checkbox' === field.type ) { #>
							<label>
								<input type="checkbox" value="true" data-field="{{{ field.id }}}" <# if ( field.default ) { #> checked="checked" <# } #> /> {{ field.label }}
								<# if ( field.description ) { #>{{ field.description }}<# } #>
							</label>
						<# } else if ( 'radio' === field.type ) { #>
							<label>
								<# if ( field.label ) { #><span class="customize-control-title">{{ field.label }}</span><# } #>
								<# if ( field.description ) { #><span class="description customize-control-description">{{ field.description }}</span><# } #>

								<# _.each( field.choices, function( choice, i ) { #>
									<label><input type="radio" name="{{{ field.id }}}{{ index }}" data-field="{{{ field.id }}}" value="{{{ i }}}" <# if ( field.default == i ) { #> checked="checked" <# } #>> {{ choice }} <br/></label>
								<# }); #>
							</label>
						<# } else if ( 'textarea' === field.type ) { #>
								<# if ( field.label ) { #><span class="customize-control-title">{{ field.label }}</span><# } #>
								<# if ( field.description ) { #><span class="description customize-control-description">{{ field.description }}</span><# } #>
								<textarea rows="5" data-field="{{{ field.id }}}">{{ field.default }}</textarea>
						<# } else if ( 'epsilon-image' === field.type ) { #>
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

							<div class="epsilon-controller-image-container image-upload">
								<input type="hidden" data-field="{{ field.id }}" data-save-mode="{{ field.mode }}"/>
								<# if ( field.default ) { #>
								<div class="epsilon-image">
									<img src="{{{ field.default }}}" />
								</div>
								<# } else { #>
								<div class="placeholder">
									<?php echo esc_html__( 'Select a file', 'epsilon-framework' ); ?>
								</div>
								<# } #>
								<div class="actions">
									<button class="button image-upload-remove-button" <# if( '' === field.default ) { #> style="display:none;" <# } #>>
										<?php esc_attr_e( 'Remove', 'epsilon-framework' ); ?>
									</button>

									<button type="button" class="button-primary image-upload-button">
										<?php echo esc_html__( 'Select File', 'epsilon-framework' ); ?>
									</button>
								</div>
							</div>
						<# } #>
					<# } ); #>
					<div class="repeater-row-footer">
						<button type="button" class="button-link repeater-row-remove"><?php esc_attr_e( 'Remove', 'epsilon-framework' ); ?></button>
					</div>
				</div>
			</li>
		</script>
		<?php //@formatter:on
	}
}
