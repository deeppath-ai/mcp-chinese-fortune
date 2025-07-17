import { week, sixty, lunarMonthGeneral, animal, lunarMonths, lunarMonthLeap, lunarLeap } from './config.js';
// import { solarTermToLunarMonth, lunarMonthByYear, hourToDuodecimalCycle, findTime,setTime } from './yu.js';
import yu from './yu.js';
import type {BasicLunarJson} from './types.js';

import GeneralLunar from './GeneralLunar.js';

class BasicLunar extends GeneralLunar {
  solarTerms: string;
  lunarMonth: string;
  lunarDay: string;
  chineseYear: string;
  chineseMonth: string;
  chineseDay: string;
  chineseTimes: string[];
  week: string;
  animal: string;
  constellation: string;
  chineseFeb: boolean;

  /**
   * 构造函数
   * @param year 西元年 YYYY (ex: "2020", "1992")
   * @param month 月 MM (ex: "01", "08", "12")
   * @param day 日 DD (ex: "01", "08", "23", "28")
   */
  constructor(year: number, month: string, day: string) {
    super(year, month, day);
    this.solarTerms = this.getSolarTerms();
    this.lunarMonth = this.getLunarMonth();
    this.lunarDay = this.getLunarDay();
    this.chineseYear = this.getChineseYearControllerYear();
    this.chineseMonth = this.getChineseMonth();
    this.chineseDay = this.getChineseDay();
    this.chineseTimes = this.getChineseTimes();
    this.week = this.getWeek();
    this.animal = this.getAnimal();
    this.constellation = this.getConstellation();
    this.chineseFeb = this.checkChineseFeb();
  }

  getChineseYear(year: number = this.year): string {
    const duodecimalCycle = '甲乙丙丁戊己庚辛壬癸'.split('');
    const decimalCycle = '子丑寅卯辰巳午未申酉戌亥'.split('');
    const computeYear = Number(year) - 4;
    return `${duodecimalCycle[computeYear % 10]}${decimalCycle[computeYear % 12]}`;
  }

  getChineseYearControllerYear(): string {
    let yearNum = Number(this.year);
    let monthNum = Number(this.month);
    const year = (monthNum === 1) ? yearNum - 1 : yearNum;
    return this.getChineseYear(year);
  }

  getChineseMonth(): string {
    return yu.lunarMonthByYear(this.chineseYear)[
      lunarMonthGeneral.indexOf(this.getLunarMonthBySolarTerms())
    ];
  }

  getChineseDay(distanceDay: number = this.distanceDay): string {
    let sixtyNumber = (distanceDay % 60) + 12;
    if (sixtyNumber > 59) sixtyNumber %= 60;
    return sixty[sixtyNumber];
  }

  getWeek(distanceDay: number = this.distanceDay): string {
    return week[distanceDay % 7];
  }

  getSolarTerms(): string {
    const { current } = this.parserFile;
    const resultArray = current.split(' ');
    return resultArray[0].substring(5, 7);
  }

  getLunarMonthBySolarTerms(solarTerms: string = this.solarTerms): string {
    return yu.solarTermToLunarMonth(solarTerms);
  }

  getLunarMonth(digit = false): string {
    const { month } = this.getLunarMonthAndDayNumber;
    if (digit) {
      const idx1 = lunarMonths.indexOf(month);
      if (idx1 !== -1) return String(idx1 + 1);
      const idx2 = lunarMonthLeap.indexOf(month);
      return String(idx2 + 1);
    }
    return String(month);
  }

  getLunarDay(digit = false): string  {
    const { day } = this.getLunarMonthAndDayNumber;
    if (digit) return String(day);
    switch (day) {
      case 10: return '初十';
      case 20: return '二十';
      case 30: return '三十';
      default:
        return (
          '初十廿'.split('')[Math.floor(day / 10)] +
          '一二三四五六七八九十'.split('')[(day - 1) % 10]
        );
    }
  }

  getChineseTimes(): string[] {
    return yu.findTime(this.chineseDay[0]);
  }

  getSolarTermsSplitWord(): [string, string] {
    const { current, solarTermsSplit: solarSplit } = this.parserFile;
    let beforeLunarResult = '';
    let splitWord = '';
    const solarTermsWord = current.split(' ');
    const getTime = solarTermsWord[2].substring(0, 2);
    const lunarMonthCh = this.lunarMonth;
    if (solarSplit === true) {
      beforeLunarResult = yu.hourToDuodecimalCycle(getTime);
      splitWord = `局管${this.chineseMonth}  令月${lunarMonthCh}`;
    }
    return [splitWord, beforeLunarResult];
  }

  getAnimal(): string {
    return animal[Number(this.year) % 12];
  }

  checkChineseFeb(): boolean {
    return Number(this.year) % 4 === 0;
  }

  getConstellation(): string {
    const words = '魔羯水瓶雙魚牡羊金牛雙子巨蟹獅子處女天秤天蠍射手魔羯';
    const monthNum = parseInt(this.month, 10);
    const dayNum = parseInt(this.day, 10);

    const cutoffChar = '102223444433'.charAt(monthNum - 1);
    // 这里 - -19 是 +19 的意思，TS写清楚一点
    const cutoffDay = parseInt(cutoffChar, 10) + 19;

    const startIndex = (monthNum * 2) - ((dayNum < cutoffDay) ? 2 : 0);

    const compute = words.substring(startIndex, startIndex + 2);

    return `${compute}座`;
    
  }

  getLeapMonth(): number {
    return lunarLeap[Number(this.year) - 1900][0];
  }

  checkLeapMonth(): boolean {
    return String(this.getLeapMonth()) === this.getLunarMonth(true);
  }

  getJson(): BasicLunarJson {
    return {
      year: this.year,
      month: this.month,
      day: this.day,
      solarTerms: this.getSolarTerms(),
      lunarMonth: this.getLunarMonth(),
      lunarDay: this.getLunarDay(),
      lunarMonthDigit: Number(this.getLunarMonth(true)),
      lunarDayDigit: Number(this.getLunarDay(true)),
      isLunarLeapMonth: this.checkLeapMonth(),
      leapMonth: this.getLeapMonth(),
      chineseYear: this.getChineseYearControllerYear(),
      chineseMonth: this.getChineseMonth(),
      chineseDay: this.getChineseDay(),
      chineseTimes: this.getChineseTimes(),
      week: this.getWeek(),
      animal: this.getAnimal(),
      constellation: this.getConstellation(),
      chineseFeb: this.checkChineseFeb(),
    };
  }
}

export default BasicLunar;
