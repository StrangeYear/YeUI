// pages/calendar-page/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    calendar: {
      dayStartFromSunday: true,//周末开始，false的话周一开始
      beforeDayCanClick: false,//之前的日期是否可选
      afterDayCanClick: true,//之后的日期是否可选
      onlyWorkDays: true,//是否只允许工作日
      selectDates: ['2018-04-25']//初始值
    },
    showCalendar: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  getSelectDates(e) {
    this.setData({
      ['calendar.selectDates']: e.detail
    })
    this.hideCalendarSelect();
  },
  showCalendarSelect() {
    this.setData({
      showCalendar: true
    })
    this.selectComponent("#calendar")._initStartEnd()
  },
  hideCalendarSelect() {
    this.setData({
      showCalendar: false
    })
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})