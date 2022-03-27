import React, { useState, useEffect } from 'react'
import { Row, Col, Form, Select, DatePicker, } from 'antd'
import cls from './css/SelectParams.less'
import { StationSelect } from '../../../components/StationSelect'
import { StatisticsDateSelect } from './StatisticsDateSelect.js'
import moment from 'moment';
const { Option } = Select;
const {RangePicker} = DatePicker


const statisticsList = [    
    { text: '自定义区间', value: '0', picker:'date'},
    { text: '日', value: '1', picker:'date'},
    { text: '周', value: '2', picker:'week'},
    { text: '月', value: '3', picker:'month'},
    { text: '年', value: '4', picker:'year'},
]

const statisticsAccurList = [
    [{ text: '日', value: 3 }],
    [
        { text: '时', value: 0 },
        { text: '峰谷平细分时段', value: 1 },
        { text: '峰谷平', value: 2 }
    ],
    [ { text: '日', value: 3 }],
    [
        { text: '日', value: 3 },
        { text: '周', value: 4 }
    ],
    [{ text: '月', value: 5 }]  
]



export const SelectParams = (props) => {
    const {form, chartType, setChartType} = props
    const [statisticsValue, setStatisticsValue] = useState(0)
    const [accurList, setAccurList] = useState([])
    const [accurValue, setAccureValue]= useState("")

    let stations = ['亦电谷站', '益力多站', '肯德基']

    const handleStatisticsSelect = (val) => {
        setStatisticsValue(val)
        let accurList = statisticsAccurList[val]
        setAccurList(accurList)
        form.setFieldsValue({
            statisticsAccur: accurList[0].value
        })        
    }
    return (
        <div className={cls.container}>
            <Row>               
                <Form.Item 
                name='stationIds'
                label={<span style={{fontWeight:'bold'}}>站点</span>}
                > 
                     <Select
                    mode="multiple"
                    allowClear
                    style={{ width: '100%' }}
                    placeholder="站点选择"
                    >   
                        {stations.map((item,index)=>(
                            <Option key={index} value="item">{item}</Option>
                        ))}
                    </Select>
                </Form.Item>
            </Row>
            <Row>
                 <Col xs={24} md={12} xl={6}>
                    <Form.Item 
                        name={'statisticsDate'}
                        label={<span style={{fontWeight:'bold'}}>对比时间</span>}
                    >
                        <Select 
                            placeholder={'请选择'}
                            onChange={(val)=>{ handleStatisticsSelect(val) }}
                        >
                            {
                                statisticsList.map((item,index) => (
                                    <Option key={item.value} value={item.value}>
                                        { item.text }
                                    </Option>
                                ))
                            }
                        </Select>
                    </Form.Item>
                </Col>             
                <Col xs={24} md={12} xl={6}>
                    <Form.Item 
                        name={'date'}
                        wrapperCol={{xs:{span: 24}}}
                    >
                        {
                        statisticsValue==0?
                        <RangePicker
                        defaultValue={[moment(), moment()]}     
                        onChange={(e)=>{ console.log(e) }}                    
                        />
                        :<DatePicker 
                        picker={statisticsList[statisticsValue].picker} 
                        defaultValue={moment()} 
                        onChange={(e)=>{ console.log(e) }} 
                        />
                        }
                    </Form.Item>
                </Col> 
            </Row>
            <Row style={{paddingLeft:30}}>
                <div>

                </div>
            </Row>
        </div>
    )
}