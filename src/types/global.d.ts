
declare interface ILabelVal<T=string> {
    label: string,
    value: T
}


declare type Omit<T, K> = Pick<T, Exclude<keyof T, K>>

/**
 * 标签映射
 */
declare type LabelMapping<T extends string | number> = Partial<Record<T, string>>

/**
 * 列表
 */
type CompareType1 = '$gt' | '$lt' | '$lte' | '$gte' | '$ne'
type CompareType2 = '$eq'
type CompareType3 = '$in' | '$nin'

type QueryValue = Record<CompareType1, number | string> & 
Record<CompareType2, string | number> &
Record<CompareType3, number[] | string[]>

declare interface QueryCondition<T> {
  filter?: Array<keyof T>
  page?: number
  limit?: number
  size?: number
  query?: Partial<Record<keyof T, Partial<QueryValue> | string | boolean | number>>
  sort?: Partial<Record<keyof T, 'asc' | 'desc' | 1 | -1>>
  like?: Partial<Record<keyof T, string>>
}


declare type HOC<InjectProps> = <Props extends InjectProps>(Component: React.ComponentType<Props>) => React.ComponentType<Omit<Props, keyof InjectProps>>;

// $eq	Matches values that are equal to a specified value.
// $gt	Matches values that are greater than a specified value.
// $gte	Matches values that are greater than or equal to a specified value.
// $in	Matches any of the values specified in an array.
// $lt	Matches values that are less than a specified value.
// $lte	Matches values that are less than or equal to a specified value.
// $ne	Matches all values that are not equal to a specified value.
// $nin	Matches none of the values specified in an array.