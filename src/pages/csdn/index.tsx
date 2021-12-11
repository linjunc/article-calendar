import React from 'react';
import CalendarHeatmap from 'react-calendar-heatmap';
import ReactTooltip from 'react-tooltip';
import 'react-calendar-heatmap/dist/styles.css';
import './styles.css'
import data from '../../assets/article-csdn.json'
import dayjs from 'dayjs';


interface ShowList {
    date: string,
    count: number,
    title: any
}

const Csdn: React.FC = () => {
    const today = new Date();
    const allArticle = data

    // 处理时间
    allArticle.map(item => item.postTime = item.postTime.slice(0, 10))
    // 处理日期和发文数量
    const articleMap = new Map()
    // 建立日期和数量映射
    allArticle.forEach(item => {
        // 有这一天就+1，没有就是 1 
        articleMap.has(item.postTime) ? articleMap.set(item.postTime, articleMap.get(item.postTime) + 1) : articleMap.set(item.postTime, 1)
    })

    // 建立渲染数据格式 {date: ,count: , title: [{}, {}]}
    let showData = [] as ShowList[]
    for (let [k, v] of articleMap) {
        const titleList = allArticle.filter(item => item.postTime === k)
        showData = [...showData, { date: k, count: v, title: titleList }]
    }


    const randomValues = getRange(365).map(index => {
        const tempDate = shiftDate(today, -index)
        const current = showData.find(item => item.date === tempDate)
        return {
            date: tempDate,
            count: current?.count ?? 0,
            title: current?.title ?? ''
        };
    });

    function shiftDate(date, numDays) {
        const newDate = new Date(date);
        newDate.setDate(newDate.getDate() + numDays);
        return dayjs(newDate).format('YYYY-MM-DD');
    }

    function getRange(count) {
        return Array.from({ length: count }, (_, i) => i);
    }

    return (
        <div style={{ width: "1400px", height: "400px" }}>
            <h2 style={{ marginBottom: "40px", textAlign: "center" }}> 2021 CSDN 发文记录</h2>
            <h4 style={{ marginBottom: "40px", textAlign: "center" }}>总共发文 {allArticle.length} 篇 </h4>
            <CalendarHeatmap
                startDate={new Date('2021-01-01')}
                endDate={new Date('2021-12-31')}
                values={randomValues}
                classForValue={value => {
                    if (!value) {
                        return 'color-empty';
                    }
                    // 大于4篇显示4篇的颜色
                    return `color-gitlab-${value.count > 4 ? 4 : value.count}`;
                }}
                tooltipDataAttrs={(value) => {
                    console.log(value.title);

                    // 这个回调的参数其实就是对应天数的value值，包含date和count属性
                    return {
                        'data-tip': `${value.date} 发了 ${value.count ?? 0} 篇文章 ${value.title && value.title[0].title}`,
                        rx: 2,
                    }
                }}
                showWeekdayLabels={true}
            />
            <ReactTooltip />
        </div>
    );
};

export default Csdn;