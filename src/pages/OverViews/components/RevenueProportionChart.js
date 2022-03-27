import React, { useState } from 'react';
import { useMount, useUnmount, useUpdateEffect } from 'ahooks';
import { Row, Col, message } from 'antd'
import cls from './css/RevenueProportionChart.less'
import { useLoading, useI18n, addSymbol } from "@/utils";
import { CircleDot } from "@/components/CircleDot";
import { GradientsBorder } from "@/components/GradientsBorder";
import overview from '@/stores/overview'
import { observer } from 'mobx-react';
import _ from 'underscore';
import quadril from '@/assets/svg/quadril.svg';
import quadril_2 from '@/assets/svg/quadril_2.svg';
import session from '@/stores/session'
import * as echarts from 'echarts';

let myChart = null

export const RevenueProportionChart = observer(({type})=>{
  const _t = useI18n()
  const [data, setData] = useState({})
//   const [ratio, setRatio] = useState(0)

  useMount(() => {
    window.addEventListener('resize', handleReSize)
    getOverViewRevenueProportion()
  })

  useUnmount(() => {
    window.removeEventListener('resize', handleReSize)
  })

  useUpdateEffect(() => {
    getOverViewRevenueProportion()
  },[session.operatorIds, session.updateTime])

  const getOverViewRevenueProportion = async() => {
    let res = await overview.getOverViewRevenueProportion()
    if(res.code) return message.error(res.message)
    // res.record.amount_unionAmount = 100000
    // res.record.unionAmount = 50000
    let { amount_unionAmount, unionAmount } = res.record
    amount_unionAmount = parseInt(amount_unionAmount)
    unionAmount = parseInt(unionAmount)
    setData(res.record)

    let isHalf = amount_unionAmount == 0 && unionAmount == 0
    drawCharts( isHalf ? 50: parseInt(amount_unionAmount*100/(amount_unionAmount+unionAmount)))
  }

  const drawCharts = (rat) => {
    let id = document.getElementById('pie')
    if(_.isEmpty(id)) return
    myChart = echarts.init(id)
    myChart.setOption(myOption({data: rat}))
  }

  const handleReSize = (e) => {
    if(myChart) myChart.resize()
  }

  return (
    <div className={cls.container}>
      <Row className={cls.title}>{ _t('营收占比') }</Row>
      <Row style={{height: 300}}>
        <Col span={16} className={cls.charts}>
          <div id="pie" style={{height:'100%',width: '100%'}}></div>
        </Col>
        <Col offset={1} className={cls.right}>
          <GradientsBorder>
            <div className={cls.content}>
              <div>
                <Col style={{width:100}}><CircleDot text={_t('互联互通')} color={'#1DD0E7'} /></Col>
                <Col className={cls.number}>{ addSymbol(data.unionAmount, '￥') }</Col>
              </div>

              <div style={{marginTop: 20}}>
                <Col style={{width:100}}><CircleDot text={_t('自营')} color={'#1F95F0'} /></Col>
                <Col className={cls.number}>{ addSymbol(data.amount_unionAmount, '￥') }</Col>
              </div>
            </div>
          </GradientsBorder>
        </Col>
      </Row>
    </div>
  )
})


const myOption = ({data}) => {
  return {
    series: [{
            type: 'pie',
            "center": ["50%", "50%"],
            "radius": ["50%", "65%"],
            "hoverAnimation": false,
            startAngle: -180,
            clockwise: false,
            labelLine: {
                show: false
            },
            data: [{
                    "name": "",
                    "value": data > 100 ? 100 : data,
                    "label": {
                        "show": false,
                        "position": "center",
                        "formatter": function(o) {
                            return ['{a|' + data + '}{b|%}',
                                '{c|完成比}'
                            ].join('\n')
                        },
                    },
                    itemStyle: {
                        color: '#0077FF '
                    },
                },
            ]
        },
        {
            type: 'pie',
            "center": ["50%", "50%"],
            "radius": ["55%", "80%"],
            "hoverAnimation": false,
            startAngle: -180,
            clockwise: false,
            labelLine: {
                show: false
            },
            itemStyle: {
                color: 'rgba(0,0,0,0)'
            },
            emphasis: {
                label: {
                    borderColor: 'rgb(0 2 69)'
                }
            },
            data: [{
                    name: '',
                    value: data / 2,
                },
                { //画中间的图标
                    "name": "",
                    "value": 0,
                    itemStyle: {
                        color: '#fff'
                    },
                    "label": {
                        position: 'inside',
                        formatter: function() {
                            return '{a|自}'
                        },
                        rich: {
                            a: {
                                color: '#fff',
                                fontSize: 14,
                                width: 32,
                                height: 32,
                                borderRadius: 21,
                                borderWidth: 4,
                                borderColor: 'rgb(0 2 69)',
                                fontWeight: 100,
                                backgroundColor: '#0077FF',
                            }
                        }
                    },
                },
                { //画剩余的刻度圆环
                    "name": "",
                    "value": 100 - data / 2,
                    itemStyle: {
                        color: 'rgba(0,0,0,0)'
                    },
                    "label": {
                        show: false
                    }
                }
            ]
        },
        //互de 半圆的线
        {
            type: 'pie',
            "center": ["50%", "50%"],
            "radius": ["45%", "70%"],
            "hoverAnimation": false,
            startAngle: -180,
            clockwise: false,
            labelLine: {
                show: false
            },
            data: [{
                    name: '',
                    value: data * 1,
                    itemStyle: {
                        color: 'rgba(0,0,0,0)'
                    },
                },
                {
                    name: '',
                    value: (100 - data) * .5,
                    itemStyle: {
                        color: '#00FFF6'
                    },
                },
                { //画中间的图标
                    "name": "",
                    "value": 0,
                    itemStyle: {
                        color: 'rgba(0,0,0,0)'
                    },
                },
                { //画剩余的刻度圆环
                    "name": "",
                    "value": 100 - data - (100 - data) * .5,
                    itemStyle: {
                        color: '#00FFF6'
                    },
                    "label": {
                        show: false
                    }
                }
            ]
        },
        //互的中心圆
        {
            type: 'pie',
            "center": ["50%", "50%"],
            "radius": ["50%", "90%"],
            "hoverAnimation": false,
            startAngle: -180,
            clockwise: false,
            labelLine: {
                show: false
            },
            data: [{
                    name: '',
                    value: data,
                    itemStyle: {
                        color: 'rgba(0,0,0,0)'
                    },
                },
                {
                    name: '',
                    value: (100 - data) * .5,
                    itemStyle: {
                        color: 'rgba(0,0,0,0)'
                    },
                },
                { //画中间的图标
                    "name": "",
                    "value": 0,
                    itemStyle: {
                        color: '#fff'
                    },
                    "label": {
                        position: 'inside',
                        formatter: function() {
                            return '{a|互}'
                        },
                        rich: {
                            a: {
                                color: '#187186',
                                fontSize: 14,
                                width: 32,
                                height: 32,
                                borderRadius: 21,
                                fontWeight: 100,
                                borderWidth: 4,
                                borderColor: 'rgb(0 2 69)',
                                backgroundColor: '#00FFF6',
                            }
                        }
                    }
                },
                { //画剩余的刻度圆环
                    "name": "",
                    "value": 100 - data - (100 - data) * .5,
                    itemStyle: {
                        color: 'rgba(0,0,0,0)'
                    },
                    "label": {
                        show: false
                    }
                }
            ]
        },
        //互的label线
        {
            type: 'pie',
            "center": ["50%", "50%"],
            "radius": ["80%", "80%"],
            "hoverAnimation": false,
            startAngle: -180,
            clockwise: false,
            labelLine: {
                show: false
            },
            data: [{
                    name: '',
                    value: data,
                    itemStyle: {
                        color: 'rgba(0,0,0,0)'
                    },
                },
                {
                    name: '',
                    value: (100 - data) * .5,
                    itemStyle: {
                        color: 'rgba(0,0,0,0)'
                    },
                },
                { //画中间的图标
                    "name": "",
                    "value": 0,
                    itemStyle: {
                        color: 'rgba(0,0,0,0)'
                    },
                    "label": {
                        fontWeight: 'normal',
                        color: '#fff',
                        formatter: function() {
                            return (100 - data) + '%'
                        }
                    },
                    labelLine: {
                        show: true,
                        length: 0,
                        length2: 30,
                        lineStyle: {
                            color: '#152379'
                        }
                    }
                },
                { //画剩余的刻度圆环
                    "name": "",
                    "value": 100 - data - (100 - data) * .5,
                    itemStyle: {
                        color: 'rgba(0,0,0,0)'
                    },
                    "label": {
                        show: false
                    }
                }
            ]
        },
        //自的label线
        {
            type: 'pie',
            "center": ["50%", "50%"],
            "radius": ["20%", "88%"],
            "hoverAnimation": false,
            startAngle: -180,
            clockwise: false,
            labelLine: {
                show: false
            },
            itemStyle: {
                color: 'rgba(0,0,0,0)'
            },
            emphasis: {
                label: {
                    borderColor: 'rgb(0 2 69)'
                }
            },
            data: [{
                    name: '',
                    value: data / 2,
                },
                {
                  name: '',
                  itemStyle: {
                      color: 'rgba(0,0,0,0)'
                  },
                },
                { //画中间的图标
                    "name": "",
                    "value": 0,
                    itemStyle: {
                        color: '#fff'
                    },
                    "label": {
                        fontWeight: 'normal',
                        color: '#fff',
                        formatter: function() {
                            return (data) + '%'
                        }
                    },
                    labelLine: {
                        show: true,
                        length: 10,
                        length2: 30,
                        lineStyle: {
                            color: '#152379'
                        }
                    }
                },
                { //画剩余的刻度圆环
                    "name": "",
                    "value": 100 - data / 2,
                    itemStyle: {
                        color: 'rgba(0,0,0,0)'
                    },
                    "label": {
                        show: false
                    }
                }
            ]
        },
    ]
  }
}