<?php

function snoway_pdf_search_func( $atts ) {

  global $pluginSlug;

  wp_enqueue_style($pluginSlug . '-css');
  wp_enqueue_script('pdf-js');
  wp_localize_script( $pluginSlug . '-js', 'wp_data', array(
    'ajax_url' => admin_url( 'admin-ajax.php' ),
    'plugin_slug' => $pluginSlug,
  ));
  wp_enqueue_script($pluginSlug . '-js');

  $html = '<div id="' . $pluginSlug . '">';
    $html .= '<h2>🔍 Search Our Manuals</h2>';

    $html .= '<noscript>The PDF Search requires JavaScript to be enabled.</noscript>';

    // loading
    $html .= '<div id="loading" class="progress-line"></div>';

    // Search UI
    $html .= '<form id="' . $pluginSlug . '-form">';
    // Taxonomies fields
    $taxonomies = get_object_taxonomies('manuals', 'objects');
    foreach ($taxonomies as $tax):
      $name = $tax->name;
      $label = $tax->label;
      // skip product_names
      if ($name === 'product_name'):
        continue;
      endif;
      $html .= '<label>'. $label .'</label>'; 
      $html .= '<select id="' . $name . '" name="' . $name . '">';
        $html .= '<option value="">All ' . $label . '</option>';
        $terms = get_terms(array(
          'taxonomy' => $name,
          'hide_empty' => true
        ));
        foreach ($terms as $term):
          $html .= '<option value="' . $term->slug . '" data-label="' . $term->name . '">' . $term->name . '</option>';
        endforeach;
      $html .= '</select>';
    endforeach;
    $html .= '<label for="search_title">Search by title</label>';
    $html .= '<input id="search_title" name="search_title" type="text" placeholder="Search by title..." />';
    $html .= '<label for="manual_nunmber">Search by manual number</label>';
    $html .= '<input id="manual_number" name="manual_number" type="text" placeholder="Search by manual number..." />';
    $html .= '<div id="search_text_wrap">';
    $html .= '<label for="search_text">Keyword search</label>';
    $html .= '<input id="search_text" name="search_text" type="text" placeholder="Keyword search..." />';
    $html .= '</div>';
    $html .= '<button type="submit">Search</button>';
    $html .= '<button id="' . $pluginSlug . '-reset" type="button">Reset</button>';
    $html .= '</form>';

    // Results stats + list
    $html .= '<div id="' . $pluginSlug . '-results-stats"></div>';
    $html .= '<ul id="' . $pluginSlug . '-results"></ul>';

  $html .= '</div>';

  return $html;
}

add_shortcode( $pluginSlug, 'snoway_pdf_search_func' );

?>
