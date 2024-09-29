<?php 
/*
 module:		基本配置控制器
 create_time:	2022-02-25 17:26:30
 author:		
 contact:		
*/

namespace app\admin\controller;
use think\exception\ValidateException;
use app\admin\model\Baseconfig as BaseconfigModel;
use think\facade\Db;

class Baseconfig extends Admin {


	/*
 	* @Description  基本配置
 	*/
	public function index(){
		if (!$this->request->isPost()){
			return view('index');
		}else{
			$data = $this->request->post();
			$this->validate($data,\app\admin\validate\Baseconfig::class);
	
		$data['keyword'] = implode(',',$data['keyword']);

			$info = BaseconfigModel::column('data','name');
			foreach ($data as $key => $value) {
				if(array_key_exists($key,$info)){
					BaseconfigModel::field('data')->where(['name'=>$key])->update(['data'=>$value]);
				}else{
					BaseconfigModel::create(['name'=>$key,'data'=>$value]);
				}
			}
			return json(['status'=>200,'msg'=>'操作成功']);
		}
	}


	/*
 	* @Description  修改信息之前查询信息的 勿要删除
 	*/
	function getInfo(){
		$res = BaseconfigModel::column('data','name');
		$res['keyword'] = explode(',',$res['keyword']);
		$res['water_alpha'] = (int)$res['water_alpha'];

		$data['status'] = 200;
		$data['data'] = $res;
		return json($data);
	}




}

