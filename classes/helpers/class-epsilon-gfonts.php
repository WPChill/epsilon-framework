<?php
if ( ! defined( 'WPINC' ) ) {
	die;
}

/**
 * Class Epsilon_GFonts
 */
class Epsilon_GFonts {
	public static function gfonts() {
		return apply_filters(
			'epsilon_gfont_pack', array(
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
					),
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
						'900',
					),
					'subsets'  => array(
						'cyrillic',
						'latin-ext',
						'cyrillic-ext',
						'greek-ext',
						'greek',
						'vietnamese',
						'latin',
					),
				),
				'Work Sans'           => array(
					'family'   => 'Work Sans',
					'import'   => 'Work+Sans:400,600&subset=latin',
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
					),
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
					),
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
					),
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
					),
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
					),
				),
				'Oswald'              => array(
					'family'   => 'Oswald',
					'import'   => 'Oswald:300,400,700&subset=latin-ext',
					'variants' => array(
						'300',
						'400',
						'700',
					),
					'subsets'  => array(
						'latin-ext',
						'latin',
					),
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
					),
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
					),
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
					),
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
					),
				),
				'PT Sans'             => array(
					'family'   => 'PT Sans',
					'import'   => 'PT+Sans:400,700&subset=latin-ext',
					'variants' => array(
						'400',
						'700',
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
					),
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
					),
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
					),
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
					),
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
					),
				),
				'Cabin'               => array(
					'family'   => 'Cabin',
					'import'   => 'Cabin:400,400i,500,500i,600,600i,700,700i&subset=latin-ext',
					'variants' => array(
						'regular',
						'italic',
						'500',
						'500italic',
						'600',
						'600italic',
						'700',
						'700italic',
					),
					'subsets'  => array(
						'vietnamese',
						'latin-ext',
						'latin',
					),
				),
				'Old Standard TT'     => array(
					'family'   => 'Old Standard TT',
					'import'   => 'Old+Standard+TT:400,400i,700&subset=latin-ext',
					'variants' => array(
						'regular',
						'italic',
						'700',
					),
					'subsets'  => array(
						'cyrillic-ext',
						'cyrillic',
						'vietnamese',
						'latin-ext',
						'latin',
					),
				),
				'Quicksand'           => array(
					'family'   => 'Quicksand',
					'import'   => 'Quicksand:300,400,500,700&subset=latin-ext',
					'variants' => array(
						'300',
						'regular',
						'500',
						'700',
					),
					'subsets'  => array(
						'vietnamese',
						'latin-ext',
						'latin',
					),
				),
				'Source Serif Pro'    => array(
					'family'   => 'Source Serif Pro',
					'import'   => 'Source+Serif+Pro:400,600,700&subset=latin-ext',
					'variants' => array(
						'regular',
						'600',
						'700',
					),
					'subsets'  => array(
						'latin-ext',
						'latin',
					),
				),
				'Domine'              => array(
					'family'   => 'Domine',
					'import'   => 'Domine:400,700&subset=latin-ext',
					'variants' => array(
						'regular',
						'700',
					),
					'subsets'  => array(
						'latin-ext',
						'latin',
					),
				),
				'Lustria'             => array(
					'family'   => 'Lustria',
					'import'   => 'Lustria',
					'variants' => array(
						'regular',
					),
					'subsets'  => array(
						'latin',
					),
				),
				'Ovo'                 => array(
					'family'   => 'Ovo',
					'import'   => 'Ovo',
					'variants' => array(
						'regular',
					),
					'subsets'  => array(
						'latin',
					),
				),
				'Quattrocento'        => array(
					'family'   => 'Quattrocento',
					'import'   => 'Quattrocento:400,700&subset=latin-ext',
					'variants' => array(
						'regular',
						'700',
					),
					'subsets'  => array(
						'latin-ext',
						'latin',
					),
				),
				'Quattrocento Sans'   => array(
					'family'   => 'Quattrocento Sans',
					'import'   => 'Quattrocento+Sans:400,400i,700,700i&subset=latin-ext',
					'variants' => array(
						'regular',
						'italic',
						'700',
						'700italic',
					),
					'subsets'  => array(
						'latin-ext',
						'latin',
					),
				),
				'Cantata One'         => array(
					'family'   => 'Cantata One',
					'import'   => 'Cantata+One&subset=latin-ext',
					'variants' => array(
						'regular',
					),
					'subsets'  => array(
						'latin-ext',
						'latin',
					),
				),
				'Josefin Slab'        => array(
					'family'   => 'Josefin Slab',
					'import'   => 'Josefin+Slab:100,100i,300,300i,400,400i,600,600i,700,700i',
					'variants' => array(
						'100',
						'100italic',
						'300',
						'300italic',
						'regular',
						'italic',
						'600',
						'600italic',
						'700',
						'700italic',
					),
					'subsets'  => array(
						'latin',
					),
				),
				'Dancing Script'      => array(
					'family'   => 'Dancing Script',
					'import'   => 'Dancing+Script:400,700&subset=latin-ext',
					'variants' => array(
						'regular',
						'700',
					),
					'subsets'  => array(
						'vietnamese',
						'latin-ext',
						'latin',
					),
				),
				'Muli'                => array(
					'family'   => 'Muli',
					'import'   => 'Muli:200,200i,300,300i,400,400i,600,600i,700,700i,800,800i,900,900i&subset=latin-ext',
					'variants' => array(
						'200',
						'200italic',
						'300',
						'300italic',
						'regular',
						'italic',
						'600',
						'600italic',
						'700',
						'700italic',
						'800',
						'800italic',
						'900',
						'900italic',
					),
					'subsets'  => array(
						'vietnamese',
						'latin-ext',
						'latin',
					),
				),
				'Nunito Sans'         => array(
					'family'   => 'Nunito Sans',
					'import'   => 'Nunito+Sans:200,200i,300,300i,400,400i,600,600i,700,700i,800,800i,900,900i&subset=latin-ext',
					'variants' => array(
						'200',
						'200italic',
						'300',
						'300italic',
						'regular',
						'italic',
						'600',
						'600italic',
						'700',
						'700italic',
						'800',
						'800italic',
						'900',
						'900italic',
					),
					'subsets'  => array(
						'vietnamese',
						'latin-ext',
						'latin',
					),
				),
				'Cantarell'           => array(
					'family'   => 'Cantarell',
					'import'   => 'Cantarell:400,400i,700,700i&subset=latin-ext',
					'variants' => array(
						'regular',
						'italic',
						'700',
						'700italic',
					),
					'subsets'  => array(
						'latin',
					),
				),
				'Istok Web'           => array(
					'family'   => 'Istok Web',
					'import'   => 'Istok+Web:Istok+Web:400,400i,700,700i',
					'variants' => array(
						'400',
						'400i',
						'700',
						'700i',
					),
					'subsets'  => array(
						'cyrillic',
						'cyrillic-ext',
						'latin-ext',
						'latin',
					),
				),
				'Abril Fatface'       => array(
					'family'   => 'Abril Fatface',
					'import'   => 'Abril+Fatface',
					'variants' => array(
						'regular',
					),
				),
				'Sintony'             => array(
					'family'   => 'Sintony',
					'import'   => 'Sintony:400,700&subset=latin-ext',
					'variants' => array(
						'regular',
						'700',
					),
					'subsets'  => array(
						'latin-ext',
						'latin',
					),
				),
				'EB Garamond'         => array(
					'family'   => 'EB Garamond',
					'import'   => 'EB+Garamond:400,400i,500,500i,600,600i,700,700i,800,800i&subset=latin-ext',
					'variants' => array(
						'regular',
						'italic',
						'500',
						'500italic',
						'600',
						'600italic',
						'700',
						'700italic',
						'800',
						'800italic',
					),
					'subsets'  => array(
						'cyrillic-ext',
						'greek',
						'greek-ext',
						'cyrillic',
						'vietnamese',
						'latin-ext',
						'latin',
					),
				),
				'Hind'                => array(
					'family'   => 'Hind',
					'import'   => 'Hind:300,400,500,600,700&subset=latin-ext',
					'variants' => array(
						'300',
						'regular',
						'500',
						'600',
						'700',
					),
					'subsets'  => array(
						'latin-ext',
						'devanagari',
						'latin',
					),
				),
				'Libre Baskerville'   => array(
					'family'   => 'Libre Baskerville',
					'import'   => 'Libre+Baskerville:400,400i,700&subset=latin-ext',
					'variants' => array(
						'regular',
						'italic',
						'700',
					),
					'subsets'  => array(
						'latin-ext',
						'latin',
					),
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
			)
		);
	}
}
