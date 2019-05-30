export interface IRoutes {
  path: string;
  component: any;
  routes?: IRoutes[];
}