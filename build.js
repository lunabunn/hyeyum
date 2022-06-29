const fs = require("fs");
const path = require("path");
const md = require("markdown-it")({ html: true })
    .use(require("markdown-it-attrs"))
    .use(require("markdown-it-bracketed-spans"));
const handlebars = require("handlebars");

const files = fs.readdirSync("src");
const template = handlebars.compile(fs.readFileSync("template.hbs").toString());

for (let file of files) {
    if (path.extname(file) !== ".md") continue;

    let data = fs.readFileSync(path.resolve("src", file)).toString();
    data = data.replace(/\{((?:[^}{]+|\{(?:[^}{]+|\{[^}{]*\})*\})*)\|((?:[^}{]+|\{(?:[^}{]+|\{[^}{]*\})*\})*)\}/g, "<ruby>$1<rp>【</rp><rt>$2</rt><rp>】</rp></ruby>");
    data = md.render(data);
    data = data.replace(/\p{sc=Han}+/gu, `<span class="hanja">$&</span>`);
    data = template({ content: data });

    const out = path.format({ ...path.parse(path.resolve("static", file)), base: "", ext: ".html" });
    fs.writeFileSync(out, data);
}