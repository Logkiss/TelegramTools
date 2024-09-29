Vue.component('Dialogurl', {
	template: `
		<el-dialog title="弹窗连接" width="" @open="open" class="icon-dialog" :visible.sync="show" :before-close="closeForm" append-to-body>
			<iframe :src="jump" frameborder="0" width="100%" height="600px"></iframe>
		</el-dialog>
	</div>
	`
	,
	props: {
		show: {
			type: Boolean,
			default: true
		},
		size: {
			type: String,
			default: 'mini'
		},
		info: {
			type: Object,
		},
	},
	data() {
		return {
			jump:''
		}
	},
	methods: {
		open(){
			let query = {}
			Object.assign(query, {dialogstate:1})
			Object.assign(query, {role_id:this.info.role_id})
			this.jump = '/admin/Adminuser/index?' + param(query)
		},
		closeForm(){
			this.$emit('update:show', false)
		}
	}
})
