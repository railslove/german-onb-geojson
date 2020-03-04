const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')
const axios = require('axios')
const cheerio = require('cheerio')
const anzip = require('anzip')

const baseUrl = 'https://www.bundesnetzagentur.de'
const siteUrl =
  baseUrl +
  '/DE/Sachgebiete/Telekommunikation/Unternehmen_Institutionen/Nummerierung/Rufnummern/ONRufnr/ON_Einteilung_ONB/ON_ONB_ONKz_ONBGrenzen_Basepage.html'
const hrefRegex = /ONBGrenzen\/ONB.*\.zip/i
const tmpDir = path.resolve(__dirname, '.tmp')
const tmpPath = path.resolve(tmpDir, 'download.zip')
const rawPath = path.resolve(__dirname, 'raw')

main()

async function main() {
  console.log('Removing temporary downloads ...')
  await cleanup()

  console.log('Looking for download url ...')
  const { downloadUrl, releaseDate } = await getDownloadUrl()

  if (!downloadUrl) {
    console.error('ZIP Link not found. :(')
    process.exit(1)
  }

  const stringDate = releaseDate.toISOString().split('T')[0]
  console.log('Found ONB-Grenzen with date of ' + stringDate)

  console.log('Downloading ONB-Grenzen.zip ...')
  await downloadFileToTmp(downloadUrl)

  console.log('Unzipping ...')
  await anzip(tmpPath, { outputPath: rawPath })

  const hasChanged = await checkIfChanged()
  if (!hasChanged) {
    console.log('Nothing has changed since last download. Finished.')
    process.exit(0)
  }

  console.log('Converting to geojson ...')
  execSync('./convert.sh')

  console.log('Commit changes ...')
  execSync('git add -A')
  execSync(`git commit -m "Update data to ${stringDate}"`)

  console.log('Done. Publish a new release by running')
  console.log('    npm run release')
}

async function cleanup() {
  try {
    fs.unlinkSync(tmpPath)
  } catch (_error) {
    // intentionally left blank
  }
}

async function getDownloadUrl() {
  const result = await axios.get(siteUrl)
  const $ = cheerio.load(result.data)

  let downloadUrl, releaseDate
  $('a[href]').each(function() {
    const href = $(this).attr('href')
    if (hrefRegex.test(href)) {
      downloadUrl = baseUrl + href
      const [day, month, year] = $(this)
        .text()
        .match(/Stand: ([\d|\.]+)/i)[1]
        .split('.')
        .map(i => +i)
      releaseDate = new Date(year, month - 1, day, 12)
    }
  })

  return { downloadUrl, releaseDate }
}

async function downloadFileToTmp(url) {
  try {
    fs.mkdirSync(tmpDir)
  } catch (_error) {
    // intentionally left blank
  }

  const writer = fs.createWriteStream(tmpPath, { flags: 'w' })

  const download = await axios({
    url,
    method: 'GET',
    responseType: 'stream'
  })

  download.data.pipe(writer)

  return new Promise((resolve, reject) => {
    writer.on('finish', resolve)
    writer.on('error', reject)
  })
}

async function checkIfChanged() {
  try {
    execSync('git diff --exit-code --quiet raw')
    return false
  } catch (_error) {
    return true
  }
}
