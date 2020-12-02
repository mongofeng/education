import { commonQuery } from "@/api/statistics";
import { ICommonQueryParams } from "@/const/type/statistics";
import { PaginationProps } from "antd/lib/pagination";
import * as React from "react";
const { useState, useEffect } = React;

const initPagination: PaginationProps = {
  total: 0,
  current: 1,
  pageSize: 10,
  showSizeChanger: true,
  pageSizeOptions: ["5", "10", "20", "100", "200", "500", "2000"]
}

interface IProps {
  params: ICommonQueryParams
  page: PaginationProps
}


/**
 * 
 * @param initList 初始化列表的数据
 * @param fetchApi 获取数据接口
 * @param conditionProps 初始化接口的coditon
 */
export default function (props: IProps) {
  const [data, setData] = useState([]); // data
  const [loading, setLoading] = useState<boolean>(false); // loading

  const [params, setParams] = useState<ICommonQueryParams>(props.params) // 参数
  const [pagination, setPagination] = useState({
    ...initPagination,
    ...(props.page || {})
  });  // 页数


  const fetchData = async (value?: ICommonQueryParams) => {
    try {
      if (value) {
        setParams(value)
      }
      setLoading(true);
      const {
        data: {
          data
        }
      } = await commonQuery(params);
      setData(data.map(i => {
        return {
          ...i,
          name: (i.student && i.student.name) || ''
        }
      }));
      setLoading(false);
      console.log(data);
    } catch (error) {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('useEffect钩子')
    fetchData();
    return () => {
      console.log('修改上一轮钩子的问题')
    }
  }, [params]);

  return {loading, data, pagination, setParams, setPagination, fetchData}
}