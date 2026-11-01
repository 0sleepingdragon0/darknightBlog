import fs from "node:fs";
import path from "node:path";

const ENDPOINT = "https://api.indexnow.org/indexnow";
const DIST = "dist";
const PUBLIC = "public";

// IndexNow 约定：public/<key>.txt 的文件名去掉扩展后必须等于文件内容，引擎抓一次即确认站点所有权。
function readKey() {
	const name = fs
		.readdirSync(PUBLIC)
		.find(
			(file) =>
				file.endsWith(".txt") &&
				file.slice(0, -4) ===
					fs.readFileSync(path.join(PUBLIC, file), "utf8").trim(),
		);
	if (!name) throw new Error("找不到 IndexNow 密钥文件 public/<key>.txt");
	return name.slice(0, -4);
}

function readUrls() {
	const index = path.join(DIST, "sitemap-index.xml");
	const children = fs.existsSync(index)
		? [...fs.readFileSync(index, "utf8").matchAll(/<loc>(.*?)<\/loc>/g)].map(
				(m) => path.basename(m[1]),
			)
		: fs.readdirSync(DIST).filter((f) => /^sitemap-\d+\.xml$/.test(f));
	return children
		.flatMap((file) => [
			...fs
				.readFileSync(path.join(DIST, file), "utf8")
				.matchAll(/<loc>(.*?)<\/loc>/g),
		])
		.map((m) => m[1]);
}

const urls = readUrls();
if (urls.length === 0) throw new Error("dist 里没有 sitemap，先跑构建");

const body = JSON.stringify({
	host: new URL(urls[0]).host,
	key: readKey(),
	urlList: urls,
});
const res = await fetch(ENDPOINT, {
	method: "POST",
	headers: { "Content-Type": "application/json; charset=utf-8" },
	body,
});

console.log(
	`${urls.length} 条 URL → IndexNow HTTP ${res.status} ${res.statusText}`,
);
if (!res.ok) process.exit(1);
