Vue.component('Resetpwd', {
	template: `
		<el-dialog title="重置密码" width="500px" class="icon-dialog" :visible.sync="show" @open="open" :before-close="closeForm" append-to-body>
			<el-form :size="size" ref="form" :model="form" :rules="rules" label-width="80px">
				<el-row >
					<el-col :span="24">
						<el-form-item label="密码" prop="pwd">
							<el-input  show-password autoComplete="off" v-model="form.pwd"  clearable placeholder="请输入密码"/>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row >
					<el-col :span="24">
						<el-form-item label="确认密码" prop="repwd">
							<el-input  show-password autoComplete="off" v-model="form.repwd"  clearable placeholder="请输入确认密码"/>
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
	components:{
	},
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
		},
	},
	data(){
		var validatePass2 = (rule, value, callback) => {
			if (value === '') {
				callback(new Error('请再次输入密码'))
			} else if (value !== this.form.pwd) {
				callback(new Error('两次输入密码不一致!'))
			} else {
				callback()
			}
		}
		return {
			form: {
			},
			role_ids:[],
			loading:false,
			rules: {
				repwd:[
					{required: true, validator: validatePass2, trigger: 'blur'},
				],
			}
		}
	},
	watch:{
		show(val){
			if(val){
				axios.post(base_url + '/Adminuser/getFieldList').then(res => {
					if(res.data.status == 200){
						this.role_ids = res.data.data.role_ids
					}
				})
			}
		}
	},
	methods: {
		open(){
			this.form = this.info
		},
		submit(){
			this.$refs['form'].validate(valid => {
				if(valid) {
					this.loading = true
					axios.post(base_url + '/Adminuser/resetPwd',this.form).then(res => {
						if(res.data.status == 200){
							this.$message({message: res.data.msg, type: 'success'})
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
		closeForm(){
			this.$emit('update:show', false)
			this.loading = false
			if (this.$refs['form']!==undefined) {
				this.$refs['form'].resetFields()
			}
		},
	}
})
