import React, { useState, useEffect } from 'react'
import { Row, Col, Tag, Form } from 'antd'
import cls from './css/CheckBoxChartParams.less'
import { createFromIconfontCN } from '@ant-design/icons'
import _ from 'lodash'

const { CheckableTag } = Tag;

const IconFont = createFromIconfontCN({
    scriptUrl: '//at.alicdn.com/t/font_2123090_423ugu93kvw.js',
});

const groupOne = [
    { text: '电量', value: 'one1'},
    { text: '峰电量', value: 'one2'},
    { text: '平电量', value: 'one3'},
    { text: '谷电量', value: 'one4'},
    { text: '单枪电量', value: 'one5'},
    { text: '电量', value: 'one6'},
    { text: '峰电量', value: 'one7'},
    { text: '平电量', value: 'one8'},
    { text: '谷电量', value: 'one9'},
    { text: '单枪电量', value: 'one10'}
]


export const CheckBoxChartParams = (props) => {
    const [tag,setTag] = useState('')

    const handleTagsChange = (value) => {
        if (tag == '') {
            setTag(value)
        }
        if (value == tag) {
            setTag('')
        }
    }
    const _renderGroupTags = (groupArr,i) => (
        groupArr.map((item,index) =>
            <CheckableTag
                key={`${i}`+index}
                className={`
                    ${cls.tags}
                    ${tag!=item.value ? cls.disable : ''}
                    ${_.includes(groupTags[i],item.value) ? cls.tagsActivate : ''}
                `}
                checked={item.value==item.value}
                onChange={checked => handleTagsChange(item.value) }
            >
                <span>{item.text}</span>
                <IconFont type={'icon-check'} className={cls.outLined} />
            </CheckableTag>
        )
    )

    return (
        <div className={cls.container}>
            <Form.Item
                // name={'checkBoxTags'}
                wrapperCol={{span:24}}
            >
                <Row className={`${cls.chartBorder}`}>
                    <Col xs={24} xl={24} xxl={14} className={cls.group}>
                        <Row>
                            { _renderGroupTags(groupOne, 0) }
                        </Row>
                    </Col>
                </Row>
            </Form.Item>
        </div>
    )
}
