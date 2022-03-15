const { RESTDataSource } = require('apollo-datasource-rest')

class QuoteAPI extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = 'https://type.fit/api/quotes';
  }

  async getQuote() {
    const res = await this.get(this.baseURL)
    const quotes = JSON.parse(res)

    const quoteRandom = quotes[Math.floor(Math.random() * (quotes.length - 1))]

    return quoteRandom
  }
}

module.exports = QuoteAPI