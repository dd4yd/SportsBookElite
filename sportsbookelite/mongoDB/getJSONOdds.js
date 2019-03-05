const fetch = require('node-fetch')
try {
  require('dotenv').config()
} catch (err) {}

const baseUrl = 'https://jsonodds.com/api/'
module.exports = {
  getFinalTypes: getFinalTypes,
  getSports: getSports,
  getOddFormats: getOddFormats,
  getOdds: getOdds,
  getOddsBySport: getOddsBySport,
  getOddTypes: getOddTypes,
  getOddsByMatches: getOddsByMatches,
  getResults: getResults,
  getResultsBySport: getResultsBySport,
  getResultsByEventId: getResultsByEventId,
  getResultsByMatches: getResultsByMatches,
  getTestOdds: getTestOdds,
  getTestResults: getTestResults
}

function performGetRequest (url) {
  return fetch(url, {
    headers: {
      'x-api-key': '87b066bd-9645-4b7f-8c88-c084796695ac'
    }
  }).then(res => res.json()).then(json => {
    //console.log(json)
    return json
  })
}

function getTestOdds(){
	return performGetRequest(`${baseUrl}test/odds`)
}

function getTestResults(){
	return performGetRequest(`${baseUrl}results`)
}

function getOdds () {
  return performGetRequest(`${baseUrl}odds`)
}

function getOddFormats () {
  return performGetRequest(`${baseUrl}oddformat`)
}

function getSports () {
  return performGetRequest(`${baseUrl}sports`)
}

function getOddsBySport (sport) {
  if (!sport) sport = 'MLB'
  return performGetRequest(`${baseUrl}odds/${sport}`)
}

function getOddTypes () {
  return performGetRequest(`${baseUrl}oddtype`)
}

function getFinalTypes () {
  return performGetRequest(`${baseUrl}finaltype`)
}

function getResults () {
  return performGetRequest(`${baseUrl}results`)
}

function getResultsBySport (sport) {
  if (!sport) sport = 'MLB'
  return performGetRequest(`${baseUrl}results/${sport}`)
}

function getResultsByEventId (eventId) {
  return performGetRequest(`${baseUrl}results/${eventId}`)
}

function getResultsByMatches (gamesRequest) {
  return fetch(`${baseUrl}/results/bymatches`, {
    method: 'POST',
    body: gamesRequest,
    headers: {
      'x-api-key': process.env.API_KEY
    }
  }).then(res => res.json()).then(json => {
    console.log(json)
    return json
  })
}

function getOddsByMatches (gamesRequest) {
  return fetch(`${baseUrl}/odds/bygames`, {
    method: 'POST',
    body: gamesRequest,
    headers: {
      'x-api-key': process.env.API_KEY
    }
  }).then(res => res.json()).then(json => {
    console.log(json)
    return json
  })
}
