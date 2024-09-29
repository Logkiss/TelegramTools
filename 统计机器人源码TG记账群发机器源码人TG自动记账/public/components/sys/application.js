//添加
Vue.component('add', {
	template: `
		<el-dialog title="添加" width="520px" class="icon-dialog" :visible.sync="show" @close="closeForm()" append-to-body>
			<el-form :size="size" ref="form" :model="form" :rules="rules" label-width="100px">
				<el-form-item label="应用名" prop="application_name">
					<el-input v-model="form.application_name" placeholder="请输入应用名称"  />
				</el-form-item>
				<el-form-item label="应用目录名" prop="app_dir">
					<el-input v-model="form.app_dir" placeholder="请输入应用目录名"/>
				</el-form-item>
				<el-form-item label="应用类型" prop="app_type">
					<el-radio v-model="form.app_type" :label="1">后台应用</el-radio>
					<el-radio v-model="form.app_type" :label="2">api应用</el-radio>
					<el-radio v-model="form.app_type" :label="3">cms应用</el-radio>
					<el-radio v-model="form.app_type" :label="4">空应用</el-radio>
				</el-form-item>
				<el-form-item v-if="['2','3','4'].includes(form.app_type)" label="访问域名" prop="domain">
					<el-input v-model="form.domain" placeholder="请输入访问域名"/>
				</el-form-item>
				<el-form-item v-if="form.app_type == 1" label="设置登录表" prop="login_table">
					<el-select style="width:100%" @change="selectTable" v-model="form.login_table" clearable filterable placeholder="请选择数据表">
						<el-option v-for="item in tableList" :key="item" :label="item" :value="item"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item v-if="form.app_type == 1" label="登录字段" prop="login_fields">
					<el-input v-model="form.login_fields" clearable placeholder="用户名字段|密码字段"/>
				</el-form-item>
				<el-form-item v-if="form.app_type == 1" label="登录表主键" prop="pk">
					<el-input v-model="form.pk" clearable placeholder="登录表主键id"/>
				</el-form-item>
				<el-form-item label="生成状态" prop="status">
					<el-radio v-model="form.status" :label="1">启用</el-radio>
					<el-radio v-model="form.status" :label="0">禁用</el-radio>
				</el-form-item>
				<el-form-item label="访问域名" prop="domain">
					<el-input v-model="form.domain" clearable placeholder="请输入访问地址"/>
				</el-form-item>
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
		}
	},
	data() {
		return {
			form: {
				application_name:'',
				app_dir:'',
				login_table:'',
				login_fields:'',
				pk:'',
				status:1,
				app_type:1,
				domain:'',
			},
			loading:false,
			tableList:[],
			rules: {
				application_name: [{ required: true, message: '请输入应用名', trigger: 'blur' }],
				app_dir: [{ required: true, message: '请输入应用目录名', trigger: 'blur' }],
				login_table: [{ required: true, message: '请配置登录数据表', trigger: 'blur' }],
				login_fields: [{ required: true, message: '请配置登录账号密码字段', trigger: 'blur' }],
				pk: [{ required: true, message: '请配置登录表主键', trigger: 'blur' }],
			},
		}
	},
	watch: {
		show() {
			axios.post(base_url+'/Sys.Base/getTables').then(res => {
				this.tableList = res.data.data
			})
		}
	},
	methods: {
		submit(){
			this.$refs['form'].validate(valid => {
				if (valid) {
					this.loading = true
					axios.post(base_url+'/Sys.Base/createApplication',this.form).then(res => {
						if(res.data.status == 200){
							this.$message({message: '操作成功', type: 'success'})
							this.$emit('refesh_list')
							this.closeForm()
						}else{
							this.loading = false
						}
					}).catch(()=>{
						this.loading = false
						this.$message.error(res.data.msg)
					})
				}
			})
		},
		selectTable(val){
			axios.post(base_url+'/Sys.Base/getPk',{tablename:val}).then(res => {
				if(res.data.status == 200){
					this.form.pk = res.data.data
				}
			})
		},
		closeForm(){
		   this.$emit('update:show', false)
		   this.loading = false
		   if (this.$refs['form']!==undefined) {
				this.$refs['form'].resetFields();
		   }
		}
	},
});

//修改
Vue.component('update', {
	template: `
		<el-dialog title="添加" width="520px" class="icon-dialog" :visible.sync="show" @close="closeForm()" append-to-body>
			<el-form :size="size" ref="form" :model="form" :rules="rules" label-width="100px">
				<el-form-item label="应用名" prop="application_name">
					<el-input v-model="form.application_name" placeholder="请输入应用名称"  />
				</el-form-item>
				<el-form-item label="应用目录名" prop="app_dir">
					<el-input v-model="form.app_dir" placeholder="请输入应用目录名"/>
				</el-form-item>
				<el-form-item label="应用类型" prop="app_type">
					<el-radio v-model="form.app_type" :label="1">后台应用</el-radio>
					<el-radio v-model="form.app_type" :label="2">api应用</el-radio>
					<el-radio v-model="form.app_type" :label="3">cms应用</el-radio>
					<el-radio v-model="form.app_type" :label="4">空应用</el-radio>
				</el-form-item>
				<el-form-item v-if="['2','3','4'].includes(form.app_type)" label="访问域名" prop="domain">
					<el-input v-model="form.domain" placeholder="请输入访问域名"/>
				</el-form-item>
				<el-form-item v-if="form.app_type == 1" label="设置登录表" prop="login_table">
					<el-select style="width:100%" @change="selectTable" v-model="form.login_table" clearable filterable placeholder="请选择数据表">
						<el-option v-for="item in tableList" :key="item" :label="item" :value="item"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item v-if="form.app_type == 1" label="登录字段" prop="login_fields">
					<el-input v-model="form.login_fields" clearable placeholder="用户名字段|密码字段"/>
				</el-form-item>
				<el-form-item v-if="form.app_type == 1" label="登录表主键" prop="pk">
					<el-input v-model="form.pk" clearable placeholder="登录表主键id"/>
				</el-form-item>
				<el-form-item label="生成状态" prop="status">
					<el-radio v-model="form.status" :label="1">启用</el-radio>
					<el-radio v-model="form.status" :label="0">禁用</el-radio>
				</el-form-item>
				<el-form-item label="访问域名" prop="domain">
					<el-input v-model="form.domain" clearable placeholder="请输入访问地址"/>
				</el-form-item>
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
		info: {
			type: Object,
			default: false
		}
	},
	data() {
		return {
			form: {
				application_name:'',
				app_dir:'',
				login_table:'',
				login_fields:'',
				pk:'',
				status:1,
				app_type:1,
				domain:'',
			},
			loading:false,
			tableList:[],
			rules: {
				application_name: [{ required: true, message: '请输入应用名', trigger: 'blur' }],
				app_dir: [{ required: true, message: '请输入应用目录名', trigger: 'blur' }],
				login_table: [{ required: true, message: '请配置登录数据表', trigger: 'blur' }],
				login_fields: [{ required: true, message: '请配置登录账号密码字段', trigger: 'blur' }],
				pk: [{ required: true, message: '请配置登录表主键', trigger: 'blur' }],
			},
		}
	},
	watch: {
		show() {
			this.form = this.info
			axios.post(base_url+'/Sys.Base/getTables').then(res => {
				this.tableList = res.data.data
			})
		}
	},
	methods: {
		submit(){
			this.$refs['form'].validate(valid => {
				if (valid) {
					this.loading = true
					axios.post(base_url+'/Sys.Base/updateApplication',this.form).then(res => {
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
		selectTable(val){
			axios.post(base_url+'/Sys.Base/getPk',{tablename:val}).then(res => {
				if(res.data.status == 200){
					this.form.pk = res.data.data
				}
			})
		},
		closeForm(){
		   this.$emit('update:show', false)
		   this.loading = false
		   if (this.$refs['form']!==undefined) {
				this.$refs['form'].resetFields();
		   }
		}
	},
});
