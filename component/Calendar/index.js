// component/Calendar/index.js
const util = require('../../utils/util.js');

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    calendar: {
      type: Object
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    year: '',
    month: '',
    calendarData: [],
    weeks: ["日", "一", "二", "三", "四", "五", "六"],
    workDays: ["2018-04-28", "2018-09-29", "2018-09-30"],
    holiDays: ["2018-04-29", "2018-04-30", "2018-05-01", "2018-06-16", "2018-06-17", "2018-06-18",
      "2018-09-22", "2018-09-23", "2018-09-24", "2018-10-01", "2018-10-02", "2018-10-03", "2018-10-04", "2018-10-05", "2018-10-06", "2018-10-07"]
  },

  /**
   * 组件的方法列表
   */
  methods: {
    _initStartEnd() {
      //显示的默认先显示当月的日历
      const date = new Date();
      const year = date.getFullYear();
      //月份+1
      const month = date.getMonth();

      //如果是周一开始
      let weeks = ["日", "一", "二", "三", "四", "五", "六"];
      if (!this.data.calendar.dayStartFromSunday) {
        weeks = ["一", "二", "三", "四", "五", "六", "日"];
      }

      this.setData({
        year: year,
        month: month,
        nowDate: date,
        weeks: weeks
      })

      this._getDatesOfMonth();

    },
    _getDatesOfMonth() {

      const year = this.data.year;
      const month = this.data.month;

      //每个月的天数
      let days;
      if (month == 2) {
        days = (year % 4 == 0) && (year % 100 != 0) || (year % 400 == 0) ? 29 : 28;
      } else {
        if (month < 7) {
          //1-7月 单数月为31日 
          days = month % 2 == 1 ? 31 : 30;
        } else {
          //8-12月 双月为31日
          days = month % 2 == 0 ? 31 : 30;
        }
      }

      let firstDate = new Date(year, month, 1);

      //第一天周几
      const firstWeekDay = firstDate.getDay();

      let beforeDay;
      if (this.data.calendar.dayStartFromSunday) {
        //开始为周日
        beforeDay = firstWeekDay == 0 ? 0 : firstWeekDay;
      } else {
        // 开始为周一 则向前减少周几的天数-1即为 开始的日期
        beforeDay = firstWeekDay == 0 ? 6 : firstWeekDay - 1;
      }

      firstDate.setDate(firstDate.getDate() - beforeDay);

      let calendarData = []

      //循环生成数据
      //显示6周的数据
      let index = 0;

      let selectDates = this.data.calendar.selectDates;

      for (let i = 0; i < 6; i++) {
        let calendarDataRow = []
        //一周7天
        for (let j = 0; j < 7; j++) {
          const formatDateStr = util.formatDate(firstDate);
          const formatDay = firstDate.getDate();

          //判断在不在选择的数组里面
          const hasIndex = this.indexOf(formatDateStr, selectDates);

          let canClick = true;

          //判断工作日选项是否开启
          if (this.data.calendar.onlyWorkDays) {
            //先判断是否是轮休工作日
            if (this.indexOf(formatDateStr, this.data.workDays) != -1) {
              //是加班的工作日，允许点击
              canClick = true;
            } else {
              //如果不是加班的工作日，再判断是否是节假日
              if (this.indexOf(formatDateStr, this.data.holiDays) != -1) {
                //如果是节假日，不能点击
                canClick = false;
              } else {
                //再判断日常的工作日和周末
                const num = firstDate.getDay();
                if (num == 0 || num == 6) {
                  //是周末,不能点击
                  canClick = false;
                } else {
                  //是工作日，允许点击
                  canClick = true;
                }
              }
            }
          }

          //判断是上月，本月，下月日期
          let accord;
          if (firstDate.getMonth() == month) {
            //是这个月
            accord = true;
          } else {
            accord = false;
          }

          if (!this.data.calendar.beforeDayCanClick && this.data.nowDate.getTime() > firstDate.getTime()) {
            //如果不允许点击之前的日期
            canClick = false;
          } else if (!this.data.calendar.afterDayCanClick && this.data.nowDate.getTime() < firstDate.getTime()) {
            //如果不允许点击之后的日期
            canClick = false;
          }

          calendarDataRow.push({
            index: index,
            formatDay: formatDay,
            formatDateStr: formatDateStr,
            selected: hasIndex != -1 ? true : false,
            canClick: canClick,
            accord: accord
          })

          firstDate.setDate(firstDate.getDate() + 1);
          index++;
        }
        calendarData.push({
          index: i,
          calendarDataRow: calendarDataRow
        })
      }

      this.setData({
        calendarData: calendarData
      })
    },
    _changeSelectDates(e) {

      const canclick = e.target.dataset.canclick;

      if (!canclick) {
        return;
      }

      const dateindex = e.target.dataset.dateindex;
      const weekindex = e.target.dataset.weekindex;
      const selectdate = e.target.dataset.selectdate;
      let selectDates = this.data.calendar.selectDates;
      let calendarData = this.data.calendarData;
      let selected = calendarData[weekindex].calendarDataRow[dateindex].selected ? false : true;
      calendarData[weekindex].calendarDataRow[dateindex].selected = selected;

      //判断数组里有没有这个值了
      const index = this.indexOf(selectdate, selectDates);
      if (index == -1 && selected) {
        //如果没有且是选择就加到数组里面
        selectDates.push(selectdate)
      }

      if (index != -1 && !selected) {
        //如果已经有了且是取消状态就删除掉该元素
        selectDates.splice(index, 1);
      }

      this.setData({
        calendarData: calendarData,
        ['calendar.selectDates']: selectDates
      })

      //判断是否是当月。如果不是，跳转到对应月份
      let clickMonth = new Date(selectdate).getMonth();
      if (!(clickMonth == this.data.month)) {
        //如果不是当月
        this.setData({
          month: clickMonth
        })

        this._getDatesOfMonth();
      }

    },
    _subtractYear() {
      this.setData({
        year: --this.data.year
      })
      this._getDatesOfMonth();
    },
    _addYear() {
      this.setData({
        year: ++this.data.year
      })
      this._getDatesOfMonth();
    },
    _subtractMonth() {
      let month = --this.data.month;
      let year = this.data.year;
      if (month < 0) {
        month = 11;
        year--;
      }
      this.setData({
        month: month,
        year: year
      })
      this._getDatesOfMonth();
    },
    _addMonth() {
      let month = ++this.data.month;
      let year = this.data.year;
      if (month > 11) {
        month = 0;
        year++;
      }
      this.setData({
        month: month,
        year: year
      })
      this._getDatesOfMonth();
    },
    indexOf(val, array) {
      for (var i = 0; i < array.length; i++) {
        if (array[i] == val) return i;
      }
      return -1;
    },
    submitDates() {
      var animation = wx.createAnimation({
        duration: 300,
        timingFunction: 'linear',
      })

      this.animation = animation;

      animation.translateY(400).step();

      this.setData({
        animationData: animation.export()
      })

      setTimeout(() => {
        var selectDates = this.data.calendar.selectDates // detail对象，提供给事件监听函数
        this.triggerEvent('submitDates', selectDates)
      }, 300)

    },
    hideCalendarSelect() {
      var animation = wx.createAnimation({
        duration: 300,
        timingFunction: 'linear',
      })

      this.animation = animation;

      animation.translateY(400).step();

      this.setData({
        animationData: animation.export()
      })

      setTimeout(() => {
        this.triggerEvent('hideCalendarSelect')
      }, 300)
    }
  },
  ready: function () {
    var animation = wx.createAnimation({
      duration: 300,
      timingFunction: 'linear',
    })

    this.animation = animation;

    animation.translateY(0).step();

    this.setData({
      animationData: animation.export()
    })
  }
})
