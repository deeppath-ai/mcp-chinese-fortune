/* eslint-disable no-param-reassign */
import dayjs from 'dayjs';
import { lunarLeap, solarTermGeneral, lunarMonths, lunarMonthLeap, solarTermsData } from './config.js';

import type {SolarTermItem, LunarDate, ParserResult} from './types.js';



class GeneralLunar {
  year: number;
  month: string;
  day: string;
  distanceDay: number;
  getLunarMonthAndDayNumber: LunarDate;
  parserFile: ParserResult;

  /**
   * @param year 西元年 YYYY (ex: 2020, 1992)
   * @param month 月 MM (ex: 01, 08, 12)
   * @param day 日 DD (ex: 01, 08, 23, 28)
   */
  constructor(year: number, month: string, day: string) {
    this.year = year;
    this.month = month;
    this.day = day;

    const start = dayjs('19120101');
    const end = dayjs(`${year}${month}${day}`);
    this.distanceDay = end.diff(start, 'day');
    this.getLunarMonthAndDayNumber = this.getLunarMonthAndDayNumberCalc();
    this.parserFile = this.parserFileAndSplitSolarTerm();
  }

  /**
   * 取得農曆月日的值
   * @returns {Object} { month, day }
   */
  private getLunarMonthAndDayNumberCalc(): LunarDate {
    let min = 100000000;
    let saveMonth: string | number = '';
    const start = dayjs('19000131');
    const end = dayjs(`${this.year}${this.month}${this.day}`);
    let dayDistance = end.diff(start, 'day');

    lunarLeap.forEach((val: [number, string, string]) => {
      val[1].split('').forEach((monthVal: string, monthIndex: number) => {
        const result = monthVal === '0' ? (dayDistance -= 29) : (dayDistance -= 30);
        if (result >= 0) {
          min = Math.min(result + 1, min);
        }
        if (result < 0 && saveMonth === '') {
          saveMonth = monthIndex;
          if (val[0] !== 0 && saveMonth > val[0]) {
            saveMonth--;
          }
          if (parseInt(String(val[0]), 10) === monthIndex && monthIndex !== 0) {
            saveMonth = lunarMonthLeap[monthIndex - 1];
          }
        }
      });
    });

    return {
      month: typeof saveMonth === 'number' ? lunarMonths[saveMonth] : saveMonth,
      day: min,
    };
  }

  /**
   * 分析文檔並回傳結果和是否節前日期
   * @returns {Object} { title, solarTermsSplit }
   */
  private parserFileAndSplitSolarTerm(): ParserResult {
    
    const solarTerms: SolarTermItem[] = solarTermsData[this.year - 1900]

    const result: ParserResult = {
      previous: '',
      current: '',
      next: '',
      solarTermsSplit: false,
    };

    let min = 1000;
    solarTerms.forEach((val, index) => {
      const dateCh = val.title.split(' ')[1]; // e.g. 2017年01月24日
      const date = dateCh.replace('年', '').replace('月', '').replace('日', ''); // e.g. 20170124
      const start = dayjs(date);
      const end = dayjs(`${this.year}${this.month}${this.day}`);
      const dayDistance = end.diff(start, 'day');

      if (dayDistance >= 0 && dayDistance < min) {
        min = Math.min(dayDistance, min);
        if (solarTerms[index - 1]) result.previous = solarTerms[index - 1].title;
        result.next = solarTerms[index + 1]?.title || '';
        if (result.previous === '') {
            
          const dataLength = solarTermsData[this.year - 1899].length;
          result.previous = solarTermsData[this.year - 1899][dataLength - 1].title;
        }
        result.current = val.title;

        if (
          dayDistance === 0 &&
          solarTermGeneral.indexOf(val.title.substring(5, 7)) >= 0
        ) {
          result.solarTermsSplit = true;
        }
      }
    });

    return result;
  }
}

export default GeneralLunar;
