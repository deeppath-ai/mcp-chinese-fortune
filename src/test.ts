import GeneralLunar from './GeneralLunar.js';
import BasicLunar from './BasicLunar.js';
import AdvancedLunar from './AdvancedLunar.js';
import ApplicationLunar from './ApplicationLunar.js';
// import config from './config.js';
import yu from './yu.js';

interface LunarModule {
  GeneralLunar: typeof GeneralLunar;
  BasicLunar: typeof BasicLunar;
  AdvancedLunar: typeof AdvancedLunar;
  ApplicationLunar: typeof ApplicationLunar;
  yu: typeof yu;
  Lunar: InstanceType<typeof ApplicationLunar>;
}

/**
 * @param year 西元年 YYYY (ex: 2020, 1992)
 * @param month 月 MM (ex: 01, 08, 12)
 * @param day 日 DD (ex: 01, 08, 23, 28)
 */
function lunar(year: number, month: string, day: string): LunarModule {
  const lunarInstance = new ApplicationLunar(year, month, day);

    return {
      GeneralLunar,
      BasicLunar,
      AdvancedLunar,
      ApplicationLunar,
      yu,
      Lunar: lunarInstance
    };
  }




// let actor: LunarModule = lunar(1989, "07", "28");
// actor.Lunar.setTime('00')
// actor.Lunar.setChineseAge('戊子')

// const birthDate = new Date('1989-07-28');
// const result = yu.getChineseAgeInfo(birthDate);
// console.log(result);

const lunarInstance = new ApplicationLunar(1989, '07', '28');
lunarInstance.setTime("05")
// lunarInstance.setChineseAge('戊子')
// console.log('123 ',lunarInstance.chineseAge)
console.log(lunarInstance.getJson())

