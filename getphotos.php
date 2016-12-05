<?php
session_start();
//recieve the index (which should be the same index on the server), and the seed
$index = filter_input(INPUT_GET, "index", FILTER_VALIDATE_INT);
$seed = filter_input(INPUT_GET, "seed", FILTER_VALIDATE_INT); //Equals the timestamp

$current_MD5 = md5_file($_SERVER['DOCUMENT_ROOT'].$_SERVER['PHP_SELF']);
class variables {
	var $random_slides = true;
	
	//Notes: This code does not support albums with only 1 photo
	//Because of JSON navigation changes with only 1 photo album
	//So I'm too lazy to fix that
	
	var $userid_albumid = array (
	'USERID'=>array(
		'ALBUMID1',
		'ALBUMID1'
		)
	);
	var $add_remove_limit = 13;
	var $stage_limit = 50;
	var $json_parsed = NULL;
}
$variables = new variables();
check_for_json($variables, $current_MD5);
$to_add = determine_what_to_add($index, $variables->json_parsed->timestamp, $variables);
echo client_json($to_add[0], $to_add[1], $variables);
?>
<?php
function seededShuffle(array &$array, $seed) {
    if($seed){
		mt_srand($seed);
	}
    $size = count($array);
    for ($i = 0; $i < $size; ++$i) {
        list($chunk) = array_splice($array, mt_rand(0, $size-1), 1);
        array_push($array, $chunk);
    }
}
/*
We should store the response from Google Picasa
Request for new response every day or when MD5 changes.
*/
function check_for_json(&$variables, &$current_MD5){
	if(isset($_SESSION['json'])){
		//Check if we can read the JSON
		$variables->json_parsed = json_decode($_SESSION['json']);
		if($variables->json_parsed == NULL){
			//Request for new photos
			return request_Google($variables, $current_MD5);
		}
		else{
			//Has the MD5 changed?
			if($variables->json_parsed->MD5 == $current_MD5){
				//Check time
				$milliseconds = round(microtime(true) * 1000);
				// If the cache is newer than 1 day old, use the cache
				if($variables->json_parsed->timestamp > ($milliseconds-1000*60*60*24)){ /*miliseconds, seconds, minutes, hours*/
					return json_encode($variables->json_parsed);
				}
				else{
					//Request for new photos
					return request_Google($variables, $current_MD5);
				}
			}
			else{
				//Request for new photos
				return request_Google($variables, $current_MD5);
			}
		}
	}
	else{
		//Request for new photos
		return request_Google($variables, $current_MD5);
	}
}
function request_Google(&$variables, &$current_MD5){
	$milliseconds = round(microtime(true) * 1000);
	$variables->json_parsed = ['timestamp'=>$milliseconds, 'MD5'=>$current_MD5, 'total_pictures'=>0];
	foreach($variables->userid_albumid as $user_id=>$album_array){
		for($i = 0; $i<count($album_array); $i++){
			$xml_string = file_get_contents("http://picasaweb.google.com/data/feed/api/user/".$user_id."/albumid/".$album_array[$i]);
			$xml = simplexml_load_string($xml_string);
			unset($xml_string);
			$json_string = json_encode($xml);
			$json = json_decode($json_string);
			$variables->json_parsed[$album_array[$i]] = $json;
		}
	}
	$json_encoded = json_encode($variables->json_parsed);
	$_SESSION['json'] = $json_encoded;
	$variables->json_parsed = json_decode($json_encoded);
	sum_of_photos($variables);
	$json_encoded = json_encode($variables->json_parsed);
	$_SESSION['json'] = $json_encoded;
	return $json_encoded;
}
function sum_of_photos(&$variables){
	$variables->json_parsed->total_pictures = 0;
	foreach ($variables->albumids as $albumid){
		$variables->json_parsed->total_pictures += count($variables->json_parsed->$albumid->entry);
	}
	return;
}
function convert_stage_index_to_albums_id($stage_number, &$variables){
	$the_album_id = NULL;
	$previous_count = 0;
	$local_album_index = 0;
	foreach ($variables->albumids as $albumid){
		$count = count($variables->json_parsed->$albumid->entry);
		if($stage_number <= $count){
			$the_album_id = $albumid;
			$local_album_index = $stage_number - $previous_count - 1;
			break;
		}
		$previous_count = $count;
	}
	$array = ['albumid'=>$the_album_id, 'local_album_index'=> $local_album_index];
	return $array;
}
function client_json(&$to_add, $new_index, &$variables){
	$stage = [];
	$milliseconds = round(microtime(true) * 1000);
	$stage = ['timestamp'=>$milliseconds, 'MD5'=>$variables->json_parsed->MD5,'seed'=>$variables->json_parsed->timestamp, 'total_pictures'=>$variables->json_parsed->total_pictures, 'next_request_index'=>$new_index, 'entry'=>[]];
	foreach ($to_add as $stage_index){
		$album_indexs = convert_stage_index_to_albums_id($stage_index, $variables);
		$url = $variables->json_parsed->$album_indexs['albumid']->entry[$album_indexs['local_album_index']]->content->{'@attributes'}->src;
		if(isset($url)){
			$url_parts = pathinfo($url);
			$requesting_url = $url_parts['dirname'].'/s1024/'.$url_parts['basename'];
			//$stage['entry'][$stage_index]=$requesting_url;
			array_push($stage['entry'],$requesting_url);
		}
	}
	return json_encode($stage);
}
function determine_what_to_add($index, $seed, &$variables){
	//New
	$stage_array = [];
	$stage_array = range (0, $variables->json_parsed->total_pictures);
	//If random, //If not random, do nothing
	if($variables->random_slides){
		seededShuffle($stage_array, $seed);
	}
	$limit = count($stage_array);
	if($limit > $variables->stage_limit){
		$limit = $variables->stage_limit;
	}
	if(!isset($index)){
		$index = 0;
	}
	$new_index = NULL;
	if($index + $limit >= $variables->json_parsed->total_pictures){
		$new_index = 0;
	}
	else{
		$new_index = $index + $limit; //New index is going to be the requesting offset
	}
	
	$to_add = array_slice($stage_array, $index, $limit);
	return [$to_add, $new_index];
}

?>