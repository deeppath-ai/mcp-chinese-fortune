<div align="center">

# mcp-chinese-fortune

</div> 


# Chinese Fortune Analysis System MCP (BaZi Fortune Project)

A fortune-teller system built on the Model Context Protocol (MCP).  
This project supports solar/lunar date conversion, Four Pillars (BaZi) generation, Five Element analysis, Ten Gods deduction, and fortune interpretation. It is suitable for traditional fortune-telling applications, prediction platforms, and metaphysics-based SaaS products.

---

## ✨ Features

- 🧮 **Four Pillars (BaZi) Generation**: Converts birth date into Heavenly Stems and Earthly Branches (Year, Month, Day, Hour)
- 🔥 **Five Element Analysis**: Calculates the balance of Wood, Fire, Earth, Metal, and Water
- 🧙 **Ten Gods Deduction**: Derives relationships of each stem to the Day Master (Ri Zhu)
- 📈 **Destiny Interpretation**: Analyzes strength of the Day Master, favorable elements (Yong Shen), luck cycles (Da Yun), and annual fortune (Liu Nian)
- 📆 **Chinese Age & Stem-Branch Year**: Calculates Chinese virtual age and names the birth year (e.g., "Wu Zi Year")
- 🏮 **Extended Modules**: Ziwei Doushu, Auspicious Spirits (Shen Sha), Life Palace (Ming Gong), Body Palace (Shen Gong), etc.

---

## <div align="center">▶️ Quick Start</div>

### CLI Usage
~~~bash
npx -y mcp-chinese-fortune
~~~

### MCP Server Configuration

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


## <div align="center">💭Murmurs</div>

This project is for educational and research purposes only.  
Feature requests and contributions are welcome.  
For custom features or integration with internal platforms, please contact the project maintainer.

<div align="center"><h1>Contact</h1></div>
<img width="380" height="200" src="./doc/dpai.jpg" alt="mcp-chinese-fortune MCP server" />

## Business Inquiries: [deeppathai@outlook.com](mailto:deeppathai@outlook.com)

</div>


## 🧠 MCP Access Link

- 🌐 [ModelScope MCP Server Page](https://modelscope.cn/mcp/servers/deeppathai/mcp-chinese-fortune)  
  Use this page to debug or integrate the `mcp-chinese-fortune` service within the ModelScope platform.


- 🛠️ [Smithery.ai MCP Address](https://smithery.ai/server/@deeppath-ai/mcp-chinese-fortune)  
  For visual configuration and invocation of the `mcp-marketing-site` service via Smithery.