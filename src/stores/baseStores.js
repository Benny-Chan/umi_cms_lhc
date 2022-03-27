import {observable,action} from 'mobx';
import _ from 'underscore';
import {loading} from 'mobx-loading';
import {notification} from "antd/lib/index";


export default class BaseStores {

  @observable data = {}; //loadData返回数据包，{pageIndex,pageSize,records,totalRecords}
  @observable data2 = {};
  @observable configData = {};
  @observable list = []; //下拉列表數據存儲對象
  @observable curObj = {}; //当前操作对象
  @observable editVisible = false; //控制新建/编辑视图
  @observable detailVisible = false; //控制详情视图
  @observable selectedRowKeys = []; //批量选择主键列表
  @observable selectedRows = []; //批量选择对象列表
  @observable pageIndex = 1; //当前分页index
  @observable pageSize = 10; //当前分页size
  @observable curSearchFormParam = []; //当前查询form参数
  @observable isUpdate = false; //是否编辑状态
  @observable shouldUpdateListFlag = false; //是否更新下拉選框列表數據

  // 展示详情抽屉/modal
  @action
  setShouldUpdateListFlag = (val)=>{
    this.shouldUpdateListFlag = val;
  }

  // 展示详情抽屉/modal
  @action
  showDetailDrawer = (record)=>{
    if (record) {
      this.curObj = _.clone(record)
    }
    this.detailVisible = true;
  }

  // 关闭详情抽屉/modal
  @action
  handleDetailCancel = async ()=>{
    this.detailVisible = false;
    this.curObj = {};
  }

  // 展示编辑抽屉/modal
  @action
  showEditModal = (record)=>{
    if (record) {
      this.curObj = _.clone(record)
    }
    this.isUpdate = true;
    this.editVisible = true;
  }

// 展示新建抽屉/modal
  @action
  showModal = async ()=>{
    this.editVisible = true;
  }

  // 调用导出接口
  @action
  handleExport = async (values)=>{
    console.log("handleExport",values)
  }
  // 分页index改变
  @action
  onPageIndexChange= async(page, pageSize)=> {
    this.handlePageChange(page,pageSize);
   const params = await this.getSearchFormParams();
    this.loadData({...params, pageIndex:page,pageSize:pageSize})
  }
  // 分页size改变
  @action
  onPageSizeChange= async(current, size)=>{
    this.handlePageChange(current,size);
    const params = await this.getSearchFormParams();
    this.loadData({...params, pageIndex:current,pageSize:size})
  }

  // 分页对象改变
  @action
  handlePageChange= async(current, size)=>{
    this.pageIndex = current;
    this.pageSize = size;
  }

 // 重置当前分页对象数据
  @action
  onPageReset= async()=>{
    this.handlePageChange(1,10);
  }
// 查询form实例fieldValues变化回调
  @action
  onSearchFormValuesChanged= async(changedValues, allValues)=>{
   await this.resetData();
    console.log("onSearchFormValuesChanged",JSON.stringify(changedValues),JSON.stringify(allValues))
    if(_.isEmpty(allValues)){
      this.curSearchFormParam = []
    }else{
      this.curSearchFormParam = Object.keys(allValues).map(key=>({
        "name": [
          key
        ],
        "value": allValues[key]
      }))
    }

    // this.curSearchFormParam = allValues;
    this.handlePageChange(1,10);
  }

  @action
  resetData = async () => {
    this.data = {}
  }

  // 根据字段查询form参数值
  @action
  getSearchFormParamsByName =async (name)=>{
    if(!name) return undefined
   const targetParam =  _.find(this.curSearchFormParam, (item)=>item.name[0]===name);
   return targetParam?targetParam.value:undefined
  }

  // 根据字段查询form参数值
  @action
  setSearchFormParams =async (name,value)=>{
   const params = await this.getSearchFormParams();
   params[name] = value;
   console.log("setSearchFormParams",JSON.stringify(params))
   this.onSearchFormValuesChanged(value,params)
  }

  resetSearchForm = ()=>{
    this.curSearchFormParam = [];
    this.handlePageChange(1,10);
  }

// 重置查询form实例和当前页面数据
  @action
  onReset= async()=>{
    this.onPageReset();
    this.curSearchFormParam = [];
    this.loadData()
  }

  // 初始化当前页面数据
  @action
  onPageInit= async()=>{
    this.onPageReset();
    this.curSearchFormParam = [];
    this.loadData()
  }

// 提交新建/编辑数据
  @action
  handleSubmit  = (values)=>{
    const id = this.curObj ? this.curObj.id : '';
    const params = {id,...values};
    this.editVisible = false;
  }

//设置批量选择对象主键列表
  @action
  setSelectedRowKeys = async (selectedRowKeys)=>{
    this.selectedRowKeys = selectedRowKeys;
  }
//设置批量选择对象列表
  @action
  setSelectedRows = async (selectedRows)=>{
    this.selectedRows = selectedRows;
  }
  //清空批量选择对象列表
  @action
  clearSelectedRows = async ()=>{
    this.selectedRows = [];
    this.selectedRowKeys = [];
  }
 //批量处理
  @action
  handleBatch = async ()=>{
    console.log("selectedRowKeys",JSON.stringify(this.selectedRowKeys))
  }
  //控制上线、下线逻辑
  @action
  handleOffline = async (record)=>{
    this.isUpdate = true;
   return this.handleSubmit(record);
  }
  //获取当前操作对象id
  @action
  getId = async ()=>{
    return this.curObj ? this.curObj._id : '';
  }

  //获取查询对象参数
  @action
  getSearchFormParams=async()=>{
    let fieldsValue = await this.curSearchFormParam;
    const params = {}
    fieldsValue.map(item=>{
      const [key] = item.name
      params[key] = item.value
    })
    console.log("params",JSON.stringify(params))
    return params;
  }

  //获取查询对象参数
  @action
  getSearchParams=async()=>{
    let fieldsValue = await this.getSearchFormParams();
    return {pageIndex:1,pageSize:1000000,...fieldsValue};
  }

  //获取查询对象参数
  @action
  getListParams=async(params)=>{
    return {pageIndex:1,pageSize:100000,status:0,...params};
  }


// 调用主页面主体数据查询接口
  @loading
  @action
  loadData = async (params)=>{
    const searchForm = {pageIndex:this.pageIndex,pageSize:this.pageSize,...params};
    this.data = {totalRecords:12,pageIndex:1,pageSize:10,records:[

      ]};
    return this.data;
  }
}
