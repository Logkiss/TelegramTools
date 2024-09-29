//后台方法添加
Vue.component('AdminAdd', {
	template: `
	<el-dialog title="创建操作方法" width="700px" class="icon-dialog" :visible.sync="show" @open="open" :before-close="closeForm">
        <el-form :size="size" ref="form" :model="form" :rules="rules" label-width="100px">
            <el-tabs v-model="activeName">
                <el-tab-pane style="padding-top:10px"  label="基本信息" name="基本信息">    
                    <el-row>
                        <el-form-item label="方法类型" prop="type">
                            <el-select style="width:100%" v-model="form.type" @change="selectType" filterable placeholder="请选择">
                                <el-option v-for="(item,i) in action" :key="i" :label="item.name" :value="item.type"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="方法名称" prop="name">
                                <el-input v-model="form.name" clearable placeholder="方法中文名称"  />
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="英文名称" prop="action_name">
                                <el-input v-model="form.action_name" clearable placeholder="方法英文名称"/>
                            </el-form-item>
                        </el-col>
                    </el-row>
					<el-row v-if="form.type == 11">
                        <el-form-item label="导出方式" prop="form.other_config.export_type">
                            <el-select style="width:100%" :size="size" v-model="form.other_config.export_type" clearable  filterable placeholder="请选择导出方式">
                                    <el-option key="1" label="客户端导出" value="client"></el-option>
                                    <el-option key="2" label="服务端导出" value="server"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-row>
                    <el-row v-if="form.type == 15 || form.type == 16">
                        <el-col :span="24">
                            <el-form-item label="跳转地址" prop="jump">
                                <el-input v-model="form.jump" clearable placeholder="跳转地址"  />
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row v-if="dialog">
                        <el-form-item :label="form.type ==5 ? '显示字段' : '操作字段'" prop="fields">
                            <el-checkbox-group v-model="form.fields">
                                <el-checkbox v-for="item in post_fields" :label="item.field" :key="item.field">{{item.title}}</el-checkbox>
                            </el-checkbox-group>
                        </el-form-item>
                    </el-row>
                    <el-row v-if="form.type == 7">
                        <el-form-item label="状态值" prop="status_val">
                            <el-input v-model="form.status_val" placeholder="状态值"/>
                        </el-form-item>
                    </el-row>
                    <el-row v-if="button">
                        <el-form-item label="按钮图标" prop="icon">
                            <el-input v-model="form.icon" placeholder="点击选择图标" clearable>
                                <el-button type="success" slot="append" icon="el-icon-thumb"  @click="iconDialogStatus = true">请选择</el-button>
                            </el-input>
                        </el-form-item>
                    </el-row>
                    <el-row v-if="button">
                        <el-form-item label="按钮颜色" prop="button_color">
                            <el-select style="width:100%" v-model="form.button_color" :size="size" clearable filterable placeholder="请选择">
                                <el-option key="1" style="background:#409eff" label="primary" value="primary"></el-option>
                                <el-option key="2" style="background:#67c23a" label="success" value="success"></el-option>
                                <el-option key="3" style="background:#909399" label="info" value="info"></el-option>
                                <el-option key="4" style="background:#e6a23c" label="warning" value="warning"></el-option>
                                <el-option key="5" style="background:#f56c6c" label="danger" value="danger"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-row>
                    <el-row v-if="form.type == 1">
                        <el-col :span="12">
                            <el-form-item label="分页大小" prop="pagesize">
                                <el-select v-model="form.pagesize" placeholder="请选择">
                                    <el-option key="1" label="10条每页" value="10"></el-option>
                                    <el-option key="2" label="20条每页" value="20"></el-option>
                                    <el-option key="3" label="50条每页" value="50"></el-option>
                                    <el-option key="4" label="100条每页" value="100"></el-option>
                                    <el-option key="5" label="200条每页" value="200"></el-option>
									<el-option key="6" label="1000条每页" value="1000"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="排序" prop="orderby">
                                <el-input v-model="form.orderby" placeholder="如 id desc"/>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row v-if="form.type == 1">
                        <el-col :span="24">
                            <el-form-item label="树table配置" prop="tree_config">
                                <el-input v-model="form.tree_config" placeholder="父类字段名"/>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row v-if="form.type == 1">
                        <el-col :span="12">
                            <el-form-item label="选中方式" prop="select_type">
                                <el-radio v-model="form.select_type" :label="1">多选</el-radio>
                                <el-radio v-model="form.select_type" :label="2">单选</el-radio>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="表格高度" prop="table_height">
                                <el-input v-model="form.table_height" placeholder="如设置则表头固定"/>
                            </el-form-item>
                        </el-col>
                    </el-row>
					<el-row v-if="form.type == 1 || form.type == 11">
                        <el-form-item label="过滤条件" prop="list_filter">
                            <el-row v-for="(item,i) in form.list_filter" :key="i">
                                <el-col :span="8">
                                    <el-form-item style="margin-bottom:3px !important">
                                        <el-select style="width:100%" v-model="item.searchField" filterable placeholder="请选择字段">
                                            <el-option v-for="(vo,i) in post_fields" :key="i"  :value="vo.field">{{vo.title}}({{vo.field}})</el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-col>
								<el-col :span="6">
                                    <el-form-item style="margin-bottom:3px !important">
                                        <el-select style="width:100%;position:relative; left:10px" v-model="item.searchCondition" filterable placeholder="请选择条件">
                                            <el-option key="0" value="=">=</el-option>
											<el-option key="1" value="<>"><></el-option>
											<el-option key="2" value="in">in</el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="6">
                                    <el-form-item style="margin-bottom:3px !important">
                                        <el-autocomplete :fetch-suggestions="querySearch" style="position:relative; left:20px" v-model="item.serachVal" placeholder="值"/>
                                    </el-form-item>
                                </el-col> 
                                <el-col :span="4">
                                    <el-button type="danger" size="mini" style="position:relative;left:35px"  icon="el-icon-close" @click="deleteItem('list_filter',i)"></el-button>
                                </el-col>  
                            </el-row>
                            <el-button type="success" icon="el-icon-plus" style="padding:5px 7px" :size="size" @click="addItem('list_filter')">追加</el-button>
                            <el-button v-if="form.list_filter.length > 0" type="warning" icon="el-icon-delete" style="padding:5px 7px" :size="size" @click="clearItem('list_filter')">清空</el-button>
                        </el-form-item>
                    </el-row>
                    <el-row v-if="form.type == 2 || form.type ==3 || form.type == 14">
                        <el-form-item label="选项卡配置" prop="tab_config">
                            <el-row v-for="(item,i) in form.tab_config" :key="i">
                                <el-col :span="8">
                                    <el-form-item style="margin-bottom:3px !important">
                                        <el-input clearable v-model="item.tab_name" placeholder="选项卡名称"/>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item style="margin-bottom:3px !important">
                                        <el-select style="width:100%;position:relative; left:10px" clearable v-model="item.tab_fields" multiple collapse-tags placeholder="包含字段">
                                            <el-option v-for="(vo,i) in tab_fields" :key="i" :value="vo.field">{{vo.title}}({{vo.field}})</el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="2">
                                    <el-button type="danger" size="mini" style="position:relative;left:15px"  icon="el-icon-close" @click="deleteItem('tab_config',i)"></el-button>
                                </el-col> 
                            </el-row>
                            <el-button type="success" icon="el-icon-plus" style="padding:5px 7px" :size="size" @click="addItem('tab_config')">追加</el-button>
                            <el-button v-if="form.tab_config.length > 0" type="warning" icon="el-icon-delete" style="padding:5px 7px" :size="size" @click="clearItem('tab_config')">清空</el-button>
                        </el-form-item>
                    </el-row>
                    <el-row v-if="form.type==1 && dbtype !== 'mongo'">
                        <el-form-item label="侧栏列表sql" prop="left_tree_sql">
                            <el-input v-model="form.left_tree_sql" placeholder="通过sql语句生成table侧栏列表"  />
                        </el-form-item>
                    </el-row>
                </el-tab-pane>
                <el-tab-pane v-if="[1,2,3,4,5,11].includes(form.type) && dbtype !== 'mongo'" style="padding-top:10px"  label="多表配置" name="多表配置">
                    <el-form-item label="关联模型" prop="with_join">
                        <el-row :gutter="2" v-for="(item,i) in form.with_join" :key="i">
                            <el-col style="margin-left:0px" :span="5">
                                <el-form-item style="margin-bottom:3px !important"  prop="fk">
                                    <el-select style="width:100%" v-model="item.fk" filterable placeholder="主表外键">
                                        <el-option v-for="(vo,i) in model_fields" :key="i"  :value="vo.field">{{vo.title}}({{vo.field}})</el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="5">
                                <el-form-item style="margin-bottom:3px !important" prop="relative_table">
                                    <el-select style="width:100%" v-model="item.relative_table" filterable placeholder="模型">
                                        <el-option v-for="(vo,i) in tableList" :key="i" :value="vo.controller_name">{{vo.controller_name}}</el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="5">
                                <el-form-item style="margin-bottom:3px !important" prop="pk">
                                    <el-select @focus="getTableFields(i)" style="width:100%" v-model="item.pk" filterable placeholder="关联键">
                                        <el-option v-for="(vo,i) in table_fields" :key="i"  :value="vo.Field">{{vo.Field}}({{vo.Comment}})</el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="7">
                                 <el-form-item style="margin-bottom:3px !important" prop="fields">
                                    <el-select @focus="getTableFields(i)" style="width:100%" multiple collapse-tags v-model="item.fields" filterable :placeholder="form.type == 1?'关联表查询字段':'操作字段'">
                                        <el-option v-for="(vo,i) in table_fields" :key="i"  :value="vo.Field">{{vo.Field}}({{vo.Comment}})</el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="1">
                                <el-button type="danger" size="mini" style="position:relative;left:5px"  icon="el-icon-close" @click="deleteItem('with_join',i)"></el-button>
                            </el-col> 
                        </el-row>
                        <el-button type="success" icon="el-icon-plus" style="padding:5px 7px" :size="size" @click="addItem('with_join')">追加</el-button>
                        <el-button v-if="form.with_join.length > 0" type="warning" icon="el-icon-delete" style="padding:5px 7px" :size="size" @click="clearItem('with_join')">清空</el-button>
                    </el-form-item>
                    <el-row v-if="[1,5,11].includes(form.type) && dbtype !== 'mongo'">
                        <el-form-item label="table列表sql" prop="sql">
                            <el-input v-model="form.sql" type="textarea" placeholder="通过sql语句生成table列表"  />
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
		},
		menuid: {
			type: String,
		},
		action: {
			type: Array,
		}
	},
	data() {
		return {
			form: {
				server_create_status:1,
				vue_create_status:1,
				button_color:'primary',
				select_type:1,
				fields:[],
				list_filter:[],
				tab_config:[],
				with_join:[],
				type:'',
				icon:'',
				name:'',
				action_name:'',
				dialog_size:'600px',
				pagesize:'20',
				sql:'',
				menu_id:this.menuid,
				jump:'',
				status_val:'',
				orderby:'',
				tree_config:'',
				table_height:'',
				other_config:{
					export_type:'',
				}
			},
			iconDialogStatus:false,
			post_fields:[],
			activeName: 'first',
			tableList:[],
			dialog:true,
			button:true,
			loading:false,
			ischeck_fields:[],
			activeName:'基本信息',
			table_fields:[],
			tab_fields:[],
			model_fields:[],
			dbtype:'',
			restaurants: [{'value':'null'},{'value':'not null'}],
			rules: {
				name: [{ required: true, message: '方法中文名不能为空', trigger: 'blur' }],
				action_name: [{ required: true, message: '方法英文名不能为空', trigger: 'blur' }],
				type: [{ required: true, message: '方法类型不能为空', trigger: 'blur' }],
			},
		}
	},
	methods: {
		submit(){
			this.$refs['form'].validate(valid => {
				if (valid) {
					this.loading = true
					axios.post(base_url+'/Sys.Base/createAction',this.form).then(res => {
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
			axios.post(base_url+'/Sys.Base/getPostField',{menu_id:this.menuid}).then(res => {
				this.post_fields = res.data.data
				this.tab_fields = res.data.tab_fields
				this.model_fields = res.data.model_fields
				this.tableList = res.data.tableList
				this.dbtype = res.data.dbtype
			})
		},
		selectType(val){
			if(val !== 1){
				this.form.list_filter = []
				this.form.with_join = []
			}
			if(val !== 3 || val !== 4){
				this.form.tab_config = []
			}
			if(val !== 7){
				this.form.dialog_size = ''
			}
			this.action.forEach(item=>{
				if(this.form.type == item.type){
					this.dialog = item.dialog
					this.button = item.button
					this.form.icon = item.icon
					this.form.button_color = item.button_color
					this.form.name = item.name
					this.form.action_name = item.action_name
				}
			})
		},
		getTableFields(i){
			axios.post(base_url+'/Sys.Base/getTableFields',{controller_name:this.form.with_join[i].relative_table}).then(res => {
				this.table_fields = res.data.filedList
			})
		},
		closeForm(){
			this.$emit('update:show', false)
			this.loading = false
			this.$nextTick(()=>{
				this.$refs['form'].resetFields()
				this.form.dialog_size = ''
				this.form.icon = ''
				this.form.sql = ''
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
		querySearch(queryString, cb) {
			var restaurants = this.restaurants;
			cb(restaurants);
		}
	},
});


//后台方法修改
Vue.component('AdminUpdate', {
	template: `
	<el-dialog title="更新操作方法" width="700px" class="icon-dialog" :visible.sync="show" @open="open" :before-close="closeForm" append-to-body>
        <el-form :size="size" ref="form" :model="form" :rules="rules" label-width="100px">
             <el-tabs v-model="activeName">
                <el-tab-pane style="padding-top:10px"  label="基本信息" name="基本信息">    
                    <el-row>
                        <el-form-item label="方法类型" prop="type">
                            <el-select style="width:100%" v-model="form.type" @change="selectType" filterable placeholder="请选择">
                                <el-option v-for="(item,i) in action" :key="i" :label="item.name" :value="item.type"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="方法名称" prop="name">
                                <el-input v-model="form.name" clearable placeholder="方法中文名称"  />
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="英文名称" prop="action_name">
                                <el-input v-model="form.action_name" clearable placeholder="方法英文名称"/>
                            </el-form-item>
                        </el-col>
                    </el-row>
					<el-row v-if="form.type == 11">
                        <el-form-item label="导出方式" prop="export_type">
                            <el-select style="width:100%" :size="size" v-model="form.other_config.export_type" clearable  filterable placeholder="请选择导出方式">
                                    <el-option key="1" label="客户端导出" value="client"></el-option>
                                    <el-option key="2" label="服务端导出" value="server"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-row>
                    <el-row v-if="form.type == 15 || form.type == 16">
                        <el-col :span="24">
                            <el-form-item label="跳转地址" prop="jump">
                                <el-input v-model="form.jump" clearable placeholder="跳转地址"  />
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row v-if="dialog">
                        <el-form-item :label="form.type ==5 ? '显示字段' : '操作字段'" prop="fields">
                            <el-checkbox-group v-model="form.fields">
                                <el-checkbox v-for="item in post_fields" :label="item.field" :key="item.field">{{item.title}}</el-checkbox>
                            </el-checkbox-group>
                        </el-form-item>
                    </el-row>
                    <el-row v-if="form.type == 7">
                        <el-form-item label="状态值" prop="status_val">
                            <el-input v-model="form.status_val" placeholder="状态值"/>
                        </el-form-item>
                    </el-row>
                    <el-row v-if="button">
                        <el-form-item label="按钮图标" prop="icon">
                            <el-input v-model="form.icon" placeholder="点击选择图标" clearable>
                                <el-button type="success" slot="append" icon="el-icon-thumb"  @click="iconDialogStatus = true">请选择</el-button>
                            </el-input>
                        </el-form-item>
                    </el-row>
                    <el-row v-if="button">
                        <el-form-item label="按钮颜色" prop="button_color">
                            <el-select style="width:100%" v-model="form.button_color" :size="size" clearable filterable placeholder="请选择">
                                <el-option key="1" style="background:#409eff" label="primary" value="primary"></el-option>
                                <el-option key="2" style="background:#67c23a" label="success" value="success"></el-option>
                                <el-option key="3" style="background:#909399" label="info" value="info"></el-option>
                                <el-option key="4" style="background:#e6a23c" label="warning" value="warning"></el-option>
                                <el-option key="5" style="background:#f56c6c" label="danger" value="danger"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-row>
                    <el-row v-if="form.type == 1">
                        <el-col :span="12">
                            <el-form-item label="分页大小" prop="pagesize">
                                <el-select v-model="form.pagesize" filterable placeholder="请选择">
                                    <el-option key="1" label="10条每页" value="10"></el-option>
                                    <el-option key="2" label="20条每页" value="20"></el-option>
                                    <el-option key="3" label="50条每页" value="50"></el-option>
                                    <el-option key="4" label="100条每页" value="100"></el-option>
                                    <el-option key="5" label="200条每页" value="200"></el-option>
									<el-option key="6" label="1000条每页" value="1000"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="排序方式" prop="orderby">
                                <el-input v-model="form.orderby" placeholder="如 id desc"/>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row v-if="form.type == 1">
                        <el-col :span="24">
                            <el-form-item label="树table配置" prop="tree_config">
                                <el-input v-model="form.tree_config" placeholder="父类ID 如 pid"/>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row v-if="form.type == 1">
                        <el-col :span="12">
                            <el-form-item label="选中方式" prop="select_type">
                                <el-radio v-model="form.select_type" :label="1">多选</el-radio>
                                <el-radio v-model="form.select_type" :label="2">单选</el-radio>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="表格高度" prop="table_height">
                                <el-input v-model="form.table_height" placeholder="如设置则表头固定"/>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row v-if="form.type == 1 || form.type == 11">
                        <el-form-item label="过滤条件" prop="list_filter">
                            <el-row v-for="(item,i) in form.list_filter" :key="i">
                                <el-col :span="8">
                                    <el-form-item style="margin-bottom:3px !important">
                                        <el-select style="width:100%" v-model="item.searchField" filterable placeholder="请选择字段">
                                            <el-option v-for="(vo,i) in post_fields" :key="i"  :value="vo.field">{{vo.title}}({{vo.field}})</el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-col>
								<el-col :span="6">
                                    <el-form-item style="margin-bottom:3px !important">
                                        <el-select style="width:100%;position:relative; left:10px" v-model="item.searchCondition" filterable placeholder="请选择条件">
                                            <el-option key="0" value="=">=</el-option>
											<el-option key="1" value="<>"><></el-option>
											<el-option key="2" value="in">in</el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="6">
                                    <el-form-item style="margin-bottom:3px !important">
                                        <el-autocomplete :fetch-suggestions="querySearch" style="position:relative; left:20px" v-model="item.serachVal" placeholder="值"/>
                                    </el-form-item>
                                </el-col> 
                                <el-col :span="4">
                                    <el-button type="danger" size="mini" style="position:relative;left:35px"  icon="el-icon-close" @click="deleteItem('list_filter',i)"></el-button>
                                </el-col>  
                            </el-row>
                            <el-button type="success" icon="el-icon-plus" style="padding:5px 7px" :size="size" @click="addItem('list_filter')">追加</el-button>
                            <el-button v-if="form.list_filter.length > 0" type="warning" icon="el-icon-delete" style="padding:5px 7px" :size="size" @click="clearItem('list_filter')">清空</el-button>
                        </el-form-item>
                    </el-row>
                    <el-row v-if="form.type == 2 || form.type ==3 || form.type == 14">
                        <el-form-item label="选项卡配置" prop="tab_config">
                            <el-row v-for="(item,i) in form.tab_config" :key="i">
                                <el-col :span="8">
                                    <el-form-item style="margin-bottom:3px !important">
                                        <el-input  v-model="item.tab_name" clearable placeholder="选项卡名称"/>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item style="margin-bottom:3px !important">
                                        <el-select style="width:100%;position:relative; left:10px" clearable v-model="item.tab_fields" multiple collapse-tags placeholder="包含字段">
                                            <el-option v-for="(vo,i) in tab_fields" :key="i" :value="vo.field">{{vo.title}}({{vo.field}})</el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="2">
                                    <el-button type="danger" size="mini" style="position:relative;left:15px"  icon="el-icon-close" @click="deleteItem('tab_config',i)"></el-button>
                                </el-col> 
                            </el-row>
                            <el-button type="success" icon="el-icon-plus" style="padding:5px 7px" :size="size" @click="addItem('tab_config')">追加</el-button>
                            <el-button v-if="form.tab_config.length > 0" type="warning" icon="el-icon-delete" style="padding:5px 7px" :size="size" @click="clearItem('tab_config')">清空</el-button>
                        </el-form-item>
                    </el-row>
                    <el-row v-if="form.type==1 && dbtype !== 'mongo'">
                        <el-form-item label="侧栏列表sql" prop="left_tree_sql">
                            <el-input v-model="form.left_tree_sql" placeholder="通过sql语句生成table侧栏列表"  />
                        </el-form-item>
                    </el-row>
					<el-row v-if="form.list_button_status">
                        <el-form-item label="按钮显示条件" prop="show_list_button">
                            <el-input v-model="form.other_config.show_list_button" placeholder="列表按钮显示条件 如 status == 1"  />
                        </el-form-item>
                    </el-row>
                </el-tab-pane>
                <el-tab-pane v-if="[1,2,3,4,5,11].includes(form.type) && dbtype !== 'mongo'" style="padding-top:10px"  label="多表配置" name="多表配置">
                    <el-form-item label="关联模型" prop="with_join">
                        <el-row :gutter="2" v-for="(item,i) in form.with_join" :key="i">
                            <el-col style="margin-left:0px" :span="5">
                                <el-form-item style="margin-bottom:3px !important"  prop="fk">
                                    <el-select style="width:100%" v-model="item.fk" filterable placeholder="主表外键">
                                        <el-option v-for="(vo,i) in model_fields" :key="i"  :value="vo.field">{{vo.title}}({{vo.field}})</el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="5">
                                <el-form-item style="margin-bottom:3px !important" prop="relative_table">
                                    <el-select style="width:100%" v-model="item.relative_table" filterable placeholder="模型">
                                        <el-option v-for="(vo,i) in tableList" :key="i" :value="vo.controller_name">{{vo.controller_name}}</el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="5">
                                <el-form-item style="margin-bottom:3px !important" prop="pk">
                                    <el-select @focus="getTableFields(i)" style="width:100%" v-model="item.pk" filterable placeholder="关联键">
                                        <el-option v-for="(vo,i) in table_fields" :key="i"  :value="vo.Field">{{vo.Field}}({{vo.Comment}})</el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="7">
                                 <el-form-item style="margin-bottom:3px !important" prop="fields">
                                    <el-select @focus="getTableFields(i)" style="width:100%" multiple collapse-tags v-model="item.fields" filterable :placeholder="form.type == 1?'关联表查询字段':'操作字段'">
                                        <el-option v-for="(vo,i) in table_fields" :key="i"  :value="vo.Field">{{vo.Field}}({{vo.Comment}})</el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="1">
                                <el-button type="danger" size="mini" style="position:relative;left:5px"  icon="el-icon-close" @click="deleteItem('with_join',i)"></el-button>
                            </el-col> 
                        </el-row>
                        <el-button type="success" icon="el-icon-plus" style="padding:5px 7px" :size="size" @click="addItem('with_join')">追加</el-button>
                        <el-button v-if="form.with_join.length > 0" type="warning" icon="el-icon-delete" style="padding:5px 7px" :size="size" @click="clearItem('with_join')">清空</el-button>
                    </el-form-item>
                    <el-row v-if="[1,5,11].includes(form.type) && dbtype !== 'mongo'">
                        <el-form-item label="table列表sql" prop="sql">
                            <el-input v-model="form.sql" type="textarea" placeholder="通过sql语句生成table列表"  />
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
		},
		menu_id: {
			type: String,
		},
		action: {
			type: Array,
		},
		info: {
			type: Object,     
		}
	},
	data() {
		return {
			form: {
				server_create_status:1,
				vue_create_status:1,
				button_color:'primary',
				select_type:1,
				fields:[],
				list_filter:[],
				tab_config:[],
				with_join:[],
				type:'',
				icon:'',
				name:'',
				action_name:'',
				dialog_size:'600px',
				pagesize:'20',
				sql:'',
				status_val:'',
				orderby:'',
				tree_config:'',
				table_height:'',
				other_config:{
					export_type:'',
					show_list_button:'',
				}
			},
			iconDialogStatus:false,
			post_fields:[],
			activeName: 'first',
			tableList:[],
			dialog:true,
			button:true,
			loading:false,
			ischeck_fields:[],
			activeName:'基本信息',
			table_fields:[],
			tab_fields:[],
			model_fields:[],
			dbtype:'',
			restaurants: [{'value':'null'},{'value':'not null'}],
			rules: {
				name: [{ required: true, message: '方法中文名不能为空', trigger: 'blur' }],
				action_name: [{ required: true, message: '方法英文名不能为空', trigger: 'blur' }],
				type: [{ required: true, message: '方法类型不能为空', trigger: 'blur' }],
			},
		}
	},
	methods: {
		submit(){
			this.$refs['form'].validate(valid => {
				if (valid) {
					this.loading = true
					axios.post(base_url+'/Sys.Base/updateAction',this.form).then(res => {
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
			this.setDefaultVal('list_filter')
			this.setDefaultVal('tab_config')
			this.setDefaultVal('fields')
			this.setDefaultVal('with_join')
			if(this.form.other_config == null || this.form.other_config == ''){
				this.form.other_config = {}
			}else{
				this.form.other_config = JSON.parse(this.form.other_config)
			}
			this.initAction()
			axios.post(base_url+'/Sys.Base/getPostField',{menu_id:this.menu_id}).then(res => {
				this.post_fields = res.data.data
				this.tab_fields = res.data.tab_fields
				this.model_fields = res.data.model_fields
				this.tableList = res.data.tableList
				this.dbtype = res.data.dbtype
			})
		},
		selectType(val){
			if(val !== 1){
				this.form.list_filter = []
				this.form.with_join = []
			}
			if(val !== 3 || val !== 4){
				this.form.tab_config = []
			}
			if(val !== 7){
				this.form.dialog_size = ''
			}
			this.action.forEach(item=>{
				if(this.form.type == item.type){
					this.dialog = item.dialog
					this.button = item.button
					this.form.icon = item.icon
					this.form.button_color = item.button_color
					this.form.name = item.name
					this.form.action_name = item.action_name
				}
			})
		},
		getTableFields(i){
			axios.post(base_url+'/Sys.Base/getTableFields',{controller_name:this.form.with_join[i].relative_table}).then(res => {
				this.table_fields = res.data.filedList
			})
		},
		closeForm(){
			this.$emit('update:show', false)
			this.loading = false
			this.$nextTick(()=>{
				this.$refs['form'].resetFields()
				this.form.dialog_size = ''
				this.form.icon = ''
				this.form.sql = ''
			})
		},
		initAction(){
			this.action.forEach(item=>{
				if(this.form.type == item.type){
					this.dialog = item.dialog
					this.button = item.button
				}
			})
		},
		setDefaultVal(key){
			if(this.form[key] == null || this.form[key] == ''){
				this.form[key] = []
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
		querySearch(queryString, cb) {
			var restaurants = this.restaurants;
			cb(restaurants);
		}
	},
});


//api方法添加
Vue.component('ApiAdd', {
	template: `
	<el-dialog title="创建操作方法" width="700px" class="icon-dialog" :visible.sync="show" @open="open" :before-close="closeForm">
        <el-form :size="size" ref="form" :model="form" :rules="rules" label-width="100px">
            <el-tabs v-model="activeName">
                <el-tab-pane style="padding-top:10px"  label="基本信息" name="基本信息">    
                    <el-row>
                        <el-form-item label="方法类型" prop="type">
                            <el-select style="width:100%" v-model="form.type" @change="selectType" filterable placeholder="请选择">
                                <el-option v-for="(item,i) in actionList" :key="i" :label="item.name" :value="item.type"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="方法名称" prop="name">
                                <el-input v-model="form.name" clearable placeholder="方法中文名称"  />
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="英文名称" prop="action_name">
                                <el-input v-model="form.action_name" clearable placeholder="方法英文名称"/>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row v-if="form.type==50">
                        <el-form-item label="登录方式" prop="login_type">
                            <el-select style="width:100%" v-model="form.other_config.login_type" filterable placeholder="请选择">
                                <el-option label="账号密码登录" value="1"></el-option>
                                <el-option label="短信验证码登录" value="2"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-row>
                    <el-row v-if="form.type==50">
                        <el-row v-if="form.other_config.login_type == 1">
                            <el-col :span="12">
                                <el-form-item label="用户名字段" prop="userField">
                                    <el-select style="width:100%" v-model="form.other_config.userField" filterable placeholder="请选择字段">
                                        <el-option v-for="(vo,i) in post_fields" :key="i"  :value="vo.field">{{vo.title}}({{vo.field}})</el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="密码字段" prop="pwdField">
                                    <el-select style="width:100%" v-model="form.other_config.pwdField" filterable placeholder="请选择字段">
                                        <el-option v-for="(vo,i) in post_fields" :key="i"  :value="vo.field">{{vo.title}}({{vo.field}})</el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row v-if="form.other_config.login_type == 2">
                            <el-col :span="24">
                                <el-form-item label="手机号字段" prop="smsField">
                                    <el-select style="width:100%" v-model="form.other_config.smsField" filterable placeholder="请选择字段">
                                        <el-option v-for="(vo,i) in post_fields" :key="i"  :value="vo.field">{{vo.title}}({{vo.field}})</el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-row>
                   <el-row v-if="form.type==51">
                        <el-form-item label="短信平台" prop="sms_partenr">
                            <el-select style="width:100%" v-model="form.other_config.sms_partenr" filterable placeholder="请选择">
                                <el-option v-for="(item,i) in sms_list" :key="i" :label="item.name" :value="item.type"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-row>
                    <el-row v-if="dialog || form.type == 1">
                        <el-form-item :label="form.type ==5 || form.type ==50 ? '返回字段' : '操作字段'" prop="fields">
                            <el-checkbox-group v-model="form.fields">
                                <el-checkbox v-for="item in post_fields" :label="item.field" :key="item.field">{{item.title}}</el-checkbox>
                            </el-checkbox-group>
                        </el-form-item>
                    </el-row>
                    <el-row v-if="form.type == 7">
                        <el-form-item label="状态值" prop="status_val">
                            <el-input v-model="form.status_val" placeholder="状态值"/>
                        </el-form-item>
                    </el-row>
                    <el-row v-if="form.type == 1">
                        <el-col :span="12">
                            <el-form-item label="分页大小" prop="type">
                                <el-select v-model="form.pagesize" placeholder="请选择">
                                    <el-option key="1" label="10条每页" value="10"></el-option>
                                    <el-option key="2" label="20条每页" value="20"></el-option>
                                    <el-option key="3" label="50条每页" value="50"></el-option>
                                    <el-option key="4" label="100条每页" value="100"></el-option>
                                    <el-option key="5" label="200条每页" value="200"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="排序" prop="orderby">
                                <el-input v-model="form.orderby" placeholder="如 id desc"/>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row v-if="form.type == 1">
                        <el-form-item label="过滤条件" prop="list_filter">
                            <el-row v-for="(item,i) in form.list_filter" :key="i">
                                <el-col :span="8">
                                    <el-form-item style="margin-bottom:3px !important">
                                        <el-select style="width:100%" v-model="item.searchField" filterable placeholder="请选择字段">
                                            <el-option v-for="(vo,i) in post_fields" :key="i"  :value="vo.field">{{vo.title}}({{vo.field}})</el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-col>
								<el-col :span="6">
                                    <el-form-item style="margin-bottom:3px !important">
                                        <el-select style="width:100%;position:relative; left:10px" v-model="item.searchCondition" filterable placeholder="请选择条件">
                                            <el-option key="0" value="=">=</el-option>
											<el-option key="1" value="<>"><></el-option>
											<el-option key="2" value="in">in</el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="6">
                                    <el-form-item style="margin-bottom:3px !important">
                                        <el-autocomplete :fetch-suggestions="querySearch" style="position:relative; left:20px" v-model="item.serachVal" placeholder="值"/>
                                    </el-form-item>
                                </el-col> 
                                <el-col :span="4">
                                    <el-button type="danger" size="mini" style="position:relative;left:35px"  icon="el-icon-close" @click="deleteItem('list_filter',i)"></el-button>
                                </el-col>  
                            </el-row>
                            <el-button type="success" icon="el-icon-plus" style="padding:5px 7px" :size="size" @click="addItem('list_filter')">追加</el-button>
                            <el-button v-if="form.list_filter.length > 0" type="warning" icon="el-icon-delete" style="padding:5px 7px" :size="size" @click="clearItem('list_filter')">清空</el-button>
                        </el-form-item>
                    </el-row>
                </el-tab-pane>
                <el-tab-pane v-if="[1,2,3,4,5,11].includes(form.type) && dbtype !== 'mongo'" style="padding-top:10px"  label="多表配置" name="多表配置">
                    <el-form-item label="关联模型" prop="with_join">
                        <el-row :gutter="2" v-for="(item,i) in form.with_join" :key="i">
                            <el-col style="margin-left:0px" :span="5">
                                <el-form-item style="margin-bottom:3px !important"  prop="fk">
                                    <el-select style="width:100%" v-model="item.fk" filterable placeholder="主表外键">
                                        <el-option v-for="(vo,i) in model_fields" :key="i"  :value="vo.field">{{vo.title}}({{vo.field}})</el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="5">
                                <el-form-item style="margin-bottom:3px !important" prop="relative_table">
                                    <el-select style="width:100%" v-model="item.relative_table" filterable placeholder="模型">
                                        <el-option v-for="(vo,i) in tableList" :key="i" :value="vo.controller_name">{{vo.controller_name}}</el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="5">
                                <el-form-item style="margin-bottom:3px !important" prop="pk">
                                    <el-select @focus="getTableFields(i)" style="width:100%" v-model="item.pk" filterable placeholder="关联键">
                                        <el-option v-for="(vo,i) in table_fields" :key="i"  :value="vo.Field">{{vo.Field}}({{vo.Comment}})</el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="7">
                                 <el-form-item style="margin-bottom:3px !important" prop="fields">
                                    <el-select @focus="getTableFields(i)" style="width:100%" multiple collapse-tags v-model="item.fields" filterable :placeholder="form.type == 1?'关联表查询字段':'操作字段'">
                                        <el-option v-for="(vo,i) in table_fields" :key="i"  :value="vo.Field">{{vo.Field}}({{vo.Comment}})</el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="1">
                                <el-button type="danger" size="mini" style="position:relative;left:5px"  icon="el-icon-close" @click="deleteItem('with_join',i)"></el-button>
                            </el-col> 
                        </el-row>
                        <el-button type="success" icon="el-icon-plus" style="padding:5px 7px" :size="size" @click="addItem('with_join')">追加</el-button>
                        <el-button v-if="form.with_join.length > 0" type="warning" icon="el-icon-delete" style="padding:5px 7px" :size="size" @click="clearItem('with_join')">清空</el-button>
                    </el-form-item>
					<el-row v-if="[1,5].includes(form.type) && dbtype !== 'mongo'">
                        <el-form-item label="table列表sql" prop="sql">
                            <el-input v-model="form.sql" type="textarea" placeholder="通过sql语句生成table列表"  />
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
		},
		action: {
			type: Array,
		},
		menuid: {
			type: String,
		},
		info: {
			type: Object,     
		}
	},
	computed: {
        actionList(){
            return this.action.filter(item=>item.show_api)
        }
    },
	data() {
		return {
			form: {
				server_create_status:1,
				vue_create_status:1,
				button_color:'primary',
				select_type:1,
				fields:[],
				list_filter:[],
				tab_config:[],
				with_join:[],
				type:'',
				icon:'',
				name:'',
				action_name:'',
				dialog_size:'600px',
				pagesize:'20',
				sql:'',
				menu_id:this.menuid,
				other_config:{
					login_type:'',
				}
			},
			iconDialogStatus:false,
			post_fields:[],
			activeName: 'first',
			tableList:[],
			dialog:true,
			button:true,
			loading:false,
			ischeck_fields:[],
			activeName:'基本信息',
			table_fields:[],
			tab_fields:[],
			model_fields:[],
			sms_list:[],
			dbtype:'',
			restaurants: [{'value':'null'},{'value':'not null'}],
			rules: {
				name: [{ required: true, message: '方法中文名不能为空', trigger: 'blur' }],
				action_name: [{ required: true, message: '方法英文名不能为空', trigger: 'blur' }],
				type: [{ required: true, message: '方法类型不能为空', trigger: 'blur' }],
			},
		}
	},
	methods: {
		submit(){
			this.$refs['form'].validate(valid => {
				if (valid) {
					this.loading = true
					axios.post(base_url+'/Sys.Base/createAction',this.form).then(res => {
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
			axios.post(base_url+'/Sys.Base/getPostField',{menu_id:this.menuid}).then(res => {
				this.post_fields = res.data.data
				this.tab_fields = res.data.data
				this.model_fields = res.data.model_fields
				this.tableList = res.data.tableList
				this.sms_list = res.data.sms_list
				this.dbtype  = res.data.dbtype
			})
		},
		selectType(val){
			if(val !== 1){
				this.form.list_filter = []
				this.form.with_join = []
			}
			if(val !== 3 || val !== 4){
				this.form.tab_config = []
			}
			if(val !== 7){
				this.form.dialog_size = ''
			}
			this.action.forEach(item=>{
				if(this.form.type == item.type){
					this.dialog = item.dialog
					this.button = item.button
					this.form.icon = item.icon
					this.form.button_color = item.button_color
					this.form.name = item.name
					this.form.action_name = item.action_name
				}
			})
		},
		getTableFields(i){
			axios.post(base_url+'/Sys.Base/getTableFields',{controller_name:this.form.with_join[i].relative_table}).then(res => {
				this.table_fields = res.data.filedList
			})
		},
		closeForm(){
			this.$emit('update:show', false)
			this.loading = false
			this.$nextTick(()=>{
				this.$refs['form'].resetFields()
				this.form.dialog_size = ''
				this.form.icon = ''
				this.form.sql = ''
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
		querySearch(queryString, cb) {
			var restaurants = this.restaurants;
			cb(restaurants);
		}
	},
});

//api方法修改
Vue.component('ApiUpdate', {
	template: `
	<el-dialog title="更新操作方法" width="700px" class="icon-dialog" :visible.sync="show" @open="open" :before-close="closeForm" append-to-body>
        <el-form :size="size" ref="form" :model="form" :rules="rules" label-width="100px">
             <el-tabs v-model="activeName">
                <el-tab-pane style="padding-top:10px"  label="基本信息" name="基本信息">    
                    <el-row>
                        <el-form-item label="方法类型" prop="type">
                            <el-select style="width:100%" v-model="form.type" @change="selectType" filterable placeholder="请选择">
                                <el-option v-for="(item,i) in action" :key="i" :label="item.name" :value="item.type"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="方法名称" prop="name">
                                <el-input v-model="form.name" clearable placeholder="方法中文名称"  />
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="英文名称" prop="action_name">
                                <el-input v-model="form.action_name" clearable placeholder="方法英文名称"/>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row v-if="form.type==50">
                        <el-form-item label="登录方式" prop="login_type">
                            <el-select style="width:100%" v-model="form.other_config.login_type" filterable placeholder="请选择">
                                <el-option label="账号密码登录" value="1"></el-option>
                                <el-option label="短信验证码登录" value="2"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-row>
                    <el-row v-if="form.type==50">
                        <el-row v-if="form.other_config.login_type == 1">
                            <el-col :span="12">
                                <el-form-item label="用户名字段" prop="userField">
                                    <el-select style="width:100%" v-model="form.other_config.userField" filterable placeholder="请选择字段">
                                        <el-option v-for="(vo,i) in post_fields" :key="i"  :value="vo.field">{{vo.title}}({{vo.field}})</el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="密码字段" prop="pwdField">
                                    <el-select style="width:100%" v-model="form.other_config.pwdField" filterable placeholder="请选择字段">
                                        <el-option v-for="(vo,i) in post_fields" :key="i"  :value="vo.field">{{vo.title}}({{vo.field}})</el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row v-if="form.other_config.login_type == 2">
                            <el-col :span="24">
                                <el-form-item label="手机号字段" prop="smsField">
                                    <el-select style="width:100%" v-model="form.other_config.smsField" filterable placeholder="请选择字段">
                                        <el-option v-for="(vo,i) in post_fields" :key="i"  :value="vo.field">{{vo.title}}({{vo.field}})</el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-row>
                    <el-row v-if="form.type==51">
                        <el-form-item label="短信平台" prop="sms_partenr">
                            <el-select style="width:100%" v-model="form.other_config.sms_partenr" filterable placeholder="请选择">
                                <el-option v-for="(item,i) in sms_list" :key="i" :label="item.name" :value="item.type"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-row>
                    <el-row v-if="dialog || form.type == 1">
                        <el-form-item :label="form.type ==5 || form.type ==50 ? '返回字段' : '操作字段'" prop="fields">
                            <el-checkbox-group v-model="form.fields">
                                <el-checkbox v-for="item in post_fields" :label="item.field" :key="item.field">{{item.title}}</el-checkbox>
                            </el-checkbox-group>
                        </el-form-item>
                    </el-row>
                    <el-row v-if="form.type == 7">
                        <el-form-item label="状态值" prop="status_val">
                            <el-input v-model="form.status_val" placeholder="状态值"/>
                        </el-form-item>
                    </el-row>
                    <el-row v-if="form.type == 1">
                        <el-col :span="12">
                            <el-form-item label="分页大小" prop="type">
                                <el-select v-model="form.pagesize" filterable placeholder="请选择">
                                    <el-option key="1" label="10条每页" value="10"></el-option>
                                    <el-option key="2" label="20条每页" value="20"></el-option>
                                    <el-option key="3" label="50条每页" value="50"></el-option>
                                    <el-option key="4" label="100条每页" value="100"></el-option>
                                    <el-option key="5" label="200条每页" value="200"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="排序方式" prop="orderby">
                                <el-input v-model="form.orderby" placeholder="如 id desc"/>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row v-if="form.type == 1">
                        <el-form-item label="过滤条件" prop="list_filter">
                            <el-row v-for="(item,i) in form.list_filter" :key="i">
                                <el-col :span="8">
                                    <el-form-item style="margin-bottom:3px !important">
                                        <el-select style="width:100%" v-model="item.searchField" filterable placeholder="请选择字段">
                                            <el-option v-for="(vo,i) in post_fields" :key="i"  :value="vo.field">{{vo.title}}({{vo.field}})</el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-col>
								<el-col :span="6">
                                    <el-form-item style="margin-bottom:3px !important">
                                        <el-select style="width:100%;position:relative; left:10px" v-model="item.searchCondition" filterable placeholder="请选择条件">
                                            <el-option key="0" value="=">=</el-option>
											<el-option key="1" value="<>"><></el-option>
											<el-option key="2" value="in">in</el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="6">
                                    <el-form-item style="margin-bottom:3px !important">
                                        <el-autocomplete :fetch-suggestions="querySearch" style="position:relative; left:20px" v-model="item.serachVal" placeholder="值"/>
                                    </el-form-item>
                                </el-col> 
                                <el-col :span="4">
                                    <el-button type="danger" size="mini" style="position:relative;left:35px"  icon="el-icon-close" @click="deleteItem('list_filter',i)"></el-button>
                                </el-col>  
                            </el-row>
                            <el-button type="success" icon="el-icon-plus" style="padding:5px 7px" :size="size" @click="addItem('list_filter')">追加</el-button>
                            <el-button v-if="form.list_filter && form.list_filter.length > 0" type="warning" icon="el-icon-delete" style="padding:5px 7px" :size="size" @click="clearItem('list_filter')">清空</el-button>
                        </el-form-item>
                    </el-row>
                </el-tab-pane>
                <el-tab-pane v-if="[1,2,3,4,5,11].includes(form.type) && dbtype !== 'mongo'" style="padding-top:10px"  label="多表配置" name="多表配置">
                    <el-form-item label="关联模型" prop="with_join">
                        <el-row :gutter="2" v-for="(item,i) in form.with_join" :key="i">
                            <el-col style="margin-left:0px" :span="5">
                                <el-form-item style="margin-bottom:3px !important"  prop="fk">
                                    <el-select style="width:100%" v-model="item.fk" filterable placeholder="主表外键">
                                        <el-option v-for="(vo,i) in model_fields" :key="i"  :value="vo.field">{{vo.title}}({{vo.field}})</el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="5">
                                <el-form-item style="margin-bottom:3px !important" prop="relative_table">
                                    <el-select style="width:100%" v-model="item.relative_table" filterable placeholder="模型">
                                        <el-option v-for="(vo,i) in tableList" :key="i" :value="vo.controller_name">{{vo.controller_name}}</el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="5">
                                <el-form-item style="margin-bottom:3px !important" prop="pk">
                                    <el-select @focus="getTableFields(i)" style="width:100%" v-model="item.pk" filterable placeholder="关联键">
                                        <el-option v-for="(vo,i) in table_fields" :key="i"  :value="vo.Field">{{vo.Field}}({{vo.Comment}})</el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="7">
                                 <el-form-item style="margin-bottom:3px !important" prop="fields">
                                    <el-select @focus="getTableFields(i)" style="width:100%" multiple collapse-tags v-model="item.fields" filterable :placeholder="form.type == 1?'关联表查询字段':'操作字段'">
                                        <el-option v-for="(vo,i) in table_fields" :key="i"  :value="vo.Field">{{vo.Field}}({{vo.Comment}})</el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="1">
                                <el-button type="danger" size="mini" style="position:relative;left:5px"  icon="el-icon-close" @click="deleteItem('with_join',i)"></el-button>
                            </el-col> 
                        </el-row>
                        <el-button type="success" icon="el-icon-plus" style="padding:5px 7px" :size="size" @click="addItem('with_join')">追加</el-button>
                        <el-button v-if="form.with_join && form.with_join.length > 0" type="warning" icon="el-icon-delete" style="padding:5px 7px" :size="size" @click="clearItem('with_join')">清空</el-button>
                    </el-form-item>
					<el-row v-if="[1,5].includes(form.type) && dbtype !== 'mongo'">
                        <el-form-item label="table列表sql" prop="sql">
                            <el-input v-model="form.sql" type="textarea" placeholder="通过sql语句生成table列表"  />
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
		},
		menu_id: {
			type: String,
		},
		action: {
			type: Array,
		},
		info: {
			type: Object,     
		}
	},
	computed: {
        actionList(){
            return this.action.filter(item=>item.show_api)
        }
    },
	data() {
		return {
			form: {
				server_create_status:1,
				vue_create_status:1,
				button_color:'primary',
				select_type:1,
				fields:[],
				list_filter:[],
				tab_config:[],
				with_join:[],
				type:'',
				icon:'',
				name:'',
				action_name:'',
				dialog_size:'600px',
				pagesize:'20',
				sql:'',
				other_config:{
					login_type:'',
				}
			},
			iconDialogStatus:false,
			post_fields:[],
			activeName: 'first',
			tableList:[],
			dialog:true,
			button:true,
			loading:false,
			ischeck_fields:[],
			activeName:'基本信息',
			table_fields:[],
			tab_fields:[],
			model_fields:[],
			sms_list:[],
			dbtype:'',
			restaurants: [{'value':'null'},{'value':'not null'}],
			rules: {
				name: [{ required: true, message: '方法中文名不能为空', trigger: 'blur' }],
				action_name: [{ required: true, message: '方法英文名不能为空', trigger: 'blur' }],
				type: [{ required: true, message: '方法类型不能为空', trigger: 'blur' }],
			},
		}
	},
	methods: {
		submit(){
			this.$refs['form'].validate(valid => {
				if (valid) {
					this.loading = true
					axios.post(base_url+'/Sys.Base/updateAction',this.form).then(res => {
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
			this.setDefaultVal('list_filter')
			this.setDefaultVal('tab_config')
			this.setDefaultVal('fields')
			this.setDefaultVal('with_join')
			this.initAction()
			if(this.form.other_config == '' || this.form.other_config == null){
                this.form.other_config = {}
            }else{
                this.form.other_config = JSON.parse(this.info.other_config)
            }
            this.initAction()
			axios.post(base_url+'/Sys.Base/getPostField',{menu_id:this.menu_id}).then(res => {
				this.post_fields = res.data.data
				this.tab_fields = res.data.data
				this.model_fields = res.data.model_fields
				this.tableList = res.data.tableList
				this.sms_list = res.data.sms_list
				this.dbtype = res.data.dbtype
			})
		},
		selectType(val){
			if(val !== 1){
				this.form.list_filter = []
				this.form.with_join = []
			}
			if(val !== 3 || val !== 4){
				this.form.tab_config = []
			}
			if(val !== 7){
				this.form.dialog_size = ''
			}
			this.action.forEach(item=>{
				if(this.form.type == item.type){
					this.dialog = item.dialog
					this.button = item.button
					this.form.icon = item.icon
					this.form.button_color = item.button_color
					this.form.name = item.name
					this.form.action_name = item.action_name
				}
			})
		},
		getTableFields(i){
			axios.post(base_url+'/Sys.Base/getTableFields',{controller_name:this.form.with_join[i].relative_table}).then(res => {
				this.table_fields = res.data.filedList
			})
		},
		closeForm(){
			this.$emit('update:show', false)
			this.loading = false
			this.$nextTick(()=>{
				this.$refs['form'].resetFields()
				this.form.dialog_size = ''
				this.form.icon = ''
				this.form.sql = ''
			})
		},
		initAction(){
			this.action.forEach(item=>{
				if(this.form.type == item.type){
					this.dialog = item.dialog
					this.button = item.button
				}
			})
		},
		setDefaultVal(key){
			if(this.form[key] == null || this.form[key] == ''){
				this.form[key] = []
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
		querySearch(queryString, cb) {
			var restaurants = this.restaurants;
			cb(restaurants);
		}
	},
});
