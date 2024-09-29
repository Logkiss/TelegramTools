<?php
declare (strict_types = 1);

namespace app;

use think\App;
use think\View;
use think\exception\HttpException;
use think\exception\HttpResponseException;
use think\exception\ValidateException;
use think\Response;
use think\Validate;

/**
 * 控制器基础类
 */
abstract class BaseController
{

    /**
     * Request实例
     * @var \think\Request
     */
    protected $request;
	
    /**
     * 应用实例
     * @var \think\App
     */
    protected $app;
	

    /**
     * 是否批量验证
     * @var bool
     */
    protected $batchValidate = false;

    /**
     * 控制器中间件
     * @var array
     */
    protected $middleware = [];

    /**
     * 构造方法
     * @access public
     * @param  App  $app  应用对象
     */
     public function __construct(App $app,View $view)
    {
        $this->app     = $app;
        $this->request = $this->app->request;
		$this->view = $view;

        // 控制器初始化
        $this->initialize();
    }

    // 初始化
    protected function initialize()
    {
		
	}

    
	
	/**
     * 操作成功跳转的快捷方法
     * @access protected
     * @param  mixed     $msg 提示信息
     * @param  string    $url 跳转的URL地址
     * @param  mixed     $data 返回的数据
     * @param  integer   $wait 跳转等待时间
     * @param  array     $header 发送的Header信息
     * @return void
     */
    protected function success($msg = '', string $url = null, $data = '', int $wait = 3, array $header = [])
    {
        if (is_null($url) && isset($_SERVER["HTTP_REFERER"])) {
            $url = $_SERVER["HTTP_REFERER"];
        } elseif ($url) {
            $url = (strpos($url, '://') || 0 === strpos($url, '/')) ? $url : app('route')->buildUrl($url);
        }

        $result = [
            'code' => 1,
            'msg'  => $msg,
            'data' => $data,
            'url'  => $url,
            'wait' => $wait,
        ];

        $type = $this->getResponseType();
        if ($type == 'html'){
            $response = view(config('app.dispatch_success_tmpl'), $result); 
        } else if ($type == 'json') {
            $response = json($result);
        }
		
		throw new HttpResponseException($response);
    }

    /**
     * 操作错误跳转的快捷方法
     * @access protected
     * @param  mixed     $msg 提示信息
     * @param  string    $url 跳转的URL地址
     * @param  mixed     $data 返回的数据
     * @param  integer   $wait 跳转等待时间
     * @param  array     $header 发送的Header信息
     * @return void
     */
    protected function error($msg = '', string $url = null, $data = '', int $wait = 3, array $header = [])
    {
        if (is_null($url)) {
            $url = $this->request->isAjax() ? '' : 'javascript:history.back(-1);';
        } elseif ($url) {
            $url = (strpos($url, '://') || 0 === strpos($url, '/')) ? $url : $this->app->route->buildUrl($url);
        }

        $result = [
            'code' => 0,
            'msg'  => $msg,
            'data' => $data,
            'url'  => $url,
            'wait' => $wait,
        ];

        $type = $this->getResponseType();
        if ($type == 'html'){
            $response = view(config('app.dispatch_success_tmpl'), $result); 
        } else if ($type == 'json') {
            $response = json($result);
        }
		
        throw new HttpResponseException($response);
    }
	
	
	/**
     * 获取当前的response 输出类型
     * @access protected
     * @return string
     */
    protected function getResponseType()
    {
        return $this->request->isJson() || $this->request->isAjax() ? 'json' : 'html';
    }
	

}
