/**
 * 性别的枚举
 */
export enum ESEX {
    man = 1,
    felman
}

export const SEX_LABEL: LabelMapping<ESEX> = {
    [ESEX.man]: '男',
    [ESEX.felman]: '女'
}


/**
 * 登录用户
 */
export enum USER_STATUS {
    admin = 1,
    tourist
}

export const USER_STATUS_LABEL: LabelMapping<USER_STATUS> = {
    [USER_STATUS.admin]: '管理员',
    [USER_STATUS.tourist]: '非管理员'
}

/**
 * 学生状态
 */
export enum STUDENT_STATUS {
    reading = 1,
    graduation
}

export const STUDENT_STATUS_LABEL: LabelMapping<STUDENT_STATUS> = {
    [STUDENT_STATUS.reading]: '在读',
    [STUDENT_STATUS.graduation]: '毕业'
}


/**
 * 老师状态
 */
export enum TEACHER_STATUS {
    InService = 1,
    Leave
}

export const TEACHER_STATUS_LABEL: LabelMapping<TEACHER_STATUS> = {
    [TEACHER_STATUS.InService]: '在职',
    [TEACHER_STATUS.Leave]: '离职'
}


/**
 * 老师状态
 */
export enum COURSE_STATUS {
    open = 1,
    off
}

export const COURSE_STATUS_LABEL: LabelMapping<COURSE_STATUS> = {
    [COURSE_STATUS.open]: '开班',
    [COURSE_STATUS.off]: '结束'
}


/**
 * 一周状态
 */
export enum WEEK {
    sunday,
    monday,
    tuesday,
    wednesday,
    thuriday,
    firday,
    saturday,
}

export const WEEK_LABEL: LabelMapping<WEEK> = {
    [WEEK.monday]: '周一',
    [WEEK.tuesday]: '周二',
    [WEEK.wednesday]: '周三',
    [WEEK.thuriday]: '周四',
    [WEEK.firday]: '周五',
    [WEEK.saturday]: '周六',
    [WEEK.sunday]: '周日',
}


/**
 * 一周状态
 */
export enum DAY {
    monrning = 1,
    afternoon,
    evening,
}

export const DAY_LABEL: LabelMapping<DAY> = {
    [DAY.monrning]: '上午',
    [DAY.afternoon]: '下午',
    [DAY.evening]: '晚上',
}


/**
 * 学时状态
 */
export enum COURSE_HOUR_STATUS {
    pass = 1,
    refuse
}

export const COURSE_HOUR_STATUS_LABEL: LabelMapping<COURSE_HOUR_STATUS> = {
    [COURSE_HOUR_STATUS.pass]: '通过',
    [COURSE_HOUR_STATUS.refuse]: '拒绝'
}

/**
 * 学时类型添加
 */
export enum COURSE_HOUR_ACTION_TYPE {
    add = 1,
    del,
    sign
}

export const COURSE_HOUR_ACTION_TYPE_LABEL: LabelMapping<COURSE_HOUR_ACTION_TYPE> = {
    [COURSE_HOUR_ACTION_TYPE.add]: '增加',
    [COURSE_HOUR_ACTION_TYPE.del]: '减少',
    [COURSE_HOUR_ACTION_TYPE.sign]: '签到'
}


/**
 * 学时类型
 */
export enum COURSE_HOUR_TYPE {
    buy = 1,
    send,
    sign,
    other
}

export const COURSE_HOUR_TYPE_LABEL: LabelMapping<COURSE_HOUR_TYPE> = {
    [COURSE_HOUR_TYPE.buy]: '购买',
    [COURSE_HOUR_TYPE.send]: '赠送',
    [COURSE_HOUR_TYPE.sign]: '签到',
    [COURSE_HOUR_TYPE.other]: '其他'
}
