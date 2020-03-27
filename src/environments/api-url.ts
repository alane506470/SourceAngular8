// hank add for API URL
export const ApiUrl = {
  appCodes_path: 'loyalty-empapi/loyalty/employee/appCodes',

  appBonuss_path: 'loyalty-empapi/loyalty/employee/appBonuss',
  appBonus_getNextMarketId_path: 'loyalty-empapi/loyalty/employee/getNextMarketId',
  appBonus_file_upload_path: 'loyalty-empapi/loyalty/employee/appBonusMem/',
  appBonus_path: 'loyalty-empapi/loyalty/employee/appBonus',
  appBonus_delete_path: 'loyalty-empapi/loyalty/employee/appBonus/',

  appCoupons_path: 'loyalty-empapi/loyalty/employee/appCoupons',
  appCoupon_file_upload_path: 'loyalty-empapi/loyalty/employee/appCouponMem/',
  appCoupon_path: 'loyalty-empapi/loyalty/employee/appCoupon',
  appCoupon_delete_path: 'loyalty-empapi/loyalty/employee/appCoupon/',

  appMsg_getNextMsgId_path: 'loyalty-empapi/loyalty/employee/getNextMsgId',
  appMsg_memfile_upload_path: 'loyalty-empapi/loyalty/employee/appMsgDtl/',
  appMsg_jpgfile_upload_path: 'loyalty-empapi/loyalty/employee/appMsgMstJpg/',
  appMsg_path: 'loyalty-empapi/loyalty/employee/appMsgMst',
  appMsg_delete_path: 'loyalty-empapi/loyalty/employee/appMsgMst/',
  appMsgs_path: 'loyalty-empapi/loyalty/employee/appMsgMsts',

  appAct_getNextActId_path: 'loyalty-empapi/loyalty/employee/getNextActId',
  appCut_path: 'loyalty-empapi/loyalty/employee/appCuts',
  appAct_file_upload_path: 'loyalty-empapi/loyalty/employee/appActJpg/',
  appActs_path: 'loyalty-empapi/loyalty/employee/appActs',
  appAct_delete_path: 'loyalty-empapi/loyalty/employee/appAct/',
  appAct_path: 'loyalty-empapi/loyalty/employee/appAct',


  appPush_getNextActId_path: 'loyalty-empapi/loyalty/employee/getNextPushId',
  appPush_file_upload_path: '/loyalty-empapi/loyalty/employee/appPushDtl/',
  appPush_path: 'loyalty-empapi/loyalty/employee/appPushMst',
  appPushs_path: 'loyalty-empapi/loyalty/employee/appPushMsts',
  appPush_delete_path: 'loyalty-empapi/loyalty/employee/appPushMst/',

  appSendMsg: 'loyalty-empapi/loyalty/employee/appSendMsg',
  appTask: 'loyalty-empapi/loyalty/employee/appSendMsgCronJob',
  appPushNote: 'loyalty-empapi/loyalty/employee/appPushNote',
  appPushTask: 'loyalty-empapi/loyalty/employee/AppPushCronJob',
  appPublish: 'loyalty-empapi/loyalty/employee/appPublish',

  appCouponList: 'crm-empapi/crm/employee/getMmCouponList',

  appGame_getNextGameId_path: 'loyalty-empapi/loyalty/employee/getNextGameId',
  appGame_path: 'loyalty-empapi/loyalty/employee/appGame',
  appGames_path: 'loyalty-empapi/loyalty/employee/appGames',
  appGame_delete_path: 'loyalty-empapi/loyalty/employee/appGame/',
  appGame_download_QRcode: 'loyalty-empapi/loyalty/employee/appGame/downloadQRcode',

  appMemQry: 'loyalty-empapi/loyalty/employee/appMemQry',
  appMemLikesQry: 'loyalty-empapi/loyalty/employee/memLikeQry',

  appStoreQry: 'loyalty-empapi/loyalty/employee/appStore',

  appClusterProd_file_upload_path: 'loyalty-empapi/loyalty/employee/appClusterProd',

  appClusterProd_path: 'loyalty-empapi/loyalty/employee/getAppClusterProd',

  appRepairQuery_path: 'fds-empapi/fieldservice/employee/repairQuery',
  appRepairUpdate_path: 'fds-empapi/fieldservice/employee/repairUpdate',


  // 新增社區app功能
  appFunction_path: 'fds-empapi/fieldservice/employee/getFuncList',

  appCreateComm_path: 'fds-empapi/fieldservice/employee/createComm',
  appCommQuery_path: 'fds-empapi/fieldservice/employee/queryComm',
  appCommunityUpdate_path: 'fds-empapi/fieldservice/employee/updateComm',


  appMemberInfo_path: 'fds-empapi/fieldservice/employee/memberInfo',
  appManagerInfo_path: 'fds-empapi/fieldservice/employee/managerInfo',

  appExportMember_path: 'fds-empapi/fieldservice/employee/exportMemberInfo',
  appExportManager_path: 'fds-empapi/fieldservice/employee/exportManagerInfo',
  appQueryAllComm_path: 'fds-empapi/fieldservice/employee/queryAllComm',

  // 廣告
  appAdv_getNextAdvId_path: 'fds-empapi/fieldservice/employee/getNextActId',
  appAdv_getCut_path: 'fds-empapi/fieldservice/employee/appCuts',
  appAdv_act_status_path: 'fds-empapi/fieldservice/employee/fsCode/act_status',
  appAdv_act_type_path: 'fds-empapi/fieldservice/employee/fsCode/act_type',
  appAdv_delete_path: 'fds-empapi/fieldservice/employee/appAct/',
  appAdv_file_upload_path: 'fds-empapi/fieldservice/employee/appActJpg/',
  appAdv_path: 'fds-empapi/fieldservice/employee/appAct',
  // 廣告發佈
  appAdv_publish_path: 'fds-empapi/fieldservice/employee/appPublish/',
  // 廣告查詢
  appAdvs_path: 'fds-empapi/fieldservice/employee/appActs',

  // 新增管理員
  appAddCommAdmin_path: 'fds-empapi/fieldservice/employee/addAdmin',
  // 報表
  appExportBranch_path: 'loyalty-empapi/loyalty/employee/appStoreDownload',
  appExportPreference_path: 'loyalty-empapi/loyalty/employee/appMemLikes',
  appCounty_path: 'fds-empapi/fieldservice/employee/fsAddress',
  fs_comm_type_path: 'fds-empapi/fieldservice/employee/fsCode/comm_type',
  fs_comm_pattern_path: 'fds-empapi/fieldservice/employee/fsCode/pattern',
  fs_comm_interior_path: 'fds-empapi/fieldservice/employee/fsCode/interior',
  fs_comm_exterior_path: 'fds-empapi/fieldservice/employee/fsCode/exterior',
  fs_comm_ac_window_path: 'fds-empapi/fieldservice/employee/fsCode/window',
  fs_comm_ac_seperate_path: 'fds-empapi/fieldservice/employee/fsCode/separate',
  fs_comm_ac_indoor_path: 'fds-empapi/fieldservice/employee/fsCode/indoor',
  fs_comm_ac_sun_path: 'fds-empapi/fieldservice/employee/fsCode/sun',
  // 衛浴
  fs_comm_bath_type_path: 'fds-empapi/fieldservice/employee/fsCode/bath_type',
  fs_comm_bath_wall_path: 'fds-empapi/fieldservice/employee/fsCode/bath_wall',
  fs_comm_toilet_p_path: 'fds-empapi/fieldservice/employee/fsCode/toilet_p',
  fs_comm_bath_brand_path: 'fds-empapi/fieldservice/employee/fsCode/bath_brand',
  fs_comm_toilet_plug_path: 'fds-empapi/fieldservice/employee/fsCode/plug',
  fs_comm_washlet_path: 'fds-empapi/fieldservice/employee/fsCode/washlet',
  fs_comm_toilet_s_path: 'fds-empapi/fieldservice/employee/fsCode/toilet_s',
  fs_comm_kitchen_path: 'fds-empapi/fieldservice/employee/fsCode/kitchen',
  fs_comm_sink_in_path: 'fds-empapi/fieldservice/employee/fsCode/sink_in',
  fs_comm_sink_out_path: 'fds-empapi/fieldservice/employee/fsCode/sink_out',
  fs_comm_balcony_path: 'fds-empapi/fieldservice/employee/fsCode/balcony',
  fs_comm_balcony_w_path: 'fds-empapi/fieldservice/employee/fsCode/balcony_w',
  fs_comm_hanger_path: 'fds-empapi/fieldservice/employee/fsCode/hanger',
  // 行銷
  fs_comm_marketing_path: 'fds-empapi/fieldservice/employee/fsCode/market',
  fs_comm_marketing_dm_path: 'fds-empapi/fieldservice/employee/fsCode/dm',
  // 其他
  fs_comm_trash_type: 'fds-empapi/fieldservice/employee/fsCode/trash',
  // 行程類別
  fs_visit_path: 'fds-empapi/fieldservice/employee/fsCode/visit',
  // 接處方式
  fs_contact_path: 'fds-empapi/fieldservice/employee/fsCode/contact',
  // 接觸對象
  fs_contact_p_path: 'fds-empapi/fieldservice/employee/fsCode/contact_p',
  fs_app_yn_path: 'fds-empapi/fieldservice/employee/fsCode/app_yn',
  fs_app_name_path: 'fds-empapi/fieldservice/employee/fsCode/app_name',
  fs_rank_path: 'fds-empapi/fieldservice/employee/fsCode/rank',
  fs_license_path: 'fds-empapi/fieldservice/employee/fsCode/license',
  fs_household_type_path: 'fds-empapi/fieldservice/employee/fsCode/household',
  fs_site_in_charge_path: 'fds-empapi/fieldservice/employee/fsCode/site',
  fs_status_path: 'fds-empapi/fieldservice/employee/fsCode/status',
  fs_gas_type_path: 'fds-empapi/fieldservice/employee/fsCode/gas_type',
  fs_voltage_path: 'fds-empapi/fieldservice/employee/fsCode/voltage',
  fs_cpip_path: 'fds-empapi/fieldservice/employee/fsCode/cpipe',
  fs_hpip_path: 'fds-empapi/fieldservice/employee/fsCode/hpipe',
  fs_comm_ac_type: 'fds-empapi/fieldservice/employee/fsCode/ac_type',
  fs_auth_st_path: 'fds-empapi/fieldservice/employee/fsCode/auth_st',
  // 社區編號
  fs_nextCommId_path: 'fds-empapi/fieldservice/employee/getNextCommId',
  // 所有管家
  fs_user_in_charge_path: 'fds-empapi/fieldservice/employee/queryAllMgr',
  // 主檔
  fs_query_comm_mst_path: 'fds-empapi/fieldservice/employee/fsCommMst',
  fs_create_comm_mst_path: 'fds-empapi/fieldservice/employee/createfsCommMst',
  fs_update_comm_mst_path: 'fds-empapi/fieldservice/employee/updatefsCommMst',
  // 管家
  fs_create_mgr_mst_path: 'fds-empapi/fieldservice/employee/createfsMgrMst',
  fs_update_mgr_mst_path: 'fds-empapi/fieldservice/employee/updatefsMgrMst',
  fs_query_mgr_mst_path: 'fds-empapi/fieldservice/employee/queryfsMgrMst',
  // 附件
  fs_create_mgr_attach_path: 'fds-empapi/fieldservice/employee/fsMgrAttach',
  fs_del_mgr_attach_path: 'fds-empapi/fieldservice/employee/fsMgrAttach',
  // 行事曆
  fs_create_mgr_calendar_path: 'fds-empapi/fieldservice/employee/fsMgrCalendar',
  fs_update_mgr_calendar_path: 'fds-empapi/fieldservice/employee/fsMgrCalendar',
  fs_next_calendarId_path: 'fds-empapi/fieldservice/employee/getNextCalendar',
  // 地址
  fs_create_comm_addr: 'fds-empapi/fieldservice/employee/fsCommAddr',
  fs_update_comm_addr: 'fds-empapi/fieldservice/employee/fsCommAddr',

  fs_export_mst_path: 'fds-empapi/fieldservice/employee/exportfsMgrMst',
  fs_export_calendar_path: 'fds-empapi/fieldservice/employee/exportfsMgrCalendar'
};
