import {request} from '../request';

/// 用户信息
export async function UserInfo(){
	const config = {showMsg:false, throwable:false}
	const {data} = await request('/rest/user/info',null,config)
	return data
}
