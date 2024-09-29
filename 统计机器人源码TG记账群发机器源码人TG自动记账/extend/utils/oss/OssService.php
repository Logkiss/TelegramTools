<?php

namespace utils\oss;


class OssService
{
	
	/**
	 * 图片oss存储路径
	 * @param  string type 业务号
	 * @return string 
	 */
	public static function setKey($type,$tmpInfo){
		$filepath = app('http')->getName().'/'.date(config('my.upload_subdir')).'/'.doOrderSn($type).'.'.$tmpInfo['extension']; //上传路径
		return $filepath;
	}
	
	
	/**
	 * oss开始上传
	 * @param  string tmpInfo 图片临时文件信息
	 * @return string oss返回图片完整路径
	 */
	public static function OssUpload($tmpInfo){
		switch(config('my.oss_default_type')){
			case 'ali';
				$url = \utils\oss\AliOssService::upload($tmpInfo);	//七牛云上传
			break;
			
			case 'qiniuyun';
				$url = \utils\oss\QnyOssService::upload($tmpInfo);	//阿里上传
			break;
			
			case 'tencent';
				$url = \utils\oss\TencentOssService::upload($tmpInfo);	//阿里上传
			break;
		}
		return $url;
	}
	
	
	
}
