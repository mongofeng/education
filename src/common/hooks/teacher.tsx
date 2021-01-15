import * as apiTeacher from '@/api/teacher'
import { TEACHER_STATUS } from '@/const/enum';
import { ITeacher } from '@/const/type/teacher';
import * as React from "react";
const { useState, useEffect } = React;


export default function fetchTeacherHook (conditionProps:QueryCondition<ITeacher> = {}) {




  const [teacherObj, setTeacherMap] = useState<any>({})

  const [teacherOptions, setOptions] = useState([])

  const [injobTeacher, setInjobTeacher] = useState([])


  useEffect(() => {
    fetchTeacher()
  }, [])





  const fetchTeacher = async () => {

    const condition = {
      page: 1,
      offset: 1000,
      ...conditionProps
    }

 
    const {
      data: {
        data: { list }
      }
    } = await apiTeacher.getteacherList(condition)

    const teacherMap: any = {};
    list.forEach(item => {
      teacherMap[item._id] = item.name
    })
    setTeacherMap(teacherMap)

  

    setOptions(list.map(item => {
      return {
        label: item.name,
        value: item._id
      }
    }))

    setInjobTeacher(list.filter(i => i.status === TEACHER_STATUS.InService).map(item => {
      return {
        label: item.name,
        value: item._id
      }
    }))
  }



  return {
    teacherObj,
    teacherOptions,
    injobTeacher
  }
}