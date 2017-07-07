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
						<# if ( 'text' === field.type || 'url' === field.type || 'link' === field.type || 'email' === field.type || 'tel' === field.type || 'date' === field.type || 'number' === field.type ) { #>
							<# var fieldExtras = ''; #>
							<# if ( 'link' === field.type ) { #>
								<# field.type = 'url' #>
							<# } #>

							<# if ( 'number' === field.type ) { #>
								<# if ( ! _.isUndefined( field.choices ) && ! _.isUndefined( field.choices.min ) ) { #>
									<# fieldExtras += ' min="' + field.choices.min + '"'; #>
								<# } #>
								<# if ( ! _.isUndefined( field.choices ) && ! _.isUndefined( field.choices.max ) ) { #>
									<# fieldExtras += ' max="' + field.choices.max + '"'; #>
								<# } #>
								<# if ( ! _.isUndefined( field.choices ) && ! _.isUndefined( field.choices.step ) ) { #>
									<# fieldExtras += ' step="' + field.choices.step + '"'; #>
								<# } #>
							<# } #>

							<label>
								<# if ( field.label ) { #><span class="customize-control-title">{{ field.label }}</span><# } #>
								<# if ( field.description ) { #><span class="description customize-control-description">{{ field.description }}</span><# } #>
								<input type="{{field.type}}" name="" value="{{{ field.default }}}" data-field="{{{ field.id }}}"{{ fieldExtras }}>
							</label>

						<# } #>
					<# } ); #>
					<button type="button" class="button-link repeater-row-remove"><?php esc_attr_e( 'Remove', 'epsilon-framework' ); ?></button>
				</div>
			</li>
		</script>
		<?php //@formatter:on
	}
}
