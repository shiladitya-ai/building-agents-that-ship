const sharp=require("sharp");
sharp("C:/gitrepo/TechnicalWhitepaper/learning-loop.svg").png().resize(1060).toFile("C:/gitrepo/TechnicalWhitepaper/build/loop-check.png").then(()=>console.log("ok")).catch(e=>{console.error(e.message);process.exit(1)});
