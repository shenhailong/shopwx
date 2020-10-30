import React, { Component } from 'react'
import Taro from '@tarojs/taro'
import { View, Picker, Text } from '@tarojs/components'
import { AtSearchBar, AtButton } from 'taro-ui'
import classNames from 'classnames'
import "taro-ui/dist/style/components/search-bar.scss" // 按需引入
import "taro-ui/dist/style/components/icon.scss" // 按需引入
import fly from '@/configs/fly'
import { TOKEN } from '@/constants/key'
import { getDate } from '@/utils/tools'
import Empty from '@/components/empty'
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
      sstartdate: '', // 开始日期
      senddate: '', // 结束日期
      token: ''
    }
  }

  componentDidShow(){
    Taro.getStorage({
      key: TOKEN,
      success: (value) => {
        this.setState({
          token: value
        })
        this.reloadList()
      }
    })
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
    const { curPage, pageSize, sstartdate, senddate, list, searchString } = this.state
    const params = {
      curPage,
      pageSize,
      sstartdate,
      senddate,
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

  inputHandler(value) {
    this.setState({ searchString : value })
  }

  // 跳转到订单详情
  navigateToDetail = item => {
    Taro.navigateTo({
      url: `/pages/orderDetail/index?id=${item.id}`
    })
  }

  goLogin = () => {
    Taro.navigateTo({
      url: `/pages/login/index`
    })
  }

  onStartDateChange(e) {
    this.setState({
      sstartdate: e.detail.value
    })
  }

  onEndDateChange(e) {
    this.setState({
      senddate: e.detail.value
    })
  }

  startDateClass() {
    const className = classNames({
      disabled: !this.state.sstartdate,
      time: this.state.sstartdate
    })
    return className
  }

  endDateClass() {
    const className = classNames({
      disabled: !this.state.senddate,
      time: this.state.senddate
    })
    return className
  }

  reset() {
    this.setState({
      sstartdate: '',
      senddate: '',
      searchString: ''
    })
  }

  onActionClick() {
    let { sstartdate, senddate} = this.state
    if(sstartdate !== '' && senddate !== ''){
      let start = sstartdate.replace(/-/g, '/') // 替换字符，变成标准格式
      let end = senddate.replace(/-/g, '/') // 替换字符，变成标准格式
      var s = new Date(Date.parse(start));
      var e = new Date(Date.parse(end));
      if(s > e){
        Taro.showToast({
          title: '开始时间必须小于结束时间',
          icon: 'none'
        })
        return
      }
    }

    this.setState({
      list: []
    }, () => {
      this.fetchList()
    })
  }

  render () {
    const { list, searchString, sstartdate, senddate, token } = this.state
    const listDom = list.map(item => {
      return (
        <View onClick={this.navigateToDetail.bind(this, item)} key={item} className='list'>
          <View className='item'>
            <View className='label'>订单号码:</View>
            <View className='value'>{item.orderno}</View>
          </View>
          <View className='item'>
            <View className='label'>产品编号:</View>
            <View className='value'>{item.prodno}</View>
          </View>
          <View className='item'>
            <View className='label'>产品描述:</View>
            <View className='value'>{item.proddesc}</View>
          </View>
          <View className='item'>
            <View className='label'>订单时间:</View>
            <View className='value'>{getDate(item.orderdt, true)}</View>
          </View>
        </View>
      )
    })
    return (
      <View className='wrap-index'>
        <View className='header'>
        <AtSearchBar
          value={searchString}
          showActionButton
          placeholder='请输入订单编号 / 产品编号'
          onChange={this.inputHandler.bind(this)}
          onActionClick={this.onActionClick.bind(this)}
        />
        <View className='time-wrap'>
          <Picker className='picker' mode='date' onChange={this.onStartDateChange.bind(this)}>
            <View>
              开始日期：<Text className={this.startDateClass()}>{sstartdate ? sstartdate : '请选择'}</Text>
            </View>
          </Picker>
          <Picker className='picker' mode='date' onChange={this.onEndDateChange.bind(this)}>
            <View>
              结束日期：<Text className={this.endDateClass()}>{senddate ? senddate : '请选择'}</Text>
            </View>
          </Picker>
          <AtButton onClick={this.reset.bind(this)} className='btn-reset' type='secondary' size='small'>重置</AtButton>
        </View>

        </View>
        <View className='content'>
          {
            list.length ? listDom : (token ? <Empty />: <AtButton onClick={this.goLogin} type='primary' size='small' className='btn-login'>请登录</AtButton>)
          }
        </View>
      </View>
    )
  }
}
