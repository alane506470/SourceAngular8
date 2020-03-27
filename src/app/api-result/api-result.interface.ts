export interface RootObject {
    status: string;
    errorCode?:any;
    message?: any;
    data: Data;
}
export interface CommRootObject {
    status: string;
    errorCode?: any;
    message?: any;
    data: any[];
  }

export interface Data {
    total: number;
    list: any[];
    pageNum: number;
    pageSize: number;
    size: number;
    startRow: number;
    endRow: number;
    pages: number;
    prePage: number;
    nextPage: number;
    isFirstPage: boolean;
    isLastPage: boolean;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
    navigatePages: number;
    navigatepageNums: any[];
    navigateFirstPage: number;
    navigateLastPage: number;
    firstPage: number;
    lastPage: number;
}

export interface AppMember {
    memberId: string;
    mobile?: any;
    jpgUrl?: any;
    isRegister: string;
    appRegDate: string;
    firstLogin: string;
    lastLogin: string;
    createDate: string;
    creator: string;
    modifyDate: string;
    modifier: string;
  }

export interface AppCutList {
    cutId: string;
    cutDesc: string;
    schema?: any;
    createDate: string;
    creator: string;
    modifyDate?: any;
    modifier?: any;
}

export interface AppStoreList {
    storeId: string;
    companyId: string;
    channelId: string;
    channelName: string;
    areaId: string;
    siteId: string;
    storeName: string;
    tel: string;
    address: string;
    openHour: string;
    latitute: number;
    longitude: number;
    lineId?: string | string;
    serviceExt?: any;
    stBoth: string;
    srTool: string;
    srPaint: string;
    srWood: string;
    srEmb: string;
    createDate: string;
    creator: string;
    modifier?: any;
    modifyDate?: any;
    srAll: string;
    srMaker: string;
    srLearn: string;
    stMap?: string;
  }

export interface AppCodeList {
    codeClass: string;
    codeNo: string;
    classExplain: string;
    codeExplain: string;
    parentCodeClass?: any;
    parentCodeNo?: any;
    codeStatus?: any;
    createDate: string;
    creator: string;
    modifyDate?: any;
    modifier?: any;
}

export interface AppCouponMstList {
    grno: string;
    name: string;
    channelId: string;
    giftType: string;
    startDate: string;
    endDate: string;
    grDesc: string;
    grJpg?: any;
    grAmount: number;
    grLink?: any;
    grUsage?: any;
    grStatus: string;
    applyMem: string;
    msgYn: string;
    msgId: string;
    createDate: string;
    creator: string;
    modifyDate: string;
    modifier: string;
    applyMem_TW?: string; // add for 分辨會員
    channelId_TW?: string; // add for 分辨通路
    grStatus_TW?: string; // add for 分辨表單狀態
}

  export interface AppMemberLikesList {
    memberId: string;
    likeType: string;
    likeValue: string;
    createDate: string;
    creator: string;
    modifyDate: string;
    modifier: string;
    descr: string;
    classExplain: string;
    codeExplain: string;
  }

export interface AppBonusMstList {
    marketId: string;
    name: string;
    channelId: string;
    startDate: string;
    endDate: string;
    bsDesc: string;
    bsJpg?: any;
    bonus: number;
    bsLink: string;
    bsStatus: string;
    applyMem: string;
    msgYn: string;
    msgId?: any;
    bsType: string;
    bsCond: string;
    createDate: string;
    creator: string;
    modifyDate?: any;
    modifier?: any;
    applyMem_TW?: string; // add for 分辨會員
    channelId_TW?: string; // add for 分辨通路
    bsStatus_TW?: string; // add for 分辨表單狀態
}

export interface AppPushMstList {
    pushId: string;
    msgId: string;
    actId?: any;
    channelId: string;
    grno?: string;
    marketId?: any;
    surId?: string;
    pushSub: string;
    pushText: string;
    pushSendDate?: string;
    pushEndDate?: string;
    applyMem?: string;
    pushStatus?: string;
    estPushTime?: any;
    createDate: string;
    creator: string;
    modifyDate: string;
    modifier: string;
    applyMem_TW?: string; // add for 分辨會員
    pushStatus_TW?: string; // add for 分辨表單狀態
}

export interface AppMsgMstList {
    msgId: string;
    msgType?: any;
    grno?: any;
    marketId?: any;
    actId?: any;
    // pushNoteFlag?: any;
    // pushNoteSub?: any;
    // pushNoteTxt?: any;
    msgSub?: any;
    msgTxt?: any;
    msgJpg?: any;
    msgUrlApp?: any;
    msgUrlWeb?: any;
    msgSendDate?: any;
    msgEndDate?: any;
    applyMem?: any;
    msgStatus?: any;
    recCount?: any;
    openCount?: any;
    // secPushFlag?: any;
    createDate?: any;
    creator?: any;
    modifyDate?: any;
    modifier?: any;
    applyMem_TW?: string; // add for 分辨會員
    msgType_TW?: string; // add for 分辨訊息類別
    msgStatus_TW?: string; // add for 分辨表單狀態
}

export interface AppActMstList {
    commName?: any;
    commId?: any;
    commIds?: any;
    actId: string;
    actDesc?: any;
    cutId?: any;
    startDate?: any;
    endDate?: any;
    actStatus?: any;
    createDate?: any;
    creator?: any;
    modifyDate?: any;
    modifier?: any;
    actdtl: AppActdtl[];
    actStatus_TW?: any;
}

export interface AppActdtl {
    commId?: any;
    actId: string;
    actDtlSeq?: number;
    actType?: any;
    actSjpgSch?: any;
    jpgSeq?: any;
    actSjpgLink?: any;
    actBjpgSch?: any;
    actBjpgLink?: any;
    sku?: any;
    skuName?: any;
    skuSeq?: any;
    skuJpgSch?: any;
    lastLev?: any;
    createDate?: any;
    creator?: any;
    modifyDate?: any;
    modifier?: any;
}

export interface ActdtlTemp {
    actId: string;
    actDtlSeq?: number;
    actType?: any;
    actSjpgSch?: any;
    jpgSeq?: any;
    actSjpgLink?: any;
    actBjpgSch?: any;
    actBjpgLink?: any;
    sku?: any;
    skuName?: any;
    skuSeq?: any;
    skuJpgSch?: any;
    lastLev?: any;
    createDate?: any;
    creator?: any;
    modifyDate?: any;
    modifier?: any;
}

export interface AppGameMstList {
    gameId: string;
    gameDesc: string;
    channelId: string;
    startDate: string;
    endDate: string;
    gameStatus: string;
    level: number;
    goal: number;
    createDate: string;
    creator: string;
    modifyDate?: any;
    modifier?: any;
    gamedtl: Gamedtl[];
    gamegoal: Gamegoal[];
    gameStatus_TW?: any;
    channelId_TW?: string; // add for 分辨通路
    frequency: number;
}

export interface Gamegoal {
    gameId: string;
    levId: number;
    goalId: number;
    grno: string;
    marketId?: any;
    createDate?: string;
    creator?: string;
    modifyDate?: any;
    modifier?: any;
    rebateMethod?: string;
}

export interface Gamedtl {
    gameId: string;
    levId: number;
    levName: string;
    sku: string;
    qrCode?: any;
    createDate?: string;
    creator?: string;
    modifyDate?: any;
    modifier?: any;
}

export interface Appclusterprod {
    channelId: string;
    startDate: any;
    endDate: any;
}

export interface AppclusterprodList {
    clusterId?: string;
    clusterDesc?: string;
    sku?: string;
    skuName?: string;
}

export interface CommInfo {
  commId: string;
  commName: string;
  commAdd1: string;
  commAdd2: string;
  commAdd3: String;
  siteInCharge: String;
  userInCharge: String;
  numHouse: String;
  status?: String;
  rank?: String;
  chiefStaffName?: String;
  chiefStaffTel?: String;
  chiefStaffMobile?: String;
  chairmanName?: String;
  chairmanTel?: String;
  chairmanMobile?: String;
}

export interface Construction {
  buildCompany?: String;
  buildDate?: String;
  commType?: Array<any>;
  commPattern?: Array<any>;
  interiorType?: Array<any>;
  buildExterior?: Array<any>;
}

export interface Air {
  acType?: String;
  windowType?: Array<any>;
  separateType?: Array<any>;
  indoorType?: Array<any>;
  sunType?: Array<any>;
}

export interface Bath {
  bathType?: Array<any>;
  bathWall?: String;
  toiletPipe?: String;
  toiletShape?: String;
  bathBrand?: String;
  sinkIn?: String;
  sinkOut?: String;
  kitchen?: String;
  balcony?: String;
  balconyW?: String;
  washlet?: Array<any>;
  plug?: Array<any>;
  hanger?: String;
}

export interface Household {
  orgType?: String;
  orgTee?: String;
  housePrice?: String;
  householdType?: String;
  appYn?: String;
  appName?: String;
}

export interface Hydropwer {
  gasType?: String;
  voltage?: String;
  cpipeType?: String;
  hpipeType?: String;
}

export interface Marketing {
  marketType?: Array<any>;
  dmMethod?: Array<any>;
}

export interface Other {
  trash?: String;
  trashTime?: String;
}

export interface FsCommMst {
  commId: string;
  commName: string;
  commAdd1: string;
  commAdd2: string;
  commAdd3: String;
  siteInCharge: String;
  userInCharge: String;
  numHouse: String;
  status?: String;
  rank?: String;
  chiefStaffName?: String;
  chiefStaffTel?: String;
  chiefStaffMobile?: String;
  chairmanName?: String;
  chairmanTel?: String;
  chairmanMobile?: String;
  buildCompany?: String;
  buildDate?: String;
  orgType?: String;
  orgTee?: String;
  housePrice?: String;
  householdType?: String;
  appYn?: String;
  appName?: String;
  gasType?: String;
  voltage?: String;
  cpipeType?: String;
  hpipeType?: String;
  bathType?: Array<any>;
  bathWall?: String;
  toiletPipe?: String;
  toiletShape?: String;
  bathBrand?: String;
  sinkIn?: String;
  sinkOut?: String;
  kitchen?: String;
  balcony?: String;
  balconyW?: String;
  washlet?: Array<any>;
  plug?: Array<any>;
  hanger?: String;
  remark?: String;
  commType?: Array<any>;
  commPattern?: Array<any>;
  interiorType?: Array<any>;
  buildExterior?: Array<any>;
  acType?: String;
  windowType?: Array<any>;
  separateType?: Array<any>;
  indoorType?: Array<any>;
  sunType?: Array<any>;
  trash?: String;
  trashTime?: String;
  marketType?: Array<any>;
  dmMethod?: Array<any>;
  commAdd1Name?: String;
  commAdd2Name?: String;
  siteInChargeName?: String;
  userInChargeName?: String;
}

