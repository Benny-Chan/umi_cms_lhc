import React from 'react'
import { useI18n, chartHoverUI_2 } from "@/utils";
import { Area } from '@ant-design/charts';

export const RegisterNumberChart = (props) => {
    const _t = useI18n()

    const config = {
        title: {
          visible: false,
        },
        data: props.data || [],
        smooth: true,
        tooltip: {
        //   visible: true,
        //   fields: ['num', 'date'],
        //   formatter: (item) => {
        //       return { name: item.date, value: item.num}
        //   },
        //   domStyles: {
        //       'g2-tooltip-title': {display: 'none'}
        //   }
            customContent: (name,v) => {
                if(_.isEmpty(v)) return ''
                return chartHoverUI_2({ data: { name: v[0].data.date, value: _t('新注册人数 {0}人',[v[0].data.num]) }})
            },
        },
        xField: 'date',
        yField: 'num',
    }
    return (
        <Area {...config} />
    )
}