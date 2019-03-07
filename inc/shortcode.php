<?php

function snoway_pdf_search_func( $atts ) {
  global $pluginSlug;

  wp_enqueue_style($pluginSlug . '-css');
  wp_localize_script( $pluginSlug . '-js', 'wp_data', array(
    'ajax_url' => admin_url( 'admin-ajax.php' ),
    'plugin_slug' => $pluginSlug,
  ));
  wp_enqueue_script($pluginSlug . '-js');

  $html = '<div id="' . $pluginSlug . '">';
    $html .= '<noscript>The PDF Search requires JavaScript to be enabled.</noscript>';

    // loading
    $html .= '<div id="loading" class="progress-line"></div>';

    // Search UI
    $html .= '<form id="' . $pluginSlug . '-form">';
      $html .= '<input id="search-text" name="search-text" type="text" placeholder="Search ..." />';
      // Taxonomies fields
      $taxonomies = get_object_taxonomies('manuals', 'objects');
      foreach ($taxonomies as $tax):
        $name = $tax->name;
        $label = $tax->label;
        // skip product_names
        if ($name === 'product_name'):
          continue;
        endif;
        $html .= '<select id="' . $name . '" name="' . $name . '">';
          $html .= '<option value="">All ' . $label . '</option>';
          $terms = get_terms(array(
            'taxonomy' => $name,
            'hide_empty' => true
          ));
          foreach ($terms as $term):
            $html .= '<option value="' . $term->slug . '">' . $term->name . '</option>';
          endforeach;
        $html .= '</select>';
      endforeach;
      $html .= '<button type="submit">Search</button>';
    $html .= '</form>';



    // echo '<pre>';
    // var_dump(get_object_taxonomies('manuals', 'objects'));
    // echo '</pre>';

    // Results stats
    // $html .= '<div id="results-stats-container">';
    //   $html .= '<div id="results-stats"></div>';
    //   $html .= '<div class="au-results-actions">';
    //     $html .= '<button class="au-pagination-button" data-dir="-1">&#9668;</button>';
    //     $html .= '<div id="page-count"></div>';
    //     $html .= '<button class="au-pagination-button" data-dir="1">&#9658;</button>';
    //     $html .= '<button id="reset-au-search-results" type="button">🔄 Reset</button>';
    //   $html .= '</div>';
    // $html .= '</div>';

    // Results grid
    // $html .= '<ul id="au-search-results-grid" class="livestock-grid">';

    // All categories
    // $html .= '<li>';
    //   $html .= '<a href="#" data-catname="All Livestock" class="catSelector">';
    //     $html .= '<img src="' . plugins_url('/img/all-category.jpg',  __DIR__ ) . '" class="livestock-thumbnail" alt="All Categories" />';
    //     $html .= '<span class="livestock-title">All Livestock</span>';
    //   $html .= '</a>';
    // $html .= '</li>';

    // Initial Cats
    // foreach ( $terms as $term ):
    //   $theID = $term->term_id;
    //   $html .= '<li>';
    //     $html .= '<a href="#" class="catSelector" data-catid="' . $theID . '" data-catname="' . $term->name . '">';
    //       $html .= '<img src="' . do_shortcode(sprintf("[wp_custom_image_category term_id='%s' size='medium' onlysrc='true']", $theID)) . '" class="livestock-thumbnail" alt="' . $term->name . '" />';
    //       $html .= '<span class="livestock-title">' . $term->name . '</span>';
    //     $html .= '</a>';
    //   $html .= '</li>';
    // endforeach;

    // $html .= '</ul>';
  $html .= '</div>';

  return $html;
}

add_shortcode( $pluginSlug, 'snoway_pdf_search_func' );

?>
