//添加admin字段
Vue.component('AdminAdd', {
	template: `
		<el-dialog title="创建字段" width="600px" class="icon-dialog" :visible.sync="show" :before-close="closeForm" @open="open"  append-to-body>
        <el-form :size="size" ref="form" :model="form" :rules="rules" label-width="90px">
            <el-tabs v-model="activeName">
                <el-tab-pane style="padding-top:10px"  label="基本信息" name="first">    
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="字段标题" prop="title">
                                <el-input v-model="form.title" clearable placeholder="字段中文描述"  />
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="字段名称" prop="field">
                                <el-input v-model="form.field" clearable placeholder="字段英文名称"/>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="字段类型" prop="type">
                                <el-select style="width:100%" v-model="form.type" @change="selectType" filterable placeholder="请选择">
                                    <el-option v-for="(item,i) in field" :key="i" :label="item.name" :value="item.type"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item v-if="form.type == 22" label="层级" prop="address_type">
                                <el-select style="width:100%" v-model="form.other_config.address_type"  placeholder="请选择级层">
                                    <el-option  key="0" label="省市区" value="1"></el-option>
                                    <el-option  key="1" label="省市" value="2"></el-option>
                                    <el-option  key="2" label="省" value="3"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item v-else-if="form.type == 13" label="上传样式" prop="upload_type">
                                <el-select style="width:100%" v-model="form.other_config.upload_type"  placeholder="上传样式">
                                    <el-option key="0" label="样式1(带缩略图)" value="1"></el-option>
                                    <el-option key="1" label="样式2(带输入框)" value="2"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item v-else-if="form.type == 31" label="长度" prop="rand_length">
                                <el-input v-model="form.other_config.rand_length" clearable placeholder="随机数长度"/>
                            </el-form-item>
							<el-form-item v-else-if="form.type == 9" label="默认值" prop="rand_length">
                                <el-checkbox v-model="form.other_config.now_time">当前时间</el-checkbox>
                            </el-form-item>
                            <el-form-item v-else label="默认值" prop="default_value">
                                <el-input v-model="form.default_value" clearable placeholder="同步数据表默认值"/>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row v-if="form.type == 9 || form.type == 11 || form.type == 12">
                        <el-form-item label="日期格式" prop="datetime_config">
                            <el-select style="width:100%" :size="size" @change="selectDate" v-model="form.datetime_config" clearable  filterable placeholder="请选择日期格式">
                                    <el-option key="1" label="年月日时分秒" value="datetime"></el-option>
                                    <el-option key="2" label="年月日" value="date"></el-option>
                                    <el-option key="3" label="年" value="year"></el-option>
                                    <el-option key="4" label="月" value="month"></el-option>
                                    <el-option key="6" label="时分秒" value="time"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-row>
					<el-row v-if="[13,14,15,16].includes(form.type)">
                        <el-col :span="24">
                            <el-form-item label="后缀格式" prop="filetype">
                                <el-input v-model="form.other_config.filetype" clearable placeholder="多个逗号隔开 doc,xls,xlsx"/>
                            </el-form-item>
                        </el-col>
                    </el-row>
					<el-row v-if="form.type == 31">
                        <el-form-item label="随机数格式" prop="form.other_config.rand_config">
                            <el-select style="width:100%" :size="size" v-model="form.other_config.rand_config" clearable  filterable placeholder="请选择随机数格式">
                                    <el-option key="1" label="字母大小写数字组合" value="all"></el-option>
                                    <el-option key="2" label="字母大小写组合" value="letter"></el-option>
                                    <el-option key="3" label="纯数字组合" value="number"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-row>
                    <el-row v-if="list_item">
                        <el-form-item label="选项配置" prop="item_config">
							<draggable v-model="form.item_config" v-bind="{group:'item'}" handle=".jzd-handle">
                            <el-row v-for="(item,i) in form.item_config" :key="i">
                                <el-col :span="7">
                                    <el-form-item style="margin-bottom:3px !important">
                                        <el-input  v-model="item.key" placeholder="选项名称"/>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="6">
                                    <el-form-item style="margin-bottom:3px !important">
                                        <el-input style="position:relative;left:5px;" v-model="item.val" placeholder="选项值"/>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="6">
                                    <el-form-item style="margin-bottom:3px !important">
                                        <el-select style="position:relative;left:10px;" v-model="item.label_color" size="small" clearable placeholder="请选择背景色">
                                            <el-option key="1" style="background:#409eff" label="primary" value="primary"></el-option>
                                            <el-option key="2" style="background:#67c23a" label="success" value="success"></el-option>
                                            <el-option key="3" style="background:#909399" label="info" value="info"></el-option>
                                            <el-option key="4" style="background:#e6a23c" label="warning" value="warning"></el-option>
                                            <el-option key="5" style="background:#f56c6c" label="danger" value="danger"></el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="4">
                                    <el-button type="danger" size="mini" style="position:relative;left:15px"  icon="el-icon-close" @click="deleteItem('item_config',i)"></el-button>
									<el-button class="jzd-handle" type="success" size="mini" style="position:relative;left:12px" icon="el-icon-rank"></el-button>
                                </el-col> 
                            </el-row>
							</draggable>
                            <div>
                                <el-button type="success" icon="el-icon-plus" style="padding:5px 7px" :size="size" @click="addItem('item_config')">追加</el-button>
                                <el-button v-if="form.item_config.length > 0" type="warning" icon="el-icon-delete" style="padding:5px 7px" :size="size" @click="clearItem('item_config')">清空</el-button>
                                <el-select v-if="form.item_config.length === 0"  :size="size" style="height:25px; light:25px; margin-left:20px;" v-model="default_config" @change="setDefaultItem"  placeholder="请选择默认配置">
                                    <el-option v-for="(item,i) in item_field" :key="i" :label="item.name" :value="item.item"></el-option>
                                </el-select>
                            </div>
                        </el-form-item>
                    </el-row>
                    <el-row v-if="list_item && dbtype !== 'mongo'">
                        <el-form-item label="sql数据源" prop="sql">
                            <el-input type="textarea" v-model="form.sql" clearable placeholder="单选/下拉/多选选项 sql数据源"/>
                        </el-form-item>
                    </el-row>
					<el-row v-if="form.type == 2 && dbtype !== 'mongo'">
                        <el-form-item label="联动字段" prop="liandong_field">
                            <el-input v-model="form.other_config.liandong_field" clearable placeholder="二级联动字段名"/>
                        </el-form-item>
                    </el-row>
                    <el-row>
                        <el-col v-if="dbtype !== 'mongo'" :span="12">
                            <el-form-item label="创建字段" prop="create_table_field">
                                <el-radio-group v-model="form.create_table_field">
                                    <el-radio :label="1">是</el-radio>
                                    <el-radio :label="0">否</el-radio>
                                </el-radio-group>
                            </el-form-item>
                        </el-col>
                        <el-col :span="dbtype !== 'mongo' ? 12:24">
                             <el-form-item label="显示状态" prop="list_show">
                                <el-select style="width:100%" v-model="form.list_show" :size="size" filterable placeholder="请选择">
                                    <el-option-group label="显示状态">
                                        <el-option key="1" label="不显示" :value="0"></el-option>
                                    </el-option-group>
                                    <el-option-group label="显示位置">
                                        <el-option key="3" label="居中" :value="2"></el-option>
                                        <el-option key="4" label="居左" :value="3"></el-option>
                                        <el-option key="5" label="居右" :value="4"></el-option>
                                    </el-option-group>
                                </el-select>
                             </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row v-if="form.create_table_field == 0 && dbtype !== 'mongo'">
                        <el-col :span="24">
                            <el-form-item label="所属表" prop="belong_table">
                                <el-select @focus="getTablesByMenuId" @change="setPostStatus" style="width:100%" clearable v-model="form.belong_table" filterable  placeholder="关联字段所属表（配置多表专属，其它勿设置）">
                                    <el-option v-for="(item,i) in tableList" :key="i" :value="item.table_name">{{item.table_name}}({{item.title}})</el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                     <el-row>
                        <el-col :span="12">
                            <el-form-item label="验证方式" prop="validate">
                                <el-checkbox-group v-model="form.validate">
                                    <el-checkbox label="notempty">不为空</el-checkbox>
                                    <el-checkbox label="unique">唯一</el-checkbox>
                                </el-checkbox-group>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="可录入" prop="post_status">
                                <el-radio v-model="form.post_status" :label="1">是</el-radio>
                                <el-radio v-model="form.post_status" :label="0">否</el-radio>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="20">
                            <el-form-item label="验证规则" prop="rule">
                                <el-input v-model="form.rule" clearable placeholder="输入框验证规则"/>
                            </el-form-item>
                        </el-col>
                        <el-col :span="4">
                            <el-select :size="size" v-model="default_rules" @change="setDefaultRule" prop="default_rules" clearable filterable placeholder="请选择">
                                <el-option v-for="(item,index) in ruleList" :key="index" :label="index" :value="item"></el-option>
                            </el-select>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="8">
                            <el-form-item label="数据结构" prop="datatype">
                                <el-select v-model="form.datatype" filterable @change="setFieldLength"  placeholder="请选择">
                                    <el-option v-for="(item,i) in propertyField" :key="i" :label="item.name" :value="item.name"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col v-if="dbtype !== 'mongo'" :span="8">
                            <el-form-item label="字段长度" prop="length">
                                <el-input v-model="form.length" placeholder="字段长度"/>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="字段索引" prop="indexdata">
                                <el-select v-model="form.indexdata" filterable placeholder="请选择">
                                    <el-option key="1" label="普通索引" value="index"></el-option>
                                    <el-option key="2" label="唯一索引" value="unique"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-tab-pane>
                <el-tab-pane style="padding-top:10px"  label="拓展信息" name="second">
                    <el-row v-if="form.type ==1 || form.type == 17">
                        <el-col :span="12">
                            <el-form-item label="最大输入" prop="input_length">
                                <el-input v-model="form.other_config.input_length" placeholder="请输入长度">
                                    <el-button type="success" slot="append">个字符</el-button>
                                </el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="背景色" prop="label_color">
                                <el-select style="width:100%" v-model="form.other_config.label_color" :size="size" clearable filterable placeholder="请选择">
                                    <el-option key="1" style="background:#409eff" label="primary" value="primary"></el-option>
                                    <el-option key="2" style="background:#67c23a" label="success" value="success"></el-option>
                                    <el-option key="3" style="background:#909399" label="info" value="info"></el-option>
                                    <el-option key="4" style="background:#e6a23c" label="warning" value="warning"></el-option>
                                    <el-option key="5" style="background:#f56c6c" label="danger" value="danger"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row v-if="form.type ==1">
                        <el-col :span="12">
                            <el-form-item label="输入前缀" prop="prefix">
                                <el-input v-model="form.other_config.prefix" placeholder="请输入前缀"/>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="输入后缀" prop="afterfix">
                                <el-input v-model="form.other_config.afterfix" placeholder="请输入后缀"/>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row v-if="form.type ==1 || form.type == 8 || form.type == 17">
                        <el-form-item label="前置图标" prop="pre_icon">
                            <el-input v-model="form.icon" placeholder="点击选择图标" clearable>
                                <el-button type="success" slot="append" icon="el-icon-thumb"  @click="iconDialogStatus = true">请选择</el-button>
                            </el-input>
                        </el-form-item>
                    </el-row>
					<el-row>
                        <el-form-item label="文本说明" prop="placeholder">
                            <el-input v-model="form.other_config.placeholder" clearable placeholder="请输入placeholder，文本说明"/>
                        </el-form-item>
                    </el-row>
                    <el-row>
                        <el-form-item label="显示条件" prop="show_condition">
                            <el-input v-model="form.show_condition" clearable placeholder="输入框显示条件"/>
                        </el-form-item>
                    </el-row>
					<el-row>
                        <el-form-item label="列表排序" prop="sort_status">
                            <el-checkbox v-model="form.other_config.sort_status">列表table表头箭头排序</el-checkbox>
                        </el-form-item>
                    </el-row>
                </el-tab-pane>
            </el-tabs>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button :size="size" :loading="loading" type="primary" @click="submit" >
                <span v-if="!loading">确 定</span>
                <span v-else>提 交 中...</span>
            </el-button>
            <el-button :size="size" @click="closeForm">取 消</el-button>
        </div>
        <Icon :iconshow.sync="iconDialogStatus" :icon.sync="form.icon" size="small"></Icon>
    </el-dialog>
	`
	,
	 props: {
		show: {
			type: Boolean,
			default: false
		},
		size: {
			type: String,
			default: 'small'
		},
		menuid: {
			type: String,
		},
		field: {
			type: Array,
		},
		item_field: {
			type: Array,
		}
	},
	data() {
		return {
			form: {
				title:'',
				post_status:1,
				create_table_field:1,
				list_show:2,
				validate:[],
				item_config:[],
				other_config:{
					address_type : '1',
					now_time:true,
					placeholder:'',
					rand_config:'',
					filetype:'',
					liandong_field:'',
					sort_status:false,
				},
				sql:'',
				datatype:'',
				length:'',
				belong_table:'',
				default_value:'',
				menu_id:this.menuid,
			},
			iconDialogStatus:false,
			activeName: 'first',
			list_item:false,
			loading:false,
			propertyField:[],
			default_config:'',
			default_rules:'',
			ruleList:[],
			tableList:[],
			dbtype:'',
			rules: {
				title: [{ required: true, message: '字段中文名不能为空', trigger: 'blur' }],
				field: [{ required: true, message: '字段英文名不能为空', trigger: 'blur' }],
				type: [{ required: true, message: '字段类型不能为空', trigger: 'blur' }],
				login_fields: [{ required: true, message: '请配置登录账号密码字段', trigger: 'blur' }],
			},
		}
	},
	methods: {
		submit(){
			this.$refs['form'].validate(valid => {
				if (valid) {
					this.loading = true
					axios.post(base_url+'/Sys.Base/createField',this.form).then(res => {
						if(res.data.status == 200){
							this.$message({message: '操作成功', type: 'success'})
							this.$emit('refesh_list')
							this.closeForm()
						}else{
							this.loading = false
							this.$message.error(res.data.msg)
						}
					}).catch(()=>{
						this.loading = false
					})
				}
			})
		},
		open(){
			axios.post(base_url+'/Sys.Base/configList',{menu_id:this.menuid}).then(res => {
				this.ruleList = res.data.ruleList
				this.propertyField = res.data.propertyField
				this.dbtype = res.data.dbtype
			})
		},
		selectType(){
			if(this.dbtype !== 'mongo'){
				this.field.forEach(item=>{
					if(this.form.type == item.type){
						this.propertyField.forEach(vo=>{
							if(item.property == vo.type){
								this.form.datatype = vo.name
								this.form.length = vo.decimal ? vo.maxlen+','+vo.decimal : vo.maxlen
							}
						})
						this.list_item = item.item
						if(!item.item){
							this.form.item_config = []
						}
					}
				})
			}else{
				this.field.forEach(item=>{
					if(this.form.type == item.type){
						this.propertyField.forEach(vo=>{
							if(item.mongoProperty == vo.type){
								this.form.datatype = vo.name
							}
						})
						this.list_item = item.item
						if(!item.item){
							this.form.item_config = []
						}
					}
				})
			}
		},
		setDefaultRule(){
			this.form.rule = this.default_rules
		},
		setFieldLength(){
			if(this.dbtype !== 'mongo'){
				this.propertyField.forEach(item =>{
				   if(this.form.datatype == item.name){
					   this.form.length = item.decimal ? item.maxlen+','+item.decimal : item.maxlen
				   }
				})
			}
		},
		addItem(key){
			this.form[key].push({})
		},
		deleteItem(key,index){
		   this.form[key].splice(index,1)
		},
		clearItem(key){
			this.form[key] = []
		},
		setDefaultItem(val){
			this.form['item_config'] = val
		},
		getTablesByMenuId(){
			axios.post(base_url+'/Sys.Base/getTablesByMenuId',{menu_id:this.menuid}).then(res => {
				this.tableList = res.data.data
			})
		},
		setPostStatus(){
			this.form.post_status = 0
		},
		selectDate(val){
			if(this.dbtype !== 'mongo'){
				if(['year','month','time','dates'].includes(val)){
					this.form.datatype = 'varchar'
					this.form.length = 250
				}else{
					this.form.datatype = 'int'
					this.form.length = 10
				}
			}else{
				if(['year','month','time','dates'].includes(val)){
					this.form.datatype = 'string'
					this.form.length = 250
				}else{
					this.form.datatype = 'int'
					this.form.length = 10
				}
			}
		},
		closeForm(){
			this.$emit('update:show', false)
			this.loading = false
			this.$nextTick(()=>{
				this.$refs['form'].resetFields();//清空表单
				this.default_rules = ''
				this.list_item = false
				this.form.other_config = {}
				this.activeName = 'first'
			})
		}
	},
});


//修改admin字段
Vue.component('AdminUpdate', {
	template: `
		<el-dialog title="更新字段" width="600px" class="icon-dialog" :visible.sync="show" :before-close="closeForm" @open="open"  append-to-body>
        <el-form :size="size" ref="form" :model="form" :rules="rules" label-width="90px">
            <el-tabs v-model="activeName">
                <el-tab-pane style="padding-top:10px"  label="基本信息" name="first">    
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="字段标题" prop="title">
                                <el-input v-model="form.title" clearable placeholder="字段中文描述"  />
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="字段名称" prop="field">
                                <el-input v-model="form.field" clearable placeholder="字段英文名称"/>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="字段类型" prop="type">
                                <el-select style="width:100%" v-model="form.type" @change="selectType" filterable placeholder="请选择">
                                    <el-option v-for="(item,i) in field" :key="i" :label="item.name" :value="item.type"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item v-if="form.type == 22" label="层级" prop="address_type">
                                <el-select style="width:100%" v-model="form.other_config.address_type"  placeholder="请选择级层">
                                    <el-option  key="0" label="省市区" value="1"></el-option>
                                    <el-option  key="1" label="省市" value="2"></el-option>
                                    <el-option  key="2" label="省" value="3"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item v-else-if="form.type == 13" label="上传样式" prop="upload_type">
                                <el-select style="width:100%" v-model="form.other_config.upload_type"  placeholder="上传样式">
                                    <el-option key="0" label="样式1(带缩略图)" value="1"></el-option>
                                    <el-option key="1" label="样式2(带输入框)" value="2"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item v-else-if="form.type == 31" label="长度" prop="rand_length">
                                <el-input v-model="form.other_config.rand_length" clearable placeholder="随机数长度"/>
                            </el-form-item>
							<el-form-item v-else-if="form.type == 9" label="默认值" prop="rand_length">
                                <el-checkbox v-model="form.other_config.now_time">当前时间</el-checkbox>
                            </el-form-item>
                            <el-form-item v-else label="默认值" prop="default_value">
                                <el-input v-model="form.default_value" clearable placeholder="同步数据表默认值"/>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row v-if="form.type == 9 || form.type == 11 || form.type == 12">
                        <el-form-item label="日期格式" prop="datetime_config">
                            <el-select style="width:100%" :size="size" @change="selectDate" v-model="form.datetime_config" clearable  filterable placeholder="请选择日期格式">
                                    <el-option key="1" label="年月日时分秒" value="datetime"></el-option>
                                    <el-option key="2" label="年月日" value="date"></el-option>
                                    <el-option key="3" label="年" value="year"></el-option>
                                    <el-option key="4" label="月" value="month"></el-option>
                                    <el-option key="6" label="时分秒" value="time"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-row>
					<el-row v-if="[13,14,15,16].includes(form.type)">
                        <el-col :span="24">
                            <el-form-item label="后缀格式" prop="filetype">
                                <el-input v-model="form.other_config.filetype" clearable placeholder="多个逗号隔开 doc,xls,xlsx"/>
                            </el-form-item>
                        </el-col>
                    </el-row>
					<el-row v-if="form.type == 31">
                        <el-form-item label="随机数格式" prop="form.other_config.rand_config">
                            <el-select style="width:100%" :size="size" v-model="form.other_config.rand_config" clearable  filterable placeholder="请选择随机数格式">
                                    <el-option key="1" label="字母大小写数字组合" value="all"></el-option>
                                    <el-option key="2" label="字母大小写组合" value="letter"></el-option>
                                    <el-option key="3" label="纯数字组合" value="number"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-row>
                    <el-row v-if="list_item">
                        <el-form-item label="选项配置" prop="item_config">
							<draggable v-model="form.item_config" v-bind="{group:'item'}" handle=".jzd-handle">
                            <el-row v-for="(item,i) in form.item_config" :key="i">
                                <el-col :span="7">
                                    <el-form-item style="margin-bottom:3px !important">
                                        <el-input  v-model="item.key" placeholder="选项名称"/>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="6">
                                    <el-form-item style="margin-bottom:3px !important">
                                        <el-input style="position:relative;left:5px;" v-model="item.val" placeholder="选项值"/>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="6">
                                    <el-form-item style="margin-bottom:3px !important">
                                        <el-select style="position:relative;left:10px;" v-model="item.label_color" size="small" clearable placeholder="请选择背景色">
                                            <el-option key="1" style="background:#409eff" label="primary" value="primary"></el-option>
                                            <el-option key="2" style="background:#67c23a" label="success" value="success"></el-option>
                                            <el-option key="3" style="background:#909399" label="info" value="info"></el-option>
                                            <el-option key="4" style="background:#e6a23c" label="warning" value="warning"></el-option>
                                            <el-option key="5" style="background:#f56c6c" label="danger" value="danger"></el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="4">
                                    <el-button type="danger" size="mini" style="position:relative;left:15px"  icon="el-icon-close" @click="deleteItem('item_config',i)"></el-button>
									<el-button class="jzd-handle" type="success" size="mini" style="position:relative;left:12px" icon="el-icon-rank"></el-button>
                                </el-col> 
                            </el-row>
							</draggable>
                            <div>
                                <el-button type="success" icon="el-icon-plus" style="padding:5px 7px" :size="size" @click="addItem('item_config')">追加</el-button>
                                <el-button v-if="form.item_config.length > 0" type="warning" icon="el-icon-delete" style="padding:5px 7px" :size="size" @click="clearItem('item_config')">清空</el-button>
                                <el-select v-if="form.item_config.length === 0"  :size="size" style="height:25px; light:25px; margin-left:20px;" v-model="default_config" @change="setDefaultItem"  placeholder="请选择默认配置">
                                    <el-option v-for="(item,i) in item_field" :key="i" :label="item.name" :value="item.item"></el-option>
                                </el-select>
                            </div>
                        </el-form-item>
                    </el-row>
                    <el-row v-if="list_item && dbtype !== 'mongo'">
                        <el-form-item label="sql数据源" prop="sql">
                            <el-input type="textarea" v-model="form.sql" clearable placeholder="单选/下拉/多选选项 sql数据源"/>
                        </el-form-item>
                    </el-row>
					<el-row v-if="form.type == 2 && dbtype !== 'mongo'">
                        <el-form-item label="联动字段" prop="liandong_field">
                            <el-input v-model="form.other_config.liandong_field" clearable placeholder="二级联动字段名"/>
                        </el-form-item>
                    </el-row>
                    <el-row>
                        <el-col v-if="dbtype !== 'mongo'" :span="12">
                            <el-form-item label="更新字段" prop="create_table_field">
                                <el-radio-group v-model="form.create_table_field">
                                    <el-radio :label="1">是</el-radio>
                                    <el-radio :label="0">否</el-radio>
                                </el-radio-group>
                            </el-form-item>
                        </el-col>
                        <el-col :span="dbtype !== 'mongo' ? 12:24">
                             <el-form-item label="显示状态" prop="list_show">
                                <el-select style="width:100%" v-model="form.list_show" :size="size" filterable placeholder="请选择">
                                    <el-option-group label="显示状态">
                                        <el-option key="1" label="不显示" :value="0"></el-option>
                                    </el-option-group>
                                    <el-option-group label="显示位置">
                                        <el-option key="3" label="居中" :value="2"></el-option>
                                        <el-option key="4" label="居左" :value="3"></el-option>
                                        <el-option key="5" label="居右" :value="4"></el-option>
                                    </el-option-group>
                                </el-select>
                             </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row v-if="form.create_table_field == 0 && dbtype !== 'mongo'">
                        <el-col :span="24">
                            <el-form-item label="所属表" prop="belong_table">
                                <el-select @focus="getTablesByMenuId" @change="setPostStatus" style="width:100%" clearable v-model="form.belong_table" filterable  placeholder="关联字段所属表（配置多表专属，其它勿设置）">
                                    <el-option v-for="(item,i) in tableList" :key="i" :value="item.table_name">{{item.table_name}}({{item.title}})</el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                     <el-row>
                        <el-col :span="12">
                            <el-form-item label="验证方式" prop="validate">
                                <el-checkbox-group v-model="form.validate">
                                    <el-checkbox label="notempty">不为空</el-checkbox>
                                    <el-checkbox label="unique">唯一</el-checkbox>
                                </el-checkbox-group>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="可录入" prop="post_status">
                                <el-radio v-model="form.post_status" :label="1">是</el-radio>
                                <el-radio v-model="form.post_status" :label="0">否</el-radio>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="20">
                            <el-form-item label="验证规则" prop="rule">
                                <el-input v-model="form.rule" clearable placeholder="输入框验证规则"/>
                            </el-form-item>
                        </el-col>
                        <el-col :span="4">
                            <el-select :size="size" v-model="default_rules" @change="setDefaultRule" prop="default_rules" clearable filterable placeholder="请选择">
                                <el-option v-for="(item,index) in ruleList" :key="index" :label="index" :value="item"></el-option>
                            </el-select>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="8">
                            <el-form-item label="数据结构" prop="datatype">
                                <el-select v-model="form.datatype" filterable @change="setFieldLength"  placeholder="请选择">
                                    <el-option v-for="(item,i) in propertyField" :key="i" :label="item.name" :value="item.name"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col v-if="dbtype !== 'mongo'" :span="8">
                            <el-form-item label="字段长度" prop="length">
                                <el-input v-model="form.length" placeholder="字段长度"/>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="字段索引" prop="indexdata">
                                <el-select v-model="form.indexdata" filterable placeholder="请选择">
                                    <el-option key="1" label="普通索引" value="index"></el-option>
                                    <el-option key="2" label="唯一索引" value="unique"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-tab-pane>
                <el-tab-pane style="padding-top:10px"  label="拓展信息" name="second">
                    <el-row v-if="form.type ==1 || form.type == 17">
                        <el-col :span="12">
                            <el-form-item label="最大输入" prop="input_length">
                                <el-input v-model="form.other_config.input_length" placeholder="请输入长度">
                                    <el-button type="success" slot="append">个字符</el-button>
                                </el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="背景色" prop="label_color">
                                <el-select style="width:100%" v-model="form.other_config.label_color" :size="size" clearable filterable placeholder="请选择">
                                    <el-option key="1" style="background:#409eff" label="primary" value="primary"></el-option>
                                    <el-option key="2" style="background:#67c23a" label="success" value="success"></el-option>
                                    <el-option key="3" style="background:#909399" label="info" value="info"></el-option>
                                    <el-option key="4" style="background:#e6a23c" label="warning" value="warning"></el-option>
                                    <el-option key="5" style="background:#f56c6c" label="danger" value="danger"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row v-if="form.type ==1">
                        <el-col :span="12">
                            <el-form-item label="输入前缀" prop="prefix">
                                <el-input v-model="form.other_config.prefix" placeholder="请输入前缀"/>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="输入后缀" prop="afterfix">
                                <el-input v-model="form.other_config.afterfix" placeholder="请输入后缀"/>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row v-if="form.type ==1 || form.type == 8 || form.type == 17">
                        <el-form-item label="前置图标" prop="pre_icon">
                            <el-input v-model="form.icon" placeholder="点击选择图标" clearable>
                                <el-button type="success" slot="append" icon="el-icon-thumb"  @click="iconDialogStatus = true">请选择</el-button>
                            </el-input>
                        </el-form-item>
                    </el-row>
					<el-row>
                        <el-form-item label="文本说明" prop="placeholder">
                            <el-input v-model="form.other_config.placeholder" clearable placeholder="请输入placeholder，文本说明"/>
                        </el-form-item>
                    </el-row>
                    <el-row>
                        <el-form-item label="显示条件" prop="show_condition">
                            <el-input v-model="form.show_condition" clearable placeholder="输入框显示条件"/>
                        </el-form-item>
                    </el-row>
					<el-row>
                        <el-form-item label="列表排序" prop="sort_status">
                            <el-checkbox v-model="form.other_config.sort_status">列表table表头箭头排序</el-checkbox>
                        </el-form-item>
                    </el-row>
                </el-tab-pane>
            </el-tabs>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button :size="size" :loading="loading" type="primary" @click="submit" >
                <span v-if="!loading">确 定</span>
                <span v-else>提 交 中...</span>
            </el-button>
            <el-button :size="size" @click="closeForm">取 消</el-button>
        </div>
        <Icon :iconshow.sync="iconDialogStatus" :icon.sync="form.icon" size="small"></Icon>
    </el-dialog>
	`
	,
	 props: {
		show: {
			type: Boolean,
			default: false
		},
		size: {
			type: String,
			default: 'small'
		},
		menu_id: {
			type: String,
		},
		field: {
			type: Array,
		},
		item_field: {
			type: Array,
		},
		info: {
			type: Object,
		},
	},
	data() {
		return {
			form: {
				title:'',
				post_status:1,
				create_table_field:1,
				list_show:2,
				validate:[],
				item_config:[],
				other_config:{
					address_type : 1,
					now_time:true,
					placeholder:'',
					liandong_field:'',
					sort_status:false,
				},
				sql:'',
				datatype:'',
				length:'',
				belong_table:'',
				default_value:''
			},
			iconDialogStatus:false,
			activeName: 'first',
			list_item:false,
			loading:false,
			propertyField:[],
			default_config:'',
			default_rules:'',
			ruleList:[],
			tableList:[],
			dbtype:'',
			rules: {
				title: [{ required: true, message: '字段中文名不能为空', trigger: 'blur' }],
				field: [{ required: true, message: '字段英文名不能为空', trigger: 'blur' }],
				type: [{ required: true, message: '字段类型不能为空', trigger: 'blur' }],
				login_fields: [{ required: true, message: '请配置登录账号密码字段', trigger: 'blur' }],
			},
		}
	},
	methods: {
		submit(){
			this.$refs['form'].validate(valid => {
				if (valid) {
					this.loading = true
					axios.post(base_url+'/Sys.Base/updateField',this.form).then(res => {
						if(res.data.status == 200){
							this.$message({message: '操作成功', type: 'success'})
							this.$emit('refesh_list')
							this.closeForm()
						}else{
							this.loading = false
							this.$message.error(res.data.msg)
						}
					}).catch(()=>{
						this.loading = false
					})
				}
			})
		},
		open(){
			this.form = this.info
			if(this.form.other_config == '' || this.form.other_config == '[]' || this.form.other_config == null){
				this.form.other_config = {}
			}else{
				this.form.other_config = JSON.parse(this.info.other_config)
			}
			this.setDefaultVal('item_config')
			this.field.forEach(item=>{
				if(this.form.type == item.type){
					this.list_item = item.item
				}
			})
			axios.post(base_url+'/Sys.Base/configList',{menu_id:this.menu_id}).then(res => {
				this.ruleList = res.data.ruleList
				this.propertyField = res.data.propertyField
				this.dbtype = res.data.dbtype
			})
		},
		selectType(){
			if(this.dbtype !== 'mongo'){
				this.field.forEach(item=>{
					if(this.form.type == item.type){
						this.propertyField.forEach(vo=>{
							if(item.property == vo.type){
								this.form.datatype = vo.name
								this.form.length = vo.decimal ? vo.maxlen+','+vo.decimal : vo.maxlen
							}
						})
						this.list_item = item.item
						if(!item.item){
							this.form.item_config = []
						}
					}
				})
			}else{
				this.field.forEach(item=>{
					if(this.form.type == item.type){
						this.propertyField.forEach(vo=>{
							if(item.mongoProperty == vo.type){
								this.form.datatype = vo.name
							}
						})
						this.list_item = item.item
						if(!item.item){
							this.form.item_config = []
						}
					}
				})
			}
		},
		setDefaultVal(key){
			if(this.form[key] == null || this.form[key] == ''){
				this.form[key] = []
			}
		},
		setDefaultRule(){
			this.form.rule = this.default_rules
		},
		setFieldLength(){
			if(this.dbtype !== 'mongo'){
				this.propertyField.forEach(item =>{
				   if(this.form.datatype == item.name){
					   this.form.length = item.decimal ? item.maxlen+','+item.decimal : item.maxlen
				   }
				})
			}
		},
		addItem(key){
			this.form[key].push({})
		},
		deleteItem(key,index){
		   this.form[key].splice(index,1)
		},
		clearItem(key){
			this.form[key] = []
		},
		setDefaultItem(val){
			this.form['item_config'] = val
		},
		getTablesByMenuId(){
			axios.post(base_url+'/Sys.Base/getTablesByMenuId',{menu_id:this.menu_id}).then(res => {
				this.tableList = res.data.data
			})
		},
		setPostStatus(){
			this.form.post_status = 0
		},
		selectDate(val){
			if(this.dbtype !== 'mongo'){
				if(['year','month','time','dates'].includes(val)){
					this.form.datatype = 'varchar'
					this.form.length = 250
				}else{
					this.form.datatype = 'int'
					this.form.length = 10
				}
			}else{
				if(['year','month','time','dates'].includes(val)){
					this.form.datatype = 'string'
					this.form.length = 250
				}else{
					this.form.datatype = 'int'
					this.form.length = 10
				}
			}
		},
		closeForm(){
			this.$emit('update:show', false)
			this.loading = false
			this.$nextTick(()=>{
				this.$refs['form'].resetFields();//清空表单
				this.default_rules = ''
				this.list_item = false
				this.form.other_config = {}
				this.activeName = 'first'
			})
		}
	},
});

//添加api字段
Vue.component('ApiAdd', {
	template: `
		<el-dialog title="创建字段" width="600px" class="icon-dialog" :visible.sync="show" :before-close="closeForm" @open="open"  append-to-body>
        <el-form :size="size" ref="form" :model="form" :rules="rules" label-width="90px"> 
            <el-row>
                <el-col :span="12">
                    <el-form-item label="字段标题" prop="title">
                        <el-input v-model="form.title" clearable placeholder="字段中文描述"  />
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="字段名称" prop="field">
                        <el-input v-model="form.field" clearable placeholder="字段英文名称"/>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="字段类型" prop="type">
                        <el-select style="width:100%" v-model="form.type" @change="selectType" filterable placeholder="请选择">
                            <el-option v-for="(item,i) in field" :key="i" :label="item.type == 30 ? 'token解码值':item.name" :value="item.type"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item v-if="form.type == 22" label="层级" prop="address_type">
                        <el-select style="width:100%" v-model="form.other_config.address_type"  placeholder="请选择级层">
                            <el-option  key="0" label="省市区" value="1"></el-option>
                            <el-option  key="1" label="省市" value="2"></el-option>
                            <el-option  key="2" label="省" value="3"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item v-else-if="form.type == 31" label="长度" prop="rand_length">
                        <el-input v-model="form.other_config.rand_length" clearable placeholder="随机数长度"/>
                    </el-form-item>
                    <el-form-item v-else label="默认值" prop="default_value">
                        <el-input v-model="form.default_value" clearable placeholder="同步数据表默认值"/>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row v-if="form.type == 9 || form.type == 11 || form.type == 12">
                <el-form-item label="日期格式" prop="datetime_config">
                    <el-select style="width:100%" :size="size" @change="selectDate" v-model="form.datetime_config" clearable  filterable placeholder="请选择日期格式">
                            <el-option key="1" label="年月日时分秒" value="datetime"></el-option>
                            <el-option key="2" label="年月日" value="date"></el-option>
                            <el-option key="3" label="年" value="year"></el-option>
                            <el-option key="4" label="月" value="month"></el-option>
                            <el-option key="5" label="多个日期" value="dates"></el-option>
                    </el-select>
                </el-form-item>
            </el-row>
			<el-row v-if="form.type == 31">
				<el-form-item label="随机数格式" prop="form.other_config.rand_config">
					<el-select style="width:100%" :size="size" v-model="form.other_config.rand_config" clearable  filterable placeholder="请选择随机数格式">
							<el-option key="1" label="字母大小写数字组合" value="all"></el-option>
							<el-option key="2" label="字母大小写组合" value="letter"></el-option>
							<el-option key="3" label="纯数字组合" value="number"></el-option>
					</el-select>
				</el-form-item>
			</el-row>
            <el-row v-if="list_item">
				<el-form-item label="选项配置" prop="item_config">
					<draggable v-model="form.item_config" v-bind="{group:'item'}" handle=".jzd-handle">
					<el-row v-for="(item,i) in form.item_config" :key="i">
						<el-col :span="7">
							<el-form-item style="margin-bottom:3px !important">
								<el-input  v-model="item.key" placeholder="选项名称"/>
							</el-form-item>
						</el-col>
						<el-col :span="6">
							<el-form-item style="margin-bottom:3px !important">
								<el-input style="position:relative;left:5px;" v-model="item.val" placeholder="选项值"/>
							</el-form-item>
						</el-col>
						<el-col :span="6">
							<el-form-item style="margin-bottom:3px !important">
								<el-select style="position:relative;left:10px;" v-model="item.label_color" size="small" clearable placeholder="请选择背景色">
									<el-option key="1" style="background:#409eff" label="primary" value="primary"></el-option>
									<el-option key="2" style="background:#67c23a" label="success" value="success"></el-option>
									<el-option key="3" style="background:#909399" label="info" value="info"></el-option>
									<el-option key="4" style="background:#e6a23c" label="warning" value="warning"></el-option>
									<el-option key="5" style="background:#f56c6c" label="danger" value="danger"></el-option>
								</el-select>
							</el-form-item>
						</el-col>
						<el-col :span="4">
							<el-button type="danger" size="mini" style="position:relative;left:15px"  icon="el-icon-close" @click="deleteItem('item_config',i)"></el-button>
							<el-button class="jzd-handle" type="success" size="mini" style="position:relative;left:12px" icon="el-icon-rank"></el-button>
						</el-col> 
					</el-row>
					</draggable>
					<div>
						<el-button type="success" icon="el-icon-plus" style="padding:5px 7px" :size="size" @click="addItem('item_config')">追加</el-button>
						<el-button v-if="form.item_config.length > 0" type="warning" icon="el-icon-delete" style="padding:5px 7px" :size="size" @click="clearItem('item_config')">清空</el-button>
						<el-select v-if="form.item_config.length === 0"  :size="size" style="height:25px; light:25px; margin-left:20px;" v-model="default_config" @change="setDefaultItem"  placeholder="请选择默认配置">
							<el-option v-for="(item,i) in item_field" :key="i" :label="item.name" :value="item.item"></el-option>
						</el-select>
					</div>
				</el-form-item>
			</el-row>
			<el-row>
                <el-col v-if="dbtype !== 'mongo'" :span="24">
                    <el-form-item label="创建字段" prop="create_table_field">
                        <el-radio-group v-model="form.create_table_field">
                            <el-radio :label="1">是</el-radio>
                            <el-radio :label="0">否</el-radio>
                        </el-radio-group>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="验证方式" prop="validate">
                        <el-checkbox-group v-model="form.validate">
                            <el-checkbox label="notempty">不为空</el-checkbox>
                            <el-checkbox label="unique">唯一</el-checkbox>
                        </el-checkbox-group>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="可录入" prop="post_status">
                        <el-radio v-model="form.post_status" :label="1">是</el-radio>
                        <el-radio v-model="form.post_status" :label="0">否</el-radio>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="20">
                    <el-form-item label="验证规则" prop="rule">
                        <el-input v-model="form.rule" clearable placeholder="输入框验证规则"/>
                    </el-form-item>
                </el-col>
                <el-col :span="4">
                    <el-select :size="size" v-model="default_rules" @change="setDefaultRule" prop="default_rules" clearable filterable placeholder="请选择">
                        <el-option v-for="(item,index) in ruleList" :key="index" :label="index" :value="item"></el-option>
                    </el-select>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="8">
                    <el-form-item label="数据结构" prop="datatype">
                        <el-select v-model="form.datatype" filterable @change="setFieldLength"  placeholder="请选择">
                            <el-option v-for="(item,i) in propertyField" :key="i" :label="item.name" :value="item.name"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col v-if="dbtype !== 'mongo'" :span="8">
                    <el-form-item label="字段长度" prop="length">
                        <el-input v-model="form.length" placeholder="字段长度"/>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="字段索引" prop="indexdata">
                        <el-select v-model="form.indexdata" filterable placeholder="请选择">
                            <el-option key="1" label="普通索引" value="index"></el-option>
                            <el-option key="2" label="唯一索引" value="unique"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button :size="size" :loading="loading" type="primary" @click="submit" >
                <span v-if="!loading">确 定</span>
                <span v-else>提 交 中...</span>
            </el-button>
            <el-button :size="size" @click="closeForm">取 消</el-button>
        </div>
    </el-dialog>
	`
	,
	 props: {
		show: {
			type: Boolean,
			default: false
		},
		size: {
			type: String,
			default: 'small'
		},
		menuid: {
			type: String,
		},
		field: {
			type: Array,
		},
		item_field: {
			type: Array,
		}
	},
	data() {
		return {
			form: {
				title:'',
				post_status:1,
				create_table_field:1,
				validate:[],
				item_config:[],
				other_config:{
					address_type : 1,
				},
				datatype:'',
				length:'',
				belong_table:'',
				default_value:'',
				menu_id:this.menuid,
			},
			activeName: 'first',
			list_item:false,
			loading:false,
			propertyField:[],
			default_config:'',
			default_rules:'',
			ruleList:[],
			tableList:[],
			dbtype:'',
			rules: {
				title: [{ required: true, message: '字段中文名不能为空', trigger: 'blur' }],
				field: [{ required: true, message: '字段英文名不能为空', trigger: 'blur' }],
				type: [{ required: true, message: '字段类型不能为空', trigger: 'blur' }],
				login_fields: [{ required: true, message: '请配置登录账号密码字段', trigger: 'blur' }],
			},
		}
	},
	methods: {
		submit(){
			this.$refs['form'].validate(valid => {
				if (valid) {
					this.loading = true
					axios.post(base_url+'/Sys.Base/createField',this.form).then(res => {
						if(res.data.status == 200){
							this.$message({message: '操作成功', type: 'success'})
							this.$emit('refesh_list')
							this.closeForm()
						}else{
							this.loading = false
							this.$message.error(res.data.msg)
						}
					}).catch(()=>{
						this.loading = false
					})
				}
			})
		},
		open(){
			axios.post(base_url+'/Sys.Base/configList',{menu_id:this.menuid}).then(res => {
				this.ruleList = res.data.ruleList
				this.propertyField = res.data.propertyField
				this.dbtype = res.data.dbtype
			})
		},
		selectType(){
			if(this.dbtype !== 'mongo'){
				this.field.forEach(item=>{
					if(this.form.type == item.type){
						this.propertyField.forEach(vo=>{
							if(item.property == vo.type){
								this.form.datatype = vo.name
								this.form.length = vo.decimal ? vo.maxlen+','+vo.decimal : vo.maxlen
							}
						})
						this.list_item = item.item
						if(!item.item){
							this.form.item_config = []
						}
					}
				})
			}else{
				this.field.forEach(item=>{
					if(this.form.type == item.type){
						this.propertyField.forEach(vo=>{
							if(item.mongoProperty == vo.type){
								this.form.datatype = vo.name
							}
						})
						this.list_item = item.item
						if(!item.item){
							this.form.item_config = []
						}
					}
				})
			}
		},
		setDefaultRule(){
			this.form.rule = this.default_rules
		},
		setFieldLength(){
			if(this.dbtype !== 'mongo'){
				this.propertyField.forEach(item =>{
				   if(this.form.datatype == item.name){
					   this.form.length = item.decimal ? item.maxlen+','+item.decimal : item.maxlen
				   }
				})
			}
		},
		addItem(key){
			this.form[key].push({})
		},
		deleteItem(key,index){
		   this.form[key].splice(index,1)
		},
		clearItem(key){
			this.form[key] = []
		},
		setDefaultItem(val){
			this.form['item_config'] = val
		},
		selectDate(val){
			if(this.dbtype !== 'mongo'){
				if(['year','month','time','dates'].includes(val)){
					this.form.datatype = 'varchar'
					this.form.length = 250
				}else{
					this.form.datatype = 'int'
					this.form.length = 10
				}
			}else{
				if(['year','month','time','dates'].includes(val)){
					this.form.datatype = 'string'
					this.form.length = 250
				}else{
					this.form.datatype = 'int'
					this.form.length = 10
				}
			}
		},
		closeForm(){
			this.$emit('update:show', false)
			this.loading = false
			this.$nextTick(()=>{
				this.$refs['form'].resetFields();//清空表单
				this.default_rules = ''
				this.list_item = false
				this.form.other_config = {}
				this.activeName = 'first'
			})
		}
	},
});


//修改api字段
Vue.component('ApiUpdate', {
	template: `
		<el-dialog title="更新字段" width="600px" class="icon-dialog" :visible.sync="show" :before-close="closeForm" @open="open"  append-to-body>
        <el-form :size="size" ref="form" :model="form" :rules="rules" label-width="90px"> 
            <el-row>
                <el-col :span="12">
                    <el-form-item label="字段标题" prop="title">
                        <el-input v-model="form.title" clearable placeholder="字段中文描述"  />
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="字段名称" prop="field">
                        <el-input v-model="form.field" clearable placeholder="字段英文名称"/>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="字段类型" prop="type">
                        <el-select style="width:100%" v-model="form.type" @change="selectType" filterable placeholder="请选择">
                            <el-option v-for="(item,i) in field" :key="i" :label="item.type == 30 ? 'token解码值':item.name" :value="item.type"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item v-if="form.type == 22" label="层级" prop="address_type">
                        <el-select style="width:100%" v-model="form.other_config.address_type"  placeholder="请选择级层">
                            <el-option  key="0" label="省市区" value="1"></el-option>
                            <el-option  key="1" label="省市" value="2"></el-option>
                            <el-option  key="2" label="省" value="3"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item v-else-if="form.type == 31" label="长度" prop="rand_length">
                        <el-input v-model="form.other_config.rand_length" clearable placeholder="随机数长度"/>
                    </el-form-item>
                    <el-form-item v-else label="默认值" prop="default_value">
                        <el-input v-model="form.default_value" clearable placeholder="同步数据表默认值"/>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row v-if="form.type == 9 || form.type == 11 || form.type == 12">
                <el-form-item label="日期格式" prop="datetime_config">
                    <el-select style="width:100%" :size="size" @change="selectDate" v-model="form.datetime_config" clearable  filterable placeholder="请选择日期格式">
                            <el-option key="1" label="年月日时分秒" value="datetime"></el-option>
                            <el-option key="2" label="年月日" value="date"></el-option>
                            <el-option key="3" label="年" value="year"></el-option>
                            <el-option key="4" label="月" value="month"></el-option>
                            <el-option key="5" label="多个日期" value="dates"></el-option>
                    </el-select>
                </el-form-item>
            </el-row>
			<el-row v-if="form.type == 31">
				<el-form-item label="随机数格式" prop="form.other_config.rand_config">
					<el-select style="width:100%" :size="size" v-model="form.other_config.rand_config" clearable  filterable placeholder="请选择随机数格式">
							<el-option key="1" label="字母大小写数字组合" value="all"></el-option>
							<el-option key="2" label="字母大小写组合" value="letter"></el-option>
							<el-option key="3" label="纯数字组合" value="number"></el-option>
					</el-select>
				</el-form-item>
			</el-row>
            <el-row v-if="list_item">
				<el-form-item label="选项配置" prop="item_config">
					<draggable v-model="form.item_config" v-bind="{group:'item'}" handle=".jzd-handle">
					<el-row v-for="(item,i) in form.item_config" :key="i">
						<el-col :span="7">
							<el-form-item style="margin-bottom:3px !important">
								<el-input  v-model="item.key" placeholder="选项名称"/>
							</el-form-item>
						</el-col>
						<el-col :span="6">
							<el-form-item style="margin-bottom:3px !important">
								<el-input style="position:relative;left:5px;" v-model="item.val" placeholder="选项值"/>
							</el-form-item>
						</el-col>
						<el-col :span="6">
							<el-form-item style="margin-bottom:3px !important">
								<el-select style="position:relative;left:10px;" v-model="item.label_color" size="small" clearable placeholder="请选择背景色">
									<el-option key="1" style="background:#409eff" label="primary" value="primary"></el-option>
									<el-option key="2" style="background:#67c23a" label="success" value="success"></el-option>
									<el-option key="3" style="background:#909399" label="info" value="info"></el-option>
									<el-option key="4" style="background:#e6a23c" label="warning" value="warning"></el-option>
									<el-option key="5" style="background:#f56c6c" label="danger" value="danger"></el-option>
								</el-select>
							</el-form-item>
						</el-col>
						<el-col :span="4">
							<el-button type="danger" size="mini" style="position:relative;left:15px"  icon="el-icon-close" @click="deleteItem('item_config',i)"></el-button>
							<el-button class="jzd-handle" type="success" size="mini" style="position:relative;left:12px" icon="el-icon-rank"></el-button>
						</el-col> 
					</el-row>
					</draggable>
					<div>
						<el-button type="success" icon="el-icon-plus" style="padding:5px 7px" :size="size" @click="addItem('item_config')">追加</el-button>
						<el-button v-if="form.item_config.length > 0" type="warning" icon="el-icon-delete" style="padding:5px 7px" :size="size" @click="clearItem('item_config')">清空</el-button>
						<el-select v-if="form.item_config.length === 0"  :size="size" style="height:25px; light:25px; margin-left:20px;" v-model="default_config" @change="setDefaultItem"  placeholder="请选择默认配置">
							<el-option v-for="(item,i) in item_field" :key="i" :label="item.name" :value="item.item"></el-option>
						</el-select>
					</div>
				</el-form-item>
			</el-row>
            <el-row>
                <el-col v-if="dbtype !== 'mongo'" :span="24">
                    <el-form-item label="更新字段" prop="create_table_field">
                        <el-radio-group v-model="form.create_table_field">
                            <el-radio :label="1">是</el-radio>
                            <el-radio :label="0">否</el-radio>
                        </el-radio-group>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="验证方式" prop="validate">
                        <el-checkbox-group v-model="form.validate">
                            <el-checkbox label="notempty">不为空</el-checkbox>
                            <el-checkbox label="unique">唯一</el-checkbox>
                        </el-checkbox-group>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="可录入" prop="post_status">
                        <el-radio v-model="form.post_status" :label="1">是</el-radio>
                        <el-radio v-model="form.post_status" :label="0">否</el-radio>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="20">
                    <el-form-item label="验证规则" prop="rule">
                        <el-input v-model="form.rule" clearable placeholder="输入框验证规则"/>
                    </el-form-item>
                </el-col>
                <el-col :span="4">
                    <el-select :size="size" v-model="default_rules" @change="setDefaultRule" prop="default_rules" clearable filterable placeholder="请选择">
                        <el-option v-for="(item,index) in ruleList" :key="index" :label="index" :value="item"></el-option>
                    </el-select>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="8">
                    <el-form-item label="数据结构" prop="datatype">
                        <el-select v-model="form.datatype" filterable @change="setFieldLength"  placeholder="请选择">
                            <el-option v-for="(item,i) in propertyField" :key="i" :label="item.name" :value="item.name"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col v-if="dbtype !== 'mongo'" :span="8">
                    <el-form-item label="字段长度" prop="length">
                        <el-input v-model="form.length" placeholder="字段长度"/>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="字段索引" prop="indexdata">
                        <el-select v-model="form.indexdata" filterable placeholder="请选择">
                            <el-option key="1" label="普通索引" value="index"></el-option>
                            <el-option key="2" label="唯一索引" value="unique"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button :size="size" :loading="loading" type="primary" @click="submit" >
                <span v-if="!loading">确 定</span>
                <span v-else>提 交 中...</span>
            </el-button>
            <el-button :size="size" @click="closeForm">取 消</el-button>
        </div>
    </el-dialog>
	`
	,
	 props: {
		show: {
			type: Boolean,
			default: false
		},
		size: {
			type: String,
			default: 'small'
		},
		menu_id: {
			type: String,
		},
		field: {
			type: Array,
		},
		item_field: {
			type: Array,
		},
		info: {
			type: Object,
		},
	},
	data() {
		return {
			form: {
				title:'',
				post_status:1,
				create_table_field:1,
				list_show:2,
				validate:[],
				item_config:[],
				other_config:{
					address_type : 1,
				},
				datatype:'',
				length:'',
				belong_table:'',
				default_value:''
			},
			activeName: 'first',
			list_item:false,
			loading:false,
			propertyField:[],
			default_config:'',
			default_rules:'',
			ruleList:[],
			tableList:[],
			dbtype:'',
			rules: {
				title: [{ required: true, message: '字段中文名不能为空', trigger: 'blur' }],
				field: [{ required: true, message: '字段英文名不能为空', trigger: 'blur' }],
				type: [{ required: true, message: '字段类型不能为空', trigger: 'blur' }],
				login_fields: [{ required: true, message: '请配置登录账号密码字段', trigger: 'blur' }],
			},
		}
	},
	methods: {
		submit(){
			this.$refs['form'].validate(valid => {
				if (valid) {
					this.loading = true
					axios.post(base_url+'/Sys.Base/updateField',this.form).then(res => {
						if(res.data.status == 200){
							this.$message({message: '操作成功', type: 'success'})
							this.$emit('refesh_list')
							this.closeForm()
						}else{
							this.loading = false
							this.$message.error(res.data.msg)
						}
					}).catch(()=>{
						this.loading = false
					})
				}
			})
		},
		open(){
			this.form = this.info
			if(this.form.other_config == '' || this.form.other_config == '[]' || this.form.other_config == null){
				this.form.other_config = {}
			}else{
				this.form.other_config = JSON.parse(this.info.other_config)
			}
			this.setDefaultVal('item_config')
			this.field.forEach(item=>{
				if(this.form.type == item.type){
					this.list_item = item.item
				}
			})
			axios.post(base_url+'/Sys.Base/configList',{menu_id:this.menu_id}).then(res => {
				this.ruleList = res.data.ruleList
				this.propertyField = res.data.propertyField
				this.dbtype = res.data.dbtype
			})
		},
		selectType(){
			if(this.dbtype !== 'mongo'){
				this.field.forEach(item=>{
					if(this.form.type == item.type){
						this.propertyField.forEach(vo=>{
							if(item.property == vo.type){
								this.form.datatype = vo.name
								this.form.length = vo.decimal ? vo.maxlen+','+vo.decimal : vo.maxlen
							}
						})
						this.list_item = item.item
						if(!item.item){
							this.form.item_config = []
						}
					}
				})
			}else{
				this.field.forEach(item=>{
					if(this.form.type == item.type){
						this.propertyField.forEach(vo=>{
							if(item.mongoProperty == vo.type){
								this.form.datatype = vo.name
							}
						})
						this.list_item = item.item
						if(!item.item){
							this.form.item_config = []
						}
					}
				})
			}
		},
		setDefaultVal(key){
			if(this.form[key] == null || this.form[key] == ''){
				this.form[key] = []
			}
		},
		setDefaultRule(){
			this.form.rule = this.default_rules
		},
		setFieldLength(){
			if(this.dbtype !== 'mongo'){
				this.propertyField.forEach(item =>{
				   if(this.form.datatype == item.name){
					   this.form.length = item.decimal ? item.maxlen+','+item.decimal : item.maxlen
				   }
				})
			}
		},
		addItem(key){
			this.form[key].push({})
		},
		deleteItem(key,index){
		   this.form[key].splice(index,1)
		},
		clearItem(key){
			this.form[key] = []
		},
		setDefaultItem(val){
			this.form['item_config'] = val
		},
		selectDate(val){
			if(this.dbtype !== 'mongo'){
				if(['year','month','time','dates'].includes(val)){
					this.form.datatype = 'varchar'
					this.form.length = 250
				}else{
					this.form.datatype = 'int'
					this.form.length = 10
				}
			}else{
				if(['year','month','time','dates'].includes(val)){
					this.form.datatype = 'string'
					this.form.length = 250
				}else{
					this.form.datatype = 'int'
					this.form.length = 10
				}
			}
		},
		closeForm(){
			this.$emit('update:show', false)
			this.loading = false
			this.$nextTick(()=>{
				this.$refs['form'].resetFields();//清空表单
				this.default_rules = ''
				this.list_item = false
				this.form.other_config = {}
				this.activeName = 'first'
			})
		}
	},
});


//cms添加字段
Vue.component('CmsAdd', {
	template: `
		<el-dialog title="创建字段" width="600px" class="icon-dialog" :visible.sync="show" :before-close="closeForm" @open="open"  append-to-body>
        <el-form :size="size" ref="form" :model="form" :rules="rules" label-width="90px">
            <el-row>
                <el-col :span="24">
                    <el-form-item label="字段标题" prop="title">
                        <el-input v-model="form.title" clearable placeholder="字段中文描述"  />
                    </el-form-item>
                </el-col>
            </el-row>
             <el-row>
                <el-col :span="24">
                    <el-form-item label="字段名称" prop="field">
                        <el-input @blur="checkCmsField" v-model="form.field" clearable placeholder="字段英文名称"/>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="字段类型" prop="type">
                        <el-select style="width:100%" v-model="form.type" @change="selectType" filterable placeholder="请选择">
                            <el-option v-for="(item,i) in field" :key="i" :label="item.name" :value="item.type"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item v-if="form.type == 22" label="层级" prop="address_type">
                        <el-select style="width:100%" v-model="form.other_config.address_type"  placeholder="请选择级层">
                            <el-option  key="0" label="省市区" value="1"></el-option>
                            <el-option  key="1" label="省市" value="2"></el-option>
                            <el-option  key="2" label="省" value="3"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item v-else-if="form.type == 13" label="上传样式" prop="address_type">
                        <el-select style="width:100%" v-model="form.other_config.upload_type"  placeholder="上传样式">
                            <el-option key="0" label="样式1(带缩略图)" value="1"></el-option>
                            <el-option key="1" label="样式2(带输入框)" value="2"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item v-else-if="form.type == 31" label="长度" prop="rand_length">
                        <el-input v-model="form.other_config.rand_length" clearable placeholder="随机数长度"/>
                    </el-form-item>
                    <el-form-item v-else label="默认值" prop="default_value">
                        <el-input v-model="form.default_value" clearable placeholder="同步数据表默认值"/>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row v-if="form.type == 9 || form.type == 11 || form.type == 12">
                <el-form-item label="日期格式" prop="datetime_config">
                    <el-select style="width:100%" :size="size" v-model="form.datetime_config" clearable  filterable placeholder="请选择日期格式">
                            <el-option key="1" label="年月日时分秒" value="datetime"></el-option>
                            <el-option key="2" label="年月日" value="date"></el-option>
                            <el-option key="3" label="年" value="year"></el-option>
                            <el-option key="4" label="月" value="month"></el-option>
                            <el-option key="5" label="多个日期" value="dates"></el-option>
                    </el-select>
                </el-form-item>
            </el-row>
            <el-row v-if="list_item">
				<el-form-item label="选项配置" prop="item_config">
					<draggable v-model="form.item_config" v-bind="{group:'item'}" handle=".jzd-handle">
					<el-row v-for="(item,i) in form.item_config" :key="i">
						<el-col :span="7">
							<el-form-item style="margin-bottom:3px !important">
								<el-input  v-model="item.key" placeholder="选项名称"/>
							</el-form-item>
						</el-col>
						<el-col :span="6">
							<el-form-item style="margin-bottom:3px !important">
								<el-input style="position:relative;left:5px;" v-model="item.val" placeholder="选项值"/>
							</el-form-item>
						</el-col>
						<el-col :span="6">
							<el-form-item style="margin-bottom:3px !important">
								<el-select style="position:relative;left:10px;" v-model="item.label_color" size="small" clearable placeholder="请选择背景色">
									<el-option key="1" style="background:#409eff" label="primary" value="primary"></el-option>
									<el-option key="2" style="background:#67c23a" label="success" value="success"></el-option>
									<el-option key="3" style="background:#909399" label="info" value="info"></el-option>
									<el-option key="4" style="background:#e6a23c" label="warning" value="warning"></el-option>
									<el-option key="5" style="background:#f56c6c" label="danger" value="danger"></el-option>
								</el-select>
							</el-form-item>
						</el-col>
						<el-col :span="4">
							<el-button type="danger" size="mini" style="position:relative;left:15px"  icon="el-icon-close" @click="deleteItem('item_config',i)"></el-button>
							<el-button class="jzd-handle" type="success" size="mini" style="position:relative;left:12px" icon="el-icon-rank"></el-button>
						</el-col> 
					</el-row>
					</draggable>
					<div>
						<el-button type="success" icon="el-icon-plus" style="padding:5px 7px" :size="size" @click="addItem('item_config')">追加</el-button>
						<el-button v-if="form.item_config.length > 0" type="warning" icon="el-icon-delete" style="padding:5px 7px" :size="size" @click="clearItem('item_config')">清空</el-button>
						<el-select v-if="form.item_config.length === 0"  :size="size" style="height:25px; light:25px; margin-left:20px;" v-model="default_config" @change="setDefaultItem"  placeholder="请选择默认配置">
							<el-option v-for="(item,i) in item_field" :key="i" :label="item.name" :value="item.item"></el-option>
						</el-select>
					</div>
				</el-form-item>
			</el-row>
            <el-row>
                <el-col :span="8">
                    <el-form-item label="数据结构" prop="datatype">
                        <el-select v-model="form.datatype" filterable @change="setFieldLength"  placeholder="请选择">
                            <el-option v-for="(item,i) in propertyField" :key="i" :label="item.name" :value="item.name"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="字段长度" prop="length">
                        <el-input v-model="form.length" placeholder="字段长度"/>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="字段索引" prop="indexdata">
                        <el-select v-model="form.indexdata" filterable placeholder="请选择">
                            <el-option key="1" label="普通索引" value="normal"></el-option>
                            <el-option key="2" label="唯一索引" value="unique"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button :size="size" :loading="loading" type="primary" @click="submit" >
                <span v-if="!loading">确 定</span>
                <span v-else>提 交 中...</span>
            </el-button>
            <el-button :size="size" @click="closeForm">取 消</el-button>
        </div>
    </el-dialog>
	`
	,
	 props: {
		show: {
			type: Boolean,
			default: false
		},
		size: {
			type: String,
			default: 'small'
		},
		menuid: {
			type: String,
		},
		field: {
			type: Array,
		},
		item_field: {
			type: Array,
		}
	},
	data() {
		return {
			form: {
				title:'',
				post_status:1,
				create_table_field:1,
				list_show:2,
				validate:[],
				item_config:[],
				other_config:{
					address_type : 1,
				},
				datatype:'',
				length:'',
				belong_table:'',
				default_value:'',
				menu_id:this.menuid,
			},
			iconDialogStatus:false,
			activeName: 'first',
			list_item:false,
			loading:false,
			propertyField:[],
			default_config:'',
			default_rules:'',
			ruleList:[],
			tableList:[],
			rules: {
				title: [{ required: true, message: '字段中文名不能为空', trigger: 'blur' }],
				field: [{ required: true, message: '字段英文名不能为空', trigger: 'blur' }],
				type: [{ required: true, message: '字段类型不能为空', trigger: 'blur' }],
				login_fields: [{ required: true, message: '请配置登录账号密码字段', trigger: 'blur' }],
			},
		}
	},
	methods: {
		submit(){
			this.$refs['form'].validate(valid => {
				if (valid) {
					this.loading = true
					axios.post(base_url+'/Sys.Base/createField',this.form).then(res => {
						if(res.data.status == 200){
							this.$message({message: '操作成功', type: 'success'})
							this.$emit('refesh_list')
							this.closeForm()
						}else{
							this.loading = false
							this.$message.error(res.data.msg)
						}
					}).catch(()=>{
						this.loading = false
					})
				}
			})
		},
		open(){
			axios.post(base_url+'/Sys.Base/configList').then(res => {
				this.ruleList = res.data.ruleList
				this.propertyField = res.data.propertyField
			})
		},
		checkCmsField(){
			axios.post(base_url+'/Sys.Base/checkCmsField',{field:this.form.field}).then(res => {
				if(res.data.status !== 200){
					this.$message.error('字段已存在')
				}
			})
        },
		selectType(){
			this.field.forEach(item=>{
				if(this.form.type == item.type){
					this.propertyField.forEach(vo=>{
						if(item.property == vo.type){
							this.form.datatype = vo.name
							this.form.length = vo.decimal ? vo.maxlen+','+vo.decimal : vo.maxlen
						}
					})
					this.list_item = item.item
					if(!item.item){
						this.form.item_config = []
					}
				}
			})
		},
		setDefaultRule(){
			this.form.rule = this.default_rules
		},
		setFieldLength(){
			this.propertyField.forEach(item =>{
			   if(this.form.datatype == item.name){
				   this.form.length = item.decimal ? item.maxlen+','+item.decimal : item.maxlen
			   }
			})
		},
		addItem(key){
			this.form[key].push({})
		},
		deleteItem(key,index){
		   this.form[key].splice(index,1)
		},
		clearItem(key){
			this.form[key] = []
		},
		setDefaultItem(val){
			this.form['item_config'] = val
		},
		closeForm(){
			this.$emit('update:show', false)
			this.loading = false
			this.$nextTick(()=>{
				this.$refs['form'].resetFields();//清空表单
				this.default_rules = ''
				this.list_item = false
				this.form.other_config = {}
				this.activeName = 'first'
			})
		}
	},
});


//修改api字段
Vue.component('CmsUpdate', {
	template: `
		<el-dialog title="创建字段" width="600px" class="icon-dialog" :visible.sync="show" :before-close="closeForm" @open="open"  append-to-body>
        <el-form :size="size" ref="form" :model="form" :rules="rules" label-width="90px">
            <el-row>
                <el-col :span="24">
                    <el-form-item label="字段标题" prop="title">
                        <el-input v-model="form.title" clearable placeholder="字段中文描述"  />
                    </el-form-item>
                </el-col>
            </el-row>
             <el-row>
                <el-col :span="24">
                    <el-form-item label="字段名称" prop="field">
                        <el-input @blur="checkCmsField" v-model="form.field" clearable placeholder="字段英文名称"/>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="字段类型" prop="type">
                        <el-select style="width:100%" v-model="form.type" @change="selectType" filterable placeholder="请选择">
                            <el-option v-for="(item,i) in field" :key="i" :label="item.name" :value="item.type"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item v-if="form.type == 22" label="层级" prop="address_type">
                        <el-select style="width:100%" v-model="form.other_config.address_type"  placeholder="请选择级层">
                            <el-option  key="0" label="省市区" value="1"></el-option>
                            <el-option  key="1" label="省市" value="2"></el-option>
                            <el-option  key="2" label="省" value="3"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item v-else-if="form.type == 13" label="上传样式" prop="address_type">
                        <el-select style="width:100%" v-model="form.other_config.upload_type"  placeholder="上传样式">
                            <el-option key="0" label="样式1(带缩略图)" value="1"></el-option>
                            <el-option key="1" label="样式2(带输入框)" value="2"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item v-else-if="form.type == 31" label="长度" prop="rand_length">
                        <el-input v-model="form.other_config.rand_length" clearable placeholder="随机数长度"/>
                    </el-form-item>
                    <el-form-item v-else label="默认值" prop="default_value">
                        <el-input v-model="form.default_value" clearable placeholder="同步数据表默认值"/>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row v-if="form.type == 9 || form.type == 11 || form.type == 12">
                <el-form-item label="日期格式" prop="datetime_config">
                    <el-select style="width:100%" :size="size" v-model="form.datetime_config" clearable  filterable placeholder="请选择日期格式">
                            <el-option key="1" label="年月日时分秒" value="datetime"></el-option>
                            <el-option key="2" label="年月日" value="date"></el-option>
                            <el-option key="3" label="年" value="year"></el-option>
                            <el-option key="4" label="月" value="month"></el-option>
                            <el-option key="5" label="多个日期" value="dates"></el-option>
                    </el-select>
                </el-form-item>
            </el-row>
            <el-row v-if="list_item">
				<el-form-item label="选项配置" prop="item_config">
					<draggable v-model="form.item_config" v-bind="{group:'item'}" handle=".jzd-handle">
					<el-row v-for="(item,i) in form.item_config" :key="i">
						<el-col :span="7">
							<el-form-item style="margin-bottom:3px !important">
								<el-input  v-model="item.key" placeholder="选项名称"/>
							</el-form-item>
						</el-col>
						<el-col :span="6">
							<el-form-item style="margin-bottom:3px !important">
								<el-input style="position:relative;left:5px;" v-model="item.val" placeholder="选项值"/>
							</el-form-item>
						</el-col>
						<el-col :span="6">
							<el-form-item style="margin-bottom:3px !important">
								<el-select style="position:relative;left:10px;" v-model="item.label_color" size="small" clearable placeholder="请选择背景色">
									<el-option key="1" style="background:#409eff" label="primary" value="primary"></el-option>
									<el-option key="2" style="background:#67c23a" label="success" value="success"></el-option>
									<el-option key="3" style="background:#909399" label="info" value="info"></el-option>
									<el-option key="4" style="background:#e6a23c" label="warning" value="warning"></el-option>
									<el-option key="5" style="background:#f56c6c" label="danger" value="danger"></el-option>
								</el-select>
							</el-form-item>
						</el-col>
						<el-col :span="4">
							<el-button type="danger" size="mini" style="position:relative;left:15px"  icon="el-icon-close" @click="deleteItem('item_config',i)"></el-button>
							<el-button class="jzd-handle" type="success" size="mini" style="position:relative;left:12px" icon="el-icon-rank"></el-button>
						</el-col> 
					</el-row>
					</draggable>
					<div>
						<el-button type="success" icon="el-icon-plus" style="padding:5px 7px" :size="size" @click="addItem('item_config')">追加</el-button>
						<el-button v-if="form.item_config.length > 0" type="warning" icon="el-icon-delete" style="padding:5px 7px" :size="size" @click="clearItem('item_config')">清空</el-button>
						<el-select v-if="form.item_config.length === 0"  :size="size" style="height:25px; light:25px; margin-left:20px;" v-model="default_config" @change="setDefaultItem"  placeholder="请选择默认配置">
							<el-option v-for="(item,i) in item_field" :key="i" :label="item.name" :value="item.item"></el-option>
						</el-select>
					</div>
				</el-form-item>
			</el-row>
            <el-row>
                <el-col :span="8">
                    <el-form-item label="数据结构" prop="datatype">
                        <el-select v-model="form.datatype" filterable @change="setFieldLength"  placeholder="请选择">
                            <el-option v-for="(item,i) in propertyField" :key="i" :label="item.name" :value="item.name"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="字段长度" prop="length">
                        <el-input v-model="form.length" placeholder="字段长度"/>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="字段索引" prop="indexdata">
                        <el-select v-model="form.indexdata" filterable placeholder="请选择">
                            <el-option key="1" label="普通索引" value="normal"></el-option>
                            <el-option key="2" label="唯一索引" value="unique"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button :size="size" :loading="loading" type="primary" @click="submit" >
                <span v-if="!loading">确 定</span>
                <span v-else>提 交 中...</span>
            </el-button>
            <el-button :size="size" @click="closeForm">取 消</el-button>
        </div>
    </el-dialog>
	`
	,
	 props: {
		show: {
			type: Boolean,
			default: false
		},
		size: {
			type: String,
			default: 'small'
		},
		menu_id: {
			type: String,
		},
		field: {
			type: Array,
		},
		item_field: {
			type: Array,
		},
		info: {
			type: Object,
		},
	},
	data() {
		return {
			form: {
				title:'',
				post_status:1,
				create_table_field:1,
				list_show:2,
				validate:[],
				item_config:[],
				other_config:{
					address_type : 1,
				},
				datatype:'',
				length:'',
				belong_table:'',
				default_value:''
			},
			activeName: 'first',
			list_item:false,
			loading:false,
			propertyField:[],
			default_config:'',
			default_rules:'',
			ruleList:[],
			tableList:[],
			rules: {
				title: [{ required: true, message: '字段中文名不能为空', trigger: 'blur' }],
				field: [{ required: true, message: '字段英文名不能为空', trigger: 'blur' }],
				type: [{ required: true, message: '字段类型不能为空', trigger: 'blur' }],
				login_fields: [{ required: true, message: '请配置登录账号密码字段', trigger: 'blur' }],
			},
		}
	},
	methods: {
		submit(){
			this.$refs['form'].validate(valid => {
				if (valid) {
					this.loading = true
					axios.post(base_url+'/Sys.Base/updateField',this.form).then(res => {
						if(res.data.status == 200){
							this.$message({message: '操作成功', type: 'success'})
							this.$emit('refesh_list')
							this.closeForm()
						}else{
							this.loading = false
							this.$message.error(res.data.msg)
						}
					}).catch(()=>{
						this.loading = false
					})
				}
			})
		},
		open(){
			this.form = this.info
			if(this.form.other_config == '' || this.form.other_config == '[]' || this.form.other_config == null){
				this.form.other_config = {}
			}else{
				this.form.other_config = JSON.parse(this.info.other_config)
			}
			this.setDefaultVal('item_config')
			this.field.forEach(item=>{
				if(this.form.type == item.type){
					this.list_item = item.item
				}
			})
			axios.post(base_url+'/Sys.Base/configList').then(res => {
				this.ruleList = res.data.ruleList
				this.propertyField = res.data.propertyField
			})
		},
		checkCmsField(){
			axios.post(base_url+'/Sys.Base/checkCmsField',{field:this.form.field}).then(res => {
				if(res.data.status !== 200){
					this.$message.error('字段已存在')
				}
			})
        },
		selectType(){
			this.field.forEach(item=>{
				if(this.form.type == item.type){
					this.propertyField.forEach(vo=>{
						if(item.property == vo.type){
							this.form.datatype = vo.name
							this.form.length = vo.decimal ? vo.maxlen+','+vo.decimal : vo.maxlen
						}
					})
					this.list_item = item.item
					if(!item.item){
						this.form.item_config = []
					}
				}
			})
		},
		setDefaultVal(key){
			if(this.form[key] == null || this.form[key] == ''){
				this.form[key] = []
			}
		},
		setDefaultRule(){
			this.form.rule = this.default_rules
		},
		setFieldLength(){
			this.propertyField.forEach(item =>{
				if(this.form.datatype == item.name){
				   this.form.length = item.decimal ? item.maxlen+','+item.decimal : item.maxlen
				}
			})
		},
		addItem(key){
			this.form[key].push({})
		},
		deleteItem(key,index){
		   this.form[key].splice(index,1)
		},
		clearItem(key){
			this.form[key] = []
		},
		setDefaultItem(val){
			this.form['item_config'] = val
		},
		closeForm(){
			this.$emit('update:show', false)
			this.loading = false
			this.$nextTick(()=>{
				this.$refs['form'].resetFields();//清空表单
				this.default_rules = ''
				this.list_item = false
				this.form.other_config = {}
				this.activeName = 'first'
			})
		}
	},
});
