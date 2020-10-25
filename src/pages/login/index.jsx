import React, { Component } from 'react'
import Taro from '@tarojs/taro'
import { View, Input, Button, Form, Image } from '@tarojs/components'
import classNames from 'classnames'
import fly from '@/configs/fly'
import { TOKEN } from '@/constants/key'
// import { BASE_URL } from '@/constants/common'
import md5 from 'md5'
import './index.scss'

let BASE_URL  = 'http://39.100.227.252:888'
export default class Index extends Component {
  constructor(props){
    super(props)
    this.state = {
      password: '', // 密码
      username: '', // 手机号
      vcode: '', //
      openEye: false, // 密码可见不可见
      needCaptcha: false,
      imgUrl: `${BASE_URL}/cnas/v1/vcode.picture.generate`,
    }
  }

  // 处理输入框事件，更新state
  inputHandler = (key, e) => {
    this.setState({ [key]: e.detail.value })
    this.props.onChildInputChange(key, e.detail.value)
  }

  //  用户名输入框输入就重新获取验证码
  inputBlur() {
    if(this.state.username) {
      this.setState({
        needCaptcha: true
      }, () => {
        this.getImg()
      })
    }
  }

  // 密码可见不可见
  changeEye() {
    this.setState({
      openEye: !this.state.openEye
    })
  }

  eyeClass() {
    const className = classNames({
      eye_close: !this.state.openEye,
      eye_open: this.state.openEye
    })
    return className
  }

  async submitHandler() {
    let data = {
      username: this.state.username,
      passwd: md5(this.state.password),
      vcode: this.state.vcode
    }
    let res = await fly.post('user.login', data)
    console.log(res)
    if(res.code === 0){
      Taro.setStorage({
        key: TOKEN,
        data: res.data.token
      })
      Taro.reLaunch({
        url: '/pages/index/index'
      })
    }
  }

  getImg() {
    let { username, imgUrl } = this.state
    this.setState({
      codeUrl: `${imgUrl}?username=${username}&random=${Math.random()}`
    })
  }

  render () {
    let { codeUrl, needCaptcha } = this.state
    return (
      <View className='wrap_login'>
        <View className='content'>
          <View className='title'>欢迎登录磐安云创</View>

          <View className='form'>
            <View className='form_item'>
              <View className='label'>用户名</View>
                <Input
                  onBlur={this.inputBlur.bind(this)}
                  value={this.state.username}
                  onInput={this.inputHandler.bind(this, 'username')}
                  className='input_dom'
                  placeholderClass='placeholder'
                  maxLength='30'
                  type='text' placeholder='请输入用户名'
                />
            </View>

            <View className='form_item'>
              <View className='label'>密码</View>
              {
                this.state.openEye ?
                  <Input
                    value={this.state.password}
                    onInput={this.inputHandler.bind(this, 'password')}
                    className='input_dom'
                    placeholderClass='placeholder'
                    type='text' placeholder='请输入密码'
                  /> :
                  <Input
                    value={this.state.password}
                    onInput={this.inputHandler.bind(this, 'password')}
                    className='input_dom'
                    placeholderClass='placeholder'
                    type='password' placeholder='请输入密码'
                  />
              }
              <View onClick={this.changeEye.bind(this)} className='icon_eye'>
                <View className={this.eyeClass()}></View>
              </View>
            </View>

            { needCaptcha && <View className='form_item'>
              <View className='label'>验证码</View>
                <Input
                  value={this.state.vcode}
                  onInput={this.inputHandler.bind(this, 'vcode')}
                  className='input_dom'
                  placeholderClass='placeholder'
                  maxLength='4'
                  type='text' placeholder='请输入验证码'
                />
                <Image src={codeUrl} onClick={this.getImg.bind(this)} className='img' />
            </View> }
            <Form onSubmit={this.submitHandler.bind(this)}>
            <Button
              formType='submit'
              disabled={this.state.submitting}
              loading={this.state.submitting}
              className='btn'
            >登录</Button>
            </Form>
          </View>
        </View>
      </View>
    )
  }
}
