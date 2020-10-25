import React, { Component } from 'react'
import Taro from '@tarojs/taro'
import { View, Input, Picker } from '@tarojs/components'
import fly from '@/configs/fly'
import './index.scss'

export default class Index extends Component {
  constructor(props){
    super(props)
    this.state = {
      searchString: '', // 密码
      list: [],
      curPage: 1, // 当前页
      pageSize: 12,
      pages: 0,
      sstartdate: ''
    }
  }

  // 返回上个页面刷新 onShow
  componentDidShow(){
    this.reloadList()
  }

  // 重新加载列表数据
  reloadList() {
    this.setState({
      list: [],
      curPage: 1,
      pages: 0
    }, () => {
      this.fetchList()
    })
  }

  onReachBottom() {
    const { page, pages } = this.state
    if((page - 1) < pages) {
      this.fetchList()
    }else {
      Taro.showToast({
        title: '已经到底了',
        icon: 'none',
        duration: 800
      })
    }
  }

  // 获取客户清单
  async fetchList() {
    const { curPage, pageSize, sstartdate, list, searchString } = this.state
    const params = {
      curPage,
      pageSize,
      sstartdate,
      searchString: searchString.trim()
    }
    Taro.showLoading({
      title: '加载中'
    })
    try {
      let res = await fly.get('originorder.searchpage', params)
      if(res.code === 0) {
        this.setState({
          curPage: curPage + 1,
          list: list.concat(res.data.list),
          pages: res.data.pages
        })
      }
    }catch(e) {}
    Taro.hideLoading()
  }

  inputHandler(e) {
    this.setState({ searchString : e.detail.value })
  }

  // 跳转 到账查询
  navigateToRecord = item => {
    Taro.navigateTo({
      url: `/pages/orderDetail/index?id=${item.id}`
    })
  }

  onDateChange(e) {
    console.log(e)
    this.setState({
      sstartdate: e.detail.value
    })
  }

  render () {
    const { list } = this.state
    const listDom = list.map(item => {
      return (
        <View onClick={this.navigateToRecord.bind(this, item)} key={item} className='item'>
          111
        </View>
      )
    })
    return (
      <View className='wrap-index'>
        <View className='d'>
          <Input
            value={this.state.searchString}
            onInput={this.inputHandler.bind(this, 'username')}
            className='input_dom'
            placeholderClass='placeholder'
            maxLength='30'
            type='text' placeholder='请输入订单编号 / 产品编号'
          />
          <Picker mode='date' onChange={this.onDateChange.bind(this)}>
            <View className='picker'>
              当前选择：{this.state.sstartdate}
            </View>
          </Picker>
          <Picker mode='date' onChange={this.onDateChange.bind(this)}>
            <View className='picker'>
              当前选择：{this.state.sstartdate}
            </View>
          </Picker>
        </View>
        <View className='content'>
          {
            list.length ? listDom : null
          }
        </View>
      </View>
    )
  }
}
