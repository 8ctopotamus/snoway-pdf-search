<?php

$postsPerPage = $_POST['postsPerPage'] ? intval($_POST['postsPerPage']) : 12;
$paged = $_POST['paged'] ? intval($_POST['paged']) : 0;
$debug = $_POST['debug'] === 'true' ? boolval($_POST['debug']) : false;

$results = [
  'data' => [],
  'total' => 0
];

$args = array(
  'post_type' => 'manuals',
  'posts_per_page' => $postsPerPage,
  'paged' => $paged,
  'orderby' => 'title',
  'order' => 'ASC',
);
//
// if ($cat):
//   $args['tax_query'] = array(
//     array (
//       'taxonomy' => 'livestock_categories',
//       'terms' => $cat,
//     )
//   );
// endif;
//
// if ($includeMeta):
//   $args['meta_query']	= array(
//     'relation'		=> 'AND',
//   );
//   foreach ($fieldsWeCareAbout as $field):
//     if ($_POST[$field]):
//       $args['meta_query'][] = [
//         'key' => $field,
//         'value' => $_POST[$field],
//         'compare' => 'LIKE'
//       ];
//     endif;
//   endforeach;
// endif;

$query = new WP_Query( $args );

if ( $query->have_posts() ):
  $results['total'] = $query->found_posts;
  while ( $query->have_posts() ) : $query->the_post();
    $results['data'][] = [
      'title' => get_the_title(),
      'permalink' => get_the_permalink(),
    ];
    wp_reset_postdata();
  endwhile;
endif;

if ($debug):
  $results['debug'] = [
    'WP_Query' => [
      '$query' => $query,
      '$args' => $args,
    ]
  ];
endif;

echo json_encode($results);
wp_die();

?>
