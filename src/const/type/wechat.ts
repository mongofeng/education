export interface ICode {
  code: string;
}

export interface IOpenId {
  openid: string;
  access_token: string;
}

export interface IInfo {
  openid: string;
}

export interface IUserInfo {
  // "subscribe": 1
  //   "openid": "oVB5OwyVDKfTZq4T61_p2roSg1tA",
  //   "nickname": "风中跌倒不为风",
  //   "sex": 1,
  //   "language": "zh_CN",
  //   "city": "",
  //   "province": "都柏林",
  //   "country": "爱尔兰",
  //   "headimgurl": "http://thirdwx.qlogo.cn/mmopen/Usb93icYs3Wjib4QaHkJhqV2Wfibm6qz2egb9eDs6ob2GErKZH8Op1ibkBNZ9QwfqibMWkGA0jAb8lXhY65se0ecwFENzba2bYSRh/132",
  //   "subscribe_time": 1536659865,
  //   "remark": "",
  //   "groupid": 0,
  //   "tagid_list": [],
  //   "subscribe_scene": "ADD_SCENE_OTHERS",
  //   "qr_scene": 0,
  //   "qr_scene_str": ""

  subscribe: number; // 	用户是否订阅该公众号标识，值为0时，代表此用户没有关注该公众号，拉取不到其余信息。
  openid: string; // 	用户的标识，对当前公众号唯一
  nickname: string; // 	用户的昵称
  sex: number; // 	用户的性别，值为1时是男性，值为2时是女性，值为0时是未知
  city: string; // 	用户所在城市
  country: string; // 	用户所在国家
  province: string; // 	用户所在省份
  language: string; // 	用户的语言，简体中文为zh_CN
  headimgurl: string; // 	用户头像，最后一个数值代表正方形头像大小（有0、46、64、96、132数值可选，0代表640*640正方形头像），用户没有头像时该项为空。若用户更换头像，原有头像URL将失效。
  subscribe_time: number; // 	用户关注时间，为时间戳。如果用户曾多次关注，则取最后关注时间
  unionid: string; // 	只有在用户将公众号绑定到微信开放平台帐号后，才会出现该字段。
  remark: string; // 	公众号运营者对粉丝的备注，公众号运营者可在微信公众平台用户管理界面对粉丝添加备注
  groupid: string[];	 // 用户所在的分组ID（兼容旧的用户分组接口）
  tagid_list: string[];	// 用户被打上的标签ID列表
  subscribe_scene: string; // 	返回用户关注的渠道来源，ADD_SCENE_SEARCH 公众号搜索，ADD_SCENE_ACCOUNT_MIGRATION 公众号迁移，ADD_SCENE_PROFILE_CARD 名片分享，ADD_SCENE_QR_CODE 扫描二维码，ADD_SCENEPROFILE LINK 图文页内名称点击，ADD_SCENE_PROFILE_ITEM 图文页右上角菜单，ADD_SCENE_PAID 支付后关注，ADD_SCENE_OTHERS 其他
  qr_scene: string; // 	二维码扫码场景（开发者自定义）
  qr_scene_str: string; // 	二维码扫码场景描述（开发者自定义）
}
