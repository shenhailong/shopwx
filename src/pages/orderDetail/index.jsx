import React, { Component } from 'react'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { View } from '@tarojs/components'
import fly from '@/configs/fly'
import { getDate } from '@/utils/tools'
import './index.scss'

export default class Index extends Component {

  constructor(props){
    super(props)
    this.state = {
      list: [],
      baseList: [],
      prodList: []
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
        let data = res.data
        this.setState({
          baseList: [
            {
              name: '订单号码:',
              value: data.orderno
            },{
              name: '客户订阅号:',
              value: data.custid
            },{
              name: '订单时间:',
              value: getDate(data.orderdt, true)
            },{
              name: '维保到期时间:',
              value: getDate(data.enddt, true)
            }
          ],
          prodList: [
            {
              name: '产品编号:',
              value: data.prodno
            },{
              name: '产品描述:',
              value: data.proddesc
            },{
              name: '产品数量:',
              value: data.amount
            }
          ],
          list: [
            {
              name: '客户联系人:',
              value: data.contact
            },{
              name: '联系电话:',
              value: data.tel
            },{
              name: '邮箱:',
              value: data.email
            },{
              name: '公司中文名称:',
              value: data.ccorpname
            },{
              name: '公司英文名称:',
              value: data.ecorpname
            },{
              name: '最终用户社会统一信用代码:',
              value: data.shtyxydm
            }
          ]
        })
      }
    }catch(e) {}
    Taro.hideLoading()
  }

  render () {
    const { list, baseList, prodList } = this.state
    return (
      <View className='order-detail'>
        <View className='list'>
          <View className='title'>基础信息</View>
          {
            baseList.map(item => {
              return (
                <View key={item.id} className='item'>
                  <View className='label'>{item.name}</View>
                  <View className='value'>{item.value}</View>
                </View>
              )
            })
          }
        </View>

        <View className='list'>
          <View className='title'>产品信息</View>
          {
            prodList.map(item => {
              return (
                <View key={item.id} className='item'>
                  <View className='label'>{item.name}</View>
                  <View className='value'>{item.value}</View>
                </View>
              )
            })
          }
        </View>

        <View className='list'>
          <View className='title'>其他信息</View>
          {
            list.map(item => {
              return (
                <View key={item.id} className='item'>
                  <View className='label'>{item.name}</View>
                  <View className='value'>{item.value}</View>
                </View>
              )
            })
          }
        </View>
      </View>
    )
  }
}
