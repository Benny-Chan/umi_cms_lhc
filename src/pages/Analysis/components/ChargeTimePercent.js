import React, { useState, useEffect } from 'react'
import { Row, Col, Spin } from 'antd'
import cls from './css/ChargeTimePercent.less'
import { RingGraph } from '../../../components/RingGraph'
import { CircleDot } from '../../../components/CircleDot'
import { useI18n, useLoading, formatAccuracy } from "@/utils";
import analysis from '@/stores/analysis'
import { observer } from 'mobx-react';
import session from '@/stores/session'

const tagsText = [
    { name: '今日', type: 1 },
    { name: '本周', type: 2 },
    { name: '本月', type: 3 },
]

export const ChargeTimePercent = observer((props) => {
    const _t = useI18n()
    const [activeTag, setActiveTag] = useState(1)
    const [phaseData, setPhaseData] = useState([])
    const [totalPower, setTotalPower] = useState(0)

    useEffect(() => {
        getAnalysisChargePhaseRatio()
    },[activeTag, session.operatorIds, session.updateTime])

    const handleClickTag = (item) => {
        setActiveTag(item.type)
    }

    const getAnalysisChargePhaseRatio = async() => {
        let params = { queryType: activeTag }
        console.log(params)
        const res = await analysis.getAnalysisChargePhaseRatio(params)
        if(res.code) return message.error(res.message)
        const {
            phasePower1, phasePower1Rate,
            phasePower2, phasePower2Rate,
            phasePower3, phasePower3Rate,
          otherPhaseRate,otherPhasePower,
            totalPower
         } = res.record

        setTotalPower(totalPower)
        setPhaseData([
            { type: '峰段', color: '#006BFF', value: formatAccuracy(phasePower1), percent: phasePower1Rate?((phasePower1Rate*100).toFixed(2)):0 },
            { type: '平段', color: '#D1E6FD', value: formatAccuracy(phasePower2), percent: phasePower2Rate?((phasePower2Rate*100).toFixed(2)):0  },
            { type: '谷段', color: '#00E4E1', value: formatAccuracy(phasePower3), percent: phasePower3Rate?((phasePower3Rate*100).toFixed(2)):0  },
          { type: '其他时段', color: '#FFD050', value: formatAccuracy(otherPhasePower), percent:otherPhaseRate?((otherPhaseRate*100).toFixed(2)):0  },
        ])
    }

    const centerText = `<div>${ _t('总充电量') }: ${ formatAccuracy(totalPower) }${ _t('度') }</div>`;

    return (
        <div className={cls.container}>
            <div className={cls.title}>{ _t('充电时段占比') }</div>

            <div className={cls.margin}>
                <Row>
                    <Row className={cls.tags}>
                        {
                            tagsText.map((item, index) => (
                                <Col
                                    key={'tag'+index}
                                    onClick={() => { handleClickTag(item) }}
                                    className={cls.tagsItem}
                                    style={item.type == activeTag ? {color: '#0070FF', backgroundColor: '#fff'}: {}}
                                >
                                    { _t(item.name) }
                                </Col>
                            ))
                        }
                    </Row>
                </Row>

                <Spin spinning={ useLoading('analysis/chargePhaseRatio') }>
                    <Row style={{marginTop: 60, marginBottom: 25}}>
                        <Col xs={24} lg={12} style={{marginBottom:20}}>
                            <RingGraph data={phaseData} centerText={centerText} />
                        </Col>
                        <Col xs={24} lg={11} className={cls.detail}>
                            {
                                phaseData.map((item,index) => (
                                    <Row key={'kwh'+index} justify="space-between" style={{color: '#798196', marginTop: index > 0 ? 25 : 0}}>
                                        <Col span={7} style={{color: '#798196'}}>
                                            <CircleDot text={item.type} color={item.color} />
                                        </Col>
                                        <Col span={5} style={{textAlign:'end'}}>{ item.percent }%</Col>
                                        <Col flex={1} style={{textAlign:'end',color: '#000'}}>{ item.value } kW·h</Col>
                                    </Row>
                                ))
                            }
                        </Col>
                    </Row>
                </Spin>
            </div>
        </div>
    )
})
