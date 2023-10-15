const axios = require('axios')
const cheerio = require('cheerio')

const vm = require('vm')

async function getRoomData (url) {
  const response = await axios.get(url)

  const $ = cheerio.load(response.data)
  // 데이터의 위치 : 두 번째 스크립트 태그
  const script = $('script').eq(1).html()

  // 스크립트 실행을 위한 컨텍스트 생성
  const context = {
    window: {} // node.js 환경에는 window 객체가 없으므로 mock 생성
  }
  vm.createContext(context)

   // 스크립트를 실행하면 window.__APOLLO_STATE__ 객체에 데이터가 담김
  vm.runInContext(script, context)

  // 룸 데이터는 'BizItem'을 포함하는 키의 값으로 존재
  const keys = Object.keys(context.window.__APOLLO_STATE__).filter(key =>
    key.includes('BizItem')
  )
  const bizItems = keys.map(key => context.window.__APOLLO_STATE__[key])
  return bizItems.map(({ id, name, price }) => ({ id, name, price }))
}

const id = '329314'
const url = `https://m.booking.naver.com/booking/10/bizes/${id}`
getRoomData(url).then(console.log)
