import React, { useState, useEffect } from 'react'
import { Row, Col } from 'antd'
import cls from './css/SiteProfitRankingList.less'
import { addSymbol } from '@/utils'

export const SiteProfitRankingList = (props) => {

    const data = props.data || []

    return (
        <div className={cls.container}>
            {
                data.map((item, index) => (
                    <Row key={'siteName'+index} align="middle" className={index > 0 ? cls.site : ''}>
                        <Col className={cls.ranking}>
                            <Row justify={'center'} className={index < 3 ? cls.frontBlack : cls.frontGrey}>{ index + 1 }</Row>
                        </Col>
                        <Col className={cls.name} span={13}>
                            { item.name }
                        </Col>
                        <Col flex={1} className={cls.amount}>
                            <Row justify={'end'}>{ addSymbol(item.amount, '¥') }</Row>
                        </Col>
                    </Row>
                ))
            }
        </div>
    )
}