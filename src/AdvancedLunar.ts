import BasicLunar from './BasicLunar.js';
import yu from './yu.js';
import { lunarLeap, solarTerms } from './config.js';
import dayjs, { Dayjs } from 'dayjs';
import type { BasicLunarJson } from './types.js';

const INPUT_AGE = '請輸入年齡';

class AdvancedLunar extends BasicLunar {
    chineseTimesTenGod: string[] | string;
    dengGui: string | string[];
    leapMonth: number;
    lunarPerMonthHasDays: string[];
    chineseAge?: string;
    time: string;
    chineseTime: string;
    solarTermDistance: any;
    
    westernAge?: number;

    constructor(year: number, month: string, day: string) {
        super(year, month, day);
        this.chineseTimesTenGod = this.getChineseTimesTenGod();
        this.dengGui = this.getDengGui();
        this.leapMonth = this.getLeapMonth();
        this.lunarPerMonthHasDays = this.getLunarPerMonthHasDays();
        this.time = yu.setTime();
        this.chineseTime = this.getChineseTime(this.time);
        const birthDate = new Date(`${year}-${month}-${day}`);
        const result = yu.getChineseAgeInfo(birthDate);
        console.log(`getChineseAgeInfo `, result)

        this.westernAge = result.westernAge
        this.chineseAge = result.chineseYear

        // this.chineseYear = String(result.westernAge)

    }

    getNayin(chineseYear: string = this.chineseYear): string {
        if ('甲子乙丑壬寅癸卯庚辰辛巳甲午乙未壬申癸酉庚戌辛丑'.includes(chineseYear)) return '金';
        if ('壬子癸丑庚寅辛卯戊辰己巳壬午癸未庚申辛酉戊戌己亥'.includes(chineseYear)) return '木';
        if ('丙子丁丑甲寅乙卯壬辰癸巳丙午丁未甲申乙酉壬戌癸亥'.includes(chineseYear)) return '水';
        if ('戊子己丑丙寅丁卯甲辰乙巳戊午己未丙申丁酉甲戌乙亥'.includes(chineseYear)) return '火';
        if ('庚子辛丑戊寅己卯丙辰丁巳庚午辛未戊申己酉丙戌丁亥'.includes(chineseYear)) return '土';
        return '請檢查輸入年份';
    }

    getChineseTime(time: string = this.time): string {
        const t = parseInt(time, 10);
        const index = Math.floor((t + 1) / 2) % 12;
        return this.chineseTimes[index];
    }

    getChineseTimesTenGod(chineseAge: string = this.chineseAge || ''): string[] | string {

        console.log(`getChineseTimesTenGod [${chineseAge}]`)
        return yu.verifyAge(chineseAge)
            ? this.chineseTimes.map(ele => {
                // console.log('===ele ', ele)
                // return yu.findTenGod(chineseAge.split('')[0], ele.split('')[0]);
                return yu.findTenGod(chineseAge.charAt(0), ele.charAt(0))
            }

        )
            : INPUT_AGE;
    }

    getChineseTimeTenGod(chineseAge: string = this.chineseAge || ''): string | typeof INPUT_AGE {
        return this.getTenGod(chineseAge, this.chineseTime);
    }

    getChineseYearTenGod(chineseAge: string = this.chineseAge || ''): string | typeof INPUT_AGE {
        return this.getTenGod(chineseAge, this.chineseYear);
    }

    getChineseMonthTenGod(chineseAge: string = this.chineseAge || ''): string | typeof INPUT_AGE {
        return this.getTenGod(chineseAge, this.chineseMonth);
    }

    getChineseDayTenGod(chineseAge: string = this.chineseAge || ''): string | typeof INPUT_AGE {
        return this.getTenGod(chineseAge, this.chineseDay);
    }

    getTenGod(chineseAge: string, chineseAnything: string): string | typeof INPUT_AGE {
        return yu.verifyAge(chineseAge)
            ? yu.findTenGod(chineseAge.charAt(0), chineseAnything.charAt(0))
            : INPUT_AGE;
    }

    getDengGui(solarTermSplit?: boolean): string | string[] {
        if (solarTermSplit) {
            const solarTermsNumber = yu.dengGuiSolarTerms(this.solarTerms);
            const solarTermBefore = solarTerms[solarTermsNumber - 1];
            const solarTermAfter = solarTerms[solarTermsNumber + 1];
            return [
                yu.findDengGui(this.chineseDay.charAt(0), solarTermBefore),
                yu.findDengGui(this.chineseDay.charAt(0), this.solarTerms),
                yu.findDengGui(this.chineseDay.charAt(0), solarTermAfter),
            ];
        }
        return yu.findDengGui(this.chineseDay.charAt(0), this.solarTerms);
    }

    getLunarPerMonthHasDays(): string[] {
        return lunarLeap[this.year - 1900][1]
            .split('')
            .map(ele => (ele === '0' ? '29' : '30'));
    }

    getSolarTermDistance(): {
        previous: Record<string, any>,
        next: Record<string, any>
    } {
        const { previous, next } = this.parserFile;
        const previousArray = previous.split(' ');
        const nextArray = next.split(' ');
        return {
            previous: this.dateDiffHandler(previousArray),
            next: this.dateDiffHandler(nextArray),
        };
    }

    private dateDiffHandler(arr: string[]): Record<string, any> {
        const solarTerm = arr[0].substring(5, 7);
        const start = dayjs(`${this.year}${this.month}${this.day}`);
        const dateParts = arr[1].replace('日', '').split(/年|月/g);
        const timeParts = arr[2].split(':');
        const date = dayjs(new Date(
            parseInt(dateParts[0]),
            parseInt(dateParts[1]) - 1,
            parseInt(dateParts[2]),
            parseInt(timeParts[0]),
            parseInt(timeParts[1]),
            parseInt(timeParts[2])
        ));
        const diffHours = date.diff(start, 'hours', true);
        return {
            solarTerm,
            diffDistanceDay: Math.abs(Math.floor(diffHours / 24)),
            diffDistanceDetail: Math.abs(diffHours / 24),
        };
    }

    getJson(): BasicLunarJson {
        return {
            ...super.getJson(),
            hour: this.time,
            nayin: this.getNayin(),
            chineseTime: this.getChineseTime(),
            chineseTimesTenGod: this.getChineseTimesTenGod(),
            chineseTimeTenGod: this.getChineseTimeTenGod(),
            chineseYearTenGod: this.getChineseYearTenGod(),
            chineseMonthTenGod: this.getChineseMonthTenGod(),
            chineseDayTenGod: this.getChineseDayTenGod(),
            dengGui: this.getDengGui(),
            lunarPerMonthHasDays: this.getLunarPerMonthHasDays(),
            solarTermDistance: this.getSolarTermDistance(),
        };
    }
}

export default AdvancedLunar;
