import React, { useState } from 'react';
import { useMount, useUnmount, useUpdateEffect } from 'ahooks';
import { Row, Col, message, Spin, Select } from 'antd'
import cls from './css/ProvinceMap.less'
import { addSymbol, useLoading, useI18n, formatPercent, formatMoney } from "@/utils";
import overview from '@/stores/overview';
import { observer } from 'mobx-react';
import * as echarts from 'echarts';
import _ from 'lodash'
import mapJson from '@/utils/provinceJson/provinceConf'
import ico_jt01 from '@/assets/image/ico_jt01.png'
import ico_dw from '@/assets/image/ico_dw.png'
import session from '@/stores/session'

const { Option } = Select

let myChart = null

export const ProvinceMap = observer(()=>{
  const _t = useI18n()
  const [provinceList, setProvinceList] = useState([])
  const [code, setCode] = useState('')
  const [showIcon, setShowIcon] = useState(false)
  const [right, setRight] = useState(0)

  const myDidMount = async() => {
    if(!_.isEmpty(myChart)){
        myChart.clear() // 清除绘画内容 解决缩放后 切换省份 map不见了
    }

    const rt = await overview.findProvinceList()
    console.log(rt, '当前用户有站点的省份list')
    setProvinceList(rt.records)

    if(!_.isEmpty(rt.records)){
        setCode(rt.records[0].code)
    }
  }

  useMount(() => {
    window.addEventListener('resize', handleReSize)
    myDidMount()
  })

  useUpdateEffect(() => {
    myDidMount()
  },[session.operatorIds, session.updateTime])

  useUpdateEffect(() => {
    handleDrawMap()
  },[code, session.updateTime])

  useUnmount(() => {
    window.removeEventListener('resize', handleReSize)
  })

  const handleDrawMap = async() => {
    const rt = await overview.getStationHeatMap(code)
    console.log(rt,'地图所有站点data')
    let elm = document.getElementById('main')
    if(!_.isElement(elm)) return
    myChart = echarts.init(elm)
    echarts.registerMap('map', mapJson[code]);

    let mapMax = Math.max.apply(null, rt.records.map(item => item.amount))
    let mapMin = Math.min.apply(null, rt.records.map(item => item.amount))
    
    let markPointData = []
    let areaData = []
    // areaData 数据结构 [[long,lat, amount],[...]]   amount相差太大 低热力渲染不出
    rt.records.map((r,i) => {
        let araeItem = [r.longitude2, r.latitude2, r.amount]
        areaData.push(...new Array(3).fill(araeItem)) // 扩大热力图效果

        r.myMax = mapMax    // 用来计算icon位置
        markPointData.push(r)
    })

    myChart.setOption(myOption({areaData, markPointData, mapMax, mapMin}))

    myChart.on('click', function (params) {
        if(!_.isEmpty(params.data)){
            let { amount, myMax } = params.data
            console.log(amount, myMax)
            setRight(parseInt(amount*100/myMax))
            setShowIcon(true)
            return
        }
        setShowIcon(false)
    })
  }

  const handleReSize = (e) => {
    if(myChart) myChart.resize()
  }

  const handleClickProvince = (code) => {
    console.log(code)
    myChart.clear()
    setCode(code)
  }

  return (
    <div className={cls.container}>
      {/* <Spin spinning={ useLoading(`overview/${type}`) }> */}
        <div className={cls.content}>
            <div>
                <Select defaultValue={code} key={code} className={cls.region} suffixIcon={<img src={ico_jt01} />} onSelect={value=>handleClickProvince(value)}>
                    {provinceList.map(r=><Option key={'code'+r.code} value={r.code}>{r.name}</Option>)}
                </Select>
            </div>
            <Row justify={'center'} className={cls.progressCont}>
                <div className={cls.left}>
                    <div className={cls.triangle_left}></div>
                    <div className={cls.text}>{ _t('高营收') }</div>
                </div>
                <div className={cls.progress}>
                    { showIcon ? <img src={ico_dw} className={cls.dwIcon} style={{right: `${right}%`}} /> : null }
                </div>
                <div className={cls.right}>
                    <div className={cls.triangle_right}></div>
                    <div className={cls.text}>{ _t('低营收') }</div>
                </div>
            </Row>
            <div id="main" className={cls.main}></div>
        </div>
      {/* </Spin> */}
    </div>
  )
})

const myOption = ({areaData, markPointData, mapMax, mapMin}) => {
    return {
        // backgroundColor: '#ccc',
        tooltip: {
            show: true,
            trigger: 'item',
            triggerOn: 'click',
            backgroundColor: 'rgba(255,255,255,0.95)',
            className: 'box',
            formatter: function (params) {
                let { amount, percent, name } = params.data
                return (
                    `<div style="color: black">
                        <div>· ￥${ formatMoney(amount) }</div>
                        <div>· 营收占比 : \xa0\xa0 ${ formatPercent(percent,2) }</div>
                        <div>· ${ name || '' }</div>
                    </div>`
                )
            }
        },
        visualMap: {
            show: false,
            color: ['#FF4D1A', '#F6DF23', '#21FFD9', '#30BFF0'],
            min: mapMin,
            max: mapMax,
            calculable: true,
            textStyle: {
                color: '#fff',
                fontSize: 12
            }
        },
        grid: {
            height: '100%',
            width: '100%'
        },
        geo: {
            map: 'map',
            label: {
                show: true
            },
            roam: true,
            aspectScale: 1,
            zoom: 1.1,
            label: {
                normal: {
                    show: true,
                    color: '#fff'
                },
                emphasis: {
                    color: '#fff'
                }
            },
            itemStyle: {
                normal: {
                    areaColor: '#050511',
                    borderColor: '#eee',
                    shadowColor: '#135DBC',
                    shadowBlur: 10,
                    borderWidth: 1
                },
                emphasis: {
                    // 鼠标移入颜色
                    areaColor: '#050511',
                    borderWidth: 0
                }
            }
        },
        series: [
            {
                mapType: 'map',
                top: 'center',
                left: 'center',
                name: 'AQI',
                type: 'heatmap',
                coordinateSystem: 'geo',
                // blurSize: 40,
                data: areaData,
                markPoint: {
                    // 前面得加 image://
                    symbol: 'image://data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB0AAAAdCAYAAAEhlFeZAAAABGdBTUEAALGPC/xhBQAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAHaADAAQAAAABAAAAHQAAAAD9szRrAAAEI0lEQVRIDbVWTWhcVRQ+585Ux5SZpIlBlKDSGqFR2ybtQtBNNFZELaXS0dAkIFRx1XbhQhddlG66k2xcZGcmpiZiINSViRgo3Ui0f1gh0VKSIi0lPzMxTWIy73juve/e3PvmvYkt+OC9e893vvPzzv0FCB8q5CZlF+WH+rMkW/kI3cR8qZC9ZmFjLwGh7elJ4yf0gSOWLjuuvQ5byD0HRNMeC7EZu0t/aBehEnuWUL6KGGJpJWRTO2CpvGACKyyTrvM8binwv7zNya3J1pAr6mIVnIegQt1hFzB9iXPm5SEJ2IwRxzShPITUX/saQPCjAhDf4f//XivF69VjSpZymcEGZZES9TaEdqG/1J8748q6bCFCX9fuhHLwp0vw+imxC48VbxrMGnsl3tReAoJXjGhak5YaRK7qZaMI2zVFSG/rBMQf1OsQDF/PAIB1Rye7j/JQrWPn/CzP3Z+5fAcjesVPTluIDgiC8YiREk3a1lii9NOzGbg9d5//08O1BaNNDTXYfmtVyVt9YovoGFVECKP3MufdkHeBI56MRvQMuUDXObEXHcebXYTr2L20xwDWkGfNHP9tvVHEtziPPSU1/fTYDuROJRh96DugelJcs8EE9IVPYCmTfoZrfLwCD7lmQvh6TLVjfmGG18ZyOJuu+AQAvVV4KJ7E7sUJCfFm8yZN7t8GN6b+8SgsxESkXjmGNNz0mCLHGEk8xlDRAfO3V3h4NrRU+dWGQhyNqtjoLo9pKopDyN0cx0L2ChP3VhBdAOEqT4J9ErKpKgBRTrX4h3XGSBJsRJfN2xunHgxrTOSxp/itq6/a58pelG9V0sMoY1M1jvTgT38MSKe5cE8YPLFF4JHAs9DS3IcHfoluT9YsNigN7ngVNsqjCYvGGlfv4DyI1CHsWrgU5XlBafiFR2B1Rq6H3VFivIy8U1NrvM6iv0Pm6X2Y/80uFzuF6MJTNbA6+xdT/0tAdsRHGcKEdZ3c2S39Kv8hxwaFxb+/5Kz1mZjkALEIIr2Hd/gWaGwrMf+TJKqPs1/lX6POTkJv+URPCgBFJ3YXw3XAi6V9Qq75GsOi0cezUFq7mLxSN/07QSFp47gHAs/zYfgyFWoPAAVlyGR6MX/vjg1YyH0FxbUeIye01r8TVAzyiv40xqARAjqhcXl9xEkO+LmUaaD2Iz5k+zghra76lf71Y2cvESEM5K5yeV4yythW4DFI4RRs0AQH2x7LiYJ8AkJXaS8iquxsUMPjk/Ab/of3jey1CCu8+GdZ/7yHVxVwiE/ND1xKRVCppJFsAyzzjYiozSU/UB/xV9hOB/HIEh/n/hMb1KXQ+bpW2Ag+41Te49JXHjaGjFDm8f4O0uIcdi5Gr3eGpdotg3psFviG2sE31DGLp8QbfCMdt/L/1ZFXc3W4qyv6g0f5F90/d39CgCaLAAAAAElFTkSuQmCC',
                    symbolSize: 26,
                    symbolOffset: ['0', '-40%'],
                    label: {
                        normal: {
                            show: true,
                        },
                        emphasis: {
                            show: true,
                        }
                    },
                    itemStyle: {
                        normal: {
                            color: 'rgba(72,150,128,1)'
                        }
                    },
                    data: markPointData
                }
            },
        ]
    } 
}