import React from "react";

function Layout(props) {
  return (
    <>
    {props.children}
    </>
  )
}

Layout.label = '概览台'
Layout.icon = 'AppstoreOutlined'
Layout.order = 1

export default Layout;


