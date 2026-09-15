const fs=require("fs");
const p="C:/gitrepo/TechnicalWhitepaper/references.md";
let t=fs.readFileSync(p,"utf8");
// 1) arXiv IDs -> links (skip if already linked)
t=t.replace(/(?<!\]\()arXiv:(\d{4}\.\d{5})/g,"[arXiv:$1](https://arxiv.org/abs/$1)");
// 2) bare domains -> markdown links
const dom=[
 ["anthropic.com/engineering/building-effective-agents","https://www.anthropic.com/engineering/building-effective-agents"],
 ["anthropic.com/engineering/multi-agent-research-system","https://www.anthropic.com/engineering/multi-agent-research-system"],
 ["cognition.com/blog/dont-build-multi-agents","https://cognition.ai/blog/dont-build-multi-agents"],
 ["sre.google/books","https://sre.google/books/"],
 ["owasp.org/www-project-top-10-for-large-language-model-applications","https://owasp.org/www-project-top-10-for-large-language-model-applications/"],
 ["simonwillison.net/series/prompt-injection/","https://simonwillison.net/series/prompt-injection/"],
 ["nist.gov/itl/ai-risk-management-framework","https://www.nist.gov/itl/ai-risk-management-framework"],
];
for(const [d,u] of dom){ t=t.split(d).join("["+d+"]("+u+")"); }
// 3) named-only entries -> append link
t=t.replace('**Garcia-Molina & Salem, "Sagas" (ACM SIGMOD, 1987).**','**Garcia-Molina & Salem, "Sagas" (ACM SIGMOD, 1987).** [doi.org/10.1145/38713.38742](https://doi.org/10.1145/38713.38742).');
t=t.replace('**Michael Nygard, "Release It!" (2nd ed., 2018).**','**Michael Nygard, "Release It!" (2nd ed., 2018).** [pragprog.com/titles/mnee2](https://pragprog.com/titles/mnee2/release-it-second-edition/).');
t=t.replace('**Schlerf et al. / SAE International, "J3016: Levels of Driving Automation."**','**SAE International, "J3016: Levels of Driving Automation."** [sae.org/standards/content/j3016_202104](https://www.sae.org/standards/content/j3016_202104/).');
fs.writeFileSync(p,t);
console.log("links now:", (t.match(/\]\(https?:/g)||[]).length);
