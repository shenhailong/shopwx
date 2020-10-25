import React, { Component } from 'react'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { View } from '@tarojs/components'
import fly from '@/configs/fly'
import './index.scss'

export default class Index extends Component {

  constructor(props){
    super(props)
    this.state = {
      detail: {}
    }
  }

  componentWillMount () {
    this.fetchDetail()
  }

  // 获取详情
  async fetchDetail() {
    const params = {
      id: getCurrentInstance().router.params.id
    }
    Taro.showLoading({
      title: '加载中'
    })
    try {
      let res = await fly.get('originorder.detail', params)
      if(res.code === 0) {
        this.setState({
          detail: res.data
        })
      }
    }catch(e) {}
    Taro.hideLoading()
  }


  render () {
    const { detail } = this.state
    return (
      <View className='index'>
        {detail.id}
      </View>
    )
  }
}
