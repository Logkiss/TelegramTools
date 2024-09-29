<?php 
/*
 module:		缩略图配置控制器
 create_time:	2021-12-06 23:37:36
 author:		
 contact:		
*/

namespace app\admin\controller;
use think\exception\ValidateException;
use app\admin\model\Uploadconfig as UploadconfigModel;
use think\facade\Db;

class Uploadconfig extends Admin {


	/*
 	* @Description  数据列表
 	*/
	function index(){
		if (!$this->request->isPost()){
			return view('index');
		}else{
			$limit  = $this->request->post('limit', 20, 'intval');
			$page = $this->request->post('page', 1, 'intval');

			$where = [];
			$where['id'] = $this->request->post('id', '', 'serach_in');
			$where['upload_replace'] = $this->request->post('upload_replace', '', 'serach_in');
			$where['thumb_status'] = $this->request->post('thumb_status', '', 'serach_in');
			$where['thumb_type'] = $this->request->post('thumb_type', '', 'serach_in');

			$field = 'id,title,upload_replace,thumb_status,thumb_width,thumb_height,thumb_type';

			$res = UploadconfigModel::where(formatWhere($where))->field($field)->order('id desc')->paginate(['list_rows'=>$limit,'page'=>$page])->toArray();

			$data['status'] = 200;
			$data['data'] = $res;
			return json($data);
		}
	}


	/*
 	* @Description  修改排序开关
 	*/
	function updateExt(){
		$postField = 'id,upload_replace,thumb_status';
		$data = $this->request->only(explode(',',$postField),'post',null);
		if(!$data['id']) throw new ValidateException ('参数错误');
		UploadconfigModel::update($data);
		return json(['status'=>200,'msg'=>'操作成功']);
	}

	/*
 	* @Description  添加
 	*/
	public function add(){
		$postField = 'title,upload_replace,thumb_status,thumb_width,thumb_height,thumb_type';
		$data = $this->request->only(explode(',',$postField),'post',null);

		$this->validate($data,\app\admin\validate\Uploadconfig::class);

		try{
			$res = UploadconfigModel::create($data);
		}catch(\Exception $e){
			throw new ValidateException($e->getMessage());
		}
		return json(['status'=>200,'data'=>$res->id,'msg'=>'添加成功']);
	}


	/*
 	* @Description  修改
 	*/
	public function update(){
		$postField = 'id,title,upload_replace,thumb_status,thumb_width,thumb_height,thumb_type';
		$data = $this->request->only(explode(',',$postField),'post',null);

		$this->validate($data,\app\admin\validate\Uploadconfig::class);

		try{
			UploadconfigModel::update($data);
		}catch(\Exception $e){
			throw new ValidateException($e->getMessage());
		}
		return json(['status'=>200,'msg'=>'修改成功']);
	}


	/*
 	* @Description  修改信息之前查询信息的 勿要删除
 	*/
	function getUpdateInfo(){
		$id =  $this->request->post('id', '', 'serach_in');
		if(!$id) throw new ValidateException ('参数错误');
		$field = 'id,title,upload_replace,thumb_status,thumb_width,thumb_height,thumb_type';
		$res = UploadconfigModel::field($field)->find($id);
		return json(['status'=>200,'data'=>$res]);
	}


	/*
 	* @Description  删除
 	*/
	function delete(){
		$idx =  $this->request->post('id', '', 'serach_in');
		if(!$idx) throw new ValidateException ('参数错误');
		UploadconfigModel::destroy(['id'=>explode(',',$idx)],true);
		return json(['status'=>200,'msg'=>'操作成功']);
	}


	/*
 	* @Description  查看详情
 	*/
	function detail(){
		$id =  $this->request->post('id', '', 'serach_in');
		if(!$id) throw new ValidateException ('参数错误');
		$field = 'id,title,upload_replace,thumb_status,thumb_width,thumb_height,thumb_type';
		$res = UploadconfigModel::field($field)->find($id);
		return json(['status'=>200,'data'=>$res]);
	}




}

