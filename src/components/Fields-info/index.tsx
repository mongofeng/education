import * as React from 'react';
import './index.css'
/**
 * 字段配置接口
 */
export interface IField {
  prop: string
  label: string
  labelWidth?: number
  render?(params: { data: any, field: string }): React.ReactNode
}

/**
 * 字段列表数据接口
 */
export type IFieldsInfoData<T = {
  [key: string]: string
}> = {
  [P in keyof T]: T[P]
}

/**
 * 
 */
interface IProps {
  data: IFieldsInfoData
  fields: IField[]
  column?: number
  labelWidth?: number
  gap?: number
}

class FieldInfo extends React.PureComponent<IProps> {
  /**
   * 样式
   */
  fieldStyles = () => {
    return {
      width: `${(100 / (this.props.column || 2))}%`,
      paddingLeft: `${this.props.gap || 20}px`,
    }
  }
  /**
   * 标签样式
   * @param field 当前字段配置
   */
  getLabelStyle = (field: IField) => {
    const { labelWidth = this.props.labelWidth || 90 } = field

    return {
      width: `${labelWidth}px`,
    }
  }

  render() {
    return (
      <div className="fields-info clearfix">
        {this.props.fields.map(item => {
          return (
            <div className="fields-info__item" key={item.prop} style={this.fieldStyles()}>
              <div
                className="label"
                style={this.getLabelStyle(item)}>
                {item.label}:
                </div>
              <div className="value">
                {item.render ? item.render({ data: this.props.data || {}, field: item.prop }) : (this.props.data && this.props.data[item.prop]) || '-'}
              </div>
            </div>
          )
        })}
      </div>
    )
  }
}

export default FieldInfo