const fs = require('fs')
const path = require('path')


// const project_dir = path.resolve('./', 'src')
const project_dir = path.resolve('/Users/chenjing/xbb-pro-web-front/src')

const dataJson = {}
const oXcolor = {}
const colorFile ={}

const init = async () => {
  const _djson = await getAllFiles(project_dir, dataJson)
  fs.writeFileSync(path.join(__dirname, 'dir.json'), JSON.stringify(_djson)) // 项目目录结构
  fs.writeFileSync(path.join(__dirname, 'oXcolor.json'), JSON.stringify(oXcolor)) // 项目出现的16进制颜色
  fs.writeFileSync(path.join(__dirname, 'colorFile.json'), JSON.stringify(colorFile)) // 各个颜色出现的文件
}

const getAllFiles = async (_path, _dataJson) => {
  const files = fs.readdirSync(_path)
  if (files.length) {
    _dataJson.file = []
  }
  files.forEach(async(filename) => {
    const filedir = path.join(_path, filename)
    const stats = fs.statSync(filedir)
    // 是否是文件
    const isFile = stats.isFile()
    // 是否是文件夹
    const isDir = stats.isDirectory()
    if (isFile) {
      _dataJson.file.push(filename)
      const filecontent = fs.readFileSync(filedir, 'utf-8')
      const reg = /\#[0-9a-fA-F]{3}\;|\#[0-9a-fA-F]{6}\;/g // 正则匹配十六进制颜色
      if (filecontent.match(reg)) { // 正则匹配颜色
        filecontent.match(reg).forEach((color) => {
          if (oXcolor.hasOwnProperty(color)) {
            oXcolor[color]++
            colorFile[color].push(filedir)
          } else {
            oXcolor[color] = 1
            colorFile[color] = [filedir]
          }
        })
      }

    }
    // 如果是文件夹
    if (isDir) {
      _dataJson[filename] = {}
      _dataJson[filename] = await getAllFiles(filedir, _dataJson[filename])
    }
  })
  return _dataJson

}

exports.init = init