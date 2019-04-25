import { PaginationProps } from "antd/lib/pagination";
import * as React from "react";
import { IApiList } from '../../types/api';
const { useState, useEffect } = React;

const initPagination: PaginationProps = {
  total: 0,
  current: 1,
  pageSize: 10,
  showSizeChanger: true,
  pageSizeOptions: ["5", "10", "20", "100"]
}

export type IFilter<T extends object> =  Partial<Record<keyof T, string[]>>

export interface IParmas<T extends object> {
  dateStr: string[]
  keyword: string
  pager: PaginationProps
  filters:IFilter<T>
  sorter: any
}

const initCondition: any = {
  limit: 10,
  page: 1, 
  sort: { createDate: -1 }
}
/**
 * 
 * @param initList 初始化列表的数据
 * @param fetchApi 获取数据接口
 * @param conditionProps 初始化接口的coditon
 */
export default function <T extends object>(initList: T[], fetchApi: IApiList<T>, conditionProps:QueryCondition<T> =  initCondition) {
  const [data, setData] = useState(initList);
  const [loading, setLoading] = useState(false);

  const [params, setParams] = useState(conditionProps)
  const [pagination, setPagination] = useState(initPagination);

  const getcondition = ({
    dateStr,
    keyword,
    filters,
    sorter,
    pager,
  }: Partial<IParmas<T>>):QueryCondition<T> => {

    const query: any = {
      ...(conditionProps.query ? conditionProps.query : {})
    };

    // 时间
    if (dateStr && dateStr[0] && dateStr[1]) {
      query.createDate = {
        $gte: `${dateStr[0]}T00:00:00.216Z`,
        $lte: `${dateStr[1]}T00:00:00.216Z`
      };
    }

    // 过滤器
    if (filters) {
      for (const [key, value] of Object.entries(filters)) {
        if (!value || !Array.isArray(value)) {
          continue;
        }
        const [val] = value;
        if (!val) {
          continue;
        }
        query[key] = val;
      }
    }
    

    // 名字的搜索
    const like: any = {};
    if (keyword) {
      like.name = keyword;
    }

    // 排序
    const sort: any = { 
      ...(conditionProps.sort ? conditionProps.sort : {})
     };
    if (sorter && sorter.columnKey) {
      sort[sorter.columnKey] = sorter.order === "ascend" ? 1 : -1;
    }

    const limit = pager ? pager.pageSize : pagination.pageSize
    const page = pager ? pager.current : pagination.current

    return {
      limit ,
      page,
      like,
      query,
      sort
    };
  };

  /**
   * 搜索
   */

  const onSearch = (key: string) => {
    setParams(getcondition({
      keyword: key
    }));
  
  };

  /**
   * 更改时间
   * @param date 
   * @param dateKey 时间参数
   */
  const onDateChange = (date: any, dateKey: string[]) => {
    console.log(date, dateKey);
    setParams(getcondition({
      dateStr: dateKey
    }));
  };

  const handleTableChange = (
    page: PaginationProps,
    filters: IFilter<T>,
    sorter: any
  ) => {
    const pager = { ...pagination, ...page };
    setPagination(pager);
    const condition = getcondition({
      pager: page,
      filters,
      sorter
    })
    setParams(condition)
  };


  const fetchData = async (reset?:boolean) => {
    try {
      if (reset) {
        setParams(conditionProps)
      }
      setLoading(true);
      const {
        data: {
          data: { list, count }
        }
      } = await fetchApi(params);
      setData(list);
      setLoading(false);

      setPagination({
        ...pagination,
        total: count
      });
      console.log(list);
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

  return {loading, data, pagination, handleTableChange, onDateChange, onSearch, fetchData}
}