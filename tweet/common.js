var thumb = document.getElementById('thumb');
var comm_ids = [];

$(function(){
	$('#reply').html('\n\
		<span style="font-size: small; ">リプライ</span><input id="reply-id" type="text" placeholder="ツイートのURLorID">\n\
	');
	$('#sendform').append('<input id="reply-id-hidden" name="reply_id" type="hidden">');
	$('#reply-id').change(function(){
		$(this).val($(this).val().split('/').pop().split('?').shift());
		$('#reply-id-hidden').val($(this).val());

		$.post(tweet_url+'getreply.php', {id: $(this).val()}, function(res){
			if (res.screen_name != null){
				$('#text').val('@'+res.screen_name+' '+$('#text').val());
				$('#text').keyup();
				alert('次のツイートにリプライします。\n「@'+res.screen_name+'」を消すとリプライが無効になりますのでご注意ください。\n\n@'+res.screen_name+' さんのツイート\n「'+res.status.text+'」');
			}else{
				alert('リプライ対象ツイートが見つかりませんでした。');
			}
		}, 'json');

		
	});

	var imgform = document.getElementById('imgform');
	var selimg = document.getElementById('selimg');
	selimg.onchange = function(){
		imgform.submit();
		thumb.setAttribute('src', tweet_url + 'loader.gif');
		$('#suggest').html('');

		send.setAttribute('disabled', 'disabled');
		selimg.setAttribute('disabled', 'disabled');	
	};
});

var imgform_send = $('iframe[name="imgform_send"]');
imgform_send.unbind().bind('load', function(){
	var res = JSON.parse(imgform_send.contents().find('body').html());
	thumb.setAttribute('src', 'data:image/jpeg;base64,' + res.image);
	updateText(res.option);

	comm_ids = [];
	var title = '';
	res.comms.forEach(function(comm){
		comm_ids.push(comm.id);
		title += comm.name+' ';
	});
	if (title == '') title = '投稿';
	$('#title').html(title);

	send.disabled = false;
	selimg.disabled = false;
});

$(function(){
	$('#text').val('#bluehood ');
	if (comm_name){
		$('#title').html(comm_name + 'の投稿');
	}
	if (thumb_data){
		thumb.setAttribute('src', 'data:image/jpeg;base64,'+thumb_data);
	}
	if (option){
		updateText(option);
	}
});

var updateText = function(option){
	$('#suggest').html('<select id="suggest-sel"><option value="">クイック入力</option></select>');
	option.forEach(function(option, i){
		var color = '#55acee';
		$('#suggest-sel').append('<option value="'+option+'" style="color: '+color+'; ">'+option+'</option>');
	});
	$('#suggest-sel').change(function(){
		var pos=$('#text').get(0).selectionStart;
		var val=$('#text').val();
		$('#text').val(val.substr(0,pos)+$(this).val()+val.substr(pos));
		$('#text').keyup();
	});
};
