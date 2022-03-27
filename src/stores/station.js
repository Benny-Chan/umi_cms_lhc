import {observable,action} from 'mobx';
import {loading} from 'mobx-loading';
import {callRPC} from "@/utils";
import BaseStores from "./baseStores";

class Station extends BaseStores {

  @loading("station/getStationList")
  @action
  loadList = async (data) => {
    const res = await callRPC('/admin/station/getNameList', data);
    if(res.code===0){
      this.list = res.records;
    }
  }

}

export default new Station();
