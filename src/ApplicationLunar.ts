/* eslint-disable no-useless-constructor */
import AdvancedLunar from './AdvancedLunar.js';
import yu from './yu.js';
import { lunarLeap, purpleWhites, decimalCycle, duodecimalCycleMonth, taiYuan, cangGan, kongWang } from './config.js';
import dayjs from 'dayjs';
import type { BasicLunarJson } from './types.js';

class ApplicationLunar extends AdvancedLunar {
    //   time: string;
    //   chineseTime: string;
    //   solarTermDistance: any;
    //   chineseAge?: string;
    //   chineseTimesTenGod?: any;

    constructor(year: number, month: string, day: string) {
        const { year: handlerYear, month: handlerMonth, day: handlerDay } = yu.setDate(year, month, day);
        super(handlerYear, handlerMonth, handlerDay);
        // this.time = yu.setTime();
        // this.chineseTime = this.getChineseTime(this.time);
        this.solarTermDistance = this.getSolarTermDistance();
    }

    lunarToSolar(leap: boolean = false): ApplicationLunar {
        const lunarPerMonthHasDays = this.getLunarPerMonthHasDays();
        const monthDay = lunarLeap[this.year - 1900][2];
        let day = 0;
        let month = parseInt(this.month, 10);
        if (leap) {
            month++;
        }
        for (let index = 0; index < month - 1; index++) {
            day += parseInt(lunarPerMonthHasDays[index], 10);
        }
        day += parseInt(this.day, 10) - 1;

        const yearMonthDay = dayjs(this.year + monthDay)
            .add(day, 'days')
            .format('YYYY-MM-DD')
            .split('-');

        return new ApplicationLunar(Number(yearMonthDay[0]), yearMonthDay[1], yearMonthDay[2]);
    }

    setChineseAge(age: string): this {
        this.chineseAge = age;
        // console.log("setChineseAge", this.chineseAge)
        this.chineseTimesTenGod = this.getChineseTimesTenGod(age);
        return this;
    }

    setTime(time: string): this {
        this.time = time;
        this.chineseTime = this.getChineseTime(time);
        return this;
    }

    setWesternAge(age: number): this {
        this.westernAge = age;
        return this;
    }
    
    subtract(number: number, unit: dayjs.ManipulateType): ApplicationLunar {
        return this.formatCompute(dayjs(this.year + this.month + this.day).subtract(number, unit));
    }

    add(number: number, unit: dayjs.ManipulateType): ApplicationLunar {
        return this.formatCompute(dayjs(this.year + this.month + this.day).add(number, unit));
    }

    private formatCompute(data: dayjs.Dayjs): ApplicationLunar {
        const result = data.format('YYYY-MM-DD').split('-');
        return new ApplicationLunar(Number(result[0]), result[1], result[2]);
    }

    getPurpleWhites(chineseYear: string = this.chineseYear): string[] | string {
        const earthlyBranch = chineseYear[1];
        if ('子午卯酉'.includes(earthlyBranch)) {
            return purpleWhites[0];
        }
        if ('辰戌丑未'.includes(earthlyBranch)) {
            return purpleWhites[1];
        }
        if ('寅申巳亥'.includes(earthlyBranch)) {
            return purpleWhites[2];
        }
        return '請檢查輸入年份';
    }

    getTaiYuan(chineseMonth: string = this.chineseMonth): string {
        const [top, down] = chineseMonth.split('');
        const topIndex = decimalCycle.indexOf(top);
        const downIndex = duodecimalCycleMonth.indexOf(down);
        return taiYuan[topIndex][downIndex];
    }

    getCangGan(duodecimalCycle: string): string {
        return cangGan[duodecimalCycle.indexOf(duodecimalCycle)];
    }

    getKongWang(duodecimalCycle: string, decimalCycle: string): string {
        const down = duodecimalCycle.indexOf(duodecimalCycle);
        const top = decimalCycle.indexOf(decimalCycle);
        return kongWang[down][top];
    }

    getMingGong(
        chineseYear: string = this.chineseYear,
        chineseMonth: string = this.chineseMonth,
        chineseTime: string = this.chineseTime
    ): any {
        return yu.mingAndShen(chineseYear, chineseMonth, chineseTime, 'Ming');
    }

    getShenGong(
        chineseYear: string = this.chineseYear,
        chineseMonth: string = this.chineseMonth,
        chineseTime: string = this.chineseTime
    ): any {
        return yu.mingAndShen(chineseYear, chineseMonth, chineseTime, 'Shen');
    }

    getJson(): BasicLunarJson {
        return {
            ...super.getJson(),
            purpleWhites: this.getPurpleWhites(),
            taiYuan: this.getTaiYuan(),
            mingGong: this.getMingGong(),
            shenGong: this.getShenGong(),
        };
    }
}

export default ApplicationLunar;
