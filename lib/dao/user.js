import {request} from '../request';
import {rmStoreUserInfo} from "../store";

/// 用户信息
export async function UserInfo(){
	const config = {showMsg:false, throwable:false}
	const {data} = await request('/rest/user/info',null,config)
	return data
}

/// 登出
export async function UserLogout(){
	rmStoreUserInfo()
	const {data} = await request('/rest/user/logout')
	return data.data
}
