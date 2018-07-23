<?php
        include('/var/www/twiverse.php');
        include('../common.php');
        $s = [
        	'exception' => [
        		'ja' => "お絵かきファイルが選択されていません。",
        		'en' => "Drawing file is not selected.",
        	],
			//'' => ['ja' => "", 'en' => "", ],
		];

        try{
		if (!isset($_SESSION['draw'])) throw new Exception('お絵かきファイルが選択されていません。');

		if (isset($_SESSION['post_image'])){
			$thumb_path = tempnam('/tmp', 'php').'.jpg';
			file_put_contents($thumb_path, base64_decode($_SESSION['post_image']));
		}else $thumb_path = null;
		$draw_path = tempnam('/tmp', 'php').'.png';
		file_put_contents($draw_path, base64_decode($_SESSION['draw']));
		exec('sync');
                post_draw($thumb_path, $draw_path);
        }catch(Exception $e){
                catch_default($e);
        }
?>
