// 接口请求函数模块

import ajax from './ajax.js'

const BASE_URL = '/apis'

// 获取手机验证码函数
export const getCaptcha = (phone) => ajax(BASE_URL + '/captcha/sent', {phone})

// 注册请求函数
export const register = ({phone, password, captcha, nickname}) => ajax(BASE_URL + '/register/cellphone', {phone, password, captcha, nickname}, 'POST')

// 登录请求函数
export const login = ({phone, password}) => ajax(BASE_URL + '/login/cellphone', {phone, password}, 'POST')

// 获取推荐歌曲请求函数
export const recommend = () => ajax(BASE_URL + '/recommend/songs')

// 根据id获取歌曲的url
export const getUrl = (id) => ajax(BASE_URL + '/song/url', {id})

// 获取排行榜歌单
export const getRank = (idx) => ajax(BASE_URL + '/top/list', {idx})

// 根据关键字搜索
export const search = ({keywords, limit, offset}) => ajax(BASE_URL + '/search', {keywords, limit, offset})

// 获取精品歌单
export const getPlayList = ({limit, before}) => ajax(BASE_URL + '/top/playlist/highquality', {limit, before})

// 获取歌单详情
export const getDetail = (id) => ajax(BASE_URL + '/playlist/detail', {id})

// 获取歌曲详情
export const getSongDetail = (ids) => ajax(BASE_URL + '/song/detail', {ids})

// 获取歌词
export const getsongLrc = (id) => ajax(BASE_URL + '/lyric', {id})