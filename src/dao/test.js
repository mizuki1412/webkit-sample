import {request} from 'webkit1412/lib/request';

export async function BoxList(){
	const {data} = await request('/rest/box/list')
	return data.data
}
