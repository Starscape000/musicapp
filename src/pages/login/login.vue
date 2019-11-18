<!-- 登录组件 -->

<template>
  <div class='form'>
  	<mu-appbar class='title' style="width: 100%;" color='green' title="登录"></mu-appbar>
    <mu-form ref="form" :model="validateForm" class="mu-demo-form">
	    <mu-form-item label="手机号" prop="phone" :rules="phoneRules">
	      <mu-text-field v-model="validateForm.phone" prop="phone"></mu-text-field>
	    </mu-form-item>
	    <mu-form-item label="密码" prop="password" :rules="passwordRules">
	        <mu-text-field type="password" v-model="validateForm.password" prop="password"></mu-text-field>
	    </mu-form-item>
	    <mu-form-item prop="isAgree" :rules="argeeRules">
	      <mu-checkbox label="同意用户协议" v-model="validateForm.isAgree"></mu-checkbox>
	    </mu-form-item>
	    <mu-form-item>
	      <mu-button color="green" @click="submit">提交</mu-button>
	      <mu-button @click="clear" color='#009688'>重置</mu-button>
        <router-link to='/register' class='link' tag='a'>注册</router-link>
	    </mu-form-item>
	</mu-form>
  </div>
</template>

<script>
import {login} from '../../api/index.js'
import Toast from 'muse-ui-toast'

const telReg = /^1[3-9]\d{9}$/

export default {
  data () {
    return {
      phoneRules: [
        { validate: (val) => !!val, message: '请输入手机号'},
        { validate: (val) => telReg.test(val), message: '请输入正确手机号'}
      ],
      passwordRules: [
        { validate: (val) => !!val, message: '必须填写密码'},
        { validate: (val) => val.length >= 3 && val.length <= 10, message: '密码长度大于3小于10'}
      ],
      argeeRules: [{ validate: (val) => !!val, message: '必须同意用户协议'}],
      validateForm: {
        phone: '',
        password: '',
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
          // 发送登录请求
          let result = await login(data)
 
          // 处理请求结果
          if (result.code == 200) {
            // 提示登录成功
            Toast.success('登录成功')
            
            // 为存储store数据做准备
            let user = {}
            user.nickname = result.profile.nickname
            user.avatarUrl = result.profile.avatarUrl

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
        password: '',
        isAgree: false
      };
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
	}
</style>
