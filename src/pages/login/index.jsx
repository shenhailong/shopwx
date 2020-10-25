import React, { Component } from 'react'
import { View, Text, Input, Button, Form } from '@tarojs/components'
import classNames from 'classnames'
import fly from '@/configs/fly'
import md5 from 'md5'
import './index.scss'

export default class Index extends Component {

  constructor(props){
    super(props)
    this.state = {
      password: '111111', // 密码
      username: 'mayun', // 手机号
      openEye: false // 密码可见不可见
    }
  }

  componentWillMount () { }

  componentDidMount () { }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  // 处理输入框事件，更新state
  inputHandler = (key, e) => {
    this.setState({ [key]: e.detail.value })
    this.props.onChildInputChange(key, e.detail.value)
  }

  // 密码可见不可见
  changeEye() {
    console.log(111)
    console.log(this)
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
    console.log(232322)
    let data = {
      username: this.state.username,
      passwd: md5(this.state.password),
      vcode: 3050
      // vcode: this.state.vcode
    }
    let res = await fly.post('user.login', data)
    console.log(res)
  }

  render () {
    return (
      <View className='wrap_login'>
        <View className='content'>
          <View className='form'>
            <View className='form_item'>
              <View className='label'>账号</View>
                <Input
                  value={this.state.username}
                  onInput={this.inputHandler.bind(this, 'username')}
                  className='input_dom'
                  placeholderClass='placeholder'
                  maxLength='30'
                  type='text' placeholder='请输入手机号码/工号'
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

            <View className='form_item'>
              <View className='label'>账号</View>
                <Input
                  value={this.state.username}
                  onInput={this.inputHandler.bind(this, 'username')}
                  className='input_dom'
                  placeholderClass='placeholder'
                  maxLength='30'
                  type='text' placeholder='请输入手机号码/工号'
                />
            </View>
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
        <Text className='title'>Hello world!</Text>
      </View>
    )
  }
}
