<?php

$debug = $_POST['debug'] === 'true' ? boolval($_POST['debug']) : false;

function format_new_options_array($optionsObj, $optionName ) {
  return array_values(array_unique(array_merge(...$optionsObj[$optionName])));
} 

$args = array(
  'post_type' => 'manuals',
  'orderby' => 'title',
  'order' => 'ASC',
  'posts_per_page' => -1
);

if ( !empty($_POST['search_title']) )  {
  $args['s'] = $_POST['search_title']; 
}

$taxParams = [];
if (!empty($_POST['product_type'])) : $taxParams['product_type'] = $_POST['product_type']; endif;
if (!empty($_POST['product_series'])) : $taxParams['product_series'] = $_POST['product_series']; endif;
if (!empty($_POST['manual_type'])) : $taxParams['manual_type'] = $_POST['manual_type']; endif;

if (sizeof($taxParams) > 0):
  $args['tax_query'] = [];
  foreach ($taxParams as $key => $val):
    $args['tax_query'][] = [
      'taxonomy' => $key,
      'field' => 'slug',
      'terms' => $val,
    ];
  endforeach;
endif;

// prepare results object
$results = [
  'data' => [],
  'options' => [
    'product_type' => [],
    'product_series' => [],
    'manual_type' => [],
  ],
  'total' => 0,
];

// WP_Query
$query = new WP_Query( $args );

if ( $query->have_posts() ):
  $results['total'] = $query->found_posts;
  $fields = array('fields' => 'names');
  while ( $query->have_posts() ) : $query->the_post();
    $id = get_the_id();
    $pdf = get_field('manual_file');
    $product_type = wp_get_post_terms($id, 'product_type', $fields);
    $product_series = wp_get_post_terms($id, 'product_series', $fields);
    $manual_type = wp_get_post_terms($id, 'manual_type', $fields);
    
    $results['data'][] = [
      'title' => get_the_title(),
      'permalink' => get_the_permalink(),
      'description' => get_the_content(),
      'pdf' => $pdf,
      'product_type' => $product_type,
      'product_series' => $product_series,
      'manual_type' => $manual_type
    ];

    // start collecting new options
    $results['options']['product_type'][] = $product_type;
    $results['options']['product_series'][] = $product_series;
    $results['options']['manual_type'][] = $manual_type;

    wp_reset_postdata();
  endwhile;
endif;

// format new options
$results['options']['product_type'] = format_new_options_array($results['options'], 'product_type');
$results['options']['product_series'] = format_new_options_array($results['options'],'product_series');
$results['options']['manual_type'] = format_new_options_array($results['options'],'manual_type');

// search PDF text
$searchText = $_POST['search_text'];
if ( !empty($searchText) && $searchText !== '' )  {
  include('class.pdf2text.php');
  $searchString = strtolower( $searchText );
  $a = new PDF2Text();  
  $counter = 0;
  foreach ( $results['data'] as $result) {
    $a->setFilename($result['pdf']);
    $a->decodePDF();
    $output = $a->output(); 
    $output = strtolower($output); 
    // check if searchString is not in PDF text
    if ( strpos($output, $searchString ) !== true ) {
      // if not, remove this result
      array_splice($results['data'], $counter, 1);
    }
    $counter++;
  }
}

// Debug info
if ($debug):
  $results['debug'] = [
    'Params' => [$taxParams],
    'WP_Query' => [
      '$query' => $query,
      '$args' => $args,
    ]
  ];
endif;

echo json_encode($results);

wp_die();

?>
