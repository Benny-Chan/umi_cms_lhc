import React, { useState, useEffect,useRef } from 'react';
import { Pie } from '@ant-design/charts';
import _ from 'lodash'
import {observer} from "mobx-react/dist/index";
import dataState from '@/stores/operator';
import { useI18n } from "@/utils";
import { Row, Col, Form, Button,Spin } from 'antd'
import {_t} from "../../utils";
import {CircleDot} from "../CircleDot";
const colorConfig = ['#0070FF', '#FFD050', '#D1E6FD','#FF6479','#657797'];
export const SpiderPieChart = React.forwardRef(({pieData},ref)=> {
  const _t = useI18n()
      // console.log("pieData",JSON.stringify(pieData))
    const config = {
        height: 450,
        data:pieData,
        angleField: 'value',
        colorField: 'label',
        radius: 0.8,
        color: ['#0070FF', '#FFD050', '#D1E6FD','#FF6479','#657797'],
        label: {
            type: 'spider',
            content: '{name}: {percentage}',
        },
        pieStyle: {
            lineWidth: 0
        },
        legend: {
            marker: {
                symbol: 'square',
            },
          },
      tooltip: {
        customContent: (title, data) => {
          return(
            <div style={{padding:4,borderRadius:4,minWidth:200}}>
              {!_.isEmpty(data)&&
              <Row style={{marginBottom:8,marginTop:8}}><Col style={{marginLeft:16}}> <CircleDot fontSize={12} color={data[0].color} /></Col><Col style={{marginLeft:16}}>{data[0].name}&nbsp;:</Col><Col style={{marginLeft:16}}>{`${data[0].value?(data[0].value*100).toFixed(2):0} %`}</Col></Row>
              }
            </div>
          )
        }
      },
    };
    return<><Pie {...config} chartRef={ref}  /></> ;
})
