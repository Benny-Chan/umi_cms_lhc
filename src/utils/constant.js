import {_t} from "./index";

export const chartUnitMap = {
  1:'kW·h',
  2:'kW·h',
  3:'kW·h',
  4:'kW·h',
  5:'kW·h',
  6:'单',
  7:'￥',
  8:'￥',
  9:'%',
  10:'￥',
}

export const precisionUnitMap = {
  1:'kW·h',
  2:'',
  3:'kW·h',
}

export const statisticsList = [
  { text: _t('自定义区间'), value: '5', picker:'date'},
  { text: _t('日'), value: '1', picker:'date'},
  { text: _t('周'), value: '2', picker:'week'},
  { text: _t('月'), value: '3', picker:'month'},
  { text: _t('年'), value: '4', picker:'year'},
]

export const RadioTags = [
  { text: _t('电量'), value: '1'},
  { text: _t('峰电量'), value: '2'},
  { text: _t('平电量'), value: '3'},
  { text: _t('谷电量'), value: '4'},
  { text: _t('日单枪电量'), value: '5'},
  { text: _t('订单量'), value: '6'},
  { text: _t('营收'), value: '7'},
  { text: _t('服务费'), value: '8'},
  { text: _t('使用率'), value: '9'},
  { text: _t('日单枪服务费'), value: '10'}
]

export const TrendRadioTags1 = [
  { text: _t('电量'), value: '1'},
  // { text: _t('单枪电量'), value: '5'},
  { text: _t('订单量'), value: '6'},
  { text: _t('营收'), value: '7'},
  { text: _t('服务费'), value: '8'},
  { text: _t('使用率'), value: '9'},
  { text: _t('单枪服务费'), value: '10'}
]

export const TrendRadioTags2 = [
  { text: _t('电量'), value: '1'},
  { text: _t('峰电量'), value: '2'},
  { text: _t('平电量'), value: '3'},
  { text: _t('谷电量'), value: '4'},
  { text: _t('单枪电量'), value: '5'},
  { text: _t('订单量'), value: '6'},
  { text: _t('营收'), value: '7'},
  { text: _t('服务费'), value: '8'},
  { text: _t('使用率'), value: '9'},
  { text: _t('单枪服务费'), value: '10'}
]

export const SiteRadioTags = [
  { text: _t('电量'), value: '1'},
  { text: _t('订单量'), value: '6'},
  { text: _t('营收'), value: '7'},
  { text: _t('服务费'), value: '8'},
]

