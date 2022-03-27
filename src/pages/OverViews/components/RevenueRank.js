import React, { useState } from 'react';
import { useMount, useUnmount, useUpdateEffect } from 'ahooks';
import { Row, Col, message, Radio, Spin, Statistic, Progress } from 'antd'
import cls from './css/RevenueRank.less'
import { addSymbol, useLoading, useI18n } from "@/utils";
import overview from '@/stores/overview';
import { observer } from 'mobx-react';
import _ from 'underscore';
import { GradientsBorder } from '@/components/GradientsBorder'
import down from '@/assets/svg/ico_down02.svg'
import up from '@/assets/image/ico_up.png'
import session from '@/stores/session'

const title = {
    'rank': '营收排名 TOP',
    'rise': '营收上升幅度排名 TOP',
    'decline': '营收下降幅度排名 TOP',
}

// 区分3个定时器  防止调用多次函数而覆盖
const timer = {
    'rank': null,
    'rise': null,
    'decline': null,
}

const progressColor = {
  1: {
    '0%': '#FA465A',
    '100%': '#FC9B73',
  },
  2: {
    '0%': '#FF845E',
    '100%': '#E5B986',
  },
  3: {
    '0%': '#5B67FE',
    '100%': '#30BFF0',
  },
}

const defaultColor = {
  '0%': '#0796C0',
  '100%': '#36CB90',
}

export const RevenueRank = observer(({type})=>{
  const _t = useI18n()
  const [data, setData] = useState([])
  const [len, setLen] = useState(0)
  const [top, setTop] = useState(0)
  const [radioVal, setRadioVal] = useState(1);  // 1-周，2-月，3-年
  const [queryType, setQueryType] = useState(1)

  useMount(() => {
    getRevenue()
  })

  useUpdateEffect(() => {
    getRevenue()
  },[session.operatorIds, queryType, session.updateTime])

  useUnmount(() => {
    clearInterval(timer[type])
  })

  const getRevenue = async() =>{
    let params = { queryType: queryType }
    let res = {}
    if(type == 'rank') res = await overview.getOverViewRevenueRank(params)
    else if(type == 'rise') res = await overview.getOverViewRevenueRise(params)
    else if(type == 'decline') res = await overview.getOverViewRevenueDecline(params)

    if(res.code) return message.error(_t(res.message))
    let arr = [...res.records].map((item, index, curArr) => {
      item.myNum = index+1
      if(type == 'rank'){
        if(index == 0) item.percent = 100
        else item.percent = parseInt(item.amount/curArr[0].amount*100)
      }
      return item
    })

    if(arr.length == 1){  // 长度=1 不copy数组
      setData(arr)
    }else{
      setData([...arr, {}, ...arr]) // 下标1 2  为了无缝连接
    }
    setLen(arr.length)
    startTimer(arr)
  }

  const onChange = e => {
    console.log(e.target.value, type)
    clearInterval(timer[type])
    setTop(0)
    setRadioVal(e.target.value)
    setQueryType(e.target.value)
  }

  const startTimer = (arr) => {
    let height = (arr.length +1)*58   // 58是每个Item高度  +1是[...arr, {}, ...arr]的空对象
    clearInterval(timer[type])
    timer[type] = setInterval(() => {
      setTop(t => {
        if(Math.abs(t) >= height) return 0
        return t+0.25
      })
    },20) 
  }

  return (
    <div className={cls.container}>
      <Spin spinning={ useLoading(`overview/${type}`) }>
        <GradientsBorder>
          <div className={cls.rank}>
              <Row>
                  <Col span={8} className={cls.title}>{ _t(title[type])+ (len || '') }</Col>
                  <Col span={15} offset={1} className={cls.radio}>
                    <Radio.Group onChange={onChange} value={radioVal}>
                      <Radio value={1} style={{marginRight: 12, color: '#fff'}}>{ _t('近7天') }</Radio>
                      <Radio value={2} style={{marginRight: 12, color: '#fff'}}>{ _t('近30天') }</Radio>
                      <Radio value={3} style={{marginRight: 0, color: '#fff'}}>{ _t('近365天') }</Radio>
                    </Radio.Group>
                  </Col>
              </Row>
              <div className={cls.list}>
                <div style={len > 1 ? {position:'absolute',width:'100%',top: -top + 'px'}: {}}>
                  {
                    !_.isEmpty(data)&&data.map((item, index) => (
                      <div key={'data'+index} className={type == 'rank' ? cls.progressItem : cls.stationItem}>
                        {
                          _.isEmpty(item) ? null :  
                          type == 'rank' ? 
                          <div>
                            <Row justify={'space-between'} className={cls.amount}>
                              <Col span={17} className={cls.name}>{ `${item.myNum}. ${_t(item.name)}` }</Col>
                              <Col span={7}><Row justify={'end'}>{ addSymbol(item.amount, '¥') }</Row></Col>
                            </Row>
                            <Progress percent={item.percent} showInfo={false} strokeColor={ progressColor[item.myNum] || defaultColor } trailColor="#324060" />
                          </div>
                          :
                          <Row justify={'space-between'} style={{flex:1}}>
                            <Col span={18} className={cls.name2}>{ `${item.myNum}. ${_t(item.name)}` }</Col>
                            <Col span={6}>
                              <Row align={'middle'} justify={'end'} className={type == 'rise' ? cls.rise : cls.decline}>
                                <img src={type == 'rise' ? up : down} style={{marginRight: 5, height:17, width: 23}} />
                                { Math.round(Math.abs(item.percent)*100) }%
                              </Row>
                            </Col>
                          </Row>
                        }
                      </div>
                    ))
                  }
                </div>
                <Row justify={'center'} className={cls.empty}>
                  { _.isEmpty(data) ? _t('暂无数据') : '' }
                </Row>
              </div>
          </div>
        </GradientsBorder>
      </Spin>
    </div>
  )
})
