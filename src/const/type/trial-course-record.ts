import { WechatTemplateDto } from "./wechat";

export interface TrialCourseRecord {
  _id:        string;
  courseId:   string;
  createDate: string;
  desc:       string;
  id:         string;
  num:        number;
  packageId:  string;
  studentId:  string;
  teacherId:  string;
  type:       number;
  updateDate: string;
}


export interface TrialCourseSignVo {
  courseId:   string;
  courseName: string;
  desc:       string;
  num:        number;
  studentId:  string;
  teacherId:  string;
}

export interface TrialCoureseSignDto {
  motify: boolean
  record: TrialCourseRecord
  wechatInfo: WechatTemplateDto
}

