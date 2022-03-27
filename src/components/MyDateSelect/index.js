import React, { useState, useEffect } from 'react';
import { Row, Col, Select } from 'antd'
import moment from 'moment'

const { Option } = Select;

const yearList = [
  { text: '2015 年', value: '2015' },
  { text: '2016 年', value: '2016' },
  { text: '2017 年', value: '2017' },
  { text: '2020 年', value: '2020' },
]

/**
 * props.column 
 * 1显示年 2显示年月 3显示年月周
 */
export const MyDateSelect = (props) => {
  const { onChange, column } = props
  const [yearMonthWeek, setYearMonthWeek] = useState({
    year: '',
    month: '',
    week: ''
  })
  const [date, setDate] = useState({
    months: [],
    weeks: []
  })

  const handleSelectYear = (year) => {
    let m = moment()._locale._monthsShort.map((item,i)=> {
      return { text: item, value: i+1 }
    })
    setDate({...date, months: m, weeks: []})
    setYearMonthWeek({year, month: '', week: ''})
  }

  const handleSelectMonth = (month) => {
    let w = []
    let days = new Date(yearMonthWeek.year, month, 0).getDate()
    for(let i = 0; i< Math.ceil(days/7); i++){
      w.push({ text: `第${i+1}周`, value: i+1})
    }
    setDate({...date, weeks: w })
    setYearMonthWeek({...yearMonthWeek, month, week: ''})
    if(onChange){
      let ymw = {...yearMonthWeek, month }
      delete ymw.week
      onChange(ymw)
    }
  }

  const handleSelectDay = (week) => {
    setYearMonthWeek({...yearMonthWeek, week})
    if(onChange){
      onChange({...yearMonthWeek, week})
    }
  }

  return (
    <div>
      <Row gutter={8}>
        <Col span={8}>
          <Select 
              placeholder={'请选择'}
              style={{flex:1, textAlign: 'center'}}
              onChange={(e)=> { handleSelectYear(e) }}
              value={yearMonthWeek.year || null}
              hidden={!(column >= 1)}
          >
            {
              yearList.map((item,index) => (
                <Option key={'year'+index} value={item.value}>{ item.text }</Option>
              ))
            }
          </Select>
        </Col>
        
        <Col span={8}>
          <Select 
              placeholder={'请选择'}
              style={{flex:1, textAlign: 'center'}}
              onChange={(e)=> { handleSelectMonth(e) }}
              value={yearMonthWeek.month || null}
              hidden={!(column >= 2)}

          >
            {
              date.months.map((item,index) => (
                <Option key={'month'+index+1} value={item.value}>{ item.text }</Option>
              ))
            }
          </Select>
        </Col>
        
        <Col span={8}>
          <Select 
              placeholder={'请选择'}
              style={{flex:1, textAlign: 'center'}}
              onChange={(e)=> { handleSelectDay(e) }}
              value={yearMonthWeek.week || null}
              hidden={!(column >= 3)}
          >
            {
              date.weeks.map((item,index) => (
                <Option key={'week'+index} value={item.value}>{ item.text }</Option>
              ))
            }
          </Select>
        </Col>
        
      </Row>
    </div>
  )
}
