<?php 
/*
 module:		用户管理控制器
 create_time:	2022-02-25 17:10:29
 author:		
 contact:		
*/

namespace app\admin\controller;
use think\exception\ValidateException;
use app\admin\model\Adminuser as AdminuserModel;
use think\facade\Db;

class Adminuser extends Admin {


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
			$where['user_id'] = $this->request->post('user_id', '', 'serach_in');
			$where['adminuser.name'] = $this->request->post('name', '', 'serach_in');
			$where['adminuser.user'] = $this->request->post('user', '', 'serach_in');
			$where['adminuser.role_id'] = $this->request->post('role_id', '', 'serach_in');
			$where['adminuser.status'] = $this->request->post('status', '', 'serach_in');

			$field = 'user_id,name,user,note,status,create_time';

			$withJoin = [
				'role'=>explode(',','name'),
			];

			$order  = $this->request->post('order', '', 'serach_in');	//排序字段
			$sort  = $this->request->post('sort', '', 'serach_in');		//排序方式

			$orderby = ($sort && $order) ? $sort.' '.$order : 'user_id desc';

			$res = AdminuserModel::where(formatWhere($where))->field($field)->withJoin($withJoin,'left')->order($orderby)->paginate(['list_rows'=>$limit,'page'=>$page])->toArray();

			$data['status'] = 200;
			$data['data'] = $res;
			$page == 1 && $data['sql_field_data'] = $this->getSqlField('role_id');
			return json($data);
		}
	}


	/*
 	* @Description  修改排序开关
 	*/
	function updateExt(){
		$postField = 'user_id,status';
		$data = $this->request->only(explode(',',$postField),'post',null);
		if(!$data['user_id']) throw new ValidateException ('参数错误');
		AdminuserModel::update($data);
		return json(['status'=>200,'msg'=>'操作成功']);
	}

	/*
 	* @Description  添加
 	*/
	public function add(){
		$postField = 'name,user,pwd,role_id,note,status,create_time';
		$data = $this->request->only(explode(',',$postField),'post',null);

		$this->validate($data,\app\admin\validate\Adminuser::class);

		$data['pwd'] = md5($data['pwd'].config('my.password_secrect'));
		$data['create_time'] = time();

		try{
			$res = AdminuserModel::insertGetId($data);
		}catch(\Exception $e){
			throw new ValidateException($e->getMessage());
		}
		return json(['status'=>200,'data'=>$res,'msg'=>'添加成功']);
	}


	/*
 	* @Description  修改
 	*/
	public function update(){
		$postField = 'user_id,name,user,role_id,note,status,create_time';
		$data = $this->request->only(explode(',',$postField),'post',null);

		$this->validate($data,\app\admin\validate\Adminuser::class);

		$data['create_time'] = strtotime($data['create_time']);

		try{
			AdminuserModel::update($data);
		}catch(\Exception $e){
			throw new ValidateException($e->getMessage());
		}
		return json(['status'=>200,'msg'=>'修改成功']);
	}


	/*
 	* @Description  修改信息之前查询信息的 勿要删除
 	*/
	function getUpdateInfo(){
		$id =  $this->request->post('user_id', '', 'serach_in');
		if(!$id) throw new ValidateException ('参数错误');
		$field = 'user_id,name,user,role_id,note,status,create_time';
		$res = AdminuserModel::field($field)->find($id);
		return json(['status'=>200,'data'=>$res]);
	}


	/*
 	* @Description  重置密码
 	*/
	public function resetPwd(){
		$postField = 'user_id,pwd';
		$data = $this->request->only(explode(',',$postField),'post',null);
		if(empty($data['user_id'])) throw new ValidateException ('参数错误');
		if(empty($data['pwd'])) throw new ValidateException ('密码不能为空');

		$data['pwd'] = md5($data['pwd'].config('my.password_secrect'));
		$res = AdminuserModel::update($data);
		return json(['status'=>200,'msg'=>'操作成功']);
	}


	/*
 	* @Description  获取定义sql语句的字段信息
 	*/
	function getFieldList(){
		return json(['status'=>200,'data'=>$this->getSqlField('role_id')]);
	}

	/*
 	* @Description  获取定义sql语句的字段信息
 	*/
	private function getSqlField($list){
		$data = [];
		if(in_array('role_id',explode(',',$list))){
			$data['role_ids'] = $this->query('select role_id,name from pre_role','mysql');
		}
		return $data;
	}

	/*start*/
	/*
 	* @Description  删除
 	*/
	function delete(){
		$idx =  $this->request->post('user_id', '', 'serach_in');
		if($idx == 1){
			throw new ValidateException ('超级用户禁止删除');
		}
		if(!$idx) throw new ValidateException ('参数错误');
		AdminuserModel::destroy(['user_id'=>explode(',',$idx)],true);
		return json(['status'=>200,'msg'=>'操作成功']);
	}
	/*end*/



}

