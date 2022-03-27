import React, { useState, useEffect } from 'react';
import { Pie } from '@ant-design/charts';
import _ from 'lodash'

export const RingGraph = (props) => {
    const config = {
        width: props.size || 250,
        height: props.size || 250,
        data: props.data || [],
        radius: 1,
        innerRadius: 0.8,
        angleField: 'value',
        colorField: 'type',
        color: !_.isEmpty(props.data) ? props.data.map(item => item.color) : null,
        statistic: {
            title: false,
            content: { 
                formatter: () => props.centerText || null,
                style:{
                    fontSize: 16,
                } 
            },
        },
        tooltip: {
            visible: true,
            fields: ['type', 'percent', 'value'],
            offset: 20,
            formatter: (params) => {
                return { name: params.type, value: params.value}
            },
            domStyles: {
                'g2-tooltip-title': {display: 'none'}
            }
        },
        legend: false,
        meta: {
            value: {
                alias: '',
                formatter:(v) => null     // 每个扇形外径的内容
            }
        },
        pieStyle: {
            lineWidth: 1
        }
    };
    return <Pie {...config} />;
}
