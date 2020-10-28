/*
 * @Description:
 * @Version: 1.0.0
 * @Author: Dragon
 * @Date: 2020-10-28 14:48:00
 * @LastEditors: Dragon
 * @LastEditTime: 2020-10-28 15:02:02
 */
import React, { Component } from 'react'
import { View, Text } from '@tarojs/components'
import "taro-ui/dist/style/components/search-bar.scss" // 按需引入
import "taro-ui/dist/style/components/button.scss" // 按需引入
import "taro-ui/dist/style/components/icon.scss" // 按需引入
import './index.scss'

export default class Empty extends Component {
  constructor(props){
    super(props)
    this.state = {}
  }

  render () {
    return (
      <View className='wrap-empty'>
        <View className='icon-empty'></View>
        <Text>暂无数据</Text>
      </View>
    )
  }
}
