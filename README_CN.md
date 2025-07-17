<div align="center">

# mcp-chinese-fortune

</div> 


# 命理分析系统 MCP（八字算命项目）

基于模型上下文协议（MCP）的算命大师。
本项目是一个支持公历/农历转换、四柱八字排盘、五行分析、十神推算、运势分析等功能，适用于传统命理应用、算命服务平台、命理类产品。

---

## ✨ 功能特色

- 🧮 **四柱八字排盘**：支持出生日期转干支四柱（年、月、日、时）
- 🔥 **五行分析**：统计木火土金水五行比例
- 🧙 **十神推算**：基于日主，计算年、月、日、时天干与十神关系
- 📈 **命运分析**：判断命主旺衰、喜用神、流年大运等
- 📆 **虚岁与干支年计算**：生成如「戊子年」样式的干支纪年
- 🏮 **紫微/神煞/命宫/身宫等拓展模块**（可扩展）

---

## <div align="center">▶️Quick Start</div>

## 部署指南

~~~bash
npx -y mcp-chinese-fortune
~~~

### MCP sever configuration

~~~json
{
    "mcpServers": {
        "mcp-chinese-fortune": {
            "command": "npx",
            "args": [
                "-y",
                "mcp-chinese-fortune"
            ]
        }
    }
}
~~~

## 使用示例

帮我算下命，出生时间 2011年 10月19日8点


## <div align="center">💭Murmurs</div>
本项目仅用于学习，欢迎催更。如需定制功能等服务、与内部推广平台对接，请联系产品维护者。

<div align="center"><h1>联系方式</h1></div>
  <img width="380" height="200" src="./doc/dpai.jpg" alt="mcp-chinese-fortune MCP server" />
  
  ## 商务合作联系邮件：  [deeppathai@outlook.com](mailto:deeppathai@outlook.com)

</div>


## 🧠 MCP 接入地址

- 🌐 [魔搭 ModelScope MCP 地址](https://modelscope.cn/mcp/servers/deeppathai/mcp-chinese-fortune)  
  适用于在 ModelScope 平台上调试和集成 `mcp-chinese-fortune` 服务。

- 🛠️ [Smithery.ai MCP 地址](https://smithery.ai/server/@deeppath-ai/mcp-chinese-fortune)  
  可用于在 Smithery 平台中以可视化方式配置和调用 `mcp-marketing-site` 服务。
