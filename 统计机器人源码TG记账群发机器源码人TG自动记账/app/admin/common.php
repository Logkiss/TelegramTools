<?php
// +----------------------------------------------------------------------
// | 应用公共文件
// +----------------------------------------------------------------------
// | Copyright (c) 2006-2016 http://thinkphp.cn All rights reserved.
// +----------------------------------------------------------------------
// | Licensed ( http://www.apache.org/licenses/LICENSE-2.0 )
// +----------------------------------------------------------------------
// | Author: 
// +----------------------------------------------------------------------


use think\helper\Str;

error_reporting(0);



//根据键名获取键值
function getItemVal($val,$item_config){
	if(!is_null($val)){
		$str = '';
		foreach(explode(',',$val) as $v){
			foreach(json_decode($item_config,true) as $m){
				if($v == $m['val']){
					$str .= $m['key'].',';
				}
			}
		}
		return rtrim($str,',');
	}
}

//根据键值获取键名
function getValByKey($val,$item_config){
	if($val){
		$str = '';
		foreach(explode(',',$val) as $v){
			foreach(json_decode($item_config,true) as $m){
				if($v == $m['key']){
					$str .= $m['val'].',';
				}
			}
		}
		return rtrim($str,',');
	}
}

//无限极分类转为带有 children的树形select结构
function _generateSelectTree ($data, $pid = 0) {
	$tree = [];
	if ($data && is_array($data)) {
		foreach($data as $v) {
			if($v['pid'] == $pid) {
				$tree[] = [
					'key' => $v['key'],
					'val' => $v['val'],
					'children' => _generateSelectTree($data, $v['val']),
				];
			}
		}
	}
	return $tree;
}

//无限极分类转为带有 children的树形list表格结构
function _generateListTree ($data, $pid = 0,$config=[]) {
	$tree = [];
	if ($data && is_array($data)) {
		foreach($data as $v) {
			if($v[$config[1]] == $pid) {
				$tree[] = array_merge($v,['children' => _generateListTree($data, $v[$config[0]],$config)]);
			}
		}
	}
	return $tree;
}

function deldir($dir) {
//先删除目录下的文件：
   $dh=opendir($dir);
   while ($file=readdir($dh)) {
	  if($file!="." && $file!="..") {
		 $fullpath=$dir."/".$file;
		 if(!is_dir($fullpath)) {
			unlink($fullpath);
		 } else {
			deldir($fullpath);
		 }
	  }
   }
 
   closedir($dh);
   //删除当前文件夹：
   if(rmdir($dir)) {
	  return true;
   } else {
	  return false;
   }
}

/*写入
* @param  string  $type 1 为生成控制器
*/

function filePutContents($content,$filepath,$type){
	if(in_array($type,[1,3])){
		$str = file_get_contents($filepath);
		$parten = '/\s\/\*+start\*+\/(.*)\/\*+end\*+\//iUs';
		preg_match_all($parten,$str,$all);
		if($all[0]){
			foreach($all[0] as $key=>$val){
				$ext_content .= $val."\n\n";
			}
		}
		
		$content .= $ext_content."\n\n";
		if($type == 1){
			$content .="}\n\n";
		}
	}
	
	ob_start();
	echo $content;
	$_cache=ob_get_contents();
	ob_end_clean();
	
	if($_cache){
		$File = new \think\template\driver\File();
		$File->write($filepath, $_cache);	
	}
}

/**
 * 数据签名认证
 * @param  array  $data 被认证的数据
 * @return string       签名
 */
function data_auth_sign($data) {
    //数据类型检测
    if(!is_array($data)){
        $data = (array)$data;
    }
    ksort($data); //排序
    $code = http_build_query($data); //url编码并生成query字符串
    $sign = sha1($code); //生成签名
    return $sign;
}




function killword($str, $start=0, $length, $charset="utf-8", $suffix=true) {
	if(function_exists("mb_substr"))
		$slice = mb_substr($str, $start, $length, $charset);
	elseif(function_exists('iconv_substr')) {
		$slice = iconv_substr($str,$start,$length,$charset);
	}else{
		$re['utf-8']   = "/[\x01-\x7f]|[\xc2-\xdf][\x80-\xbf]|[\xe0-\xef][\x80-\xbf]{2}|[\xf0-\xff][\x80-\xbf]{3}/";
		$re['gb2312'] = "/[\x01-\x7f]|[\xb0-\xf7][\xa0-\xfe]/";
		$re['gbk']    = "/[\x01-\x7f]|[\x81-\xfe][\x40-\xfe]/";
		$re['big5']   = "/[\x01-\x7f]|[\x81-\xfe]([\x40-\x7e]|\xa1-\xfe])/";
		preg_match_all($re[$charset], $str, $match);
		$slice = join("",array_slice($match[0], $start, $length));
	}
	return $suffix ? $slice.'...' : $slice;
}
	
function killhtml($str, $length=0){
	if(is_array($str)){
		foreach($str as $k => $v) $data[$k] = killhtml($v, $length);
			 return $data;
	}

	if(!empty($length)){
		$estr = htmlspecialchars( preg_replace('/(&[a-zA-Z]{2,5};)|(\s)/','',strip_tags(str_replace('[CHPAGE]','',$str))) );
		if($length<0) return $estr;
		return killword($estr,0,$length);
	}
	return htmlspecialchars( trim(strip_tags($str)) );
}

function getListUrl($newslist){
	if(!empty($newslist['jumpurl'])){
		$url =  $newslist['jumpurl'];
	}else{
		$info = db('content')->alias('a')->join('catagory b','a.class_id=b.class_id')->where(['a.content_id'=>$newslist['content_id']])->field('a.content_id,b.filepath')->find();
		$url = $info['filepath'].'/'.$info['content_id'].'.html';
	}
	return $url;
}


function U($classid){
	$info = db('catagory')->where('class_id',$classid)->find();
	$filepath = $info['filepath'] == '/' ? '' : '/'.trim($info['filepath'],'/');
	$filename = $info['filename'] == 'index.html' ? '' : $info['filename'];
	$url = $filepath.'/'.$filename;
	return $url;
}
