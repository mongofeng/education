import axios, { AxiosPromise } from 'axios'
enum Level {
    province = 'province',
    city = 'city',
    district = 'district'
}

/**
 * 区
 */
interface IDistrict {
    citycode: string // "0754"
    adcode: string // "440513",
    name: string// "潮阳区",
    center: string,
    level: Level,
    districts: any[]
}

interface ICity {
    citycode: string // "0754"
    adcode: string // "440500",
    name: string// "潮阳区",
    center: string,
    level: Level,
    districts: IDistrict[]
}

interface IProvince {
    citycode: string // "0754"
    adcode: string // "440500",
    name: string// "潮阳区",
    center: string,
    level: Level,
    districts: ICity[]
}

interface IAreas {
    status: string
    info: string
    infocode: string
    count: string
    suggestion: {
        keywords: any[];
        cities: any[]
    }
    districts: IProvince[]
}
/**
 * 获取所有的省市区
 */
export function getLocalDistricts(): AxiosPromise<IAreas> {
    return axios.get(
        `/data/districts/index.json`
    )
}

export async function fetchLocalDistricts() {
    const res = window.localStorage.getItem('locations')
    if (res) { return JSON.parse(res) }


    try {
        const { data } = await getLocalDistricts()
        const { districts: [china] } = data
        const { districts: province } = china

        let str = JSON.stringify(province)
        str = str.replace(/"name":"([^"]*)"/g, `"label": "$1", "value": "$1"`).replace(/districts/g, 'children')
        const value = JSON.parse(str)
        window.localStorage.setItem('locations', str)
        return value
    } catch (error) {
        return []
    }
}