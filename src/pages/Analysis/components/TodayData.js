import React, { useState, useEffect } from 'react'
import { Row, Col, message, Spin, Tooltip } from 'antd'
import { CaretDownOutlined, InfoCircleOutlined, CaretUpOutlined } from '@ant-design/icons';
import cls from './css/TodayData.less'
import { RingGraph } from '../../../components/RingGraph'
import { CircleDot } from '../../../components/CircleDot'
import ico_data from '@/assets/svg/ico_data.svg'
import analysis from '@/stores/analysis'
import { useI18n, useLoading, addSymbol, formatPercent, formatAccuracy } from "@/utils";
import { observer } from 'mobx-react';
import { history } from 'umi'
import session from '@/stores/session'
import operator from '@/stores/operator';
import ico_explain from '@/assets/svg/ico_explain.svg'

const dataText = {
    'todayProfit':{
        key: 1,
        titleLeft: '今日营收',
        titleRight: '订单金额',
        cumulantText: '累计总营收',
        loading: 'revenue'
    },
    'todayOrder': {
        key: 2,
        titleLeft: '今日订单量',
        titleRight: '0-24时创建的订单量(单)',
        cumulantText: '累计总订单量',
        loading: 'ordersNums'
    },
    'todayCharge': {
        key: 3,
        titleLeft: '今日充电量',
        titleRight: '0-24时产生的充电量(度)',
        cumulantText: '累计总充电量',
        loading: 'changingNums'
    },
    'chargeGunStatus': {
        key: 4,
        titleLeft: '充电枪状态',
        titleRight: '0-24时充电枪状态',
        cumulantText: '总枪数',
        loading: 'chargingStatus'
    }
}

export const TodayData = observer((props) => {
    const _t = useI18n()
    const [record, setRecord] = useState({
        titleNum: 0,
        weekPercent: 0,
        dayPercent: 0,
        cumulant: 0,
        fault: 0,
        bottom: [],
    })

    let card = dataText[props.content]

    // 用的地方比较多 先定义一下boolean
    const isProfitCard = card.key === 1;
    const isOrder = card.key === 2;
    const isChargeCard = card.key === 3;
    const isChargeGunCard = card.key === 4;

    useEffect(()=>{
        getAnalysisData()
    },[session.operatorIds, session.updateTime])

    const handleData = (rc) => {
        let obj = {}
        if(props.content == 'todayProfit'){
            obj = {
                titleNum: addSymbol(rc.amount),
                weekPercent: rc.weekPercent,
                dayPercent: rc.dayPercent,
                cumulant: addSymbol(rc.totalAmount),
                centerText: `<div><div>${ _t('电费') }: ${ ((rc.elecFee||0)/100).toFixed(2) }</div><div style="margin-top:10px">${ _t('服务费') }: ${ ((rc.servFee || 0)/100).toFixed(2) }</div></div>`,
                bottom: [
                    { type: '今日创建', color: '#006BFF', value: rc.todayCreatedAmount || 0, percent: rc.todayCreatedPercent || 0 },
                    { type: '昨日创建', color: '#FFD050', value: rc.ystCreatedAmount || 0, percent: rc.ystCreatedPercent || 0 },
                    { type: '异常挂单订单', color: '#FF6479', value: rc.errAmount || 0, percent: rc.errPercent || 0 },
                ]
            }
        }else if(props.content == 'todayOrder'){
            obj = {
                titleNum: addSymbol(rc.orderCount,'',undefined,0),
                weekPercent: rc.weekPercent,
                dayPercent: rc.dayPercent,
                cumulant: addSymbol(rc.totalOrderCount,'', undefined,0),
                fault: rc.errOrderCount || 0,
                centerText: `<div>${ _t('今日订单量') }: ${rc.orderCount || 0}</div>`,
                bottom: [
                    { type: '已支付', color: '#006BFF', value: rc.paidOrderCount || 0, percent: rc.paidOrderPercent || 0 },
                    { type: '待支付', color: '#FFD050', value: rc.pendingOrderCount || 0, percent: rc.pendingOrderPercent || 0 },
                    { type: '充电中', color: '#00E4E1', value: rc.chargingOrderCount || 0, percent: rc.chargingOrderPercent || 0 },
                ]
            }
        }else if(props.content == 'todayCharge'){
            obj = {
                titleNum: addSymbol(formatAccuracy(rc.power)*100),
                weekPercent: rc.weekPercent,
                dayPercent: rc.dayPercent,
                cumulant: addSymbol(formatAccuracy(rc.totalPower)*100),
                centerText: `<div>${ _t('今日充电量') }: ${formatAccuracy(rc.power || 0)}</div>`,
                bottom: [
                    { type: '峰段', color: '#006BFF', value: formatAccuracy(rc.phase1Power) || 0, percent: rc.phase1Percent || 0 },
                    { type: '平段', color: '#D1E6FD', value: formatAccuracy(rc.phase2Power) || 0, percent: rc.phase2Percent || 0 },
                    { type: '谷段', color: '#00E4E1', value: formatAccuracy(rc.phase3Power) || 0, percent: rc.phase3Percent || 0 },
                    { type: '其他', color: '#657797', value: formatAccuracy(rc.otherPhasePower) || 0, percent: rc.otherPhasePercent || 0 },
                ]
            }
        }else if(props.content == 'chargeGunStatus'){
            obj = {
                titleNum: addSymbol(rc.counts,'',undefined,0),
                centerText: `<div>${ _t('总枪数') }: ${addSymbol(rc.counts,'',undefined,0)}</div>`,
                bottom: [
                    { type: '充电中', color: '#006BFF', value: parseInt(rc.charging) || 0, percent: rc.chargingPercent || 0 },
                    { type: '占用中', color: '#FFD050', value: parseInt(rc.occupied) || 0, percent: rc.occupiedPercent || 0 },
                    { type: '空闲中', color: '#D1E6FD', value: parseInt(rc.free) || 0, percent: rc.freePercent || 0 },
                    { type: '故障', color: '#FF6479', value: parseInt(rc.fault) || 0, percent: rc.faultPercent || 0 },
                    { type: '离线', color: '#657797', value: parseInt(rc.offline) || 0, percent: rc.offlinePercent || 0 },
                ]
            }
        }

        return obj
    }

    const getAnalysisData = async() => {
        let params = { queryType: 1 }
        let res = {}
        if(props.content == 'todayProfit'){
            res = await analysis.getAnalysisRevenue(params)
        }else if(props.content == 'todayOrder'){
            res = await analysis.getAnalysisOrders(params)
        }else if(props.content == 'todayCharge'){
            res = await analysis.getAnalysisCharge(params)
        }else if(props.content == 'chargeGunStatus'){
            res = await analysis.getAnalysisGunStatus()
        }
        if(res.code) return message.error(_t(res.message))

        setRecord(handleData(res.record))
    }

    const handleLinkTo = async({key}) => {
      console.log("handleLinkTo",key)
       await operator.initParamsFromAnalysis(key)
        history.push({
          pathname:'/OperateData',
        })
    }

    return (
        <div className={cls.container}>
            <Spin spinning={ useLoading(`analysis/${card.loading}`) }>
                <div className={cls.content}>
                    {/* 营收 订单量 充电量 充电枪状态 */}
                    <Row justify={'space-between'} align={'middle'}>
                        <Col className={cls.titleLeft}>
                            <span>{ _t(card.titleLeft) }</span>
                        </Col>
                        <Col className={cls.titleRight}>
                            <span>{ _t(card.titleRight) }</span>
                            {
                                isProfitCard ?
                                    <Tooltip placement="bottomRight" title={_t('今日（0-24点）产生的订单金额总和，包含昨日创建今日完成的订单。')}>
                                        <a><img src={ico_explain} style={{width:12, height:12, marginLeft: 3,marginBottom: 1}} /></a>
                                    </Tooltip>
                                : null
                             }
                        </Col>
                    </Row>

                    {/* 当前总数 周同比 日环比 累计总数 / 总枪数 */}
                    {
                        !isChargeGunCard ?
                        <Row style={{paddingTop: 5}}>
                            <Col span={24}>
                                <Row align="bottom" justify="space-between">
                                    <Col>
                                        { isProfitCard ? <span className={cls.RMB_Symbol}>¥</span> : null }
                                        <span className={cls.titleNum}>{ record.titleNum }</span>
                                    </Col>
                                    <Col>
                                        { record.fault ? <div className={cls.faultOrder}>{ _t('*存在{0}单异常订单',[record.fault]) }</div> : null}
                                    </Col>
                                </Row>
                            </Col>
                            <Col span={24} style={{marginBottom: 8,marginTop: 5}}>
                                <Row justify={'space-between'} align={'middle'}>
                                    <Row>
                                        <span className={cls.cumulantText}>{ _t(card.cumulantText) }&nbsp;&nbsp;</span>
                                        <span className={cls.symbol}>{ isProfitCard && '¥'}</span>
                                        <span className={cls.cumulantNum}>{ record.cumulant }</span>
                                    </Row>
                                    <Row><a style={{marginBottom: 2}} onClick={() => { handleLinkTo(card) }}><img src={ico_data}/></a></Row>
                                </Row>
                            </Col>
                            <Col span={24}>
                                <Row justify={'space-between'} className={cls.cumulBorder}>
                                    <Col className={cls.percentText}>
                                        <span>{ _t('周环比') }</span>
                                        <span>&nbsp;{ record.weekPercent > 0 ? <CaretUpOutlined style={{color:'#FF6479'}} /> : <CaretDownOutlined style={{color:'#00E4E1'}} /> }&nbsp;</span>
                                        <span>{ formatPercent(record.weekPercent,2) }</span>
                                    </Col>
                                    <Col className={cls.percentText} hidden={!record.dayPercent}>
                                        <span>{ _t('日同比') }</span>
                                        <span>&nbsp;{ record.dayPercent > 0 ? <CaretUpOutlined style={{color:'#FF6479'}} /> : <CaretDownOutlined style={{color:'#00E4E1'}} /> }&nbsp;</span>
                                        <span>{ formatPercent(record.dayPercent,2) }</span>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                        :
                        // 充电枪状态 总枪数部分的UI
                        <Row justify={'center'} align={'middle'} style={{flexDirection:'column',marginTop: 20}}>
                            <div className={cls.titleNum}>{ record.titleNum }</div>
                            <div className={cls.allGuns}>{ _t(card.cumulantText) }</div>
                        </Row>
                    }

                    {/* 饼图 */}
                    <Row justify={'center'} style={{margin: '20px 0'}}>
                        <RingGraph data={record.bottom} centerText={record.centerText} />
                    </Row>

                    {/* 饼图下方详情 */}
                    <div className={cls.detail}>
                        {
                            !_.isEmpty(record.bottom) && record.bottom.map((item,i) => (
                                <Row key={'circle'+i} align="middle">
                                    <Col span={11}><CircleDot text={ _t(item.type) } color={item.color} /></Col>
                                    <Col span={3}>{ item.percent?(item.percent*100).toFixed(2):0 }%</Col>
                                    <Col span={10}>
                                        <Row justify={'end'}>
                                            {
                                                isProfitCard ? addSymbol(item.value,'¥')
                                                : isChargeGunCard || isOrder ? addSymbol(item.value,'',undefined,0)
                                                : addSymbol(item.value*100)
                                            }
                                        </Row>
                                    </Col>
                                </Row>
                            ))
                        }
                    </div>
                </div>
            </Spin>
        </div>
    )
})

