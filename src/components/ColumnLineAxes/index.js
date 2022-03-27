import React, { useState, useEffect } from 'react';
import { DualAxes } from '@ant-design/charts';
import _ from 'lodash'

/**
 *  还是废弃吧  可能每个页面配置不一样 写起来复杂
 */
export const ColumnLineAxes = (props) => {
  const data = [
    {
      time: '2019-03',
      value: 350,
      count: 800,
    },
    {
      time: '2019-04',
      value: 900,
      count: 600,
    },
    {
      time: '2019-05',
      value: 300,
      count: 400,
    },
    {
      time: '2019-06',
      value: 450,
      count: 380,
    },
    {
      time: '2019-07',
      value: 70,
      count: 220,
    },
    {
      time: '2019-08',
      value: 170,
      count: 110,
    },
    {
      time: '2019-09',
      value: 270,
      count: 20,
    },
    {
      time: '2019-10',
      value: 370,
      count: 720,
    },
    {
      time: '2019-11',
      value: 570,
      count: 520,
    },
    {
      time: '2019-12',
      value: 40,
      count: 220,
    },
    {
      time: '2019-13',
      value: 50,
      count: 10,
    },
    {
      time: '2019-14',
      value: 60,
      count: 420,
    },
    {
      time: '2019-15',
      value: 470,
      count: 320,
    },
  ];
  const config = {
    data: [data, data],
    // autoFit: true,
    xField: 'time',
    yField: ['value', 'count'],
    height: 400,
    padding: [20,30,30,40],
    legend: false,
    meta: {
      value: {
        alias: '充电电量',
        formatter: (v) => `${v} kW·h`
      },
      count: {
        alias: '营收',
        formatter: (v) => ` ¥ ${v}`
      },
    },
    tooltip: {
      // customContent: (title, data) => (
      //   <div>
      //     { !_.isEmpty(data) ?
      //       <div>
      //         <div>{data[0].data.time}</div>
      //         <div>{data[0].data.value}</div>
      //         <div>{data[0].data.count}</div>
      //       </div>
      //       : null
      //     }
      //   </div>
      // )
    },
    geometryOptions: [
      {
        geometry: 'column',
        color:'#61A5E8',
      },
      {
        geometry: 'line',
        color: '#7ECF51',
        lineStyle: {
          lineWidth: 3,
          // lineDash: [6, 2],
          stroke: '#7ECF51',
        },
        point: {
          size: 7,
          style: {
            fill: '#7ECF51',
            stroke: '#7ECF51',
          },
        },
      },
    ],
  };
  return <DualAxes {...config} />
};
