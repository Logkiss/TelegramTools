<?php
// +----------------------------------------------------------------------
// | ThinkPHP [ WE CAN DO IT JUST THINK ]
// +----------------------------------------------------------------------
// | Copyright (c) 2006~2018 http://thinkphp.cn All rights reserved.
// +----------------------------------------------------------------------
// | Licensed ( http://www.apache.org/licenses/LICENSE-2.0 )
// +----------------------------------------------------------------------
// | Author: liu21st <liu21st@gmail.com>
// +----------------------------------------------------------------------

// +----------------------------------------------------------------------
// | 自定义配置
// +----------------------------------------------------------------------
return [
	'upload_subdir'		=> 'Ym',				//文件上传二级目录 标准的日期格式
	'nocheck'			=> ['/admin/Login/verify.html','/admin/Login/index.html','/admin/Login/logout.html','/admin/Base/getMenu.html','/admin/Index/index.html','/admin/Upload/upload.html','/admin/Upload/createFile.html'],	//不需要验证权限的url
	'error_log_code'	=> 500,					//写入日志的状态码
	
	'password_secrect'	=> 'xhadmin',			//密码加密秘钥
	
	'multiple_login'		=> true,  			//总后台是否开启多设备登录 true多设备登录 false单设备登录
	
	'dump_extension'	=> 'xlsx',				//默认导出格式
	'verify_status'		=> true,				//后台登录验证码开关
	'water_img'			=>	'./static/images/water.png',	//水印图片路径
	
	'check_file_status'	=> true,			//上传图片是否检测图片存在
	
	
	'show_home_chats'	=> false,			//是否显示首页图表
	'show_notice'		=> false,
	
	//api基本配置
	'jwtExpireCode'		=> 101,				//jwt过期
	'jwtErrorCode'		=> 102,				//jwt无效
	
	//聚合短信配置
	'juhe_sms_key'		=> '3420d7egshdjhshjsh77776767c373f4b4ac',		//key
	'juhe_sms_tempCode'	=> '11205725',									//短信验证码模板
	
	//极速短信配置
	'jisu_sms_key'		=> '892d93ac22b27ee9',							//key
	'jisu_sms_tempCode'	=> '20492',										//短信验证码模板
	
	//阿里云短信配置
	'ali_sms_accessKeyId'		=> 'LTAI4FjisddjtALfdXRxLB',				//阿里云短信 keyId	
	'ali_sms_accessKeySecret'	=> 'Wy5isYVqtT0ZLYoePK6m2QjZ8Dc',	//阿里云短信 keysecret
	'ali_sms_signname'			=> '乘碟建设',							//签名
	'ali_sms_tempCode'			=> 'SMS_197625314',						//短信模板 Code
	
	//oss开启状态 以及配置指定oss
	'oss_status'			=> false,			//true启用  false 不启用
	'oss_upload_type'		=> 'client',		//client 客户端直传  server 服务端传
	'oss_default_type'		=> 'ali',			//oss使用类别 ali(阿里),qiniu(七牛),tencent(腾讯)
	
	//阿里云oss配置
	'ali_oss_accessKeyId'		=> 'LTAI4Fjddj37tALfdXRxLB',						//阿里云短信 keyId	
	'ali_oss_accessKeySecret'	=> 'Wy5isYVt0g7eZYoePK6m2QjZ8Dc',					//阿里云短信 keysecret
	'ali_oss_endpoint'			=> 'http://i.whpj.vip',							//建议填写自己绑定的域名
	'ali_oss_bucket'			=> 'xhadmin',					
	
	//腾讯云cos配置
	'tencent_oss_secretId'		=> 'AKIDGMBj24LXcbBTUEhtoSqxnMegRv84',				//腾讯云keyId	
	'tencent_oss_secretKey'		=> 'g5D5gz1mLOO6YjdFafSzFEwNXQ2N',		//腾讯云keysecret
	'tencent_oss_bucket'		=> 'vueadmin-1254365669',							//腾讯云bucket
	'tencent_oss_region'		=> 'ap-nanjing',									//地区，根据自己的填写
	'tencent_oss_schema'		=> 'http',							//访问前缀 支持http  https	
	
	//七牛云oss配置
	'qny_oss_accessKey' 		=> 'bm1sR9bx0F5HK7YhZJ8zOxb-HCGYx5pJU',  //access_key
	'qny_oss_secretKey' 		=> 'YrRaySbqu7M1PIOgT0ObUdb7GBPRiYa7Lq',     //secret_key
	'qny_oss_bucket'	  		=> 'xhadmin',							//bucket
	'qny_oss_domain'	  		=> 'http://images.whpj.vip', 		//七牛云访问的域名
	'qny_oss_client_uploadurl'	=> 'http://up-z0.qiniup.com',		//七牛云客户端直传上传地址 不用动如果提示地址错误 根据提示换就行
  
	//api jwt鉴权配置
	'jwt_expire_time'		=> 3600 * 24,			//token过期时间24小时
	'jwt_secrect'			=> 'boTCfOGKwqTNKArT',	//签名秘钥
	'jwt_iss'				=> 'client.xhadmin',	//发送端
	'jwt_aud'				=> 'server.xhadmin',	//接收端
	
	//小程序配置
	'mini_program'			=> [
		'app_id' => 'wxf77d319b',					//小程序appid
		'secret' => '23d7191f462197b835d',		//小程序secret
	],
	
	//公众号配置
	'official_accounts'		=> [
		'app_id'        => 'wxa2c835664852',												//公众号appid
		'secret'		=> '2d7ef1dccd9e5e744',									//公众号secret
		'token'			=> 'chengdie',
	],
	
	'pay_display'	=> 1,
		
	//微信支付配置
	'wechart_pay'			=> [
		'mch_id'         => '1346201',															//商户号
		'key'            => 'e4a4ab530b3bec634cdf52',										//微信支付32位秘钥
		'cert_path'      => app()->getRootPath().'extend/utils/wechart/zcerts/apiclient_cert.pem',	//证书路径
		'key_path'       => app()->getRootPath().'extend/utils/wechart/zcerts/apiclient_key.pem',	//证书路径
		'rsa_public_key_path'  => app()->getRootPath().'extend/utils/wechart/zcerts/public.pem',	//rsa公钥
	],

	'api_upload_auth'=> false,	//api应用上传是否验证token  true 验证 false不验证 需要重新生成
	
	//文件注释
	'comment'=>[
		'api_comment'=>true,	//api接口详细注释 true生成 false不生成  
		'file_comment'=>true,	//文件头部注释  true生成 false不生成
		'author'=>'',
		'contact'=>'',
	],
	

];
