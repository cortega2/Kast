<?php
	$KEY = 'KEY_GOES_HERE';
	$ENDPOINT = 'https://api.forecast.io/forecast/';

	// https://api.forecast.io/forecast/' + key +'/'+ lat +',' + lng;

	if (strcmp($_GET['query'], 'current') == 0) {
	        $lat = $_GET['lat'];
	        $lng = $_GET['lng'];
	        $link = $ENDPOINT .$KEY .'/' .$lat .',' .$lng;
	}
	else if (strcmp($_GET['query'], 'past') == 0) {
	        $lat = $_GET['lat'];
	        $lng = $_GET['lng'];
	        $date = $_GET['date'];
	        $link = $ENDPOINT .$KEY .'/' .$lat .',' .$lng .',' .$date;
	}


	$ch = curl_init();

    curl_setopt ($ch, CURLOPT_URL, $link);
    curl_setopt ($ch, CURLOPT_HEADER, 0);
    curl_setopt($ch, CURLOPT_USERAGENT, 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/43.0.2357.125 Safari/537.36');

    ob_start();

    curl_exec ($ch);
    curl_close ($ch);

    $string = ob_get_contents();

    ob_end_clean();
    
    echo $string;     
?>