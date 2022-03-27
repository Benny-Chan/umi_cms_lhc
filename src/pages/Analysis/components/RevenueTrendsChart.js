import React from 'react'
import { useI18n, chartHoverUI_2, addSymbol } from "@/utils";
import { Area } from '@ant-design/charts';

export const RevenueTrendsChart = (props) => {
    const _t = useI18n()
    
    const config = {
        title: {
          visible: false,
        },
        data: props.data || [],
        smooth: true,
        tooltip: {
        //   visible: true,
        //   fields: ['_id', 'amount'],
        //   formatter: (item) => {
        //       return { name: item._id, value: '¥'+item.amount}
        //   },
        //   domStyles: {
        //       'g2-tooltip-title': {display: 'none'}
        //   }
            customContent: (name,v) => {
                if(_.isEmpty(v)) return ''
                return chartHoverUI_2({ data: { name: v[0].data._id, value: addSymbol(v[0].data.amount*100,'¥') }})
            },
        },
        xField: '_id',
        yField: 'amount',
    }
    return (
        <Area {...config} />
    )
}