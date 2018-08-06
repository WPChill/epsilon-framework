declare var wp: any;

wp.customize.settingConstructor[ 'epsilon-section-repeater' ] = wp.customize.Setting.extend( {
    defaults: _.extend(
        {},
        wp.customize.Setting.prototype.defaults,
        {
            setting_type: 'epsilon-setting-repeater'
        }
    ),
} );
