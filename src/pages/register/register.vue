<!-- 登录组件 -->

<template>
  <div class='form'>
  	<mu-appbar class='title' style="width: 100%;" color='green' title="注册"></mu-appbar>
    <mu-form ref="form" :model="validateForm" class="mu-demo-form">
	    <mu-form-item label="手机号" prop="phone" :rules="phoneRules">
	      <mu-text-field v-model="validateForm.phone" prop="phone"  ref='phone'></mu-text-field>
	    </mu-form-item>
	    <span class='getC' @click.prevent='getCaptcha'>{{this.computeTime? `已发送(${computeTime}s)`:'获取验证码'}}</span>
	    <mu-form-item label="昵称" help-text='请输入3到10位昵称' prop="nickname" :rules="nicknameRules">
	        <mu-text-field type="text" v-model="validateForm.nickname" prop="nickname"></mu-text-field>
	    </mu-form-item>
	    <mu-form-item label="密码" help-text='请输入3到10位密码' prop="password" :rules="passwordRules">
	        <mu-text-field type="password" v-model="validateForm.password" prop="password"></mu-text-field>
	    </mu-form-item>
	    <mu-form-item label="验证码" prop="captcha" :rules="captchaRules">
	        <mu-text-field type="text" v-model="validateForm.captcha" prop="captcha"></mu-text-field>
	    </mu-form-item>
	    <mu-form-item prop="isAgree" :rules="argeeRules">
	      <mu-checkbox label="同意用户协议" v-model="validateForm.isAgree"></mu-checkbox>
	    </mu-form-item>
	    <mu-form-item>
	      <mu-button color="green" @click.prevent="submit">提交</mu-button>
	      <mu-button @click="clear" color='#009688'>重置</mu-button>
	      <router-link to='/login' class='link' tag='a'>登录</router-link>
	    </mu-form-item>
	</mu-form>
  </div>
</template>

<script>
import {getCaptcha, register} from '../../api/index.js'
import Toast from 'muse-ui-toast'

// 手机号匹配正则
const telReg = /^1[3-9]\d{9}$/

export default {
  data () {
    return {
      computeTime: 0, // 验证码计时
      phoneRules: [
        { validate: (val) => !!val, message: '请输入手机号'},
        { validate: (val) => telReg.test(val), message: '请输入正确的手机号'}
      ],
      nicknameRules: [
        { validate: (val) => !!val, message: '请输入昵称'},
        { validate: (val) => val.length >= 3 && val.length <= 10, message: '请输入3到10位昵称'}
      ],
      passwordRules: [
        { validate: (val) => !!val, message: '必须填写密码'},
        { validate: (val) => val.length >= 3 && val.length <= 10, message: '密码长度大于3小于10'}
      ],
      captchaRules: [{validate: (val) => !!val, message: '请输入验证码'}],
      argeeRules: [{ validate: (val) => !!val, message: '必须同意用户协议'}],
      validateForm: {
        phone: '',
        nickname: '',
        password: '',
        captcha: '',
        isAgree: false
      }
    }
  },
  methods: {
    submit () {
      this.$refs.form.validate().then(async (result) => {
        if (result) {
        	// 定义一个用来发送请求的参数对象
        	let data = {}
        	Object.keys(this.validateForm).forEach(key => {
        		if (key != 'isAgree') {
        			data[key] = this.validateForm[key]
        		}
        	})
        	// 发送注册请求
        	let res = await register(data)
        	// 处理请求结果
        	if (res.code == 200) {
        		// 提示注册成功
            Toast.success('登录成功')

            // 为存储store数据做准备
            let user = {}
            user.nickname = res.profile.nickname
            user.avatarUrl = res.profile.avatarUrl

            // 把数据存到localStorage
            localStorage.setItem('user', JSON.stringify(user))

            // 跳转到首页
            this.$router.replace('/home')
        	} else {
            Toast.success(result)
          }
        }
      });
    },
    clear () {
      this.$refs.form.clear();
      this.validateForm = {
        phone: '',
        nickname: '',
        password: '',
        captcha: '',
        isAgree: false
      };
    },
    async getCaptcha () {
    	// 获取表单上的手机号码
    	let num = this.$refs.phone.value
    	if (num && telReg.test(num)) {
    		if (!this.computeTime) {
	    		// 设置获取验证码60秒
	    		this.computeTime = 60
	    		// 启动计时
	    		this.intervalId = setInterval(() => {
	    			this.computeTime--

	    			if (this.computeTime <= 0) {
	    				// 停止计时
	    				clearInterval(this.intervalId)
	    			}
	    		}, 1000)
	    		
	    		// 发送获取验证码请求
	    		let result = await getCaptcha(num)

	    		// 请求错误处理
	    		if (result.code != 200) {
	    			this.computeTime = 0
	    			clearInterval(this.intervalId)
	    		}
	    	}
    	}
    }
  }
}
</script>

<style lang='less' scoped>
	.form {
		padding: 40px;
		.title {
			margin-bottom: 50px;
		}
		.mu-demo-form {
		  width: 100%;
		  max-width: 460px;
		}
		.link {
	      color: #42a5f5;
	      margin-left: 20px;
	    }
	    .getC {
	    	border: 1px solid black;
	    }
	}
</style>
