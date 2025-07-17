import {
  duodecimalCycleMonth,
  monthToken,
  decimalCycle,
  solarTerms,
  sixty,
  dengGui,
  tenGod,
  duodecimalCycle,
  mingGongDuoDecimalCycle,
  shenGong,
  duodecimalCycleToDecimalCycle
} from './config.js';

type TimeResult = string[];
type DateResult = { year: number, month: string, day: string };

const yu = {
  setTime: (): string => {
    return new Date().getHours().toString();
  },

  setDate: (year?: number, month?: string, day?: string): DateResult => {
    const now = new Date();
    const yearDate = now.getFullYear();
    const monthDate = now.getMonth(); // 0-based
    const date = now.getDate();

    if (year === undefined) {
      year = yearDate;
    }
    if (month === '' || month === undefined) {
      month = monthDate + 1 < 9
        ? `0${(monthDate + 1).toString()}`
        : (monthDate + 1).toString();
    }
    if (day === '' || day === undefined) {
      day = date < 9
        ? `0${(date).toString()}`
        : date.toString();
    }

    return { year, month, day };
  },

  /**
   * @param {string} chinese first word 配
   * @param {string} chinese first word 命
   * @returns {string} 十神
   */
  findTenGod: (_with: string, _life: string): string => {
    // console.log('findTenGod', _with, _life, decimalCycle)
    return tenGod[decimalCycle.indexOf(_with)][decimalCycle.indexOf(_life)];
  },
  /**
   * @param {string} chineseDay first word
   * @param {string} twentyFourWeather
   * @returns {string} 登貴
   */
  findDengGui: (countryDay: string, twentyFourWeather: string): string => {
    const decimalNumber = decimalCycle.indexOf(countryDay);
    const solarTermsNumber = yu.dengGuiSolarTerms(twentyFourWeather);
    return dengGui[decimalNumber][solarTermsNumber];
  },

  /**
   * 此年度所有的月令(柱)
   * @param {string} 丁卯
   * @returns {array} [壬寅, 癸卯, 甲辰, 乙巳, 丙午...]
   */
  lunarMonthByYear: (year: string): string[] => {
    const yearFirstCh = year.toString().charAt(0);
    const baseYear = decimalCycle.indexOf(yearFirstCh);

    let index = 4;
    if ([0, 5].includes(baseYear)) index = 0;
    else if ([1, 6].includes(baseYear)) index = 1;
    else if ([2, 7].includes(baseYear)) index = 2;
    else if ([3, 8].includes(baseYear)) index = 3;

    return monthToken[index].map((val, idx) => decimalCycle[val] + duodecimalCycleMonth[idx]);
  },
  /**
  * 節氣(月令) --> 月份
  * @param {string} 節氣
  * @returns {string} 二月 正月
  */
  solarTermToLunarMonth: (solarTerm: string): string => {
    const num = solarTerms.indexOf(solarTerm);
    if ([0, 23].includes(num)) return '正月';
    if ([1, 2].includes(num)) return '二月';
    if ([3, 4].includes(num)) return '三月';
    if ([5, 6].includes(num)) return '四月';
    if ([7, 8].includes(num)) return '五月';
    if ([9, 10].includes(num)) return '六月';
    if ([11, 12].includes(num)) return '七月';
    if ([13, 14].includes(num)) return '八月';
    if ([15, 16].includes(num)) return '九月';
    if ([17, 18].includes(num)) return '十月';
    if ([19, 20].includes(num)) return '十一月';
    return '十二月';
  },
  /**
   * 節前節後
   * @param {string} hour
   * @returns {string} 地支
   */
  hourToDuodecimalCycle: (time: string): string => {
    const hour = parseInt(time, 10);
    if (hour === 23 || hour === 0) return '子';
    if (hour === 1 || hour === 2) return '丑';
    if (hour === 3 || hour === 4) return '寅';
    if (hour === 5 || hour === 6) return '卯';
    if (hour === 7 || hour === 8) return '辰';
    if (hour === 9 || hour === 10) return '巳';
    if (hour === 11 || hour === 12) return '午';
    if (hour === 13 || hour === 14) return '未';
    if (hour === 15 || hour === 16) return '申';
    if (hour === 17 || hour === 18) return '酉';
    if (hour === 19 || hour === 20) return '戌';
    return '亥';
  },

  findTime: (lunarDayFirstWord: string): TimeResult => {
    let result: TimeResult = [];
    if (['甲', '己'].includes(lunarDayFirstWord)) {
      result = yu.findTimeCompute(0, 11);
    } else if (['乙', '庚'].includes(lunarDayFirstWord)) {
      result = yu.findTimeCompute(12, 23);
    } else if (['丙', '辛'].includes(lunarDayFirstWord)) {
      result = yu.findTimeCompute(24, 35);
    } else if (['丁', '壬'].includes(lunarDayFirstWord)) {
      result = yu.findTimeCompute(36, 47);
    } else {
      result = yu.findTimeCompute(48, 59);
    }
    return result;
  },

  findTimeCompute: (start: number, end: number): TimeResult => {
    const timeArray: TimeResult = [];
    for (let i = start; i <= end; i++) {
      timeArray.push(sixty[i]);
    }
    return timeArray;
  },

  /**
   * 登貴節氣 deng_gui[X][Y]
   * return Y
   */
  dengGuiSolarTerms: (solarTerm: string): number => {
    const num = solarTerms.indexOf(solarTerm);
    return Math.floor(num / 2);
  },

  mingAndShen: (
    chineseYear: string,
    chineseMonth: string,
    chineseTime: string,
    item: 'Ming' | 'Shen'
  ): string => {
    const down = duodecimalCycleMonth.indexOf(chineseMonth.charAt(1));
    const top = duodecimalCycle.indexOf(chineseTime.charAt(1));
    let result: string;

    if (item === 'Ming') {
      result = yu.getDuodecimalCycleToDecimalCycle(
        mingGongDuoDecimalCycle[top][down],
        chineseYear
      );
      return `${result}${mingGongDuoDecimalCycle[top][down]}`;
    }

    result = yu.getDuodecimalCycleToDecimalCycle(shenGong[top][down], chineseYear);
    return `${result}${shenGong[top][down]}`;
  },
  /**
   * 地支查天干  使用於身宮和命宮
   * @param {String} decimalCycle 地支
   * @param {String} chineseYear 
   */
  getDuodecimalCycleToDecimalCycle: (decimalCycleInput: string, chineseYear: string): string => {
    const down = duodecimalCycleMonth.indexOf(decimalCycleInput);
    const word = chineseYear.charAt(0);
    if ('甲己'.includes(word)) return duodecimalCycleToDecimalCycle[0][down];
    if ('乙庚'.includes(word)) return duodecimalCycleToDecimalCycle[1][down];
    if ('丙辛'.includes(word)) return duodecimalCycleToDecimalCycle[2][down];
    if ('丁壬'.includes(word)) return duodecimalCycleToDecimalCycle[3][down];
    return duodecimalCycleToDecimalCycle[4][down];
  },

  verifyAge: (chineseAge?: string): boolean => {
    return !(chineseAge === '請輸入年齡' || chineseAge == '' || chineseAge === undefined);
  },
  getChineseAgeInfo: function (
    birthDate: Date,
    now: Date = new Date()
  ): {
    westernAge: number;
    chineseAge: number;
    chineseYear: string;
  } {
    const heavenlyStems = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
    const earthlyBranches = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

    const birthYear = birthDate.getFullYear();
    const currentYear = now.getFullYear();

    // 1. 实足年龄（满周岁）
    let westernAge = currentYear - birthYear;
    const hasBirthdayPassedThisYear =
      now.getMonth() > birthDate.getMonth() ||
      (now.getMonth() === birthDate.getMonth() && now.getDate() >= birthDate.getDate());

    if (!hasBirthdayPassedThisYear) {
      westernAge -= 1;
    }

    // 2. 虚岁年龄（出生时1岁，每过农历新年加1岁）
    const chineseAge = currentYear - birthYear + 1;

    // 3. 干支年（60年一轮，从甲子开始，1984年为甲子）
    const baseYear = 1984; // 甲子年
    const offset = (birthYear - baseYear + 60) % 60;
    const gan = heavenlyStems[offset % 10];
    const zhi = earthlyBranches[offset % 12];
    const chineseYear = gan + zhi;

    return {
      westernAge,
      chineseAge,
      chineseYear
    }
  }

};

export default yu;