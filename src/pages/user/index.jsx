import React, { Component } from 'react'
import Taro from '@tarojs/taro'
import { View, Image, Text } from '@tarojs/components'
import HeaderImg from '@/static/images/user/avatar.png'
import { AtButton, AtModal } from 'taro-ui'
import fly from '@/configs/fly'
import { TOKEN } from '@/constants/key'

import './index.scss'

export default class Index extends Component {
  constructor(props){
    super(props)
    this.state = {
      userInfo: {},
      list: [],
      isOpened: false
    }
  }

  componentWillMount () {
    this.fetchDetail()
  }

  // 获取详情
  async fetchDetail() {
    Taro.showLoading({
      title: '加载中'
    })
    try {
      let res = await fly.post('user.detail')
      if(res.code === 0) {
        let user = res.data
        this.setState({
          userInfo: res.data,
          list: [{
            label: '公司全称:',
            value: user.corp.company
          }, {
            label: '社会统一信用代码:',
            value: user.corp.shtyxydm
          }, {
            label: '我的邀请码:',
            value: user.corp.invitecode
          }, {
            label: '会员邀请积分:',
            value: user.corp.jfye,
            type: 'score'
          }, {
            label: '通讯地址:',
            value: user.txdz
          }, {
            label: '联系人:',
            value: user.contact
          }, {
            label: '联系电话:',
            value: user.conphone
          }, {
            label: '营业执照:',
            src: user.yyzz,
            type: 'img'
          }]
        })
      }
    }catch(e) {}
    Taro.hideLoading()
  }

  loginOut = () =>{
    this.setState({
      isOpened: true
    })

  }

  handleConfirm = () => {
    Taro.removeStorage({
      key: TOKEN
    })
    Taro.reLaunch({
      url: '/pages/login/index'
    })
  }

  render () {
    let { userInfo, list, isOpened } = this.state
    return (
      <View className='wrap-index'>
        <AtModal
          isOpened={isOpened}
          title='确定退出登录?'
          cancelText='取消'
          confirmText='确认'
          onClose={() => this.setState({ isOpened: false })}
          onCancel={() => { this.setState({ isOpened: false }) }}
          onConfirm={this.handleConfirm}
        />
        <View className='top'>
          <View className='info_box'>
            <Image src={HeaderImg} className='header_img' />
            <View className='name'>
              { userInfo.username ? userInfo.username : ''}
            </View>
          </View>
          {userInfo.member && <View className='level'>会员级别: <Text className='text'>{userInfo.member.membername}</Text></View>}
        </View>
        <View className='content'>
          <View className='card'>
            <View className='title'>基本信息</View>
            {
              list.map(item => {
                return (
                  <View key={item.id} className='item'>
                    <View className='label'>{item.label}</View>
                    <View className='value'>{item.value}</View>
                  </View>
                )
              })
            }
          </View>
          <AtButton onClick={this.loginOut} type='primary' size='small' className='btn'>退出</AtButton>
        </View>
      </View>
    )
  }
}
