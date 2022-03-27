import React from "react";

function Layout(props) {
  return (
    <>
    {props.children}
    </>
  )
}

Layout.label = '分析台'
Layout.icon = 'FundProjectionScreenOutlined'
Layout.order = 2

export default Layout;


