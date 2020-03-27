export interface PcmSkubject {
    b2bSpec?: any;
    deleteFlag: boolean;
    materialGroup: string;
    productControls: ProductControl[];
    productGeometries: ProductGeometry[];
    salesChannel: string;
    err_MSG?: any;
    b2Bfeature?: any;
    skuNumber: string;
    skuName: string;
    ecallowedToSell: boolean;
    productEans: ProductEan[];
    galleryImage01: any[];
    status: string;
    err_CODE?: any;
    description?: any;
}

export interface ProductEan {
    eanCategory: string;
    eanUnit: string;
    eanUpc: string;
}

export interface ProductGeometry {
    height: number;
    width: number;
    numerator: number;
    suiteContent: string;
    suiteNumber?: any;
    grossWeight: number;
    lengthUnit: string;
    volume?: any;
    volumeunit?: any;
    weightUnit: string;
    length: number;
}

export interface ProductControl {
    holdFlag: boolean;
    storeNumber: string;
    deleteFlag: boolean;
}
