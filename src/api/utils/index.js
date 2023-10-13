export default class Until {
  static checkUrl(url = "") {
    return url.match(/^(https|http):\/\//g);
  }
  static isVietnameseText(inputString) {
    var vietnamesePattern = /[^\u0000-\u007F]+/;
    return vietnamesePattern.test(inputString);
  }
}
