<?php

$debug = $_POST['debug'] === 'true' ? boolval($_POST['debug']) : false;

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
      'taxonomy' => $key,  // taxonomy name
      'field' => 'slug', // term_id, slug or name
      'terms' => $val, // term id, term slug or term name
    ];
  endforeach;
endif;

$query = new WP_Query( $args );

$results = [
  'data' => [],
  'total' => 0,
];

if ( $query->have_posts() ):
  $results['total'] = $query->found_posts;
  while ( $query->have_posts() ) : $query->the_post();
    $pdf = get_field('manual_file');
    $results['data'][] = [
      'title' => get_the_title(),
      'permalink' => get_the_permalink(),
      'description' => get_the_content(),
      'type' => 'Type here...',
      'pdf' => $pdf
    ];
    wp_reset_postdata();
  endwhile;
endif;

// search PDF text
$searchText = $_POST['search_text'];
if ( !empty($searchText) && $searchText !== '' )  {
  include('class.pdf2text.php');
  $searchString = strtolower( $_POST['search_text'] );
  $a = new PDF2Text();  
  $counter = 0;
  foreach ( $results['data'] as $result) {
    $a->setFilename($result['pdf']);
    $a->decodePDF();
    $output = $a->output(); 
    $output = strtolower($output); 
    // check if searchString is in PDF text
    if ( strpos($output, $searchString ) !== true ) {
      // if not, remove this result
      array_splice($results['data'], $counter, 1);
    }
    $counter++;
  }
}

// response
if ($debug):
  $results['debug'] = [
    'Params' => [
      $taxParams,
      'debug' => $debug
    ],
    'WP_Query' => [
      '$query' => $query,
      '$args' => $args,
    ],
    'Search PDF Text' => $_POST['search_text']
  ];
endif;

echo json_encode($results);
wp_die();

?>
