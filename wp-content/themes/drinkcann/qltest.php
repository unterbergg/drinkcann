<?php
$spaceID = "mt0pmhki5db7";
$accessToken = "secret-eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJBUEktQ0xJRU5UIiwiZXhwIjozMzIwMjk5MDQ4NCwiaWF0IjoxNjQ2MDgxNjg0LCJpc3MiOiJodHRwczovL2R1dGNoaWUuY29tIiwianRpIjoiMDllNDIyNzUtYjQ5My00YjVmLTg1ZDItYzI4MzA2ZmU3OGM1IiwiZW50ZXJwcmlzZV9pZCI6IjM3NTI5MDRhLWZiNzItNDI4ZS05OTI0LTk4NzE0M2YxZGFlYSIsInV1aWQiOiI0NGNiYWY5Mi00MGRiLTRiYmYtOWMxYy1mODAyMzAzZjg5M2QifQ.oqZNyZRKmDJYp-QNATN-ox9yl5mxZ4wWuWjpMHQdKCA";

$endpoint = "https://plus.dutchie.com/plus/2021-07/graphql";
$query = 'fragment productFragment on Product {
  brand {
    id
    name
  }
  category
  description
  descriptionHtml
  id
  image
  name
  posId
  potencyCbd {
    formatted
    range
    unit
  }
  potencyThc {
    formatted
    range
    unit
  }
  staffPick
  strainType
  subcategory
  variants {
    id
    option
    priceMed
    priceRec
    specialPriceMed
    specialPriceRec
  }
}

query ExampleMenuQuery {
  menu(retailerId:"438b74c7-77b2-48b8-85fc-644266a68c98") {
    products {
      ...productFragment
    }
  }
}';

$data = array ('query' => $query);
$data = http_build_query($data);

$options = array(
    'http' => array(
        'header'  => sprintf("Authorization: Bearer %s",$accessToken),
        'method'  => 'POST',
        'content' => $data
    )
);

$context  = stream_context_create($options);
$result = file_get_contents(sprintf($endpoint), false, $context);

if ($result === FALSE) { /* Handle error */ }

var_dump($result);

?>