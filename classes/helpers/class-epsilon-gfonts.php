<?php
if ( ! defined( 'WPINC' ) ) {
	die;
}

/**
 * Class Epsilon_GFonts
 */
class Epsilon_GFonts {
	public static function gfonts() {
		return apply_filters( 'epsilon_gfont_pack', array(
			'Poppins'             => array(
				'family'   => 'Poppins',
				'import'   => 'Poppins:300,400,500,600,700&subset=latin-ext',
				'variants' => array(
					'300',
					'400',
					'500',
					'700',
				),
				'subsets'  => array(
					'latin-ext',
					'latin',
				)
			),
			'Roboto'              => array(
				'family'   => 'Roboto',
				'import'   => 'Roboto:100,300,400,500,700,900&subset=latin-ext',
				'variants' => array(
					'100',
					'300',
					'400',
					'500',
					'700',
					'900'
				),
				'subsets'  => array(
					'cyrillic',
					'latin-ext',
					'cyrillic-ext',
					'greek-ext',
					'greek',
					'vietnamese',
					'latin',
				)
			),
			'Open Sans'           => array(
				'family'   => 'Open Sans',
				'import'   => 'Open+Sans:300,400,600,700,800&subset=latin-ext',
				'variants' => array(
					'300',
					'400',
					'600',
					'700',
					'800',
				),
				'subsets'  => array(
					'cyrillic',
					'latin-ext',
					'cyrillic-ext',
					'greek-ext',
					'greek',
					'vietnamese',
					'latin',
				)
			),
			'Lato'                => array(
				'family'   => 'Lato',
				'import'   => 'Lato:100,300,400,700,900&subset=latin-ext',
				'variants' => array(
					'100',
					'300',
					'400',
					'700',
					'900',
				),
				'subsets'  => array(
					'latin-ext',
					'latin',
				)
			),
			'Slabo 27px'          => array(
				'family'   => 'Slabo 27px',
				'import'   => 'Slabo+27px:400&subset=latin-ext',
				'variants' => array(
					'400',
				),
				'subsets'  => array(
					'latin-ext',
					'latin',
				)
			),
			'Oswald'              => array(
				'family'   => 'Oswald',
				'import'   => 'Oswald:300,400,700&subset=latin-ext',
				'variants' => array(
					'300',
					'400',
					'700'
				),
				'subsets'  => array(
					'latin-ext',
					'latin'
				)
			),
			'Roboto Condensed'    => array(
				'family'   => 'Roboto Condensed',
				'import'   => 'Roboto+Condensed:300,400,700&subset=latin-ext',
				'variants' => array(
					'300',
					'400',
					'700',
				),
				'subsets'  => array(
					'cyrillic',
					'latin-ext',
					'cyrillic-ext',
					'greek-ext',
					'greek',
					'vietnamese',
					'latin',
				)
			),
			'Source Sans Pro'     => array(
				'family'   => 'Source Sans Pro',
				'import'   => 'Source+Sans+Pro:200,300,400,600,700,900&subset=latin-ext',
				'variants' => array(
					'200',
					'300',
					'400',
					'600',
					'700',
					'900',
				),
				'subsets'  => array(
					'latin-ext',
					'vietnamese',
					'latin',
				)
			),
			'Montserrat'          => array(
				'family'   => 'Montserrat',
				'import'   => 'Montserrat:400,700',
				'variants' => array(
					'400',
					'700',
				),
				'subsets'  => array(
					'latin',
				)
			),
			'Raleway'             => array(
				'family'   => 'Raleway',
				'import'   => 'Raleway:100,200,300,400,500,600,700,800,900&subset=latin-ext',
				'variants' => array(
					'100',
					'200',
					'300',
					'400',
					'500',
					'600',
					'700',
					'800',
					'900',
				),
				'subsets'  => array(
					'latin-ext',
					'latin',
				)
			),
			'PT Sans'             => array(
				'family'   => 'PT Sans',
				'import'   => 'PT+Sans:400,700&subset=latin-ext',
				'variants' => array(
					'400',
					'700'
				),
				'subsets'  => array(
					'cyrillic',
					'latin-ext',
					'cyrillic-ext',
					'latin',
				),
			),
			'Roboto Slab'         => array(
				'family'   => 'Roboto Slab',
				'import'   => 'Roboto+Slab:100,300,400,700&subset=latin-ext',
				'variants' => array(
					'100',
					'300',
					'400',
					'700',
				),
				'subsets'  => array(
					'cyrillic',
					'latin-ext',
					'cyrillic-ext',
					'greek-ext',
					'greek',
					'vietnamese',
					'latin',
				)
			),
			'Open Sans Condensed' => array(
				'family'   => 'Open Sans Condensed',
				'import'   => 'Open+Sans+Condensed:300,700&subset=latin-ext',
				'variants' => array(
					'300',
					'700',
				),
				'subsets'  => array(
					'cyrillic',
					'latin-ext',
					'cyrillic-ext',
					'greek-ext',
					'greek',
					'vietnamese',
					'latin',
				)
			),
			'Droid Sans'          => array(
				'family'   => 'Droid Sans',
				'import'   => 'Droid+Sans:400,700',
				'variants' => array(
					'400',
					'700',
				),
				'subsets'  => array(
					'latin',
				)
			),
			'Merriweather'        => array(
				'family'   => 'Merriweather',
				'import'   => 'Merriweather:300,400,700,900&subset=latin-ext',
				'variants' => array(
					'300',
					'400',
					'700',
					'900',
				),
				'subsets'  => array(
					'cyrillic',
					'latin-ext',
					'cyrillic-ext',
					'latin',
				),
			),
			'Lora'                => array(
				'family'   => 'Lora',
				'import'   => 'Lora:400,700&subset=latin-ext',
				'variants' => array(
					'400',
					'700',
				),
				'subsets'  => array(
					'cyrillic',
					'latin-ext',
					'latin',
				),
			),
			'Ubuntu'              => array(
				'family'   => 'Ubuntu',
				'import'   => 'Ubuntu:300,400,500,700&subset=latin-ext',
				'variants' => array(
					'300',
					'400',
					'500',
					'700',
				),
				'subsets'  => array(
					'cyrillic',
					'latin-ext',
					'cyrillic-ext',
					'greek-ext',
					'greek',
					'latin',
				)
			),
			'Droid Serif'         => array(
				'family'   => 'Droid Serif',
				'import'   => 'Droid+Serif:400,700',
				'variants' => array(
					'400',
					'700',
				),
				'subsets'  => array(
					'latin',
				),
			),
			'Noto Sans'           => array(
				'family'   => 'Noto Sans',
				'import'   => 'Noto+Sans:400,700&subset=latin-ext',
				'variants' => array(
					'400',
					'700',
				),
				'subsets'  => array(
					'cyrillic',
					'devanagari',
					'latin-ext',
					'cyrillic-ext',
					'greek-ext',
					'greek',
					'vietnamese',
					'latin',
				)
			),
			'Playfair Display'    => array(
				'family'   => 'Playfair Display',
				'import'   => 'Playfair+Display:400,700,900&subset=latin-ext',
				'variants' => array(
					'400',
					'700',
					'900',
				),
				'subsets'  => array(
					'cyrillic',
					'latin-ext',
					'latin',
				)
			),
			'Arimo'               => array(
				'family'   => 'Arimo',
				'import'   => 'Arimo:400,700&subset=latin-ext',
				'variants' => array(
					'400',
					'700',
				),
				'subsets'  => array(
					'cyrillic',
					'latin-ext',
					'cyrillic-ext',
					'greek-ext',
					'greek',
					'vietnamese',
					'hebrew',
					'latin',
				),
			),
		) );
	}
}
