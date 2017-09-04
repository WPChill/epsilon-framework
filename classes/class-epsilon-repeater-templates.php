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
						<div class="repeater-field repeater-field-{{{ field.type }}}">
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
									<a href="#" data-default="{{ field.defaultVal }}" class="epsilon-color-picker-default"><?php echo esc_html__( '(clear)', 'epsilon-framework' ); ?></a>
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
										<#  if( field.multiple ) { #>
											<option value="{{{ i }}}" <# if ( _.contains( field.default , i) ) { #> selected="selected" <# } #>>{{ choice }}</option>
										<#  } else { #>
											<option value="{{{ i }}}" <# if ( field.default == i ) { #> selected="selected" <# } #>>{{ choice }}</option>
										<#  }  #>
									<# }); #>
								</select>
							</label>
						<# } else if ( 'selectize' === field.type ) { #>
							<label>
								<# if ( field.label ) { #><span class="customize-control-title">{{ field.label }}</span><# } #>
								<# if ( field.description ) { #><span class="description customize-control-description">{{ field.description }}</span><# } #>
								<select class="epsilon-selectize" data-field="{{{ field.id }}}"<# if ( ! _.isUndefined( field.multiple ) && false !== field.multiple ) { #> multiple="multiple" data-multiple="{{ field.multiple }}"<# } #>>
									<# _.each( field.choices, function( choice, i ) { #>
										<#  if( field.multiple ) { #>
											<option value="{{{ i }}}" <# if ( _.contains( field.default , i) ) { #> selected="selected" <# } #>>{{ choice }}</option>
										<#  } else { #>
											<option value="{{{ i }}}" <# if ( field.default == i ) { #> selected="selected" <# } #>>{{ choice }}</option>
										<#  }  #>
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
						<# } else if ( 'epsilon-text-editor' === field.type ) { #>
							<label>
								<span class="customize-control-title">
									<# if( field.label ){ #>
										{{ field.label }}
									<# } #>

									<# if( field.description ){ #>
										<span class="description customize-control-description">{{ field.description }}</span>
									<# } #>
								</span>
								<textarea id="{{{ field.id }}}-{{ index }}" data-field="{{{ field.id }}}" class="widefat text wp-editor-area" >{{{ field.default }}}</textarea>
							</label>
						<# } else if ( 'epsilon-icon-picker' === field.type ) { #>
							<div class="epsilon-icon-picker-repeater-container" id="{{{ field.id }}}">
								<label class="epsilon-icon-picker-label">
									<span class="customize-control-title epsilon-button-label">
										{{{ field.label }}}
										<# if( field.description ){ #>
											<i class="dashicons dashicons-editor-help" style="vertical-align: text-bottom; position: relative;">
												<span class="mte-tooltip">
													{{{ field.description }}}
												</span>
											</i>
										<# } #>
									</span>
									<div class="epsilon-icon-container">
										<div class="epsilon-icon-name"><i class="{{{ field.default }}}"></i> <div class="icon-label">{{{ field.icons[field.default] }}}</div></div>
										<span class="dashicons dashicons-arrow-down epsilon-open-icon-picker"></span>
									</div>
								</label>
								<input type="hidden" class="epsilon-icon-picker" data-field={{{ field.id }}} value="{{{ field.default }}}">
								<div class="epsilon-icon-picker-container">
									<div class="search-container">
										<input type="text" class="widefat text" />
									</div>
									<div class="epsilon-icons-container">
										<div class="epsilon-icons">
											<# _.each(field.icons, function(k, v){ #>
												<i class="{{{ v }}} <# if( data.value === v ) { #> selected <# } #>" data-icon="{{{ v }}}" data-search="{{{ k }}}"></i>
											<# }) #>
										</div>
									</div>
								</div>
							</div>
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
								<input type="hidden" data-field="{{ field.id }}" data-size="{{ field.size }}" data-save-mode="{{ field.mode }}"/>
								<# if ( field.default ) { #>
								<div class="epsilon-image">
									<img src="{{{ field.default }}}" />
								</div>
								<# } else { #>
								<div class="placeholder">
									<?php echo esc_html__( 'Upload image', 'epsilon-framework' ); ?>
									<# if ( ! _.isUndefined( field.sizeArray[field.size] ) ) { #>
										<span class="recommended-size"><?php echo esc_html__('Recommended resolution:', 'epsilon-framework'); ?> {{{ field.sizeArray[field.size].width }}} x {{{ field.sizeArray[field.size].height }}}</span>
									<# } #>
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
						<# } else if ( 'epsilon-customizer-navigation' === field.type ) { #>
							<div class="epsilon-customizer-navigation">
								{{{ field.label }}} <a href="#" class="epsilon-customizer-navigation" data-field="{{ field.id }}" data-customizer-section="{{{ field.navigateToId }}}">{{{ field.navigateToLabel }}}</a>
							</div>
						<# } else if ( 'epsilon-upsell' === field.type ) { #>
							<div class="epsilon-upsell-label">
								{{{ field.label }}}
							</div>
							<div class="epsilon-upsell-container">
								<# if ( field.options ) { #>
									<ul class="epsilon-upsell-options">
										<# _.each(field.options, function( option, index) { #>
											<li><i class="dashicons dashicons-editor-help">
													<span class="mte-tooltip">{{{ option.help }}}</span>
												</i>
												{{ option.option }}
											</li>
											<# }) #>
									</ul>
								<# } #>

								<div class="epsilon-button-group">
									<# if ( field.button_text && field.button_url ) { #>
										<a href="{{ field.button_url }}" class="button" target="_blank">{{
											field.button_text }}</a>
									<# } #>

									<# if ( field.separator ) { #>
										<span class="button-separator">{{ field.separator }}</span>
									<# } #>

									<# if ( field.second_button_text && field.second_button_url ) { #>
										<a href="{{ field.second_button_url }}" class="button button-primary" target="_blank"> {{field.second_button_text }}</a>
									<# } #>
								</div>
							</div>
						<# } #>
						</div>
					<# } ); #>
					<div class="repeater-row-footer">
						<button type="button" class="button-link repeater-row-remove"><?php esc_attr_e( 'Remove', 'epsilon-framework' ); ?></button> |
						<button type="button" class="button-link repeater-row-minimize"><?php esc_attr_e( 'Close', 'epsilon-framework' ); ?></button>
					</div>
				</div>
			</li>
		</script>
		<?php //@formatter:on
	}
}
