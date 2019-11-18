// ajax请求函数模块

import axios from 'axios'

// 向外导出ajax方法
export default function ajax (url, data={}, type='GET') {

	// 直接返回一个promise对象，为await准备
	return new Promise(function (resolve, reject) {
		// 提前定义一个promise接收后面发请求返回的值
		let promise = {}

		if (type === 'GET' ) {
			// 用来拼接字符串
			let dataStr = '' 

			// 拼接data对象里的数据
			Object.keys(data).forEach(key => {
				dataStr += key + '=' + data[key] + '&'
			})

			// 拼接完整的url地址
			if (dataStr != '') {
				dataStr = dataStr.substring(0, dataStr.lastIndexOf('&'))
				url = url + '?' + dataStr
			}
			
			// 发送get请求
			promise = axios({method: 'get', url, withCredentials: true})
		} else {
			// 发送post请求
			promise = axios({method: 'post', url, withCredentials: true, data})
		}

		// 这里调用调用then()方法为await准备
		promise.then(res => {
			// 成功调用
			resolve(res.data)
		}).then(err => {
			// 失败调用
			reject(err)
		})
	})
}
