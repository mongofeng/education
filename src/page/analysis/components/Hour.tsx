import { Bar } from "ant-design-pro/lib/Charts";
import { DatePicker } from "antd";
import * as React from "react";
import * as apiStatics from "../../../api/statistics"
import * as type from "../../../const/type/student";
import { find } from "../../../utils/util";
const { useState, useEffect } = React;

const { MonthPicker } = DatePicker;

const oneYear: any[] = [];
for (let i = 0; i < 12; i += 1) {
  oneYear.push({
    key: i + 1,
    x: `${i + 1}月`,
    y: 0
  });
}

const initList: type.IStuCountByTime[] = [];

const BarCharts: React.FC = props => {
  const initCondition: any = {
    query: {
      createDate: new Date().getFullYear()
    }
  };

  const [data, setData] = useState(initList);
  const [loading, setLoading] = useState(false);

  const [params, setParams] = useState(initCondition);

  const onDateChange = (date: any, dateString: string) => {
    setParams({
      query: {
        ...initCondition.query,
        createDate: Number(dateString)
      }
    });
  };

  const fetchData = async (reset?: boolean) => {
    if (loading) {
      return;
    }
    try {
      if (reset) {
        setParams(initCondition);
      }
      setLoading(true);
      const {
        data: { data: apiData }
      } = await apiStatics.hourCountByTime(params);
      setData(apiData);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [params]);

  const YearData: any[] = oneYear.map(item => {
    const { key } = item;
    const val = find(data, {
      props: "key",
      value: key
    });

    return {
      ...item,
      y: val ? val.count : 0
    };
  });

  const title = `${params.query.createDate}年学时统计`;

  return (
    <div className="analysis-card">
      <div className="mb10">
        <MonthPicker onChange={onDateChange} format="YYYY" />
      </div>

      <Bar height={200} title={title} data={YearData} />
    </div>
  );
};

export default BarCharts;
