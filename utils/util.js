const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatDate = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  return [year, month, day].map(formatNumber).join('-')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function getNextWorkDay() {
  const workDays = ["2018-04-28", "2018-09-29", "2018-09-30"];
  const holiDays = ["2018-04-29", "2018-04-30", "2018-05-01", "2018-06-16", "2018-06-17", "2018-06-18",
    "2018-09-22", "2018-09-23", "2018-09-24", "2018-10-01", "2018-10-02", "2018-10-03", "2018-10-04", "2018-10-05", "2018-10-06", "2018-10-07"]
  let date = new Date();
  date.setDate(date.getDate() + 1);

  let value;

  while (true) {
    const formatDateStr = this.formatDate(date);
    const num = date.getDay();
    if (this.indexOf(formatDateStr, workDays) != -1 || (this.indexOf(formatDateStr, holiDays) == -1 && (num > 0 && num < 6))) {
      //选取下个工作日
      value = formatDateStr;
      break;
    } else {
      date.setDate(date.getDate() + 1);
    }
  }

  return value;
}

function indexOf(val, array) {
  for (var i = 0; i < array.length; i++) {
    if (array[i] == val) return i;
  }
  return -1;
}

module.exports = {
  formatTime: formatTime,
  formatDate: formatDate,
  getNextWorkDay: getNextWorkDay,
  indexOf: indexOf
}
