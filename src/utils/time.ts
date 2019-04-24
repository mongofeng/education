import formateDate from './format-date'
export function getWeek(dateStr?: string) {

    const nowDate = dateStr ? new Date(dateStr) : new Date()
    const day = nowDate.getDay()

    // 星期一
    const mondaySet = day === 0 ? 6 : day - 1

    nowDate.setDate(nowDate.getDate() - mondaySet)
    const monday = nowDate
    console.log(monday)
    
    const mondayStr = formateDate(monday, {
        format: 'yyyy-MM-dd 00:00:00',
    })

    // 星期日
    nowDate.setDate(nowDate.getDate() + 6)
    const sunday = nowDate
    console.log(sunday)


    
    const sundayStr = formateDate(sunday, {
        format: 'yyyy-MM-dd 23:59:59',
    })

    return {
        sunday,
        monday,
        mondayStr,
        sundayStr,
        mondayTimeStarmp: new Date(mondayStr).getTime(),
        sundayTimeStarmp: new Date(sundayStr).getTime(),
    }
}