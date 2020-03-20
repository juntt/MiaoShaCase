package com.imooc.miaoshaproject.service;

import com.imooc.miaoshaproject.service.model.PromoModel;

/**
 * Created by hzllb on 2018/11/18.
 */
public interface PromoService {
    //根据itemid获取即将进行的或正在进行的秒杀活动
    PromoModel getPromoByItemId(Integer itemId);
}
