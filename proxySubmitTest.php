<?PHP
$body = @file_get_contents('php://input');
$enable_jsonp    = true;
$enable_native   = true;
$valid_url_regex = '/.*/';
$_GET['mode']="native";
$_GET['url']="http://89.31.77.165/ushahidi-v2/api";

$_POST['task']="report";

$_POST["incident_category"]="3";
$_POST["custom_field[1]"]="elementi costruiti";
$_POST["custom_field[2]"]="media";	
$_POST["custom_field[3]"]="Nessuna";
$_POST["custom_field[4]"]="12";
$_POST["custom_field[5]"]="nessuna";
$_POST["form_id"]="2";

$_POST['geometry[0]']='{"geometry":"POINT(12.285766601561898 41.92803832137982)","label":"","comment":"","lat":"","lon":"","color":"","strokewidth":"2.5","prop1":"val1","prop2":"val2"}';
$_POST['geometry[1]']='{"geometry":"POINT(12.463607788086192 41.888690458676464)","label":"","comment":"","lat":"","lon":"","color":"","strokewidth":"2.5"}';
//$_POST['geometry[2]']='{"geometry":"POINT(12.472534179687134 41.90657885734052)","label":"","comment":"","lat":"","lon":"","color":"","strokewidth":"2.5"}';
//$_POST['geometry[3]']='{"geometry":"LINESTRING(12.307052612304888 41.90504576236546,12.523345947265117 41.890223946325555,12.617416381835328 41.899935179901775)","label":"","comment":"","lat":"","lon":"","color":"","strokewidth":"2.5","dashstyle":"dot"}';

$_POST['custom_field[19]']='{"geometry":"POINT(12.285766601561898 41.92803832137982)","label":"","comment":"","lat":"","lon":"","color":"","strokewidth":"2.5","prop1":"val1","prop2":"val2"}';
//$_POST['incident_news[1]']='{"geometry1":"POINT(12.285766601561898 41.92803832137982)","label":"","comment":"","lat":"","lon":"","color":"","strokewidth":"2.5","prop1":"val1","prop2":"val2"}';

$_POST["incident_ampm"]="am";
	
$_POST["incident_date"]="03/24/2014";
	
$_POST["incident_description"]="test report";
	
$_POST["incident_hour"]="7";
$_POST["incident_zoom"]="10";

$_POST["incident_minute"]="30";
$_POST["incident_title"]="test report";
$_POST["location_name"]="test report";
$_POST["resp"]="json";
$_POST['latitude']=41.87853017322092;
$_POST['longitude']=12.523860931395927;


// ############################################################################

$url = $_GET['url'];

if ( !$url ) {

    // Passed url not specified.
    $contents = 'ERROR: url not specified';
    $status = array( 'http_code' => 'ERROR' );

} else if ( !preg_match( $valid_url_regex, $url ) ) {

    // Passed url doesn't match $valid_url_regex.
    $contents = 'ERROR: invalid url';
    $status = array( 'http_code' => 'ERROR' );

} else {
    $ch = curl_init( $url );

    //if ( strtolower($_SERVER['REQUEST_METHOD']) == 'post' ) {
        curl_setopt( $ch, CURLOPT_POST, true );
		if ($body==''){
			$body = $_POST;
		}
        curl_setopt( $ch, CURLOPT_POSTFIELDS, $body );
    //}

    if ( isset($_GET['send_cookies']) && $_GET['send_cookies'] ) {
        $cookie = array();
        foreach ( $_COOKIE as $key => $value ) {
            $cookie[] = $key . '=' . $value;
        }
        if ( $_GET['send_session'] ) {
            $cookie[] = SID;
        }
        $cookie = implode( '; ', $cookie );

        curl_setopt( $ch, CURLOPT_COOKIE, $cookie );
    }

    curl_setopt( $ch, CURLOPT_FOLLOWLOCATION, true );
    curl_setopt( $ch, CURLOPT_HEADER, true );
    curl_setopt( $ch, CURLOPT_RETURNTRANSFER, true );
    if (!isset($_GET['user_agent'])) $_GET['user_agent']='firefox';
    curl_setopt( $ch, CURLOPT_USERAGENT, $_GET['user_agent'] ? $_GET['user_agent'] : $_SERVER['HTTP_USER_AGENT'] );

    list( $header, $contents ) = preg_split( '/([\r\n][\r\n])\\1/', curl_exec( $ch ), 2 );

    $status = curl_getinfo( $ch );

    curl_close( $ch );
}

// Split header text into an array.
$header_text = preg_split( '/[\r\n]+/', $header );
die($contents);
if (isset($_GET['mode']) &&  $_GET['mode'] == 'native' ) {
    if ( !$enable_native ) {
        $contents = 'ERROR: invalid mode';
        $status = array( 'http_code' => 'ERROR' );
    }

    // Propagate headers to response.
    foreach ( $header_text as $header ) {
        if ( preg_match( '/^(?:Content-Type|Content-Language|Set-Cookie):/i', $header ) ) {
            header( $header );
        }
    }

    print $contents;

} else {

    // $data will be serialized into JSON data.
    $data = array();

    // Propagate all HTTP headers into the JSON data object.
    if ( isset($_GET['full_headers']) && $_GET['full_headers'] ) {
        $data['headers'] = array();

        foreach ( $header_text as $header ) {
            preg_match( '/^(.+?):\s+(.*)$/', $header, $matches );
            if ( $matches ) {
                $data['headers'][ $matches[1] ] = $matches[2];
            }
        }
    }

    // Propagate all cURL request / response info to the JSON data object.
    if ( isset($_GET['full_status']) && $_GET['full_status'] ) {
        $data['status'] = $status;
    } else {
        $data['status'] = array();
        $data['status']['http_code'] = $status['http_code'];
    }

    // Set the JSON data object contents, decoding it from JSON if possible.
    $decoded_json = json_decode( $contents );
    $data['contents'] = $decoded_json ? $decoded_json : $contents;

    // Generate appropriate content-type header.
    if (!isset($_SERVER['HTTP_X_REQUESTED_WITH'])) $_SERVER['HTTP_X_REQUESTED_WITH']='xmlhttprequest';
    $is_xhr = strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest';
    header( 'Content-type: application/' . ( $is_xhr ? 'json' : 'x-javascript' ) );

    // Get JSONP callback.
    $jsonp_callback = $enable_jsonp && isset($_GET['callback']) ? $_GET['callback'] : null;

    // Generate JSON/JSONP string
    $json = json_encode( $data );

    print $jsonp_callback ? "$jsonp_callback($json)" : $json;

}

?>
