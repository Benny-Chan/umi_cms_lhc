
import { useIntl } from 'umi';
import { MobXProviderContext } from 'mobx-react';
import qs from 'qs';
import _ from 'underscore';
import moment from 'moment';
import React from "react";
import session from '@/stores/session';
import {history, Link} from 'umi'
import { notification } from 'antd';
import {chartUnitMap} from "./constant";
const XlsxPopulate = require('xlsx-populate');
const fileDownload = require('js-file-download');

/* eslint no-useless-escape:0 */
const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;

export function isUrl(path) {
  return reg.test(path);
}

export function renderContent(props) {
  return (
    <div>{props.children}</div>
  );
}

export function getDiffUnitLabel(tagsVal,v,) {
  return [7,8,10].includes(tagsVal)?`${chartUnitMap[tagsVal]||""} ${v?(v/100).toFixed(2):0}`:(tagsVal===9?`${v?(v*100).toFixed(2):0} ${chartUnitMap[tagsVal]||""}`:(tagsVal===6?`${v?v:0} ${chartUnitMap[tagsVal]||""}`:`${v?v.toFixed(2):0} ${chartUnitMap[tagsVal]||""}`))
}


/*
* 格式化searchForm日期类型数据
* */
export function handleDateFormat(fieldsValue,targetField,outputField,format) {
  const data = _.clone(fieldsValue);
  const ts = data[targetField];
  console.log(ts)
  if(ts&&ts.length===2){
    const startDate =  moment(ts[0]).format(format);
    const endDate =  moment(ts[1]).format(format);
    data[targetField] = null;
    data['startDate'] = startDate;
    data['endDate'] = endDate;
    return data;
  }
  if(ts){
    const date =  moment(ts).format(format);
     data[targetField] = null;
     data[outputField] = date;
    return data;
  }
  return fieldsValue;
}
/*
* 对后台接口返回数据提示
* */
export function handleResult(resp,successLabel,errorLabel) {
  const {code} = resp;
  if(code){
    const {message} = resp;
    return notification.error({
      message:errorLabel?errorLabel:_t('操作失敗'),
      description: message,
    });
  }
  return notification.success({
    message:successLabel?successLabel:_t('操作成功'),
  });
}


export function _t(id, params) {
  // if(!id){
  //   return '';
  // }
  // const intl = useIntl();
  // return intl.formatMessage({id, defaultMessage: id}, params);
  return id;
}

export function useI18n(){
  const intl = useIntl();
  return (id, params)=>{
    if(!id){
      return '';
    }
    return intl.formatMessage({id, defaultMessage: id}, params);
  }
}


export function useLoading(action) {
  const { loading } = React.useContext(MobXProviderContext);
  return loading.actions[action];
}

export function formatHour(hour) {
  return (hour<10 ? ('0'+hour) : hour) + ':00';
}

export function formatNumber(num, maxFraction) {
  if(isNaN(num)){
    return ''
  }
  return num.toString().indexOf('.') > -1 ? Number(num.toFixed(maxFraction)) : num.toString();
}

export function formatPercent(num, maxFraction=1) {
  if(isNaN(num)){
    return ''
  }
  return `${(num*100).toFixed(maxFraction)}%`;
}

export function formatMoney(amount){
  return Number((amount/100).toFixed(2)).toString()
}


export function getFontColorByBg(bgColor) {
  return (!bgColor || isLightColor(bgColor)) ? '#111' : '#fff';
}

function isLightColor(color) {

  // Variables for red, green, blue values
  var r, g, b, hsp;

  // Check the format of the color, HEX or RGB?
  if (color.match(/^rgb/)) {

      // If HEX --> store the red, green, blue values in separate variables
      color = color.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/);

      r = color[1];
      g = color[2];
      b = color[3];
  }
  else {

      // If RGB --> Convert it to HEX: http://gist.github.com/983661
      color = +("0x" + color.slice(1).replace(
      color.length < 5 && /./g, '$&$&'));

      r = color >> 16;
      g = color >> 8 & 255;
      b = color & 255;
  }

  // HSP (Highly Sensitive Poo) equation from http://alienryderflex.com/hsp.html
  hsp = Math.sqrt(
    0.114 * (r * r) +
  0.587 * (g * g) +
  0.299 * (b * b)
  );
  //console.log(color, ' ... ', hsp)
  //return hsp>127.5;
  return hsp>186;
}

export function getGradientColor(color){
  var r = parseInt(color.substr(1,2), 16);
  var g = parseInt(color.substr(3,2), 16);
  var b = parseInt(color.substr(5,2), 16);
  var hsv = rgb2hsv(r, g, b);
  var h = hsv[0], s = hsv[1], v = hsv[2];
  return [genRGBColor(hsv2rgb(h<50?(h-10):(h+15),s-0.05,v-12)), genRGBColor(hsv2rgb(h<50?(h+10):(h-10),s+0.05,v+20))];
}

export function getGradientBackground(color){
  var colors = getGradientColor(color);
  return `-webkit-gradient(linear, left top, right bottom, color-stop(0%,${colors[0]}), color-stop(100%,${colors[1]}))`;
}


function hsv2rgb(h,s,v)
{
  let f= (n,k=(n+h/60)%6) => Math.min(255,Math.round(v - v*s*Math.max( Math.min(k,4-k,1), 0)));
  return [f(5), f(3), f(1)];
}

function rgb2hsv(r,g,b) {
  let v=Math.max(r,g,b), n=v-Math.min(r,g,b);
  let h= n && ((v==r) ? (g-b)/n : ((v==g) ? 2+(b-r)/n : 4+(r-g)/n));
  return [60*(h<0?h+6:h), v&&n/v, v];
}

function genRGBColor(rgb){
  return `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`
  //return '#' + Number(rgb[0]).toString(16) + Number(rgb[1]).toString(16) + Number(rgb[2]).toString(16);
}

export function sumOfArray(array, prop){
  return _.reduce(array, function(s, r) { return s + (prop ? r[prop] : r); }, 0);
}

const codeMessage = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
};

const checkStatus = response => {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }
  const errortext = codeMessage[response.status] || response.statusText;
  if (response.status !== 403) {
    notification.error({
      key: 'rpc_call_error',
      message: `请求错误 ${response.status}`,
      description: errortext,
    });
  }
  const error = new Error(errortext);
  error.name = response.status;
  error.response = response;
  throw error;
};

export async function callRPC(uri, data, isJson){
  if(!uri.startsWith('/')){
    uri = '/api/v1/' + uri;
  }else{
    uri = '/api/v1' + uri;
  }
  data = data || {};

  // if(Session.locale){
  //   if(uri.indexOf('?') > -1){
  //     uri += '&locale='+Session.locale;
  //   }else{
  //     uri += '?locale='+Session.locale;
  //   }
  // }
  if(session.operatorIds) data.operatorIds = session.operatorIds

  console.log(uri, ' >>> ',JSON.stringify(data));
  if(isJson) {
    const res = await fetch(uri, {
      method: 'POST', body: JSON.stringify(data), headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-TOKEN-AUTH': session.token,
      }
    })
    const {status} = res;
    if(status === 403){
       logout();
    }
    return res.json();
  }else{
    const res = await fetch(uri, {
      method: 'POST', body: qs.stringify(data), headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
        'X-TOKEN-AUTH': session.token,
      }
    }) ;
    const {status} = res;
    if(status === 403){
      logout();
    }
    return res.json();
  }


}

export async function importData(uri, file, params){
  const fd = new FormData()
  fd.append('file', file)
  if(!_.isEmpty(params)){
    for(const k in params){
      fd.append(k, params[k])
    }
  }
  const res = await fetch(uri, {
    method: 'POST',
    body: fd,
    headers: {
      'X-TOKEN-AUTH': session.token,
      'X-AUTH-DEVICE': session.getDeviceUUID()
    }
  })
  const {status} = res;
  if(status === 403){
    logout();
  }
  return res.json()
}

export async function uploadFile(file){
  const fd = new FormData()
  fd.append('file', file)
  const res = await fetch('/api/upload/file', {
    method: 'POST',
    body: fd,
    headers: {
      'X-TOKEN-AUTH': session.token,
    }
  })
  const {status} = res;
  if(status === 403){
    logout();
  }
  return res.json()
}

export function createWSUrl(url, params){
  params = params || {}
  if(!params._token){
    params._token = session.token
  }
  const pr = window.location.protocol.indexOf('https')>-1 ? 'wss' : 'ws'
  return `${pr}://${window.location.host}${url}?${qs.stringify(params)}`
}

export function changeCreateTime (str) {
    return moment(str).format('YYYY-MM-DD HH:mm:ss')
}

export function formatPrice(val,type='fen'){
  if(!_.isNumber(val) && _.isEmpty(val)){
    return '';
  }
  if(type==='fen'){
    const price = (parseFloat(val)/100) || 0;
    const idx = price.toString().indexOf('.');
    return price.toFixed(2);
  }
  const price = parseFloat(val) || 0;
  const idx = price.toString().indexOf('.');
  return price.toFixed(2);
}


export function launchFullScreen(element) {
  element = element || document.body;
  if(element.requestFullScreen) {
    element.requestFullScreen();
  } else if(element.mozRequestFullScreen) {
    element.mozRequestFullScreen();
  } else if(element.webkitRequestFullScreen) {
    element.webkitRequestFullScreen();
  } else if(element.msRequestFullScreen) {
    element.msRequestFullScreen();
  }else{
    return true;
  }
}
export function cancelFullScreen() {
  if(document.exitFullscreen) {
    document.exitFullscreen();
  } else if(document.mozCancelFullScreen) {
    document.mozCancelFullScreen();
  } else if(document.webkitCancelFullScreen) {
    document.webkitCancelFullScreen();
  } else if(document.msExitFullscreen) {
    document.msExitFullscreen();
  }else{
    return true;
  }
}

export function filterData(data, filters) {
  if(_.isEmpty(filters)){
    return data
  }
  const canShow = (r)=>{
    for(const field in filters){
      const setting = filters[field]
      if(setting && !setting[r[field]]){
        return false
      }
    }
    return true
  }
  const rt = []
  for(const r of data){
    if(canShow(r)){
      rt.push(r)
    }
  }
  return rt
}

/**
 * 处理电量精度 四舍五入问题
 */
export function formatAccuracy(val,toFixed=2) {
  if(!isNaN(val)){
    let number = parseInt(val*(10**toFixed))
    return parseFloat((number/(10**toFixed)).toFixed(toFixed))
  }
  return 0
}

/**
 * 为number增加前面符号 逗号分隔 保留2位小数
 */
export function addSymbol(data, symbol='', separator=',', toFixed=2) {
  let number = (data/(10**toFixed)).toFixed(toFixed).toString()
  if(!isNaN(number)){
    let parts = number.split('.')
    parts[0] = parts[0].replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1'+ separator)

    if(symbol) return symbol + ' ' + parts.join('.')
    return symbol + parts.join('.')
  }
  return 0
}

export function logout(){
  localStorage.setItem('UserToken', null);
  history.push('/login')
}


export function exportTableExcel(reportObj, colDef, setting) {
  const {title, filename,tips,isGroup} = setting;
  XlsxPopulate.fromBlankAsync()
    .then(workbook => {
      const sheet = workbook.sheet(0);
      sheet.name(filename);
      if(tips){
        if(isGroup){
          let j =1;
          _.each(colDef, (c,i)=>{
            sheet.range(3, j, 3, j+c.children.length-1).merged(true);
            sheet.cell(3, j).value(c.title);

            _.each(c.children,(ch)=>{
              sheet.cell(3, j).style({borderColor:'#000', borderStyle:'thin', fontSize: 13, horizontalAlignment: 'center', verticalAlignment: 'center'});
              sheet.cell(4, j).value(ch.title).style({borderColor:'#000', borderStyle:'thin', fontSize: 13, horizontalAlignment: 'center', verticalAlignment: 'center'});
              if(c.xlWidth){
                sheet.column(j).width(ch.xlWidth);
              }
              j++;
            })
          })

          sheet.range(1, 1, 1, j-1).merged(true);
          sheet.cell("A1").value(title).style({bold: true, fontSize: 18, horizontalAlignment: 'center', verticalAlignment: 'center'});
          sheet.row(1).height(30);
          sheet.range(2, 1, 2, j-1).merged(true);
          sheet.cell("A2").value(tips).style({fontSize: 14});

          _.each(reportObj, (record, rIdx)=>{
            let j = 1;
            _.each(colDef, (c)=>{
              _.each(c.children, (ch)=>{
                const style = {borderColor:'#000', borderStyle:'thin', fontSize: 13};
                if(ch.numberFormat){
                  style.numberFormat = ch.numberFormat;
                }

                sheet.cell(5+rIdx, j).value(c.formatPrice?(record[c.dataIndex]/100).toFixed(2):record[ch.dataIndex]).style(style);
                ++j;
              });
            });
          });
        }else{
          sheet.range(1, 1, 1, colDef.length).merged(true);
          sheet.cell("A1").value(title).style({bold: true, fontSize: 18, horizontalAlignment: 'center', verticalAlignment: 'center'});
          sheet.row(1).height(30);
          sheet.range(2, 1, 2, colDef.length).merged(true);
          sheet.cell("A2").value(tips).style({fontSize: 14});
          _.each(colDef, (c,i)=>{
            sheet.cell(3, i+1).value(c.title).style({borderColor:'#000', borderStyle:'thin', fontSize: 13});
            if(c.xlWidth){
              sheet.column(i+1).width(c.xlWidth);
            }
          })
          _.each(reportObj, (record, rIdx)=>{
            _.each(colDef, (c,i)=>{
              const style = {borderColor:'#000', borderStyle:'thin', fontSize: 13};
              if(c.numberFormat){
                style.numberFormat = c.numberFormat;
              }
              sheet.cell(4+rIdx, i+1).value(c.formatPrice?(record[c.dataIndex]/100).toFixed(2):record[c.dataIndex]).style(style);
            });
          });
        }


      }else{
        sheet.range(1, 1, 1, colDef.length).merged(true);
        sheet.cell("A1").value(title).style({bold: true, fontSize: 18, horizontalAlignment: 'center', verticalAlignment: 'center'});
        sheet.row(1).height(30);
        _.each(colDef, (c,i)=>{
          sheet.cell(2, i+1).value(c.title).style({borderColor:'#000', borderStyle:'thin', fontSize: 13});
          if(c.xlWidth){
            sheet.column(i+1).width(c.xlWidth);
          }
        });

        _.each(reportObj, (record, rIdx)=>{
          _.each(colDef, (c,i)=>{
            const style = {borderColor:'#000', borderStyle:'thin', fontSize: 13};
            if(c.numberFormat){
              style.numberFormat = c.numberFormat;
            }
            sheet.cell(3+rIdx, i+1).value(c.formatPrice?(record[c.dataIndex]/100).toFixed(2):record[c.dataIndex]).style(style);
          });
        });
      }
      workbook.outputAsync().then(blob=>{
        fileDownload(blob, `${filename}.xlsx`);
      });
    });
}
/**
 * 返回图表鼠标悬停的H5 样式
 */
export function chartHoverUI({width = 0, data = {}}) {
  return `
    <div style="background-color: #13132D;margin:-10px -20px;border-radius: 8px; border: 2px solid #1F225C;box-shadow: 0px 0px 15px #1F225C inset;padding: 15px 40px">
      <div style="line-height:16px; font-size:16px; ${width > 0 ? `width: ${ width }px;` : ''}">
        <div style="color:#798196;margin-bottom:8px;display:flex; justify-content: center">${ data.name }</div>
        <div style="color:#ffffff;display:flex; justify-content: center">${ data.value }</div>
      </div>
    </div>`
}

/**
 * 返回图表鼠标悬停的H5 样式 白底的
 */
export function chartHoverUI_2({width = 0, data = {}}) {
  return `
    <div style="margin:-10px -20px;background-color: #fff;border-radius: 8px;box-shadow: 0px 0px 12px rgba(0,0,0,0.1);padding: 16px">
      <div style="line-height:16px; font-size:14px; ${width > 0 ? `width: ${ width }px;` : ''}">
        <div style="margin-bottom:12px;color: #000">· ${ data.value }</div>
        <div" style="color: #000;display: flex;justify-content: space-between;">
          <div>· ${ data.name }</div>
          <div>${ data.value_2 || '' }</div>
        </div>
      </div>
    </div>`
}


