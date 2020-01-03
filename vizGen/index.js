const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const Mock = require('mockjs');

const imageBase = `../images`;

const datasetTypes = ['train','test','val'];

process.setMaxListeners(Infinity);

function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0,
            v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

function atob(data) {
    return Buffer.from(data).toString('base64');
}

function generateBarData() {
    const rows = Mock.mock('@integer(0, 10)');
    const attr1 = Mock.mock('@word(3, 5)');
    const attr2 = Mock.mock('@word(3, 5)');
    const result = [];
    for (let i = 0; i < rows; i++) {
        const item = {};
        item[attr1] = Mock.mock('@date(yyyy)');
        item[attr2] = Mock.mock('@float(60, 100)');
        result.push(item);
    }

    return {
        grammar: `${attr1}*${attr2}&`,
        data: result
    }
}

async function screenshot(url, path) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto(url);
    await page.setViewport({width: 600, height: 400});
    await page.screenshot({
        path: path
    });

    await browser.close();
}

async function generateBarCharts(type) {
    const id = uuidv4();
    const host = 'localhost';
    const port = 8080;
    const endpoint = 'viz';
    const {
        grammar,
        data
    } = generateBarData();

    console.log(data);
    console.log(grammar);

    //const dataset = 'W3sKICAgICAgICAgIHllYXI6ICcxOTUxJywKICAgICAgICAgIHNhbGVzOiAzOAogICAgICB9LCB7CiAgICAgICAgICB5ZWFyOiAnMTk1MicsCiAgICAgICAgICBzYWxlczogNTIKICAgICAgfSwgewogICAgICAgICAgeWVhcjogJzE5NTYnLAogICAgICAgICAgc2FsZXM6IDYxCiAgICAgIH0sIHsKICAgICAgICAgIHllYXI6ICcxOTU3JywKICAgICAgICAgIHNhbGVzOiAxNDUKICAgICAgfSwgewogICAgICAgICAgeWVhcjogJzE5NTgnLAogICAgICAgICAgc2FsZXM6IDQ4CiAgICAgIH0sIHsKICAgICAgICAgIHllYXI6ICcxOTU5JywKICAgICAgICAgIHNhbGVzOiAzOAogICAgICB9LCB7CiAgICAgICAgICB5ZWFyOiAnMTk2MCcsCiAgICAgICAgICBzYWxlczogMzgKICAgICAgfSwgewogICAgICAgICAgeWVhcjogJzE5NjInLAogICAgICAgICAgc2FsZXM6IDM4CiAgICAgIH1d';
    const dataset = atob(JSON.stringify(data));
    console.log(dataset);

    const url1 = `http://${host}:${port}/${endpoint}?sketchify=1&grammar=${grammar}&dataset=${dataset}`;
    const url2 = `http://${host}:${port}/${endpoint}?sketchify=0&grammar=${grammar}&dataset=${dataset}`;

    await screenshot(url1, `${imageBase}/A/${type}/${id}.png`);
    await screenshot(url2, `${imageBase}/B/${type}/${id}.png`);
    return id;
}

(async () => {
    if (!fs.existsSync(imageBase)){
        fs.mkdirSync(imageBase);
    }

    if (!fs.existsSync(`${imageBase}/A`)){
        fs.mkdirSync(`${imageBase}/A`);
    }

    if (!fs.existsSync(`${imageBase}/B`)){
        fs.mkdirSync(`${imageBase}/B`);
    }

    datasetTypes.forEach(function(type){
        if (!fs.existsSync(`${imageBase}/A/${type}`)){
            fs.mkdirSync(`${imageBase}/A/${type}`);
        }

        if (!fs.existsSync(`${imageBase}/B/${type}`)){
            fs.mkdirSync(`${imageBase}/B/${type}`);
        }
    })


    for (let i = 0; i < 400; i++) {
        const id = await generateBarCharts('train');
    }

    for (let i = 0; i < 100; i++) {
        const id = await generateBarCharts('test');
    }

    for (let i = 0; i < 100; i++) {
        const id = await generateBarCharts('val');
    }

})();