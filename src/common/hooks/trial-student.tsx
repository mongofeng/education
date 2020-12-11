import * as api from '@/api/trial-student'

import * as React from "react";
const { useState } = React;


export default function fetchTrialStudentHook () {




  const [TrialStudentObj, setTrialStudent] = useState<any>({})

 


  const fetchTrialStudent = async (ids: string[]) => {

    const condition = {
      page: 1,
      offset: ids.length,
      query: {
        id: {
          $in: ids
        }
      }
    }

 
    const {
      data: {
        data: { list }
      }
    } = await api.gettrialStudentList(condition)

    const obj: any = {};
    list.forEach(item => {
      obj[item._id] = item.name
    })
    setTrialStudent({
      ...TrialStudentObj,
      ...obj
    })


  }



  return {
    TrialStudentObj,
    setTrialStudent,
    fetchTrialStudent
  }
}