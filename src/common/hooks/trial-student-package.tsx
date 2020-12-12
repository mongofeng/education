import * as api from '@/api/trial-student-package'
import { TrialStudentPackage } from '@/const/type/trial-student-package';

import * as React from "react";
const { useState } = React;


export default function fetchTrialStudentPackageHook () {




  const [TrialStudentPakageObj, setTrialStudentPakage] = useState<{[key: string] : TrialStudentPackage}>({})

 


  const fetchTrialStudentPakage = async (ids: string[]) => {

    const condition = {
      page: 1,
      offset: ids.length,
      query: {
        studentId: {
          $in: ids
        }
      }
    }

 
    const {
      data: {
        data: { list }
      }
    } = await api.getTrialStudentPackageList(condition)

    const obj: any = {};
    list.forEach(item => {
      obj[item.studentId] = item
    })
    setTrialStudentPakage({
      ...TrialStudentPakageObj,
      ...obj
    })


  }



  return {
    TrialStudentPakageObj,
    setTrialStudentPakage,
    fetchTrialStudentPakage
  }
}