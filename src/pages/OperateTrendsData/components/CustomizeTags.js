import React, { useState, useEffect } from 'react'
import { Row, Col, Select, Input, Button, message } from 'antd'
import cls from './css/CustomizeTags.less'
import _ from 'lodash'
import { TagsContainer } from '../../../components/TagsContainer'

const { Option } = Select;

const statisticsList = [
    { text: '自定义电量', value: -1 },
    { text: '时', value: 0 },
    { text: '峰谷平细分时段', value: 1 },
    { text: '峰谷平', value: 2 },
    { text: '日', value: 3 },
    { text: '周', value: 4 },
    { text: '月', value: 5 },
]

const tags = [
    { min: 10, max: 20, key: '10-20'},
    { min: 20, max: 50, key: '20-50'},
    { min: 60, max: 80, key: '60-80'},
]

export const CustomizeTags = (props) => {
    const [tagsData, setTagsData] = useState([])
    const [minValue, setMinValue] = useState('')
    const [maxValue, setMaxValue] = useState('')

    useEffect(() => {
        setTagsData(tags)
    },[])

    const handleAddTag = () => {
        const obj = {min: minValue, max: maxValue, key: `${minValue}-${maxValue}`}
        const bool = tagsData.some(item => item.key === obj.key)

        if(bool) return message.error('存在相同标签')

        setMinValue('')
        setMaxValue('')
        setTagsData([...tagsData, obj])
    }

    const handleCloseTag = (key) => {
        const tags = tagsData.filter(item => item.key !== key)
        setTagsData(tags)
    }

    const handleInputOnChange = (value, func) => {
        const reg = /^\d+$/;
        if(reg.test(value) || value==='') func(value)
    }

    return (
        <Row className={cls.container} hidden={false}>
            <Col>
                <Row>
                    <Col className={cls.lable}><span>统计单位</span></Col>
                    <Col>
                        <Select 
                            placeholder={'请选择'}
                            style={{width:'200px'}}
                        >
                            {
                                statisticsList.map((item,index) => (
                                    <Option key={'statistics'+index} value={item.value}>
                                        { item.text }
                                    </Option>
                                ))
                            }
                        </Select>
                    </Col>
                    <Col xs={24} md={0} style={{marginBottom:20}}></Col>
                    <Col>
                        <Input 
                            className={cls.letfInput}
                            onChange={(e) => { handleInputOnChange(e.target.value, setMinValue) }}
                            placeholder="最小值"
                            value={ minValue }
                        />
                        <Input className={cls.disabledInput} placeholder="~" disabled />
                        <Input
                            className={cls.rightInput}
                            onChange={(e) => { handleInputOnChange(e.target.value, setMaxValue) }}
                            placeholder="最大值"
                            value= {maxValue }
                        />
                        <Button type={'primary'} className={cls.btn} onClick={() => { handleAddTag() }}>
                            添加
                        </Button>
                    </Col>
                </Row>
            </Col>
            <Col span={24}>
                <Row>
                    {/* 占位的 */}
                    <Col className={cls.lable}><span></span></Col>

                    <Col style={{flexGrow:1}}>
                        <TagsContainer tagsData={tagsData} handleCloseTag={handleCloseTag} />
                    </Col>
                </Row>
            </Col>
        </Row>
    )
}
