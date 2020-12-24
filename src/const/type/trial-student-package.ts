export interface TrialStudentPackage {
  
    _id: string,
    amount: number,
    count: number,
    createDate: string;
    id: string,
    packageId: string,
    period: number;
    studentId: string,
    updateDate: string;
    used: number;
  
}

export interface PayVo {
    packageId: string;
    studentId: string;
  }