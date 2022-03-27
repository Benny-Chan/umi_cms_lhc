import React from 'react'
import { useI18n, chartHoverUI_2 } from "@/utils";
import { Area } from '@ant-design/charts';

export const UserLivenessChart = (props) => {
    const _t = useI18n()

    const config = {
        title: {
          visible: false,
        },
        data: props.data || [],
        smooth: true,
        tooltip: {
        //   visible: true,
        //   fields: ['myRate', 'date'],
        //   formatter: (item) => {
        //       return { name: item.date, value: item.myRate}
        //   },
        //   domStyles: {
        //       'g2-tooltip-title': {display: 'none'}
        //   }
            customContent: (name,v) => {
                if(_.isEmpty(v)) return ''
                return chartHoverUI_2({ width: 170,  data: { name: v[0].data.date, value: _t('活跃人数 {0}人',[v[0].data.num]), value_2: v[0].data.myRate+'%' }})
            },
        },
        xField: 'date',
        yField: 'myRate',
    }
    return (
        <Area {...config} />
    )
}