import React, { useState, useEffect } from 'react'
import { Row, Col, Tag, Form } from 'antd'
import cls from './css/CheckBoxChartParams.less'
import { createFromIconfontCN } from '@ant-design/icons'
import _ from 'lodash'
import {observer} from "mobx-react/dist/index";
import dataState from '@/stores/operator';
import {_t} from "../../../utils";

const { CheckableTag } = Tag;

const IconFont = createFromIconfontCN({
    scriptUrl: '//at.alicdn.com/t/font_2123090_423ugu93kvw.js',
});

const groupOne = [
    { text: '电量', value: '1'},
    { text: '峰电量', value: '2'},
    { text: '平电量', value: '3'},
    { text: '谷电量', value: '4'},
    { text: '单枪电量', value: '5'},
]
const groupOne2 = [
  { text: '电量', value: '1'},
  { text: '单枪电量', value: '5'},
]
const groupTwo = [
    { text: '使用率', value: '1'},
]

const groupThree = [
  { text: '订单量', value: '1'},
]
const groupFour = [
    { text: '营收', value: '1'},
    { text: '服务费', value: '2'},
    { text: '单枪服务费', value: '3'},
]


export const CheckBoxChartParams = observer(({intervalType})=> {
    const {groupTags, setGroupTags,onColumnCheckBoxChange,disableGroup, setDisableGroup} = dataState
    // const [disableGroup, setDisableGroup] = useState([false,true,true,false])
    const handleTagsChange = (value, checked, index) => {
        let arr = groupTags
        let DisableIndex = disableGroup
        let isCheckIndex = []
      let emptyIndex = []
        const nextSelectedTags = checked ? [...groupTags[index], value] : groupTags[index].filter(t => t !== value);
        arr[index] = nextSelectedTags

        // 获取空分组的index
        arr.map((item,i) => {
            if(!_.isEmpty(item)){
                isCheckIndex.push(i)
            }else{
              emptyIndex.push(i)
            }
        })
        // 如果已经有两组数据有值 禁用其余分组按钮
        if(isCheckIndex.length === 2){
            DisableIndex[emptyIndex[0]] = true
          DisableIndex[emptyIndex[1]] = true
        }else{
            DisableIndex = [false,false,false,false]
        }

        setDisableGroup([...DisableIndex])
        setGroupTags([...arr])
     onColumnCheckBoxChange([...arr])
    }

    // params i: 0=分组1  1=分组2  2=分组3
    const _renderGroupTags = (groupArr,i) => (
        groupArr.map((item,index) =>
            <CheckableTag
                key={`${i}`+index}
                className={`
                    ${cls.tags}
                    ${disableGroup[i] ? cls.disable : ''}
                    ${_.includes(groupTags[i],item.value) ? cls.tagsActivate : ''}
                `}
                checked={_.includes(groupTags[i],item.value)}
                onChange={checked => handleTagsChange(item.value, checked, i) }
            >
                <span>{item.text}</span>
                <IconFont type={'icon-check'} className={cls.outLined} />
            </CheckableTag>
        )
    )

    return (
        <div className={cls.container}>
            <Form.Item
                name={'checkBoxTags'}
                wrapperCol={{span:24}}
            >
                <Row className={`${cls.chartBorder}`}>
                    <Col xs={24} xl={24} xxl={12} className={cls.group}>
                        <Row>
                            <Row align={'middle'} className={cls.groupTitle}>{_t('组一')}</Row>
                            <Row>
                                { _renderGroupTags(intervalType==="1"?groupOne2:groupOne, 0) }
                            </Row>
                        </Row>
                    </Col>

                    <Col xs={24} xxl={12} className={cls.group}>
                        <Row>
                            <Row align={'middle'} className={cls.groupTitle}>{_t('组二')}</Row>
                            <Row>
                                { _renderGroupTags(groupTwo, 1) }
                            </Row>
                        </Row>
                    </Col>

                    <Col xs={24} xxl={12} className={cls.group}>
                        <Row>
                            <Row align={'middle'} className={cls.groupTitle}>{_t('组三')}</Row>
                            <Row>
                                { _renderGroupTags(groupThree, 2) }
                            </Row>
                        </Row>
                    </Col>
                  <Col xs={24} xxl={12} className={cls.group}>
                    <Row>
                      <Row align={'middle'} className={cls.groupTitle}>{_t('组四')}</Row>
                      <Row>
                        { _renderGroupTags(groupFour, 3) }
                      </Row>
                    </Row>
                  </Col>
                </Row>
            </Form.Item>
        </div>
    )
})
