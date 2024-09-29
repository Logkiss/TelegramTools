<?php

//阿里大鱼短信发送
namespace utils\sms;
use think\facade\Log;

class AliSmsService
{
	
	/**
	 * 发送短信
	 * @param  array $data [发送参数] $data['mobile'] 发送手机号 $data['code'] 发送验证码
	 * @return  Bool
	 */
	public static function sendSms($data){
		$params = array ();

		$security = false;

		$params["PhoneNumbers"] = $data['mobile'];
		$params["SignName"] = config('my.ali_sms_signname');
		$params["TemplateCode"] = config('my.ali_sms_tempCode');
		$params['TemplateParam'] = [
			"code" => $data['code']
		];

		if(!empty($params["TemplateParam"]) && is_array($params["TemplateParam"])) {
			$params["TemplateParam"] = json_encode($params["TemplateParam"], JSON_UNESCAPED_UNICODE);
		}

		$content = self::request(config('my.ali_sms_accessKeyId'),config('my.ali_sms_accessKeySecret'),"dysmsapi.aliyuncs.com",
			array_merge($params, array(
				"RegionId" => "cn-hangzhou",
				"Action" => "SendSms",
				"Version" => "2017-05-25",
			)),
			$security
		);
		
		$res = self::object_array($content);
		if($res['Code'] == 'OK'){
			return true;
		}else{
			log::error('阿里大鱼短信发送失败:'.print_r($res,true));
			throw new \Exception('发送失败');
		}

		
	}
	
	public static function request($accessKeyId, $accessKeySecret, $domain, $params, $security=false, $method='POST') {
        $apiParams = array_merge(array (
            "SignatureMethod" => "HMAC-SHA1",
            "SignatureNonce" => uniqid(mt_rand(0,0xffff), true),
            "SignatureVersion" => "1.0",
            "AccessKeyId" => $accessKeyId,
            "Timestamp" => gmdate("Y-m-d\TH:i:s\Z"),
            "Format" => "JSON",
        ), $params);
        ksort($apiParams);

        $sortedQueryStringTmp = "";
        foreach ($apiParams as $key => $value) {
            $sortedQueryStringTmp .= "&" . self::encode($key) . "=" . self::encode($value);
        }

        $stringToSign = "${method}&%2F&" . self::encode(substr($sortedQueryStringTmp, 1));

        $sign = base64_encode(hash_hmac("sha1", $stringToSign, $accessKeySecret . "&",true));

        $signature = self::encode($sign);

        $url = ($security ? 'https' : 'http')."://{$domain}/";

        try {
            $content = self::fetchContent($url, $method, "Signature={$signature}{$sortedQueryStringTmp}");
            return json_decode($content);
        } catch( \Exception $e) {
            return false;
        }
    }

    private static function encode($str)
    {
        $res = urlencode($str);
        $res = preg_replace("/\+/", "%20", $res);
        $res = preg_replace("/\*/", "%2A", $res);
        $res = preg_replace("/%7E/", "~", $res);
        return $res;
    }
	
	private static function object_array($array) { 
		if(is_object($array)) { 
			$array = (array)$array; 
		 } if(is_array($array)) { 
			 foreach($array as $key=>$value) { 
				 $array[$key] = self::object_array($value); 
				 } 
		 } 
		 return $array; 
	}

    private static function fetchContent($url, $method, $body) {
        $ch = curl_init();

        if($method == 'POST') {
            curl_setopt($ch, CURLOPT_POST, 1);//post提交方式
            curl_setopt($ch, CURLOPT_POSTFIELDS, $body);
        } else {
            $url .= '?'.$body;
        }

        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_TIMEOUT, 5);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($ch, CURLOPT_HTTPHEADER, array(
            "x-sdk-client" => "php/2.0.0"
        ));

        if(substr($url, 0,5) == 'https') {
            curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
            curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);
        }

        $rtn = curl_exec($ch);

        if($rtn === false) {
            // 大多由设置等原因引起，一般无法保障后续逻辑正常执行，
            // 所以这里触发的是E_USER_ERROR，会终止脚本执行，无法被try...catch捕获，需要用户排查环境、网络等故障
            trigger_error("[CURL_" . curl_errno($ch) . "]: " . curl_error($ch), E_USER_ERROR);
        }
        curl_close($ch);

        return $rtn;
    }
    
}
