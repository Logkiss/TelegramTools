<?php 
/*
 module:		账单列表控制器
 create_time:	2022-03-13 14:10:25
 author:		
 contact:		
*/

namespace app\admin\controller;
use think\exception\ValidateException;
use app\admin\model\Order as OrderModel;
use think\facade\Db;

class Order extends Admin {


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
			$where['order.fl'] = $this->request->post('fl', '', 'serach_in');
			$where['order.bank'] = $this->request->post('bank', '', 'serach_in');
			$where['order.amount'] = $this->request->post('amount', '', 'serach_in');
			$where['order.accname'] = $this->request->post('accname', '', 'serach_in');
			$where['order.dj'] = $this->request->post('dj', '', 'serach_in');
			$where['order.rl'] = $this->request->post('rl', '', 'serach_in');
			$where['order.tgid'] = $this->request->post('tgid', '', 'serach_in');
			$where['order.tgname'] = $this->request->post('tgname', '', 'serach_in');
			$where['order.group_id'] = $this->request->post('group_id', '', 'serach_in');
			$where['group.name'] = $this->request->post('name', '', 'serach_in');

			$field = 'id,fl,bank,jytime,amount,accname,dj,rl,tgid,tgname,group_id,rltime';

			$withJoin = [
				'group'=>explode(',','name'),
			];

			$order  = $this->request->post('order', '', 'serach_in');	//排序字段
			$sort  = $this->request->post('sort', '', 'serach_in');		//排序方式

			$orderby = ($sort && $order) ? $sort.' '.$order : 'id desc';

			$res = OrderModel::where(formatWhere($where))->field($field)->withJoin($withJoin,'left')->order($orderby)->paginate(['list_rows'=>$limit,'page'=>$page])->toArray();

			$data['status'] = 200;
			$data['data'] = $res;
			$page == 1 && $data['sql_field_data'] = $this->getSqlField('group_id');
			return json($data);
		}
	}


	/*
 	* @Description  修改排序开关
 	*/
	function updateExt(){
		$postField = 'id,dj';
		$data = $this->request->only(explode(',',$postField),'post',null);
		if(!$data['id']) throw new ValidateException ('参数错误');
		OrderModel::update($data);
		return json(['status'=>200,'msg'=>'操作成功']);
	}

	/*
 	* @Description  添加
 	*/
	public function add(){
		$postField = 'bank,jytime,amount,accname';
		$data = $this->request->only(explode(',',$postField),'post',null);

		$this->validate($data,\app\admin\validate\Order::class);

		$data['jytime'] = strtotime($data['jytime']);

		try{
			$res = OrderModel::insertGetId($data);
		}catch(\Exception $e){
			throw new ValidateException($e->getMessage());
		}
		return json(['status'=>200,'data'=>$res,'msg'=>'添加成功']);
	}


	/*
 	* @Description  修改
 	*/
	public function update(){
		$postField = 'id,fl,bank,jytime,amount,accname,dj,rl,tgid,tgname,group_id,rltime';
		$data = $this->request->only(explode(',',$postField),'post',null);

		$this->validate($data,\app\admin\validate\Order::class);

		$data['jytime'] = strtotime($data['jytime']);
		$data['rltime'] = strtotime($data['rltime']);

		try{
			OrderModel::update($data);
		}catch(\Exception $e){
			throw new ValidateException($e->getMessage());
		}
		return json(['status'=>200,'msg'=>'修改成功']);
	}
	/*
 	* @Description  批量添加
 	*/
	public function pladd(){
		$data = $this->request->post();
		$datas['data'] = $data['date'];
		$datas['fl'] = $data['fl'];
        if(!empty($datas['data'])){
            $key_arr = explode(PHP_EOL,$datas['data']);
        }
        $dataa=[];
        foreach ($key_arr as $value) {
            preg_match_all('/^([^\d]+)(\d+)/', $value, $match);
            $datas['accname']=$this->myTrim($match[1][0]);
            $datas['amount']=$this->myTrim($match[2][0]);
            $datas['fl']=$datas['fl'];
            array_push($dataa,$datas);
        }
		try{
			$res = Db::name('order')->insertAll($dataa);
		}catch(\Exception $e){
			throw new ValidateException($e->getMessage());
		}
		return json(['status'=>200,'data'=>$res,'msg'=>'添加成功']);

	}

	/*
 	* @Description  修改信息之前查询信息的 勿要删除
 	*/
	function getUpdateInfo(){
		$id =  $this->request->post('id', '', 'serach_in');
		if(!$id) throw new ValidateException ('参数错误');
		$field = 'id,fl,bank,jytime,amount,accname,dj,rl,tgid,tgname,group_id,rltime';
		$res = OrderModel::field($field)->find($id);
		return json(['status'=>200,'data'=>$res]);
	}


	/*
 	* @Description  删除
 	*/
	function delete(){
		$idx =  $this->request->post('id', '', 'serach_in');
		if(!$idx) throw new ValidateException ('参数错误');
		OrderModel::destroy(['id'=>explode(',',$idx)],true);
		return json(['status'=>200,'msg'=>'操作成功']);
	}


	/*
 	* @Description  查看详情
 	*/
	function detail(){
		$id =  $this->request->post('id', '', 'serach_in');
		if(!$id) throw new ValidateException ('参数错误');
		$field = 'id,fl,bank,jytime,amount,accname,dj,rl,tgid,tgname,group_id,rltime';
		$res = OrderModel::field($field)->find($id);
		return json(['status'=>200,'data'=>$res]);
	}


	/*
 	* @Description  获取定义sql语句的字段信息
 	*/
	function getFieldList(){
		return json(['status'=>200,'data'=>$this->getSqlField('group_id')]);
	}

	/*
 	* @Description  获取定义sql语句的字段信息
 	*/
	private function getSqlField($list){
		$data = [];
		if(in_array('group_id',explode(',',$list))){
			$data['group_ids'] = $this->query('select tg_groupid,name from cd_group','mysql');
		}
		return $data;
	}
    function myTrim($str)
    {
     $search = array(" ","　","\n","\r","\t");
     $replace = array("","","","","");
     return str_replace($search, $replace, $str);
    }


}

