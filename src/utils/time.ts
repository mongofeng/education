export function getWeek(dateStr?: string) {

    const nowDate = dateStr ? new Date(dateStr) : new Date();
    const day = nowDate.getDay();

    // 星期一
    const mondaySet = day === 0 ? 6 : day - 1;
    nowDate.setDate(nowDate.getDate() - mondaySet);
    const monday = new Date(nowDate.getTime());

    const mYear = monday.getFullYear();
    const mMonth = monday.getMonth();
    const mDay = monday.getDate();

    const mondayTime = new Date(mYear, mMonth, mDay, 0, 0, 0);
    const mondayTimeStarmp = mondayTime.getTime();



    // 星期日
    nowDate.setDate(nowDate.getDate() + 6);
    const sunday = nowDate;


    const sYear = sunday.getFullYear();
    const sMonth = sunday.getMonth();
    const sDay = sunday.getDate();

    const sundayTime = new Date(sYear, sMonth, sDay, 23, 59, 59);
    const sundayTimeStarmp = sundayTime.getTime();


    const result = {
        sunday: sundayTime,
        monday: mondayTime,
        mondayTimeStarmp,
        sundayTimeStarmp,
    };

    console.log(result);

    return result;
}
