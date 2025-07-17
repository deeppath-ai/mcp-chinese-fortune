export interface SolarTermItem {
    title: string;
}

export interface ParserResult {
    previous: string;
    current: string;
    next: string;
    solarTermsSplit: boolean;
}

export interface LunarDate {
    month: string;
    day: number;
}


export interface BasicLunarJson {
    year: number;
    month: string;
    day: string;
    hour?: string;

    solarTerms: string;
    lunarMonth: string;
    lunarDay: string;
    lunarMonthDigit: number;
    lunarDayDigit: number;
    isLunarLeapMonth: boolean;
    leapMonth: number;
    chineseYear: string;
    chineseMonth: string;
    chineseDay: string;
    chineseTimes: string[];
    week: string;
    animal: string;
    constellation: string;
    chineseFeb: boolean;

    
    westernAge?: number;
    chineseAge?: number;
    
    nayin?: string;
    chineseTime?: string;
    chineseTimesTenGod?: string[] | string;
    chineseTimeTenGod?: string;
    chineseYearTenGod?: string;
    chineseMonthTenGod?: string;
    chineseDayTenGod?: string;
    dengGui?: string[] | string
    lunarPerMonthHasDays?: string[];
    solarTermDistance?: {
        previous: Record<string, any>,
        next: Record<string, any>
    };

    purpleWhites?:  string[] | string;
    taiYuan?: string;
    mingGong?: string;
    shenGong?: string;

}
