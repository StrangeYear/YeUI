# YeUI
存放自己开发小程序时做的一些组件

## 日历组件

<img src="https://github.com/monian1916/wordpress-theme-Yilia/blob/master/screenshot.png?raw=true"/> 

wxml页面：
```
<calendar wx:if='{{showCalendar}}' id="calendar" calendar='{{calendar}}' bind:submitDates='getSelectDates' bind:hideCalendarSelect='hideCalendarSelect'>
</calendar>
```

json页面：
```
{
  "navigationBarTitleText": "日历组件",
  "backgroundTextStyle": "dark",
  "usingComponents": {
    "calendar": "/component/Calendar/index"
  }
}
```

js页面：
data数据：
```
  data: {
    calendar: {
      dayStartFromSunday: true,//周末开始，false的话周一开始
      beforeDayCanClick: false,//之前的日期是否可选
      afterDayCanClick: true,//之后的日期是否可选
      onlyWorkDays: true,//是否只允许工作日
      selectDates: ['2018-04-25']//初始值
    },
    showCalendar: false
  }
```  

methods:
```
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
  }
```

## CellForm组件

wxml:

```
<cell-form title='测试CellForm' list='{{list}}'></cell-form>
```

js:
```
  data: {
    list: [
      { key: '今日天气：', value: '晴天' },
      { key: '明日天气：', value: '雨天' },
      { key: '五一天气:', value: '一个很悲催的假期，竟然下三天雨啊啊啊啊啊啊啊啊啊啊啊啊啊啊' }
    ]
  }
```
