import React, {useState} from "react";
import {_t} from '@/utils'

function Layout(props) {
  return (
    <>
    {props.children}
    </>
  )
}

Layout.label = '站点运营数据'
Layout.icon = 'LineChartOutlined'
Layout.order = 3

export default Layout;


