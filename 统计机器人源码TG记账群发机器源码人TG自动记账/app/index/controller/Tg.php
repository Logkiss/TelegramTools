<?php 

namespace app\index\controller;
use think\facade\Db;
use think\facade\Log;


class Tg{
    //初始化tg机器人
    public function set(){
        $params = request()->param();
        $token=$params['token'];
        //查询域名
        $seturl=Db::name('base_config')->where('name','domain')->find();
        $hdurl=$seturl['data'].'/index/tg/message';
        $url="https://api.telegram.org/bot".$token."/setWebhook?url=".$hdurl;
        $data=get_http($url);
        // var_dump($data);
        if($data['ok']){
            $datas['status']=200;
        }else {
            $datas['status']=-1;
        }
		return $datas;
	}
	/**
	 * tg接收消息
	 * 模拟飞机发过来的消息
	 * 飞机用户id:tg_userid,群组id:group_id,
	 * 消息内容:msg,飞机用户名:tg_nickname,昵称:tg_username
	 */
	public function message()
	{
	    $params = request()->param();
	    //判断是否有消息
	    if(empty($params['message'])){
	       return 'true';
	    }
	    //消息id
	    $message_id=empty($params['message']['message_id']) ? '' :$params['message']['message_id'];
	    $user_id=empty($params['message']['from'])? '' :$params['message']['from'];
	    if($user_id==''){
	        return 'true';
	    }
	    $user_id=$params['message']['from']['id'];
	    $user_id=$params['message']['from']['id'];
	    $user_name=(empty($params['message']['from']['first_name']) ? '' :$params['message']['from']['first_name']).(empty($params['message']['from']['last_name'])?'':$params['message']['from']['last_name']);
	    //判断群
		//群
	    if($params['message']['chat']['type']=='group'||$params['message']['chat']['type']=='supergroup'){
	        $groupid=$params['message']['chat']['id'];//群id
	        $grouptitle=$params['message']['chat']['title'];//群标题
	        $type='group';
	        //判断是不是新成员
	        $xin = empty($params['message']['new_chat_member']) ? '':$params['message']['new_chat_member'];
	        if($xin!=''){
	            //查询欢迎语
	            $hyy=Db::name('robotconfig')->where('name','hy')->find();
	            $msg='@'.$params['message']['new_chat_member']['username']."\n".$hyy['data'];
                sendText($groupid,$msg);
	           return 'true';
	        }else{
	           $xin=false; 
	        }
	   //一对一
	    }else{
	        $type='ydy';
	        $groupid=$params['message']['chat']['id'];//用户id
	    }
	    //判断消息类型
	    if(!empty($params["message"]["text"])){
	        $msgtype='text';
	        $msg=$params["message"]["text"];
	    }elseif (!empty($params["message"]["photo"])) {
	        $msgtype='photo';
	        $msg=$params["message"]["photo"][0]['file_id'];
	    }else{
	        $msgtype='no';
	    }
	    if($type=='group'&&$msgtype!='no'){
	        //判断是不是上下分操作
	    if(!empty($params["message"]['reply_to_message'])){
	        $toid=$params["message"]['reply_to_message']['from']['id'];
	        $toname=(empty($params["message"]['reply_to_message']['from']['first_name'])?'':$params["message"]['reply_to_message']['from']['first_name']).(empty($params["message"]['reply_to_message']['from']['last_name'])?'':$params["message"]['reply_to_message']['from']['last_name']);
	        //判断发送人是不是管理员
	        $gl=empty($params["message"]['from']['username'])?'':$params["message"]['from']['username'];
	        $glid=Db::name('robotconfig')->where('name','gl')->find();
	        //设置的管理员
	        $pieces = explode(",", $glid['data']);
	        if(in_array($gl,$pieces)){
	            $this->groupgl($message_id,$groupid,$grouptitle,$msgtype,$msg,$xin,$user_id,$user_name,$toid,$toname);
	        }else{
	            $msg="❗无操作权限！";
                huiText($message_id,$groupid,$msg);
	        }
	    }else{
	        $this->group($message_id,$groupid,$grouptitle,$msgtype,$msg,$xin,$user_id,$user_name); 
	    }
	        return 'true';
	    }else{
	        if($msgtype=='photo'){
	           $this->ydy($groupid,$msg);
	        }
	        return 'true';
	    }
	    
        // $welcome_text = preg_replace('/^ +/m', '',
        //         "{$forwardArr['text']}"
        //     );
        // sendText($chat_id,$welcome_text);
	}
	//群消息处理
	function group($message_id,$groupid,$grouptitle,$msgtype,$msg,$xin,$user_id,$user_name){
	    if($msgtype=='text'){
    	       //判断是否有这个群
                $group=Db::name('group')->where('tg_groupid',$groupid)->find();
                if(empty($group)){
                    $data = ['tg_groupid' =>$groupid, 'name' => $grouptitle];
                    Db::name('group')->insert($data);
                }else{
                    Db::name('group')->where('tg_groupid',$groupid)->update(['name'=>$grouptitle]);
                }
                 //判断是否有这个用户
                $user=Db::name('user')->where('tguid',$user_id)->find();
	            if(empty($user)){
	                $dataa = ['tguid' =>$user_id, 'tgname' => $user_name];
                    Db::name('user')->insert($dataa);
	            }else{
	                Db::name('user')->where('tguid',$user_id)->update(['tgname'=>$user_name]);
	            }
    	    //拆分关键词玩法明 和金额
    		$zl=substr($msg, 0, 1 );
    		if($zl=='/'){
    		    if (strpos($msg, '@') !== false) {
                    $msg=substr($msg,0,strpos($msg, '@'));
                }
    		    $msg = substr($msg, 1);
    		    preg_match_all('/^([^\d]+)(\d+)/', $msg, $match);
    		    if($msg=='today'){
    		    //查询本群今日所有人汇总
    		    //自动正常
    		    $zdz=Db::name('order')->whereDay('rltime')->where('group_id',$groupid)->where('zd',0)->where('dj',0)->where('rl',1)->count();
    		    $zdzj=Db::name('order')->whereDay('rltime')->where('group_id',$groupid)->where('zd',0)->where('dj',0)->where('rl',1)->sum('amount');
    		    //自动冻结
    		    $zdd=Db::name('order')->whereDay('rltime')->where('group_id',$groupid)->where('zd',0)->where('dj',1)->where('rl',1)->count();
    		    $zddj=Db::name('order')->whereDay('rltime')->where('group_id',$groupid)->where('zd',0)->where('dj',1)->where('rl',1)->sum('amount');
    		    //手动正常
    		    $sdz=Db::name('order')->whereDay('rltime')->where('group_id',$groupid)->where('zd',1)->where('dj',0)->where('rl',1)->count();
    		    $sdzj=Db::name('order')->whereDay('rltime')->where('group_id',$groupid)->where('zd',1)->where('dj',0)->where('rl',1)->sum('amount');
    		    //手动冻结
    		    $sdd=Db::name('order')->whereDay('rltime')->where('group_id',$groupid)->where('zd',1)->where('dj',1)->where('rl',1)->count();
    		    $sddj=Db::name('order')->whereDay('rltime')->where('group_id',$groupid)->where('zd',1)->where('dj',1)->where('rl',1)->sum('amount');
    		    //查询所有用户
    		    $userdata=Db::name('user')->select();
    		    $usera='';
    		    if(!empty($userdata)&&$zdz>0){
    		         foreach ($userdata as $i) {
        		        $zcje=Db::name('order')->whereDay('rltime')->where('group_id',$groupid)->where('tgid',$i['tguid'])->where('rl',1)->where('dj',0)->sum('amount');
        		        $djje=Db::name('order')->whereDay('rltime')->where('group_id',$groupid)->where('tgid',$i['tguid'])->where('rl',1)->where('dj',1)->sum('amount');
        		        if($zcje!=0||$djje!=0){
        		            $usera=$usera.$i['tgname']." 正常:".$zcje." 冻结:".$djje."\n";
        		        }
        		        
        		    }
    		    }else{
    		        $usera='空';
    		    }
    		    //查询域名
        		    $seturl=Db::name('base_config')->where('name','domain')->find();
                    $hdurl=$seturl['data'].'/index/order/jr?groupid='.$groupid;
    		    //查询群用户明细
    		     $msg="本群".date("Y-m-d")."的汇总\n🔱自动入账:\n正常: ".$zdzj." (".$zdz."笔)\n冻结: ".$zddj." (".$zdd."笔)\n\n🔆手动入账:\n正常: ".$sdzj." (".$sdz."笔)\n冻结: ".$sddj." (".$sdd."笔)\n\n🚻用户汇总🚻\n".$usera."\n";
    		    }elseif($msg=='yesterday'){
    		    //查询本群昨日所有人汇总
    		        $zdz=Db::name('order')->whereDay('rltime', 'yesterday')->where('group_id',$groupid)->where('zd',0)->where('dj',0)->where('rl',1)->count();
        		    $zdzj=Db::name('order')->whereDay('rltime', 'yesterday')->where('group_id',$groupid)->where('zd',0)->where('dj',0)->where('rl',1)->sum('amount');
        		    //自动冻结
        		    $zdd=Db::name('order')->whereDay('rltime', 'yesterday')->where('group_id',$groupid)->where('zd',0)->where('dj',1)->where('rl',1)->count();
        		    $zddj=Db::name('order')->whereDay('rltime', 'yesterday')->where('group_id',$groupid)->where('zd',0)->where('dj',1)->where('rl',1)->sum('amount');
        		    //手动正常
        		    $sdz=Db::name('order')->whereDay('rltime', 'yesterday')->where('group_id',$groupid)->where('zd',1)->where('dj',0)->where('rl',1)->count();
        		    $sdzj=Db::name('order')->whereDay('rltime', 'yesterday')->where('group_id',$groupid)->where('zd',1)->where('dj',0)->where('rl',1)->sum('amount');
        		    //手动冻结
        		    $sdd=Db::name('order')->whereDay('rltime', 'yesterday')->where('group_id',$groupid)->where('zd',1)->where('dj',1)->where('rl',1)->count();
        		    $sddj=Db::name('order')->whereDay('rltime', 'yesterday')->where('group_id',$groupid)->where('zd',1)->where('dj',1)->where('rl',1)->sum('amount');
        		    //查询所有用户
        		    $userdata=Db::name('user')->select();
        		    $usera='';
        		    if(!empty($userdata)&&$zdz>0){
        		         foreach ($userdata as $i) {
            		        $zcje=Db::name('order')->whereDay('rltime', 'yesterday')->where('group_id',$groupid)->where('tgid',$i['tguid'])->where('rl',1)->where('dj',0)->sum('amount');
            		        $djje=Db::name('order')->whereDay('rltime', 'yesterday')->where('group_id',$groupid)->where('tgid',$i['tguid'])->where('rl',1)->where('dj',1)->sum('amount');
            		        if($zcje!=0||$djje!=0){
            		             $usera=$usera.$i['tgname']." 正常:".$zcje." 冻结:".$djje."\n";
            		        }
            		    }
        		    }else{
        		        $usera='空';
        		    }
        		    //查询域名
        		    $seturl=Db::name('base_config')->where('name','domain')->find();
                    $hdurl=$seturl['data'].'/index/order/zr?groupid='.$groupid;
    		        $msg="本群".date('Y-m-d',strtotime('-1 day'))."的汇总\n🔱自动入账:\n正常: ".$zdzj." (".$zdz."笔)\n冻结: ".$zddj." (".$zdd."笔)\n\n🔆手动入账:\n正常: ".$sdzj." (".$sdz."笔)\n冻结: ".$sddj." (".$sdd."笔)\n\n🚻用户汇总🚻\n".$usera."\n";
    		        
    		    }elseif($msg=='me'){
    		    //表示查询我的的今日汇总
    		    //自动正常
    		    $zdz=Db::name('order')->whereDay('rltime')->where('group_id',$groupid)->where('tgid',$user_id)->where('zd',0)->where('dj',0)->where('rl',1)->count();
    		    $zdzj=Db::name('order')->whereDay('rltime')->where('group_id',$groupid)->where('tgid',$user_id)->where('zd',0)->where('dj',0)->where('rl',1)->sum('amount');
    		    //自动冻结
    		    $zdd=Db::name('order')->whereDay('rltime')->where('group_id',$groupid)->where('tgid',$user_id)->where('zd',0)->where('dj',1)->where('rl',1)->count();
    		    $zddj=Db::name('order')->whereDay('rltime')->where('group_id',$groupid)->where('tgid',$user_id)->where('zd',0)->where('dj',1)->where('rl',1)->sum('amount');
    		    //手动正常
    		    $sdz=Db::name('order')->whereDay('rltime')->where('group_id',$groupid)->where('tgid',$user_id)->where('zd',1)->where('dj',0)->where('rl',1)->count();
    		    $sdzj=Db::name('order')->whereDay('rltime')->where('group_id',$groupid)->where('tgid',$user_id)->where('zd',1)->where('dj',0)->where('rl',1)->sum('amount');
    		    //手动冻结
    		    $sdd=Db::name('order')->whereDay('rltime')->where('group_id',$groupid)->where('tgid',$user_id)->where('zd',1)->where('dj',1)->where('rl',1)->count();
    		    $sddj=Db::name('order')->whereDay('rltime')->where('group_id',$groupid)->where('tgid',$user_id)->where('zd',1)->where('dj',1)->where('rl',1)->sum('amount');
    	         $msg="我".date("Y-m-d")."的汇总\n\n🔱自动入账:\n正常: ".$zdzj." (".$zdz."笔)\n冻结: ".$zddj." (".$zdd."笔)\n\n🔆手动入账:\n正常: ".$sdzj." (".$sdz."笔)\n冻结: ".$sddj." (".$sdd."笔)\n";
    		    }elseif($msg=='meyes'){
    		    //表示查询我的的昨日汇总
    		    //自动正常
        		    $zdz=Db::name('order')->whereDay('rltime', 'yesterday')->where('group_id',$groupid)->where('tgid',$user_id)->where('zd',0)->where('dj',0)->where('rl',1)->count();
        		    $zdzj=Db::name('order')->whereDay('rltime', 'yesterday')->where('group_id',$groupid)->where('tgid',$user_id)->where('zd',0)->where('dj',0)->where('rl',1)->sum('amount');
        		    //自动冻结
        		    $zdd=Db::name('order')->whereDay('rltime', 'yesterday')->where('group_id',$groupid)->where('tgid',$user_id)->where('zd',0)->where('dj',1)->where('rl',1)->count();
        		    $zddj=Db::name('order')->whereDay('rltime', 'yesterday')->where('group_id',$groupid)->where('tgid',$user_id)->where('zd',0)->where('dj',1)->where('rl',1)->sum('amount');
        		    //手动正常
        		    $sdz=Db::name('order')->whereDay('rltime', 'yesterday')->where('group_id',$groupid)->where('tgid',$user_id)->where('zd',1)->where('dj',0)->where('rl',1)->count();
        		    $sdzj=Db::name('order')->whereDay('rltime', 'yesterday')->where('group_id',$groupid)->where('tgid',$user_id)->where('zd',1)->where('dj',0)->where('rl',1)->sum('amount');
        		    //手动冻结
        		    $sdd=Db::name('order')->whereDay('rltime', 'yesterday')->where('group_id',$groupid)->where('tgid',$user_id)->where('zd',1)->where('dj',1)->where('rl',1)->count();
        		    $sddj=Db::name('order')->whereDay('rltime', 'yesterday')->where('group_id',$groupid)->where('tgid',$user_id)->where('zd',1)->where('dj',1)->where('rl',1)->sum('amount');
    		        $msg="我".date('Y-m-d',strtotime('-1 day'))."的汇总\n\n🔱自动入账:\n正常: ".$zdzj." (".$zdz."笔)\n冻结: ".$zddj." (".$zdd."笔)\n\n🔆手动入账:\n正常: ".$sdzj." (".$sdz."笔)\n冻结: ".$sddj." (".$sdd."笔)\n";
    		    }else{
    		        $name = empty($match[1][0])?'':$match[1][0];//指令
    		        //发送/姓名金额 例如 /李四100 查询李四100元订单
    		        $num = empty($match[2][0])?'':$match[2][0];//金额
    		        //判断是查单还是入单
    		             //判断是否有这笔订单
        		        $order=Db::name('order')->where('accname',$name)->where('amount',$num)->where('rl',0)->order('id desc')->find();
        		        if(empty($order)){
        		            $msg="\n❗️ 暂时未查到明细/或已被认领,请30秒后重新发送.";
        		        }else{
        		            if($order['dj']!=1){
        		               //绑定信息
            		            $dataaa = ['group_id' =>$groupid, 'group_name' => $grouptitle, 'tgid' => $user_id, 'tgname' => $user_name, 'rl' => 1, 'rltime' => time()];
            		            $r=DB::name('order')->where('id',$order['id'])->update($dataaa);
            		            if($r){
            		                $msg="\n ✅ ️".$name.' '.$num." ( ".date('Y-m-d  H:i:s')." )  ";
            		            }else{
            		                $msg="\n❗️认领失败！.";
            		            } 
        		            }else{
        		                $dataaa = ['group_id' =>$groupid, 'group_name' => $grouptitle, 'tgid' => $user_id, 'tgname' => $user_name, 'rl' => 1, 'rltime' => time()];
            		            $r=DB::name('order')->where('id',$order['id'])->update($dataaa);
            		            if($r){
            		                $msg="\n⚠该资金已冻结 ".$name. " ".$num." ( ".date('Y-m-d  H:i:s')." ) ";
            		            }else{
            		                $msg="\n❗️认领失败！.";
            		            } 
        		            }
        		            
        		        }
    		       
    		    }
    		    if(!empty($hdurl)){
    		        huiText($message_id,$groupid,$msg,'点击跳转完整账单',$hdurl);
    		    }else{
    		        huiText($message_id,$groupid,$msg);  
    		    }
    		   
    		}
	    }
    }
    //上下分操作
    function groupgl($message_id,$groupid,$grouptitle,$msgtype,$msg,$xin,$user_id,$user_name,$toid,$toname){
        if($msgtype=='text'){
            $zl=substr($msg, 0, 1 );
    		if($zl=='+'){
    		    //金额
    		    $msg = substr($msg, 1);
    		    $orderdata = ['amount' =>$msg, 'zd' => 1, 'group_id' => $groupid, 'rl' => 1, 'tgid' => $toid, 'tgname' => $toname, 'group_name' => $grouptitle, 'rltime' => time(),];
                Db::name('order')->insert($orderdata);
                $msg="\n✅ ️ 手动上帐成功.";
                huiText($message_id,$groupid,$msg);
    		}
        }
        
    }
    //私聊
    function ydy($id,$msg){
        sendText($id,$msg);
    }
}