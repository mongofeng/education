export const FETCH_LOCATION: string = 'FETCH_LOCATION'
export const FETCH_LOCATION_EDN: string = 'FETCH_LOCATION_EDN'
/**
 * 请求
 */
export const FetchList = () => ({
    type: FETCH_LOCATION,
})

/**
 * 请求结束
 * @param data 地址数据
 */
export const FetchListEnd = (data: any[]) => ({
    type: FETCH_LOCATION_EDN,
    data
})

export type IfetchListtype = ReturnType<typeof FetchListEnd>
