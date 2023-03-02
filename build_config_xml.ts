import fs from 'fs'
import { execSync } from 'child_process'

const buildJson = JSON.parse(fs.readFileSync('build.json', 'utf-8'))
const versionNum = parseInt(execSync('git rev-list --all --count').toString())
const versionStr = `1.${(versionNum / 100).toFixed(2)}`
const xml = `
<?xml version='1.0' encoding='utf-8'?>
    <widget id="${buildJson['meta']['appId']}" version="${versionStr}" xmlns="http://www.w3.org/ns/widgets" xmlns:cdv="http://cordova.apache.org/ns/1.0">
    <name>${buildJson['meta']['title']}</name>
    <description>${buildJson['meta']['description']}</description>
    <author email="${buildJson['meta']['authorEmail']}" href="${buildJson['meta']['authorUrl']}">${buildJson['meta']['authorName']}</author>
    <content src="index.html" />
    <icon src="src/static/assets/icon.png" />
    <allow-intent href="http://*/*" />
    <allow-intent href="https://*/*" />
    <platform name="android">
        <resource-file src="res/values/themes.xml" target="/app/src/main/res/values/themes.xml" />
    </platform>
</widget>
`.trim()
fs.writeFileSync('config.xml', xml)
