import {observable,action} from 'mobx';
import _ from 'underscore';
import {loading} from 'mobx-loading';
import {callRPC} from "@/utils";

class Session {
  @observable user

  @observable adminList = []

  @observable operatorIds = 0
  @observable operatorList = []

  @observable updateTime = 0

  @action
  setUpdateTime = (time) =>{
    this.updateTime = time
  }

  setOperatorIds = (id) => {
    this.operatorIds = id
  }

  @action
  fetchCurrentUser = async ()=>{
    this.token = localStorage.getItem('UserToken');
    if(this.token){
      const rt = await callRPC('/admin/auth/currentUser');
      this.user = rt.record;
      return rt;
    }
  }

  // 函数
  @loading("session/login")
  @action
  login = async (data)=>{
    const rt = await callRPC('/admin/auth/login', {...data,loginAction:"datamc"});
    this.user = rt.record;
    if(this.user){
      this.token = this.user.token;
      localStorage.setItem('UserToken', this.token);
    }
    return rt;
  }

  @action
  changePassword = async (data)=>{
    const rt = await callRPC('/admin/user/updatePassword', data);
    return rt;
  }

  @action
  getNameList = async (data)=>{
    if(!_.isEmpty(this.operatorList)) return
    const res = await callRPC('/admin/operator/getNameList', data);
    console.log('/admin/operator/getNameList 获取运营商name列表 ===>',res)
    this.operatorList = res.records
    return res;
  }



}

export default new Session();
