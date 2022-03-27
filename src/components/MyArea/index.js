import React, { useState, useEffect } from 'react';
import { Area } from '@ant-design/charts';

/**
 *  UI设定区域图较小的话 传small=true 控制x轴间隔  see --> tickCount()
 */
export const MyArea = (props) => {
    let data = props.data || [];
    
    // 多条数据的情况  小的区域图  x轴的count除以3  大的除以2
    const tickCount = () => {
      if(props.small && data.length>12){
        return data.length/3
      }else if(data.length>12){
        return data.length/2
      }
      return data.length
    }

    const config = {
      title: {
        visible: false,
        // text: '',
      },
      data,
      smooth: true,   // 曲线平滑过渡
      tooltip: {
        visible: true,
        fields: ['xField', 'yField'],
        formatter: (params) => {
            return { name: params.xField, value: params.yField}
        },
        domStyles: {
            'g2-tooltip-title': {display: 'none'}
        }
    },
      areaStyle: props.areaStyle || {},       // 不传值默认配置
      line: props.line || {},                 // 控制区域图的线条显示
      xField: 'xField',
      yField: 'yField',
      xAxis: {
        tickCount: tickCount(),
      },
    };
    
    return <Area {...config} />;
};